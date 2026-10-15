import { ImageFrame } from '@kentrehber/ui/ImageFrame';
import { Skeleton } from '@kentrehber/ui/Skeleton';
import { Card } from '@kentrehber/ui/Card';
import { Badge } from '@kentrehber/ui/Badge';
import { Breadcrumbs } from '@kentrehber/ui/Breadcrumbs';
import { getVerticalTheme } from '@/lib/theme';
export default async function DetailPage() {
  const theme = await getVerticalTheme();
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <Breadcrumbs items={[{ label: 'Ana sayfa', href: '/' }, { label: 'Detay önizlemesi' }]} />
      <div className="my-7 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div>
          <ImageFrame alt="Ana görsel alanı" aspect="video" />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <ImageFrame key={i} alt={`Görsel alanı ${i + 1}`} aspect="square" />
            ))}
          </div>
          <Card className="mt-8">
            <h2 className="font-display text-2xl">Açıklama</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Bu bir detay sayfası önizlemesidir. Açıklama, görseller ve bilgiler veri bağlantısı
              tamamlandığında burada yer alacak.
            </p>
            <Skeleton className="mt-6 h-3 w-full" />
            <Skeleton className="mt-3 h-3 w-5/6" />
            <Skeleton className="mt-3 h-3 w-2/3" />
          </Card>
        </div>
        <aside>
          <Card variant="elevated" className="lg:sticky lg:top-28">
            <Badge>Görsel önizleme</Badge>
            <h1 className="mt-6 font-display text-4xl">Detay alanı</h1>
            <p className="my-5 text-sm text-muted-foreground">
              İçerik ve iletişim bilgileri henüz bağlı değil.
            </p>
            <Skeleton className="mb-7 h-4 w-1/2" />
            <div className="border-t py-5">
              <h2 className="mb-4 text-sm font-semibold">Bilgiler</h2>
              {theme.visibleFields.length ? (
                <p className="text-sm text-muted-foreground">
                  Yapılandırılmış alanlar, veriler bağlandığında gösterilecek.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Gösterilecek alanlar henüz belirlenmedi.
                </p>
              )}
              <Skeleton className="mt-5 h-3 w-3/4" />
            </div>
            {theme.showPrice ? (
              <div className="border-t py-5">
                <h2 className="text-sm font-semibold">Fiyat bilgisi</h2>
                <p className="mt-3 text-sm text-muted-foreground">Fiyat verisi bağlı değil.</p>
              </div>
            ) : null}
            <div className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              {theme.ctaLabel} alanı · Henüz bağlı değil
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
