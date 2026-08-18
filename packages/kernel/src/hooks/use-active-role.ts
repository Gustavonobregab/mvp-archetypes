'use client';

import * as React from 'react';
import { ROLE_COOKIE } from '@mvp/kernel/demo/role-cookie';

/* Radix portals render outside `.app-root`, so the `data-role` theming attribute
   is lost. Portal wrappers re-apply it via this hook so `--color-primary` stays
   role-aware. Mirrors the production app's per-department equivalent. */
export function useActiveRole(): string | undefined {
  const [role, setRole] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${ROLE_COOKIE}=([^;]*)`));
    setRole(match?.[1]);
  }, []);

  return role;
}
