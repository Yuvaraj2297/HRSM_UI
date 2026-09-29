import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
} from '../../../../../shared/primedatatable/primedatatable';
import { DEPTS, bandOf, initials } from '../performance.model';
import { PerformanceStore } from '../performance.store';
import { RatingDistribution } from './rating-distribution';

/** Department drill-down: switch department, see its distribution and every employee result */
@Component({
  selector: 'app-perf-dept-report',
  standalone: true,
  imports: [CommonModule, PrimeDataTable, RatingDistribution],
  template: `
    @if (store.drill(); as d) {
    <nav class="page-tabs page-tabs-sm mb-3" role="tablist" aria-label="Department">
      @for (x of depts; track x.name) {
      <button type="button" role="tab" class="page-tab" [class.active]="d.dept === x.name"
        [attr.aria-selected]="d.dept === x.name" (click)="store.drillDept.set(x.name)">
        <i [class]="x.icon"></i> {{ x.name }}
      </button>
      }
    </nav>

    <div class="perf-grid perf-grid-drill mb-3">
      <section class="card-custom perf-panel">
        <h2 class="panel-title"><i class="bi bi-bar-chart"></i> Rating Distribution</h2>
        <p class="panel-sub">{{ d.dept }} · final approved ratings</p>
        <app-perf-rating-distribution [bands]="d.distribution" />
      </section>

      <div>
        <app-primedatatable [modalHeader]="header" [columns]="columns" [data]="d.rows"
          searchPlaceholder="Search employee..." [showColumnsButton]="false"
          [exportFileName]="d.dept + '_performance'">
          <ng-template #cellTemplate let-row let-col="col">
            @switch (col.field) {
              @case ('name') {
                <div class="d-flex align-items-center gap-2">
                  @if (row.avatar) {
                    <img [src]="row.avatar" [alt]="row.name" class="rounded-circle perf-avatar" />
                  } @else {
                    <div class="emp-initials-avatar perf-initials">{{ initials(row.name) }}</div>
                  }
                  <div>
                    <div class="emp-name-line">{{ row.name }}</div>
                    <div class="emp-code-line">{{ row.role }}</div>
                  </div>
                </div>
              }
              @case ('cycleLabel') {
                <div>{{ row.cycleLabel }}</div>
                <div class="emp-code-line">{{ row.fy }}</div>
              }
              @case ('kpi') { {{ row.kpi }}% }
              @case ('final') {
                @if (row.final !== null) {
                  <span class="rating-chip" [style.--tone]="tone(row.final)">{{ row.final.toFixed(1) }}</span>
                } @else { <span class="text-muted">—</span> }
              }
              @case ('status') {
                <span class="status-pill" [ngClass]="row.final === null ? 'status-pending' : 'status-success'">{{ row.status }}</span>
              }
            }
          </ng-template>
        </app-primedatatable>
      </div>
    </div>
    }
  `,
  styleUrl: './parts.scss',
})
export class DeptReport {
  readonly store = inject(PerformanceStore);
  readonly depts = DEPTS;
  readonly initials = initials;

  readonly header: PrimeTableHeader = { title: 'Employee Results', icon: 'bi bi-people' };

  readonly columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.NO', width: '65px', sortable: false },
    { field: 'name', header: 'EMPLOYEE', width: '230px', sortable: true, type: 'custom' },
    { field: 'cycleLabel', header: 'CYCLE', width: '180px', sortable: true, type: 'custom' },
    { field: 'manager', header: 'MANAGER', width: '150px', sortable: true },
    { field: 'kpi', header: 'KPI', width: '80px', sortable: true, type: 'custom' },
    { field: 'self', header: 'SELF', width: '70px', sortable: true },
    { field: 'mgr', header: 'MGR', width: '70px', sortable: true },
    { field: 'final', header: 'FINAL', width: '90px', sortable: true, type: 'custom' },
    { field: 'status', header: 'STATUS', width: '130px', sortable: true, type: 'custom' },
  ];

  tone(rating: number): string {
    return bandOf(rating).tone;
  }
}
