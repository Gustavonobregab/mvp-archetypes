/* Marketplace archetype. Based on a real Upwork posting: an Australian
   peer-to-peer rental marketplace. Two sides that never see the same screen,
   plus money and availability in between. That is what separates it from the
   single-sided Console and the single-tenant SaaS. */

export const ORG = {
  name: 'Borrow Buddy',
  short: 'Borrow',
  product: 'Marketplace',
  tagline:
    'Rent the gear your neighbours already own. Pick a role below to see the system as that person sees it.',
};

export const TODAY = new Date('2026-08-18T09:00:00Z');

export type Category = 'tools' | 'outdoor' | 'events' | 'garden';

export const CATEGORY_LABEL: Record<Category, string> = {
  tools: 'Tools',
  outdoor: 'Outdoor',
  events: 'Events',
  garden: 'Garden',
};

export type Provider = { id: string; name: string; suburb: string; rating: number; lends: number };

export const PROVIDERS: Provider[] = [
  { id: 'pr1', name: 'Marcus Teale', suburb: 'Fitzroy', rating: 4.9, lends: 61 },
  { id: 'pr2', name: 'Aisha Rahman', suburb: 'Brunswick', rating: 4.8, lends: 34 },
  { id: 'pr3', name: 'Joel Whitfield', suburb: 'Northcote', rating: 5.0, lends: 12 },
  { id: 'pr4', name: 'Nina Kovac', suburb: 'Coburg', rating: 4.6, lends: 88 },
];

export const CURRENT_PROVIDER_ID = 'pr1';
export const CURRENT_RENTER = 'Dani Alves';

export type Listing = {
  id: string;
  providerId: string;
  title: string;
  category: Category;
  pricePerDay: number;
  deposit: number;
  suburb: string;
  published: boolean;
  blurb: string;
};

export const LISTINGS: Listing[] = [
  { id: 'l1', providerId: 'pr1', title: 'Makita 18V Circular Saw', category: 'tools', pricePerDay: 24, deposit: 120, suburb: 'Fitzroy', published: true, blurb: 'Two batteries, charger and a spare 165mm blade. Great for decking.' },
  { id: 'l2', providerId: 'pr1', title: 'Wacker Plate Compactor', category: 'garden', pricePerDay: 65, deposit: 300, suburb: 'Fitzroy', published: true, blurb: 'Petrol, 60kg. Ute or trailer needed for pickup.' },
  { id: 'l3', providerId: 'pr1', title: 'Scaffold Tower 4m', category: 'tools', pricePerDay: 48, deposit: 250, suburb: 'Fitzroy', published: false, blurb: 'Aluminium, single-width. Currently being serviced.' },
  { id: 'l4', providerId: 'pr2', title: '6-Person Dome Tent', category: 'outdoor', pricePerDay: 18, deposit: 60, suburb: 'Brunswick', published: true, blurb: 'Waterproof, used twice. Pegs and footprint included.' },
  { id: 'l5', providerId: 'pr2', title: 'Weber Kettle BBQ', category: 'events', pricePerDay: 22, deposit: 80, suburb: 'Brunswick', published: true, blurb: 'Charcoal, 57cm. Cleaned after every rental.' },
  { id: 'l6', providerId: 'pr3', title: 'PA System with 2 Mics', category: 'events', pricePerDay: 90, deposit: 400, suburb: 'Northcote', published: true, blurb: 'Yamaha 1000W, stands and cables. Good for 120 people.' },
  { id: 'l7', providerId: 'pr4', title: 'Rotary Hoe', category: 'garden', pricePerDay: 55, deposit: 200, suburb: 'Coburg', published: true, blurb: 'Honda engine, 5 blades. Turns a bed in about an hour.' },
  { id: 'l8', providerId: 'pr4', title: 'Roof Box 470L', category: 'outdoor', pricePerDay: 30, deposit: 150, suburb: 'Coburg', published: true, blurb: 'Thule, fits most crossbars. Keys and mounting kit included.' },
];

export type BookingStatus = 'requested' | 'confirmed' | 'out' | 'returned' | 'declined';

export const BOOKING_LABEL: Record<BookingStatus, string> = {
  requested: 'Requested',
  confirmed: 'Confirmed',
  out: 'With renter',
  returned: 'Returned',
  declined: 'Declined',
};

export type Booking = {
  id: string;
  listingId: string;
  renter: string;
  from: string;
  to: string;
  status: BookingStatus;
  total: number;
};

export const BOOKINGS: Booking[] = [
  { id: 'b1', listingId: 'l1', renter: 'Dani Alves', from: '2026-08-21', to: '2026-08-23', status: 'requested', total: 72 },
  { id: 'b2', listingId: 'l2', renter: 'Priya Menon', from: '2026-08-19', to: '2026-08-20', status: 'confirmed', total: 130 },
  { id: 'b3', listingId: 'l1', renter: 'Tom Beattie', from: '2026-08-14', to: '2026-08-16', status: 'out', total: 72 },
  { id: 'b4', listingId: 'l2', renter: 'Dani Alves', from: '2026-07-30', to: '2026-08-01', status: 'returned', total: 195 },
  { id: 'b5', listingId: 'l1', renter: 'Sasha Lim', from: '2026-08-25', to: '2026-08-26', status: 'requested', total: 48 },
  { id: 'b6', listingId: 'l4', renter: 'Dani Alves', from: '2026-09-05', to: '2026-09-08', status: 'confirmed', total: 72 },
];

export const LISTING_BY_ID = Object.fromEntries(LISTINGS.map((l) => [l.id, l])) as Record<string, Listing>;
export const PROVIDER_BY_ID = Object.fromEntries(PROVIDERS.map((p) => [p.id, p])) as Record<string, Provider>;

export function money(n: number): string {
  return `$${n.toLocaleString('en-AU')}`;
}

export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function nights(from: string, to: string): number {
  return Math.max(1, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000));
}
