import { cache } from 'react';
import { getDb } from '@kentrehber/db';
import { getEnv } from '@kentrehber/config';

export const getPublicCategories = cache(async () => {
  try {
    const vertical = await getDb().vertical.findUnique({
      where: { slug: getEnv().DEPLOY_VERTICAL },
      select: {
        isAdult: true,
        categories: {
          orderBy: { name: 'asc' },
          select: { name: true, slug: true },
        },
      },
    });
    if (!vertical || vertical.isAdult) return [];
    return vertical.categories;
  } catch {
    return [];
  }
});
