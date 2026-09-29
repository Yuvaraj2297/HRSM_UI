import { Component, inject } from '@angular/core';
import { ModalField, ModalSaveEvent, ReuseModal } from '../../../../shared/reuse-model/reuse-model';
import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import { AppraisalStore } from './appraisal.store';
import { ScorecardModal } from './modals/scorecard-modal';
import { EmployeePortal } from './parts/employee-portal';
import { ReviewerDesk } from './parts/reviewer-desk';

/**
 * Performance Appraisal — page shell.
 *   KPIs · Employee / Reviewer portals · scorecard + launch-cycle modals
 * State lives in AppraisalStore (provided here, shared by every child).
 */
@Component({
  selector: 'app-appraisal-review',
  standalone: true,
  imports: [AppStatCard, EmployeePortal, ReviewerDesk, ScorecardModal, ReuseModal],
  providers: [AppraisalStore],
  templateUrl: './appraisal-review.html',
  styleUrl: './appraisal-review.scss',
})
export class AppraisalReview {
  readonly store = inject(AppraisalStore);

  openDesk(tab: 'tl' | 'hr' | 'mgr' | 'all'): void {
    this.store.portal.set('reviewer');
    this.store.deskTab.set(tab);
  }

  // ---------------------------------------------------------------- launch cycle (app-reuse-modal)
  readonly cycleFields: ModalField[] = [
    {
      key: 'frequency', label: 'Frequency', type: 'select', required: true, col: 6, defaultValue: 'quarterly',
      options: [
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Half-yearly', value: 'half_yearly' },
        { label: 'Annual', value: 'annual' },
      ],
    },
    {
      key: 'reviewPeriod', label: 'Review Period', type: 'select', required: true, col: 6, defaultValue: 'q3',
      options: [
        { label: 'Q1 (Apr–Jun 2026)', value: 'q1' },
        { label: 'Q2 (Jul–Sep 2026)', value: 'q2' },
        { label: 'Q3 (Oct–Dec 2026)', value: 'q3' },
        { label: 'Q4 (Jan–Mar 2027)', value: 'q4' },
      ],
    },
    { key: 'cycleTitle', label: 'Cycle Title', type: 'text', required: true, col: 12, defaultValue: 'Q3 2026-27 Performance Appraisal' },
    {
      key: 'deptScope', label: 'Departments', type: 'select', required: true, col: 6, labelIcon: 'bi bi-building',
      defaultValue: 'all',
      options: [
        { label: 'All departments', value: 'all' },
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Product Design', value: 'Product Design' },
        { label: 'Human Resources', value: 'Human Resources' },
        { label: 'Finance & Accounts', value: 'Finance & Accounts' },
      ],
    },
    {
      key: 'employeeScope', label: 'Employees', type: 'select', required: true, col: 6, labelIcon: 'bi bi-person-vcard',
      defaultValue: 'all',
      options: [
        { label: 'Everyone in scope', value: 'all' },
        ...this.store.appraisals().map((a) => ({ label: `${a.name} (${a.role})`, value: a.key })),
      ],
    },
    { key: 'selfReviewDue', label: 'Self-Review Due', type: 'date', col: 4, defaultValue: new Date(2026, 9, 31) },
    { key: 'tlHrDeadline', label: 'TL & HR Review Due', type: 'date', col: 4, defaultValue: new Date(2026, 10, 15) },
    { key: 'finalSignoffDeadline', label: 'Manager Sign-off Due', type: 'date', col: 4, defaultValue: new Date(2026, 10, 30) },
    {
      key: 'launchNote', type: 'info',
      label: 'Launching starts the 5-stage workflow for everyone in scope: Self-Review → Team Lead → HR → Manager → Scorecard.',
    },
  ];

  onCycleLaunched(e: ModalSaveEvent): void {
    this.store.notify(`"${e.values['cycleTitle'] || 'New appraisal cycle'}" launched for everyone in scope.`);
  }
}
