import { z } from 'zod';

const color = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Altı haneli renk değeri gerekli');
const font = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[\p{L}\p{N} -]+$/u);
export const themeSchema = z
  .object({
    colors: z
      .object({
        bg: color,
        surface: color,
        elevated: color,
        border: color,
        text: color,
        muted: color,
        accent: color,
        accentAlt: color,
      })
      .strict(),
    fonts: z.object({ display: font, body: font }).strict(),
    radius: z.enum(['sm', 'md', 'lg']),
    cardDensity: z.enum(['tight', 'normal', 'loose']),
    heroStyle: z.enum(['plain', 'overlay', 'gradient']),
    ctaLabel: z.string().trim().min(1).max(48),
    ageGateEnabled: z.boolean(),
    showPrice: z.boolean(),
    visibleFields: z
      .array(
        z
          .string()
          .regex(/^[a-z][a-z0-9_]{0,63}$/)
          .refine((key) => !['constructor', 'prototype', '__proto__'].includes(key)),
      )
      .max(40),
  })
  .strict()
  .refine((theme) => new Set(theme.visibleFields).size === theme.visibleFields.length, {
    path: ['visibleFields'],
    message: 'Alan anahtarları benzersiz olmalı',
  });

export type Theme = z.infer<typeof themeSchema>;
// Fallback colors resolve from the single default palette in globals.css.
export const defaultTheme: Theme = {
  colors: {
    bg: 'var(--theme-default-bg)',
    surface: 'var(--theme-default-surface)',
    elevated: 'var(--theme-default-elevated)',
    border: 'var(--theme-default-border)',
    text: 'var(--theme-default-text)',
    muted: 'var(--theme-default-muted)',
    accent: 'var(--theme-default-accent)',
    accentAlt: 'var(--theme-default-accent-alt)',
  },
  fonts: { display: 'Georgia', body: 'Arial' },
  radius: 'lg',
  cardDensity: 'normal',
  heroStyle: 'plain',
  ctaLabel: 'İletişim',
  ageGateEnabled: false,
  showPrice: false,
  visibleFields: [],
};
export function normalizeTheme(value: unknown): Theme {
  const result = themeSchema.safeParse(value);
  return result.success ? result.data : structuredClone(defaultTheme);
}
export function themeVariables(theme: Theme): Record<`--theme-${string}`, string> {
  const radii = { sm: '0.375rem', md: '0.75rem', lg: '1.25rem' };
  const spacing = { tight: '0.75rem', normal: '1.25rem', loose: '1.75rem' };
  return {
    '--theme-bg': theme.colors.bg,
    '--theme-surface': theme.colors.surface,
    '--theme-elevated': theme.colors.elevated,
    '--theme-border': theme.colors.border,
    '--theme-text': theme.colors.text,
    '--theme-muted': theme.colors.muted,
    '--theme-accent': theme.colors.accent,
    '--theme-accent-alt': theme.colors.accentAlt,
    '--theme-font-display': `"${theme.fonts.display}", Georgia, serif`,
    '--theme-font-body': `"${theme.fonts.body}", Arial, sans-serif`,
    '--theme-radius': radii[theme.radius],
    '--theme-card-gap': spacing[theme.cardDensity],
    '--theme-card-padding': spacing[theme.cardDensity],
  };
}
