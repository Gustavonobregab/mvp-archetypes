'use client';

import * as React from 'react';
import { MapPin, Star } from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '@mvp/kernel/dashboard';
import { Card } from '@mvp/kernel/ui/card';
import { Button } from '@mvp/kernel/ui/button';
import { Badge } from '@mvp/kernel/ui/badge';
import { SearchInput } from '@mvp/kernel/ui/search-input';
import { DataTableFilter } from '@mvp/kernel/ui/data-table-filter';
import {
  CATEGORY_LABEL,
  LISTINGS,
  PROVIDER_BY_ID,
  money,
  type Category,
  type Listing,
} from '@/lib/domain';
import { BookingDialog } from '@/features/browse/BookingDialog';

const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABEL) as Category[]).map((key) => ({
  label: CATEGORY_LABEL[key],
  value: key,
}));

export function BrowseView() {
  const [query, setQuery] = React.useState('');
  const [categories, setCategories] = React.useState<string[]>([]);
  const [booking, setBooking] = React.useState<Listing | null>(null);

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return LISTINGS.filter((l) => l.published)
      .filter((l) => (categories.length === 0 ? true : categories.includes(l.category)))
      .filter((l) =>
        q === '' ? true : `${l.title} ${l.suburb} ${l.blurb}`.toLowerCase().includes(q),
      );
  }, [query, categories]);

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader title="Browse" description="Gear listed by people near you." />

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search gear or suburb"
          className="h-8 w-full sm:w-64"
        />
        <DataTableFilter
          label="Category"
          options={CATEGORY_OPTIONS}
          selected={categories}
          onSelectedChange={setCategories}
          multiple
        />
      </div>

      {visible.length === 0 ? (
        <Card className="gap-0 p-10 text-center shadow-none">
          <p className="text-sm font-medium text-foreground">Nothing matches that search</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different suburb or clear the category filter.</p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((listing) => {
            const provider = PROVIDER_BY_ID[listing.providerId];
            return (
              <Card key={listing.id} className="gap-0 p-5 shadow-none">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{listing.title}</p>
                  <Badge variant="secondary" className="shrink-0 border-0">
                    {CATEGORY_LABEL[listing.category]}
                  </Badge>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">{listing.blurb}</p>

                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {listing.suburb}
                  </span>
                  {provider ? (
                    <span className="flex items-center gap-1">
                      <Star className="size-3.5" />
                      <span className="nv-num">{provider.rating.toFixed(1)}</span>
                      <span>{provider.name}</span>
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <p>
                    <span className="nv-num text-xl font-semibold text-foreground">
                      {money(listing.pricePerDay)}
                    </span>
                    <span className="text-sm text-muted-foreground"> per day</span>
                    <span className="block text-xs text-muted-foreground">
                      {money(listing.deposit)} deposit, refunded on return
                    </span>
                  </p>
                  <Button className="font-semibold" onClick={() => setBooking(listing)}>
                    Request
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <BookingDialog
        listing={booking}
        onClose={() => setBooking(null)}
        onConfirm={(l, from, to, total) => {
          setBooking(null);
          toast.success(`Request sent to ${PROVIDER_BY_ID[l.providerId]?.name} for ${money(total)}`);
        }}
      />
    </div>
  );
}
