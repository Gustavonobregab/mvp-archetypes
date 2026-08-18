'use client';

import { toast } from 'sonner';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@mvp/kernel/ui/sheet';
import { Button } from '@mvp/kernel/ui/button';
import { Separator } from '@mvp/kernel/ui/separator';
import { formatDate, type RegisterRow } from '@/lib/domain';
import { StatusBadge } from '@/features/register/StatusBadge';

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  /* Missing values render nothing. No dash, no "N/A". */
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right text-sm text-foreground">{value}</span>
    </div>
  );
}

export function RecordDrawer({
  row,
  canEdit,
  onClose,
  onEdit,
  onDelete,
}: {
  row: RegisterRow | null;
  canEdit: boolean;
  onClose: () => void;
  onEdit: (row: RegisterRow) => void;
  onDelete: (row: RegisterRow) => void;
}) {
  return (
    <Sheet open={row !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        {row ? (
          <>
            <SheetHeader className="gap-1">
              <SheetTitle className="text-base">{row.ticket}</SheetTitle>
              <SheetDescription>
                {row.person} at {row.site}
              </SheetDescription>
              <div className="pt-2">
                <StatusBadge status={row.status} />
              </div>
            </SheetHeader>

            <div className="px-4">
              <Separator />
              <Field label="Awarding body" value={row.body} />
              <Field label="Mandatory" value={row.mandatory ? 'Yes' : 'No'} />
              <Field label="Job title" value={row.jobTitle} />
              <Field label="Employment" value={row.employmentType} />
              <Separator />
              <Field label="Awarded" value={formatDate(row.awardedOn)} />
              <Field label="Expires" value={formatDate(row.expiresOn)} />
              <Field
                label="Certificate"
                value={
                  row.certificateRef ? (
                    <span className="nv-num">{row.certificateRef}</span>
                  ) : null
                }
              />
              <Separator />

              {canEdit ? (
                <div className="flex flex-wrap gap-2 py-4">
                  <Button className="font-semibold" onClick={() => onEdit(row)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border bg-card font-semibold"
                    onClick={() => toast.info('Renewal request sent to the training provider')}
                  >
                    Book renewal
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border bg-card font-semibold text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(row)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="py-4">
                  <Button
                    className="font-semibold"
                    onClick={() => toast.info('Renewal request sent to your site manager')}
                  >
                    Request renewal
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
