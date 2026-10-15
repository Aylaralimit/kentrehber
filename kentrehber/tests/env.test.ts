import { describe, it, expect } from 'vitest';
import { parseEnv } from '../packages/config/src/index';
const base = {
  DATABASE_URL: 'postgresql://user:password@localhost:5432/db',
  REDIS_URL: 'redis://localhost:6379',
  MEILI_URL: 'http://localhost:7700',
  MEILI_MASTER_KEY: 'a'.repeat(32),
  HEALTH_TOKEN: 'b'.repeat(32),
  BETTER_AUTH_SECRET: 'c'.repeat(32),
};
describe('environment validation', () => {
  it('explicitly disables unconfigured cloud media', () =>
    expect(parseEnv(base).MEDIA_ENABLED).toBe(false));
  it('requires production HTTPS', () =>
    expect(() => parseEnv({ ...base, NODE_ENV: 'production' })).toThrow('HTTPS'));
  it('rejects origin paths', () =>
    expect(() => parseEnv({ ...base, APP_URL: 'https://example.com/path' })).toThrow());
  it('requires all cloud credentials when enabled', () =>
    expect(() => parseEnv({ ...base, MEDIA_ENABLED: 'true' })).toThrow('R2_ACCOUNT_ID'));
  it('rejects non-boolean switches', () =>
    expect(() => parseEnv({ ...base, MEDIA_ENABLED: 'yes' })).toThrow());
  it('does not echo invalid secret values', () => {
    try {
      parseEnv({ ...base, HEALTH_TOKEN: 'sensitive' });
    } catch (error) {
      expect(String(error)).not.toContain('sensitive');
    }
  });
});
