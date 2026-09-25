import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// NOTE: adjust these relative paths to your project's shared component locations.
import { ModalField, ModalSaveEvent, ReuseModal } from '../../../../shared/reuse-model/reuse-model';
import { PrimeDataTable, PrimeTableColumn, PrimeTableRowAction } from '../../../../shared/primedatatable/primedatatable';

type HubTab = 'cycles' | 'give' | 'report';
type WorkflowStatus = 'completed' | 'hr_review' | 'tl_review' | 'pending';
type ReviewStatusFilter = 'all' | 'completed' | 'in_progress' | 'pending';

export interface FeedbackCycleRow {
  id: number;
  employeeName: string;
  employeeRole: string;
  avatar: string | null; // image filename (no ext) or null -> show initials
  initials: string;
  initialsBg: string;
  initialsColor: string;
  dept: string;
  cycle: string;
  mgrScore: number | null;
  tlScore: number | null;
  hrScore: number | null;
  overall: number | null;
  chipClass: string;
  status: WorkflowStatus;
  statusFilterGroup: 'completed' | 'in_progress' | 'pending';
  statusLabel: string;
  statusClass: string;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, ReuseModal, PrimeDataTable],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
})
export class Feedback {
  @ViewChild('giveModal') giveModal!: ReuseModal;

  // =========================================================
  // HUB TABS
  // =========================================================
  activeTab: HubTab = 'cycles';

  setTab(tab: HubTab): void {
    this.activeTab = tab;
  }

  // =========================================================
  // TAB 1 — FEEDBACK CYCLES
  // =========================================================
  cycleRows: FeedbackCycleRow[] = [
    { id: 1, employeeName: 'Arun Kumar', employeeRole: 'Senior Software Engineer', avatar: 'profile-1', initials: 'AK', initialsBg: 'var(--bg-muted)', initialsColor: 'var(--neutral-650)', dept: 'Engineering', cycle: 'FY25-26 Annual 360° Review', mgrScore: 4.5, tlScore: 4.2, hrScore: 4.0, overall: 4.1, chipClass: 'score-chip-good', status: 'completed', statusFilterGroup: 'completed', statusLabel: 'Completed', statusClass: 'status-capsule-completed' },
    { id: 2, employeeName: 'Amelia Curr', employeeRole: 'Design Lead', avatar: null, initials: 'AC', initialsBg: 'var(--purple-50)', initialsColor: 'var(--purple-600)', dept: 'UI/UX Design', cycle: 'Q1 Leadership Check-in', mgrScore: 4.9, tlScore: 4.8, hrScore: 4.7, overall: 4.8, chipClass: 'score-chip-high', status: 'completed', statusFilterGroup: 'completed', statusLabel: 'Completed', statusClass: 'status-capsule-completed' },
    { id: 3, employeeName: 'Sanjay V', employeeRole: 'Associate Software Engineer', avatar: null, initials: 'SV', initialsBg: 'var(--bg-muted)', initialsColor: 'var(--neutral-650)', dept: 'Engineering', cycle: 'Probation 360 Review', mgrScore: 4.6, tlScore: 4.4, hrScore: 4.5, overall: 4.5, chipClass: 'score-chip-high', status: 'completed', statusFilterGroup: 'completed', statusLabel: 'Completed', statusClass: 'status-capsule-completed' },
    { id: 4, employeeName: 'Daniel Martinez', employeeRole: 'DevOps & Cloud Lead', avatar: 'profile-2', initials: 'DM', initialsBg: 'var(--bg-muted)', initialsColor: 'var(--neutral-650)', dept: 'Infrastructure', cycle: 'Leadership Check-in', mgrScore: 4.8, tlScore: 4.7, hrScore: 4.5, overall: 4.65, chipClass: 'score-chip-active', status: 'hr_review', statusFilterGroup: 'in_progress', statusLabel: 'Stage 3: HR Review', statusClass: 'status-capsule-hr' },
    { id: 5, employeeName: 'Priya Sharma', employeeRole: 'Frontend Developer', avatar: 'profile-3', initials: 'PS', initialsBg: 'var(--bg-muted)', initialsColor: 'var(--neutral-650)', dept: 'UI/UX Design', cycle: 'FY25-26 Annual Review', mgrScore: 4.2, tlScore: 4.0, hrScore: null, overall: 4.1, chipClass: 'score-chip-warning', status: 'tl_review', statusFilterGroup: 'in_progress', statusLabel: 'Stage 2: TL Review', statusClass: 'status-capsule-tl' },
    { id: 6, employeeName: 'Manoj Kumar', employeeRole: 'Junior Software Engineer', avatar: null, initials: 'MK', initialsBg: 'var(--bg-muted)', initialsColor: 'var(--neutral-900)', dept: 'Engineering', cycle: 'FY25-26 Annual Review', mgrScore: null, tlScore: null, hrScore: null, overall: null, chipClass: 'score-chip-pending', status: 'pending', statusFilterGroup: 'pending', statusLabel: 'Stage 1: Pending (Manager)', statusClass: 'status-capsule-pending' },
  ];

  reviewStatusFilter: ReviewStatusFilter = 'all';
  deptFilter = 'all';
  departments = ['Engineering', 'UI/UX Design', 'Infrastructure'];

  setReviewStatusFilter(f: ReviewStatusFilter): void {
    this.reviewStatusFilter = f;
  }

  get statusCounts(): Record<ReviewStatusFilter, number> {
    const counts: Record<ReviewStatusFilter, number> = { all: this.cycleRows.length, completed: 0, in_progress: 0, pending: 0 };
    for (const r of this.cycleRows) counts[r.statusFilterGroup]++;
    return counts;
  }

  get filteredCycleRows(): FeedbackCycleRow[] {
    return this.cycleRows.filter((r) => {
      const statusOk = this.reviewStatusFilter === 'all' || r.statusFilterGroup === this.reviewStatusFilter;
      const deptOk = this.deptFilter === 'all' || r.dept === this.deptFilter;
      return statusOk && deptOk;
    });
  }

  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', width: '56px' },
    { field: 'employee', header: 'Employee', type: 'custom', width: '190px', meta: { filterFields: ['employeeName', 'employeeRole'] } },
    { field: 'dept', header: 'Department / Role', type: 'custom', width: '140px', meta: { filterFields: ['dept'] } },
    { field: 'cycle', header: 'Feedback Cycle', width: '190px' },
    { field: 'mgrScore', header: 'Mgr Score', type: 'custom', width: '90px' },
    { field: 'tlScore', header: 'TL Score', type: 'custom', width: '90px' },
    { field: 'hrScore', header: 'HR Score', type: 'custom', width: '90px' },
    { field: 'overall', header: 'Overall 360°', type: 'custom', width: '120px' },
    { field: 'status', header: 'Workflow Status', type: 'custom', width: '190px' },
    { field: 'actions', header: 'Action', type: 'actions', width: '110px' },
  ];

  rowActions: PrimeTableRowAction[] = [
    { key: 'report', label: 'View Report', icon: 'bi bi-file-earmark-text', color: 'var(--green-400)', hiddenWhen: (row: FeedbackCycleRow) => row.status === 'pending' },
    { key: 'remind', label: 'Send Reminder', icon: 'bi bi-bell', color: 'var(--neutral-500)', hiddenWhen: (row: FeedbackCycleRow) => row.status !== 'pending' },
  ];

  onTableAction(event: { action: string; row: FeedbackCycleRow }): void {
    if (event.action === 'report') {
      alert(`${event.row.employeeName} — ${event.row.cycle}\nOverall 360°: ${event.row.overall ?? '--'} / 5.0`);
    } else if (event.action === 'remind') {
      alert('Sent reminder to Manager!');
    }
  }

  // =========================================================
  // TAB 2 — GIVE FEEDBACK  (simplified: the source PHP tab is a large
  // inline reviewer form; this reuses the shared modal instead)
  // =========================================================
  employeeOptions = [
    { label: 'Arun Kumar (Senior Software Engineer)', value: 'arun' },
    { label: 'Amelia Curr (Design Lead)', value: 'amelia' },
    { label: 'Daniel Martinez (DevOps & Cloud Lead)', value: 'daniel' },
    { label: 'Priya Sharma (Frontend Developer)', value: 'priya' },
  ];

  giveFields: ModalField[] = [
    { key: 'colleagueId', label: 'Colleague to Review', type: 'select', required: true, col: 6, options: this.employeeOptions },
    {
      key: 'rating', label: 'Overall Competency Rating', type: 'select', required: true, col: 6, defaultValue: '4',
      options: [
        { label: '★★★★★ 5.0 - Role Model / Exceptional', value: '5' },
        { label: '★★★★☆ 4.0 - Exceeds Expectations', value: '4' },
        { label: '★★★☆☆ 3.0 - Meets Expectations', value: '3' },
      ],
    },
    { key: 'strengths', label: 'What does this person do exceptionally well?', type: 'textarea', required: true, col: 12, rows: 2, placeholder: 'Highlight core strengths, project contributions, and positive collaboration...' },
    { key: 'growth', label: 'Suggestions for Growth & Development', type: 'textarea', col: 12, rows: 2, placeholder: 'Areas where this colleague can expand their impact...' },
  ];

  openGiveModal(): void {
    this.giveModal.open('add');
  }

  onGiveSaved(event: ModalSaveEvent): void {
    alert('Feedback submitted successfully!');
  }

  starString(rating: number): string {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }
}
