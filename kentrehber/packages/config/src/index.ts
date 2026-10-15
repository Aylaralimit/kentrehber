import { z } from 'zod';

const blankOptional = (schema: z.ZodTypeAny) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema.optional());
const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    APP_URL: z.string().url().default('http://localhost:3000'),
    DATABASE_URL: z
      .string()
      .url()
      .refine((v) => /^postgres(ql)?:/.test(v), 'PostgreSQL URL required'),
    REDIS_URL: z
      .string()
      .url()
      .refine((v) => /^rediss?:/.test(v), 'Redis URL required'),
    MEILI_URL: z.string().url(),
    MEILI_MASTER_KEY: z.string().min(32),
    DEPLOY_VERTICAL: z
      .string()
      .regex(/^[a-z][a-z0-9-]{1,63}$/)
      .default('restoran'),
    HEALTH_TOKEN: z.string().min(32),
    BETTER_AUTH_SECRET: z.string().min(32),
    TRUST_PROXY: z
      .enum(['true', 'false'])
      .default('false')
      .transform((v) => v === 'true'),
    MEDIA_ENABLED: z
      .enum(['true', 'false'])
      .default('false')
      .transform((v) => v === 'true'),
    CF_IMAGES_UPLOAD_ENABLED: z
      .enum(['true', 'false'])
      .default('false')
      .transform((v) => v === 'true'),
    R2_ACCOUNT_ID: blankOptional(z.string().regex(/^[a-f0-9]{32}$/)),
    R2_ACCESS_KEY_ID: blankOptional(z.string().min(16)),
    R2_SECRET_ACCESS_KEY: blankOptional(z.string().min(32)),
    R2_BUCKET: blankOptional(z.string().regex(/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/)),
    CF_IMAGES_ACCOUNT_ID: blankOptional(z.string().regex(/^[a-f0-9]{32}$/)),
    CF_IMAGES_API_TOKEN: blankOptional(z.string().min(20)),
    CF_IMAGES_ACCOUNT_HASH: blankOptional(z.string().regex(/^[a-zA-Z0-9_-]+$/)),
  })
  .superRefine((env, ctx) => {
    const url = new URL(env.APP_URL);
    if (url.pathname !== '/' || url.search || url.hash || url.username || url.password)
      ctx.addIssue({
        code: 'custom',
        path: ['APP_URL'],
        message: 'Origin only, without path or credentials',
      });
    if (env.NODE_ENV === 'production' && url.protocol !== 'https:')
      ctx.addIssue({ code: 'custom', path: ['APP_URL'], message: 'HTTPS required in production' });
    if (env.CF_IMAGES_UPLOAD_ENABLED)
      for (const key of [
        'CF_IMAGES_ACCOUNT_ID',
        'CF_IMAGES_API_TOKEN',
        'CF_IMAGES_ACCOUNT_HASH',
      ] as const) {
        if (!env[key])
          ctx.addIssue({ code: 'custom', path: [key], message: 'Required for Cloudflare Images uploads' });
      }
    if (env.MEDIA_ENABLED)
      for (const key of [
        'R2_ACCOUNT_ID',
        'R2_ACCESS_KEY_ID',
        'R2_SECRET_ACCESS_KEY',
        'R2_BUCKET',
        'CF_IMAGES_ACCOUNT_ID',
        'CF_IMAGES_API_TOKEN',
        'CF_IMAGES_ACCOUNT_HASH',
      ] as const) {
        if (!env[key])
          ctx.addIssue({ code: 'custom', path: [key], message: 'Required when media is enabled' });
      }
  });
export type Environment = z.infer<typeof schema>;
export function parseEnv(input: Record<string, string | undefined>): Environment {
  const parsed = schema.safeParse(input);
  if (!parsed.success)
    throw new Error(
      `Invalid environment: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`,
    );
  return parsed.data;
}
export const getEnv = () => parseEnv(process.env);
