'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { currentSession } from '@/lib/session';
import { getDb } from '@kentrehber/db';
import { getEnv } from '@kentrehber/config';
import { catalogContentSchema } from '@kentrehber/config/catalog';

function field(data: FormData, key: string) {
  const value = data.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function saveCatalogContent(data: FormData) {
  const session = await currentSession();
  if (!session) redirect('/admin/login');

  const cards = Array.from({ length: 6 }, (_, index) => ({
    title: field(data, `cards.${index}.title`),
    eyebrow: field(data, `cards.${index}.eyebrow`),
    description: field(data, `cards.${index}.description`),
    imageUrl: field(data, `cards.${index}.imageUrl`),
  })).filter((card) => Object.values(card).some(Boolean));

  const parsed = catalogContentSchema.safeParse({
    eyebrow: field(data, 'eyebrow'),
    title: field(data, 'title'),
    description: field(data, 'description'),
    heroImageUrl: field(data, 'heroImageUrl'),
    sectionTitle: field(data, 'sectionTitle'),
    sectionDescription: field(data, 'sectionDescription'),
    cards,
  });
  if (!parsed.success) {
    throw new Error('İçerik kaydedilemedi. Başlıkları ve HTTPS görsel bağlantılarını kontrol edin.');
  }

  const verticalSlug = getEnv().DEPLOY_VERTICAL;
  const published = data.get('published') === 'on';
  await getDb().siteContent.upsert({
    where: { verticalSlug },
    update: { content: parsed.data, published, updatedBy: session.user.id },
    create: {
      verticalSlug,
      content: parsed.data,
      published,
      updatedBy: session.user.id,
    },
  });

  revalidatePath('/');
  revalidatePath('/admin');
  redirect('/admin?saved=1');
}
