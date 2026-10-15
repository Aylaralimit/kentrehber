import assert from 'node:assert/strict';
const base = process.env.TEST_APP_URL ?? 'http://localhost:3000';
const home = await fetch(base);
assert.equal(home.status, 200);
const html = await home.text();
assert.match(html, /<html lang="tr"/);
assert.match(html, /Şehrinle/);
assert.match(home.headers.get('content-security-policy') ?? '', /nonce-/);
assert.equal(home.headers.get('x-content-type-options'), 'nosniff');
assert.equal(home.headers.get('x-frame-options'), 'DENY');
assert.match(home.headers.get('cache-control') ?? '', /no-store/);
assert.ok(!home.headers.has('x-powered-by'));
assert.match(html, /noindex/);
const panel = await fetch(`${base}/admin`, { redirect: 'manual' });
assert.equal(panel.status, 307);
assert.equal(panel.headers.get('location'), '/admin/login');
assert.equal((await fetch(`${base}/admin/login`)).status, 200);
assert.equal((await fetch(`${base}/ilkeler`)).status, 200);
assert.deepEqual(await (await fetch(`${base}/api/health/live`)).json(), { status: 'ok' });
assert.equal((await fetch(`${base}/api/health/ready`)).status, 401);
const readiness = await fetch(`${base}/api/health/ready`, {
  headers: { authorization: `Bearer ${process.env.HEALTH_TOKEN}` },
});
assert.ok([200, 503].includes(readiness.status));
const dependencyStatus = (await readiness.json()) as Record<string, unknown>;
for (const dependency of ['database', 'redis', 'search', 'worker'])
  assert.equal(typeof dependencyStatus[dependency], 'boolean');
assert.equal(
  (
    await fetch(`${base}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: { origin: 'https://foreign.invalid' },
    })
  ).status,
  403,
);
assert.equal((await fetch(`${base}/admin/logout`, { method: 'POST' })).status, 403);
for (const path of ['/bir/iki/uc/dort', '/api/search', '/api/listings'])
  assert.equal((await fetch(base + path)).status, 404, path);
for (const path of ['/istanbul', '/istanbul/kadikoy', '/listing/onizleme', '/ara'])
  assert.equal((await fetch(base + path)).status, 200, path);
assert.equal((await fetch(`${base}/18`, { redirect: 'manual' })).status, 307);
assert.match(html, /--theme-bg:/);
assert.match(await (await fetch(`${base}/robots.txt`)).text(), /Disallow: \//);
console.info(
  'HTTP smoke passed: Turkish UI, headers, panel gate, CSRF, health authorization, robots and absent discovery routes.',
);
