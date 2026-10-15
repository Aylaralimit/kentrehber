import { describe, it, expect } from 'vitest';
import {
  verticalSchema,
  validateFields,
  moderationRequirements,
} from '../packages/config/src/policy';
const valid = {
  slug: 'restoran',
  name: 'Restoranlar',
  isAdult: false,
  allowedCategories: ['kafe'],
  requiredFields: [{ key: 'mutfak', label: 'Mutfak', type: 'text', required: true }],
  moderationLevel: 'strict',
  paymentRequired: false,
  defaultTier: 'free',
};
describe('data-driven configuration', () => {
  it('accepts data-driven business configuration', () =>
    expect(verticalSchema.parse(valid).slug).toBe('restoran'));
  it('preserves either value of isAdult without category-specific rules', () => {
    for (const isAdult of [true, false])
      expect(verticalSchema.parse({ ...valid, isAdult }).isAdult).toBe(isAdult);
  });
  it.each([
    { slug: 'Invalid Slug' },
    { isAdult: 'false' },
    { allowedCategories: [] },
    { moderationLevel: 'unknown' },
    { unknown: true },
  ])('rejects malformed config %j', (patch) =>
    expect(verticalSchema.safeParse({ ...valid, ...patch }).success).toBe(false),
  );
  it('rejects duplicated field names', () =>
    expect(
      verticalSchema.safeParse({
        ...valid,
        requiredFields: [...valid.requiredFields, ...valid.requiredFields],
      }).success,
    ).toBe(false));
  it('rejects dangerous object keys', () =>
    expect(
      verticalSchema.safeParse({
        ...valid,
        requiredFields: [{ ...valid.requiredFields[0], key: 'constructor' }],
      }).success,
    ).toBe(false));
  it('enforces configured types, required fields and unknown field rejection', () => {
    const config = verticalSchema.parse(valid);
    expect(validateFields(config, { mutfak: 'Türk mutfağı' })).toEqual({ mutfak: 'Türk mutfağı' });
    for (const data of [{}, { mutfak: 1 }, { mutfak: ' ' }, { mutfak: 'Türk', extra: true }])
      expect(() => validateFields(config, data)).toThrow();
  });
  it('never allows automatic publication', () => {
    for (const rules of Object.values(moderationRequirements)) {
      expect(rules.humanReviews).toBeGreaterThan(0);
      expect(rules.identityRequired).toBe(true);
    }
  });
});
