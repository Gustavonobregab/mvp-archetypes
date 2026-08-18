'use client';

import * as React from 'react';
import { DashboardHeader } from '@mvp/kernel/dashboard';
import { PeopleTable, type PersonRow } from '@/features/register/PeopleTable';
import { PersonDrawer } from '@/features/register/PersonDrawer';
import type { RegisterRow } from '@/lib/domain';

export function PeopleView({
  people,
  rows,
  showSite,
  title,
}: {
  people: PersonRow[];
  rows: RegisterRow[];
  showSite: boolean;
  title: string;
}) {
  const [selected, setSelected] = React.useState<PersonRow | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader title={title} description="Engineers on the register and where each one stands." />
      <PeopleTable rows={people} showSite={showSite} onRowClick={setSelected} />
      <PersonDrawer person={selected} rows={rows} onClose={() => setSelected(null)} />
    </div>
  );
}
