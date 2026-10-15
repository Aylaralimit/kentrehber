import { MapPin, Search, Shapes } from 'lucide-react';
import { Card } from '@kentrehber/ui/Card';
import { Skeleton } from '@kentrehber/ui/Skeleton';
import { Breadcrumbs } from '@kentrehber/ui/Breadcrumbs';
import { EmptyState } from '@kentrehber/ui/EmptyState';
import { Badge } from '@kentrehber/ui/Badge';

export function ListingPlaceholders({ count = 6 }: { count?: number }) {
  return (
    <div
      className="theme-grid"
      role="img"
      aria-label="İlan kartları için görsel yerleşim önizlemesi"
    >
      {Array.from({ length: count }, (_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-[4/3]" />
          <div className="mt-5 flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-10" />
          </div>
          <Skeleton className="mt-4 h-5 w-3/4" />
          <Skeleton className="mt-3 h-3 w-1/2" />
        </Card>
      ))}
    </div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-7">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl tracking-tight sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
export function RegionShell({ city, district }: { city: string; district?: string }) {
  const title = district ?? city;
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <Breadcrumbs
        items={[
          { label: 'Ana sayfa', href: '/' },
          {
            label: city,
            href: district
              ? `/${encodeURIComponent(city.toLocaleLowerCase('tr').replace(/ /g, '-'))}`
              : undefined,
          },
          ...(district ? [{ label: district }] : []),
        ]}
      />
      <section className="theme-hero my-8 rounded-lg border border-border px-6 py-12 sm:px-10">
        <Badge>Görsel önizleme</Badge>
        <h1 className="mt-6 font-display text-5xl sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-lg text-muted-foreground">
          Semtleri, yerel işletmeleri ve yeni adresleri bir araya getiren bir rehber.
        </p>
        <p className="mt-5 flex items-center gap-2 text-sm text-accent">
          <MapPin aria-hidden className="h-4 w-4" />
          {district ? `${city} / ${district}` : city}
        </p>
      </section>
      <div className="mb-8 flex flex-wrap items-center gap-3 border-y py-5">
        <span className="text-sm text-muted-foreground">Filtre alanı</span>
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
      <SectionHeading
        eyebrow="YEREL REHBER"
        title="Çevrenizde keşfedin"
        description="Bu sayfa bir tasarım önizlemesidir. İlan ve konum verileri henüz bağlı değil."
      />
      <ListingPlaceholders />
      <div className="mt-10">
        <EmptyState
          icon={<Search className="h-5 w-5" />}
          title="Yeni keşiflere yer açıyoruz"
          description="Veriler bağlandığında bu alanda seçtiğiniz bölgenin içerikleri yer alacak."
          action={{ label: 'Ana sayfaya dön', href: '/' }}
        />
      </div>
    </div>
  );
}
export function CityPlaceholders() {
  return (
    <div
      className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      role="img"
      aria-label="Şehir alanları için görsel yerleşim önizlemesi"
    >
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i} className="min-h-40">
          <Shapes aria-hidden className="mb-8 h-6 w-6 text-muted-foreground" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-3 h-3 w-1/3" />
        </Card>
      ))}
    </div>
  );
}
export function regionLabel(slug: string) {
  return slug
    .replace(/-/g, ' ')
    .slice(0, 80)
    .replace(/(^|\s)\S/gu, (character) => character.toLocaleUpperCase('tr'));
}
