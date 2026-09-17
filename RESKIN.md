# RESKIN.md

The boundary. Read this before touching anything when adapting an archetype to a client.

Without a written boundary every build drifts, and after ten demos there are ten different
bases and none of them is maintained. This file is what keeps the cycle at minutes instead of
hours.

## The job

Take an archetype and make it read as software built for one specific business. You are not
generating an app. You are **rewriting its domain and its copy**, on a base that already works.

## What you may change

| Layer | Files | Time |
|---|---|---|
| **L1 Copy and brand** | `src/lib/demo-config.ts`, `src/app/brand.css` | 2 min |
| **L2 Domain schema** | `src/lib/domain.ts` types and entities | 5 min |
| **L3 Seed data** | `src/lib/domain.ts` constants | 5 min |
| **L4 Specific flow** | 1 to 3 files under `src/features/` | 10 min |

L1 alone reads as a template and burns credibility. L1 plus L2 plus L3 converts. L4 only for a
high-score job that described something the archetype does not already do.

## What you must not change

Everything in `packages/kernel`. Auth shell, sidebar, role switcher, demo gate, theme tokens,
table, forms, dialogs, drawers, toasts, error funnel, primitives.

If a client genuinely needs a kernel change, that is a kernel commit reviewed on its own, on
main, benefiting all three archetypes. It is never part of a reskin branch.

## Layer 3 is the one people get wrong

The seed is the highest-converting part of the demo. Rules:

- **Real names, real terms, real numbers** from the client's industry. Look them up. In a UK
  facilities demo the certifications are IPAF, UKATA, PASMA, not "Certificate A".
- **Uneven on purpose.** Some records healthy, several with one problem, a few missing entirely.
  A tidy dataset reads as seed data. An operation with real gaps reads as their operation.
- **Volume.** A dozen people and forty-odd records, not three rows.
- **A fixed "today"** so the demo reads identically on any day it is opened.
- The gaps are the product's reason to exist. Make them visible on the first screen.

## Roles

Roles are a first-class parameter, not decoration. `demo-config.ts` drives three things at once:
the demo gate, the navigation, and which slice of the seed each persona sees.

- Name them in the client's language. `Dentist / Receptionist / Patient`, not `Admin / User`.
- Each role's `pitch` is one line saying what that person does. Those lines are the product
  pitch on the gate screen; write them from the job post.
- Every role must see a genuinely different slice. Three roles showing the same table is worse
  than one role.

## The gate is not a login

No password field. No email field. A visitor who sees a credential form assumes they need an
account and closes the tab. Cards only.

## Hard rules

- **Never touch `packages/kernel`** in a reskin branch.
- Business logic goes in `src/lib/`, page files stay thin. When a won project migrates to a real
  API, lifting a pure function is a copy; unpicking logic from a page is a rewrite.
- Route access is decided by the manifest alone, via `canAccess`. A route absent from a role's
  manifest must not be reachable by typing the URL.
- Colour is status, never a field value. Semantic soft pairs only.
- Missing values render nothing. No dash, no "N/A".
- No decorative glyphs. No bullet chars, arrows, em or en dashes, multiplication sign.
- Icons in the manifest are **strings**, never component imports.
- Every button does something real. A button that does nothing reads worse to a visitor than no
  button at all. If there is no backend, mutate client state and fire a toast.
- Fake data only. Never real personal data, never a real logo, never a client trademark on an
  indexable page. Keep the "concept prototype, not affiliated" line in the gate footer.

## Branch and naming

One worktree and one branch per demo: `~/Programming/demos/<client-slug>` on
`demo/<client-slug>`. The branch records the exact kernel state that built that demo. **A deployed
demo is immutable**: a later kernel change reaches new demos only, so a demo attached to a live
proposal never breaks.

Deploy from inside the worktree:

```bash
scripts/deploy-demo.sh <console|saas|marketplace> <client-slug>
```

It creates or reuses the Vercel project `demo-<client-slug>`, deploys the archetype to production
and prints the public URL on its last line. Never push the branch anywhere.

Eject to a standalone repo only when the contract is won.

## Definition of done

- `bun run typecheck` and `bun run build` clean inside the demo's app
- Every role opens, its nav matches its manifest, its slice differs from the others
- Create, edit and delete work and persist in state
- Destructive actions confirm before acting
- Nothing under `packages/kernel` appears in `git diff`
