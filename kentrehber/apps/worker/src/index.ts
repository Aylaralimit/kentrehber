import { Worker } from 'bullmq';
import { getDb } from '@kentrehber/db';
import { createRedis, createQueue, QUEUE_NAME, HEARTBEAT_KEY } from '@kentrehber/services';

const connection = createRedis(true);
connection.on('error', () => console.error('Worker Redis connection unavailable'));
await connection.connect();
const queue = createQueue(connection);
const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name !== 'session-cleanup') throw new Error('Unsupported maintenance job');
    const result = await getDb().session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    return { deleted: result.count };
  },
  { connection, concurrency: 1 },
);
worker.on('failed', (job) => console.error(JSON.stringify({ event: 'job_failed', id: job?.id })));
worker.on('error', () => console.error('Worker processing error'));
await worker.waitUntilReady();
await queue.upsertJobScheduler(
  'session-cleanup-hourly',
  { every: 3600000 },
  { name: 'session-cleanup', data: {} },
);
async function heartbeat() {
  await connection.set(HEARTBEAT_KEY, String(Date.now()), 'EX', 90);
}
await heartbeat();
const timer = setInterval(
  () => void heartbeat().catch(() => console.error('Heartbeat unavailable')),
  30000,
);
let closing = false;
async function shutdown() {
  if (closing) return;
  closing = true;
  clearInterval(timer);
  await worker.close();
  await queue.close();
  await connection.quit();
  await getDb().$disconnect();
}
process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());
console.info('KentRehber bakım işçisi hazır');
