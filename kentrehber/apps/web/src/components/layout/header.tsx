import Link from 'next/link';
import { ArrowUpRight, MapPin, Search } from 'lucide-react';
import { Button } from '@kentrehber/ui/Button';
export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link
          href="/"
          aria-label="KentRehber ana sayfa"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight"
        >
          <MapPin aria-hidden className="h-6 w-6 text-accent" />
          KentRehber
          <span aria-hidden className="text-accent">
            .
          </span>
        </Link>
        <nav aria-label="Ana menü" className="flex items-center gap-3">
          <Link
            href="/ara"
            className="flex min-h-11 items-center gap-2 rounded-md px-2 text-sm text-muted-foreground hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
          >
            <Search aria-hidden className="h-4 w-4" />
            <span className="hidden sm:inline">Ara</span>
            <span className="sr-only sm:hidden">Arama sayfası</span>
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin">
              İşletme paneli
              <ArrowUpRight aria-hidden className="h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
