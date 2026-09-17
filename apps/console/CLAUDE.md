# Console archetype

Internal, staff-facing operations console. **29% of matching jobs**, the largest single bucket.
Port 3500.

Covers: admin panel, internal tool, ERP, CRM, back office, client portal, and the very common
"we run this on spreadsheets and want a system" posting.

Building this archetype is what produced the kernel, which is why it came first.

## Current reskin

`Kestrel Facilities Group / Ticket Register`, a UK facilities firm tracking engineer
certifications. Taken from a real posting so the fit is honest.

Roles: Compliance Lead (all sites) / Site Manager (one depot) / Engineer (own record only).

## Domain shape

```
Person   -> Ticket   -> TicketRecord
              |
         RegisterRow    one row per person-and-ticket pair
```

The detail worth preserving through any reskin: **a mandatory ticket a person does not hold is
still a row**, with status `missing`. Absences are the reason the product exists, so they cannot
be absences in the UI. Deleting a mandatory record turns the row into "Not held" rather than
removing it.

## What a reskin changes

`src/lib/domain.ts` and `src/lib/demo-config.ts`. Nothing else, and nothing in the kernel.

## Working flows

Create, edit and delete a record with validation. Expiry auto-derives from the certificate's
validity period and stays overridable. Row actions on hover. Destructive confirmation with
contextual text. Detail drawer. Profile page with contact details and notification switches.
Toasts on every action.
