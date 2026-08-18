'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, DataTableColumnHeader } from '@mvp/kernel/ui/data-table';
import { DashboardHeader, StatCard } from '@mvp/kernel/dashboard';
import { Badge } from '@mvp/kernel/ui/badge';
import { ORGS, PLAN_BY_ID, formatDate, money, type Org } from '@/lib/domain';

const STATUS_TONE: Record<Org['status'], string> = {
  active: 'bg-success-soft text-success',
  trialing: 'bg-info-soft text-info',
  past_due: 'bg-destructive-soft text-destructive',
};

const STATUS_LABEL: Record<Org['status'], string> = {
  active: 'Active',
  trialing: 'Trial',
  past_due: 'Past due',
};

/* The platform side of a multi-tenant SaaS: every subscriber at once. */
export function AccountsView() {
  const mrr = ORGS.reduce((s, o) => s + o.mrr, 0);
  const pastDue = ORGS.filter((o) => o.status === 'past_due').length;

  const columns = React.useMemo<ColumnDef<Org, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Account" />,
        cell: ({ row }) => <span className="text-sm font-medium text-foreground">{row.original.name}</span>,
      },
      {
        accessorKey: 'planId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Plan" />,
        cell: ({ row }) => <span className="text-sm">{PLAN_BY_ID[row.original.planId]?.name}</span>,
      },
      {
        accessorKey: 'seatsUsed',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Seats" />,
        cell: ({ row }) => (
          <span className="nv-num text-sm">
            {row.original.seatsUsed} of {PLAN_BY_ID[row.original.planId]?.seats}
          </span>
        ),
      },
      {
        accessorKey: 'mrr',
        header: ({ column }) => <DataTableColumnHeader column={column} title="MRR" />,
        cell: ({ row }) => <span className="nv-num text-sm">{money(row.original.mrr)}</span>,
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => (
          <Badge variant="secondary" className={`border-0 font-medium ${STATUS_TONE[row.original.status]}`}>
            {STATUS_LABEL[row.original.status]}
          </Badge>
        ),
      },
      {
        accessorKey: 'renewsOn',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Renews" />,
        cell: ({ row }) => <span className="nv-num text-sm">{formatDate(row.original.renewsOn)}</span>,
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader title="Accounts" description="Every firm subscribing to the platform." />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="MRR" value={money(mrr)} sub={`${ORGS.length} accounts`} />
        <StatCard label="Past due" value={pastDue} sub="payment failed, needs chasing" />
        <StatCard label="On trial" value={ORGS.filter((o) => o.status === 'trialing').length} sub="not converted yet" />
      </div>

      <DataTable columns={columns} data={ORGS} pageSize={10} searchPlaceholder="Search account" getRowId={(r) => r.id} />
    </div>
  );
}
