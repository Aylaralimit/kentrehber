import { cn } from './utils';
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('rounded-md bg-elevated motion-safe:animate-pulse', className)}
    />
  );
}
