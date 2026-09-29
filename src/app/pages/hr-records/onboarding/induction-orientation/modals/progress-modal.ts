import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  Attendance,
  STEPS,
  Session,
  SessionRow,
  fmtDate,
  isAssessed,
  moduleMeta,
  stepOf,
} from '../induction.model';
import { InductionStore } from '../induction.store';

import { AppSelect } from '../../../../../shared/app-select/app-select';
/** Steps 5–10: conduct, attendance, materials, assessment, feedback, complete */
@Component({
  selector: 'app-induction-progress-modal',
  standalone: true,
  imports: [AppSelect, ReactiveFormsModule],
  templateUrl: './progress-modal.html',
  styleUrl: './modals.scss',
})
export class ProgressModal {
  private readonly store = inject(InductionStore);
  private readonly fb = inject(FormBuilder);

  readonly steps = STEPS;
  readonly moduleMeta = moduleMeta;
  readonly fmtDate = fmtDate;

  readonly row: SessionRow = this.store.row((this.store.modal() as { ref: string }).ref)!;

  readonly attendanceOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Present', value: 'Present' },
    { label: 'Absent — needs reschedule', value: 'Absent' },
  ];
  // keeps the session's own value (e.g. 'Passed (96%)') selectable even if it isn't a preset
  readonly assessmentOptions = [
    ...new Set([
      'Pending', 'Passed (100%)', 'Passed (95%)', 'Passed (90%)', 'Passed (80%)', 'Digital Sign-off Completed',
      this.row.assessment || 'Pending',
    ]),
  ].map((a) => ({ label: a, value: a }));
  readonly ratingOptions = [
    { label: 'Not rated yet', value: null },
    { label: '★★★★★  5 — Excellent', value: 5 },
    { label: '★★★★☆  4 — Good', value: 4 },
    { label: '★★★☆☆  3 — Average', value: 3 },
    { label: '★★☆☆☆  2 — Poor', value: 2 },
  ];

  readonly form = this.fb.group({
    conducted: this.fb.nonNullable.control(this.row.conducted),
    attendance: this.fb.nonNullable.control<Attendance>(this.row.attendance),
    materials: this.fb.nonNullable.control(this.row.materials),
    assessment: this.fb.nonNullable.control(this.row.assessment || 'Pending'),
    rating: this.fb.control<number | null>(this.row.rating === null ? null : Math.round(this.row.rating)),
    feedback: this.fb.nonNullable.control(this.row.feedback),
    completed: this.fb.nonNullable.control(this.row.status === 'Completed'),
  });

  constructor() {
    // steps 6–10 only make sense once the session has been conducted
    this.syncEnabled();
    this.form.valueChanges.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(() => this.syncEnabled());
  }

  /** the step this session would reach with the current form values */
  get previewStep(): number {
    return stepOf({ ...this.row, ...this.toSession() });
  }

  /** "Mark completed" needs the joiner present and the assessment passed */
  get canComplete(): boolean {
    const v = this.form.getRawValue();
    return v.conducted && v.attendance === 'Present' && isAssessed(v.assessment);
  }

  save(): void {
    const changes = this.toSession();
    this.store.updateSession(this.row.ref, changes);
    this.store.notify(
      changes.status === 'Completed'
        ? `${this.row.title} marked completed for ${this.row.emp}.`
        : `Progress saved — ${this.row.emp} is at step ${stepOf({ ...this.row, ...changes })}.`,
    );
    this.store.close();
  }

  close(): void {
    this.store.close();
  }

  private toSession(): Partial<Session> {
    const v = this.form.getRawValue();
    const completed = v.completed && this.canComplete;
    return {
      conducted: v.conducted,
      attendance: v.conducted ? v.attendance : 'Pending',
      materials: v.materials.trim(),
      assessment: v.assessment,
      rating: v.rating,
      feedback: v.feedback.trim(),
      status: completed ? 'Completed' : v.conducted ? 'Conducted' : 'Scheduled',
    };
  }

  private syncEnabled(): void {
    const on = this.form.controls.conducted.value;
    const opts = { emitEvent: false };
    for (const name of ['attendance', 'materials', 'assessment', 'rating', 'feedback'] as const) {
      const c = this.form.controls[name];
      if (on && c.disabled) c.enable(opts);
      if (!on && c.enabled) c.disable(opts);
    }
    const done = this.form.controls.completed;
    if (this.canComplete && done.disabled) done.enable(opts);
    if (!this.canComplete && done.enabled) {
      done.setValue(false, opts);
      done.disable(opts);
    }
  }
}
