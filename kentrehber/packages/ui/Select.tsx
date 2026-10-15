import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from './utils';
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          'min-h-11 w-full rounded-md border border-border bg-surface px-3 text-foreground focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);
