import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowUpRight, ImagePlus, LayoutGrid, Save, ShieldCheck } from 'lucide-react';
import { currentSession } from '@/lib/session';
import { getEditableCatalog } from '@/lib/catalog';
import { saveCatalogContent } from './actions';

export const metadata = { title: 'Katalog yönetimi', robots: { index: false, follow: false } };

const inputClass =
  'mt-2 block min-h-11 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent';
const textareaClass =
  'mt-2 block w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent';
const labelClass = 'block text-sm font-medium text-foreground';

export default async function Panel({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const session = await currentSession();
  if (!session) redirect('/admin/login');
  const editor = await getEditableCatalog();
  const saved = (await searchParams).saved === '1';

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8">
      <div className="mb-10 flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.23em] text-accent">
            <ShieldCheck aria-hidden className="h-4 w-4" />
            Yönetim / İçerik stüdyosu
          </p>
          <h1 className="font-display text-4xl sm:text-5xl">Katalog yönetimi</h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Sayfa metinlerini, kapak görselini ve vitrin kartlarını buradan yönet.
            Taslak olarak sakla veya ziyaretçilere yayınla.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm hover:border-accent"
        >
          Siteyi görüntüle <ArrowUpRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>

      {saved ? (
        <p role="status" className="mb-8 rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm text-foreground">
          Değişiklikler kaydedildi. Yayın açıksa yeni içerik bir sonraki sayfa isteğinde görünür.
        </p>
      ) : null}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Yayın durumu</p>
          <p className="mt-3 text-2xl font-semibold">{editor.published ? 'Yayında' : 'Taslak'}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Vitrin kartları</p>
          <p className="mt-3 text-2xl font-semibold">{editor.content.cards.length} / 6</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Son kayıt</p>
          <p className="mt-3 text-base font-semibold">
            {editor.updatedAt ? new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }).format(editor.updatedAt) : 'Henüz kaydedilmedi'}
          </p>
        </div>
      </div>

      <form action={saveCatalogContent} className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_270px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">01 / Ana vitrin</p>
              <h2 className="font-display text-3xl">Kapak ve başlıklar</h2>
            </div>
            <div className="grid gap-6">
              <label className={labelClass}>
                Üst etiket
                <input className={inputClass} name="eyebrow" maxLength={80} required defaultValue={editor.content.eyebrow} />
              </label>
              <label className={labelClass}>
                Büyük başlık
                <input className={inputClass} name="title" maxLength={130} required defaultValue={editor.content.title} />
              </label>
              <label className={labelClass}>
                Açıklama
                <textarea className={textareaClass} name="description" rows={3} maxLength={400} defaultValue={editor.content.description} />
              </label>
              <label className={labelClass}>
                <span className="inline-flex items-center gap-2"><ImagePlus aria-hidden className="h-4 w-4" /> Kapak görseli (HTTPS URL)</span>
                <input className={inputClass} type="url" name="heroImageUrl" maxLength={2048} placeholder="https://..." defaultValue={editor.content.heroImageUrl} />
                <span className="mt-2 block text-xs font-normal text-muted-foreground">Bu sürümde URL ile görsel eklenir. Doğrudan dosya yükleme için medya depolama bağlantısı gereklidir.</span>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">02 / Koleksiyon</p>
              <h2 className="font-display text-3xl">Bölüm başlıkları</h2>
            </div>
            <div className="grid gap-6">
              <label className={labelClass}>
                Koleksiyon başlığı
                <input className={inputClass} name="sectionTitle" required maxLength={100} defaultValue={editor.content.sectionTitle} />
              </label>
              <label className={labelClass}>
                Bölüm açıklaması
                <textarea className={textareaClass} name="sectionDescription" rows={2} maxLength={300} defaultValue={editor.content.sectionDescription} />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <LayoutGrid aria-hidden className="h-6 w-6 text-accent" />
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">03 / Vitrin kartları</p>
                <h2 className="font-display text-3xl">Görseller ve metinler</h2>
              </div>
            </div>
            <p className="mb-7 text-sm leading-6 text-muted-foreground">En fazla altı işletme veya koleksiyon kartı. Boş bıraktığın kartlar gösterilmez.</p>
            <div className="grid gap-6">
              {Array.from({ length: 6 }, (_, index) => {
                const card = editor.content.cards[index];
                return (
                  <fieldset key={index} className="rounded-xl border border-border bg-background/60 p-5">
                    <legend className="px-2 text-sm font-semibold text-accent">Kart {String(index + 1).padStart(2, '0')}</legend>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className={labelClass}>
                        Kart başlığı
                        <input className={inputClass} name={`cards.${index}.title`} maxLength={100} defaultValue={card?.title ?? ''} />
                      </label>
                      <label className={labelClass}>
                        Kategori etiketi
                        <input className={inputClass} name={`cards.${index}.eyebrow`} maxLength={60} defaultValue={card?.eyebrow ?? ''} />
                      </label>
                      <label className={`${labelClass} md:col-span-2`}>
                        Kısa açıklama
                        <textarea className={textareaClass} name={`cards.${index}.description`} rows={2} maxLength={240} defaultValue={card?.description ?? ''} />
                      </label>
                      <label className={`${labelClass} md:col-span-2`}>
                        Görsel bağlantısı (HTTPS)
                        <input className={inputClass} type="url" name={`cards.${index}.imageUrl`} maxLength={2048} placeholder="https://..." defaultValue={card?.imageUrl ?? ''} />
                      </label>
                    </div>
                  </fieldset>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="rounded-2xl border border-border bg-elevated p-6 xl:sticky xl:top-28">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">Yayın merkezi</p>
          <h2 className="font-display text-2xl">Kaydet ve yayınla</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Yayın seçeneği kapalıysa değişiklikler sadece panelde saklanır.
          </p>
          <label className="mt-7 flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-4 text-sm">
            <input type="checkbox" className="h-5 w-5 accent-[var(--theme-accent)]" name="published" defaultChecked={editor.published} />
            İçeriği yayınla
          </label>
          <button type="submit" className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 font-semibold text-background transition hover:opacity-90">
            <Save aria-hidden className="h-4 w-4" />
            Değişiklikleri kaydet
          </button>
          <p className="mt-5 text-xs leading-5 text-muted-foreground">Yalnızca yetkili hesaplar kaydedebilir. Yayınlanan içerik sonraki sayfa isteğinde güncellenir.</p>
          <p className="mt-6 text-xs text-muted-foreground">Oturumunu güvenli tutmak için ortak bilgisayarlarda çıkış yap.</p>
        </aside>
      </form>
    </div>
  );
}
