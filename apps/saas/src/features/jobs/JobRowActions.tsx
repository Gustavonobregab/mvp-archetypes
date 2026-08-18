'use client';

import { ArrowRight, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@mvp/kernel/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@mvp/kernel/ui/dropdown-menu';
import type { Job } from '@/lib/domain';

export function JobRowActions({
  job,
  onView,
  onEdit,
  onAdvance,
  onDelete,
}: {
  job: Job;
  onView: (job: Job) => void;
  onEdit: (job: Job) => void;
  onAdvance: (job: Job) => void;
  onDelete: (job: Job) => void;
}) {
  return (
    <div className="flex justify-end opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-foreground" aria-label={`Actions for ${job.customer}`}>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onSelect={() => onView(job)}>
            <Eye className="size-3.5" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onEdit(job)}>
            <Pencil className="size-3.5" />
            Edit
          </DropdownMenuItem>
          {job.stage !== 'paid' ? (
            <DropdownMenuItem onSelect={() => onAdvance(job)}>
              <ArrowRight className="size-3.5" />
              Move forward
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => onDelete(job)} className="text-muted-foreground focus:text-destructive">
            <Trash2 className="size-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
