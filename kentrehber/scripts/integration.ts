import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { QueueEvents } from 'bullmq';
import { hashPassword } from 'better-auth/crypto';
import { getDb } from '@kentrehber/db';
import { getEnv } from '@kentrehber/config';
import { createRedis, createQueue, getSearch } from '@kentrehber/services';
const env = getEnv(),
  db = getDb(),
  redis = createRedis(true),
  id = randomUUID();
redis.on('error', () => {});
const queue = createQueue(redis),
  events = new QueueEvents('maintenance', { connection: redis });
const prefix = `integration-${id}`;
try {
  if (redis.status === 'wait') await redis.connect();
  await events.waitUntilReady();
  assert.equal(await redis.ping(), 'PONG');
  assert.equal((await getSearch().health()).status, 'available');
  const data = {
    slug: prefix,
    name: 'Test işletmesi',
    allowedCategories: ['category-one'],
    requiredFields: [],
  };
  await assert.rejects(db.vertical.create({ data: { ...data, enabled: true } }));
  const vertical = await db.vertical.create({ data: { ...data, isAdult: true } });
  assert.equal(vertical.isAdult, true);
  await assert.rejects(
    db.category.create({ data: { verticalId: vertical.id, slug: 'unconfigured', name: 'Test' } }),
  );
  await db.category.create({
    data: { verticalId: vertical.id, slug: 'category-one', name: 'Test' },
  });
  await assert.rejects(
    db.vertical.update({
      where: { id: vertical.id },
      data: { allowedCategories: ['category-two'] },
    }),
  );
  await db.vertical.update({
    where: { id: vertical.id },
    data: { enabled: true, policyReviewedAt: new Date(), policyReviewedBy: 'integration' },
  });
  const changed = await db.vertical.update({
    where: { id: vertical.id },
    data: { name: 'Yeni işletme' },
  });
  assert.equal(changed.enabled, false);
  assert.equal(changed.policyReviewedAt, null);
  const password = 'integration passphrase 482!';
  const user = await db.user.create({
    data: {
      id,
      name: 'Integration',
      email: `${id}@example.invalid`,
      accounts: {
        create: {
          id: randomUUID(),
          accountId: id,
          providerId: 'credential',
          password: await hashPassword(password),
        },
      },
    },
  });
  await db.session.create({
    data: { id: `expired-${id}`, token: randomUUID(), userId: id, expiresAt: new Date(0) },
  });
  const job = await queue.add('session-cleanup', {});
  await job.waitUntilFinished(events, 20000);
  assert.equal(await db.session.findUnique({ where: { id: `expired-${id}` } }), null);
  const base = process.env.TEST_APP_URL ?? 'http://localhost:3000';
  const headers = { origin: new URL(env.APP_URL).origin, 'content-type': 'application/json' };
  const login = () =>
    fetch(`${base}/api/auth/sign-in/email`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email: user.email, password }),
    });
  const loggedIn = await login();
  assert.equal(loggedIn.status, 200);
  const cookie = loggedIn.headers
    .getSetCookie()
    .map((v) => v.split(';')[0])
    .join('; ');
  assert.ok(cookie);
  const panel = await fetch(`${base}/admin`, { headers: { cookie } });
  assert.equal(panel.status, 200);
  assert.match(await panel.text(), /Hoş geldiniz/);
  await db.user.update({ where: { id }, data: { disabled: true } });
  assert.equal(
    (await fetch(`${base}/admin`, { redirect: 'manual', headers: { cookie } })).status,
    307,
  );
  await db.user.update({ where: { id }, data: { disabled: false } });
  const logout = await fetch(`${base}/admin/logout`, {
    method: 'POST',
    redirect: 'manual',
    headers: { cookie, origin: new URL(env.APP_URL).origin },
  });
  assert.equal(logout.status, 303);
  assert.equal(
    (await fetch(`${base}/admin`, { redirect: 'manual', headers: { cookie } })).status,
    307,
  );
  for (let i = 1; i < 5; i++) assert.equal((await login()).status, 200);
  assert.equal((await login()).status, 429);
  const ready = await fetch(`${base}/api/health/ready`, {
    headers: { authorization: `Bearer ${env.HEALTH_TOKEN}` },
  });
  assert.equal(ready.status, 200);
  console.info(
    'Integration passed: config integrity, Redis, Meilisearch, worker cleanup, Better Auth, disabled account, 5/15min/IP limit, readiness.',
  );
} finally {
  await db.category.deleteMany({ where: { vertical: { slug: prefix } } });
  await db.vertical.deleteMany({ where: { slug: prefix } });
  await db.user.deleteMany({ where: { id } });
  await events.close();
  await queue.close();
  redis.disconnect();
  await db.$disconnect();
}
