import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PEOPLE, SITE_BY_ID, SITE_OF_MANAGER, registerForRole, type RoleKey } from '@/lib/domain';
import { ROLE_COOKIE } from '@mvp/kernel/demo/role-cookie';
import { canAccess } from '@mvp/kernel/demo/types';
import { DEMO } from '@/lib/demo-config';
import { DashboardHeader } from '@mvp/kernel/dashboard';
import { PeopleTable } from '@/features/register/PeopleTable';

export default async function PeoplePage() {
  const role = ((await cookies()).get(ROLE_COOKIE)?.value ?? 'admin') as RoleKey;
  if (!canAccess(DEMO, role, '/people')) redirect('/my-record');
  const rows = registerForRole(role);
  const scoped = role === 'manager' ? PEOPLE.filter((p) => p.siteId === SITE_OF_MANAGER) : PEOPLE;

  const people = scoped.map((person) => {
    const own = rows.filter((r) => r.personId === person.id);
    const site = SITE_BY_ID[person.siteId];
    return {
      id: person.id,
      name: person.name,
      jobTitle: person.jobTitle,
      site: site ? site.name : '',
      employmentType: person.employmentType,
      expired: own.filter((r) => r.status === 'expired').length,
      missing: own.filter((r) => r.status === 'missing').length,
      expiring: own.filter((r) => r.status === 'expiring').length,
      valid: own.filter((r) => r.status === 'valid').length,
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader
        title={role === 'manager' ? 'My team' : 'People'}
        description="Engineers on the register and where each one stands."
      />
      <PeopleTable rows={people} showSite={role === 'admin'} />
    </div>
  );
}
