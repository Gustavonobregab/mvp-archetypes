import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { canAccess } from '@mvp/kernel/demo/types';
import { ROLE_COOKIE } from '@mvp/kernel/demo/role-cookie';
import { DEMO } from '@/lib/demo-config';
import { MyListingsView } from '@/features/listings/MyListingsView';

export default async function Page() {
  const role = (await cookies()).get(ROLE_COOKIE)?.value ?? 'renter';
  if (!canAccess(DEMO, role, '/my-listings')) redirect('/browse');
  return <MyListingsView />;
}
