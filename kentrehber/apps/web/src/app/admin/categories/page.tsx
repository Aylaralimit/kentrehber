import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, FolderOpen, Plus, Trash2 } from 'lucide-react';
import { getDb } from '@kentrehber/db';
import { getEnv } from '@kentrehber/config';
import { currentSession } from '@/lib/session';
import { addCategory, deleteCategory } from './actions';

export const metadata = { title: 'Kategori yönetimi', robots: { index: false, follow: false } };

const messages: Record<string, string> = {
  invalid: 'Kategori adı veya URL anahtarı geçersiz.',
  duplicate: 'Aynı URL anahtarına sahip kategori zaten mevcut.',
  limit: 'Kategori sınırına ulaşıldı.',
  unavailable: 'Bu katalog için kategori düzenleme kullanılamıyor.',
};
const successes: Record<string, string> = {
  created: 'Kategori kaydedildi.',
  deleted: 'Kategori kaldırıldı.',
};

export default async function Categories({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; status?: string }>;
}) {
  const session = await currentSession();
  if (!session) redirect('/admin/login');

  const vertical = await getDb().vertical.findFirst({
    where: { slug: getEnv().DEPLOY_VERTICAL, isAdult: false },
    include: { categories: { orderBy: { name: 'asc' } } },
  });
  const params = await searchParams;
  const notice = (params.error && messages[params.error]) ||
    (params.status && successes[params.status]) || '';

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <Link href="/admin" className="mb-8 inline-flex items-center gap-2 text-sm text-accent hover:underline">
        <ArrowLeft aria-hidden className="h-4 w-4" /> İçerik stüdyosuna dön
      </Link>
      <header className="mb-10">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">Yönetim / Kategoriler</p>
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">İşletme kategorileri</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Genel işletme kataloğunun kategorilerini oluştur ve yönet. Kaydedilen kategoriler
          vitrin alanında görünür; işletme kayıt ve filtre bağlantısı ayrı bir geliştirme aşamasıdır.
        </p>
      </header>
      {notice ? <p role="status" className="mb-6 rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm">{notice}</p> : null}

      {!vertical ? (
        <div className="rounded-xl border border-border bg-surface p-7">
          Bu katalog için geçerli sektör kaydı bulunamadı.
        </div>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FolderOpen aria-hidden className="h-6 w-6 text-accent" />
                <h2 className="font-display text-2xl">Mevcut kategoriler</h2>
              </div>
              <span className="rounded-full border border-border px-3 py-1 text-xs">{vertical.categories.length} / 50</span>
            </div>
            {vertical.categories.length ? (
              <ul className="divide-y divide-border">
                {vertical.categories.map((category) => (
                  <li key={category.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                    <div>
                      <p className="text-base font-semibold">{category.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">/{category.slug}</p>
                    </div>
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <button type="submit" aria-label={category.name + ' kategorisini sil'} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-xs font-semibold hover:border-destructive hover:text-destructive">
                        <Trash2 aria-hidden className="h-4 w-4" /> Sil
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-9 text-center text-sm text-muted-foreground">
                Henüz kategori eklenmedi.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-elevated p-6 sm:p-8 lg:sticky lg:top-28">
            <div className="mb-7">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">Yeni kayıt</p>
              <h2 className="font-display text-2xl">Kategori oluştur</h2>
            </div>
            <form action={addCategory} className="space-y-5">
              <label className="block text-sm font-semibold">
                Görünen ad
                <input name="name" maxLength={80} minLength={2} required placeholder="Örn. Kafeler" className="mt-2 block min-h-11 w-full rounded-lg border border-border bg-background px-4 text-sm focus:border-accent focus:outline-none" />
              </label>
              <label className="block text-sm font-semibold">
                URL anahtarı
                <input name="slug" maxLength={60} minLength={2} pattern="[a-z][a-z0-9-]+" required placeholder="orn-kafeler" className="mt-2 block min-h-11 w-full rounded-lg border border-border bg-background px-4 text-sm focus:border-accent focus:outline-none" />
              </label>
              <p className="text-xs leading-6 text-muted-foreground">
                URL anahtarı küçük İngilizce harf, rakam ve tire içermelidir.
              </p>
              <button type="submit" disabled={vertical.categories.length >= 50} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-bold text-background disabled:opacity-40">
                <Plus aria-hidden className="h-4 w-4" /> Kategori ekle
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
