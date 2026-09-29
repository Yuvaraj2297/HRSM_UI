import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import { fyLabel } from './performance.model';
import { PerformanceStore } from './performance.store';
import { DeptReport } from './parts/dept-report';
import { EmployeeHistory } from './parts/employee-history';
import { OrgOverview } from './parts/org-overview';

import { AppSelect } from '../../../../shared/app-select/app-select';
/**
 * Performance Reports — page shell.
 *   filters · KPIs · organisation overview (or a department drill-down) · employee history
 * Every number comes from PerformanceStore, so the filters drive the whole page.
 */
@Component({
  selector: 'app-performance-report',
  standalone: true,
  imports: [AppSelect, FormsModule, AppStatCard, OrgOverview, DeptReport, EmployeeHistory],
  providers: [PerformanceStore],
  templateUrl: './performance-report.html',
  styleUrl: './performance-report.scss',
})
export class PerformanceReport {
  readonly store = inject(PerformanceStore);
  readonly fyLabel = fyLabel;

  exportCsv(): void {
    const drill = this.store.drill();
    this.store.exportCsv(
      drill ? drill.rows : this.store.filtered(),
      drill ? `${drill.dept.replace(/\W+/g, '_')}_performance` : 'performance_report',
    );
  }
}
