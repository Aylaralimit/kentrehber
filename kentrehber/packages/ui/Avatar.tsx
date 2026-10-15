/* eslint-disable @next/next/no-img-element -- Shared primitive supports native responsive images without a framework dependency. */
'use client';
import { useState } from 'react';
import { cn } from './utils';
function Portrait({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{name.trim().slice(0, 2).toLocaleUpperCase('tr')}</>;
  // Native image keeps the package independent of a routing framework.
  return (
    <img src={src} alt="" onError={() => setFailed(true)} className="h-full w-full object-cover" />
  );
}
export function Avatar({
  name,
  src,
  className,
}: {
  name: string;
  src?: string;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        'inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-elevated text-sm font-semibold text-accent',
        className,
      )}
    >
      {src ? (
        <Portrait key={src} src={src} name={name} />
      ) : (
        name.trim().slice(0, 2).toLocaleUpperCase('tr')
      )}
    </span>
  );
}

