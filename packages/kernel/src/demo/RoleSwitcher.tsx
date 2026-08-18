'use client';

import { useRouter } from 'next/navigation';
import { Check, ChevronsUpDown } from 'lucide-react';
import type { RoleDef } from '@mvp/kernel/demo/types';
import { setRole } from '@mvp/kernel/demo/role-cookie';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@mvp/kernel/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@mvp/kernel/ui/sidebar';

/* Persistent switcher, so a visitor who entered as one persona can see the other
   side without going back to the gate. */
export function RoleSwitcher({ roles, active }: { roles: RoleDef[]; active: string }) {
  const router = useRouter();
  const current = roles.find((r) => r.key === active);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: `var(--role-color-${active})` }}
              />
              <span className="min-w-0 flex-1 truncate text-left">{current?.label}</span>
              <ChevronsUpDown className="ml-auto size-3.5 text-subtle" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="start" className="w-60">
            {roles.map((role) => (
              <DropdownMenuItem
                key={role.key}
                onSelect={() => {
                  setRole(role.key);
                  router.push(role.landing);
                  router.refresh();
                }}
                className="gap-2"
              >
                <span
                  aria-hidden
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: `var(--role-color-${role.key})` }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{role.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{role.pitch}</span>
                </span>
                {role.key === active ? <Check className="size-3.5 shrink-0" /> : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
