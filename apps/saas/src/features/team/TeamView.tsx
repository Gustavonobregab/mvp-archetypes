'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Mail, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, DataTableColumnHeader } from '@mvp/kernel/ui/data-table';
import { DashboardHeader, StatCard } from '@mvp/kernel/dashboard';
import { Badge } from '@mvp/kernel/ui/badge';
import { Button } from '@mvp/kernel/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@mvp/kernel/ui/dialog';
import { FormField, FormRow, FormSection } from '@mvp/kernel/ui/form-layout';
import { Input } from '@mvp/kernel/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mvp/kernel/ui/select';
import {
  CURRENT_ORG_ID,
  MEMBERS,
  ORG_BY_ID,
  PLAN_BY_ID,
  formatDate,
  type Member,
} from '@/lib/domain';

export function TeamView() {
  const [members, setMembers] = React.useState<Member[]>(MEMBERS);
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<Member['role']>('Fitter');
  const [error, setError] = React.useState<string | undefined>();

  const org = ORG_BY_ID[CURRENT_ORG_ID];
  const plan = org ? PLAN_BY_ID[org.planId] : undefined;
  const mine = members.filter((m) => m.orgId === CURRENT_ORG_ID);
  const seatsLeft = (plan?.seats ?? 0) - mine.length;

  function invite() {
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    if (seatsLeft <= 0) {
      setError('No seats left on this plan. Upgrade in Billing first.');
      return;
    }
    setMembers((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        orgId: CURRENT_ORG_ID,
        name: email.split('@')[0] ?? email,
        email,
        role,
        invitedOn: new Date().toISOString().slice(0, 10),
        acceptedOn: null,
      },
    ]);
    setOpen(false);
    setEmail('');
    setError(undefined);
    toast.success(`Invite sent to ${email}`);
  }

  const columns = React.useMemo<ColumnDef<Member, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Member" />,
        cell: ({ row }) => (
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-foreground">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">{row.original.email}</span>
          </span>
        ),
      },
      {
        accessorKey: 'role',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
        cell: ({ row }) => <span className="text-sm">{row.original.role}</span>,
      },
      {
        accessorKey: 'acceptedOn',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) =>
          row.original.acceptedOn ? (
            <Badge variant="secondary" className="border-0 bg-success-soft font-medium text-success">
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="border-0 bg-warning-soft font-medium text-warning">
              Invite pending
            </Badge>
          ),
      },
      {
        accessorKey: 'invitedOn',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Invited" />,
        cell: ({ row }) => <span className="nv-num text-sm">{formatDate(row.original.invitedOn)}</span>,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            {!row.original.acceptedOn ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground"
                aria-label={`Resend invite to ${row.original.email}`}
                onClick={() => toast.success(`Invite resent to ${row.original.email}`)}
              >
                <Mail className="size-3.5" />
              </Button>
            ) : null}
            {row.original.role !== 'Owner' ? (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${row.original.name}`}
                onClick={() => {
                  setMembers((prev) => prev.filter((m) => m.id !== row.original.id));
                  toast.success(`${row.original.name} removed from the team`);
                }}
              >
                <Trash2 className="size-3.5" />
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader title="Team" description="Who can log in, and what they can do.">
        <Button className="font-semibold" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Invite member
        </Button>
      </DashboardHeader>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Members" value={mine.length} sub={`on the ${plan?.name} plan`} />
        <StatCard label="Seats left" value={Math.max(0, seatsLeft)} sub={`${plan?.seats} included`} />
        <StatCard label="Pending invites" value={mine.filter((m) => !m.acceptedOn).length} sub="not accepted yet" />
      </div>

      <DataTable columns={columns} data={mine} pageSize={10} searchPlaceholder="Search member" getRowId={(r) => r.id} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite a team member</DialogTitle>
            <DialogDescription>They get an email with a link to set their own password.</DialogDescription>
          </DialogHeader>

          <FormSection className="py-4">
            <FormRow cols={2}>
              <FormField label="Email" htmlFor="inviteEmail" required error={error}>
                <Input id="inviteEmail" type="email" value={email} aria-invalid={!!error} onChange={(e) => setEmail(e.target.value)} placeholder="name@firm.co.uk" />
              </FormField>
              <FormField label="Role" htmlFor="inviteRole">
                <Select value={role} onValueChange={(v: string) => setRole(v as Member['role'])}>
                  <SelectTrigger id="inviteRole">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fitter">Fitter</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </FormRow>
          </FormSection>

          <DialogFooter>
            <Button variant="outline" className="border-border bg-card font-semibold" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="font-semibold" onClick={invite}>
              Send invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
