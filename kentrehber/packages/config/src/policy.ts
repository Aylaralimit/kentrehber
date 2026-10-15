import { z } from 'zod';

export const fieldSchema = z
  .object({
    key: z
      .string()
      .regex(/^[a-z][a-z0-9_]{0,39}$/)
      .refine((v) => !['constructor', 'prototype', '__proto__'].includes(v)),
    label: z.string().trim().min(1).max(80),
    type: z.enum(['text', 'number', 'boolean']),
    required: z.boolean(),
  })
  .strict();
export const verticalSchema = z
  .object({
    slug: z.string().regex(/^[a-z][a-z0-9-]{1,63}$/),
    name: z.string().trim().min(2).max(80),
    isAdult: z.boolean(),
    allowedCategories: z
      .array(z.string().regex(/^[a-z][a-z0-9-]{1,63}$/))
      .min(1)
      .max(50),
    requiredFields: z.array(fieldSchema).max(30),
    moderationLevel: z.enum(['standard', 'strict', 'paranoid']),
    paymentRequired: z.boolean(),
    defaultTier: z.enum(['free', 'basic', 'pro', 'elite']),
  })
  .strict()
  .superRefine((v, ctx) => {
    if (new Set(v.requiredFields.map((f) => f.key)).size !== v.requiredFields.length)
      ctx.addIssue({ code: 'custom', path: ['requiredFields'], message: 'Duplicate field key' });
    if (new Set(v.allowedCategories).size !== v.allowedCategories.length)
      ctx.addIssue({ code: 'custom', path: ['allowedCategories'], message: 'Duplicate category' });
  });
export type VerticalConfig = z.infer<typeof verticalSchema>;
export function validateFields(config: VerticalConfig, input: unknown) {
  const fields: Record<string, z.ZodTypeAny> = Object.create(null) as Record<string, z.ZodTypeAny>;
  for (const field of config.requiredFields) {
    const value =
      field.type === 'text'
        ? z.string().trim().min(1).max(2000)
        : field.type === 'number'
          ? z.number().finite()
          : z.boolean();
    fields[field.key] = field.required ? value : value.optional();
  }
  return z.object(fields).strict().parse(input);
}
export const moderationRequirements = {
  standard: { humanReviews: 1, identityRequired: true, evidenceRequired: false },
  strict: { humanReviews: 2, identityRequired: true, evidenceRequired: true },
  paranoid: { humanReviews: 3, identityRequired: true, evidenceRequired: true },
} as const;
