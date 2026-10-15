import { timingSafeEqual } from 'node:crypto';
export function sameOrigin(origin: string | null, expected: string) {
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(expected).origin && origin === new URL(origin).origin;
  } catch {
    return false;
  }
}
export function bearerMatches(header: string | null, token: string) {
  const expected = Buffer.from(`Bearer ${token}`),
    actual = Buffer.from(header ?? '');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
