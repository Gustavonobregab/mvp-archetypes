'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Lucide from 'lucide-react';
import type { DemoConfig } from '@mvp/kernel/demo/types';
import { RoleSwitcher } from '@mvp/kernel/demo/RoleSwitcher';
import { Toaster } from '@mvp/kernel/ui/sonner';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@mvp/kernel/ui/sidebar';

export function AppShell({
  config,
  role,
  children,
}: {
  config: DemoConfig;
  role: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pages = config.manifest[role] ?? [];
  const active = config.roles.find((r) => r.key === role);

  return (
    <div className="app-root min-h-screen" data-role={role}>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded bg-sidebar-primary text-[11px] font-bold text-sidebar-primary-foreground">
                {config.org.short.slice(0, 1)}
              </span>
              <span className="min-w-0 group-data-[collapsible=icon]:hidden">
                <span className="block truncate text-sm font-semibold leading-tight">
                  {config.org.short}
                </span>
                <span className="block truncate text-xs leading-tight text-muted-foreground">
                  {config.org.product}
                </span>
              </span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {pages.map((page) => {
                    const Icon =
                      (Lucide as unknown as Record<string, Lucide.LucideIcon>)[page.icon] ??
                      Lucide.Circle;
                    return (
                      <SidebarMenuItem key={page.href}>
                        <SidebarMenuButton asChild isActive={pathname === page.href} tooltip={page.label}>
                          <Link href={page.href}>
                            <Icon />
                            <span>{page.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <RoleSwitcher roles={config.roles} active={role} />
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-background">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-card px-3">
            <SidebarTrigger />
            <span className="text-sm font-medium text-foreground">{active?.label}</span>
            <span className="ml-auto text-xs text-subtle">Sample data</span>
          </header>
          <main className="min-w-0 flex-1 p-5">{children}</main>
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </div>
  );
}
