import { Component, input } from '@angular/core';
import { Review, fmtDate, ratingBand } from '../appraisal.model';

/** One reviewer's result (TL / HR / Manager) — or a "waiting" placeholder */
@Component({
  selector: 'app-appraisal-review-card',
  standalone: true,
  template: `
    @if (review(); as r) {
      <section class="card-custom mb-3">
        <header class="card-custom-header">
          <div>
            <h3 class="card-custom-title review-card-title"><i [class]="icon()"></i> {{ title() }}</h3>
            <small class="text-muted">{{ r.by }} · {{ fmtDate(r.date) }}</small>
          </div>
          <span class="status-pill status-success gap-1"><i class="bi bi-check-circle-fill"></i> Approved</span>
        </header>
        <div class="card-custom-body">
          <dl class="review-card-figures">
            <div><dt>Rating</dt><dd>{{ r.rating.toFixed(1) }} <small>/ 5 · {{ band(r.rating) }}</small></dd></div>
            <div><dt>Hike</dt><dd>{{ r.hike }}%</dd></div>
            <div><dt>Promotion</dt><dd>{{ r.promotion || 'None' }}</dd></div>
          </dl>
          @if (r.remarks) {
            <blockquote class="review-card-remarks">“{{ r.remarks }}”</blockquote>
          }
        </div>
      </section>
    } @else {
      <div class="review-pending">
        <i [class]="icon()"></i>
        <div>
          <div class="fw-bold">{{ title() }} — {{ active() ? 'in review' : 'not started' }}</div>
          <small class="text-muted">{{ pendingText() }}</small>
        </div>
      </div>
    }
  `,
  styleUrl: './parts.scss',
})
export class ReviewCard {
  readonly review = input<Review | null>(null);
  readonly title = input.required<string>();
  readonly icon = input('bi bi-person-check');
  /** true when this is the stage the appraisal is currently waiting at */
  readonly active = input(false);
  readonly pendingText = input('');

  readonly fmtDate = fmtDate;
  readonly band = ratingBand;
}
