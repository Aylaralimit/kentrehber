import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  defaultTheme,
  normalizeTheme,
  themeSchema,
  themeVariables,
} from '../packages/config/src/theme';

const sql = readFileSync('db/migrations/20261015000500_seed_themes.sql', 'utf8');
const references = [...sql.matchAll(/'(\{"colors":.+?\})'::jsonb/g)].map((match) =>
  JSON.parse(match[1]!),
);

describe('theme configuration', () => {
  it('validates both reference palettes from migration data', () => {
    expect(references).toHaveLength(2);
    for (const reference of references) expect(themeSchema.safeParse(reference).success).toBe(true);
    expect(references[0].colors).not.toEqual(references[1].colors);
  });
  it('normalizes empty and invalid configuration to independent defaults', () => {
    for (const value of [{}, null, { colors: {} }])
      expect(normalizeTheme(value)).toEqual(defaultTheme);
    const first = normalizeTheme({});
    first.visibleFields.push('example');
    expect(normalizeTheme({}).visibleFields).toEqual([]);
  });
  it('rejects CSS injection, unknown properties, invalid enums and duplicate keys', () => {
    const source = references[0];
    for (const value of [
      { ...source, colors: { ...source.colors, bg: 'url(https://example.com)' } },
      { ...source, fonts: { ...source.fonts, body: 'Arial; display:none' } },
      { ...source, radius: 'huge' },
      { ...source, extra: true },
      { ...source, visibleFields: ['name', 'name'] },
      { ...source, visibleFields: ['constructor'] },
    ])
      expect(themeSchema.safeParse(value).success).toBe(false);
  });
  it('maps validated configuration to CSS variables without losing palette values', () => {
    const theme = themeSchema.parse(references[1]);
    const vars = themeVariables(theme);
    expect(vars['--theme-bg']).toBe(theme.colors.bg);
    expect(vars['--theme-accent-alt']).toBe(theme.colors.accentAlt);
    expect(vars['--theme-radius']).toBe('0.75rem');
    expect(vars['--theme-card-gap']).toBe('1.75rem');
    expect(vars['--theme-font-display']).toContain(theme.fonts.display);
  });
});
