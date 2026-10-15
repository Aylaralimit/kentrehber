'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
export function LoginForm() {
  const [pending, setPending] = useState(false),
    [error, setError] = useState('');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          password: form.get('password'),
          rememberMe: false,
        }),
      });
      if (response.ok) {
        window.location.assign('/admin');
        return;
      }
      setError(
        response.status === 429
          ? 'Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin.'
          : 'Giriş tamamlanamadı. Bilgilerinizi kontrol edip tekrar deneyin.',
      );
    } catch {
      setError('Giriş hizmetine şu anda ulaşılamıyor.');
    } finally {
      setPending(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-5">
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 p-4 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold">
          E-posta
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={254}
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold">
          Parola
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={128}
        />
      </div>
      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? 'Giriş yapılıyor…' : 'Giriş yap'}
      </Button>
    </form>
  );
}
