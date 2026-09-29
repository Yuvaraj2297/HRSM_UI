/* =============================================================
   Performance Appraisal — types, sample data and pure rules.
   Flow: 1 Self-review → 2 Team Lead → 3 HR → 4 Manager → 5 Scorecard
============================================================= */

export type ReviewTier = 'tl' | 'hr' | 'mgr';

/** 1 = self-review not submitted, 2–4 = waiting for that reviewer, 5 = complete */
export type Stage = 1 | 2 | 3 | 4 | 5;

export interface Review {
  by: string;
  rating: number; // out of 5
  hike: number; // %
  promotion: string; // '' = none
  remarks: string;
  date: string; // yyyy-mm-dd
}

export interface SelfReview {
  projects: string;
  tools: string;
  summary: string;
  achievements: string;
  rating: number;
  certs: string;
}

export interface Appraisal {
  key: string;
  id: string;
  name: string;
  email: string;
  dept: string;
  role: string;
  teamLead: string;
  self: SelfReview;
  submitted: boolean;
  tl: Review | null;
  hr: Review | null;
  mgr: Review | null;
}

export const STAGES: { no: Stage; label: string; who: string; icon: string }[] = [
  { no: 1, label: 'Self-Review', who: 'Employee',  icon: 'bi bi-person' },
  { no: 2, label: 'Team Lead',   who: 'TL review', icon: 'bi bi-people' },
  { no: 3, label: 'HR Review',   who: 'HRBP',      icon: 'bi bi-shield-check' },
  { no: 4, label: 'Manager',     who: 'Sign-off',  icon: 'bi bi-award' },
  { no: 5, label: 'Scorecard',   who: 'Complete',  icon: 'bi bi-patch-check' },
];

export const TIERS: Record<ReviewTier, { stage: Stage; title: string; reviewer: string; icon: string }> = {
  tl:  { stage: 2, title: 'Team Lead Review',  reviewer: '',                   icon: 'bi bi-people' },
  hr:  { stage: 3, title: 'HR Review',         reviewer: 'Ananya Roy (HRBP)',  icon: 'bi bi-shield-check' },
  mgr: { stage: 4, title: 'Manager Sign-off',  reviewer: 'Vikramaditya (MD)',  icon: 'bi bi-award' },
};

export const RATINGS = [5, 4.8, 4.6, 4.5, 4.2, 4, 3.5, 3, 2.5, 2].map((r) => ({
  value: r,
  label: `${r.toFixed(1)} — ${ratingBand(r)}`,
}));

export const DEPARTMENTS = ['Engineering', 'Product Design', 'Human Resources', 'Finance & Accounts'];

export const APPRAISALS: Appraisal[] = [
  {
    key: 'ARUN', id: 'EMP-0104', name: 'Arun Kumar', email: 'arun.k@gharuda.com',
    dept: 'Engineering', role: 'Senior Backend Engineer', teamLead: 'Rajesh V (Tech Lead)',
    self: {
      projects: 'Payment Gateway Modernization, Microservices Migration, Kafka Data Pipeline',
      tools: 'Node.js, Docker, Kubernetes, PostgreSQL, Redis, AWS',
      summary: 'Led the backend microservices refactoring, integrated payment webhooks, and kept 99.98% platform reliability through high-traffic quarters.',
      achievements: '• API gateway migration delivered 2 weeks early.\n• Cut Redis memory footprint by 28% through key compression.\n• Mentored 2 junior engineers through onboarding.',
      rating: 4.5, certs: 'Certified Kubernetes Administrator (CKA), AWS Solutions Architect',
    },
    submitted: true,
    tl: { by: 'Rajesh V (Tech Lead)', rating: 4.6, hike: 15, promotion: 'Tech Lead', remarks: 'Exemplary technical ownership during the Q3–Q4 microservices migration. Thorough code reviews.', date: '2026-09-05' },
    hr: { by: 'Ananya Roy (HRBP)', rating: 4.8, hike: 15, promotion: 'Tech Lead', remarks: 'Verified with project stakeholders. 15% sits within the annual merit budget.', date: '2026-09-12' },
    mgr: null,
  },
  {
    key: 'PRIYA', id: 'EMP-0108', name: 'Priya Sharma', email: 'priya.s@gharuda.com',
    dept: 'Product Design', role: 'Lead UI/UX Designer', teamLead: 'Sneha Sen (Design Lead)',
    self: {
      projects: 'HRMS Design System 2.0, Mobile App Redesign', tools: 'Figma, Design Tokens',
      summary: 'Redesigned the HRMS suite with modern design tokens — 96% positive client feedback.',
      achievements: '• Shipped Design System 2.0 with 150+ interactive components.',
      rating: 4.8, certs: 'NN/g UX Master Certification',
    },
    submitted: true,
    tl: { by: 'Sneha Sen (Design Lead)', rating: 4.7, hike: 15, promotion: 'Principal Product Designer', remarks: 'Exceptional creativity and timely delivery of design tokens.', date: '2026-09-08' },
    hr: null,
    mgr: null,
  },
  {
    key: 'DEEPIKA', id: 'EMP-0102', name: 'Deepika Rao', email: 'deepika.r@gharuda.com',
    dept: 'Human Resources', role: 'Senior Talent Acquisition Lead', teamLead: 'Ananya Roy (HRBP)',
    self: {
      projects: 'Campus Hiring Drive 2025, Lateral Tech Hiring', tools: 'LinkedIn Recruiter, Gharuda ATS',
      summary: 'Closed 65+ critical technical roles across product engineering.',
      achievements: '• Achieved 120% of the annual recruitment target.',
      rating: 4.8, certs: 'SHRM-CP',
    },
    submitted: true,
    tl: { by: 'Ananya Roy (HRBP)', rating: 4.9, hike: 16.5, promotion: 'Talent Partner', remarks: 'Exceeded every recruiting KPI.', date: '2026-08-28' },
    hr: { by: 'Ananya Roy (HRBP)', rating: 4.9, hike: 16.5, promotion: 'Talent Partner', remarks: 'Top recruiter across company branches.', date: '2026-09-02' },
    mgr: { by: 'Vikramaditya (MD)', rating: 5, hike: 16.5, promotion: 'Talent Partner', remarks: 'Outstanding — FY onboarding quotas exceeded by 120%. Exemplary dedication.', date: '2026-09-10' },
  },
  {
    key: 'KARTHIK', id: 'EMP-0115', name: 'Karthik Iyer', email: 'karthik.i@gharuda.com',
    dept: 'Engineering', role: 'Frontend Engineer', teamLead: 'Rajesh V (Tech Lead)',
    self: {
      projects: 'HRMS Angular 20 migration, Shared data-table', tools: 'Angular, PrimeNG, SCSS',
      summary: 'Migrated 40+ screens to standalone components and built the shared table used across the app.',
      achievements: '• Reduced bundle size by 22%.\n• Built the reusable PrimeNG data table.',
      rating: 4.2, certs: '',
    },
    submitted: true,
    tl: null, hr: null, mgr: null,
  },
  {
    key: 'MEERA', id: 'EMP-0121', name: 'Meera Nair', email: 'meera.n@gharuda.com',
    dept: 'Finance & Accounts', role: 'Financial Analyst', teamLead: 'Suresh P (Finance Lead)',
    self: { projects: '', tools: '', summary: '', achievements: '', rating: 4, certs: '' },
    submitted: false,
    tl: null, hr: null, mgr: null,
  },
];

// ------------------------------------------------------------------ rules

export function stageOf(a: Appraisal): Stage {
  if (!a.submitted) return 1;
  if (!a.tl) return 2;
  if (!a.hr) return 3;
  if (!a.mgr) return 4;
  return 5;
}

export function ratingBand(r: number): string {
  if (r >= 4.8) return 'Outstanding';
  if (r >= 4.5) return 'Exceeds expectations';
  if (r >= 4) return 'Strong performer';
  if (r >= 3) return 'Meets expectations';
  return 'Needs improvement';
}

export function reviewerFor(tier: ReviewTier, a: Appraisal): string {
  return tier === 'tl' ? a.teamLead : TIERS[tier].reviewer;
}

/** the latest review so far — used to pre-fill the next reviewer's form */
export function latestReview(a: Appraisal): Review | null {
  return a.hr ?? a.tl ?? null;
}

export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function fmtDate(iso: string): string {
  return iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
}
