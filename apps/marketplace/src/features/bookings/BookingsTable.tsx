'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Check, MoreHorizontal, X } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, DataTableColumnHeader } from '@mvp/kernel/ui/data-table';
import { DashboardHeader, StatCard } from '@mvp/kernel/dashboard';
import { Badge } from '@mvp/kernel/ui/badge';
import { Button } from '@mvp/kernel/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@mvp/kernel/ui/dropdown-menu';
import {
  BOOKINGS,
  BOOKING_LABEL,
  CURRENT_PROVIDER_ID,
  CURRENT_RENTER,
  LISTING_BY_ID,
  formatDate,
  money,
  type Booking,
  type BookingStatus,
} from '@/lib/domain';

const TONE: Record<BookingStatus, string> = {
  requested: 'bg-warning-soft text-warning',
  confirmed: 'bg-info-soft text-info',
  out: 'bg-primary/10 text-primary',
  returned: 'bg-success-soft text-success',
  declined: 'bg-secondary text-secondary-foreground',
};

/* Same table, two sides. The renter sees what they asked for; the lender sees
   what was asked of them and can act on it. */
export function BookingsTable({ side }: { side: 'renter' | 'provider' }) {
  const [bookings, setBookings] = React.useState<Booking[]>(BOOKINGS);

  const mine = React.useMemo(
    () =>
      bookings.filter((b) =>
        side === 'renter'
          ? b.renter === CURRENT_RENTER
          : LISTING_BY_ID[b.listingId]?.providerId === CURRENT_PROVIDER_ID,
      ),
    [bookings, side],
  );

  function setStatus(booking: Booking, status: BookingStatus, message: string) {
    setBookings((prev) => prev.map((b) => (b.id === booking.id ? { ...b, status } : b)));
    toast.success(message);
  }

  const columns = React.useMemo<ColumnDef<Booking, unknown>[]>(() => {
    const cols: ColumnDef<Booking, unknown>[] = [
      {
        accessorKey: 'listingId',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Item" />,
        cell: ({ row }) => {
          const listing = LISTING_BY_ID[row.original.listingId];
          return (
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-foreground">{listing?.title}</span>
              <span className="text-xs text-muted-foreground">{listing?.suburb}</span>
            </span>
          );
        },
      },
      {
        accessorKey: 'renter',
        header: ({ column }) => <DataTableColumnHeader column={column} title={side === 'renter' ? 'Lender' : 'Renter'} />,
        cell: ({ row }) => <span className="text-sm">{row.original.renter}</span>,
      },
      {
        accessorKey: 'from',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Dates" />,
        cell: ({ row }) => (
          <span className="nv-num text-sm">
            {formatDate(row.original.from)} to {formatDate(row.original.to)}
          </span>
        ),
      },
      {
        accessorKey: 'total',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
        cell: ({ row }) => <span className="nv-num text-sm">{money(row.original.total)}</span>,
      },
      {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => (
          <Badge variant="secondary" className={`border-0 font-medium ${TONE[row.original.status]}`}>
            {BOOKING_LABEL[row.original.status]}
          </Badge>
        ),
      },
    ];

    if (side === 'provider') {
      cols.push({
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const b = row.original;
          if (b.status === 'returned' || b.status === 'declined') return null;
          return (
            <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
              {b.status === 'requested' ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-success"
                    aria-label={`Approve ${b.renter}`}
                    onClick={() => setStatus(b, 'confirmed', `Booking approved for ${b.renter}`)}
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-destructive"
                    aria-label={`Decline ${b.renter}`}
                    onClick={() => setStatus(b, 'declined', `Booking declined for ${b.renter}`)}
                  >
                    <X className="size-4" />
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-7 text-muted-foreground" aria-label={`Actions for ${b.renter}`}>
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {b.status === 'confirmed' ? (
                      <DropdownMenuItem onSelect={() => setStatus(b, 'out', `${b.renter} picked the item up`)}>
                        Mark as picked up
                      </DropdownMenuItem>
                    ) : null}
                    {b.status === 'out' ? (
                      <DropdownMenuItem onSelect={() => setStatus(b, 'returned', `Item returned, deposit released`)}>
                        Mark as returned
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        },
      });
    }

    return cols;
  }, [side]);

  const earned = mine.filter((b) => b.status === 'returned').reduce((s, b) => s + b.total, 0);
  const pending = mine.filter((b) => b.status === 'requested').length;

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader
        title={side === 'renter' ? 'My bookings' : 'Requests'}
        description={side === 'renter' ? 'What you have asked for and what is confirmed.' : 'Approve or decline, then track the handover.'}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label={side === 'renter' ? 'Bookings' : 'Requests'} value={mine.length} sub="all time" />
        <StatCard label="Awaiting approval" value={pending} sub={side === 'renter' ? 'lender has not replied' : 'needs your answer'} />
        <StatCard label={side === 'renter' ? 'Spent' : 'Earned'} value={money(earned)} sub="on completed rentals" />
      </div>

      <DataTable columns={columns} data={mine} pageSize={10} searchPlaceholder="Search booking" getRowId={(r) => r.id} />
    </div>
  );
}
