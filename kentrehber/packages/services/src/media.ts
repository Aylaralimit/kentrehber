import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { getEnv } from '@kentrehber/config';

export function getMediaClients() {
  const env = getEnv();
  if (!env.MEDIA_ENABLED) throw new Error('Media is disabled');
  return {
    r2: new S3Client({
      region: 'auto',
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID!,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
      },
      maxAttempts: 2,
    }),
    bucket: env.R2_BUCKET!,
    imagesUrl: `https://api.cloudflare.com/client/v4/accounts/${env.CF_IMAGES_ACCOUNT_ID}/images/v1`,
    imagesToken: env.CF_IMAGES_API_TOKEN!,
  };
}
export async function mediaReadiness() {
  if (!getEnv().MEDIA_ENABLED) return { enabled: false, r2: null, images: null };
  const client = getMediaClients();
  try {
    const results = await Promise.allSettled([
      client.r2.send(new HeadBucketCommand({ Bucket: client.bucket }), {
        abortSignal: AbortSignal.timeout(5000),
      }),
      (async () => {
        const r = await fetch(`${client.imagesUrl}?per_page=1`, {
          headers: { Authorization: `Bearer ${client.imagesToken}` },
          signal: AbortSignal.timeout(5000),
          cache: 'no-store',
        });
        const body = (await r.json()) as { success?: boolean };
        if (!r.ok || body.success !== true) throw new Error('Cloudflare Images unavailable');
      })(),
    ]);
    return {
      enabled: true,
      r2: results[0]!.status === 'fulfilled',
      images: results[1]!.status === 'fulfilled',
    };
  } finally {
    client.r2.destroy();
  }
}
