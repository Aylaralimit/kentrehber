'use client';
import * as Primitive from '@radix-ui/react-tabs';
import type { ReactNode } from 'react';
export function Tabs({
  label,
  items,
  defaultValue,
}: {
  label: string;
  items: { value: string; label: string; content: ReactNode; disabled?: boolean }[];
  defaultValue?: string;
}) {
  return (
    <Primitive.Root defaultValue={defaultValue ?? items[0]?.value}>
      <Primitive.List
        aria-label={label}
        className="flex gap-1 overflow-x-auto rounded-md border border-border bg-surface p-1"
      >
        {items.map((item) => (
          <Primitive.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className="min-h-10 shrink-0 rounded-sm px-4 text-sm text-muted-foreground data-[state=active]:bg-elevated data-[state=active]:text-accent focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50"
          >
            {item.label}
          </Primitive.Trigger>
        ))}
      </Primitive.List>
      {items.map((item) => (
        <Primitive.Content
          key={item.value}
          value={item.value}
          className="py-5 focus-visible:outline-2 focus-visible:outline-accent"
        >
          {item.content}
        </Primitive.Content>
      ))}
    </Primitive.Root>
  );
}
