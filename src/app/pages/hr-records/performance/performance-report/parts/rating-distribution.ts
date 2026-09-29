import { Component, computed, input } from '@angular/core';

export interface DistBand {
  key: number;
  label: string;
  tone: string;
  count: number;
  pct: number;
}

/** Stacked bar + per-band rows for a rating distribution (org overview and department drill-down) */
@Component({
  selector: 'app-perf-rating-distribution',
  standalone: true,
  template: `
    <div class="dist-bar" role="img" [attr.aria-label]="ariaLabel()">
      @for (b of bands(); track b.key) {
        @if (b.pct) {
          <span [style.width.%]="b.pct" [style.background]="b.tone" [title]="b.label + ': ' + b.count + ' (' + b.pct + '%)'">
            @if (b.pct >= 12) { {{ b.key }}★ }
          </span>
        }
      }
    </div>

    <ul class="dist-list">
      @for (b of bands(); track b.key) {
      <li>
        <span class="dist-swatch" [style.background]="b.tone"></span>
        <span class="dist-label"><strong>{{ b.key }}★</strong> {{ b.label }}</span>
        <span class="dist-count">{{ b.count }}</span>
        <span class="dist-pct">{{ b.pct }}%</span>
      </li>
      }
    </ul>
    <p class="dist-note">{{ total() }} HR-approved review{{ total() === 1 ? '' : 's' }}</p>
  `,
  styleUrl: './parts.scss',
})
export class RatingDistribution {
  readonly bands = input.required<DistBand[]>();

  readonly total = computed(() => this.bands().reduce((t, b) => t + b.count, 0));
  readonly ariaLabel = computed(() => this.bands().map((b) => `${b.key} star: ${b.pct}%`).join(', '));
}
