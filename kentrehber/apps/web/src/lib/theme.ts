import { cache } from 'react';
import { getDb } from '@kentrehber/db';
import { getEnv } from '@kentrehber/config';
import { normalizeTheme } from '@kentrehber/config/theme';

export const getVerticalTheme = cache(async () => {
  try {
    const vertical = await getDb().vertical.findUnique({
      where: { slug: getEnv().DEPLOY_VERTICAL },
      select: { theme: true },
    });
    return normalizeTheme(vertical?.theme);
  } catch {
    // The visual shell remains available before database setup.
    return normalizeTheme({});
  }
});
