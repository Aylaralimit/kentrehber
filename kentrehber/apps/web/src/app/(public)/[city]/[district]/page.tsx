import { RegionShell, regionLabel } from '@/components/layout/page-shell';
import { notFound } from 'next/navigation';
export default async function DistrictPage({
  params,
}: {
  params: Promise<{ city: string; district: string }>;
}) {
  const { city, district } = await params;
  if (['api', 'admin', 'listing'].includes(city)) notFound();
  return <RegionShell city={regionLabel(city)} district={regionLabel(district)} />;
}
