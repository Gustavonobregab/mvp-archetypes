import { cn } from '@mvp/kernel/lib/cn';

interface SpinnerProps {
  className?: string;
  /** Wraps the spinner in a full-area centered container */
  fullArea?: boolean;
}

export function Spinner({ className, fullArea }: SpinnerProps) {
  const spinner = (
    <span
      className={cn(
        'inline-block size-5 animate-spin rounded-full border-2 border-border border-t-primary',
        className,
      )}
    />
  );

  if (fullArea) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center py-16">
        {spinner}
      </div>
    );
  }

  return spinner;
}
