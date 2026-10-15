import { Redis } from 'ioredis';
import { Queue } from 'bullmq';
import { MeiliSearch } from 'meilisearch';
import { getEnv } from '@kentrehber/config';
import { getDb } from '@kentrehber/db';

export const QUEUE_NAME = 'maintenance';
export const HEARTBEAT_KEY = 'kentrehber:worker:heartbeat';
export function createRedis(worker = false) {
  return new Redis(getEnv().REDIS_URL, {
    maxRetriesPerRequest: worker ? null : 1,
    connectTimeout: 3000,
    commandTimeout: worker ? undefined : 3000,
    lazyConnect: true,
    enableOfflineQueue: worker,
    retryStrategy: worker ? (times) => Math.min(times * 250, 5000) : () => null,
  });
}
let redis: Redis | undefined;
let connecting: Promise<void> | undefined;
export function getRedis() {
  if (!redis) {
    redis = createRedis();
    redis.on('error', () => {
      /* Callers surface bounded failures; never log connection URLs. */
    });
  }
  return redis;
}
export async function readyRedis() {
  const connection = getRedis();
  if (!connecting && (connection.status === 'wait' || connection.status === 'end')) {
    connecting = connection.connect().finally(() => {
      connecting = undefined;
    });
  }
  if (connecting) await connecting;
  return connection;
}
export function getSearch() {
  const env = getEnv();
  return new MeiliSearch({ host: env.MEILI_URL, apiKey: env.MEILI_MASTER_KEY, timeout: 3000 });
}
export function createQueue(connection: Redis) {
  return new Queue(QUEUE_NAME, {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 100,
      removeOnFail: 100,
    },
  });
}
export function withTimeout<T>(promise: Promise<T>, ms = 3500): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('Dependency timeout')), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}
export async function coreReadiness() {
  const results = await Promise.allSettled([
    withTimeout(getDb().$queryRaw`SELECT 1`),
    withTimeout(
      (async () => {
        const r = await readyRedis();
        if ((await r.ping()) !== 'PONG') throw new Error('Redis unavailable');
      })(),
    ),
    withTimeout(
      (async () => {
        await getSearch().getStats();
      })(),
    ),
    withTimeout(
      (async () => {
        const r = await readyRedis();
        const stamp = Number(await r.get(HEARTBEAT_KEY));
        if (!stamp || Date.now() - stamp > 90000) throw new Error('Worker stale');
      })(),
    ),
  ]);
  const names = ['database', 'redis', 'search', 'worker'] as const;
  return Object.fromEntries(results.map((r, i) => [names[i], r.status === 'fulfilled']));
}
