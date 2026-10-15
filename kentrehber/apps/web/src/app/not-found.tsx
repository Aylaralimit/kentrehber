import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-primary">404</p>
      <h1 className="my-4 text-4xl font-semibold">Bu sayfa bulunamadı.</h1>
      <Link href="/" className="underline underline-offset-4">
        Ana sayfaya dön
      </Link>
    </section>
  );
}
