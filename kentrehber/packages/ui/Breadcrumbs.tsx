import { ChevronRight } from 'lucide-react';
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Sayfa yolu">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index ? <ChevronRight aria-hidden className="h-3 w-3" /> : null}
            {item.href && index < items.length - 1 ? (
              <a
                className="rounded-sm hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                href={item.href}
              >
                {item.label}
              </a>
            ) : (
              <span aria-current={index === items.length - 1 ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
