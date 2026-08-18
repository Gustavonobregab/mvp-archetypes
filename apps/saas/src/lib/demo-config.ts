import type { DemoConfig } from '@mvp/kernel/demo/types';
import { ORG } from '@/lib/domain';

export const DEMO: DemoConfig = {
  org: ORG,
  roles: [
    { key: 'owner', label: 'Business Owner', pitch: 'Runs the firm, sees every job and the bill', landing: '/jobs' },
    { key: 'member', label: 'Fitter', pitch: 'Sees only the jobs assigned to them this week', landing: '/jobs' },
    { key: 'platform', label: 'Platform Admin', pitch: 'Sees every subscriber, plan and revenue across the product', landing: '/accounts' },
  ],
  manifest: {
    owner: [
      { href: '/jobs', label: 'Jobs', icon: 'Hammer' },
      { href: '/team', label: 'Team', icon: 'Users' },
      { href: '/billing', label: 'Billing', icon: 'CreditCard' },
    ],
    member: [{ href: '/jobs', label: 'My jobs', icon: 'Hammer' }],
    platform: [{ href: '/accounts', label: 'Accounts', icon: 'Building2' }],
  },
};
