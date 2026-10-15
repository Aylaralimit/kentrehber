import { randomUUID } from 'node:crypto';
import { getDb } from '@kentrehber/db';
import { hashPassword } from 'better-auth/crypto';
const email = process.env.OPERATOR_EMAIL?.trim().toLowerCase();
const password = process.env.OPERATOR_PASSWORD;
if (
  !email ||
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
  !password ||
  password.length < 14 ||
  password.length > 128
)
  throw new Error(
    'Set OPERATOR_EMAIL and OPERATOR_PASSWORD (14–128 characters) in the environment',
  );
const db = getDb();
try {
  const id = randomUUID();
  await db.user.create({
    data: {
      id,
      name: 'Operatör',
      email,
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
  console.info('Panel operatörü oluşturuldu.');
} finally {
  await db.$disconnect();
}
