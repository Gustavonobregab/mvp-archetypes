
'use client';

import * as React from 'react';
import { useTranslations } from '@mvp/kernel/lib/i18n';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  X,
} from 'lucide-react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  type Table as TanstackTable,
} from '@tanstack/react-table';

import { cn } from '@mvp/kernel/lib/cn';
import { Button } from '@mvp/kernel/ui/button';
import { Checkbox } from '@mvp/kernel/ui/checkbox';
import { SearchInput } from '@mvp/kernel/ui/search-input';
import { Skeleton } from '@mvp/kernel/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@mvp/kernel/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@mvp/kernel/ui/table';

function colMeta<TData>(column: Column<TData, unknown>): { className?: string } {
  return (column.columnDef.meta as { className?: string } | undefined) ?? {};
}

/** Sortable column header. Pass in a column's `header` render fn. */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: {
  column: Column<TData, TValue>;
  title: string;
}) {
  const t = useTranslations('common.table');
  if (!column.getCanSort()) return <span>{title}</span>;
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className="-ms-1 inline-flex items-center gap-1 px-1 py-0.5 select-none"
      aria-label={t('sortBy', { title })}
    >
      {title}
      {sorted === 'asc' ? (
        <ArrowUp className="size-3.5 shrink-0" aria-hidden="true" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="size-3.5 shrink-0" aria-hidden="true" />
      ) : (
        <ChevronsUpDown className="size-3.5 shrink-0 opacity-40" aria-hidden="true" />
      )}
    </button>
  );
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  isLoading?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  searchPlaceholder?: string;
  hideFilterbar?: boolean;
  /** Extra filter controls rendered in the toolbar next to the search. */
  filterbar?: (table: TanstackTable<TData>) => React.ReactNode;
  /** Right-aligned toolbar slot (e.g. view options). */
  toolbarRight?: (table: TanstackTable<TData>) => React.ReactNode;
  enableRowSelection?: boolean;
  /** Stable row identity — required for selection to survive page changes. */
  getRowId?: (row: TData) => string;
  /** Fires with the currently selected row originals. */
  onSelectionChange?: (rows: TData[]) => void;
  onRowClick?: (row: TData) => void;
  /** Rows this returns false for get no click handler and no click affordance —
   *  for lists where some rows have nothing to drill into. */
  isRowClickable?: (row: TData) => boolean;
  emptyState?: React.ReactNode;
  /** Render an inline load-failure state instead of rows. */
  error?: boolean;
  onErrorRetry?: () => void;

  // ── Server (manual) mode ──
  manual?: boolean;
  rowCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  /** Controlled search (debounced by the parent) — overrides the client globalFilter. */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50],
  searchPlaceholder,
  hideFilterbar = false,
  filterbar,
  toolbarRight,
  enableRowSelection = false,
  getRowId,
  onSelectionChange,
  onRowClick,
  isRowClickable,
  emptyState,
  error = false,
  onErrorRetry,
  manual = false,
  rowCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  searchValue,
  onSearchChange,
  isFiltered,
  onClearFilters,
}: DataTableProps<TData>) {
  const t = useTranslations('common.table');
  const [rowSelection, setRowSelection] = React.useState({});

  /* Client mode has no parent to own the search box, so the table owns it and
     drives TanStack's globalFilter. Server mode still delegates to the parent
     through onSearchChange and ignores this. */
  const controlledSearch = onSearchChange !== undefined;
  const [localSearch, setLocalSearch] = React.useState('');
  const search = controlledSearch ? searchValue : localSearch;

  const allColumns = React.useMemo<ColumnDef<TData, unknown>[]>(() => {
    if (!enableRowSelection) return columns;
    const select: ColumnDef<TData, unknown> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? 'indeterminate'
                : false
          }
          onCheckedChange={() => table.toggleAllPageRowsSelected()}
          aria-label={t('selectAll')}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={() => row.toggleSelected()}
          onClick={(e) => e.stopPropagation()}
          aria-label={t('selectRow')}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      meta: { className: 'w-10' },
    };
    return [select, ...columns];
  }, [columns, enableRowSelection, t]);

  const table = useReactTable({
    data,
    columns: allColumns,
    ...(getRowId ? { getRowId } : {}),
    state: {
      rowSelection,
      ...(manual ? { pagination, sorting } : { globalFilter: localSearch }),
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    globalFilterFn: 'includesString',
    ...(manual
      ? {
          manualPagination: true,
          manualSorting: true,
          manualFiltering: true,
          rowCount: rowCount ?? data.length,
          onPaginationChange,
          onSortingChange,
        }
      : {
          initialState: { pagination: { pageIndex: 0, pageSize } },
          onGlobalFilterChange: setLocalSearch,
          getFilteredRowModel: getFilteredRowModel(),
          getSortedRowModel: getSortedRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
        }),
  });

  React.useEffect(() => {
    onSelectionChange?.(table.getSelectedRowModel().rows.map((r) => r.original));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  const visibleCols = table.getVisibleLeafColumns().length;
  const rows = table.getRowModel().rows;
  const { pageIndex, pageSize: size } = table.getState().pagination;
  const totalRows = table.options.manualPagination
    ? table.getRowCount()
    : table.getFilteredRowModel().rows.length;
  const pageCount = Math.max(1, table.getPageCount());
  const selectedCount = table.getSelectedRowModel().rows.length;

  const pageButtons = [
    {
      icon: ChevronsLeft,
      label: t('firstPage'),
      onClick: () => table.setPageIndex(0),
      disabled: !table.getCanPreviousPage(),
      hideOnMobile: true,
    },
    {
      icon: ChevronLeft,
      label: t('previousPage'),
      onClick: () => table.previousPage(),
      disabled: !table.getCanPreviousPage(),
      hideOnMobile: false,
    },
    {
      icon: ChevronRight,
      label: t('nextPage'),
      onClick: () => table.nextPage(),
      disabled: !table.getCanNextPage(),
      hideOnMobile: false,
    },
    {
      icon: ChevronsRight,
      label: t('lastPage'),
      onClick: () => table.setPageIndex(pageCount - 1),
      disabled: !table.getCanNextPage(),
      hideOnMobile: true,
    },
  ];

  return (
    <div>
      {/* Toolbar — outside the table panel */}
      {!hideFilterbar && (
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <SearchInput
              value={search}
              onChange={(e) =>
                controlledSearch ? onSearchChange?.(e.target.value) : setLocalSearch(e.target.value)
              }
              placeholder={searchPlaceholder ?? t('search')}
              className="h-8 w-full sm:w-64"
            />
            {filterbar?.(table)}
            {(isFiltered || (!controlledSearch && localSearch !== '')) && (
              <Button
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => {
                  if (!controlledSearch) setLocalSearch('');
                  onClearFilters?.();
                }}
              >
                <X className="size-3.5 shrink-0" aria-hidden="true" />
                {t('clear')}
              </Button>
            )}
          </div>
          {toolbarRight?.(table)}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className={colMeta(header.column).className}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, r) => (
                <TableRow key={r}>
                  {Array.from({ length: visibleCols }).map((_, c) => (
                    <TableCell key={c}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={visibleCols} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {t('loadError')}
                    </span>
                    {onErrorRetry && (
                      <Button
                        variant="outline"
                        className="border-border bg-card font-semibold"
                        onClick={onErrorRetry}
                      >
                        {t('retry')}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleCols} className="h-24 text-center">
                  {emptyState ?? t('noResults')}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const clickable =
                  !!onRowClick && (!isRowClickable || isRowClickable(row.original));
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={clickable ? () => onRowClick(row.original) : undefined}
                    className={cn('group h-12', clickable && 'cursor-pointer')}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={colMeta(cell.column).className}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination — outside the table panel.
          rtl:flex-row-reverse keeps the controls cluster on the reading-start
          (right) side in RTL instead of mirroring it to the far left. */}
      <div className="flex items-center justify-between gap-4 py-4 rtl:flex-row-reverse">
        <p className="text-sm text-muted-foreground tabular-nums">
          {enableRowSelection
            ? t('selected', { selected: selectedCount, total: totalRows })
            : null}
        </p>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-sm text-muted-foreground">{t('rowsPerPage')}</span>
            <Select
              value={String(size)}
              onValueChange={(v) => {
                table.setPageSize(Number(v));
                table.resetRowSelection();
              }}
            >
              <SelectTrigger size="sm" className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground tabular-nums">
            {t('pageOf', { page: pageIndex + 1, total: pageCount })}
          </p>
          <div className="flex items-center gap-1.5">
            {pageButtons.map((b) => (
              <Button
                key={b.label}
                variant="outline"
                size="icon-sm"
                className={cn('border-border bg-card', b.hideOnMobile && 'hidden sm:inline-flex')}
                onClick={() => {
                  b.onClick();
                  table.resetRowSelection();
                }}
                disabled={b.disabled}
              >
                <span className="sr-only">{b.label}</span>
                <b.icon className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
