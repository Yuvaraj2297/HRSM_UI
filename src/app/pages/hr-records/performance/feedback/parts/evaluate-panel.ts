import { Component, computed, effect, inject, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  EVALUATORS,
  EVALUATOR_KEYS,
  Evaluator,
  RATINGS,
  STAGES,
  fmtDate,
  initials,
  todayIso,
} from '../feedback.model';
import { FeedbackStore } from '../feedback.store';

import { AppSelect } from '../../../../../shared/app-select/app-select';
/** Give Feedback tab: act as an evaluator, pick from your queue, submit */
@Component({
  selector: 'app-feedback-evaluate-panel',
  standalone: true,
  imports: [AppSelect, ReactiveFormsModule],
  templateUrl: './evaluate-panel.html',
  styleUrl: './parts.scss',
})
export class EvaluatePanel {
  readonly store = inject(FeedbackStore);
  private readonly fb = inject(FormBuilder);

  readonly evaluators = EVALUATORS;
  readonly evaluatorKeys = EVALUATOR_KEYS;
  readonly stages = STAGES;
  readonly ratingOptions = RATINGS;
  readonly fmtDate = fmtDate;
  readonly initials = initials;

  /** the evaluator being acted as, or null when viewing as a plain employee */
  readonly who = computed<Evaluator | null>(() => {
    const a = this.store.actingAs();
    return a === 'employee' ? null : a;
  });

  readonly queue = computed(() => {
    const w = this.who();
    return w ? this.store.queues()[w] : [];
  });

  readonly form = this.fb.nonNullable.group({
    rating: [4, Validators.required],
    strengths: ['', [Validators.required, Validators.minLength(10)]],
    growth: [''],
  });

  constructor() {
    // fresh form whenever a different review is opened
    effect(() => {
      const r = this.store.current();
      untracked(() => this.form.reset({ rating: r?.mgr?.rating ?? 4, strengths: '', growth: '' }));
    });
  }

  /** Manager → "Forward to Team Lead", Team Lead → "Forward to HR Admin", HR → publish */
  submitLabel(w: Evaluator): string {
    const next = EVALUATOR_KEYS[EVALUATOR_KEYS.indexOf(w) + 1];
    return next ? `Submit & Forward to ${EVALUATORS[next].label}` : 'Sign Off & Publish Report';
  }

  invalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && c.touched;
  }

  submit(): void {
    const who = this.who();
    const r = this.store.current();
    if (!who || !r) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.store.submit(who, r.id, {
      by: `${EVALUATORS[who].person} (${EVALUATORS[who].label})`,
      rating: v.rating,
      strengths: v.strengths.trim(),
      growth: v.growth.trim() || '—',
      date: todayIso(),
    });
  }
}
