import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
const pg = randomBytes(24).toString('hex'),
  redis = randomBytes(24).toString('hex');
const template = await readFile(new URL('../.env.example', import.meta.url), 'utf8');
const values = {
  POSTGRES_PASSWORD: pg,
  REDIS_PASSWORD: redis,
  DATABASE_URL: `postgresql://kentrehber:${pg}@127.0.0.1:5432/kentrehber?schema=public&connection_limit=5&connect_timeout=3&pool_timeout=3`,
  REDIS_URL: `redis://:${redis}@127.0.0.1:6379`,
  MEILI_MASTER_KEY: randomBytes(32).toString('hex'),
  HEALTH_TOKEN: randomBytes(32).toString('hex'),
  BETTER_AUTH_SECRET: randomBytes(32).toString('hex'),
};
const content = template.replace(/^(\w+)=(.*)$/gm, (line, key) =>
  key in values ? `${key}=${values[key]}` : line,
);
await writeFile(new URL('../.env', import.meta.url), content, { flag: 'wx', mode: 0o600 });
console.info('Local .env created with random credentials. Existing files are never overwritten.');
