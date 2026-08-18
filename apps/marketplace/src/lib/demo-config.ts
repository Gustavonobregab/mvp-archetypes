import type { DemoConfig } from '@mvp/kernel/demo/types';
import { ORG } from '@/lib/domain';

export const DEMO: DemoConfig = {
  org: ORG,
  roles: [
    { key: 'renter', label: 'Renter', pitch: 'Browses gear nearby, books it, tracks the pickup', landing: '/browse' },
    { key: 'provider', label: 'Lender', pitch: 'Lists their own gear, approves requests, gets paid', landing: '/my-listings' },
  ],
  manifest: {
    renter: [
      { href: '/browse', label: 'Browse', icon: 'Search' },
      { href: '/my-bookings', label: 'My bookings', icon: 'CalendarCheck' },
    ],
    provider: [
      { href: '/my-listings', label: 'My listings', icon: 'Package' },
      { href: '/requests', label: 'Requests', icon: 'Inbox' },
    ],
  },
};
