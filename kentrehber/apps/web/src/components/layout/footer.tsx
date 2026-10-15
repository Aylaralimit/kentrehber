import Link from 'next/link';
export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          <span className="font-semibold text-foreground">KentRehber.</span> Yerelin yanında.
        </p>
        <nav aria-label="Alt menü" className="flex gap-6">
          <Link className="hover:text-accent" href="/">
            Ana sayfa
          </Link>
          <Link className="hover:text-accent" href="/ilkeler">
            Yayın ilkeleri
          </Link>
        </nav>
      </div>
    </footer>
  );
}
