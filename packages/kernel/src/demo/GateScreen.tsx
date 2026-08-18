import { ArrowRight } from 'lucide-react';
import type { DemoConfig } from '@mvp/kernel/demo/types';
import { RoleCard } from '@mvp/kernel/demo/RoleCard';

/* The demo gate. Not a login: no password field, no email field. A visitor who
   sees a credential form assumes they need an account and closes the tab. The
   role cards double as the pitch, since each line states what that persona does. */
export function GateScreen({ config }: { config: DemoConfig }) {
  return (
    <div className="app-root min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-16">
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {config.org.name}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {config.org.product}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {config.org.tagline}
          </p>
        </header>

        <ul className="grid gap-3">
          {config.roles.map((role) => (
            <li key={role.key}>
              <RoleCard role={role} />
            </li>
          ))}
        </ul>

        <footer className="mt-10 flex items-center gap-2 text-xs text-subtle">
          <ArrowRight className="size-3.5" />
          <span>Concept prototype built for {config.org.name}. Sample data only, not affiliated.</span>
        </footer>
      </div>
    </div>
  );
}
