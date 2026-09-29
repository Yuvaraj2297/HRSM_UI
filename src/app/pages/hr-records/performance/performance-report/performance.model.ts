/* =============================================================
   Performance Reports — types, sample data and pure rules.
   Every number on the page is computed from RESULTS.
============================================================= */

export interface Employee {
  key: string;
  name: string;
  role: string;
  designation: string;
  dept: string;
  manager: string;
  avatar: string; // '' = initials
}

export interface Result {
  empKey: string;
  year: number; // fiscal year end, e.g. 2026 = FY25-26
  cycle: CycleKey;
  kpi: number; // % achievement
  self: number;
  mgr: number | null;
  final: number | null; // HR-approved rating; null while still in the workflow
}

export type CycleKey = 'annual' | 'q1' | 'probation';

export const CYCLES: Record<CycleKey, string> = {
  annual: 'Annual Review',
  q1: 'Q1 Leadership Check-in',
  probation: 'Probation Review',
};

export const DEPTS: { name: string; desc: string; icon: string }[] = [
  { name: 'Engineering',       desc: 'Core software & systems',   icon: 'bi bi-code-slash' },
  { name: 'UI/UX Design',      desc: 'Product experience',        icon: 'bi bi-palette' },
  { name: 'Infrastructure',    desc: 'Cloud & DevOps',            icon: 'bi bi-hdd-network' },
  { name: 'Quality Assurance', desc: 'Testing & automation',      icon: 'bi bi-bug' },
  { name: 'Human Resources',   desc: 'People operations',         icon: 'bi bi-people' },
];

/** rating bands used by the distribution charts (highest first) */
export const BANDS: { key: number; label: string; min: number; tone: string }[] = [
  { key: 5, label: 'Outstanding',        min: 4.5, tone: 'var(--primary)' },
  { key: 4, label: 'Exceeds',            min: 4.0, tone: 'var(--teal-350)' },
  { key: 3, label: 'Meets expectations', min: 3.5, tone: 'var(--blue-450)' },
  { key: 2, label: 'Needs improvement',  min: 3.0, tone: 'var(--warning)' },
  { key: 1, label: 'Unsatisfactory',     min: 0,   tone: 'var(--danger)' },
];

export const EMPLOYEES: Employee[] = [
  { key: 'arun',    name: 'Arun Kumar',      role: 'Senior Software Engineer',    designation: 'Software Engineer', dept: 'Engineering',       manager: 'Rajesh Sharma', avatar: 'assets/profile-1.jpg' },
  { key: 'sanjay',  name: 'Sanjay V',        role: 'Associate Software Engineer', designation: 'Software Engineer', dept: 'Engineering',       manager: 'Karthik Raja',  avatar: '' },
  { key: 'manoj',   name: 'Manoj Kumar',     role: 'Junior Software Engineer',    designation: 'Software Engineer', dept: 'Engineering',       manager: 'Rajesh Sharma', avatar: '' },
  { key: 'vikram',  name: 'Vikram Sethi',    role: 'Lead Architect',              designation: 'Architect',         dept: 'Engineering',       manager: 'Rajesh Sharma', avatar: '' },
  { key: 'deepa',   name: 'Deepa N',         role: 'Software Engineer',           designation: 'Software Engineer', dept: 'Engineering',       manager: 'Karthik Raja',  avatar: '' },
  { key: 'amelia',  name: 'Amelia Curr',     role: 'Design Lead',                 designation: 'Design Lead',       dept: 'UI/UX Design',      manager: 'Rajesh Sharma', avatar: '' },
  { key: 'priya',   name: 'Priya Sharma',    role: 'Frontend Developer',          designation: 'Designer',          dept: 'UI/UX Design',      manager: 'Amelia Curr',   avatar: 'assets/profile-3.jpg' },
  { key: 'rohan',   name: 'Rohan Mehra',     role: 'Product Designer',            designation: 'Designer',          dept: 'UI/UX Design',      manager: 'Amelia Curr',   avatar: '' },
  { key: 'daniel',  name: 'Daniel Martinez', role: 'DevOps & Cloud Lead',         designation: 'DevOps Lead',       dept: 'Infrastructure',    manager: 'Rajesh Sharma', avatar: 'assets/profile-2.jpg' },
  { key: 'karthik', name: 'Karthik Raja',    role: 'Site Reliability Engineer',   designation: 'DevOps Engineer',   dept: 'Infrastructure',    manager: 'Daniel Martinez', avatar: '' },
  { key: 'swati',   name: 'Swati P',         role: 'QA Lead',                     designation: 'QA Engineer',       dept: 'Quality Assurance', manager: 'Karthik Raja',  avatar: '' },
  { key: 'anand',   name: 'Anand K',         role: 'QA Engineer',                 designation: 'QA Engineer',       dept: 'Quality Assurance', manager: 'Swati P',       avatar: '' },
  { key: 'divya',   name: 'Divya Ramesh',    role: 'HR Admin',                    designation: 'HR Partner',        dept: 'Human Resources',   manager: 'Rajesh Sharma', avatar: '' },
  { key: 'kavitha', name: 'Kavitha M',       role: 'HR Generalist',               designation: 'HR Partner',        dept: 'Human Resources',   manager: 'Divya Ramesh',  avatar: '' },
];

const r = (empKey: string, year: number, cycle: CycleKey, kpi: number, self: number, mgr: number | null, final: number | null): Result =>
  ({ empKey, year, cycle, kpi, self, mgr, final });

export const RESULTS: Result[] = [
  // FY25-26
  r('arun', 2026, 'annual', 92, 4.2, 4.5, 4.5),
  r('sanjay', 2026, 'probation', 88, 4.6, 4.4, 4.5),
  r('manoj', 2026, 'annual', 75, 3.5, null, null),
  r('vikram', 2026, 'annual', 95, 4.8, 4.8, 4.8),
  r('deepa', 2026, 'q1', 84, 4.0, 4.1, 4.1),
  r('amelia', 2026, 'annual', 96, 4.9, 4.8, 4.8),
  r('priya', 2026, 'annual', 85, 4.2, 4.0, null),
  r('rohan', 2026, 'q1', 90, 4.2, 4.3, 4.3),
  r('daniel', 2026, 'q1', 94, 4.8, 4.7, 4.6),
  r('karthik', 2026, 'annual', 89, 4.2, 4.4, 4.4),
  r('swati', 2026, 'annual', 82, 3.8, 3.9, 3.9),
  r('anand', 2026, 'probation', 71, 3.5, 3.2, 3.2),
  r('divya', 2026, 'annual', 95, 4.9, 4.9, 4.9),
  r('kavitha', 2026, 'annual', 90, 4.4, 4.5, 4.5),
  // FY24-25
  r('arun', 2025, 'annual', 86, 4.0, 4.0, 4.0),
  r('sanjay', 2025, 'annual', 80, 4.0, 4.0, 4.0),
  r('amelia', 2025, 'annual', 90, 4.5, 4.5, 4.5),
  r('priya', 2025, 'annual', 78, 3.8, 3.8, 3.8),
  r('daniel', 2025, 'annual', 88, 4.4, 4.3, 4.3),
  r('vikram', 2025, 'annual', 91, 4.6, 4.6, 4.6),
  r('swati', 2025, 'annual', 79, 3.6, 3.7, 3.7),
  r('divya', 2025, 'annual', 92, 4.7, 4.7, 4.7),
  // FY23-24
  r('arun', 2024, 'annual', 78, 3.5, 3.5, 3.5),
  r('sanjay', 2024, 'probation', 75, 3.8, 3.8, 3.8),
  r('amelia', 2024, 'annual', 84, 4.2, 4.2, 4.2),
  r('priya', 2024, 'probation', 72, 3.6, 3.6, 3.6),
  r('daniel', 2024, 'annual', 82, 4.0, 4.0, 4.0),
];

// ------------------------------------------------------------------ rules

export function bandOf(rating: number) {
  return BANDS.find((b) => rating >= b.min)!;
}

export function avg(xs: number[]): number | null {
  return xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null;
}

export function fyLabel(year: number): string {
  return `FY${String(year - 1).slice(2)}-${String(year).slice(2)}`;
}

export function initials(name: string): string {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

/** counts per rating band + share of the total, highest band first */
export function distribution(ratings: number[]) {
  const total = ratings.length;
  return BANDS.map((b) => {
    const count = ratings.filter((x) => bandOf(x).key === b.key).length;
    return { ...b, count, pct: total ? Math.round((count / total) * 100) : 0 };
  });
}
