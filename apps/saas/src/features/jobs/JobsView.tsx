'use client';

import * as React from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, DataTableColumnHeader } from '@mvp/kernel/ui/data-table';
import { DataTableFilter } from '@mvp/kernel/ui/data-table-filter';
import { DashboardHeader, StatCard } from '@mvp/kernel/dashboard';
import { Badge } from '@mvp/kernel/ui/badge';
import { Button } from '@mvp/kernel/ui/button';
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
  CURRENT_ORG_ID,
  JOBS,
  MEMBER_BY_ID,
  STAGE_LABEL,
  STAGE_ORDER,
  formatDate,
  money,
  type Job,
  type JobStage,
} from '@/lib/domain';
import { JobFormDialog, EMPTY_JOB, type JobDraft } from '@/features/jobs/JobFormDialog';
import { JobRowActions } from '@/features/jobs/JobRowActions';
import { JobDrawer } from '@/features/jobs/JobDrawer';

const STAGE_TONE: Record<JobStage, string> = {
  quote: 'bg-secondary text-secondary-foreground',
  scheduled: 'bg-info-soft text-info',
  in_progress: 'bg-warning-soft text-warning',
  invoiced: 'bg-info-soft text-info',
  paid: 'bg-success-soft text-success',
};

const STAGE_OPTIONS = STAGE_ORDER.map((s) => ({ label: STAGE_LABEL[s], value: s }));

export function JobsView({ role }: { role: string }) {
  const isOwner = role === 'owner';
  const [jobs, setJobs] = React.useState<Job[]>(JOBS);
  const [stages, setStages] = React.useState<string[]>([]);
  const [formOpen, setFormOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<JobDraft>(EMPTY_JOB);
  const [viewing, setViewing] = React.useState<Job | null>(null);
  const [pendingDelete, setPendingDelete] = React.useState<Job | null>(null);

  const scoped = React.useMemo(() => {
    const mine = jobs.filter((j) => j.orgId === CURRENT_ORG_ID);
    /* A fitter only sees what is assigned to them. Same table, different slice. */
    const byRole = isOwner ? mine : mine.filter((j) => j.assignedTo === 'm2');
    return stages.length === 0 ? byRole : byRole.filter((j) => stages.includes(j.stage));
  }, [jobs, isOwner, stages]);

  const pipeline = scoped.filter((j) => j.stage !== 'paid').reduce((s, j) => s + j.value, 0);
  const awaitingPayment = scoped.filter((j) => j.stage === 'invoiced').reduce((s, j) => s + j.value, 0);
  const openQuotes = scoped.filter((j) => j.stage === 'quote').length;

  function handleSubmit(next: JobDraft) {
    const payload: Job = {
      id: next.id ?? `j-${Date.now()}`,
      orgId: CURRENT_ORG_ID,
      customer: next.customer,
      address: next.address,
      stage: next.stage,
      value: Number(next.value) || 0,
      startsOn: next.startsOn,
      assignedTo: next.assignedTo || null,
    };
    setJobs((prev) => (next.id ? prev.map((j) => (j.id === next.id ? payload : j)) : [payload, ...prev]));
    setFormOpen(false);
    toast.success(next.id ? 'Job updated' : 'Job created');
  }

  function advance(job: Job) {
    const i = STAGE_ORDER.indexOf(job.stage);
    const nextStage = STAGE_ORDER[Math.min(i + 1, STAGE_ORDER.length - 1)];
    if (!nextStage || nextStage === job.stage) return;
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, stage: nextStage } : j)));
    toast.success(`${job.customer} moved to ${STAGE_LABEL[nextStage]}`);
  }

  const columns = React.useMemo<ColumnDef<Job, unknown>[]>(() => {
    const cols: ColumnDef<Job, unknown>[] = [
      {
        accessorKey: 'customer',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
        cell: ({ row }) => (
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-foreground">{row.original.customer}</span>
            <span className="text-xs text-muted-foreground">{row.original.address}</span>
          </span>
        ),
      },
      {
        accessorKey: 'stage',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Stage" />,
        cell: ({ row }) => (
          <Badge variant="secondary" className={`border-0 font-medium ${STAGE_TONE[row.original.stage]}`}>
            {STAGE_LABEL[row.original.stage]}
          </Badge>
        ),
      },
      {
        accessorKey: 'value',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Value" />,
        cell: ({ row }) => <span className="nv-num text-sm">{money(row.original.value)}</span>,
      },
      {
        accessorKey: 'startsOn',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Starts" />,
        cell: ({ row }) => <span className="nv-num text-sm">{formatDate(row.original.startsOn)}</span>,
      },
      {
        accessorKey: 'assignedTo',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fitter" />,
        cell: ({ row }) => {
          const m = row.original.assignedTo ? MEMBER_BY_ID[row.original.assignedTo] : null;
          return m ? <span className="text-sm">{m.name}</span> : null;
        },
      },
    ];

    if (isOwner) {
      cols.push({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <JobRowActions
            job={row.original}
            onView={setViewing}
            onEdit={(job) => {
              setDraft({
                id: job.id,
                customer: job.customer,
                address: job.address,
                stage: job.stage,
                value: String(job.value),
                startsOn: job.startsOn,
                assignedTo: job.assignedTo ?? '',
              });
              setFormOpen(true);
            }}
            onAdvance={advance}
            onDelete={setPendingDelete}
          />
        ),
      });
    }

    return cols;
  }, [isOwner]);

  return (
    <div className="flex flex-col gap-4">
      <DashboardHeader
        title={isOwner ? 'Jobs' : 'My jobs'}
        description={isOwner ? 'Every quote, fit and invoice for your firm.' : 'The jobs assigned to you.'}
      >
        {isOwner ? (
          <Button
            className="font-semibold"
            onClick={() => {
              setDraft(EMPTY_JOB);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            New job
          </Button>
        ) : null}
      </DashboardHeader>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Open pipeline" value={money(pipeline)} sub={`${scoped.length} jobs on the board`} />
        <StatCard label="Awaiting payment" value={money(awaitingPayment)} sub="invoiced, not yet paid" />
        <StatCard label="Quotes out" value={openQuotes} sub="waiting on the customer" />
      </div>

      <DataTable
        columns={columns}
        data={scoped}
        pageSize={10}
        searchPlaceholder="Search customer or address"
        getRowId={(row) => row.id}
        onRowClick={setViewing}
        filterbar={() => (
          <DataTableFilter
            label="Stage"
            options={STAGE_OPTIONS}
            selected={stages}
            onSelectedChange={setStages}
            multiple
          />
        )}
      />

      <JobDrawer job={viewing} canEdit={isOwner} onClose={() => setViewing(null)} onAdvance={advance} />

      <JobFormDialog open={formOpen} draft={draft} onOpenChange={setFormOpen} onSubmit={handleSubmit} />

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open: boolean) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this job?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `${pendingDelete.customer} at ${pendingDelete.address} will be removed, along with its quote and schedule.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!pendingDelete) return;
                setJobs((prev) => prev.filter((j) => j.id !== pendingDelete.id));
                toast.success(`Job for ${pendingDelete.customer} deleted`);
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
