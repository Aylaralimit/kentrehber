import { toNextJsHandler } from 'better-auth/next-js';
import { getAuth } from '@/lib/auth';
import { getEnv } from '@kentrehber/config';
import { readyRedis } from '@kentrehber/services';
import { sameOrigin } from '@kentrehber/auth/security';
import { isIP } from 'node:net';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
async function handle(request: Request) {
  const env = getEnv();
  const endpoint = new URL(request.url).pathname.replace('/api/auth', '');
  if (!['/sign-in/email', '/get-session', '/sign-out', '/ok'].includes(endpoint))
    return new Response(null, { status: 404 });
  if (request.method === 'POST' && !sameOrigin(request.headers.get('origin'), env.APP_URL))
    return new Response(null, { status: 403 });
  const headers = new Headers(request.headers);
  // Caddy overwrites this header; direct development never accepts a supplied IP.
  const ip = env.TRUST_PROXY ? headers.get('x-kentrehber-client-ip') : '127.0.0.1';
  if (!ip || !isIP(ip)) return new Response(null, { status: 400 });
  headers.set('x-kentrehber-client-ip', ip);
  try {
    await readyRedis();
    const handler = toNextJsHandler(getAuth());
    const input = new Request(request, { headers });
    const response = await handler[request.method === 'POST' ? 'POST' : 'GET'](input);
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch {
    return Response.json(
      { message: 'Kimlik doğrulama hizmetine ulaşılamıyor.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
export const GET = handle;
export const POST = handle;
