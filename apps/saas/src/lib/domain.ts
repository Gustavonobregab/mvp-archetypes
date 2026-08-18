/* SaaS archetype. Based on a real Upwork posting: a B2B subscription platform
   for independent kitchen installers. Customer signs up, pays, runs their own
   jobs. That self-serve billing boundary is what separates this archetype from
   the internal Console. */

export type RoleKey = 'owner' | 'member' | 'platform';

export const ORG = {
  name: 'KINSTALL',
  short: 'KINSTALL',
  product: 'Installer OS',
  tagline:
    'Quotes, jobs and invoices for independent kitchen fitters. Pick a role below to see the system as that person sees it.',
};

export const TODAY = new Date('2026-08-18T09:00:00Z');

export type Plan = { id: string; name: string; pricePerMonth: number; seats: number; features: string[] };

export const PLANS: Plan[] = [
  { id: 'solo', name: 'Solo', pricePerMonth: 29, seats: 1, features: ['Unlimited quotes', 'Job scheduling', 'PDF invoices'] },
  { id: 'crew', name: 'Crew', pricePerMonth: 79, seats: 5, features: ['Everything in Solo', 'Team calendar', 'Customer portal', 'Xero sync'] },
  { id: 'firm', name: 'Firm', pricePerMonth: 189, seats: 20, features: ['Everything in Crew', 'Multi-branch', 'Custom fields', 'Priority support'] },
];

export type Org = { id: string; name: string; planId: string; seatsUsed: number; renewsOn: string; mrr: number; status: 'active' | 'trialing' | 'past_due' };

export const ORGS: Org[] = [
  { id: 'o1', name: 'Halden Kitchens', planId: 'crew', seatsUsed: 4, renewsOn: '2026-09-04', mrr: 79, status: 'active' },
  { id: 'o2', name: 'Redwood Fitters', planId: 'solo', seatsUsed: 1, renewsOn: '2026-08-27', mrr: 29, status: 'active' },
  { id: 'o3', name: 'Northgate Interiors', planId: 'firm', seatsUsed: 14, renewsOn: '2026-09-19', mrr: 189, status: 'active' },
  { id: 'o4', name: 'Brookfield Joinery', planId: 'crew', seatsUsed: 5, renewsOn: '2026-08-22', mrr: 79, status: 'past_due' },
  { id: 'o5', name: 'Marlow Kitchen Co', planId: 'solo', seatsUsed: 1, renewsOn: '2026-09-01', mrr: 0, status: 'trialing' },
];

export const CURRENT_ORG_ID = 'o1';

export type Member = { id: string; orgId: string; name: string; email: string; role: 'Owner' | 'Fitter' | 'Office'; invitedOn: string; acceptedOn: string | null };

export const MEMBERS: Member[] = [
  { id: 'm1', orgId: 'o1', name: 'Ross Halden', email: 'ross@haldenkitchens.co.uk', role: 'Owner', invitedOn: '2024-02-11', acceptedOn: '2024-02-11' },
  { id: 'm2', orgId: 'o1', name: 'Danny Cole', email: 'danny@haldenkitchens.co.uk', role: 'Fitter', invitedOn: '2024-03-02', acceptedOn: '2024-03-03' },
  { id: 'm3', orgId: 'o1', name: 'Priti Shah', email: 'priti@haldenkitchens.co.uk', role: 'Office', invitedOn: '2025-01-20', acceptedOn: '2025-01-20' },
  { id: 'm4', orgId: 'o1', name: 'Wes Duffy', email: 'wes@haldenkitchens.co.uk', role: 'Fitter', invitedOn: '2026-08-10', acceptedOn: null },
];

export type JobStage = 'quote' | 'scheduled' | 'in_progress' | 'invoiced' | 'paid';

export const STAGE_LABEL: Record<JobStage, string> = {
  quote: 'Quote sent',
  scheduled: 'Scheduled',
  in_progress: 'On site',
  invoiced: 'Invoiced',
  paid: 'Paid',
};

export const STAGE_ORDER: JobStage[] = ['quote', 'scheduled', 'in_progress', 'invoiced', 'paid'];

export type Job = {
  id: string;
  orgId: string;
  customer: string;
  address: string;
  stage: JobStage;
  value: number;
  startsOn: string;
  assignedTo: string | null;
};

export const JOBS: Job[] = [
  { id: 'j1', orgId: 'o1', customer: 'Mrs Okafor', address: '14 Bramley Rise, Guildford', stage: 'in_progress', value: 8400, startsOn: '2026-08-17', assignedTo: 'm2' },
  { id: 'j2', orgId: 'o1', customer: 'The Ashworths', address: '3 Kiln Lane, Farnham', stage: 'scheduled', value: 12250, startsOn: '2026-08-24', assignedTo: 'm2' },
  { id: 'j3', orgId: 'o1', customer: 'D. Marchetti', address: '88 Wey Court, Woking', stage: 'quote', value: 6100, startsOn: '2026-09-02', assignedTo: null },
  { id: 'j4', orgId: 'o1', customer: 'Bramwell Lettings', address: 'Flat 7, Oak House, Woking', stage: 'invoiced', value: 4750, startsOn: '2026-07-28', assignedTo: 'm4' },
  { id: 'j5', orgId: 'o1', customer: 'Mr & Mrs Adeyemi', address: '22 Pilgrims Way, Godalming', stage: 'paid', value: 15900, startsOn: '2026-06-15', assignedTo: 'm2' },
  { id: 'j6', orgId: 'o1', customer: 'S. Whitcombe', address: '5 Tannery Yard, Alton', stage: 'quote', value: 9300, startsOn: '2026-09-09', assignedTo: null },
  { id: 'j7', orgId: 'o1', customer: 'Kestrel Property', address: '19 Mill Street, Basingstoke', stage: 'paid', value: 7200, startsOn: '2026-05-30', assignedTo: 'm4' },
  { id: 'j8', orgId: 'o1', customer: 'Mrs Lindqvist', address: '41 Beech Drive, Camberley', stage: 'scheduled', value: 11400, startsOn: '2026-09-01', assignedTo: 'm2' },
];

export const PLAN_BY_ID = Object.fromEntries(PLANS.map((p) => [p.id, p])) as Record<string, Plan>;
export const MEMBER_BY_ID = Object.fromEntries(MEMBERS.map((m) => [m.id, m])) as Record<string, Member>;
export const ORG_BY_ID = Object.fromEntries(ORGS.map((o) => [o.id, o])) as Record<string, Org>;

export function money(n: number): string {
  return `£${n.toLocaleString('en-GB')}`;
}

export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
