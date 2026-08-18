'use client';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@mvp/kernel/ui/sheet';
import { Button } from '@mvp/kernel/ui/button';
import { Separator } from '@mvp/kernel/ui/separator';
import { Badge } from '@mvp/kernel/ui/badge';
import { MEMBER_BY_ID, STAGE_LABEL, STAGE_ORDER, formatDate, money, type Job } from '@/lib/domain';

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right text-sm text-foreground">{value}</span>
    </div>
  );
}

export function JobDrawer({
  job,
  canEdit,
  onClose,
  onAdvance,
}: {
  job: Job | null;
  canEdit: boolean;
  onClose: () => void;
  onAdvance: (job: Job) => void;
}) {
  return (
    <Sheet open={job !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        {job ? (
          <>
            <SheetHeader className="gap-1">
              <SheetTitle className="text-base">{job.customer}</SheetTitle>
              <SheetDescription>{job.address}</SheetDescription>
            </SheetHeader>

            <div className="px-4">
              <Separator />
              <Field label="Value" value={<span className="nv-num">{money(job.value)}</span>} />
              <Field label="Starts" value={formatDate(job.startsOn)} />
              <Field label="Fitter" value={job.assignedTo ? MEMBER_BY_ID[job.assignedTo]?.name : null} />
              <Separator />

              <div className="py-3">
                <p className="text-xs text-muted-foreground">Progress</p>
                <ol className="mt-2 flex flex-wrap gap-1.5">
                  {STAGE_ORDER.map((stage) => {
                    const passed = STAGE_ORDER.indexOf(stage) <= STAGE_ORDER.indexOf(job.stage);
                    return (
                      <li key={stage}>
                        <Badge
                          variant="secondary"
                          className={passed ? 'border-0 bg-primary/10 font-medium text-primary' : 'border-0 text-muted-foreground'}
                        >
                          {STAGE_LABEL[stage]}
                        </Badge>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {canEdit && job.stage !== 'paid' ? (
                <div className="py-3">
                  <Button className="font-semibold" onClick={() => onAdvance(job)}>
                    Move forward
                  </Button>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
