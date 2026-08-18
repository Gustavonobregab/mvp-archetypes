import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { canAccess } from '@mvp/kernel/demo/types';
import { ROLE_COOKIE } from '@mvp/kernel/demo/role-cookie';
import { DEMO } from '@/lib/demo-config';
import { AccountsView } from '@/features/billing/AccountsView';

export default async function AccountsPage() {
  const role = (await cookies()).get(ROLE_COOKIE)?.value ?? 'platform';
  if (!canAccess(DEMO, role, '/accounts')) redirect('/jobs');
  return <AccountsView />;
}
