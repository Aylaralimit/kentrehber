import { redirect } from 'next/navigation';
import { currentSession } from '@/lib/session';
import { getDb } from '@kentrehber/db';
import { getEnv } from '@kentrehber/config';
import { verticalSchema } from '@kentrehber/config/policy';
import { Button } from '@/components/ui/button';
export const metadata = { title: 'İşletme paneli', robots: { index: false, follow: false } };
export default async function Panel() {
  const session = await currentSession();
  if (!session) redirect('/admin/login');
  const vertical = await getDb().vertical.findUnique({
    where: { slug: getEnv().DEPLOY_VERTICAL },
    include: { categories: true },
  });
  const valid =
    vertical &&
    verticalSchema.safeParse({
      slug: vertical.slug,
      name: vertical.name,
      isAdult: vertical.isAdult,
      allowedCategories: vertical.allowedCategories,
      requiredFields: vertical.requiredFields,
      moderationLevel: vertical.moderationLevel,
      paymentRequired: vertical.paymentRequired,
      defaultTier: vertical.defaultTier,
    }).success;
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm text-primary">OPERATÖR PANELİ</p>
      <h1 className="mb-3 mt-3 text-4xl font-semibold">Hoş geldiniz.</h1>
      <p className="text-muted-foreground">{session.user.email}</p>
      <div className="my-8 rounded-xl border p-6">
        <h2 className="mb-4 text-xl font-semibold">Sektör yapılandırması</h2>
        {valid && vertical ? (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <dt>Sektör</dt>
            <dd>{vertical.name}</dd>
            <dt>Durum</dt>
            <dd>{vertical.enabled ? 'Etkin' : 'İnceleme bekliyor'}</dd>
            <dt>Kategori sayısı</dt>
            <dd>{vertical.categories.length}</dd>
            <dt>Yayın</dt>
            <dd>Bu sürümde kapalı</dd>
          </dl>
        ) : (
          <p>Geçerli sektör yapılandırması bulunamadı. Sistem yöneticisine başvurun.</p>
        )}
      </div>
      <form action="/admin/logout" method="post">
        <Button variant="ghost" type="submit">
          Güvenli çıkış
        </Button>
      </form>
    </section>
  );
}
