'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@mvp/kernel/ui/sheet';
import { Separator } from '@mvp/kernel/ui/separator';
import { Button } from '@mvp/kernel/ui/button';
import { StatusBadge } from '@/features/register/StatusBadge';
import { formatDate, type RegisterRow } from '@/lib/domain';
import type { PersonRow } from '@/features/register/PeopleTable';

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right text-sm text-foreground">{value}</span>
    </div>
  );
}

export function PersonDrawer({
  person,
  rows,
  onClose,
}: {
  person: PersonRow | null;
  rows: RegisterRow[];
  onClose: () => void;
}) {
  const own = person ? rows.filter((r) => r.personId === person.id) : [];
  const blocked = own.some((r) => r.mandatory && (r.status === 'expired' || r.status === 'missing'));

  return (
    <Sheet open={person !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        {person ? (
          <>
            <SheetHeader className="gap-1">
              <SheetTitle className="text-base">{person.name}</SheetTitle>
              <SheetDescription>
                {person.jobTitle}
                {person.site ? ` at ${person.site}` : null}
              </SheetDescription>
              {blocked ? (
                <p className="pt-2 text-sm text-destructive">
                  Cannot be deployed. A mandatory ticket is expired or not held.
                </p>
              ) : null}
            </SheetHeader>

            <div className="px-4">
              <Separator />
              <Field label="Employment" value={person.employmentType} />
              <Field label="Site" value={person.site} />
              <Separator />

              <p className="pt-3 text-xs text-muted-foreground">Tickets</p>
              <ul className="mt-1 divide-y divide-border">
                {own.map((row) => (
                  <li key={row.id} className="flex items-center gap-3 py-2.5">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-foreground">{row.ticket}</span>
                      {row.expiresOn ? (
                        <span className="nv-num block text-xs text-muted-foreground">
                          {formatDate(row.expiresOn)}
                        </span>
                      ) : null}
                    </span>
                    <StatusBadge status={row.status} />
                  </li>
                ))}
              </ul>

              <div className="py-4">
                <Button variant="outline" className="border-border bg-card font-semibold" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
