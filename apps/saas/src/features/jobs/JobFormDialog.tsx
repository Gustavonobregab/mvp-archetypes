'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@mvp/kernel/ui/dialog';
import { FormField, FormRow, FormSection } from '@mvp/kernel/ui/form-layout';
import { Button } from '@mvp/kernel/ui/button';
import { Input } from '@mvp/kernel/ui/input';
import { Spinner } from '@mvp/kernel/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mvp/kernel/ui/select';
import { MEMBERS, STAGE_LABEL, STAGE_ORDER, type JobStage } from '@/lib/domain';

export type JobDraft = {
  id: string | null;
  customer: string;
  address: string;
  stage: JobStage;
  value: string;
  startsOn: string;
  assignedTo: string;
};

export const EMPTY_JOB: JobDraft = {
  id: null,
  customer: '',
  address: '',
  stage: 'quote',
  value: '',
  startsOn: '',
  assignedTo: '',
};

type Errors = Partial<Record<keyof JobDraft, string>>;

function validate(d: JobDraft): Errors {
  const e: Errors = {};
  if (!d.customer.trim()) e.customer = 'Customer name is required.';
  if (!d.address.trim()) e.address = 'Address is required.';
  if (!d.value || Number(d.value) <= 0) e.value = 'Enter a value above zero.';
  if (!d.startsOn) e.startsOn = 'Pick a start date.';
  return e;
}

export function JobFormDialog({
  open,
  draft,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  draft: JobDraft;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: JobDraft) => void;
}) {
  const [form, setForm] = React.useState<JobDraft>(draft);
  const [errors, setErrors] = React.useState<Errors>({});
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setForm(draft);
      setErrors({});
      setSaving(false);
    }
  }, [open, draft]);

  function set<K extends keyof JobDraft>(key: K, value: JobDraft[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    onSubmit(form);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{form.id ? 'Edit job' : 'New job'}</DialogTitle>
            <DialogDescription>
              {form.id ? 'Update the details of this job.' : 'Start a job from a quote and schedule the fit.'}
            </DialogDescription>
          </DialogHeader>

          <FormSection className="py-4">
            <FormField label="Customer" htmlFor="customer" required error={errors.customer}>
              <Input id="customer" value={form.customer} aria-invalid={!!errors.customer} onChange={(e) => set('customer', e.target.value)} placeholder="Mrs Okafor" />
            </FormField>

            <FormField label="Address" htmlFor="address" required error={errors.address}>
              <Input id="address" value={form.address} aria-invalid={!!errors.address} onChange={(e) => set('address', e.target.value)} placeholder="14 Bramley Rise, Guildford" />
            </FormField>

            <FormRow cols={2}>
              <FormField label="Value" htmlFor="value" required error={errors.value} hint="Excluding VAT">
                <Input id="value" type="number" value={form.value} aria-invalid={!!errors.value} onChange={(e) => set('value', e.target.value)} placeholder="8400" />
              </FormField>
              <FormField label="Starts on" htmlFor="startsOn" required error={errors.startsOn}>
                <Input id="startsOn" type="date" value={form.startsOn} aria-invalid={!!errors.startsOn} onChange={(e) => set('startsOn', e.target.value)} />
              </FormField>
            </FormRow>

            <FormRow cols={2}>
              <FormField label="Stage" htmlFor="stage">
                <Select value={form.stage} onValueChange={(v: string) => set('stage', v as JobStage)}>
                  <SelectTrigger id="stage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGE_ORDER.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STAGE_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Fitter" htmlFor="assignedTo">
                <Select value={form.assignedTo} onValueChange={(v: string) => set('assignedTo', v)}>
                  <SelectTrigger id="assignedTo">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEMBERS.filter((m) => m.acceptedOn).map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </FormRow>
          </FormSection>

          <DialogFooter>
            <Button type="button" variant="outline" className="border-border bg-card font-semibold" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="font-semibold">
              {saving ? <Spinner className="size-4 border-primary-foreground/30 border-t-primary-foreground" /> : null}
              {form.id ? 'Save changes' : 'Create job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
