import type { ButtonHTMLAttributes } from 'react';
import { cn } from './utils';
export function Pill({
  selected = false,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'min-h-10 rounded-full border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50',
        selected
          ? 'border-accent bg-accent/10 text-accent'
          : 'border-border bg-surface text-muted-foreground hover:bg-elevated',
        className,
      )}
      {...props}
    />
  );
}
