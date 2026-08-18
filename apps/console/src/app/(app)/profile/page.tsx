import { cookies } from 'next/headers';
import {
  ORG,
  PERSON_BY_ID,
  ROLE_BY_KEY,
  SITE_BY_ID,
  TECHNICIAN_ID,
  buildRegister,
  formatDate,
  type RoleKey,
} from '@/lib/domain';
import { ROLE_COOKIE } from '@mvp/kernel/demo/role-cookie';
import { DashboardHeader } from '@mvp/kernel/dashboard';
import { ProfileForm } from '@/features/profile/ProfileForm';
import { Card } from '@mvp/kernel/ui/card';
import { StatusBadge } from '@/features/register/StatusBadge';

const PERSON_FOR_ROLE: Record<RoleKey, string> = {
  admin: 'p4',
  manager: 'p12',
  technician: TECHNICIAN_ID,
};

export default async function ProfilePage() {
  const role = ((await cookies()).get(ROLE_COOKIE)?.value ?? 'admin') as RoleKey;
  const person = PERSON_BY_ID[PERSON_FOR_ROLE[role]];
  if (!person) return null;

  const site = SITE_BY_ID[person.siteId];
  const own = buildRegister().filter((r) => r.personId === person.id);

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader
        title="Profile"
        description="Your details, your site, and the notifications this account receives."
      />

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileForm
            name={person.name}
            jobTitle={person.jobTitle}
            site={site ? site.name : ''}
            employmentType={person.employmentType}
            roleLabel={ROLE_BY_KEY[role].label}
            org={ORG.name}
            startedOn={formatDate(person.startedOn) ?? ''}
          />
        </div>

        <Card className="gap-0 p-5 shadow-none">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Tickets held
          </p>
          <ul className="mt-3 divide-y divide-border">
            {own.map((row) => (
              <li key={row.id} className="flex items-center gap-3 py-2.5">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-foreground">{row.ticket}</span>
                  {row.expiresOn ? (
                    <span className="nv-num block text-xs text-muted-foreground">
                      {formatDate(row.expiresOn)}
                    </span>
                  ) : null}
                </span>
                <StatusBadge status={row.status} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
