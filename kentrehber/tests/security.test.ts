import { describe, it, expect } from 'vitest';
import { sameOrigin, bearerMatches } from '../packages/auth/src/security';
describe('session security primitives', () => {
  it.each([
    null,
    'null',
    'https://evil.test',
    'https://example.com.evil.test',
    'https://example.com:444',
    'http://example.com',
    'https://example.com/path',
  ])('rejects foreign/malformed origin %s', (origin) =>
    expect(sameOrigin(origin, 'https://example.com')).toBe(false),
  );
  it('accepts exactly the configured origin', () =>
    expect(sameOrigin('https://example.com', 'https://example.com')).toBe(true));
  it('requires exact bearer value', () => {
    expect(bearerMatches('Bearer secret', 'secret')).toBe(true);
    expect(bearerMatches(null, 'secret')).toBe(false);
    expect(bearerMatches('Bearer secrex', 'secret')).toBe(false);
  });
});
