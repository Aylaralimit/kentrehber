import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { getVerticalTheme } from '@/lib/theme';
import { Button } from '@kentrehber/ui/Button';
import { confirmEntry } from './actions';
export const metadata = { title: 'Giriş onayı' };
export default async function EntryPage() {
  if (!(await getVerticalTheme()).ageGateEnabled) redirect('/');
  return (
    <section className="mx-auto max-w-xl px-6 py-20 text-center">
      <ShieldCheck aria-hidden className="mx-auto mb-7 h-10 w-10 text-accent" />
      <p className="text-xs tracking-widest text-muted-foreground">GİRİŞ ONAYI</p>
      <h1 className="my-6 font-display text-4xl">Devam etmeden önce</h1>
      <p className="mb-8 leading-7 text-muted-foreground">
        Bu alan için 18 yaşından büyük olduğunuzu onaylamanız gerekiyor. Tercihiniz bu cihazda 30
        gün saklanır.
      </p>
      <form action={confirmEntry}>
        <Button type="submit" size="lg" className="w-full">
          18 yaşından büyüğüm, devam et
        </Button>
      </form>
      <Button asChild variant="ghost" className="mt-3 w-full">
        <Link href="/ilkeler">Çıkış</Link>
      </Button>
    </section>
  );
}
