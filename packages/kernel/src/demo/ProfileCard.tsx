'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Card } from '@mvp/kernel/ui/card';
import { Button } from '@mvp/kernel/ui/button';
import { Input } from '@mvp/kernel/ui/input';
import { Switch } from '@mvp/kernel/ui/switch';
import { Label } from '@mvp/kernel/ui/label';
import { Separator } from '@mvp/kernel/ui/separator';
import { Spinner } from '@mvp/kernel/ui/spinner';
import { FormField, FormRow, FormSection } from '@mvp/kernel/ui/form-layout';

export type ProfileFieldDef = { label: string; value: string };
export type ProfileToggleDef = { key: string; label: string; hint: string; on: boolean };

/* Every archetype ships a profile screen, so the form lives in the kernel and
   each app passes its own fields. A reskin edits the field list, never this. */
export function ProfileCard({
  readOnlyFields,
  email,
  phone,
  toggles,
}: {
  readOnlyFields: ProfileFieldDef[];
  email: string;
  phone: string;
  toggles: ProfileToggleDef[];
}) {
  const [contact, setContact] = React.useState({ email, phone });
  const [state, setState] = React.useState<Record<string, boolean>>(
    Object.fromEntries(toggles.map((t) => [t.key, t.on])),
  );
  const [saving, setSaving] = React.useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    toast.success('Profile updated');
  }

  return (
    <Card className="gap-0 p-5 shadow-none">
      <form onSubmit={submit}>
        <FormSection title="Details">
          {Array.from({ length: Math.ceil(readOnlyFields.length / 2) }, (_, i) => (
            <FormRow key={i} cols={2}>
              {readOnlyFields.slice(i * 2, i * 2 + 2).map((f) => (
                <FormField key={f.label} label={f.label} htmlFor={f.label}>
                  <Input id={f.label} value={f.value} readOnly className="bg-muted" />
                </FormField>
              ))}
            </FormRow>
          ))}
        </FormSection>

        <Separator className="my-5" />

        <FormSection title="Contact">
          <FormRow cols={2}>
            <FormField label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                value={contact.email}
                onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
              />
            </FormField>
            <FormField label="Mobile" htmlFor="phone">
              <Input
                id="phone"
                value={contact.phone}
                onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
              />
            </FormField>
          </FormRow>
        </FormSection>

        <Separator className="my-5" />

        <FormSection title="Notifications">
          {toggles.map((t) => (
            <div key={t.key} className="flex items-start justify-between gap-6 py-1.5">
              <div className="min-w-0">
                <Label htmlFor={t.key} className="text-sm font-medium">
                  {t.label}
                </Label>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.hint}</p>
              </div>
              <Switch
                id={t.key}
                checked={state[t.key] ?? false}
                onCheckedChange={(v: boolean) => setState((s) => ({ ...s, [t.key]: v }))}
              />
            </div>
          ))}
        </FormSection>

        <div className="flex justify-end pt-5">
          <Button type="submit" disabled={saving} className="font-semibold">
            {saving ? <Spinner className="size-4 border-primary-foreground/30 border-t-primary-foreground" /> : null}
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
