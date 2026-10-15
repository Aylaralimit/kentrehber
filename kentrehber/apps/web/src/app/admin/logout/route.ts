import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { sameOrigin } from '@kentrehber/auth/security';
import { getEnv } from '@kentrehber/config';
import { readyRedis } from '@kentrehber/services';
export async function POST(request: Request) {
  const env = getEnv();
  if (!sameOrigin(request.headers.get('origin'), env.APP_URL))
    return new Response(null, { status: 403 });
  await readyRedis();
  const signedOut = await getAuth().api.signOut({ headers: request.headers, asResponse: true });
  if (!signedOut.ok) return signedOut;
  const response = NextResponse.redirect(new URL('/admin/login', env.APP_URL), 303);
  for (const cookie of signedOut.headers.getSetCookie())
    response.headers.append('Set-Cookie', cookie);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
