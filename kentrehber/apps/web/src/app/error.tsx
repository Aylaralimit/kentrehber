'use client';
import { Button } from '@/components/ui/button';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="mb-4 text-3xl font-semibold">Şu anda işlemi tamamlayamıyoruz.</h1>
      <p className="mb-6 text-muted-foreground">Lütfen kısa bir süre sonra tekrar deneyin.</p>
      <Button onClick={reset}>Tekrar dene</Button>
    </section>
  );
}
