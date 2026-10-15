import Link from 'next/link';
export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="text-lg font-semibold text-foreground">KentRehber<span className="text-accent">.</span></p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em]">Seçkiler · Koleksiyonlar · Katalog</p>
        </div>
        <nav aria-label="Alt menü" className="flex flex-wrap gap-6">
          <Link className="hover:text-accent" href="/">Vitrin</Link>
          <Link className="hover:text-accent" href="/ara">Arama</Link>
          <Link className="hover:text-accent" href="/ilkeler">Yayın ilkeleri</Link>
        </nav>
      </div>
    </footer>
  );
}
