import type { ReactNode } from 'react';
import { Button } from './Button';
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-border px-6 py-12 text-center">
      <div
        aria-hidden
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-elevated text-accent"
      >
        {icon}
      </div>
      <h2 className="font-display text-2xl text-foreground">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      ) : null}
      {action ? (
        <Button asChild variant="ghost" className="mt-6">
          <a href={action.href}>{action.label}</a>
        </Button>
      ) : null}
    </div>
  );
}
