import { Component, inject } from '@angular/core';
import { ModalField, ModalSaveEvent, ReuseModal } from '../../../../shared/reuse-model/reuse-model';
import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import { EMPLOYEES, todayIso } from './feedback.model';
import { FeedbackStore } from './feedback.store';
import { EvaluatePanel } from './parts/evaluate-panel';
import { OverviewPanel } from './parts/overview-panel';
import { ReportPanel } from './parts/report-panel';

/**
 * 360° Feedback — page shell.
 *   KPIs · Overview / Evaluate / Report tabs · new-cycle modal
 * State lives in FeedbackStore (provided here, shared by every tab).
 */
@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [AppStatCard, ReuseModal, OverviewPanel, EvaluatePanel, ReportPanel],
  providers: [FeedbackStore],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
})
export class Feedback {
  readonly store = inject(FeedbackStore);

  readonly cycleFields: ModalField[] = [
    { key: 'cycle', label: 'Cycle Name', type: 'text', required: true, col: 12, defaultValue: 'Q3 2026 360° Check-in' },
    {
      key: 'dept', label: 'Departments', type: 'select', required: true, col: 6, labelIcon: 'bi bi-building',
      defaultValue: 'all',
      options: [
        { label: 'All departments', value: 'all' },
        ...[...new Set(EMPLOYEES.map((e) => e.dept))].map((d) => ({ label: d, value: d })),
      ],
    },
    { key: 'due', label: 'Due Date', type: 'date', required: true, col: 6, defaultValue: new Date(Date.now() + 21 * 86_400_000) },
    {
      key: 'note', type: 'info',
      label: 'Everyone in scope without an open review gets one. It starts with their Manager, then Team Lead, then HR sign-off.',
    },
  ];

  onCycleLaunched(e: ModalSaveEvent): void {
    const v = e.values;
    const dept = v['dept'] === 'all' ? null : (v['dept'] as string);
    const due = v['due'] instanceof Date ? toIso(v['due']) : todayIso();
    const added = this.store.launchCycle(String(v['cycle'] || '360° Cycle'), dept, due);
    this.store.notify(
      added ? `"${v['cycle']}" launched — ${added} review${added > 1 ? 's' : ''} sent to managers.`
            : 'Everyone in scope already has an open review — nothing to add.',
      added ? 'success' : 'warning',
    );
    this.store.tab.set('overview');
  }
}

function toIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
