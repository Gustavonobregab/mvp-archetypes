import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatDate, registerForRole, SITES, type RegisterRow, type RoleKey } from '@/lib/domain';
import { ROLE_COOKIE } from '@mvp/kernel/demo/role-cookie';
import { canAccess } from '@mvp/kernel/demo/types';
import { DEMO } from '@/lib/demo-config';
import { DashboardHeader, StatCard, CategoryBar } from '@mvp/kernel/dashboard';
import { Card } from '@mvp/kernel/ui/card';
import { StatusBadge } from '@/features/register/StatusBadge';

function count(rows: RegisterRow[], status: RegisterRow['status']) {
  return rows.filter((r) => r.status === status).length;
}

export default async function OverviewPage() {
  const role = ((await cookies()).get(ROLE_COOKIE)?.value ?? 'admin') as RoleKey;
  if (!canAccess(DEMO, role, '/overview')) redirect('/my-record');
  const rows = registerForRole(role);

  const expired = count(rows, 'expired');
  const missing = count(rows, 'missing');
  const expiring = count(rows, 'expiring');
  const valid = count(rows, 'valid');
  const blocked = new Set(
    rows.filter((r) => r.mandatory && (r.status === 'expired' || r.status === 'missing')).map((r) => r.personId),
  ).size;
  const people = new Set(rows.map((r) => r.personId)).size;

  /* Worst first, and mandatory before optional inside each band. A flat sort by
     days would fill the whole list with tickets nobody holds and hide the ones
     lapsing this month, which are the actionable ones. */
  const SEVERITY: Record<RegisterRow['status'], number> = {
    expired: 0,
    missing: 1,
    expiring: 2,
    valid: 3,
  };
  const attention = rows
    .filter((r) => r.status === 'expired' || r.status === 'missing' || r.status === 'expiring')
    .sort(
      (a, b) =>
        SEVERITY[a.status] - SEVERITY[b.status] ||
        Number(b.mandatory) - Number(a.mandatory) ||
        (a.daysLeft ?? 0) - (b.daysLeft ?? 0),
    )
    .slice(0, 8);

  const bySite = SITES.map((site) => {
    const siteRows = rows.filter((r) => r.siteId === site.id);
    const bad = siteRows.filter((r) => r.status === 'expired' || r.status === 'missing').length;
    return { site, total: siteRows.length, bad };
  }).filter((s) => s.total > 0);

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader
        title="Overview"
        description={
          role === 'manager'
            ? 'Certification position for your site.'
            : 'Certification position across every site.'
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Cannot be deployed"
          value={blocked}
          sub={`of ${people} engineers, missing or expired mandatory ticket`}
        />
        <StatCard label="Expired" value={expired} sub="needs a renewal booked now" />
        <StatCard label="Expiring in 60 days" value={expiring} sub="book before it lapses" />
        <StatCard label="Valid" value={valid} sub="in date across all tickets" />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="gap-0 p-5 shadow-none lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Needs attention
            </p>
            <Link
              href={role === 'technician' ? '/my-record' : '/register'}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Open register
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <ul className="mt-3 divide-y divide-border">
            {attention.map((row) => (
              <li key={row.id} className="flex items-center gap-3 py-2.5">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {row.person}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {row.ticket}
                    {row.site ? ` at ${row.site}` : null}
                  </span>
                </span>
                {row.expiresOn ? (
                  <span className="nv-num hidden text-xs text-muted-foreground sm:block">
                    {formatDate(row.expiresOn)}
                  </span>
                ) : null}
                <StatusBadge status={row.status} />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="gap-0 p-5 shadow-none">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Register mix
          </p>
          <div className="mt-4">
            <CategoryBar
              segments={[
                { key: 'valid', label: 'Valid', value: valid, colorClass: 'bg-success' },
                { key: 'expiring', label: 'Expiring', value: expiring, colorClass: 'bg-warning' },
                { key: 'expired', label: 'Expired', value: expired, colorClass: 'bg-destructive' },
                { key: 'missing', label: 'Not held', value: missing, colorClass: 'bg-subtle' },
              ]}
            />
          </div>

          {bySite.length > 1 ? (
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                By site
              </p>
              <ul className="mt-2 divide-y divide-border">
                {bySite.map(({ site, total, bad }) => (
                  <li key={site.id} className="flex items-center justify-between py-2">
                    <span className="text-sm text-foreground">{site.name}</span>
                    <span className="nv-num text-xs text-muted-foreground">
                      {bad} of {total}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
