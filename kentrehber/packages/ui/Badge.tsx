import type { HTMLAttributes } from 'react';
import { cn } from './utils';
export function Badge({
  variant = 'neutral',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  variant?: 'neutral' | 'verified' | 'premium' | 'new' | 'featured';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        variant === 'neutral'
          ? 'border-border bg-elevated text-muted-foreground'
          : variant === 'premium' || variant === 'featured'
            ? 'border-accent-alt/30 bg-accent-alt/10 text-accent-alt'
            : 'border-accent/30 bg-accent/10 text-accent',
        className,
      )}
      {...props}
    />
  );
}
