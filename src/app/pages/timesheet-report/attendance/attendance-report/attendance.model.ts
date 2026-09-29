/* =============================================================
   Attendance Reports — employees, generated day records and rules.
   Records are generated deterministically (same input → same day),
   so the daily, weekly and department views always agree.
============================================================= */

export type Status = 'present' | 'late' | 'half' | 'absent' | 'leave' | 'weekoff';
export type Shift = 'General' | 'Morning';

export interface Employee {
  empId: string;
  name: string;
  dept: string;
  shift: Shift;
  avatar: string; // '' = initials
  seed: number;
}

export interface DayRecord {
  empId: string;
  date: string; // yyyy-mm-dd
  status: Status;
  checkIn: number | null; // minutes from midnight
  checkOut: number | null;
  hours: number; // worked, 1 decimal
  overtime: number; // hours beyond the 9h shift, 0.5 steps
}

export const SHIFT_HOURS = 9;
export const SHIFT_START: Record<Shift, number> = { General: 9 * 60, Morning: 6 * 60 };

/** labels + icons per status. Colours live in parts/parts.scss (--att-* palette, keyed by data-status). */
export const STATUS_META: Record<Status, { label: string; short: string; icon: string }> = {
  present: { label: 'Present',  short: 'P',  icon: 'bi bi-check-circle-fill' },
  late:    { label: 'Late',     short: 'L',  icon: 'bi bi-alarm' },
  half:    { label: 'Half Day', short: 'H',  icon: 'bi bi-circle-half' },
  absent:  { label: 'Absent',   short: 'A',  icon: 'bi bi-x-circle-fill' },
  leave:   { label: 'On Leave', short: 'LV', icon: 'bi bi-calendar-x' },
  weekoff: { label: 'Week Off', short: '—',  icon: 'bi bi-moon' },
};

export const DEPTS: { name: string; icon: string }[] = [
  { name: 'Design',      icon: 'bi bi-palette' },
  { name: 'iOS Dev',     icon: 'bi bi-phone' },
  { name: 'Engineering', icon: 'bi bi-code-slash' },
  { name: 'Business',    icon: 'bi bi-briefcase' },
  { name: 'Marketing',   icon: 'bi bi-megaphone' },
];

export const EMPLOYEES: Employee[] = [
  { empId: 'EMP0001', name: 'Amelia Curr',     dept: 'Design',      shift: 'General', avatar: 'assets/profile-1.jpg', seed: 3 },
  { empId: 'EMP0002', name: 'Daniel Martinez', dept: 'Design',      shift: 'General', avatar: 'assets/profile-2.jpg', seed: 7 },
  { empId: 'EMP0003', name: 'David Anderson',  dept: 'iOS Dev',     shift: 'General', avatar: 'assets/profile-3.jpg', seed: 11 },
  { empId: 'EMP0004', name: 'Emily Clark',     dept: 'Business',    shift: 'General', avatar: 'assets/profile-4.jpg', seed: 17 },
  { empId: 'EMP0005', name: 'Sophia Johnson',  dept: 'Marketing',   shift: 'General', avatar: '', seed: 23 },
  { empId: 'EMP0006', name: 'Rahul Verma',     dept: 'Engineering', shift: 'Morning', avatar: '', seed: 29 },
  { empId: 'EMP0007', name: 'Kavitha Raman',   dept: 'Design',      shift: 'General', avatar: '', seed: 31 },
  { empId: 'EMP0008', name: 'Siddharth Nair',  dept: 'iOS Dev',     shift: 'General', avatar: '', seed: 37 },
  { empId: 'EMP0009', name: 'Priya Sundaram',  dept: 'Business',    shift: 'General', avatar: '', seed: 41 },
  { empId: 'EMP0010', name: 'Arjun Mehta',     dept: 'Engineering', shift: 'Morning', avatar: '', seed: 43 },
  { empId: 'EMP0011', name: 'Meera Nair',      dept: 'Engineering', shift: 'General', avatar: '', seed: 47 },
  { empId: 'EMP0012', name: 'Karthik Iyer',    dept: 'Marketing',   shift: 'General', avatar: '', seed: 53 },
];

// ------------------------------------------------------------------ generation

/** small deterministic hash → 0..99 */
function roll(seed: number, date: string, salt = 0): number {
  let h = seed * 2654435761 + salt * 97;
  for (const c of date) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return Math.abs(h) % 100;
}

export function recordFor(e: Employee, date: string): DayRecord {
  const dow = new Date(date + 'T00:00:00').getDay();
  if (dow === 0 || dow === 6) return blank(e, date, 'weekoff');

  const r = roll(e.seed, date);
  const status: Status = r < 5 ? 'absent' : r < 11 ? 'leave' : r < 22 ? 'late' : r < 26 ? 'half' : 'present';
  if (status === 'absent' || status === 'leave') return blank(e, date, status);

  const start = SHIFT_START[e.shift];
  const jitter = roll(e.seed, date, 1);
  const checkIn = status === 'late' ? start + 16 + (jitter % 55) : start - 10 + (jitter % 18);
  const checkOut = status === 'half'
    ? start + 4.5 * 60 + (jitter % 20)
    : start + SHIFT_HOURS * 60 - 15 + (roll(e.seed, date, 2) % 150);
  const hours = Math.round(((checkOut - checkIn) / 60) * 10) / 10;
  const overtime = Math.max(0, Math.floor((hours - SHIFT_HOURS) * 2) / 2);
  return { empId: e.empId, date, status, checkIn, checkOut, hours, overtime };
}

function blank(e: Employee, date: string, status: Status): DayRecord {
  return { empId: e.empId, date, status, checkIn: null, checkOut: null, hours: 0, overtime: 0 };
}

// ------------------------------------------------------------------ dates

export function toIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function todayIso(): string {
  return toIso(new Date());
}

export function addDays(iso: string, n: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return toIso(d);
}

/** Monday of the week containing iso */
export function weekStart(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  const back = (d.getDay() + 6) % 7;
  return addDays(iso, -back);
}

export function weekDays(start: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** every day of the month containing iso */
export function monthDays(iso: string): string[] {
  const [y, m] = iso.split('-').map(Number);
  const count = new Date(y, m, 0).getDate();
  return Array.from({ length: count }, (_, i) => `${y}-${String(m).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`);
}

/** same day n months later, clamped to the month's length (31 Jan + 1 → 28/29 Feb) */
export function addMonths(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const target = new Date(y, m - 1 + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d, last));
  return toIso(target);
}

export function fmtDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' }): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', opts);
}

export function fmtTime(mins: number | null): string {
  if (mins === null) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(((h + 11) % 12) + 1).padStart(2, '0')}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

export function initials(name: string): string {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

// ------------------------------------------------------------------ summaries

export interface Tally {
  present: number;
  late: number;
  half: number;
  absent: number;
  leave: number;
  working: number; // records that were working days
  attended: number; // present + late + half
  hours: number;
  overtime: number;
  rate: number; // attended / working, %
}

export function tally(records: DayRecord[]): Tally {
  const t = { present: 0, late: 0, half: 0, absent: 0, leave: 0, working: 0, attended: 0, hours: 0, overtime: 0, rate: 0 };
  for (const r of records) {
    if (r.status === 'weekoff') continue;
    t.working++;
    t[r.status]++;
    t.hours += r.hours;
    t.overtime += r.overtime;
  }
  t.attended = t.present + t.late + t.half;
  t.hours = Math.round(t.hours * 10) / 10;
  t.rate = t.working ? Math.round((t.attended / t.working) * 100) : 0;
  return t;
}
