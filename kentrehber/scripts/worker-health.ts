import { createRedis, HEARTBEAT_KEY } from '@kentrehber/services';
const redis = createRedis();
redis.on('error', () => {});
try {
  await redis.connect();
  const timestamp = Number(await redis.get(HEARTBEAT_KEY));
  if (!timestamp || Date.now() - timestamp > 90000) process.exitCode = 1;
} catch {
  process.exitCode = 1;
} finally {
  redis.disconnect();
}
