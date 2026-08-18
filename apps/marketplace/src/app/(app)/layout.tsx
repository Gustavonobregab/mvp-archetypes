import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AppShell } from '@mvp/kernel/demo/AppShell';
import { ROLE_COOKIE } from '@mvp/kernel/demo/role-cookie';
import { DEMO } from '@/lib/demo-config';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const role = (await cookies()).get(ROLE_COOKIE)?.value;
  if (!role || !DEMO.manifest[role]) redirect('/');

  return (
    <AppShell config={DEMO} role={role}>
      {children}
    </AppShell>
  );
}
