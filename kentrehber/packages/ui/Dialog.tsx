'use client';
import * as Primitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
export function Dialog({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Primitive.Root open={open} onOpenChange={onOpenChange}>
      <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
        <Primitive.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-border bg-surface p-6 text-foreground shadow-[0_16px_48px_var(--theme-shadow)] focus:outline-none">
          <Primitive.Title className="pr-8 font-display text-2xl">{title}</Primitive.Title>
          <Primitive.Description className="mb-6 mt-2 text-sm text-muted-foreground">
            {description}
          </Primitive.Description>
          {children}
          <Primitive.Close
            aria-label="Kapat"
            className="absolute right-3 top-3 rounded-md p-2 text-muted-foreground hover:bg-elevated focus-visible:outline-2 focus-visible:outline-accent"
          >
            <X aria-hidden className="h-5 w-5" />
          </Primitive.Close>
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
