import type { HTMLAttributes } from 'react';
import { cn } from './utils';
export function Card({
  variant = 'bordered',
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: 'bordered' | 'elevated' | 'glass' }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border p-[var(--theme-card-padding)]',
        variant === 'glass'
          ? 'bg-surface/75 backdrop-blur-xl'
          : variant === 'elevated'
            ? 'bg-elevated shadow-[0_12px_32px_var(--theme-shadow)]'
            : 'bg-surface',
        className,
      )}
      {...props}
    />
  );
}
