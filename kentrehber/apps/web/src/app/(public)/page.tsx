import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Compass } from 'lucide-react';
import { Button } from '@kentrehber/ui/Button';
import { Badge } from '@kentrehber/ui/Badge';
import { EmptyState } from '@kentrehber/ui/EmptyState';
import {
  CityPlaceholders,
  ListingPlaceholders,
  SectionHeading,
} from '@/components/layout/page-shell';
export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
      <section className="theme-hero relative my-7 overflow-hidden rounded-lg border border-border px-6 py-14 sm:my-10 sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 hidden h-[32rem] w-[32rem] rounded-full border border-accent/15 lg:block"
        >
          <div className="absolute inset-12 rounded-full border border-accent/15" />
          <div className="absolute inset-24 rounded-full border border-accent/15" />
        </div>
        <div className="relative max-w-2xl">
          <Badge>Şehir şehir, semt semt</Badge>
          <h1 className="mt-8 font-display text-5xl leading-[1.08] tracking-tight sm:text-7xl">
            Şehrinle
            <br />
            yeniden <span className="italic text-accent">tanış.</span>
          </h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
            Yakınındaki yeni bir adres, mahallendeki tanıdık bir yüz. Yerel yaşamı keşfetmenin sade
            bir yolu.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#sehirler">
                Şehirleri keşfet
                <ArrowDown aria-hidden className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/ilkeler">
                Rehber hakkında
                <ArrowUpRight aria-hidden className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <p className="relative mt-12 border-t border-border pt-5 text-xs text-muted-foreground">
          Görsel önizleme · İlan, arama ve konum verileri henüz bağlı değil.
        </p>
      </section>
      <section className="py-7">
        <SectionHeading
          eyebrow="YERELDEN SEÇKİLER"
          title="Keşif burada başlıyor"
          description="Farklı sektörler, ortak bir rehber deneyimi."
        />
        <ListingPlaceholders />
      </section>
      <section id="sehirler" className="scroll-mt-28 py-12">
        <SectionHeading
          eyebrow="BİR ŞEHİR SEÇİN"
          title="Her şehrin bir hikâyesi var"
          description="Şehir verileri bağlandığında bu alan güncellenecek."
        />
        <CityPlaceholders />
      </section>
      <EmptyState
        icon={<Compass className="h-6 w-6" />}
        title="Bir sonraki keşfiniz için hazırlanıyoruz"
        description="Bu alan, rehberin görsel yapısını gösterir. Gerçek işletme bilgileri sonraki veri bağlantısıyla eklenecek."
      />
    </div>
  );
}
