# Marketplace archetype

Two-sided marketplace. **11% of matching jobs.** Port 3502.

Covers: service marketplace, P2P rental, booking platform, "Uber for X" postings.

**Booking never appears as a standalone archetype** in this price band. It only appears inside a
marketplace, which is why there is no separate booking template.

## What separates it from the others

Two sides that never share a screen, with money and availability in between. The renter browses
and requests; the lender approves and hands over. Neither sees the other's view.

This is the archetype where the demo gate earns the most: a visitor entering as one side would
never discover the other half of the product without it.

## Current reskin

`Borrow Buddy / Marketplace`, an Australian peer-to-peer gear rental. From a real $22k posting.

Roles: Renter / Lender.

## Domain shape

```
Provider -> Listing -> Booking
                          |
                    BookingStatus  requested, confirmed, out, returned, declined
```

The status machine is the product. Both sides read the same booking row and see a different
affordance on it.

## Working flows

Browse with search and category filter, plus a real empty state. Request a booking with a live
total: daily rate times nights, plus a refundable deposit, with the amount due today spelled out.
Lender approves or declines, then marks picked up and returned. Create, edit and delete a
listing. Publish or hide a listing with a switch.

## Reskin notes

Keep the price breakdown in the request dialog. A marketplace demo where money is vague reads as
a mockup; showing rate, nights, deposit and total makes it read as a product.

Keep both sides genuinely different. If the two roles end up looking at the same table, the
archetype has been reskinned wrong.
