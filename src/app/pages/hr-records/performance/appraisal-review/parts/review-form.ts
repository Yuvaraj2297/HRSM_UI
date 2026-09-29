import { Component, computed, effect, inject, input, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Appraisal, RATINGS, ReviewTier, TIERS, latestReview, reviewerFor, todayIso } from '../appraisal.model';
import { AppraisalStore } from '../appraisal.store';

import { AppSelect } from '../../../../../shared/app-select/app-select';
/** The scoring form one reviewer fills in (Team Lead, HR or Manager) */
@Component({
  selector: 'app-appraisal-review-form',
  standalone: true,
  imports: [AppSelect, ReactiveFormsModule],
  templateUrl: './review-form.html',
  styleUrl: './parts.scss',
})
export class ReviewForm {
  private readonly store = inject(AppraisalStore);
  private readonly fb = inject(FormBuilder);

  readonly tier = input.required<ReviewTier>();
  readonly appraisal = input.required<Appraisal>();

  readonly ratingOptions = RATINGS;
  readonly meta = computed(() => TIERS[this.tier()]);
  readonly reviewer = computed(() => reviewerFor(this.tier(), this.appraisal()));

  readonly replyPresets = [
    { label: 'Outstanding', text: 'Outstanding contribution this cycle — thank you for raising the bar.' },
    { label: 'Approved as recommended', text: 'Excellent work. Increment and promotion approved as recommended.' },
    { label: 'Solid year', text: 'Solid year. Keep building on the feedback from your Team Lead and HR.' },
  ];

  readonly form = this.fb.nonNullable.group({
    rating: [4.5, Validators.required],
    hike: [10, [Validators.required, Validators.min(0), Validators.max(50)]],
    promotion: [''],
    remarks: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    // pre-fill from the previous reviewer whenever the selected appraisal changes
    effect(() => {
      const a = this.appraisal();
      untracked(() => {
        const prev = latestReview(a);
        this.form.reset({
          rating: prev?.rating ?? a.self.rating,
          hike: prev?.hike ?? 10,
          promotion: prev?.promotion ?? '',
          remarks: '',
        });
      });
    });
  }

  invalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && c.touched;
  }

  approve(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.store.approve(this.tier(), this.appraisal().key, {
      by: this.reviewer(),
      rating: v.rating,
      hike: Number(v.hike),
      promotion: v.promotion.trim(),
      remarks: v.remarks.trim(),
      date: todayIso(),
    });
  }
}
