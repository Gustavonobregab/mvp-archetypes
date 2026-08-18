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

export function ProfileForm({
  name,
  jobTitle,
  site,
  employmentType,
  roleLabel,
  org,
  startedOn,
}: {
  name: string;
  jobTitle: string;
  site: string;
  employmentType: string;
  roleLabel: string;
  org: string;
  startedOn: string;
}) {
  const [email, setEmail] = React.useState(
    `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@kestrelfm.co.uk`,
  );
  const [phone, setPhone] = React.useState('07700 900412');
  const [expiryAlerts, setExpiryAlerts] = React.useState(true);
  const [weeklyDigest, setWeeklyDigest] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSaving(false);
    toast.success('Profile updated');
  }

  return (
    <Card className="gap-0 p-5 shadow-none">
      <form onSubmit={handleSubmit}>
        <FormSection title="Details">
          <FormRow cols={2}>
            <FormField label="Name" htmlFor="name">
              <Input id="name" value={name} readOnly className="bg-muted" />
            </FormField>
            <FormField label="Job title" htmlFor="jobTitle">
              <Input id="jobTitle" value={jobTitle} readOnly className="bg-muted" />
            </FormField>
          </FormRow>

          <FormRow cols={2}>
            <FormField label="Site" htmlFor="site">
              <Input id="site" value={site} readOnly className="bg-muted" />
            </FormField>
            <FormField label="Employment" htmlFor="employment">
              <Input id="employment" value={employmentType} readOnly className="bg-muted" />
            </FormField>
          </FormRow>

          <FormRow cols={2}>
            <FormField label="Access level" htmlFor="role">
              <Input id="role" value={roleLabel} readOnly className="bg-muted" />
            </FormField>
            <FormField label="Started" htmlFor="started">
              <Input id="started" value={startedOn} readOnly className="bg-muted" />
            </FormField>
          </FormRow>
        </FormSection>

        <Separator className="my-5" />

        <FormSection title="Contact">
          <FormRow cols={2}>
            <FormField label="Email" htmlFor="email" hint="Where renewal reminders are sent">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormField>
            <FormField label="Mobile" htmlFor="phone">
              <Input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </FormField>
          </FormRow>
        </FormSection>

        <Separator className="my-5" />

        <FormSection title="Notifications">
          <div className="flex items-start justify-between gap-6 py-1.5">
            <div className="min-w-0">
              <Label htmlFor="expiryAlerts" className="text-sm font-medium">
                Expiry alerts
              </Label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Email 60, 30 and 7 days before a ticket lapses.
              </p>
            </div>
            <Switch id="expiryAlerts" checked={expiryAlerts} onCheckedChange={setExpiryAlerts} />
          </div>

          <div className="flex items-start justify-between gap-6 py-1.5">
            <div className="min-w-0">
              <Label htmlFor="weeklyDigest" className="text-sm font-medium">
                Weekly digest
              </Label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Monday summary of everything lapsing at {org}.
              </p>
            </div>
            <Switch id="weeklyDigest" checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
          </div>
        </FormSection>

        <div className="flex justify-end pt-5">
          <Button type="submit" disabled={saving} className="font-semibold">
            {saving ? (
              <Spinner className="size-4 border-primary-foreground/30 border-t-primary-foreground" />
            ) : null}
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
