import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bandOf, initials } from '../performance.model';
import { PerformanceStore } from '../performance.store';

import { AppSelect } from '../../../../../shared/app-select/app-select';
/** One employee's results across every year — independent of the page filters */
@Component({
  selector: 'app-perf-employee-history',
  standalone: true,
  imports: [AppSelect, FormsModule],
  template: `
    @let h = store.history();
    <section class="card-custom perf-panel">
      <header class="history-head">
        <div>
          <h2 class="panel-title"><i class="bi bi-clock-history"></i> Employee Performance History</h2>
          <p class="panel-sub">Year-on-year KPI achievement and approved ratings (not affected by the filters above)</p>
        </div>
        <div class="history-picker">
          <app-select [ngModel]="store.historyKey()" (ngModelChange)="store.historyKey.set($event)" ariaLabel="Employee" [options]="store.historyOptions" optionLabel="label" optionValue="value" optionSub="sub" />
        </div>
      </header>

      <div class="history-grid">
        <!-- summary -->
        <aside class="history-summary">
          <div class="d-flex align-items-center gap-3 mb-3">
            @if (h.emp.avatar) {
              <img [src]="h.emp.avatar" [alt]="h.emp.name" class="rounded-circle perf-avatar-lg" />
            } @else {
              <div class="emp-initials-avatar perf-avatar-lg">{{ initials(h.emp.name) }}</div>
            }
            <div>
              <div class="emp-name-line">{{ h.emp.name }}</div>
              <div class="emp-code-line">{{ h.emp.role }}</div>
              <span class="category-pill-badge mt-1">{{ h.emp.dept }}</span>
            </div>
          </div>

          @if (h.ratingFrom !== null && h.ratingTo !== null) {
          <dl class="history-trend">
            <div>
              <dt>Rating</dt>
              <dd>{{ h.ratingFrom.toFixed(1) }} <i class="bi bi-arrow-right"></i> <strong>{{ h.ratingTo.toFixed(1) }}</strong></dd>
            </div>
            <div>
              <dt>KPI</dt>
              <dd>{{ h.kpiFrom }}% <i class="bi bi-arrow-right"></i> <strong>{{ h.kpiTo }}%</strong></dd>
            </div>
          </dl>
          <p class="history-verdict" [class.is-down]="h.ratingTo < h.ratingFrom">
            <i class="bi" [class.bi-graph-up-arrow]="h.ratingTo >= h.ratingFrom" [class.bi-graph-down-arrow]="h.ratingTo < h.ratingFrom"></i>
            {{ verdict(h.ratingFrom, h.ratingTo, h.years) }}
          </p>
          }
        </aside>

        <!-- per-year -->
        <div class="data-table-wrap">
          <table class="data-table data-table-sm">
            <thead>
              <tr>
                <th>Cycle</th>
                <th class="text-end">KPI</th>
                <th class="text-end">Self</th>
                <th class="text-end">Manager</th>
                <th class="text-end">Final</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (r of h.rows; track r.year + r.cycle) {
              <tr>
                <td>
                  <div class="cell-strong">{{ r.fy }}</div>
                  <div class="emp-code-line">{{ r.cycleLabel }}</div>
                </td>
                <td class="text-end">
                  {{ r.kpi }}%
                  @if (r.kpiDelta !== null && r.kpiDelta !== 0) {
                    <small [class.text-success]="r.kpiDelta > 0" [class.text-danger]="r.kpiDelta < 0">
                      {{ r.kpiDelta > 0 ? '+' : '' }}{{ r.kpiDelta }}
                    </small>
                  }
                </td>
                <td class="text-end">{{ r.self.toFixed(1) }}</td>
                <td class="text-end">{{ r.mgr === null ? '—' : r.mgr.toFixed(1) }}</td>
                <td class="text-end">
                  @if (r.final !== null) {
                    <span class="rating-chip" [style.--tone]="tone(r.final)">{{ r.final.toFixed(1) }}</span>
                  } @else { — }
                </td>
                <td>
                  <span class="status-pill" [class.status-success]="r.final !== null" [class.status-pending]="r.final === null">
                    {{ r.status }}
                  </span>
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
  styleUrl: './parts.scss',
})
export class EmployeeHistory {
  readonly store = inject(PerformanceStore);
  readonly initials = initials;

  tone(rating: number): string {
    return bandOf(rating).tone;
  }

  verdict(from: number, to: number, years: number): string {
    const d = Math.round((to - from) * 10) / 10;
    if (years < 2) return 'Only one approved cycle so far.';
    if (d > 0) return `Up ${d.toFixed(1)} over ${years} approved cycles.`;
    if (d < 0) return `Down ${Math.abs(d).toFixed(1)} over ${years} approved cycles — worth a development plan.`;
    return `Steady across ${years} approved cycles.`;
  }
}
