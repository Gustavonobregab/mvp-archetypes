import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { canAccess } from '@mvp/kernel/demo/types';
import { ROLE_COOKIE } from '@mvp/kernel/demo/role-cookie';
import { DEMO } from '@/lib/demo-config';
import { TeamView } from '@/features/team/TeamView';

export default async function TeamPage() {
  const role = (await cookies()).get(ROLE_COOKIE)?.value ?? 'owner';
  if (!canAccess(DEMO, role, '/team')) redirect('/jobs');
  return <TeamView />;
}
