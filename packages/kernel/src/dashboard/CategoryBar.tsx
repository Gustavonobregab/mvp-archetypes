import { cn } from '@mvp/kernel/lib/cn';

export interface CategoryBarSegment {
  key: string;
  label?: string;
  value: number;
  colorClass: string;
}

export interface CategoryBarProps {
  segments: readonly CategoryBarSegment[];
  legend?: boolean;
  className?: string;
}

export function CategoryBar({ segments, legend = false, className }: CategoryBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  return (
    <div className={className}>
      <div className="flex h-2 items-center gap-0.5 overflow-hidden">
        {segments.map((s) => (
          <div
            key={s.key}
            className={cn('h-full rounded-full', s.colorClass)}
            style={{ width: `${(s.value / total) * 100}%` }}
          />
        ))}
      </div>
      {legend && (
        <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {segments.map((s) => (
            <li key={s.key} className="flex items-center gap-2 text-sm">
              <span className={cn('size-2.5 shrink-0 rounded-sm', s.colorClass)} aria-hidden="true" />
              <span className="text-foreground tabular-nums">
                {Math.round((s.value / total) * 100)}%
              </span>
              <span className="text-muted-foreground">{s.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
