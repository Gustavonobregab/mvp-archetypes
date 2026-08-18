/* The kernel knows the shape of a demo, never the domain. Each archetype injects
   its own org, roles and navigation. */

export type RoleDef = {
  key: string;
  label: string;
  pitch: string;
  landing: string;
};

/* The icon travels as a name, not a component. The config crosses the server to
   client boundary and React cannot serialize a component function. The shell
   resolves the name against the lucide registry. */
export type PageDef = {
  href: string;
  label: string;
  icon: string;
};

export type DemoConfig = {
  org: { name: string; short: string; product: string; tagline: string };
  roles: RoleDef[];
  manifest: Record<string, PageDef[]>;
};

export function roleByKey(config: DemoConfig, key: string): RoleDef | undefined {
  return config.roles.find((r) => r.key === key);
}

export function canAccess(config: DemoConfig, role: string, href: string): boolean {
  return Boolean(config.manifest[role]?.some((page) => page.href === href));
}
