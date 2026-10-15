import { coreReadiness } from '@kentrehber/services';
import { mediaReadiness } from '@kentrehber/services/media';
import { bearerMatches } from '@kentrehber/auth/security';
import { getEnv } from '@kentrehber/config';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    if (!bearerMatches(request.headers.get('authorization'), getEnv().HEALTH_TOKEN))
      return new Response(null, { status: 401 });
    const [core, media] = await Promise.all([coreReadiness(), mediaReadiness()]);
    const ok = Object.values(core).every(Boolean) && (!media.enabled || (media.r2 && media.images));
    return Response.json(
      { status: ok ? 'ready' : 'unavailable', ...core, media },
      { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return Response.json(
      { status: 'unavailable' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
