/* Domain layer of the Console archetype. A reskin rewrites this file and the
   role config below; everything under src/shared stays untouched. */

export type RoleKey = 'admin' | 'manager' | 'technician';

export type RoleDef = {
  key: RoleKey;
  label: string;
  pitch: string;
  landing: string;
};

/* Roles are a first-class parameter: they drive the demo gate, the navigation
   and which slice of the seed each persona sees. */
export const ROLES: RoleDef[] = [
  {
    key: 'admin',
    label: 'Compliance Lead',
    pitch: 'Sees every site, chases expiring tickets, signs off renewals',
    landing: '/overview',
  },
  {
    key: 'manager',
    label: 'Site Manager',
    pitch: 'Owns one depot, knows who can work tomorrow and who cannot',
    landing: '/overview',
  },
  {
    key: 'technician',
    label: 'Engineer',
    pitch: 'Checks their own tickets, books the course before it lapses',
    landing: '/my-record',
  },
];

export const ROLE_BY_KEY = Object.fromEntries(ROLES.map((r) => [r.key, r])) as Record<RoleKey, RoleDef>;

export const ORG = {
  name: 'Kestrel Facilities Group',
  short: 'Kestrel',
  product: 'Ticket Register',
};

/* Fixed so the demo reads the same on any day it is opened. */
export const TODAY = new Date('2026-08-18T09:00:00Z');

export type Site = { id: string; name: string; region: string };

export const SITES: Site[] = [
  { id: 's1', name: 'Croydon Depot', region: 'South East' },
  { id: 's2', name: 'Slough Distribution Centre', region: 'South East' },
  { id: 's3', name: 'Bristol Workshop', region: 'South West' },
  { id: 's4', name: 'Leeds Depot', region: 'North' },
];

export type Ticket = {
  id: string;
  name: string;
  body: string;
  validityMonths: number;
  mandatory: boolean;
};

/* Real UK facilities-maintenance certifications. */
export const TICKETS: Ticket[] = [
  { id: 't1', name: 'Working at Height', body: 'IPAF', validityMonths: 60, mandatory: true },
  { id: 't2', name: 'Confined Space Entry', body: 'City & Guilds', validityMonths: 36, mandatory: true },
  { id: 't3', name: 'First Aid at Work', body: 'HSE', validityMonths: 36, mandatory: true },
  { id: 't4', name: 'Counterbalance Forklift', body: 'RTITB', validityMonths: 36, mandatory: false },
  { id: 't5', name: 'Asbestos Awareness', body: 'UKATA', validityMonths: 12, mandatory: true },
  { id: 't6', name: 'Fire Warden', body: 'IFE', validityMonths: 36, mandatory: false },
  { id: 't7', name: 'Mobile Tower Scaffold', body: 'PASMA', validityMonths: 60, mandatory: false },
  { id: 't8', name: 'COSHH Handling', body: 'BSC', validityMonths: 24, mandatory: true },
];

export const TICKET_BY_ID = Object.fromEntries(TICKETS.map((t) => [t.id, t])) as Record<string, Ticket>;

export type Person = {
  id: string;
  name: string;
  jobTitle: string;
  siteId: string;
  employmentType: 'Employee' | 'Subcontractor';
  startedOn: string;
};

export const PEOPLE: Person[] = [
  { id: 'p1', name: 'Dean Whitlock', jobTitle: 'Maintenance Engineer', siteId: 's1', employmentType: 'Employee', startedOn: '2019-03-11' },
  { id: 'p2', name: 'Priya Raghavan', jobTitle: 'Electrical Engineer', siteId: 's1', employmentType: 'Employee', startedOn: '2021-09-06' },
  { id: 'p3', name: 'Marcus Ellery', jobTitle: 'HVAC Technician', siteId: 's2', employmentType: 'Subcontractor', startedOn: '2024-01-15' },
  { id: 'p4', name: 'Sofia Brennan', jobTitle: 'Site Supervisor', siteId: 's2', employmentType: 'Employee', startedOn: '2017-06-19' },
  { id: 'p5', name: 'Tomasz Wierzbicki', jobTitle: 'Maintenance Engineer', siteId: 's3', employmentType: 'Employee', startedOn: '2022-11-28' },
  { id: 'p6', name: 'Amara Okonjo', jobTitle: 'Fabric Technician', siteId: 's3', employmentType: 'Employee', startedOn: '2023-04-03' },
  { id: 'p7', name: 'Callum Ferris', jobTitle: 'Mechanical Fitter', siteId: 's4', employmentType: 'Subcontractor', startedOn: '2025-02-10' },
  { id: 'p8', name: 'Grace Ndiaye', jobTitle: 'Electrical Engineer', siteId: 's4', employmentType: 'Employee', startedOn: '2020-08-24' },
  { id: 'p9', name: 'Rhys Callaghan', jobTitle: 'Maintenance Engineer', siteId: 's1', employmentType: 'Employee', startedOn: '2018-10-01' },
  { id: 'p10', name: 'Ingrid Halvorsen', jobTitle: 'Water Hygiene Technician', siteId: 's2', employmentType: 'Employee', startedOn: '2023-07-17' },
  { id: 'p11', name: 'Femi Adeyemi', jobTitle: 'HVAC Technician', siteId: 's3', employmentType: 'Subcontractor', startedOn: '2024-09-02' },
  { id: 'p12', name: 'Bridget Nolan', jobTitle: 'Site Supervisor', siteId: 's4', employmentType: 'Employee', startedOn: '2016-05-30' },
  { id: 'p13', name: 'Owen Mbeki', jobTitle: 'Fabric Technician', siteId: 's1', employmentType: 'Employee', startedOn: '2025-06-16' },
  { id: 'p14', name: 'Lena Fischer', jobTitle: 'Mechanical Fitter', siteId: 's2', employmentType: 'Employee', startedOn: '2022-02-07' },
];

export const PERSON_BY_ID = Object.fromEntries(PEOPLE.map((p) => [p.id, p])) as Record<string, Person>;
export const SITE_BY_ID = Object.fromEntries(SITES.map((s) => [s.id, s])) as Record<string, Site>;

export type RecordStatus = 'valid' | 'expiring' | 'expired' | 'missing';

export type TicketRecord = {
  id: string;
  personId: string;
  ticketId: string;
  awardedOn: string | null;
  expiresOn: string | null;
  certificateRef: string | null;
};

/* Deliberately uneven: a few people fully compliant, several with one lapse,
   two with a mandatory ticket missing entirely. A tidy dataset reads as a
   template; an operation with real gaps in it reads as their operation. */
export const RECORDS: TicketRecord[] = [
  { id: 'r1', personId: 'p1', ticketId: 't1', awardedOn: '2023-05-12', expiresOn: '2028-05-12', certificateRef: 'IPAF-884213' },
  { id: 'r2', personId: 'p1', ticketId: 't3', awardedOn: '2023-09-04', expiresOn: '2026-09-04', certificateRef: 'HSE-114907' },
  { id: 'r3', personId: 'p1', ticketId: 't5', awardedOn: '2025-08-30', expiresOn: '2026-08-30', certificateRef: 'UKATA-55120' },
  { id: 'r4', personId: 'p1', ticketId: 't8', awardedOn: '2024-11-11', expiresOn: '2026-11-11', certificateRef: 'BSC-70233' },

  { id: 'r5', personId: 'p2', ticketId: 't1', awardedOn: '2022-02-18', expiresOn: '2027-02-18', certificateRef: 'IPAF-771034' },
  { id: 'r6', personId: 'p2', ticketId: 't3', awardedOn: '2024-06-21', expiresOn: '2027-06-21', certificateRef: 'HSE-129844' },
  { id: 'r7', personId: 'p2', ticketId: 't5', awardedOn: '2025-07-15', expiresOn: '2026-07-15', certificateRef: 'UKATA-54011' },
  { id: 'r8', personId: 'p2', ticketId: 't8', awardedOn: '2025-03-09', expiresOn: '2027-03-09', certificateRef: 'BSC-81190' },

  { id: 'r9', personId: 'p3', ticketId: 't1', awardedOn: '2024-04-02', expiresOn: '2029-04-02', certificateRef: 'IPAF-903881' },
  { id: 'r10', personId: 'p3', ticketId: 't5', awardedOn: '2025-08-19', expiresOn: '2026-08-19', certificateRef: 'UKATA-56744' },
  { id: 'r11', personId: 'p3', ticketId: 't2', awardedOn: '2024-02-26', expiresOn: '2027-02-26', certificateRef: 'CG-330218' },

  { id: 'r12', personId: 'p4', ticketId: 't3', awardedOn: '2024-10-08', expiresOn: '2027-10-08', certificateRef: 'HSE-133021' },
  { id: 'r13', personId: 'p4', ticketId: 't6', awardedOn: '2023-12-05', expiresOn: '2026-12-05', certificateRef: 'IFE-20714' },
  { id: 'r14', personId: 'p4', ticketId: 't5', awardedOn: '2025-09-01', expiresOn: '2026-09-01', certificateRef: 'UKATA-57002' },
  { id: 'r15', personId: 'p4', ticketId: 't8', awardedOn: '2025-01-20', expiresOn: '2027-01-20', certificateRef: 'BSC-78450' },

  { id: 'r16', personId: 'p5', ticketId: 't1', awardedOn: '2023-01-30', expiresOn: '2028-01-30', certificateRef: 'IPAF-812445' },
  { id: 'r17', personId: 'p5', ticketId: 't5', awardedOn: '2024-08-12', expiresOn: '2025-08-12', certificateRef: 'UKATA-48119' },
  { id: 'r18', personId: 'p5', ticketId: 't3', awardedOn: '2023-02-14', expiresOn: '2026-02-14', certificateRef: 'HSE-108332' },

  { id: 'r19', personId: 'p6', ticketId: 't5', awardedOn: '2025-10-06', expiresOn: '2026-10-06', certificateRef: 'UKATA-58330' },
  { id: 'r20', personId: 'p6', ticketId: 't7', awardedOn: '2023-06-27', expiresOn: '2028-06-27', certificateRef: 'PASMA-64229' },
  { id: 'r21', personId: 'p6', ticketId: 't8', awardedOn: '2024-09-16', expiresOn: '2026-09-16', certificateRef: 'BSC-71980' },

  { id: 'r22', personId: 'p7', ticketId: 't1', awardedOn: '2025-03-04', expiresOn: '2030-03-04', certificateRef: 'IPAF-948120' },
  { id: 'r23', personId: 'p7', ticketId: 't5', awardedOn: '2025-08-25', expiresOn: '2026-08-25', certificateRef: 'UKATA-56901' },

  { id: 'r24', personId: 'p8', ticketId: 't1', awardedOn: '2021-11-09', expiresOn: '2026-11-09', certificateRef: 'IPAF-702118' },
  { id: 'r25', personId: 'p8', ticketId: 't3', awardedOn: '2025-05-13', expiresOn: '2028-05-13', certificateRef: 'HSE-140882' },
  { id: 'r26', personId: 'p8', ticketId: 't5', awardedOn: '2025-06-02', expiresOn: '2026-06-02', certificateRef: 'UKATA-52774' },
  { id: 'r27', personId: 'p8', ticketId: 't8', awardedOn: '2025-04-28', expiresOn: '2027-04-28', certificateRef: 'BSC-82330' },

  { id: 'r28', personId: 'p9', ticketId: 't1', awardedOn: '2022-07-19', expiresOn: '2027-07-19', certificateRef: 'IPAF-758802' },
  { id: 'r29', personId: 'p9', ticketId: 't2', awardedOn: '2023-03-22', expiresOn: '2026-03-22', certificateRef: 'CG-318740' },
  { id: 'r30', personId: 'p9', ticketId: 't5', awardedOn: '2025-08-21', expiresOn: '2026-08-21', certificateRef: 'UKATA-56612' },
  { id: 'r31', personId: 'p9', ticketId: 't8', awardedOn: '2023-10-30', expiresOn: '2025-10-30', certificateRef: 'BSC-66104' },

  { id: 'r32', personId: 'p10', ticketId: 't3', awardedOn: '2024-03-18', expiresOn: '2027-03-18', certificateRef: 'HSE-125006' },
  { id: 'r33', personId: 'p10', ticketId: 't5', awardedOn: '2025-09-12', expiresOn: '2026-09-12', certificateRef: 'UKATA-57415' },
  { id: 'r34', personId: 'p10', ticketId: 't8', awardedOn: '2024-12-02', expiresOn: '2026-12-02', certificateRef: 'BSC-73118' },

  { id: 'r35', personId: 'p11', ticketId: 't1', awardedOn: '2024-10-14', expiresOn: '2029-10-14', certificateRef: 'IPAF-921553' },
  { id: 'r36', personId: 'p11', ticketId: 't5', awardedOn: '2024-09-23', expiresOn: '2025-09-23', certificateRef: 'UKATA-49880' },

  { id: 'r37', personId: 'p12', ticketId: 't3', awardedOn: '2025-02-11', expiresOn: '2028-02-11', certificateRef: 'HSE-137204' },
  { id: 'r38', personId: 'p12', ticketId: 't6', awardedOn: '2024-05-08', expiresOn: '2027-05-08', certificateRef: 'IFE-22011' },
  { id: 'r39', personId: 'p12', ticketId: 't5', awardedOn: '2025-08-28', expiresOn: '2026-08-28', certificateRef: 'UKATA-56988' },
  { id: 'r40', personId: 'p12', ticketId: 't8', awardedOn: '2025-06-19', expiresOn: '2027-06-19', certificateRef: 'BSC-83901' },

  { id: 'r41', personId: 'p13', ticketId: 't5', awardedOn: '2025-07-01', expiresOn: '2026-07-01', certificateRef: 'UKATA-53620' },
  { id: 'r42', personId: 'p13', ticketId: 't7', awardedOn: '2025-08-06', expiresOn: '2030-08-06', certificateRef: 'PASMA-71844' },

  { id: 'r43', personId: 'p14', ticketId: 't1', awardedOn: '2022-04-25', expiresOn: '2027-04-25', certificateRef: 'IPAF-744019' },
  { id: 'r44', personId: 'p14', ticketId: 't4', awardedOn: '2024-01-11', expiresOn: '2027-01-11', certificateRef: 'RTITB-40773' },
  { id: 'r45', personId: 'p14', ticketId: 't5', awardedOn: '2025-05-16', expiresOn: '2026-05-16', certificateRef: 'UKATA-51204' },
  { id: 'r46', personId: 'p14', ticketId: 't8', awardedOn: '2023-08-14', expiresOn: '2025-08-14', certificateRef: 'BSC-64880' },
];

const DAY_MS = 86_400_000;
const EXPIRING_WINDOW_DAYS = 60;

export function daysUntil(iso: string, from: Date = TODAY): number {
  return Math.round((new Date(iso).getTime() - from.getTime()) / DAY_MS);
}

export function statusOf(record: TicketRecord, from: Date = TODAY): RecordStatus {
  if (!record.expiresOn) return 'missing';
  const days = daysUntil(record.expiresOn, from);
  if (days < 0) return 'expired';
  if (days <= EXPIRING_WINDOW_DAYS) return 'expiring';
  return 'valid';
}

export const STATUS_LABEL: Record<RecordStatus, string> = {
  valid: 'Valid',
  expiring: 'Expiring',
  expired: 'Expired',
  missing: 'Not held',
};

export type RegisterRow = {
  id: string;
  personId: string;
  person: string;
  jobTitle: string;
  site: string;
  siteId: string;
  employmentType: Person['employmentType'];
  ticket: string;
  ticketId: string;
  body: string;
  mandatory: boolean;
  awardedOn: string | null;
  expiresOn: string | null;
  certificateRef: string | null;
  status: RecordStatus;
  daysLeft: number | null;
};

/* One row per person-and-ticket pair, including mandatory tickets a person does
   not hold at all. Those gaps are the reason the product exists, so they must be
   rows rather than absences. */
export function buildRegister(
  records: TicketRecord[] = RECORDS,
  from: Date = TODAY,
): RegisterRow[] {
  const rows: RegisterRow[] = [];

  for (const person of PEOPLE) {
    const site = SITE_BY_ID[person.siteId];
    const held = records.filter((r) => r.personId === person.id);

    for (const record of held) {
      const ticket = TICKET_BY_ID[record.ticketId];
      if (!ticket || !site) continue;
      rows.push({
        id: record.id,
        personId: person.id,
        person: person.name,
        jobTitle: person.jobTitle,
        site: site.name,
        siteId: site.id,
        employmentType: person.employmentType,
        ticket: ticket.name,
        ticketId: ticket.id,
        body: ticket.body,
        mandatory: ticket.mandatory,
        awardedOn: record.awardedOn,
        expiresOn: record.expiresOn,
        certificateRef: record.certificateRef,
        status: statusOf(record, from),
        daysLeft: record.expiresOn ? daysUntil(record.expiresOn, from) : null,
      });
    }

    for (const ticket of TICKETS.filter((t) => t.mandatory)) {
      if (held.some((r) => r.ticketId === ticket.id)) continue;
      if (!site) continue;
      rows.push({
        id: `${person.id}-${ticket.id}-missing`,
        personId: person.id,
        person: person.name,
        jobTitle: person.jobTitle,
        site: site.name,
        siteId: site.id,
        employmentType: person.employmentType,
        ticket: ticket.name,
        ticketId: ticket.id,
        body: ticket.body,
        mandatory: true,
        awardedOn: null,
        expiresOn: null,
        certificateRef: null,
        status: 'missing',
        daysLeft: null,
      });
    }
  }

  return rows;
}

export const SITE_OF_MANAGER = 's2';
export const TECHNICIAN_ID = 'p5';

/* The seed each persona is allowed to see. Same register, three viewports. */
export function registerForRole(
  role: RoleKey,
  records: TicketRecord[] = RECORDS,
  from: Date = TODAY,
): RegisterRow[] {
  const all = buildRegister(records, from);
  if (role === 'manager') return all.filter((r) => r.siteId === SITE_OF_MANAGER);
  if (role === 'technician') return all.filter((r) => r.personId === TECHNICIAN_ID);
  return all;
}

export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
