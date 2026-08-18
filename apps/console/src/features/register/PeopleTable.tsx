'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, DataTableColumnHeader } from '@mvp/kernel/ui/data-table';
import { Badge } from '@mvp/kernel/ui/badge';

export type PersonRow = {
  id: string;
  name: string;
  jobTitle: string;
  site: string;
  employmentType: 'Employee' | 'Subcontractor';
  expired: number;
  missing: number;
  expiring: number;
  valid: number;
};

function Count({ n, tone }: { n: number; tone: string }) {
  if (n === 0) return null;
  return <Badge variant="secondary" className={`border-0 font-medium ${tone}`}>{n}</Badge>;
}

export function PeopleTable({
  rows,
  showSite,
  onRowClick,
}: {
  rows: PersonRow[];
  showSite: boolean;
  onRowClick: (row: PersonRow) => void;
}) {
  const columns = React.useMemo<ColumnDef<PersonRow, unknown>[]>(() => {
    const cols: ColumnDef<PersonRow, unknown>[] = [
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Engineer" />,
        cell: ({ row }) => (
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-foreground">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">{row.original.jobTitle}</span>
          </span>
        ),
      },
    ];

    if (showSite) {
      cols.push({
        accessorKey: 'site',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Site" />,
        cell: ({ row }) => <span className="text-sm">{row.original.site}</span>,
      });
    }

    cols.push(
      {
        accessorKey: 'employmentType',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{row.original.employmentType}</span>
        ),
      },
      {
        id: 'position',
        header: 'Position',
        cell: ({ row }) => (
          <span className="flex items-center gap-1.5">
            <Count n={row.original.expired} tone="bg-destructive-soft text-destructive" />
            <Count n={row.original.missing} tone="bg-secondary text-secondary-foreground" />
            <Count n={row.original.expiring} tone="bg-warning-soft text-warning" />
            <Count n={row.original.valid} tone="bg-success-soft text-success" />
          </span>
        ),
      },
    );

    return cols;
  }, [showSite]);

  return (
    <DataTable
      columns={columns}
      data={rows}
      pageSize={12}
      searchPlaceholder="Search engineer"
      getRowId={(row) => row.id}
      onRowClick={onRowClick}
    />
  );
}
