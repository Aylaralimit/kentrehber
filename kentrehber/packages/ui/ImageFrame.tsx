/* eslint-disable @next/next/no-img-element -- Shared primitive supports native responsive images without a framework dependency. */
'use client';
import { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from './utils';
type Props = {
  src?: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  aspect?: 'square' | 'video' | 'portrait' | 'wide';
  className?: string;
  eager?: boolean;
};
function Picture({ src, srcSet, sizes, alt, eager }: Props & { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <span className="p-4 text-center text-sm text-muted-foreground">Görsel yüklenemedi</span>
    );
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
export function ImageFrame({ aspect = 'video', className, ...props }: Props) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-lg border border-border bg-elevated',
        {
          'aspect-square': aspect === 'square',
          'aspect-video': aspect === 'video',
          'aspect-[3/4]': aspect === 'portrait',
          'aspect-[21/9]': aspect === 'wide',
        },
        className,
      )}
    >
      {props.src ? (
        <Picture key={props.src} {...props} src={props.src} />
      ) : (
        <span role="img" aria-label={props.alt} className="text-muted-foreground">
          <ImageIcon aria-hidden className="h-7 w-7" />
        </span>
      )}
    </div>
  );
}

