'use client';

import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@mvp/kernel/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@mvp/kernel/ui/dropdown-menu';
import type { RegisterRow } from '@/lib/domain';

export function RowActions({
  row,
  onView,
  onEdit,
  onDelete,
  onRecord,
}: {
  row: RegisterRow;
  onView: (row: RegisterRow) => void;
  onEdit: (row: RegisterRow) => void;
  onDelete: (row: RegisterRow) => void;
  onRecord: (row: RegisterRow) => void;
}) {
  const held = row.status !== 'missing';

  return (
    <div
      className="flex justify-end opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"
      onClick={(event) => event.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
            aria-label={`Actions for ${row.person}, ${row.ticket}`}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          {held ? (
            <>
              <DropdownMenuItem onSelect={() => onView(row)}>
                <Eye className="size-3.5" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onEdit(row)}>
                <Pencil className="size-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => onDelete(row)}
                className="text-muted-foreground focus:text-destructive"
              >
                <Trash2 className="size-3.5" />
                Remove
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onSelect={() => onRecord(row)}>
              <Plus className="size-3.5" />
              Record certificate
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
