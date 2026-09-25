export type StageCode = 'preboarding' | 'induction' | 'training' | 'completed';

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  officialEmail: string;
  phone: string;
  status: string; // display label, e.g. "Day 1 Induction" — matches STATUS_COLORS keys
  statusCode: StageCode;
  dept: string;
  deptShort: string; // display label — matches DEPT_COLORS keys
  source: string;
  pan: string;
  aadhaar: string;
  uan: string;
}

export interface KpiCard {
  label: string;
  value: string;
  sub: string;
  icon: string;
  bg: string;
  color: string;
}

export interface StageTab {
  key: 'all' | StageCode;
  label: string;
}

/** colorMap for the PrimeDataTable "status" column type (keyed by the exact label shown) */
export const STATUS_COLORS: Record<string, string> = {
  'Pre-Boarding': 'var(--orange-500)',
  'Day 1 Induction': 'var(--blue-600-2)',
  'In Training': 'var(--purple-600)',
  Onboarded: 'var(--primary-dark)',
};

/** colorMap for the PrimeDataTable "badge" column type (Department) */
export const DEPT_COLORS: Record<string, string> = {
  Design: 'var(--purple-550)',
  'Backend Eng': 'var(--blue-550)',
  'Mobile Dev': 'var(--teal-450)',
  Finance: 'var(--orange-400-2)',
  Marketing: 'var(--pink-500-2)',
  'HR & Ops': 'var(--green-450)',
};

export const DEPARTMENT_OPTIONS = [
  'UI/UX Design Department',
  'Backend Engineering',
  'Mobile Engineering',
  'Finance Department',
  'Marketing & Growth',
  'HR & Operations',
];

export const CANDIDATES: Candidate[] = [
  {
    id: 1,
    firstName: 'Kavitha',
    lastName: 'Raman',
    email: 'kavitha.r@example.com',
    officialEmail: 'kavitha.r@gharudahr.com',
    phone: '+91 98401 23456',
    status: 'Day 1 Induction',
    statusCode: 'induction',
    dept: 'UI/UX Design Department',
    deptShort: 'Design',
    source: 'LinkedIn Easy Apply',
    pan: 'ABCDE1234F',
    aadhaar: '9876-5432-1098',
    uan: '100987654321',
  },
  {
    id: 2,
    firstName: 'Rahul',
    lastName: 'Verma',
    email: 'rahul.v@example.com',
    officialEmail: 'rahul.v@gharudahr.com',
    phone: '+91 98765 43210',
    status: 'Pre-Boarding',
    statusCode: 'preboarding',
    dept: 'Backend Engineering',
    deptShort: 'Backend Eng',
    source: 'LinkedIn Job Share',
    pan: 'FGHIJ5678K',
    aadhaar: '8765-4321-0987',
    uan: '100876543210',
  },
  {
    id: 3,
    firstName: 'Siddharth',
    lastName: 'Nair',
    email: 'sid.nair@example.com',
    officialEmail: 'siddharth.n@gharudahr.com',
    phone: '+91 94441 89012',
    status: 'In Training',
    statusCode: 'training',
    dept: 'Mobile Engineering',
    deptShort: 'Mobile Dev',
    source: 'Company Careers Page',
    pan: 'KLMNO9012P',
    aadhaar: '7654-3210-9876',
    uan: '100765432109',
  },
  {
    id: 4,
    firstName: 'Ananya',
    lastName: 'Sundaram',
    email: 'ananya.s@example.com',
    officialEmail: 'ananya.s@gharudahr.com',
    phone: '+91 98402 11223',
    status: 'Pre-Boarding',
    statusCode: 'preboarding',
    dept: 'UI/UX Design Department',
    deptShort: 'Design',
    source: 'Employee Referral',
    pan: 'PQRST3456U',
    aadhaar: '6543-2109-8765',
    uan: '100654321098',
  },
  {
    id: 5,
    firstName: 'Priya',
    lastName: 'Sundaram',
    email: 'priya.s@example.com',
    officialEmail: 'priya.s@gharudahr.com',
    phone: '+91 91234 56780',
    status: 'Onboarded',
    statusCode: 'completed',
    dept: 'Finance Department',
    deptShort: 'Finance',
    source: 'Naukri.com',
    pan: 'UVWXY7890Z',
    aadhaar: '5432-1098-7654',
    uan: '100543210987',
  },
];