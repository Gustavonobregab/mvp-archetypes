# mvp-archetypes

Prototype templates that get forked and reskinned per Upwork client. This is the **machine**,
not a product. It stays private forever.

The other half of the system is `~/Programming/mvp-funnel`, the radar that detects the job and
pushes a decision card to Telegram. Read that repo's `CLAUDE.md` for the thesis and the flow.

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
bunx tsc --noEmit                             # per app, must stay clean
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

## State

Three archetypes run with working CRUD, modals, destructive confirmation, toasts and role
isolation. **Nothing is deployed**, so there is no link to send a client yet. That is delivery 3
in the funnel repo's spec.

Known gaps, both real:

- **No per-app theme override.** A client's brand colour would have to be edited into the kernel
  today, which would contaminate the other two archetypes. Needs an override file per app.
- Console's People page has no detail drawer.
