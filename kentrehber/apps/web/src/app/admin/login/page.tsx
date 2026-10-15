import { LoginForm } from '@/components/login-form';
export const metadata = { title: 'Operatör girişi' };
export default function Login() {
  return (
    <section className="mx-auto max-w-md px-6 py-20">
      <p className="text-xs font-semibold tracking-widest text-primary">YETKİLİ ERİŞİM</p>
      <h1 className="mb-3 mt-3 text-4xl font-semibold tracking-tight">Tekrar merhaba.</h1>
      <p className="mb-8 leading-6 text-muted-foreground">
        KentRehber operatör hesabınızla giriş yapın.
      </p>
      <LoginForm />
      <p className="mt-6 text-sm leading-6 text-muted-foreground">
        Hesaplar sistem yöneticisi tarafından oluşturulur. İşletme başvuruları henüz açılmadı.
      </p>
    </section>
  );
}
