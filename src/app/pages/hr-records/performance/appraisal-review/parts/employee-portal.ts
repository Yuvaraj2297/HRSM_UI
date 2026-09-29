import { Component, computed, effect, inject, untracked } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RATINGS, STAGES, Stage, TIERS, stageOf } from '../appraisal.model';
import { AppraisalStore } from '../appraisal.store';
import { ReviewCard } from './review-card';
import { Scorecard } from './scorecard';

import { AppSelect } from '../../../../../shared/app-select/app-select';
/** Employee portal: stage tracker + the pane for the selected stage */
@Component({
  selector: 'app-appraisal-employee-portal',
  standalone: true,
  imports: [AppSelect, FormsModule, ReactiveFormsModule, ReviewCard, Scorecard],
  templateUrl: './employee-portal.html',
  styleUrl: './parts.scss',
})
export class EmployeePortal {
  readonly store = inject(AppraisalStore);
  private readonly fb = inject(FormBuilder);

  readonly stages = STAGES;
  readonly tiers = TIERS;
  readonly ratingOptions = RATINGS;

  readonly employeeOptions = computed(() =>
    this.store.appraisals().map((a) => ({ label: a.name, value: a.key, sub: `${a.id} • ${a.role}` })),
  );

  readonly a = this.store.current;
  readonly stage = computed(() => stageOf(this.a()));

  /** the self-review stays editable until the Team Lead has reviewed it */
  readonly editable = computed(() => !this.a().tl);

  readonly form = this.fb.nonNullable.group({
    projects: ['', Validators.required],
    tools: [''],
    summary: ['', [Validators.required, Validators.minLength(20)]],
    achievements: ['', Validators.required],
    rating: [4, Validators.required],
    certs: [''],
  });

  constructor() {
    // reload the form whenever a different employee is picked
    effect(() => {
      const a = this.a();
      untracked(() => {
        this.form.reset(a.self);
        if (this.editable()) this.form.enable();
        else this.form.disable();
      });
    });
  }

  stepState(no: Stage): 'done' | 'current' | '' {
    const at = this.stage();
    if (no < at || at === 5) return 'done';
    return no === at ? 'current' : '';
  }

  stepNote(no: Stage): string {
    const a = this.a();
    switch (no) {
      case 1: return a.submitted ? 'Submitted' : 'Draft';
      case 2: return a.tl ? `Rated ${a.tl.rating.toFixed(1)}` : this.stage() === 2 ? 'In review' : 'Waiting';
      case 3: return a.hr ? `Rated ${a.hr.rating.toFixed(1)}` : this.stage() === 3 ? 'In review' : 'Waiting';
      case 4: return a.mgr ? 'Signed off' : this.stage() === 4 ? 'In review' : 'Waiting';
      case 5: return a.mgr ? 'Released' : 'Locked';
    }
  }

  invalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && c.touched;
  }

  save(submit: boolean): void {
    if (submit && this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.store.saveSelf(this.a().key, { ...v, projects: v.projects.trim(), summary: v.summary.trim() }, submit);
  }
}
