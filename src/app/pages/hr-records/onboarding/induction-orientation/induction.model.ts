/* =============================================================
   Induction & Orientation — types, reference data and pure rules.
   No Angular here: the store and the components import from this.
============================================================= */

export type Module =
  | 'General Company Induction'
  | 'Department & Role Orientation'
  | 'IT & Data Security Setup'
  | 'HR Policies & Code of Conduct';

export type Mode = 'In-person' | 'Online' | 'Hybrid';
export type Attendance = 'Pending' | 'Present' | 'Absent';
export type SessionStatus = 'Scheduled' | 'Conducted' | 'Completed';

export interface Employee {
  empId: string;
  name: string;
  dept: string;
  role: string;
  email: string;
  phone: string;
}

export interface Session {
  ref: string;
  empId: string;
  module: Module;
  title: string;
  trainer: string;
  mode: Mode;
  venue: string;
  date: string; // yyyy-mm-dd
  time: string;
  notified: boolean;
  conducted: boolean;
  attendance: Attendance;
  materials: string; // comma separated file names
  assessment: string; // e.g. 'Passed (96%)', 'Pending'
  rating: number | null; // 1–5
  feedback: string;
  status: SessionStatus;
}

/** a session joined with its employee and its computed workflow step */
export interface SessionRow extends Session {
  sno: number;
  emp: string;
  dept: string;
  role: string;
  email: string;
  phone: string;
  step: number; // 1–10, the last step reached
}

/** one joiner's standing against the mandatory modules (the step-11 decision) */
export interface Clearance {
  sno: number;
  empId: string;
  emp: string;
  dept: string;
  role: string;
  done: Module[];
  missing: Module[];
  certified: boolean;
  certDate: string; // yyyy-mm-dd, '' when not certified
  score: number | null; // average assessment %
}

// ------------------------------------------------------------------ reference data

export const MODULES: { value: Module; short: string; label: string; icon: string }[] = [
  { value: 'General Company Induction',     short: 'General',       label: 'Vision, culture, founders & org chart', icon: 'bi bi-building' },
  { value: 'Department & Role Orientation', short: 'Department',    label: 'Role KPIs, tools & tech stack',         icon: 'bi bi-diagram-3' },
  { value: 'IT & Data Security Setup',      short: 'IT & Security', label: 'VPN, MFA & InfoSec policies',           icon: 'bi bi-shield-lock' },
  { value: 'HR Policies & Code of Conduct', short: 'HR Policies',   label: 'POSH, leave & ethics code',             icon: 'bi bi-journal-check' },
];

/** steps 1–10 of the lifecycle; step 11 is the clearance decision */
export const STEPS: { no: number; label: string; icon: string }[] = [
  { no: 1,  label: 'Employee Selected',   icon: 'bi bi-person-check' },
  { no: 2,  label: 'Program Assigned',    icon: 'bi bi-journal-check' },
  { no: 3,  label: 'Session Scheduled',   icon: 'bi bi-calendar-event' },
  { no: 4,  label: 'Employee Notified',   icon: 'bi bi-bell' },
  { no: 5,  label: 'Session Conducted',   icon: 'bi bi-easel' },
  { no: 6,  label: 'Attendance Captured', icon: 'bi bi-clipboard-check' },
  { no: 7,  label: 'Materials Shared',    icon: 'bi bi-file-earmark-text' },
  { no: 8,  label: 'Assessment Done',     icon: 'bi bi-patch-question' },
  { no: 9,  label: 'Feedback Received',   icon: 'bi bi-star' },
  { no: 10, label: 'Session Completed',   icon: 'bi bi-check-circle' },
];

export const EMPLOYEES: Employee[] = [
  { empId: 'EMP-2026-041', name: 'Kavitha Raman',   dept: 'Design',      role: 'UI/UX Designer',            email: 'kavitha.raman@gharudahr.com', phone: '+91 98401 23456' },
  { empId: 'EMP-2026-042', name: 'Rajesh Kannan',   dept: 'Engineering', role: 'Senior Fullstack Engineer', email: 'rajesh.k@gharudahr.com',      phone: '+91 98842 67890' },
  { empId: 'EMP-2026-043', name: 'Ananya Sen',      dept: 'Finance',     role: 'Financial Analyst',         email: 'ananya.sen@gharudahr.com',    phone: '+91 97908 11223' },
  { empId: 'EMP-2026-044', name: 'Mohammed Farhan', dept: 'Marketing',   role: 'Digital Marketing Lead',    email: 'm.farhan@gharudahr.com',      phone: '+91 99403 55678' },
  { empId: 'EMP-2026-045', name: 'Deepak Verma',    dept: 'HR',          role: 'HR Recruiter',              email: 'deepak.v@gharudahr.com',      phone: '+91 98410 99887' },
];

export const SESSIONS: Session[] = [
  { ref: 'SES-2026-101', empId: 'EMP-2026-041', module: 'Department & Role Orientation', title: 'Design System & UX Framework Walkthrough',     trainer: 'Amelia Curr (Design Lead)',       mode: 'In-person', venue: 'Design Studio 2',                       date: '2026-10-02', time: '11:30 AM - 12:30 PM', notified: true,  conducted: false, attendance: 'Pending', materials: 'Design_System_v2.pdf, Figma_Handbook.pdf',            assessment: 'Pending',          rating: null, feedback: '', status: 'Scheduled' },
  { ref: 'SES-2026-102', empId: 'EMP-2026-041', module: 'General Company Induction',     title: 'Vision, Culture, Founders & Org Chart',        trainer: 'Priya Sharma (HR Manager)',       mode: 'In-person', venue: 'Auditorium - Level 3',                  date: '2026-09-12', time: '10:00 AM - 12:00 PM', notified: true,  conducted: true,  attendance: 'Present', materials: 'Employee_Handbook_2026.pdf, Culture_Code.pdf',        assessment: 'Passed (96%)',     rating: 5,    feedback: 'Great interactive session, very clear company vision!', status: 'Completed' },
  { ref: 'SES-2026-103', empId: 'EMP-2026-042', module: 'IT & Data Security Setup',      title: 'Data Privacy, VPN, MFA & Security Protocol',   trainer: 'Karthik V (InfoSec Lead)',        mode: 'Online',    venue: 'Google Meet (meet.google.com/xyz-sec)', date: '2026-09-14', time: '02:30 PM - 04:00 PM', notified: true,  conducted: true,  attendance: 'Present', materials: 'InfoSec_Policy_v4.pdf, VPN_Setup_Guide.pdf',          assessment: 'Passed (100%)',    rating: 4.8,  feedback: 'Setup completed smoothly. Hardware keys enrolled.', status: 'Completed' },
  { ref: 'SES-2026-104', empId: 'EMP-2026-043', module: 'HR Policies & Code of Conduct', title: 'Leave Policy, POSH, Code of Ethics & Appraisal', trainer: 'Priya Sharma (HR Manager)',      mode: 'In-person', venue: 'Conference Room A',                     date: '2026-09-16', time: '03:00 PM - 04:30 PM', notified: true,  conducted: true,  attendance: 'Present', materials: 'HR_Policy_Manual.pdf, POSH_Policy.pdf',               assessment: 'Pending',          rating: null, feedback: '', status: 'Conducted' },
  { ref: 'SES-2026-105', empId: 'EMP-2026-044', module: 'Department & Role Orientation', title: 'Campaigns, SEO Stack & Agency Handoff',        trainer: 'Sneha Roy (VP Marketing)',        mode: 'Hybrid',    venue: 'Room 4 & Zoom',                         date: '2026-09-15', time: '11:00 AM - 12:30 PM', notified: true,  conducted: true,  attendance: 'Absent',  materials: 'Marketing_Playbook.pdf',                              assessment: 'Pending',          rating: null, feedback: 'Employee was unwell; session to be rescheduled.', status: 'Scheduled' },
  { ref: 'SES-2026-106', empId: 'EMP-2026-042', module: 'General Company Induction',     title: 'Vision, Culture, Founders & Org Chart',        trainer: 'Priya Sharma (HR Manager)',       mode: 'In-person', venue: 'Auditorium - Level 3',                  date: '2026-09-12', time: '10:00 AM - 12:00 PM', notified: true,  conducted: true,  attendance: 'Present', materials: 'Employee_Handbook_2026.pdf',                          assessment: 'Passed (98%)',     rating: 5,    feedback: 'Inspiring introductory session.', status: 'Completed' },
  { ref: 'SES-2026-107', empId: 'EMP-2026-042', module: 'Department & Role Orientation', title: 'Code Architecture, CI/CD Pipeline & GitHub',   trainer: 'Sundar V (Tech Director)',        mode: 'In-person', venue: 'Tech Lab 1',                            date: '2026-09-13', time: '03:00 PM - 05:00 PM', notified: true,  conducted: true,  attendance: 'Present', materials: 'Architecture_Blueprint.pdf, GitFlow_Cheatsheet.pdf',  assessment: 'Passed (95%)',     rating: 5,    feedback: 'Clear onboarding repo and dev container instructions.', status: 'Completed' },
  { ref: 'SES-2026-108', empId: 'EMP-2026-042', module: 'HR Policies & Code of Conduct', title: 'Leave Policy, POSH, Code of Ethics & Appraisal', trainer: 'Priya Sharma (HR Manager)',      mode: 'In-person', venue: 'Conference Room A',                     date: '2026-09-14', time: '11:00 AM - 12:30 PM', notified: true,  conducted: true,  attendance: 'Present', materials: 'HR_Policy_Manual.pdf, POSH_Policy.pdf',               assessment: 'Passed (94%)',     rating: 4.8,  feedback: 'All statutory policies understood and acknowledged.', status: 'Completed' },
  { ref: 'SES-2026-109', empId: 'EMP-2026-043', module: 'General Company Induction',     title: 'Vision, Culture, Founders & Org Chart',        trainer: 'Priya Sharma (HR Manager)',       mode: 'In-person', venue: 'Auditorium - Level 3',                  date: '2026-09-12', time: '10:00 AM - 12:00 PM', notified: true,  conducted: true,  attendance: 'Present', materials: 'Employee_Handbook_2026.pdf',                          assessment: 'Passed (90%)',     rating: 4,    feedback: '', status: 'Completed' },
  { ref: 'SES-2026-110', empId: 'EMP-2026-045', module: 'General Company Induction',     title: 'Vision, Culture, Founders & Org Chart',        trainer: 'Priya Sharma (HR Manager)',       mode: 'In-person', venue: 'Auditorium - Level 3',                  date: '2026-10-05', time: '10:00 AM - 12:00 PM', notified: false, conducted: false, attendance: 'Pending', materials: '',                                                    assessment: 'Pending',          rating: null, feedback: '', status: 'Scheduled' },
];

// ------------------------------------------------------------------ rules

/** the furthest workflow step (1–10) a session has reached */
export function stepOf(s: Session): number {
  if (s.status === 'Completed') return 10;
  if (!s.notified) return 3;
  if (!s.conducted) return 4;
  if (s.attendance !== 'Present') return 5;
  if (!s.materials.trim()) return 6;
  if (!isAssessed(s.assessment)) return 7;
  if (s.rating === null) return 8;
  return 9;
}

export function isAssessed(assessment: string): boolean {
  return /passed|sign-off completed/i.test(assessment);
}

/** 'Passed (96%)' → 96 */
export function scoreOf(assessment: string): number | null {
  const m = /(\d+(?:\.\d+)?)\s*%/.exec(assessment);
  return m ? Number(m[1]) : null;
}

/** a module counts as done when a session for it is completed with the joiner present */
export function clearanceFor(emp: Employee, sessions: Session[]): Omit<Clearance, 'sno'> {
  const mine = sessions.filter((s) => s.empId === emp.empId);
  const passed = mine.filter((s) => s.status === 'Completed' && s.attendance === 'Present');
  const done = MODULES.map((m) => m.value).filter((m) => passed.some((s) => s.module === m));
  const missing = MODULES.map((m) => m.value).filter((m) => !done.includes(m));
  const certified = missing.length === 0;
  const scores = passed.map((s) => scoreOf(s.assessment)).filter((x): x is number => x !== null);

  return {
    empId: emp.empId,
    emp: emp.name,
    dept: emp.dept,
    role: emp.role,
    done,
    missing,
    certified,
    certDate: certified ? passed.map((s) => s.date).sort().at(-1) ?? '' : '',
    score: scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : null,
  };
}

export function moduleMeta(m: Module) {
  return MODULES.find((x) => x.value === m)!;
}

// ------------------------------------------------------------------ dates

export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function fmtDate(iso: string): string {
  return iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
}

export function isoToDmy(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function dmyToIso(dmy: string): string {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dmy.trim());
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
}
