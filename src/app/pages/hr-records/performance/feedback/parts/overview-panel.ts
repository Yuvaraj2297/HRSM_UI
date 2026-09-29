import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
} from '../../../../../shared/primedatatable/primedatatable';
import { EVALUATORS, EVALUATOR_KEYS, STAGES, fmtDate, initials } from '../feedback.model';
import { FeedbackStore, ReviewRow } from '../feedback.store';

import { AppSelect } from '../../../../../shared/app-select/app-select';
/** Overview tab: every review in every cycle, with status + department filters */
@Component({
  selector: 'app-feedback-overview-panel',
  standalone: true,
  imports: [AppSelect, CommonModule, FormsModule, PrimeDataTable],
  templateUrl: './overview-panel.html',
  styleUrl: './parts.scss',
})
export class OverviewPanel {
  readonly store = inject(FeedbackStore);

  readonly header: PrimeTableHeader = { title: 'Feedback Reviews', icon: 'bi bi-chat-square-quote' };

  readonly columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.NO', width: '65px', sortable: false },
    { field: 'name', header: 'EMPLOYEE', width: '230px', sortable: true, type: 'custom' },
    { field: 'cycle', header: 'CYCLE', width: '190px', sortable: true, type: 'custom' },
    { field: 'mgrScore', header: 'MGR', width: '80px', sortable: true, type: 'custom' },
    { field: 'tlScore', header: 'TL', width: '80px', sortable: true, type: 'custom' },
    { field: 'hrScore', header: 'HR', width: '80px', sortable: true, type: 'custom' },
    { field: 'overall', header: 'OVERALL 360°', width: '130px', sortable: true, type: 'custom' },
    { field: 'stage', header: 'STATUS', width: '180px', sortable: true, type: 'custom' },
    {
      field: 'actions', header: 'ACTION', width: '160px', type: 'pill-actions',
      buttons: [
        { key: 'report', label: 'Report', icon: 'bi bi-file-earmark-text', variant: 'outline', hiddenWhen: (r: ReviewRow) => r.stage !== 4 },
        { key: 'evaluate', label: 'Evaluate', icon: 'bi bi-pencil-square', hiddenWhen: (r: ReviewRow) => r.stage === 4 },
        { key: 'remind', icon: 'bi bi-bell', variant: 'outline', tooltip: 'Remind evaluator', hiddenWhen: (r: ReviewRow) => r.stage === 4 },
      ],
    },
  ];

  readonly deptOptions = computed(() => this.store.departments().map((d) => ({ label: d, value: d })));

  readonly fmtDate = fmtDate;
  readonly initials = initials;

  onAction(e: { action: string; row: ReviewRow }): void {
    if (e.action === 'remind') this.store.remind(e.row);
    else this.store.open(e.row);
  }

  stageLabel(row: ReviewRow): string {
    if (row.stage === 4) return 'Published';
    return `Awaiting ${EVALUATORS[EVALUATOR_KEYS[row.stage - 1]].label}`;
  }

  stageClass(row: ReviewRow): string {
    if (row.stage === 4) return 'status-success';
    if (row.daysLeft < 0) return 'status-rejected';
    return row.stage === 1 ? 'status-muted' : 'status-pending';
  }

  stageTitle(no: number): string {
    return STAGES[no - 1].label;
  }
}
