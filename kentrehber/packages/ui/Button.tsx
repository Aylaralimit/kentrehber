import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from './utils';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'default' | 'lg';
  asChild?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'default', asChild, className, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50',
        {
          'border-accent bg-accent text-background hover:bg-accent/85': variant === 'primary',
          'border-border bg-transparent text-foreground hover:bg-elevated': variant === 'ghost',
          'border-accent-alt bg-accent-alt text-background hover:bg-accent-alt/85':
            variant === 'danger',
        },
        size === 'sm' ? 'min-h-9 px-3' : size === 'lg' ? 'min-h-12 px-6' : 'min-h-11 px-4',
        className,
      )}
      {...props}
    />
  );
});
