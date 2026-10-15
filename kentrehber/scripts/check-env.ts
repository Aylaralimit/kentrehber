import { getEnv } from '@kentrehber/config';
const env = getEnv();
console.info(
  JSON.stringify({
    valid: true,
    mode: env.NODE_ENV,
    mediaEnabled: env.MEDIA_ENABLED,
    vertical: env.DEPLOY_VERTICAL,
  }),
);
