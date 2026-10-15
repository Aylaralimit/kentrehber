import { RegionShell, regionLabel } from '@/components/layout/page-shell';
import { notFound } from 'next/navigation';
export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  if (['api', 'admin', 'listing'].includes(city)) notFound();
  return <RegionShell city={regionLabel(city)} />;
}
