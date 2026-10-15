import { Button } from './Button';
export function Pagination({
  page,
  pages,
  href,
}: {
  page: number;
  pages: number;
  href: (page: number) => string;
}) {
  if (!Number.isInteger(page) || !Number.isInteger(pages) || pages < 2 || page < 1 || page > pages)
    return null;
  return (
    <nav aria-label="Sayfalar" className="flex flex-wrap items-center justify-center gap-4">
      {page > 1 ? (
        <Button asChild variant="ghost">
          <a rel="prev" href={href(page - 1)}>
            Önceki
          </a>
        </Button>
      ) : (
        <Button variant="ghost" disabled>
          Önceki
        </Button>
      )}
      <span className="text-sm text-muted-foreground" aria-live="polite">
        {page} / {pages}
      </span>
      {page < pages ? (
        <Button asChild variant="ghost">
          <a rel="next" href={href(page + 1)}>
            Sonraki
          </a>
        </Button>
      ) : (
        <Button variant="ghost" disabled>
          Sonraki
        </Button>
      )}
    </nav>
  );
}
