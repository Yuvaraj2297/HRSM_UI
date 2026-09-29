import { Injectable, computed, signal } from '@angular/core';
import {
  Attendance,
  Clearance,
  EMPLOYEES,
  Module,
  SESSIONS,
  Session,
  SessionRow,
  clearanceFor,
  stepOf,
} from './induction.model';

export type Tab = 'sessions' | 'clearance';
export type ClearanceFilter = 'certified' | 'pending' | null;

export type ModalState =
  | { kind: 'schedule'; empId?: string; module?: Module }
  | { kind: 'progress'; ref: string }
  | { kind: 'invite'; ref: string }
  | { kind: 'certificate'; empId: string }
  | null;

/**
 * Page state for Induction & Orientation. Provided by the page component,
 * so the panels and modals share one instance and it is destroyed with the page.
 */
@Injectable()
export class InductionStore {
  readonly employees = EMPLOYEES;

  readonly sessions = signal<Session[]>(SESSIONS);

  // ---------------------------------------------------------------- view state
  readonly tab = signal<Tab>('sessions');
  readonly stepFilter = signal<number | null>(null);
  readonly moduleFilter = signal<Module | null>(null);
  readonly deptFilter = signal<string | null>(null);
  readonly attendanceFilter = signal<Attendance | null>(null);
  readonly clearanceFilter = signal<ClearanceFilter>(null);
  readonly modal = signal<ModalState>(null);

  // ---------------------------------------------------------------- derived
  readonly rows = computed<SessionRow[]>(() =>
    this.sessions().map((s, i) => {
      const e = this.employee(s.empId);
      return {
        ...s,
        sno: i + 1,
        emp: e?.name ?? s.empId,
        dept: e?.dept ?? '',
        role: e?.role ?? '',
        email: e?.email ?? '',
        phone: e?.phone ?? '',
        step: stepOf(s),
      };
    }),
  );

  /** sessions table after the step / module / department / attendance filters */
  readonly filteredRows = computed(() => {
    const step = this.stepFilter();
    const mod = this.moduleFilter();
    const dept = this.deptFilter();
    const att = this.attendanceFilter();
    return this.rows()
      .filter(
        (r) =>
          (step === null || r.step === step) &&
          (!mod || r.module === mod) &&
          (!dept || r.dept === dept) &&
          (!att || r.attendance === att),
      )
      .map((r, i) => ({ ...r, sno: i + 1 }));
  });

  /** how many sessions currently sit at each step — shown on the workflow bar */
  readonly stepCounts = computed(() => {
    const counts: Record<number, number> = {};
    for (const r of this.rows()) counts[r.step] = (counts[r.step] ?? 0) + 1;
    return counts;
  });

  /** one row per joiner who has at least one session */
  readonly clearance = computed<Clearance[]>(() => {
    const sessions = this.sessions();
    return this.employees
      .filter((e) => sessions.some((s) => s.empId === e.empId))
      .map((e, i) => ({ sno: i + 1, ...clearanceFor(e, sessions) }));
  });

  readonly filteredClearance = computed(() => {
    const f = this.clearanceFilter();
    return this.clearance()
      .filter((c) => !f || (f === 'certified') === c.certified)
      .map((c, i) => ({ ...c, sno: i + 1 }));
  });

  readonly departments = computed(() => [...new Set(this.rows().map((r) => r.dept))].sort());

  readonly stats = computed(() => {
    const c = this.clearance();
    return {
      joiners: c.length,
      upcoming: this.sessions().filter((s) => s.status === 'Scheduled').length,
      pending: c.filter((x) => !x.certified).length,
      certified: c.filter((x) => x.certified).length,
    };
  });

  readonly hasSessionFilters = computed(
    () => this.stepFilter() !== null || !!this.moduleFilter() || !!this.deptFilter() || !!this.attendanceFilter(),
  );

  // ---------------------------------------------------------------- lookups
  employee(empId: string) {
    return this.employees.find((e) => e.empId === empId);
  }

  row(ref: string): SessionRow | undefined {
    return this.rows().find((r) => r.ref === ref);
  }

  // ---------------------------------------------------------------- actions
  toggleStep(step: number): void {
    this.tab.set('sessions');
    this.stepFilter.set(this.stepFilter() === step ? null : step);
  }

  resetSessionFilters(): void {
    this.stepFilter.set(null);
    this.moduleFilter.set(null);
    this.deptFilter.set(null);
    this.attendanceFilter.set(null);
  }

  showClearance(f: ClearanceFilter): void {
    this.tab.set('clearance');
    this.clearanceFilter.set(this.clearanceFilter() === f ? null : f);
  }

  addSession(s: Omit<Session, 'ref'>): Session {
    const next = Math.max(100, ...this.sessions().map((x) => Number(x.ref.split('-').at(-1)) || 0)) + 1;
    const session: Session = { ...s, ref: `SES-2026-${next}` };
    this.sessions.update((list) => [session, ...list]);
    return session;
  }

  updateSession(ref: string, changes: Partial<Session>): void {
    this.sessions.update((list) => list.map((s) => (s.ref === ref ? { ...s, ...changes } : s)));
  }

  open(m: ModalState): void {
    this.modal.set(m);
  }

  close(): void {
    this.modal.set(null);
  }

  // ---------------------------------------------------------------- feedback banner
  readonly feedback = signal<{ text: string; type: 'success' | 'warning' } | null>(null);
  private feedbackTimer?: ReturnType<typeof setTimeout>;

  notify(text: string, type: 'success' | 'warning' = 'success'): void {
    clearTimeout(this.feedbackTimer);
    this.feedback.set({ text, type });
    this.feedbackTimer = setTimeout(() => this.feedback.set(null), 4000);
  }
}
