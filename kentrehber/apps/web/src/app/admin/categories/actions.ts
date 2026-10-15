'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@kentrehber/db';
import { getEnv } from '@kentrehber/config';
import { currentSession } from '@/lib/session';

async function authorizedVertical() {
  const session = await currentSession();
  if (!session) redirect('/admin/login');
  const vertical = await getDb().vertical.findFirst({
    where: { slug: getEnv().DEPLOY_VERTICAL, isAdult: false },
    select: { id: true },
  });
  if (!vertical) redirect('/admin/categories?error=unavailable');
  return vertical.id;
}

export async function addCategory(form: FormData) {
  const verticalId = await authorizedVertical();
  const nameValue = form.get('name');
  const slugValue = form.get('slug');
  const name = typeof nameValue === 'string' ? nameValue.trim() : '';
  const slug = typeof slugValue === 'string' ? slugValue.trim().toLowerCase() : '';

  if (
    name.length < 2 || name.length > 80 ||
    !/^[a-z][a-z0-9-]{1,59}$/.test(slug)
  ) redirect('/admin/categories?error=invalid');

  const db = getDb();
  const count = await db.category.count({ where: { verticalId } });
  if (count >= 50) redirect('/admin/categories?error=limit');

  try {
    await db.category.create({ data: { verticalId, name, slug } });
  } catch {
    redirect('/admin/categories?error=duplicate');
  }
  revalidatePath('/admin/categories');
  revalidatePath('/');
  redirect('/admin/categories?status=created');
}

export async function deleteCategory(form: FormData) {
  const verticalId = await authorizedVertical();
  const idValue = form.get('id');
  if (typeof idValue !== 'string' || idValue.length > 64 || !idValue)
    redirect('/admin/categories?error=invalid');

  await getDb().category.deleteMany({ where: { id: idValue, verticalId } });
  revalidatePath('/admin/categories');
  revalidatePath('/');
  redirect('/admin/categories?status=deleted');
}
