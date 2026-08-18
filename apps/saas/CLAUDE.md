# SaaS archetype

Vertical B2B SaaS where the customer signs up and pays for their own plan. **21% of matching
jobs.** Port 3501.

Covers: multi-tenant SaaS, subscription product, "platform for X trade" postings.

## What separates it from Console

Self-serve billing. Console is internal and staff-facing; here the customer picks a plan, pays,
and manages their own team. That boundary is the archetype, not the screens.

It also carries a **third persona the Console does not have**: the platform operator, who sees
every subscriber at once. Any multi-tenant posting implies both sides.

## Current reskin

`KINSTALL / Installer OS`, a subscription platform for independent kitchen fitters. From a real
$35k posting.

Roles: Business Owner (the firm) / Fitter (own jobs) / Platform Admin (every account).

## Domain shape

```
Org -> Plan          the subscription boundary
Org -> Member        seats, invites
Org -> Job           the domain work, moving through a pipeline
```

`JobStage` is an ordered pipeline: quote, scheduled, on site, invoiced, paid. Advancing is a
single action, and the drawer shows the whole track so progress is legible at a glance.

## Working flows

Create, edit and delete a job with validation. Advance a job one stage. Invite a member with a
seat check against the plan, resend an invite, remove a member. Switch plan with confirmation,
blocked when the target plan has fewer seats than the team already uses. Platform view with MRR,
past-due and trial counts.

The seat check and the plan downgrade block are the two details that make the billing read as
real rather than decorative. Keep them through a reskin.
