'use client';

// Faceted filter for DataTable toolbars — dropdown-menu based, immediate commit
// (no Apply/Reset staging). Same API as the old Tremor DataTableFilter so call sites
// need no logic changes.
import * as React from 'react';
import { Check, ChevronDown, Plus } from 'lucide-react';

import { Button } from '@mvp/kernel/ui/button';
import { Input } from '@mvp/kernel/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@mvp/kernel/ui/dropdown-menu';

export interface FacetOption {
  label: string;
  value: string;
}

interface DataTableFilterProps {
  label: string;
  options: FacetOption[];
  selected: string[];
  onSelectedChange: (values: string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  emptyLabel?: React.ReactNode;
}

export function DataTableFilter({
  label,
  options,
  selected,
  onSelectedChange,
  multiple = false,
  searchable = false,
  disabled = false,
  emptyLabel = 'No options.',
}: DataTableFilterProps) {
  const [query, setQuery] = React.useState('');

  const filtered =
    searchable && query
      ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
      : options;

  // Fall back to the raw value: an active filter restored from the URL must stay
  // visible even when its option list failed to load.
  const selectedLabels = selected.map(
    (v) => options.find((o) => o.value === v)?.label ?? v,
  );
  const hasSelection = selected.length > 0;

  const toggle = (value: string) => {
    if (multiple) {
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      onSelectedChange(next);
    } else {
      onSelectedChange(selected.includes(value) ? [] : [value]);
    }
  };

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) setQuery('');
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          data-active={hasSelection}
          className="border-border bg-card font-medium text-muted-foreground data-[active=true]:text-foreground"
        >
          {!hasSelection && <Plus className="size-3.5 shrink-0" aria-hidden="true" />}
          {label}
          {selectedLabels.length > 0 && (
            <>
              <span className="mx-0.5 h-3.5 w-px bg-border" aria-hidden="true" />
              <span className="text-foreground">
                {selectedLabels.length > 2
                  ? `${selectedLabels.length} selected`
                  : selectedLabels.join(', ')}
              </span>
            </>
          )}
          <ChevronDown className="size-3.5 shrink-0 opacity-50" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60 p-0">
        {searchable && (
          <>
            <div className="p-2">
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder={`Search ${label.toLowerCase()}…`}
                className="h-8 text-[13px]"
              />
            </div>
            <DropdownMenuSeparator className="mt-0" />
          </>
        )}
        <div className="max-h-56 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">{emptyLabel}</p>
          ) : multiple ? (
            filtered.map((o) => (
              <DropdownMenuCheckboxItem
                key={o.value}
                checked={selected.includes(o.value)}
                onSelect={(e) => {
                  e.preventDefault();
                  toggle(o.value);
                }}
              >
                {o.label}
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            filtered.map((o) => (
              <DropdownMenuItem key={o.value} onSelect={() => toggle(o.value)}>
                <span className="flex-1 truncate">{o.label}</span>
                {selected.includes(o.value) && (
                  <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </div>
        {hasSelection && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => onSelectedChange([])}
              className="text-muted-foreground"
            >
              Clear
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
