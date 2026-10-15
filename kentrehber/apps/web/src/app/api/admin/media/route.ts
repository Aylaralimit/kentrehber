import { NextResponse } from 'next/server';
import { getEnv } from '@kentrehber/config';
import { getDb } from '@kentrehber/db';
import { currentSession } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 9 * 1024 * 1024;
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

function matchesImageSignature(type: string, bytes: Uint8Array): boolean {
  if (type === 'image/jpeg')
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === 'image/png')
    return [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v);
  if (type === 'image/webp')
    return String.fromCharCode(...bytes.subarray(0, 4)) === 'RIFF'
      && String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP';
  return false;
}

export async function POST(request: Request) {
  const session = await currentSession();
  if (!session) return NextResponse.json({ error: 'Yetkisiz işlem' }, { status: 401 });

  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin)
    return NextResponse.json({ error: 'Geçersiz istek kaynağı' }, { status: 403 });

  const env = getEnv();
  const vertical = await getDb().vertical.findUnique({
    where: { slug: env.DEPLOY_VERTICAL },
    select: { isAdult: true },
  });
  if (!vertical || vertical.isAdult)
    return NextResponse.json({ error: 'Bu katalog için medya yükleme kullanılamıyor' }, { status: 403 });

  if (
    !env.CF_IMAGES_UPLOAD_ENABLED ||
    !env.CF_IMAGES_ACCOUNT_ID ||
    !env.CF_IMAGES_API_TOKEN ||
    !env.CF_IMAGES_ACCOUNT_HASH
  )
    return NextResponse.json({ error: 'Medya servisi henüz yapılandırılmadı' }, { status: 503 });

  const declaredSize = Number(request.headers.get('content-length') ?? 0);
  if (declaredSize > MAX_BYTES + 64_000)
    return NextResponse.json({ error: 'Dosya boyutu 9 MB sınırını aşıyor' }, { status: 413 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Yükleme verisi okunamadı' }, { status: 400 });
  }
  const file = form.get('file');
  if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size < 1 || file.size > MAX_BYTES)
    return NextResponse.json({ error: 'JPG, PNG veya WebP görsel (en fazla 9 MB) gerekli' }, { status: 400 });

  const signature = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (!matchesImageSignature(file.type, signature))
    return NextResponse.json({ error: 'Görsel biçimi doğrulanamadı' }, { status: 400 });

  const upload = new FormData();
  upload.append('file', file, file.name.replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 80) || 'image');
  upload.append('requireSignedURLs', 'false');

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CF_IMAGES_ACCOUNT_ID}/images/v1`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.CF_IMAGES_API_TOKEN}` },
        body: upload,
        cache: 'no-store',
        signal: AbortSignal.timeout(30_000),
      },
    );
    const result = (await response.json()) as {
      success?: boolean;
      result?: { variants?: string[] };
    };
    if (!response.ok || !result.success || !Array.isArray(result.result?.variants))
      return NextResponse.json({ error: 'Görsel servisi yüklemeyi kabul etmedi' }, { status: 502 });

    const url = result.result.variants.find((item) => {
      try {
        const parsed = new URL(item);
        return parsed.protocol === 'https:'
          && parsed.hostname === 'imagedelivery.net'
          && parsed.pathname.startsWith(`/${env.CF_IMAGES_ACCOUNT_HASH}/`);
      } catch {
        return false;
      }
    });
    if (!url)
      return NextResponse.json({ error: 'Güvenilir görsel bağlantısı bulunamadı' }, { status: 502 });
    return NextResponse.json({ url }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Medya servisine ulaşılamadı' }, { status: 502 });
  }
}
