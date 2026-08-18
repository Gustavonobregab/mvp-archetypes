'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@mvp/kernel/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@mvp/kernel/ui/alert-dialog';
import { DashboardHeader } from '@mvp/kernel/dashboard';
import {
  RECORDS,
  registerForRole,
  type RegisterRow,
  type RoleKey,
  type TicketRecord,
} from '@/lib/domain';
import { RegisterTable } from '@/features/register/RegisterTable';
import { RecordDrawer } from '@/features/register/RecordDrawer';
import {
  EMPTY_DRAFT,
  TicketFormDialog,
  draftFromRecord,
  type TicketDraft,
} from '@/features/register/TicketFormDialog';

/* No database yet, so the register lives in client state. The point is that the
   actions genuinely mutate it: a button that does nothing reads worse to a
   visitor than no button at all. */
export function RegisterView({
  role,
  title,
  description,
  showSite,
  canEdit,
}: {
  role: RoleKey;
  title: string;
  description: string;
  showSite: boolean;
  canEdit: boolean;
}) {
  const [records, setRecords] = React.useState<TicketRecord[]>(RECORDS);
  const [viewing, setViewing] = React.useState<RegisterRow | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<TicketDraft>(EMPTY_DRAFT);
  const [pendingDelete, setPendingDelete] = React.useState<RegisterRow | null>(null);

  const rows = React.useMemo(() => registerForRole(role, records), [role, records]);

  function openCreate() {
    setDraft(EMPTY_DRAFT);
    setFormOpen(true);
  }

  function openRecordFor(row: RegisterRow) {
    setDraft({ ...EMPTY_DRAFT, personId: row.personId, ticketId: row.ticketId });
    setFormOpen(true);
  }

  function openEdit(row: RegisterRow) {
    const record = records.find((r) => r.id === row.id);
    if (!record) return;
    setDraft(draftFromRecord(record));
    setFormOpen(true);
  }

  function handleSubmit(next: TicketDraft) {
    const payload: TicketRecord = {
      id: next.id ?? `r-${Date.now()}`,
      personId: next.personId,
      ticketId: next.ticketId,
      awardedOn: next.awardedOn || null,
      expiresOn: next.expiresOn || null,
      certificateRef: next.certificateRef || null,
    };

    setRecords((prev) =>
      next.id ? prev.map((r) => (r.id === next.id ? payload : r)) : [...prev, payload],
    );
    setFormOpen(false);
    toast.success(next.id ? 'Certificate updated' : 'Certificate recorded');
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const removed = pendingDelete;
    setRecords((prev) => prev.filter((r) => r.id !== removed.id));
    setPendingDelete(null);
    setViewing(null);
    toast.success(`${removed.ticket} removed from ${removed.person}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader title={title} description={description}>
        {canEdit ? (
          <Button className="font-semibold" onClick={openCreate}>
            <Plus className="size-4" />
            Record certificate
          </Button>
        ) : null}
      </DashboardHeader>

      <RegisterTable
        rows={rows}
        showSite={showSite}
        canEdit={canEdit}
        onView={setViewing}
        onEdit={openEdit}
        onDelete={setPendingDelete}
        onRecord={openRecordFor}
      />

      <RecordDrawer
        row={viewing}
        canEdit={canEdit}
        onClose={() => setViewing(null)}
        onEdit={(row) => {
          setViewing(null);
          openEdit(row);
        }}
        onDelete={(row) => {
          setViewing(null);
          setPendingDelete(row);
        }}
      />

      <TicketFormDialog
        open={formOpen}
        draft={draft}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open: boolean) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this certificate?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `${pendingDelete.ticket} held by ${pendingDelete.person} will be taken off the register. If the ticket is mandatory the engineer will show as unable to be deployed.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
