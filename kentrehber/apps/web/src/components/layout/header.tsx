import Link from 'next/link';
import { ArrowUpRight, LayoutGrid, Search, Settings2 } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          href="/"
          aria-label="KentRehber ana sayfa"
          className="flex items-center gap-3 text-xl font-bold tracking-[-0.04em]"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
            <LayoutGrid aria-hidden className="h-5 w-5" />
          </span>
          KentRehber<span className="text-accent">.</span>
        </Link>
        <nav aria-label="Ana menü" className="flex items-center gap-2 sm:gap-4">
          <Link href="/#katalog" className="hidden min-h-11 items-center px-3 text-sm text-muted-foreground hover:text-accent sm:inline-flex">
            Vitrin
          </Link>
          <Link href="/ara" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground hover:text-accent">
            <Search aria-hidden className="h-4 w-4" />
            <span className="hidden sm:inline">Arama</span>
            <span className="sr-only sm:hidden">Arama sayfası</span>
          </Link>
          <Link href="/admin" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-elevated px-3 text-sm font-semibold hover:border-accent sm:px-4">
            <Settings2 aria-hidden className="h-4 w-4" />
            <span className="hidden sm:inline">Yönetim</span>
            <span className="sm:hidden">Panel</span>
            <ArrowUpRight aria-hidden className="hidden h-4 w-4 sm:inline" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
