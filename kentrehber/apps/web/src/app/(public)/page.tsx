import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, LayoutGrid, Search, Sparkles } from 'lucide-react';
import { ImageFrame } from '@kentrehber/ui/ImageFrame';
import { getPublicCatalog } from '@/lib/catalog';
import { getPublicCategories } from '@/lib/public-categories';

export default async function Home() {
  const [catalog, categories] = await Promise.all([getPublicCatalog(), getPublicCategories()]);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" /> Seçili içerikler / Tek vitrin</span>
        <span>Dijital katalog — Türkiye</span>
      </div>

      <section aria-labelledby="hero-title" className="relative my-7 overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_28px_80px_var(--theme-shadow)] sm:my-10">
        <div className="grid min-h-[440px] lg:grid-cols-[1.06fr_0.94fr]">
          <div className="relative z-10 flex flex-col justify-between p-7 sm:p-12 lg:p-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.17em] text-accent">
                <Sparkles aria-hidden className="h-4 w-4" />
                {catalog.eyebrow}
              </div>
              <h1 id="hero-title" className="mt-10 max-w-3xl font-display text-5xl leading-[1.08] tracking-[-0.045em] sm:text-6xl xl:text-7xl">
                {catalog.title}
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                {catalog.description}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href="#katalog" className="inline-flex min-h-12 items-center gap-3 rounded-lg bg-accent px-6 text-sm font-bold text-background transition hover:opacity-90">
                  Koleksiyonu incele <ArrowDown aria-hidden className="h-4 w-4" />
                </a>
                <Link href="/ara" className="inline-flex min-h-12 items-center gap-3 rounded-lg border border-border bg-elevated px-6 text-sm font-semibold hover:border-accent">
                  Katalogda ara <Search aria-hidden className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="mt-14 flex items-center gap-3 border-t border-border pt-6 text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-accent/40 text-accent">01</span>
              Görsel odaklı katalog
            </div>
          </div>
          <div className="relative min-h-[310px] overflow-hidden border-t border-border bg-elevated lg:min-h-[530px] lg:border-l lg:border-t-0">
            {catalog.heroImageUrl ? (
              <ImageFrame
                src={catalog.heroImageUrl}
                alt={catalog.title}
                aspect="portrait"
                eager
                className="h-full min-h-[310px] rounded-none border-0 lg:min-h-[530px]"
              />
            ) : (
              <div className="absolute inset-0 overflow-hidden" aria-label="Kapak görseli için tasarım alanı" role="img">
                <div className="absolute -right-28 top-[-6rem] h-[28rem] w-[28rem] rounded-full border border-accent/25" />
                <div className="absolute right-[-3rem] top-[1rem] h-[22rem] w-[22rem] rounded-full border border-accent/20" />
                <div className="absolute right-12 top-28 h-[14rem] w-[14rem] rounded-full border border-accent/20" />
                <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-background/85 to-transparent" />
                <div className="absolute bottom-9 left-8 right-8 border-t border-accent/30 pt-5">
                  <span className="text-7xl font-light tracking-tighter text-accent/60">01<span className="text-2xl">/06</span></span>
                  <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Kapak görseli / Yönetim panelinden düzenlenir</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {categories.length ? (
        <section aria-label="İşletme kategorileri" className="my-8 rounded-xl border border-border bg-surface px-6 py-7 sm:px-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold tracking-tight">Kategoriler</h2>
            <span className="text-xs text-muted-foreground">{categories.length} kategori</span>
          </div>
          <ul className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category.slug} className="rounded-full border border-border bg-elevated px-4 py-2 text-xs font-semibold text-foreground">
                {category.name}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section id="katalog" className="scroll-mt-28 pt-10 sm:pt-14" aria-labelledby="catalog-title">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
              <LayoutGrid aria-hidden className="h-4 w-4" />
              Küratöryel vitrin
            </p>
            <h2 id="catalog-title" className="font-display text-4xl tracking-tight sm:text-5xl">{catalog.sectionTitle}</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">{catalog.sectionDescription}</p>
          </div>
          <Link href="/ara" className="inline-flex items-center gap-2 border-b border-accent pb-2 text-sm font-semibold text-accent hover:text-foreground">
            Tümünü gör <ArrowUpRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>

        {catalog.cards.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {catalog.cards.map((card, index) => (
              <article key={index} className="group overflow-hidden rounded-xl border border-border bg-surface transition hover:-translate-y-1 hover:border-accent/60">
                <div className="relative overflow-hidden">
                  <ImageFrame src={card.imageUrl || undefined} alt={card.title} aspect="portrait" className="rounded-none border-0" />
                  <span className="absolute left-4 top-4 rounded-md border border-border bg-background/85 px-3 py-2 text-[11px] font-bold uppercase tracking-widest backdrop-blur-lg">
                    {card.eyebrow || 'Seçki'}
                  </span>
                </div>
                <div className="p-6">
                  <p className="mb-3 text-xs tracking-[0.24em] text-muted-foreground">{String(index + 1).padStart(2, '0')} / KATALOG</p>
                  <h3 className="font-display text-2xl">{card.title}</h3>
                  {card.description ? <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">{card.description}</p> : null}
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-5 text-xs font-semibold uppercase tracking-widest text-accent">
                    Koleksiyon <ArrowRight aria-hidden className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Boş koleksiyon yerleşimi">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-xl border border-border bg-surface">
                <div className="relative aspect-[3/4] bg-elevated">
                  <div className="absolute inset-5 rounded-lg border border-accent/15" />
                  <span className="absolute bottom-6 left-6 font-display text-7xl text-accent/35">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="p-6">
                  <div className="mb-4 h-2 w-20 rounded-full bg-elevated" />
                  <div className="mb-3 h-4 w-3/4 rounded-full bg-elevated" />
                  <p className="text-xs text-muted-foreground">İçerik yönetiminden doldurulacak alan</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-16 flex flex-col items-start justify-between gap-5 rounded-2xl border border-border bg-elevated px-7 py-10 sm:flex-row sm:items-center sm:px-10">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">Katalog deneyimi</p>
          <h2 className="font-display text-3xl">Aradığını daha kolay keşfet.</h2>
          <p className="mt-3 text-sm text-muted-foreground">İçerikler yayına alındıkça katalog genişler.</p>
        </div>
        <Link href="/ara" className="inline-flex min-h-12 items-center gap-3 rounded-lg border border-accent px-5 text-sm font-bold text-accent hover:bg-accent hover:text-background">
          Arama ekranı <ArrowUpRight aria-hidden className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
