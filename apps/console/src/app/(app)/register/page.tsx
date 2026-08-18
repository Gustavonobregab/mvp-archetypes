import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { RoleKey } from '@/lib/domain';
import { ROLE_COOKIE } from '@mvp/kernel/demo/role-cookie';
import { canAccess } from '@mvp/kernel/demo/types';
import { DEMO } from '@/lib/demo-config';
import { RegisterView } from '@/features/register/RegisterView';

export default async function RegisterPage() {
  const role = ((await cookies()).get(ROLE_COOKIE)?.value ?? 'admin') as RoleKey;

  /* The manifest is the single gate. A route absent from a role's manifest is
     not reachable by typing the URL either. */
  if (!canAccess(DEMO, role, '/register')) redirect('/my-record');

  return (
    <RegisterView
      role={role}
      title={role === 'manager' ? 'Site register' : 'Ticket register'}
      description="Every engineer and every certification they hold. Expired and missing tickets sort first."
      showSite={role === 'admin'}
      canEdit
    />
  );
}
