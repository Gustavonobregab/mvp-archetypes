import type { ReactNode } from 'react';

import { cn } from '@mvp/kernel/lib/cn';
import { Label } from '@mvp/kernel/ui/label';

const ROW_COLS = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
} as const;

/** Grid row inside a modal form. Keeps every form in the app on the same 4-unit gutter. */
function FormRow({
  cols = 2,
  className,
  children,
}: {
  cols?: keyof typeof ROW_COLS;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('grid grid-cols-1 gap-4', ROW_COLS[cols], className)}>{children}</div>
  );
}

/** Labeled form control with required marker and error text. */
function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: {
  label?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
      )}
      {hint && <span className="-mt-1 text-xs text-muted-foreground">{hint}</span>}
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}

/** Titled group of rows, separated by a rule. Use once a form passes ~6 fields. */
function FormSection({
  title,
  className,
  children,
}: {
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        'flex flex-col gap-4 border-t pt-4 first:border-t-0 first:pt-0',
        className
      )}
    >
      {title && (
        <p className="text-xs font-semibold tracking-wide text-subtle uppercase">{title}</p>
      )}
      {children}
    </section>
  );
}

export { FormField, FormRow, FormSection };
