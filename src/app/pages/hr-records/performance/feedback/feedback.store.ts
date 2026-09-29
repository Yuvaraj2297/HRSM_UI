import { Injectable, computed, signal } from '@angular/core';
import {
  ActingAs,
  EMPLOYEES,
  EVALUATORS,
  EVALUATOR_KEYS,
  Evaluation,
  Evaluator,
  REVIEWS,
  Review,
  Stage,
  daysUntil,
  overallOf,
  stageOf,
} from './feedback.model';

export type Tab = 'overview' | 'evaluate' | 'report';
export type StatusFilter = 'published' | 'in_progress' | 'not_started' | null;

/** a review joined with its employee and computed fields — what the tables and cards show */
export interface ReviewRow extends Review {
  sno: number;
  name: string;
  role: string;
  dept: string;
  team: string;
  avatar: string;
  stage: Stage;
  overall: number | null;
  daysLeft: number;
  // flat scores so the table can sort / export them
  mgrScore: number | null;
  tlScore: number | null;
  hrScore: number | null;
}

/**
 * Page state for 360° Feedback. Provided by the page component so every
 * tab reads the same reviews — a submitted evaluation shows up everywhere.
 */
@Injectable()
export class FeedbackStore {
  readonly employees = EMPLOYEES;
  readonly reviews = signal<Review[]>(REVIEWS);

  // ---------------------------------------------------------------- view state
  readonly tab = signal<Tab>('overview');
  readonly statusFilter = signal<StatusFilter>(null);
  readonly deptFilter = signal<string | null>(null);
  readonly actingAs = signal<ActingAs>('mgr');
  readonly selected = signal<Record<Evaluator, number | null>>({ mgr: null, tl: null, hr: null });
  readonly reportId = signal<number | null>(null);

  // ---------------------------------------------------------------- derived
  readonly rows = computed<ReviewRow[]>(() =>
    this.reviews().map((r, i) => {
      const e = EMPLOYEES.find((x) => x.key === r.empKey)!;
      return {
        ...r,
        sno: i + 1,
        name: e.name,
        role: e.role,
        dept: e.dept,
        team: e.team,
        avatar: e.avatar,
        stage: stageOf(r),
        overall: overallOf(r),
        daysLeft: daysUntil(r.due),
        mgrScore: r.mgr?.rating ?? null,
        tlScore: r.tl?.rating ?? null,
        hrScore: r.hr?.rating ?? null,
      };
    }),
  );

  readonly departments = computed(() => [...new Set(this.rows().map((r) => r.dept))].sort());

  readonly filteredRows = computed(() => {
    const st = this.statusFilter();
    const dept = this.deptFilter();
    return this.rows()
      .filter((r) => (!st || statusGroup(r) === st) && (!dept || r.dept === dept))
      .map((r, i) => ({ ...r, sno: i + 1 }));
  });

  /** reviews waiting for each evaluator, soonest due first */
  readonly queues = computed(() => {
    const at = (s: Stage) => this.rows().filter((r) => r.stage === s).sort((a, b) => a.due.localeCompare(b.due));
    return { mgr: at(1), tl: at(2), hr: at(3) } as Record<Evaluator, ReviewRow[]>;
  });

  readonly published = computed(() => this.rows().filter((r) => r.stage === 4));

  readonly stats = computed(() => {
    const rows = this.rows();
    const q = this.queues();
    const scored = this.published().map((r) => r.overall!).filter((x) => x !== null);
    return {
      total: rows.length,
      cycles: new Set(rows.map((r) => r.cycle)).size,
      pending: q.mgr.length + q.tl.length + q.hr.length,
      dueSoon: rows.filter((r) => r.stage < 4 && r.daysLeft >= 0 && r.daysLeft <= 7).length,
      overdue: rows.filter((r) => r.stage < 4 && r.daysLeft < 0).length,
      published: this.published().length,
      avg: scored.length ? Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 10) / 10 : null,
    };
  });

  readonly statusCounts = computed(() => {
    const c = { published: 0, in_progress: 0, not_started: 0 };
    for (const r of this.rows()) c[statusGroup(r)]++;
    return c;
  });

  /** the review open in the evaluate pane for the current evaluator */
  readonly current = computed(() => {
    const who = this.actingAs();
    if (who === 'employee') return null;
    const queue = this.queues()[who];
    return queue.find((r) => r.id === this.selected()[who]) ?? queue[0] ?? null;
  });

  readonly report = computed(() => {
    const list = this.published();
    return list.find((r) => r.id === this.reportId()) ?? list[0] ?? null;
  });

  // ---------------------------------------------------------------- actions
  select(who: Evaluator, id: number): void {
    this.selected.update((s) => ({ ...s, [who]: id }));
  }

  /** jump to wherever a review currently is — its evaluator's queue, or its report */
  open(row: ReviewRow): void {
    if (row.stage === 4) {
      this.reportId.set(row.id);
      this.tab.set('report');
      return;
    }
    const who = EVALUATOR_KEYS[row.stage - 1];
    this.actingAs.set(who);
    this.select(who, row.id);
    this.tab.set('evaluate');
  }

  submit(who: Evaluator, id: number, evaluation: Evaluation): void {
    this.reviews.update((list) => list.map((r) => (r.id === id ? { ...r, [who]: evaluation } : r)));
    this.selected.update((s) => ({ ...s, [who]: null }));
    const row = this.rows().find((r) => r.id === id)!;
    const next = row.stage === 4 ? 'report published' : `forwarded to ${EVALUATORS[EVALUATOR_KEYS[row.stage - 1]].label}`;
    this.notify(`${row.name}: ${EVALUATORS[who].label} feedback submitted — ${next}.`);
  }

  remind(row: ReviewRow): void {
    const who = EVALUATORS[EVALUATOR_KEYS[row.stage - 1]];
    this.notify(`Reminder sent to ${who.person} (${who.label}) for ${row.name}.`);
  }

  /** starts a new cycle for everyone in scope who has no open review */
  launchCycle(cycle: string, dept: string | null, due: string): number {
    const open = new Set(this.reviews().filter((r) => stageOf(r) < 4).map((r) => r.empKey));
    const targets = EMPLOYEES.filter((e) => (!dept || e.dept === dept) && !open.has(e.key));
    let id = Math.max(0, ...this.reviews().map((r) => r.id));
    this.reviews.update((list) => [
      ...list,
      ...targets.map((e) => ({ id: ++id, empKey: e.key, cycle, due, mgr: null, tl: null, hr: null, survey: null })),
    ]);
    return targets.length;
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

export function statusGroup(r: { stage: Stage }): 'published' | 'in_progress' | 'not_started' {
  return r.stage === 4 ? 'published' : r.stage === 1 ? 'not_started' : 'in_progress';
}
