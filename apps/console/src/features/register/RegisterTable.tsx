'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable, DataTableColumnHeader } from '@mvp/kernel/ui/data-table';
import { DataTableFilter } from '@mvp/kernel/ui/data-table-filter';
import { formatDate, STATUS_LABEL, type RecordStatus, type RegisterRow } from '@/lib/domain';
import { StatusBadge } from '@/features/register/StatusBadge';
import { RowActions } from '@/features/register/RowActions';

/* Worst first: an expired mandatory ticket is the reason someone opens this
   screen, so it must not be buried under valid rows. */
const STATUS_ORDER: Record<RecordStatus, number> = {
  expired: 0,
  missing: 1,
  expiring: 2,
  valid: 3,
};

const STATUS_OPTIONS = (Object.keys(STATUS_LABEL) as RecordStatus[]).map((key) => ({
  label: STATUS_LABEL[key],
  value: key,
}));

function ExpiryCell({ row }: { row: RegisterRow }) {
  if (!row.expiresOn) return null;
  const days = row.daysLeft;
  return (
    <span className="flex flex-col leading-tight">
      <span className="nv-num text-sm">{formatDate(row.expiresOn)}</span>
      {days !== null && days <= 60 ? (
        <span className="text-xs text-muted-foreground">
          {days < 0 ? `${Math.abs(days)} days ago` : `in ${days} days`}
        </span>
      ) : null}
    </span>
  );
}

export function RegisterTable({
  rows,
  showSite,
  canEdit,
  onView,
  onEdit,
  onDelete,
  onRecord,
}: {
  rows: RegisterRow[];
  showSite: boolean;
  canEdit: boolean;
  onView: (row: RegisterRow) => void;
  onEdit: (row: RegisterRow) => void;
  onDelete: (row: RegisterRow) => void;
  onRecord: (row: RegisterRow) => void;
}) {
  const [statuses, setStatuses] = React.useState<string[]>([]);

  const visible = React.useMemo(() => {
    const filtered =
      statuses.length === 0 ? rows : rows.filter((r) => statuses.includes(r.status));
    return [...filtered].sort(
      (a, b) =>
        STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
        (a.daysLeft ?? 0) - (b.daysLeft ?? 0),
    );
  }, [rows, statuses]);

  const columns = React.useMemo<ColumnDef<RegisterRow, unknown>[]>(() => {
    const cols: ColumnDef<RegisterRow, unknown>[] = [
      {
        accessorKey: 'person',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Engineer" />,
        cell: ({ row }) => (
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-foreground">{row.original.person}</span>
            <span className="text-xs text-muted-foreground">{row.original.jobTitle}</span>
          </span>
        ),
      },
      {
        accessorKey: 'ticket',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ticket" />,
        cell: ({ row }) => (
          <span className="flex flex-col leading-tight">
            <span className="text-sm text-foreground">{row.original.ticket}</span>
            <span className="text-xs text-muted-foreground">{row.original.body}</span>
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
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'expiresOn',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Expires" />,
        cell: ({ row }) => <ExpiryCell row={row.original} />,
      },
      {
        accessorKey: 'certificateRef',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Certificate" />,
        cell: ({ row }) =>
          row.original.certificateRef ? (
            <span className="nv-num text-xs text-muted-foreground">
              {row.original.certificateRef}
            </span>
          ) : null,
      },
    );

    if (canEdit) {
      cols.push({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <RowActions
            row={row.original}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onRecord={onRecord}
          />
        ),
      });
    }

    return cols;
  }, [showSite, canEdit, onView, onEdit, onDelete, onRecord]);

  return (
    <DataTable
      columns={columns}
      data={visible}
      pageSize={12}
      searchPlaceholder="Search engineer or ticket"
      getRowId={(row) => row.id}
      onRowClick={onView}
      filterbar={() => (
        <DataTableFilter
          label="Status"
          options={STATUS_OPTIONS}
          selected={statuses}
          onSelectedChange={setStatuses}
          multiple
        />
      )}
    />
  );
}
