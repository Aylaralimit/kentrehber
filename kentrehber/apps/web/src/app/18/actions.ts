'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getEnv } from '@kentrehber/config';
import { getVerticalTheme } from '@/lib/theme';
export async function confirmEntry() {
  if ((await getVerticalTheme()).ageGateEnabled) {
    const env = getEnv();
    (await cookies()).set(`entry_${env.DEPLOY_VERTICAL}`, '1', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  redirect('/');
}
