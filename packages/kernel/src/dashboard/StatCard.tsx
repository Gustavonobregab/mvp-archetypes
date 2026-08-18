import { Card } from '@mvp/kernel/ui/card';
import { Skeleton } from '@mvp/kernel/ui/skeleton';
import { cn } from '@mvp/kernel/lib/cn';

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function StatCard({ label, value, sub, className, children }: StatCardProps) {
  return (
    <Card className={cn('gap-0 p-5 shadow-none', className)}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">{value}</p>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
      {children}
    </Card>
  );
}

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('gap-0 p-5 shadow-none', className)}>
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="mt-3 h-8 w-20" />
      <Skeleton className="mt-2 h-3 w-28" />
    </Card>
  );
}
