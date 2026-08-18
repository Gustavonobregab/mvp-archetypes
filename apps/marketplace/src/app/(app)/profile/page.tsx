import { cookies } from 'next/headers';
import { ProfileCard } from '@mvp/kernel/demo/ProfileCard';
import { ROLE_COOKIE } from '@mvp/kernel/demo/role-cookie';
import { DashboardHeader } from '@mvp/kernel/dashboard';
import { DEMO } from '@/lib/demo-config';
import { CURRENT_PROVIDER_ID, CURRENT_RENTER, PROVIDER_BY_ID } from '@/lib/domain';

export default async function ProfilePage() {
  const role = (await cookies()).get(ROLE_COOKIE)?.value ?? 'renter';
  const provider = PROVIDER_BY_ID[CURRENT_PROVIDER_ID];
  const isProvider = role === 'provider';
  const roleLabel = DEMO.roles.find((r) => r.key === role)?.label ?? '';

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader title="Profile" description="Your details and what you get notified about." />
      <ProfileCard
        readOnlyFields={[
          { label: 'Name', value: isProvider ? (provider?.name ?? '') : CURRENT_RENTER },
          { label: 'Account', value: roleLabel },
          { label: 'Suburb', value: isProvider ? (provider?.suburb ?? '') : 'Carlton' },
          ...(isProvider
            ? [
                { label: 'Rating', value: provider?.rating.toFixed(1) ?? '' },
                { label: 'Lends', value: String(provider?.lends ?? 0) },
              ]
            : []),
        ]}
        email={isProvider ? 'marcus.teale@example.com' : 'dani.alves@example.com'}
        phone="0412 998 200"
        toggles={
          isProvider
            ? [
                { key: 'request', label: 'New requests', hint: 'Push the moment someone asks to borrow.', on: true },
                { key: 'overdue', label: 'Late returns', hint: 'Alert me if an item is not back on time.', on: true },
                { key: 'payout', label: 'Payout summary', hint: 'Monthly earnings breakdown.', on: false },
              ]
            : [
                { key: 'approved', label: 'Request answered', hint: 'Tell me as soon as a lender replies.', on: true },
                { key: 'pickup', label: 'Pickup reminder', hint: 'Nudge me the morning of a pickup.', on: true },
                { key: 'nearby', label: 'New gear nearby', hint: 'Weekly, in the categories I browse.', on: false },
              ]
        }
      />
    </div>
  );
}
