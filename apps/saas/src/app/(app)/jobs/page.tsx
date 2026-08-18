import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { canAccess } from '@mvp/kernel/demo/types';
import { ROLE_COOKIE } from '@mvp/kernel/demo/role-cookie';
import { DEMO } from '@/lib/demo-config';
import { JobsView } from '@/features/jobs/JobsView';

export default async function JobsPage() {
  const role = (await cookies()).get(ROLE_COOKIE)?.value ?? 'owner';
  if (!canAccess(DEMO, role, '/jobs')) redirect('/accounts');
  return <JobsView role={role} />;
}
