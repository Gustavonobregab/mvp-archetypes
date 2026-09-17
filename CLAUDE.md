# mvp-archetypes

Prototype templates that get reskinned per Upwork client and deployed as a standalone demo. This
is the **machine**, not a product. It stays private forever and has no git remote.

Someone else finds the jobs and sends the proposals. This repo only turns a pasted job into a live
demo link. Design: `docs/superpowers/specs/2026-09-17-demo-flow-vercel-design.md`.

## The one idea that makes this work

**An archetype is not an app. It is a data model, a handful of screens, and copy.**

Everything an app needs regardless of domain lives once in `packages/kernel`: auth shell, roles,
sidebar, theme, table, forms, modals, toasts, error funnel. Three archetypes sharing one kernel
means a fix lands everywhere at once.

Building three independent apps instead would mean writing and maintaining that plumbing three
times. In two months they diverge and nobody maintains any of them. That is exactly how template
libraries rot, and avoiding it is the reason the kernel exists.

## Layout

```
packages/kernel/     shared plumbing. See its CLAUDE.md. A reskin NEVER edits this.
apps/console/        Console archetype    port 3500
apps/saas/           SaaS archetype       port 3501
apps/marketplace/    Marketplace archetype port 3502
RESKIN.md            what an agent may and may not change. Read it before any reskin.
```

## Why these three archetypes

Chosen from the distribution of 114 real postings, not from taste:

| Archetype | Share of matching jobs | What defines it |
|---|---|---|
| Console de operação | 29% | internal, staff-facing, replaces a spreadsheet |
| SaaS with subscription | 21% | customer self-serves and pays for their own plan |
| Marketplace two-sided | 11% | two sides that never share a screen, plus money and availability |

Two findings shaped this set:

- **AI is a layer, not an archetype.** No posting asked for "a chatbot over my documents". They
  ask for their operation with AI inside it. So AI is a slice any archetype turns on.
- **Booking alone does not exist** in this price band. It only appears inside marketplace.

## Stack

Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, shadcn (new-york) over Radix,
TanStack Table. Design system extracted from the owner's production app `nova-v2`, not imitated:
the primitives are the same files.

Note that shadcn **is** Radix with styling on top. The `radix-ui` package is a hard dependency of
every primitive; it is not an optional choice.

## Running

```bash
bun install                                   # workspace root
cd apps/console && bun run dev                # 3500
cd apps/saas && bun run dev                   # 3501
cd apps/marketplace && bun run dev            # 3502
bun run typecheck                             # all three apps, must stay clean
```

## Tailwind gotcha, this already broke once

Tailwind v4 resolves sources **relative to the CSS file**. `theme.css` lives in the kernel, so it
declares both trees:

```css
@source './';
@source '../../../apps';
```

Removing either line silently drops every class used in the apps from the build. The pages still
render, with no styling at all. If a screen suddenly looks like raw HTML, check this first.

## Server and client boundary

`DemoConfig` crosses from a server component into the client `AppShell`. React cannot serialize a
component function, so **navigation icons travel as strings** and the shell resolves them against
the lucide registry. Putting a component in `PageDef.icon` throws at runtime.

## Demo data is a feature, not filler

The seed is the highest-converting part of a demo and the most commonly under-invested. A table
of "Item 1, Item 2" reads as a template. An operation with real names, real certifications, real
gaps and real overdue items reads as **their** operation.

Every archetype's seed is deliberately uneven: some records healthy, several with one lapse, a
few missing entirely. The gaps are the reason the product exists, so they must be visible.

## How a demo is born

The `demo` skill (`~/.claude/skills/demo/SKILL.md`) runs this. In short:

```bash
git worktree add ~/Programming/demos/<slug> -b demo/<slug>    # from main
cd ~/Programming/demos/<slug> && bun install
# one agent per job rewrites the archetype under RESKIN.md
(cd apps/<archetype> && bun run typecheck && bun run build)
scripts/deploy-demo.sh <console|saas|marketplace> <slug>
```

`scripts/deploy-demo.sh` creates or reuses the Vercel project `demo-<slug>` in
`gustavo-nobregas-projects`, deploys with `deploy/vercel.<archetype>.json` and prints the public
URL on its last line after checking it answers 200. Rerunning it redeploys the same project.

The worktree root is uploaded whole and Vercel installs the Bun workspace there, so the kernel
resolves as it does locally. The per-archetype config only picks which app gets built.

`next-env.d.ts` is generated, not versioned. `next dev` and `next build` rewrite it with different
paths, so each app's `typecheck` script runs `next typegen` first.

## State

Three archetypes with working CRUD, modals, destructive confirmation, toasts, role isolation,
per-app brand colour through `src/app/brand.css`, and detail drawers. Typecheck and build are
clean on all three.

Deploy works end to end: `demo-smoke-saas` (the SaaS base, unchanged) is live at
`https://demo-smoke-saas.vercel.app` from the `~/Programming/demos/smoke-saas` worktree.
