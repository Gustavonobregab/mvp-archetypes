'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@mvp/kernel/ui/dialog';
import { FormField, FormRow, FormSection } from '@mvp/kernel/ui/form-layout';
import { Button } from '@mvp/kernel/ui/button';
import { Input } from '@mvp/kernel/ui/input';
import { Spinner } from '@mvp/kernel/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@mvp/kernel/ui/select';
import { PEOPLE, TICKETS, TICKET_BY_ID, type TicketRecord } from '@/lib/domain';

export type TicketDraft = {
  id: string | null;
  personId: string;
  ticketId: string;
  awardedOn: string;
  expiresOn: string;
  certificateRef: string;
};

export const EMPTY_DRAFT: TicketDraft = {
  id: null,
  personId: '',
  ticketId: '',
  awardedOn: '',
  expiresOn: '',
  certificateRef: '',
};

export function draftFromRecord(record: TicketRecord): TicketDraft {
  return {
    id: record.id,
    personId: record.personId,
    ticketId: record.ticketId,
    awardedOn: record.awardedOn ?? '',
    expiresOn: record.expiresOn ?? '',
    certificateRef: record.certificateRef ?? '',
  };
}

type Errors = Partial<Record<keyof TicketDraft, string>>;

function validate(draft: TicketDraft): Errors {
  const errors: Errors = {};
  if (!draft.personId) errors.personId = 'Pick an engineer.';
  if (!draft.ticketId) errors.ticketId = 'Pick a ticket.';
  if (!draft.awardedOn) errors.awardedOn = 'Award date is required.';
  if (draft.awardedOn && draft.expiresOn && draft.expiresOn <= draft.awardedOn) {
    errors.expiresOn = 'Expiry must come after the award date.';
  }
  return errors;
}

/* Awarding bodies set the validity period, so the expiry is derived rather than
   typed. The operator can still override it. */
function addMonths(iso: string, months: number): string {
  const date = new Date(iso);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

export function TicketFormDialog({
  open,
  draft,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  draft: TicketDraft;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: TicketDraft) => void;
}) {
  const [form, setForm] = React.useState<TicketDraft>(draft);
  const [errors, setErrors] = React.useState<Errors>({});
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setForm(draft);
      setErrors({});
      setSaving(false);
    }
  }, [open, draft]);

  const isEdit = form.id !== null;

  function set<K extends keyof TicketDraft>(key: K, value: TicketDraft[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'ticketId' && next.awardedOn) {
        const ticket = TICKET_BY_ID[String(value)];
        if (ticket) next.expiresOn = addMonths(next.awardedOn, ticket.validityMonths);
      }
      if (key === 'awardedOn' && next.ticketId && typeof value === 'string' && value) {
        const ticket = TICKET_BY_ID[next.ticketId];
        if (ticket) next.expiresOn = addMonths(value, ticket.validityMonths);
      }
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    onSubmit(form);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit certificate' : 'Record a certificate'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update the award details held against this engineer.'
                : 'Log a ticket an engineer has completed so the register stays current.'}
            </DialogDescription>
          </DialogHeader>

          <FormSection className="py-4">
            <FormRow cols={2}>
              <FormField label="Engineer" htmlFor="personId" required error={errors.personId}>
                <Select
                  value={form.personId}
                  onValueChange={(value: string) => set('personId', value)}
                  disabled={isEdit}
                >
                  <SelectTrigger id="personId" aria-invalid={!!errors.personId}>
                    <SelectValue placeholder="Select engineer" />
                  </SelectTrigger>
                  <SelectContent>
                    {PEOPLE.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Ticket" htmlFor="ticketId" required error={errors.ticketId}>
                <Select
                  value={form.ticketId}
                  onValueChange={(value: string) => set('ticketId', value)}
                  disabled={isEdit}
                >
                  <SelectTrigger id="ticketId" aria-invalid={!!errors.ticketId}>
                    <SelectValue placeholder="Select ticket" />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKETS.map((ticket) => (
                      <SelectItem key={ticket.id} value={ticket.id}>
                        {ticket.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </FormRow>

            <FormRow cols={2}>
              <FormField label="Awarded on" htmlFor="awardedOn" required error={errors.awardedOn}>
                <Input
                  id="awardedOn"
                  type="date"
                  value={form.awardedOn}
                  aria-invalid={!!errors.awardedOn}
                  onChange={(event) => set('awardedOn', event.target.value)}
                />
              </FormField>

              <FormField
                label="Expires on"
                htmlFor="expiresOn"
                error={errors.expiresOn}
                hint={
                  form.ticketId && TICKET_BY_ID[form.ticketId]
                    ? `${TICKET_BY_ID[form.ticketId]?.validityMonths} month validity`
                    : undefined
                }
              >
                <Input
                  id="expiresOn"
                  type="date"
                  value={form.expiresOn}
                  aria-invalid={!!errors.expiresOn}
                  onChange={(event) => set('expiresOn', event.target.value)}
                />
              </FormField>
            </FormRow>

            <FormField label="Certificate reference" htmlFor="certificateRef">
              <Input
                id="certificateRef"
                placeholder="UKATA-55120"
                value={form.certificateRef}
                onChange={(event) => set('certificateRef', event.target.value)}
              />
            </FormField>
          </FormSection>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-border bg-card font-semibold"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="font-semibold">
              {saving ? (
                <Spinner className="size-4 border-primary-foreground/30 border-t-primary-foreground" />
              ) : null}
              {isEdit ? 'Save changes' : 'Record certificate'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
