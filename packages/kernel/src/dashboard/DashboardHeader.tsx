import type { ReactNode } from 'react';

export interface DashboardHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function DashboardHeader({ title, description, children }: DashboardHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
      {/* flex-auto, not flex-1: the title's content width has to count in the
          wrap calculation, or a wide action group collapses it to zero. */}
      <div className="min-w-0 flex-auto">
        <div className="text-[30px] font-bold tracking-[-0.02em]">{title}</div>
        {description && (
          <div className="mt-1 text-[15px] text-muted-foreground">{description}</div>
        )}
      </div>
      {children && (
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">{children}</div>
      )}
    </div>
  );
}
