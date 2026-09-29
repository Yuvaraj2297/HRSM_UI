/* =============================================================
   360° Feedback — types, sample data and pure rules.
   Flow: 1 Manager → 2 Team Lead → 3 HR sign-off → 4 Published
============================================================= */

export type Evaluator = 'mgr' | 'tl' | 'hr';
export type ActingAs = Evaluator | 'employee';

/** 1–3 = waiting for that evaluator, 4 = published */
export type Stage = 1 | 2 | 3 | 4;

export interface Employee {
  key: string;
  name: string;
  role: string;
  dept: string;
  team: string;
  avatar: string; // '' = initials
}

export interface Evaluation {
  by: string;
  rating: number; // out of 5
  strengths: string;
  growth: string;
  date: string; // yyyy-mm-dd
}

/** survey scores collected alongside the pipeline (self + peers + direct reports) */
export interface Survey {
  peers: number;
  peerCount: number;
  directs: number | null;
  directCount: number;
  /** competency → [self, others] */
  competencies: Record<string, [number, number]>;
}

export interface Review {
  id: number;
  empKey: string;
  cycle: string;
  due: string; // yyyy-mm-dd
  mgr: Evaluation | null;
  tl: Evaluation | null;
  hr: Evaluation | null;
  survey: Survey | null;
}

export const EVALUATORS: Record<Evaluator, { stage: Stage; label: string; person: string; icon: string }> = {
  mgr: { stage: 1, label: 'Manager',   person: 'Ravi Chandran', icon: 'bi bi-person-badge' },
  tl:  { stage: 2, label: 'Team Lead', person: 'Karthik Raja',  icon: 'bi bi-compass' },
  hr:  { stage: 3, label: 'HR Admin',  person: 'Divya Ramesh',  icon: 'bi bi-award' },
};

export const EVALUATOR_KEYS: Evaluator[] = ['mgr', 'tl', 'hr'];

export const STAGES: { no: Stage; label: string; icon: string }[] = [
  { no: 1, label: 'Manager Review',  icon: 'bi bi-person-badge' },
  { no: 2, label: 'Team Lead Review', icon: 'bi bi-compass' },
  { no: 3, label: 'HR Sign-off',     icon: 'bi bi-award' },
  { no: 4, label: 'Published',       icon: 'bi bi-file-earmark-check' },
];

export const COMPETENCIES = [
  'Communication & Clarity',
  'Teamwork & Collaboration',
  'Leadership & Ownership',
  'Problem Solving & Speed',
];

export const RATINGS = [5, 4.5, 4, 3.5, 3, 2.5, 2].map((r) => ({ value: r, label: `${stars(r)}  ${r.toFixed(1)} — ${band(r)}` }));

export const EMPLOYEES: Employee[] = [
  { key: 'arun',   name: 'Arun Kumar',      role: 'Senior Software Engineer',    dept: 'Engineering',    team: 'Core Platform',      avatar: 'assets/profile-1.jpg' },
  { key: 'amelia', name: 'Amelia Curr',     role: 'Design Lead',                 dept: 'UI/UX Design',   team: 'Product Experience', avatar: '' },
  { key: 'sanjay', name: 'Sanjay V',        role: 'Associate Software Engineer', dept: 'Engineering',    team: 'Intern Cohort',      avatar: '' },
  { key: 'daniel', name: 'Daniel Martinez', role: 'DevOps & Cloud Lead',         dept: 'Infrastructure', team: 'Infrastructure',     avatar: 'assets/profile-2.jpg' },
  { key: 'priya',  name: 'Priya Sharma',    role: 'Frontend Developer',          dept: 'UI/UX Design',   team: 'Web Team',           avatar: 'assets/profile-3.jpg' },
  { key: 'manoj',  name: 'Manoj Kumar',     role: 'Junior Software Engineer',    dept: 'Engineering',    team: 'Backend',            avatar: '' },
];

const ev = (who: Evaluator, rating: number, strengths: string, growth: string, date: string): Evaluation => ({
  by: `${EVALUATORS[who].person} (${EVALUATORS[who].label})`, rating, strengths, growth, date,
});

export const REVIEWS: Review[] = [
  {
    id: 1, empKey: 'arun', cycle: 'FY25-26 Annual 360°', due: '2026-09-20',
    mgr: ev('mgr', 4.5, 'Owns the core platform end to end; dependable under pressure.', 'Delegate more to grow the juniors.', '2026-09-05'),
    tl:  ev('tl', 4.2, 'Thorough code reviews, strong debugging.', 'Share context earlier in planning.', '2026-09-10'),
    hr:  ev('hr', 4.0, 'Consistent attendance and policy compliance.', 'Complete the leadership track.', '2026-09-15'),
    survey: { peers: 4.0, peerCount: 2, directs: 3.8, directCount: 1, competencies: {
      'Communication & Clarity': [4.5, 4.1], 'Teamwork & Collaboration': [4.0, 4.2],
      'Leadership & Ownership': [4.3, 3.7], 'Problem Solving & Speed': [4.4, 4.6] } },
  },
  {
    id: 2, empKey: 'amelia', cycle: 'Q1 Leadership Check-in', due: '2026-09-15',
    mgr: ev('mgr', 4.9, 'Sets the design bar for the whole org.', 'Document decisions for async teams.', '2026-09-02'),
    tl:  ev('tl', 4.8, 'Great mentor; unblocks designers quickly.', 'Timebox exploration phases.', '2026-09-06'),
    hr:  ev('hr', 4.7, 'Role model for culture initiatives.', '—', '2026-09-12'),
    survey: { peers: 4.7, peerCount: 3, directs: 4.8, directCount: 2, competencies: {
      'Communication & Clarity': [4.9, 4.8], 'Teamwork & Collaboration': [4.8, 4.9],
      'Leadership & Ownership': [5.0, 4.7], 'Problem Solving & Speed': [4.9, 4.8] } },
  },
  {
    id: 3, empKey: 'sanjay', cycle: 'Probation 360°', due: '2026-09-18',
    mgr: ev('mgr', 4.6, 'Learns fast; ships clean PRs.', 'Ask for help sooner.', '2026-09-04'),
    tl:  ev('tl', 4.4, 'Reliable on assigned tickets.', 'Take on a small feature end to end.', '2026-09-08'),
    hr:  ev('hr', 4.5, 'Confirmed for permanent role.', '—', '2026-09-14'),
    survey: { peers: 4.5, peerCount: 2, directs: null, directCount: 0, competencies: {
      'Communication & Clarity': [4.5, 4.4], 'Teamwork & Collaboration': [4.7, 4.6],
      'Leadership & Ownership': [4.2, 4.3], 'Problem Solving & Speed': [4.8, 4.7] } },
  },
  {
    id: 4, empKey: 'daniel', cycle: 'Leadership Check-in', due: '2026-10-05',
    mgr: ev('mgr', 4.8, 'Zero-downtime cloud migration.', 'Grow a second on-call lead.', '2026-09-16'),
    tl:  ev('tl', 4.7, 'Automates everything he touches.', 'Write more runbooks.', '2026-09-22'),
    hr:  null,
    survey: { peers: 4.5, peerCount: 2, directs: 4.6, directCount: 3, competencies: {
      'Communication & Clarity': [4.7, 4.6], 'Teamwork & Collaboration': [4.8, 4.7],
      'Leadership & Ownership': [4.9, 4.5], 'Problem Solving & Speed': [4.8, 4.8] } },
  },
  {
    id: 5, empKey: 'priya', cycle: 'FY25-26 Annual 360°', due: '2026-10-08',
    mgr: ev('mgr', 4.2, 'Pixel-perfect delivery of the new portal.', 'Speak up earlier in design reviews.', '2026-09-24'),
    tl:  null, hr: null,
    survey: { peers: 3.9, peerCount: 2, directs: null, directCount: 0, competencies: {
      'Communication & Clarity': [4.3, 4.0], 'Teamwork & Collaboration': [4.1, 4.2],
      'Leadership & Ownership': [4.0, 3.8], 'Problem Solving & Speed': [4.4, 4.3] } },
  },
  {
    id: 6, empKey: 'manoj', cycle: 'FY25-26 Annual 360°', due: '2026-10-10',
    mgr: null, tl: null, hr: null, survey: null,
  },
];

// ------------------------------------------------------------------ rules

export function stageOf(r: Review): Stage {
  if (!r.mgr) return 1;
  if (!r.tl) return 2;
  if (!r.hr) return 3;
  return 4;
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** overall 360° = mean of every non-self source available (manager, TL, HR, peers, directs) */
export function overallOf(r: Review): number | null {
  const scores = [r.mgr?.rating, r.tl?.rating, r.hr?.rating, r.survey?.peers, r.survey?.directs ?? undefined]
    .filter((x): x is number => typeof x === 'number');
  return scores.length ? round1(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
}

export function band(r: number): string {
  if (r >= 4.6) return 'Outstanding';
  if (r >= 4.2) return 'Exceeds expectations';
  if (r >= 3.5) return 'Meets expectations';
  return 'Needs improvement';
}

export function stars(r: number): string {
  const full = Math.round(r);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

/** how others see a competency compared with the employee's self-rating */
export function gapOf(self: number, others: number): { value: number; label: string; cls: string; icon: string } {
  const value = round1(others - self);
  if (Math.abs(value) <= 0.1) return { value, label: 'Aligned', cls: 'status-success', icon: 'bi bi-dash-lg' };
  if (value > 0) return { value, label: 'Hidden strength', cls: 'status-success', icon: 'bi bi-arrow-up-right' };
  if (value <= -0.5) return { value, label: 'Growth area', cls: 'status-rejected', icon: 'bi bi-arrow-down-right' };
  return { value, label: 'Over-estimated', cls: 'status-warning', icon: 'bi bi-arrow-down-right' };
}

export function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(iso).getTime() - today.getTime()) / 86_400_000);
}

export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function fmtDate(iso: string): string {
  return iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
}

export function initials(name: string): string {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}
