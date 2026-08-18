import { cookies } from 'next/headers';
import { ProfileCard } from '@mvp/kernel/demo/ProfileCard';
import { ROLE_COOKIE } from '@mvp/kernel/demo/role-cookie';
import { DashboardHeader } from '@mvp/kernel/dashboard';
import { DEMO } from '@/lib/demo-config';
import { CURRENT_ORG_ID, MEMBERS, ORG_BY_ID, PLAN_BY_ID, formatDate } from '@/lib/domain';

export default async function ProfilePage() {
  const role = (await cookies()).get(ROLE_COOKIE)?.value ?? 'owner';
  const member = MEMBERS.find((m) => (role === 'owner' ? m.role === 'Owner' : m.role === 'Fitter'));
  const org = ORG_BY_ID[CURRENT_ORG_ID];
  const plan = org ? PLAN_BY_ID[org.planId] : undefined;
  const roleLabel = DEMO.roles.find((r) => r.key === role)?.label ?? '';

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader title="Profile" description="Your details and what this account gets notified about." />
      <ProfileCard
        readOnlyFields={[
          { label: 'Name', value: member?.name ?? '' },
          { label: 'Role', value: member?.role ?? '' },
          { label: 'Firm', value: org?.name ?? '' },
          { label: 'Plan', value: plan?.name ?? '' },
          { label: 'Access level', value: roleLabel },
          { label: 'Joined', value: formatDate(member?.invitedOn ?? null) ?? '' },
        ]}
        email={member?.email ?? ''}
        phone="07700 900318"
        toggles={[
          { key: 'newQuote', label: 'Quote accepted', hint: 'Email me the moment a customer accepts.', on: true },
          { key: 'overdue', label: 'Overdue invoices', hint: 'Weekly nudge for anything unpaid past 30 days.', on: true },
          { key: 'digest', label: 'Monday digest', hint: 'What is scheduled for the week ahead.', on: false },
        ]}
      />
    </div>
  );
}
