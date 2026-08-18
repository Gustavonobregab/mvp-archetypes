import * as React from 'react';
import { Search } from 'lucide-react';

import { cn } from '@mvp/kernel/lib/cn';
import { Input } from './input';

type SearchInputProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  containerClassName?: string;
};

function SearchInput({ className, containerClassName, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative', containerClassName)}>
      <Search className="pointer-events-none absolute start-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search…"
        className={cn('h-8 w-56 ps-9 text-[13px]', className)}
        {...props}
      />
    </div>
  );
}

export { SearchInput };
export type { SearchInputProps };
