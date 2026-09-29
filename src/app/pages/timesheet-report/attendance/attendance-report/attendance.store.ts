import { Injectable, computed, signal } from '@angular/core';
import {
  DEPTS,
  DayRecord,
  EMPLOYEES,
  Employee,
  Shift,
  Status,
  addDays,
  addMonths,
  recordFor,
  tally,
  todayIso,
  monthDays,
  weekDays,
  weekStart,
} from './attendance.model';

export type View = 'daily' | 'weekly' | 'monthly' | 'dept';
export type DailyFilter = Status | 'overtime' | null;
export type Period = 'day' | 'week' | 'month';
export type DeptScope = Period;

export interface DailyRow extends DayRecord {
  sno: number;
  name: string;
  dept: string;
  shift: Shift;
  avatar: string;
}

/** Page state for the attendance reports. Provided by the page component. */
@Injectable()
export class AttendanceStore {
  readonly employees = EMPLOYEES;
  readonly today = todayIso();

  // ---------------------------------------------------------------- view state
  readonly view = signal<View>('daily');
  /** the day shown in the daily view (and the day scope of the department view) */
  readonly date = signal(lastWorkingDay(this.today));
  readonly deptFilter = signal<string | null>(null);
  readonly shiftFilter = signal<Shift | null>(null);
  readonly statusFilter = signal<DailyFilter>(null);
  readonly deptScope = signal<DeptScope>('week');

  /** modals */
  readonly timeline = signal<DailyRow | null>(null);
  readonly calendarEmpId = signal<string | null>(null);

  // ---------------------------------------------------------------- derived: dates
  readonly week = computed(() => weekDays(weekStart(this.date())));
  readonly month = computed(() => monthDays(this.date()));

  /** what one step of the ‹ › arrows moves: follows the view (or the department scope) */
  readonly period = computed<Period>(() => {
    switch (this.view()) {
      case 'daily': return 'day';
      case 'weekly': return 'week';
      case 'monthly': return 'month';
      default: return this.deptScope();
    }
  });

  /** true when the current period already contains today — the › arrow is disabled */
  readonly atLatest = computed(() => {
    switch (this.period()) {
      case 'day': return this.date() >= this.today;
      case 'week': return this.week()[6] >= this.today;
      case 'month': return this.month().at(-1)! >= this.today;
    }
  });

  /** the days of the current period that have happened (for totals) */
  readonly periodDates = computed(() => {
    switch (this.period()) {
      case 'day': return [this.date()];
      case 'week': return this.week().filter((d) => d <= this.today);
      case 'month': return this.month().filter((d) => d <= this.today);
    }
  });

  /** employees after the department + shift filters */
  readonly scoped = computed(() => {
    const dept = this.deptFilter();
    const shift = this.shiftFilter();
    return EMPLOYEES.filter((e) => (!dept || e.dept === dept) && (!shift || e.shift === shift));
  });

  // ---------------------------------------------------------------- daily
  readonly dayRecords = computed<DailyRow[]>(() =>
    this.scoped().map((e, i) => ({ ...recordFor(e, this.date()), sno: i + 1, name: e.name, dept: e.dept, shift: e.shift, avatar: e.avatar })),
  );

  readonly dayTally = computed(() => tally(this.dayRecords()));
  readonly isWeekoff = computed(() => this.dayRecords().every((r) => r.status === 'weekoff'));

  readonly dailyRows = computed(() => {
    const f = this.statusFilter();
    return this.dayRecords()
      .filter((r) => !f || (f === 'overtime' ? r.overtime > 0 : r.status === f))
      .map((r, i) => ({ ...r, sno: i + 1 }));
  });

  // ---------------------------------------------------------------- weekly
  readonly weeklyRows = computed(() =>
    this.scoped().map((e, i) => {
      const days = this.week().map((d) => (d <= this.today ? recordFor(e, d) : null));
      const t = tally(days.filter((d): d is DayRecord => !!d));
      return { sno: i + 1, empId: e.empId, name: e.name, dept: e.dept, shift: e.shift, avatar: e.avatar, days, ...t };
    }),
  );

  readonly weekTally = computed(() =>
    tally(this.scoped().flatMap((e) => this.week().filter((d) => d <= this.today).map((d) => recordFor(e, d)))),
  );

  // ---------------------------------------------------------------- monthly
  readonly monthlyRows = computed(() =>
    this.scoped().map((e, i) => {
      const days = this.month().map((d) => (d <= this.today ? recordFor(e, d) : null));
      const t = tally(days.filter((d): d is DayRecord => !!d));
      return { sno: i + 1, empId: e.empId, name: e.name, dept: e.dept, shift: e.shift, avatar: e.avatar, days, ...t };
    }),
  );

  readonly monthTally = computed(() =>
    tally(this.scoped().flatMap((e) => this.month().filter((d) => d <= this.today).map((d) => recordFor(e, d)))),
  );

  // ---------------------------------------------------------------- department
  readonly deptRows = computed(() => {
    const dates = this.periodDates();
    const shift = this.shiftFilter();
    return DEPTS.map((d) => {
      const people = EMPLOYEES.filter((e) => e.dept === d.name && (!shift || e.shift === shift));
      const records = people.flatMap((e) => dates.map((date) => recordFor(e, date)));
      const t = tally(records);
      return { ...d, headcount: people.length, ...t, avgHours: t.attended ? Math.round((t.hours / t.attended) * 10) / 10 : 0 };
    }).filter((d) => d.headcount > 0);
  });

  readonly deptTotals = computed(() => {
    const rows = this.deptRows();
    const best = [...rows].sort((a, b) => b.rate - a.rate)[0];
    const worst = [...rows].sort((a, b) => a.rate - b.rate)[0];
    return { best, worst };
  });

  // ---------------------------------------------------------------- navigation
  /** move one day / week / month back (-1) or forward (+1), never past today */
  stepPeriod(dir: 1 | -1): void {
    let next: string;
    switch (this.period()) {
      case 'day': next = addDays(this.date(), dir); break;
      case 'week': next = addDays(this.date(), dir * 7); break;
      case 'month': next = addMonths(this.date(), dir); break;
    }
    this.date.set(next > this.today ? this.today : next);
  }

  goToday(): void {
    this.date.set(this.today);
  }

  toggleStatus(s: DailyFilter): void {
    this.statusFilter.set(this.statusFilter() === s ? null : s);
  }

  /** department view → the matching day / week / month report, filtered to that department */
  openDept(dept: string): void {
    this.deptFilter.set(dept);
    const to: Record<Period, View> = { day: 'daily', week: 'weekly', month: 'monthly' };
    this.view.set(to[this.deptScope()]);
  }

  resetFilters(): void {
    this.deptFilter.set(null);
    this.shiftFilter.set(null);
    this.statusFilter.set(null);
  }

  employee(empId: string): Employee | undefined {
    return EMPLOYEES.find((e) => e.empId === empId);
  }
}

/** today, or the Friday before when today falls on a weekend */
function lastWorkingDay(iso: string): string {
  const dow = new Date(iso + 'T00:00:00').getDay();
  return dow === 0 ? addDays(iso, -2) : dow === 6 ? addDays(iso, -1) : iso;
}
