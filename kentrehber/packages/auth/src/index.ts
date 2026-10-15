import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { redisStorage } from '@better-auth/redis-storage';
import { APIError } from 'better-auth/api';
import { getDb } from '@kentrehber/db';
import { getEnv } from '@kentrehber/config';
import { getRedis } from '@kentrehber/services';

function createAuth() {
  const env = getEnv();
  return betterAuth({
    appName: 'KentRehber',
    baseURL: env.APP_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: prismaAdapter(getDb(), { provider: 'postgresql' }),
    secondaryStorage: redisStorage({ client: getRedis(), keyPrefix: 'kentrehber:auth:' }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 14,
      maxPasswordLength: 128,
    },
    trustedOrigins: [new URL(env.APP_URL).origin],
    session: {
      storeSessionInDatabase: true,
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: false },
    },
    user: {
      additionalFields: { disabled: { type: 'boolean', defaultValue: false, input: false } },
    },
    advanced: {
      useSecureCookies: env.NODE_ENV === 'production',
      ipAddress: { ipAddressHeaders: ['x-kentrehber-client-ip'] },
      defaultCookieAttributes: { httpOnly: true, sameSite: 'lax' },
    },
    rateLimit: {
      enabled: true,
      storage: 'secondary-storage',
      window: 900,
      max: 5,
      customRules: {
        '/sign-in/email': { window: 900, max: 5 },
        '/get-session': false,
        '/sign-out': false,
      },
    },
    databaseHooks: {
      session: {
        create: {
          before: async (session) => {
            const user = await getDb().user.findUnique({
              where: { id: session.userId },
              select: { disabled: true },
            });
            if (!user || user.disabled)
              throw new APIError('FORBIDDEN', { message: 'Account unavailable' });
            return { data: session };
          },
        },
      },
    },
  });
}
let instance: ReturnType<typeof createAuth> | undefined;
export function getAuth() {
  return (instance ??= createAuth());
}
