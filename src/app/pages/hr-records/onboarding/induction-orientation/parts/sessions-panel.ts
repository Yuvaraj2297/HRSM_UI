import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
} from '../../../../../shared/primedatatable/primedatatable';
import { MODULES, STEPS, SessionRow, fmtDate, moduleMeta } from '../induction.model';
import { InductionStore } from '../induction.store';

import { AppSelect } from '../../../../../shared/app-select/app-select';
/** Sessions tab: filter bar + the sessions table */
@Component({
  selector: 'app-induction-sessions-panel',
  standalone: true,
  imports: [AppSelect, CommonModule, FormsModule, PrimeDataTable],
  templateUrl: './sessions-panel.html',
  styleUrl: './panels.scss',
})
export class SessionsPanel {
  readonly store = inject(InductionStore);

  readonly tableHeader: PrimeTableHeader = { title: 'Induction Sessions', icon: 'bi bi-easel' };

  readonly columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.NO', width: '65px', sortable: false },
    { field: 'emp', header: 'JOINER', width: '210px', sortable: true, type: 'custom' },
    { field: 'title', header: 'SESSION', width: '280px', sortable: true, type: 'custom' },
    { field: 'date', header: 'SCHEDULE', width: '210px', sortable: true, type: 'custom' },
    { field: 'step', header: 'PROGRESS', width: '200px', sortable: true, type: 'custom' },
    { field: 'attendance', header: 'ATTENDANCE', width: '130px', sortable: true, type: 'custom' },
    { field: 'status', header: 'STATUS', width: '130px', sortable: true, type: 'custom' },
    {
      field: 'actions', header: 'ACTION', width: '130px', type: 'pill-actions',
      buttons: [
        { key: 'progress', icon: 'bi bi-pencil-square', variant: 'outline', tooltip: 'Update progress (steps 5–10)' },
        { key: 'invite', icon: 'bi bi-send', variant: 'outline', tooltip: 'Send invitation' },
      ],
    },
  ];

  readonly moduleOptions = MODULES.map((m) => ({ label: m.short, value: m.value }));
  readonly attendanceOptions = ['Pending', 'Present', 'Absent'].map((a) => ({ label: a, value: a }));

  readonly deptOptions = computed(() => this.store.departments().map((d) => ({ label: d, value: d })));

  onAction(e: { action: string; row: SessionRow }): void {
    if (e.action === 'progress') this.store.open({ kind: 'progress', ref: e.row.ref });
    if (e.action === 'invite') this.store.open({ kind: 'invite', ref: e.row.ref });
  }

  stepLabel(no: number): string {
    return STEPS[no - 1]?.label ?? '';
  }

  readonly moduleMeta = moduleMeta;
  readonly fmtDate = fmtDate;

  attendanceClass(a: string): string {
    return a === 'Present' ? 'status-success' : a === 'Absent' ? 'status-rejected' : 'status-muted';
  }

  statusClass(s: string): string {
    return s === 'Completed' ? 'status-success' : s === 'Conducted' ? 'status-warning' : 'status-pending';
  }
}
