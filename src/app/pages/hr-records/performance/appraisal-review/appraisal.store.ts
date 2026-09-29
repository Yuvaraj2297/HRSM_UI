import { Injectable, computed, signal } from '@angular/core';
import { APPRAISALS, Appraisal, Review, ReviewTier, SelfReview, Stage, TIERS, stageOf } from './appraisal.model';

export type Portal = 'employee' | 'reviewer';
export type DeskTab = ReviewTier | 'all';

/**
 * Page state for the appraisal lifecycle. Provided by the page component so
 * the portals, review forms and modals share one instance.
 */
@Injectable()
export class AppraisalStore {
  readonly appraisals = signal<Appraisal[]>(APPRAISALS);

  // ---------------------------------------------------------------- view state
  readonly portal = signal<Portal>('employee');

  /** employee portal: whose appraisal is being viewed ("viewing as") */
  readonly employeeKey = signal('ARUN');
  /** employee portal: which stage pane is open */
  readonly employeeStage = signal<Stage>(stageOf(APPRAISALS[0]));

  /** reviewer desk: which tier / ledger tab, and who is selected in each queue */
  readonly deskTab = signal<DeskTab>('tl');
  readonly selected = signal<Record<ReviewTier, string | null>>({ tl: null, hr: null, mgr: null });

  /** scorecard modal */
  readonly scorecardKey = signal<string | null>(null);

  // ---------------------------------------------------------------- derived
  readonly current = computed(() => this.byKey(this.employeeKey())!);

  /** appraisals waiting for each reviewer tier */
  readonly queues = computed(() => {
    const list = this.appraisals();
    const at = (s: Stage) => list.filter((a) => stageOf(a) === s);
    return { tl: at(2), hr: at(3), mgr: at(4) } as Record<ReviewTier, Appraisal[]>;
  });

  readonly pendingActions = computed(() => {
    const q = this.queues();
    return q.tl.length + q.hr.length + q.mgr.length;
  });

  readonly stats = computed(() => {
    const list = this.appraisals();
    const q = this.queues();
    return {
      total: list.length,
      drafts: list.filter((a) => !a.submitted).length,
      tl: q.tl.length,
      hr: q.hr.length,
      mgr: q.mgr.length,
      done: list.filter((a) => stageOf(a) === 5).length,
    };
  });

  byKey(key: string | null): Appraisal | undefined {
    return key ? this.appraisals().find((a) => a.key === key) : undefined;
  }

  /** the selected appraisal in a queue — falls back to the first one waiting */
  selectedIn(tier: ReviewTier): Appraisal | null {
    const queue = this.queues()[tier];
    const key = this.selected()[tier];
    return queue.find((a) => a.key === key) ?? queue[0] ?? null;
  }

  // ---------------------------------------------------------------- navigation
  viewAsEmployee(key: string): void {
    this.employeeKey.set(key);
    this.employeeStage.set(stageOf(this.byKey(key)!));
  }

  select(tier: ReviewTier, key: string): void {
    this.selected.update((s) => ({ ...s, [tier]: key }));
  }

  /** open the right place for an appraisal: its reviewer queue, or its scorecard */
  openInDesk(a: Appraisal): void {
    const stage = stageOf(a);
    if (stage === 5) {
      this.scorecardKey.set(a.key);
      return;
    }
    if (stage === 1) {
      this.portal.set('employee');
      this.viewAsEmployee(a.key);
      return;
    }
    const tier = (Object.keys(TIERS) as ReviewTier[]).find((t) => TIERS[t].stage === stage)!;
    this.portal.set('reviewer');
    this.deskTab.set(tier);
    this.select(tier, a.key);
  }

  // ---------------------------------------------------------------- mutations
  saveSelf(key: string, self: SelfReview, submit: boolean): void {
    this.patch(key, (a) => ({ ...a, self, submitted: a.submitted || submit }));
    const a = this.byKey(key)!;
    this.notify(submit ? `Self-review submitted — sent to ${a.teamLead}.` : 'Draft saved.');
    if (submit) this.employeeStage.set(stageOf(a));
  }

  approve(tier: ReviewTier, key: string, review: Review): void {
    this.patch(key, (a) => ({ ...a, [tier]: review }));
    const a = this.byKey(key)!;
    const next: Record<ReviewTier, string> = {
      tl: 'forwarded to HR',
      hr: 'sent to the Manager for sign-off',
      mgr: 'appraisal complete — scorecard released',
    };
    this.notify(`${a.name}: ${TIERS[tier].title} approved, ${next[tier]}.`);
    // move the queue selection on to the next person waiting
    this.selected.update((s) => ({ ...s, [tier]: null }));
  }

  private patch(key: string, fn: (a: Appraisal) => Appraisal): void {
    this.appraisals.update((list) => list.map((a) => (a.key === key ? fn(a) : a)));
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
