import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from './utils';
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-28 w-full resize-y rounded-md border border-border bg-surface p-3 text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
});
