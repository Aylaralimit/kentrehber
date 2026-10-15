import { headers } from 'next/headers';
import { getAuth } from './auth';
import { readyRedis } from '@kentrehber/services';
import { getDb } from '@kentrehber/db';
export async function currentSession() {
  const requestHeaders = await headers();
  if (!requestHeaders.get('cookie')) return null;
  await readyRedis();
  const result = await getAuth().api.getSession({ headers: requestHeaders });
  if (!result) return null;
  const user = await getDb().user.findUnique({
    where: { id: result.user.id },
    select: { disabled: true },
  });
  if (!user || user.disabled) return null;
  return result;
}
