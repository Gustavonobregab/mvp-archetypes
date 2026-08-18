'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader, StatCard } from '@mvp/kernel/dashboard';
import { Card } from '@mvp/kernel/ui/card';
import { Button } from '@mvp/kernel/ui/button';
import { Badge } from '@mvp/kernel/ui/badge';
import { Switch } from '@mvp/kernel/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@mvp/kernel/ui/dialog';
import { FormField, FormRow, FormSection } from '@mvp/kernel/ui/form-layout';
import { Input } from '@mvp/kernel/ui/input';
import { Textarea } from '@mvp/kernel/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mvp/kernel/ui/select';
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
import {
  BOOKINGS,
  CATEGORY_LABEL,
  CURRENT_PROVIDER_ID,
  LISTINGS,
  PROVIDER_BY_ID,
  money,
  type Category,
  type Listing,
} from '@/lib/domain';

type Draft = { id: string | null; title: string; category: Category; pricePerDay: string; deposit: string; blurb: string };

const EMPTY: Draft = { id: null, title: '', category: 'tools', pricePerDay: '', deposit: '', blurb: '' };

export function MyListingsView() {
  const [listings, setListings] = React.useState<Listing[]>(LISTINGS);
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft>(EMPTY);
  const [errors, setErrors] = React.useState<Partial<Record<keyof Draft, string>>>({});
  const [pendingDelete, setPendingDelete] = React.useState<Listing | null>(null);

  const provider = PROVIDER_BY_ID[CURRENT_PROVIDER_ID];
  const mine = listings.filter((l) => l.providerId === CURRENT_PROVIDER_ID);
  const earned = BOOKINGS.filter(
    (b) => b.status === 'returned' && listings.find((l) => l.id === b.listingId)?.providerId === CURRENT_PROVIDER_ID,
  ).reduce((s, b) => s + b.total, 0);

  function save() {
    const found: Partial<Record<keyof Draft, string>> = {};
    if (!draft.title.trim()) found.title = 'Give the item a name.';
    if (!draft.pricePerDay || Number(draft.pricePerDay) <= 0) found.pricePerDay = 'Set a daily price.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload: Listing = {
      id: draft.id ?? `l-${Date.now()}`,
      providerId: CURRENT_PROVIDER_ID,
      title: draft.title,
      category: draft.category,
      pricePerDay: Number(draft.pricePerDay),
      deposit: Number(draft.deposit) || 0,
      suburb: provider?.suburb ?? '',
      published: true,
      blurb: draft.blurb,
    };
    setListings((prev) => (draft.id ? prev.map((l) => (l.id === draft.id ? payload : l)) : [payload, ...prev]));
    setOpen(false);
    toast.success(draft.id ? 'Listing updated' : 'Listing published');
  }

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader title="My listings" description="The gear you lend out and what it earns.">
        <Button
          className="font-semibold"
          onClick={() => {
            setDraft(EMPTY);
            setErrors({});
            setOpen(true);
          }}
        >
          <Plus className="size-4" />
          New listing
        </Button>
      </DashboardHeader>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Listings" value={mine.length} sub={`${mine.filter((l) => l.published).length} published`} />
        <StatCard label="Earned" value={money(earned)} sub="on completed rentals" />
        <StatCard label="Rating" value={provider?.rating.toFixed(1) ?? ''} sub={`across ${provider?.lends} lends`} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mine.map((listing) => (
          <Card key={listing.id} className="gap-0 p-5 shadow-none">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">{listing.title}</p>
              <Badge variant="secondary" className="shrink-0 border-0">
                {CATEGORY_LABEL[listing.category]}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{listing.blurb}</p>
            <p className="mt-3">
              <span className="nv-num text-lg font-semibold text-foreground">{money(listing.pricePerDay)}</span>
              <span className="text-sm text-muted-foreground"> per day</span>
            </p>

            <div className="mt-4 flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Switch
                  checked={listing.published}
                  onCheckedChange={(checked: boolean) => {
                    setListings((prev) => prev.map((l) => (l.id === listing.id ? { ...l, published: checked } : l)));
                    toast.success(checked ? `${listing.title} is live` : `${listing.title} hidden from search`);
                  }}
                />
                {listing.published ? 'Live' : 'Hidden'}
              </label>

              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  className="h-7 border-border bg-card px-2 text-xs font-semibold"
                  onClick={() => {
                    setDraft({
                      id: listing.id,
                      title: listing.title,
                      category: listing.category,
                      pricePerDay: String(listing.pricePerDay),
                      deposit: String(listing.deposit),
                      blurb: listing.blurb,
                    });
                    setErrors({});
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="h-7 border-border bg-card px-2 text-xs font-semibold text-muted-foreground hover:text-destructive"
                  onClick={() => setPendingDelete(listing)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft.id ? 'Edit listing' : 'New listing'}</DialogTitle>
            <DialogDescription>Renters see this straight away once it is live.</DialogDescription>
          </DialogHeader>

          <FormSection className="py-4">
            <FormField label="Item" htmlFor="title" required error={errors.title}>
              <Input id="title" value={draft.title} aria-invalid={!!errors.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Makita 18V Circular Saw" />
            </FormField>

            <FormRow cols={3}>
              <FormField label="Category" htmlFor="category">
                <Select value={draft.category} onValueChange={(v: string) => setDraft({ ...draft, category: v as Category })}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
                      <SelectItem key={c} value={c}>
                        {CATEGORY_LABEL[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Per day" htmlFor="price" required error={errors.pricePerDay}>
                <Input id="price" type="number" value={draft.pricePerDay} aria-invalid={!!errors.pricePerDay} onChange={(e) => setDraft({ ...draft, pricePerDay: e.target.value })} placeholder="24" />
              </FormField>
              <FormField label="Deposit" htmlFor="deposit" hint="Refunded on return">
                <Input id="deposit" type="number" value={draft.deposit} onChange={(e) => setDraft({ ...draft, deposit: e.target.value })} placeholder="120" />
              </FormField>
            </FormRow>

            <FormField label="Description" htmlFor="blurb">
              <Textarea id="blurb" value={draft.blurb} onChange={(e) => setDraft({ ...draft, blurb: e.target.value })} placeholder="What is included, and anything a renter needs to know." rows={3} />
            </FormField>
          </FormSection>

          <DialogFooter>
            <Button variant="outline" className="border-border bg-card font-semibold" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="font-semibold" onClick={save}>
              {draft.id ? 'Save changes' : 'Publish listing'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(o: boolean) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete ? `${pendingDelete.title} will be removed. Bookings already confirmed are not affected.` : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!pendingDelete) return;
                setListings((prev) => prev.filter((l) => l.id !== pendingDelete.id));
                toast.success(`${pendingDelete.title} deleted`);
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
