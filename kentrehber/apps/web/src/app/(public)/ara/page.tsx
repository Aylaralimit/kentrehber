import { Search } from 'lucide-react';
import { Input } from '@kentrehber/ui/Input';
import { Select } from '@kentrehber/ui/Select';
import { Card } from '@kentrehber/ui/Card';
import { EmptyState } from '@kentrehber/ui/EmptyState';
import { ListingPlaceholders } from '@/components/layout/page-shell';
export const metadata = { title: 'Arama' };
export default function SearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <p className="text-xs tracking-[0.18em] text-accent">YEREL REHBER</p>
      <h1 className="mb-5 mt-4 font-display text-5xl">Ne keşfetmek istersiniz?</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Arama ve filtreler bu görsel önizlemede etkin değildir.
      </p>
      <label htmlFor="preview-search" className="sr-only">
        Rehberde ara
      </label>
      <Input id="preview-search" type="search" placeholder="İsim, şehir veya kategori" disabled />
      <div className="mt-8 grid items-start gap-7 lg:grid-cols-[240px_minmax(0,1fr)]">
        <Card>
          <fieldset disabled className="space-y-6">
            <legend className="mb-6 font-semibold">Filtreler</legend>
            {['Şehir', 'İlçe', 'Kategori'].map((label, index) => (
              <div key={label}>
                <label
                  htmlFor={`filter-${index}`}
                  className="mb-2 block text-sm text-muted-foreground"
                >
                  {label}
                </label>
                <Select id={`filter-${index}`} defaultValue="">
                  <option value="">Veri bağlantısı bekleniyor</option>
                </Select>
              </div>
            ))}
          </fieldset>
        </Card>
        <section aria-label="Sonuç alanı">
          <div className="mb-7">
            <EmptyState
              icon={<Search className="h-5 w-5" />}
              title="Arama alanı hazırlanıyor"
              description="Veri bağlantısı tamamlandığında sonuçlar burada gösterilecek."
            />
          </div>
          <ListingPlaceholders count={3} />
        </section>
      </div>
    </div>
  );
}
