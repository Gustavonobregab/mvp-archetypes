'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@mvp/kernel/ui/dialog';
import { FormField, FormRow, FormSection } from '@mvp/kernel/ui/form-layout';
import { Button } from '@mvp/kernel/ui/button';
import { Input } from '@mvp/kernel/ui/input';
import { Separator } from '@mvp/kernel/ui/separator';
import { Spinner } from '@mvp/kernel/ui/spinner';
import { money, nights, type Listing } from '@/lib/domain';

export function BookingDialog({
  listing,
  onClose,
  onConfirm,
}: {
  listing: Listing | null;
  onClose: () => void;
  onConfirm: (listing: Listing, from: string, to: string, total: number) => void;
}) {
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (listing) {
      setFrom('');
      setTo('');
      setError(undefined);
      setSaving(false);
    }
  }, [listing]);

  const days = from && to ? nights(from, to) : 0;
  const total = listing ? days * listing.pricePerDay : 0;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!listing) return;
    if (!from || !to) {
      setError('Pick both dates.');
      return;
    }
    if (to <= from) {
      setError('The return date must be after the pickup date.');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    onConfirm(listing, from, to, total);
  }

  return (
    <Dialog open={listing !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {listing ? (
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>Request {listing.title}</DialogTitle>
              <DialogDescription>
                The lender approves the request before any money moves.
              </DialogDescription>
            </DialogHeader>

            <FormSection className="py-4">
              <FormRow cols={2}>
                <FormField label="Pick up" htmlFor="from" required error={error}>
                  <Input id="from" type="date" value={from} aria-invalid={!!error} onChange={(e) => setFrom(e.target.value)} />
                </FormField>
                <FormField label="Return" htmlFor="to" required>
                  <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                </FormField>
              </FormRow>

              {days > 0 ? (
                <>
                  <Separator />
                  <div className="flex items-baseline justify-between py-1.5 text-sm">
                    <span className="text-muted-foreground">
                      {money(listing.pricePerDay)} x {days} {days === 1 ? 'day' : 'days'}
                    </span>
                    <span className="nv-num">{money(total)}</span>
                  </div>
                  <div className="flex items-baseline justify-between py-1.5 text-sm">
                    <span className="text-muted-foreground">Refundable deposit</span>
                    <span className="nv-num">{money(listing.deposit)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-baseline justify-between py-1.5">
                    <span className="text-sm font-medium">Due today</span>
                    <span className="nv-num text-base font-semibold">{money(total + listing.deposit)}</span>
                  </div>
                </>
              ) : null}
            </FormSection>

            <DialogFooter>
              <Button type="button" variant="outline" className="border-border bg-card font-semibold" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="font-semibold">
                {saving ? <Spinner className="size-4 border-primary-foreground/30 border-t-primary-foreground" /> : null}
                Send request
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
