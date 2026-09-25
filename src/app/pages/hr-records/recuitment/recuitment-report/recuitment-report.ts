import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeDataTable, PrimeTableColumn, PrimeTableRowAction } from '../../../../shared/primedatatable/primedatatable';


// =============================================================
// ROW MODEL
// =============================================================

export type RecruitmentStatus = 'Hired' | 'Onboarding' | 'Waiting List' | 'Interviewing' | 'Offered';

export interface ReportRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  job: string;
  dept: string;
  channel: string;
  status: RecruitmentStatus;
  actionDate: string; // display text, e.g. '15-Aug-2026'
  isoDate: string; // 'YYYY-MM-DD' for range filtering
  manager: string;
}

interface DatePresetOption {
  value: string;
  label: string;
}

interface StatusOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-recuitment-report',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeDataTable, AppStatCard],
  templateUrl: './recuitment-report.html',
  styleUrl: './recuitment-report.scss',
})
export class RecuitmentReport {
  // =========================================================
  // FULL DATASET  (11 rows from the PHP <tbody>)
  // =========================================================

  allRows: ReportRow[] = [
    { id: 1, name: 'Rahul Verma', email: 'rahul.v@example.com', phone: '+91 98840 12345', job: 'Senior UI/UX Designer', dept: 'Design', channel: 'LinkedIn', status: 'Hired', actionDate: '15-Aug-2026', isoDate: '2026-08-15', manager: 'David Anderson (Design Lead)' },
    { id: 2, name: 'Ananya Sundaram', email: 'ananya.s@example.com', phone: '+91 97761 44321', job: 'Lead Frontend Engineer', dept: 'Engineering', channel: 'Careers Site', status: 'Hired', actionDate: '22-Aug-2026', isoDate: '2026-08-22', manager: 'Santhosh Kumar (Tech Lead)' },
    { id: 3, name: 'Karthik V', email: 'karthik.v@example.com', phone: '+91 94432 99881', job: 'Backend Tech Lead', dept: 'Engineering', channel: 'Naukri', status: 'Hired', actionDate: '28-Aug-2026', isoDate: '2026-08-28', manager: 'Ramesh (Engineering Director)' },
    { id: 4, name: 'David Martinez', email: 'david.m@example.com', phone: '+91 91122 33445', job: 'IT Security Specialist', dept: 'Engineering', channel: 'LinkedIn', status: 'Onboarding', actionDate: '05-Sep-2026', isoDate: '2026-09-05', manager: 'Daniel Martinez (IT Head)' },
    { id: 5, name: 'Sarah Mitchell', email: 'sarah.m@example.com', phone: '+91 98855 22110', job: 'Senior DevOps Engineer', dept: 'Engineering', channel: 'Indeed', status: 'Onboarding', actionDate: '10-Sep-2026', isoDate: '2026-09-10', manager: 'Alex Turner (Cloud Manager)' },
    { id: 6, name: 'Emily Clarke', email: 'emily.c@example.com', phone: '+91 94411 77665', job: 'Financial Analyst', dept: 'Finance', channel: 'Careers Site', status: 'Onboarding', actionDate: '12-Sep-2026', isoDate: '2026-09-12', manager: 'Suresh Kumar (Finance Lead)' },
    { id: 7, name: 'Priya Ramakrishnan', email: 'priya.ram@example.com', phone: '+91 94451 88990', job: 'iOS App Developer', dept: 'iOS Dev', channel: 'LinkedIn', status: 'Waiting List', actionDate: '29-Aug-2026', isoDate: '2026-08-29', manager: 'Anitha R (Mobile Tech Lead)' },
    { id: 8, name: 'Vikramaditya Rao', email: 'vikram.rao@example.com', phone: '+91 97110 55432', job: 'Cloud Infrastructure Architect', dept: 'Engineering', channel: 'Naukri', status: 'Waiting List', actionDate: '02-Sep-2026', isoDate: '2026-09-02', manager: 'Karthik V (Backend Tech Lead)' },
    { id: 9, name: 'Kavitha Raman', email: 'kavitha.r@example.com', phone: '+91 98844 77112', job: 'HR Operations Partner', dept: 'HR', channel: 'Careers Site', status: 'Waiting List', actionDate: '08-Sep-2026', isoDate: '2026-09-08', manager: 'Meena S (HR Operations Lead)' },
    { id: 10, name: 'Rajesh Kumar', email: 'rajesh.k@example.com', phone: '+91 93322 11009', job: 'Performance Marketing Specialist', dept: 'Marketing', channel: 'LinkedIn', status: 'Offered', actionDate: '14-Sep-2026', isoDate: '2026-09-14', manager: 'Priya S (Marketing Lead)' },
    { id: 11, name: 'Sneha Reddy', email: 'sneha.r@example.com', phone: '+91 97711 00998', job: 'Full Stack Engineer', dept: 'Engineering', channel: 'Indeed', status: 'Interviewing', actionDate: '15-Sep-2026', isoDate: '2026-09-15', manager: 'Santhosh Kumar (Tech Lead)' },
  ];

  // =========================================================
  // FILTER CARD STATE
  // =========================================================

  datePresetOptions: DatePresetOption[] = [
    { value: 'all', label: 'All Dates' },
    { value: 'last_month', label: 'Last Month Hired (Aug 2026)' },
    { value: 'this_month', label: 'This Month (Sep 2026)' },
    { value: 'last_30', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Datepicker Range' },
  ];

  statusOptions: StatusOption[] = [
    { value: 'all', label: 'All Statuses (Hired, Onboarding, Waiting List)' },
    { value: 'Hired', label: '🟢 Hired Employees (Last Month / Hired)' },
    { value: 'Onboarding', label: '🚀 Onboarding Employees' },
    { value: 'Waiting List', label: '⏳ Waiting-List Candidates' },
    { value: 'Interviewing', label: '💬 Interviewing / Shortlisted' },
    { value: 'Offered', label: '📝 Offer Extended' },
  ];

  datePreset = 'last_month';
  fromDate = '2026-08-01';
  toDate = '2026-08-31';
  statusFilter = 'all';

  // values actually applied to the table/KPIs (only change on Apply / preset change)
  appliedFromDate: string | null = '2026-08-01';
  appliedToDate: string | null = '2026-08-31';
  appliedStatus = 'all';
  appliedPresetLabel = 'Last Month Hired (Aug 2026)';
  appliedStatusLabel = 'All Statuses (Hired, Onboarding, Waiting List)';

  constructor() {
    this.applyFilters();
  }

  onPresetChange(): void {
    const today = new Date();

    if (this.datePreset === 'last_month') {
      this.fromDate = '2026-08-01';
      this.toDate = '2026-08-31';
    } else if (this.datePreset === 'this_month') {
      this.fromDate = '2026-09-01';
      this.toDate = '2026-09-30';
    } else if (this.datePreset === 'last_30') {
      const prior30 = new Date(today);
      prior30.setDate(prior30.getDate() - 30);
      this.fromDate = prior30.toISOString().split('T')[0];
      this.toDate = today.toISOString().split('T')[0];
    } else if (this.datePreset === 'all') {
      this.fromDate = '';
      this.toDate = '';
    }

    this.applyFilters();
  }

  applyFilters(): void {
    this.appliedFromDate = this.fromDate || null;
    this.appliedToDate = this.toDate || null;
    this.appliedStatus = this.statusFilter;

    this.appliedPresetLabel =
      this.datePresetOptions.find((o) => o.value === this.datePreset)?.label ?? 'Filtered';
    this.appliedStatusLabel =
      this.statusOptions.find((o) => o.value === this.statusFilter)?.label ?? 'All Statuses';
  }

  resetFilters(): void {
    this.datePreset = 'all';
    this.fromDate = '';
    this.toDate = '';
    this.statusFilter = 'all';
    this.applyFilters();
  }

  // =========================================================
  // FILTERED DATA + KPIs  (drives both the table and the KPI cards)
  // =========================================================

  get filteredData(): ReportRow[] {
    const from = this.appliedFromDate ? new Date(this.appliedFromDate) : null;
    const to = this.appliedToDate ? new Date(`${this.appliedToDate}T23:59:59`) : null;

    return this.allRows.filter((row) => {
      const rowDate = new Date(row.isoDate);

      if (from && rowDate < from) return false;
      if (to && rowDate > to) return false;
      if (this.appliedStatus !== 'all' && row.status !== this.appliedStatus) return false;

      return true;
    });
  }

  get hiredCount(): number {
    return this.filteredData.filter((r) => r.status === 'Hired').length;
  }

  get onboardingCount(): number {
    return this.filteredData.filter((r) => r.status === 'Onboarding').length;
  }

  get waitingCount(): number {
    return this.filteredData.filter((r) => r.status === 'Waiting List').length;
  }

  get totalCount(): number {
    return this.filteredData.length;
  }

  // =========================================================
  // TABLE CONFIG
  // =========================================================

  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', width: '64px' },
    { field: 'name', header: 'Candidate Name', type: 'custom', sortable: true },
    { field: 'position', header: 'Applied Position & Dept', type: 'custom' },
    { field: 'channel', header: 'Sourcing Channel', type: 'custom' },
    { field: 'status', header: 'Recruitment Status', type: 'custom', sortable: true },
    { field: 'actionDate', header: 'Hired / Action Date', sortable: true },
    { field: 'manager', header: 'Reporting Manager / Facilitator' },
    { field: 'actions', header: 'Action', type: 'actions', width: '90px' },
  ];

  rowActions: PrimeTableRowAction[] = [
    {
      key: 'download-resume',
      label: 'Download Resume',
      icon: 'bi bi-file-earmark-zip',
      hiddenWhen: (r: ReportRow) => !(r.status === 'Hired' || (r.status === 'Waiting List' && r.id !== 9)),
    },
    {
      key: 'view-profile',
      label: 'View Profile',
      icon: 'bi bi-eye',
      hiddenWhen: (r: ReportRow) => !(r.status === 'Waiting List' && r.id === 9),
    },
    {
      key: 'view-onboarding',
      label: 'View Onboarding Induction',
      icon: 'bi bi-calendar-check',
      hiddenWhen: (r: ReportRow) => r.status !== 'Onboarding',
    },
    {
      key: 'view-offer',
      label: 'View Offer Management',
      icon: 'bi bi-file-earmark-text',
      hiddenWhen: (r: ReportRow) => r.status !== 'Offered',
    },
    {
      key: 'view-interview',
      label: 'View Interview Schedule',
      icon: 'bi bi-calendar-event',
      hiddenWhen: (r: ReportRow) => r.status !== 'Interviewing',
    },
  ];

  onAction(event: { action: string; row: ReportRow }): void {
    // Route/navigate as needed — placeholders for now:
    console.log(event.action, event.row);
  }

  print(): void {
    window.print();
  }

  // =========================================================
  // CELL TEMPLATE HELPERS
  // =========================================================

  private channelMeta: Record<string, { color: string; icon: string }> = {
    LinkedIn: { color: 'var(--blue-500-2)', icon: 'bi bi-linkedin' },
    'Careers Site': { color: 'var(--green-550)', icon: 'bi bi-building' },
    Naukri: { color: 'var(--blue-600-5)', icon: 'bi bi-briefcase-fill' },
    Indeed: { color: 'var(--blue-550)', icon: 'bi bi-globe' },
  };

  channelColor(channel: string): string {
    return this.channelMeta[channel]?.color ?? 'var(--neutral-500)';
  }

  channelIcon(channel: string): string {
    return this.channelMeta[channel]?.icon ?? 'bi bi-globe';
  }

  private statusMeta: Record<RecruitmentStatus, { slug: string; icon: string; label: string }> = {
    Hired: { slug: 'hired', icon: 'bi bi-circle-fill', label: 'Hired' },
    Onboarding: { slug: 'onboarding', icon: 'bi bi-rocket-takeoff', label: 'Onboarding' },
    'Waiting List': { slug: 'waiting', icon: 'bi bi-clock-history', label: 'Waiting List' },
    Interviewing: { slug: 'interviewing', icon: 'bi bi-chat-dots', label: 'Interviewing' },
    Offered: { slug: 'offered', icon: 'bi bi-file-earmark-check', label: 'Offer Extended' },
  };

  statusClass(status: RecruitmentStatus): string {
    return `status-badge-${this.statusMeta[status]?.slug ?? 'waiting'}`;
  }

  statusIcon(status: RecruitmentStatus): string {
    return this.statusMeta[status]?.icon ?? 'bi bi-circle';
  }

  statusLabel(status: RecruitmentStatus): string {
    return this.statusMeta[status]?.label ?? status;
  }
}
