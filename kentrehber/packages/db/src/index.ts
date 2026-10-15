import { PrismaClient } from '../generated/client/index.js';
import { getEnv } from '@kentrehber/config';
const globalDb = globalThis as unknown as { kentrehberDb?: PrismaClient };
export function getDb(): PrismaClient {
  if (!globalDb.kentrehberDb)
    globalDb.kentrehberDb = new PrismaClient({
      datasources: { db: { url: getEnv().DATABASE_URL } },
      log: ['error'],
    });
  return globalDb.kentrehberDb;
}
export { Prisma, Tier, ModerationLevel } from '../generated/client/index.js';
