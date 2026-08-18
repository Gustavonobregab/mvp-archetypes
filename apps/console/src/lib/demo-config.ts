import type { DemoConfig } from '@mvp/kernel/demo/types';
import { ORG, ROLES } from '@/lib/domain';

export const DEMO: DemoConfig = {
  org: {
    ...ORG,
    tagline:
      'Every engineer, every ticket, every expiry date in one register. Pick a role below to see the system as that person sees it.',
  },
  roles: ROLES,
  manifest: {
    admin: [
      { href: '/overview', label: 'Overview', icon: 'LayoutDashboard' },
      { href: '/register', label: 'Ticket register', icon: 'ClipboardCheck' },
      { href: '/people', label: 'People', icon: 'Users' },
      { href: '/profile', label: 'Profile', icon: 'UserCircle' },
    ],
    manager: [
      { href: '/overview', label: 'Overview', icon: 'LayoutDashboard' },
      { href: '/register', label: 'Site register', icon: 'ClipboardCheck' },
      { href: '/people', label: 'My team', icon: 'Users' },
      { href: '/profile', label: 'Profile', icon: 'UserCircle' },
    ],
    technician: [
      { href: '/my-record', label: 'My tickets', icon: 'BadgeCheck' },
      { href: '/profile', label: 'Profile', icon: 'UserCircle' },
    ],
  },
};
