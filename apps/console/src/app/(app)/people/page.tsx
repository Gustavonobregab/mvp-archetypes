import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { canAccess } from '@mvp/kernel/demo/types';
import { ROLE_COOKIE } from '@mvp/kernel/demo/role-cookie';
import { DEMO } from '@/lib/demo-config';
import { PEOPLE, SITE_BY_ID, SITE_OF_MANAGER, registerForRole, type RoleKey } from '@/lib/domain';
import { PeopleView } from '@/features/register/PeopleView';

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
    <PeopleView
      people={people}
      rows={rows}
      showSite={role === 'admin'}
      title={role === 'manager' ? 'My team' : 'People'}
    />
  );
}
