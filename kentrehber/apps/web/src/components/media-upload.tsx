'use client';

import { useState, type ChangeEvent } from 'react';
import { ImageFrame } from '@kentrehber/ui/ImageFrame';
import { ImagePlus, LoaderCircle } from 'lucide-react';

type Props = {
  name: string;
  label: string;
  initialUrl: string;
};

export function MediaUpload({ name, label, initialUrl }: Props) {
  const [url, setUrl] = useState(initialUrl);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';

    setNotice('');
    if (file.size > 9 * 1024 * 1024) {
      setNotice('Dosya 9 MB sınırını aşıyor.');
      return;
    }
    setBusy(true);
    try {
      const payload = new FormData();
      payload.append('file', file);
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: payload,
        credentials: 'same-origin',
      });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) {
        setNotice(result.error ?? 'Görsel yüklenemedi.');
        return;
      }
      setUrl(result.url);
      setNotice('Görsel yüklendi. Sitede kullanmak için sayfanın altından kaydet.');
    } catch {
      setNotice('Görsel yüklenirken bağlantı hatası oluştu.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-2 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-border bg-elevated px-4 text-sm font-semibold hover:border-accent">
          {busy ? <LoaderCircle aria-hidden className="h-4 w-4 animate-spin" /> : <ImagePlus aria-hidden className="h-4 w-4" />}
          {busy ? 'Yükleniyor' : 'Bilgisayardan görsel seç'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onFileChange}
            className="sr-only"
            disabled={busy}
            aria-label={label + ' için görsel seç'}
          />
        </label>
        <span className="text-xs text-muted-foreground">JPG, PNG, WebP • En fazla 9 MB</span>
      </div>

      <label className="block text-xs font-medium text-muted-foreground" htmlFor={name}>
        Veya HTTPS bağlantısı gir
      </label>
      <input
        id={name}
        className="block min-h-11 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
        type="url"
        name={name}
        maxLength={2048}
        placeholder="https://..."
        value={url}
        onChange={(event) => setUrl(event.target.value)}
      />

      {url ? <ImageFrame alt={label + ' önizlemesi'} src={url} aspect="video" className="max-w-sm" /> : null}
      {notice ? <p role="status" className="text-xs leading-6 text-accent">{notice}</p> : null}
    </div>
  );
}
