import { Badge } from '@mvp/kernel/ui/badge';
import { STATUS_LABEL, type RecordStatus } from '@/lib/domain';
import { cn } from '@mvp/kernel/lib/cn';

/* Colour is status, never a field value. Semantic soft pairs only. */
const TONE: Record<RecordStatus, string> = {
  valid: 'bg-success-soft text-success',
  expiring: 'bg-warning-soft text-warning',
  expired: 'bg-destructive-soft text-destructive',
  missing: 'bg-secondary text-secondary-foreground',
};

export function StatusBadge({ status, className }: { status: RecordStatus; className?: string }) {
  return (
    <Badge variant="secondary" className={cn('border-0 font-medium', TONE[status], className)}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
