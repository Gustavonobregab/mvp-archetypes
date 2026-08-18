# @mvp/kernel

Everything an archetype needs regardless of its domain. Extracted from the owner's production
app `nova-v2` by copying the files, not by imitating them, so visual parity is exact.

**A reskin never edits anything here.** See `RESKIN.md` at the repo root.

## Contents

```
src/ui/          28 shadcn primitives over Radix, plus DataTable and form-layout
src/dashboard/   StatCard, CategoryBar, DashboardHeader
src/demo/        the demo harness: gate, shell, role switcher, cookie, types
src/hooks/       use-mobile, use-active-role
src/lib/         cn, i18n
src/theme.css    tokens, per-role accent, base styles
```

## The demo harness

An archetype injects a `DemoConfig` and gets the whole shell:

```ts
export const DEMO: DemoConfig = {
  org: { name, short, product, tagline },
  roles: [{ key, label, pitch, landing }],
  manifest: { [roleKey]: [{ href, label, icon }] },
};
```

- `GateScreen` renders the role cards from `config.roles`
- `AppShell` renders sidebar plus role switcher from `config.manifest[role]`
- `canAccess(config, role, href)` is the single access gate, used by page files to make a route
  absent from a manifest unreachable by URL too

This mirrors the manifest / registry / renderer split in `nova-v2`, with **role** as the axis
where the production app uses **department**.

## Two things that will bite you

**Icons are strings.** `DemoConfig` crosses the server to client boundary and React cannot
serialize a component function. `PageDef.icon` is a lucide icon name, resolved in `AppShell`.
Putting a component there throws at runtime.

**Tailwind sources are declared here.** `theme.css` carries `@source './'` and
`@source '../../../apps'`. Tailwind v4 resolves sources relative to the CSS file, and the kernel
sits outside the apps. Drop either line and every class used in an app silently vanishes from
the build, leaving pages that render as unstyled HTML.

## Theme

`theme.css` is the only file allowed to contain a hex literal. Tokens follow `nova-v2`: Tremor
neutral ramp, blue primary, semantic pairs with `-soft` variants, `--radius: 0.375rem`, compact
density baked into the primitives.

`AppShell` stamps `data-role` on `.app-root`, and each role block overrides `--color-primary`.
Any class referencing `primary` follows the active persona with no JS.

**Known gap:** there is no per-app override, so a client brand colour cannot be applied without
editing this shared file and contaminating the other archetypes. Needs fixing before the builder
is automated.

## Local changes to the copied primitives

Two deliberate divergences from `nova-v2`:

1. **`next-intl` replaced by `lib/i18n.ts`**, a flat dictionary with the same call signature. A
   demo is single-language; the provider does not pay for itself. Primitives copied from
   production work unchanged.
2. **`DataTable` client-mode search was fixed here.** In `nova-v2` the search input is wired only
   to `onSearchChange`, the server-mode callback, with no fallback to TanStack's `globalFilter`.
   That path is dead code there because their zero-fetch-all rule makes every list server-mode.
   Demos run on local seed data, so the client path had to work.

## Rules

- Add a primitive through the shadcn CLI, never hand-write one.
- Never restyle a primitive at the call site. If a look must change, it changes once, here.
- Colour is status, never a field value.
- Loading uses `Skeleton` shaped like the real content, never a page spinner. `Spinner` is for
  inline action states only.
- Missing values render nothing.
- No decorative glyphs.
