import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PrimeDataTable, PrimeTableColumn, PrimeTableRowAction } from '../../../../shared/primedatatable/primedatatable';
import { ReuseModal, ModalField, ModalSaveEvent } from '../../../../shared/reuse-model/reuse-model';

// NOTE: adjust these relative paths to wherever PrimeDataTable / ReuseModal
// actually live in your project.

export type JobPriority = 'Normal' | 'High' | 'Urgent';
export type JobStatus = 'Active' | 'Draft' | 'On Hold' | 'Closed';
export type JobPortal = 'LinkedIn' | 'Naukri' | 'Indeed' | 'Careers';

export interface JobOpeningRow {
  id: number;
  code: string;
  title: string;
  exp: string;
  posted: string;
  dept: string;
  location: string;
  type: string;
  openings: number;
  applicants: number;
  budget: string;
  priority: JobPriority;
  status: JobStatus;
  postedPortals: JobPortal[];
  description: string;
}

@Component({
  selector: 'app-job-opening',
  standalone: true,
  imports: [CommonModule, RouterLink, PrimeDataTable, ReuseModal],
  templateUrl: './job-opening.html',
  styleUrl: './job-opening.scss',
})
export class JobOpening {
  departments = ['Design', 'Engineering', 'Finance', 'Marketing', 'iOS Dev', 'HR', 'Sales', 'Operations'];
  employmentTypes = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];
  priorities: JobPriority[] = ['Normal', 'High', 'Urgent'];
  statuses: JobStatus[] = ['Active', 'Draft', 'On Hold', 'Closed'];

  // =========================================================
  // ADD / EDIT MODAL FIELDS — drives the single reusable
  // <app-reuse-modal>. Same field set is used for both create
  // and edit (status defaults to 'Active' on create).
  // =========================================================
  jobFields: ModalField[] = [
    { key: 'title', label: 'Job Title', type: 'text', required: true, placeholder: 'e.g. Senior Full Stack Engineer', col: 8 },
    { key: 'dept', label: 'Department', type: 'select', required: true, col: 4,
      options: this.departments.map((d) => ({ label: d, value: d })) },
    { key: 'location', label: 'Work Location', type: 'text', required: true, placeholder: 'e.g. Bangalore (Hybrid)', col: 4 },
    { key: 'type', label: 'Employment Type', type: 'select', col: 4, defaultValue: 'Full-Time',
      options: this.employmentTypes.map((t) => ({ label: t, value: t })) },
    { key: 'openings', label: 'No. of Openings', type: 'number', required: true, min: 1, defaultValue: 1, col: 4 },
    { key: 'exp', label: 'Experience Required', type: 'text', placeholder: 'e.g. 3-5 Years', col: 4 },
    { key: 'budget', label: 'Budget Range (CTC)', type: 'text', placeholder: 'e.g. ₹15L - ₹20L', col: 4 },
    { key: 'priority', label: 'Priority', type: 'select', col: 4, defaultValue: 'Normal',
      options: this.priorities.map((p) => ({ label: p, value: p })) },
    { key: 'status', label: 'Status', type: 'select', col: 4, defaultValue: 'Active',
      options: this.statuses.map((s) => ({ label: s, value: s })) },
    { key: 'description', label: 'Job Description & Key Responsibilities', type: 'textarea', rows: 3,
      placeholder: 'Provide overview of duties, qualifications and required tech stack...', col: 12 },
  ];

  @ViewChild('jobModal') jobModal!: ReuseModal;


  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', width: '64px' },
    { field: 'code', header: 'Job Code', sortable: true, width: '110px' },
    { field: 'title', header: 'Position Title', sortable: true, width: '240px' },
    { field: 'dept', header: 'Department', sortable: true, width: '130px' },
    { field: 'location', header: 'Location & Type', width: '170px' },
    { field: 'openings', header: 'Openings', sortable: true, width: '90px', cellClass: 'text-center' },
    { field: 'applicants', header: 'Applicants', sortable: true, width: '130px' },
    { field: 'budget', header: 'Budget (CTC)', width: '130px' },
    { field: 'priority', header: 'Priority', sortable: true, width: '100px' },
    { field: 'postedPortals', header: 'Posted Portals', width: '220px' },
    { field: 'status', header: 'Status', sortable: true, width: '110px' },
    { field: 'actions', header: 'Action', type: 'actions', width: '110px' },
  ];

  rowActions: PrimeTableRowAction[] = [
    { key: 'pipeline', label: 'View Pipeline', icon: 'ti ti-layout-kanban' },
    { key: 'social', label: 'Social & Web Reach', icon: 'ti ti-broadcast' },
    { key: 'edit', label: 'Edit Job', icon: 'ti ti-pencil' },
  ];

  jobs: JobOpeningRow[] = [
    {
      id: 1, code: 'JOB-101', title: 'Senior UI/UX Designer', exp: '4-6 Years', posted: '20-Feb-2026',
      dept: 'Design', location: 'Bangalore (Hybrid)', type: 'Full-Time', openings: 2, applicants: 34,
      budget: '₹14L - ₹18L', priority: 'Urgent', status: 'Active',
      postedPortals: ['LinkedIn', 'Naukri', 'Indeed'],
      description: 'Responsible for crafting intuitive user experiences, design systems, wireframing, and user research.',
    },
    {
      id: 2, code: 'JOB-102', title: 'Lead Backend Engineer (Node.js/Go)', exp: '5-8 Years', posted: '15-Feb-2026',
      dept: 'Engineering', location: 'Bangalore (On-site)', type: 'Full-Time', openings: 3, applicants: 52,
      budget: '₹20L - ₹28L', priority: 'High', status: 'Active',
      postedPortals: ['LinkedIn', 'Naukri', 'Careers'],
      description: 'Lead our backend infrastructure, architect microservices, and optimize cloud systems.',
    },
    {
      id: 3, code: 'JOB-103', title: 'iOS App Developer (Swift)', exp: '3-5 Years', posted: '10-Feb-2026',
      dept: 'iOS Dev', location: 'Chennai (Hybrid)', type: 'Full-Time', openings: 2, applicants: 24,
      budget: '₹12L - ₹16L', priority: 'Normal', status: 'Active',
      postedPortals: ['LinkedIn', 'Indeed'],
      description: 'Build responsive and performant iOS applications utilizing modern Swift and SwiftUI frameworks.',
    },
    {
      id: 4, code: 'JOB-104', title: 'Financial Analyst', exp: '2-4 Years', posted: '05-Feb-2026',
      dept: 'Finance', location: 'Bangalore (On-site)', type: 'Full-Time', openings: 1, applicants: 18,
      budget: '₹8L - ₹11L', priority: 'Normal', status: 'Active',
      postedPortals: ['Naukri', 'Careers'],
      description: 'Conduct financial planning, quarterly forecast variance analysis, and manage operational expenditure reports.',
    },
    {
      id: 5, code: 'JOB-105', title: 'Performance Marketing Specialist', exp: '3-5 Years', posted: '01-Feb-2026',
      dept: 'Marketing', location: 'Remote', type: 'Contract', openings: 1, applicants: 14,
      budget: '₹10L - ₹13L', priority: 'High', status: 'Active',
      postedPortals: ['LinkedIn', 'Naukri', 'Indeed'],
      description: 'Manage and optimize digital PPC campaigns across Google Ads, Meta Ads, and LinkedIn to maximize lead conversions.',
    },
  ];

  // KPI cards that don't map to table columns are kept as plain fields —
  // wire these to real data sources when available.
  interviewsScheduled = 16;
  offersReleased = 5;
  offersAccepted = 3;
  offersPending = 2;

  constructor(private router: Router) {}

  get activeOpenPositions(): number {
    return this.jobs
      .filter((j) => j.status === 'Active')
      .reduce((sum, j) => sum + j.openings, 0);
  }

  get activeDepartmentCount(): number {
    return new Set(this.jobs.filter((j) => j.status === 'Active').map((j) => j.dept)).size;
  }

  get totalApplicants(): number {
    return this.jobs.reduce((sum, j) => sum + j.applicants, 0);
  }

  // =========================================================
  // CELL HELPERS (used by #cellTemplate in the .html)
  // =========================================================

  priorityClass(priority: JobPriority): string {
    switch (priority) {
      case 'Urgent':
        return 'priority-urgent';
      case 'High':
        return 'priority-high';
      default:
        return 'priority-normal';
    }
  }

  statusBadgeClass(status: JobStatus): string {
    switch (status) {
      case 'Draft':
        return 'status-badge-draft';
      case 'On Hold':
        return 'status-badge-hold';
      case 'Closed':
        return 'status-badge-closed';
      default:
        return 'status-badge-open';
    }
  }

  portalIcon(portal: JobPortal): string {
    switch (portal) {
      case 'LinkedIn':
        return 'bi bi-linkedin';
      case 'Naukri':
        return 'bi bi-briefcase-fill';
      case 'Indeed':
        return 'bi bi-globe2';
      case 'Careers':
        return 'bi bi-building';
    }
  }

  portalClass(portal: JobPortal): string {
    return portal === 'Careers' ? 'portal-pill-green' : 'portal-pill-blue';
  }

  // =========================================================
  // TABLE ROW ACTIONS
  // =========================================================

  onTableAction(event: { action: string; row: JobOpeningRow }): void {
    switch (event.action) {
      case 'edit':
        this.openEditModal(event.row);
        break;
      case 'pipeline':
        this.goToPipeline(event.row);
        break;
      case 'social':
        this.router.navigate(['/candidates'], { queryParams: { job: event.row.code, view: 'social' } });
        break;
    }
  }

  goToPipeline(job: JobOpeningRow): void {
    this.router.navigate(['/candidates'], { queryParams: { job: job.code } });
  }

  viewSocialApplicants(): void {
    this.router.navigate(['/candidates'], { queryParams: { view: 'social' } });
  }

  // =========================================================
  // ADD / EDIT JOB — both open the one shared <app-reuse-modal>
  // =========================================================

  openCreateModal(): void {
    this.jobModal.open('add');
  }

  openEditModal(job: JobOpeningRow): void {
    // Spread so the modal's internal `data` snapshot (used to
    // re-merge id/code/posted/applicants/postedPortals on save)
    // isn't a live reference to the row in `this.jobs`.
    this.jobModal.open('edit', { ...job });
  }

  onJobModalCancel(): void {
    // Nothing to clean up — ReuseModal resets its own form on close.
  }

  onJobModalSave(event: ModalSaveEvent): void {
    const v = event.values;
    const title = String(v['title'] ?? '').trim();
    const location = String(v['location'] ?? '').trim();

    if (!title || !location) {
      alert('Please fill in required fields (Title and Location).');
      return;
    }

    if (event.mode === 'add') {
      const nextId = this.jobs.length > 0 ? Math.max(...this.jobs.map((j) => j.id)) + 1 : 1;
      const jobCode = 'JOB-' + (100 + nextId);
      const today = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).replace(/ /g, '-');

      this.jobs = [
        ...this.jobs,
        {
          id: nextId,
          code: jobCode,
          title,
          exp: String(v['exp'] ?? '').trim() || '1-3 Years',
          posted: today,
          dept: v['dept'],
          location,
          type: v['type'],
          openings: Number(v['openings']) || 1,
          applicants: 0,
          budget: String(v['budget'] ?? '').trim() || 'Best in Industry',
          priority: v['priority'],
          status: (v['status'] as JobStatus) || 'Active',
          postedPortals: [],
          description: String(v['description'] ?? '').trim(),
        },
      ];
      return;
    }

    // edit mode — `v` already carries the original row's id/code/
    // posted/applicants/postedPortals merged with the edited fields.
    const job = this.jobs.find((j) => j.id === v['id']);
    if (!job) return;

    const openings = Number(v['openings']);

    job.title = title;
    job.dept = v['dept'];
    job.location = location;
    job.type = v['type'];
    job.openings = openings > 0 ? openings : job.openings;
    job.exp = String(v['exp'] ?? '').trim();
    job.budget = String(v['budget'] ?? '').trim();
    job.priority = v['priority'];
    job.status = v['status'];
    job.description = String(v['description'] ?? '').trim();

    // Reassign so the table picks up the mutation under Angular's
    // default change detection.
    this.jobs = [...this.jobs];
  }
}
