import { cache } from 'react';
import { getEnv } from '@kentrehber/config';
import { getDb } from '@kentrehber/db';
import { defaultCatalogContent, normalizeCatalogContent } from '@kentrehber/config/catalog';

export const getPublicCatalog = cache(async () => {
  try {
    const record = await getDb().siteContent.findUnique({
      where: { verticalSlug: getEnv().DEPLOY_VERTICAL },
      select: { content: true, published: true },
    });
    return record?.published
      ? normalizeCatalogContent(record.content)
      : structuredClone(defaultCatalogContent);
  } catch {
    // The read-only design preview works even before the database migration.
    return structuredClone(defaultCatalogContent);
  }
});

export async function getEditableCatalog() {
  const record = await getDb().siteContent.findUnique({
    where: { verticalSlug: getEnv().DEPLOY_VERTICAL },
    select: { content: true, published: true, updatedAt: true },
  });
  return {
    content: normalizeCatalogContent(record?.content),
    published: record?.published ?? false,
    updatedAt: record?.updatedAt ?? null,
  };
}
