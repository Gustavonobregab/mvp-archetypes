import type { ComponentProps } from 'react';
import { cn } from '@mvp/kernel/lib/cn';

/** Base skeleton block. The single source of truth for loading placeholders -
 *  never hand-roll `animate-pulse` divs; compose these instead. */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-secondary', className)}
      {...props}
    />
  );
}

/** Skeleton rows for a table body. Render inside a `<tbody>`:
 *  `<tbody>{isLoading ? <TableSkeleton rows={8} cols={5} /> : rows}</tbody>` */
export function TableSkeleton({
  rows = 6,
  cols = 4,
  cellClassName = 'px-5 py-3.5',
}: {
  rows?: number;
  cols?: number;
  cellClassName?: string;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-border/60 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className={cellClassName}>
              <Skeleton className="h-4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
