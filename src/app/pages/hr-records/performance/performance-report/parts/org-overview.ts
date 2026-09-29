import { Component, inject } from '@angular/core';
import { bandOf } from '../performance.model';
import { PerformanceStore } from '../performance.store';
import { RatingDistribution } from './rating-distribution';

/** Organisation overview: rating distribution + department breakdown */
@Component({
  selector: 'app-perf-org-overview',
  standalone: true,
  imports: [RatingDistribution],
  template: `
    <div class="perf-grid mb-3">
      <section class="card-custom perf-panel">
        <h2 class="panel-title"><i class="bi bi-bar-chart"></i> Rating Distribution</h2>
        <p class="panel-sub">Final HR-approved ratings, 1–5 scale</p>
        <app-perf-rating-distribution [bands]="store.distribution()" />
      </section>

      <section class="card-custom perf-panel">
        <h2 class="panel-title"><i class="bi bi-building"></i> Departments</h2>
        <p class="panel-sub">Click a department for its employee breakdown</p>

        <div class="data-table-wrap">
          <table class="data-table data-table-sm">
            <thead>
              <tr>
                <th>Department</th>
                <th class="text-end">People</th>
                <th class="text-end">Avg Rating</th>
                <th class="text-end">Avg KPI</th>
                <th>Completion</th>
                <th><span class="visually-hidden">Open</span></th>
              </tr>
            </thead>
            <tbody>
              @for (d of store.departments(); track d.name) {
              <tr class="perf-row-link" (click)="store.drillDept.set(d.name)">
                <td>
                  <div class="cell-strong"><i [class]="d.icon + ' text-primary me-1'"></i>{{ d.name }}</div>
                  <div class="emp-code-line">{{ d.desc }}</div>
                </td>
                <td class="text-end">{{ d.employees }}</td>
                <td class="text-end">
                  @if (d.rating !== null) {
                    <span class="rating-chip" [style.--tone]="tone(d.rating)">{{ d.rating.toFixed(1) }}</span>
                  } @else { — }
                </td>
                <td class="text-end">{{ d.kpi }}%</td>
                <td>
                  <div class="completion">
                    <span class="completion-bar"><span [style.width.%]="d.completionPct"></span></span>
                    <span>{{ d.completionPct }}%</span>
                  </div>
                </td>
                <td class="text-end">
                  <button type="button" class="btn-icon btn-sm" [attr.aria-label]="'Open ' + d.name"
                    (click)="$event.stopPropagation(); store.drillDept.set(d.name)">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
  styleUrl: './parts.scss',
})
export class OrgOverview {
  readonly store = inject(PerformanceStore);

  tone(rating: number): string {
    return bandOf(rating).tone;
  }
}
