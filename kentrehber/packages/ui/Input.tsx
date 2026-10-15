import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from './utils';
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'min-h-11 w-full rounded-md border border-border bg-surface px-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
