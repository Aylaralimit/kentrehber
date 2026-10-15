import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
describe('migration distribution', () => {
  it.each([
    ['0001_init', '20261015000100_initial'],
    ['0002_better_auth', '20261015000200_better_auth'],
    ['0003_config_integrity', '20261015000300_config_integrity'],
    ['20261015000400_vertical_theme', '20261015000400_vertical_theme'],
    ['20261015000500_seed_themes', '20261015000500_seed_themes'],
    ['20261015000600_site_content', '20261015000600_site_content'],
  ])('keeps %s identical to the Prisma migration', (source, target) => {
    expect(readFileSync(`db/migrations/${source}.sql`, 'utf8')).toBe(
      readFileSync(`packages/db/prisma/migrations/${target}/migration.sql`, 'utf8'),
    );
  });
});
