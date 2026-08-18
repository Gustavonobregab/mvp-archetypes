'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import type { RoleDef } from '@mvp/kernel/demo/types';
import { setRole } from '@mvp/kernel/demo/role-cookie';

export function RoleCard({ role }: { role: RoleDef }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        setRole(role.key);
        router.push(role.landing);
      }}
      className="group flex w-full items-center gap-4 rounded-lg border border-border bg-card px-5 py-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        aria-hidden
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: `var(--role-color-${role.key})` }}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">Enter as {role.label}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">{role.pitch}</span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </button>
  );
}
