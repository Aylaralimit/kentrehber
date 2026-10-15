import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getVerticalTheme } from '@/lib/theme';
import { getEnv } from '@kentrehber/config';
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const theme = await getVerticalTheme();
  if (
    theme.ageGateEnabled &&
    (await cookies()).get(`entry_${getEnv().DEPLOY_VERTICAL}`)?.value !== '1'
  )
    redirect('/18');
  return children;
}
