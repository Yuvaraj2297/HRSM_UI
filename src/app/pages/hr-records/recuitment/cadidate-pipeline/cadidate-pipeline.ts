import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// NOTE: adjust these relative paths to wherever the shared components
// actually live in your project.
import { ModalField, ModalSaveEvent, ReuseModal } from '../../../../shared/reuse-model/reuse-model';
import { PrimeDataTable, PrimeTableColumn, PrimeTableRowAction } from '../../../../shared/primedatatable/primedatatable';

type TabKey = 'all_application' | 'screening' | 'tech_interview' | 'hr_round' | 'offered' | 'hired' | 'archived';
type CandidateStage = Exclude<TabKey, 'all_application'>;

const STORAGE_KEY = '';

export interface CandidateRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string; 
  position: string;
  dept: string;
  jobCode: string;
  company: string;
  experience: string;
  ctc: string;
  notice: string;
  rating: number;
  stage: CandidateStage;
  stageLabel: string;
  appliedDate: string;
}

interface JobOption {
  code: string;
  title: string;
  dept: string;
}

@Component({
  selector: 'app-cadidate-pipeline',
  standalone: true,
  imports: [CommonModule, ReuseModal, PrimeDataTable],
  templateUrl: './cadidate-pipeline.html',
  styleUrl: './cadidate-pipeline.scss',
})
export class CadidatePipeline {
  private router = inject(Router);

  @ViewChild('candidateModal') candidateModal!: ReuseModal;

  constructor() {
    this.candidates = this.load();
  }

  // =========================================================
  // NAVIGATION
  // =========================================================

  goToSocialApplicants(): void {
    this.router.navigate(['/recruitment/social-web-applicants']);
  }

  goToInterviewCalendar(): void {
    this.router.navigate(['/recruitment/interview-schedule']);
  }

  // =========================================================
  // STAGE TABS
  // =========================================================

  currentFilter: TabKey = 'all_application';

  setFilter(key: TabKey): void {
    this.currentFilter = key;
  }

  get filteredCandidates(): CandidateRow[] {
    if (this.currentFilter === 'all_application') {
      return this.candidates;
    }
    return this.candidates.filter((c) => c.stage === this.currentFilter);
  }

  get stageCounts(): Record<TabKey, number> {
    const counts: Record<TabKey, number> = {
      all_application: this.candidates.length,
      screening: 0,
      tech_interview: 0,
      hr_round: 0,
      offered: 0,
      hired: 0,
      archived: 0,
    };

    for (const c of this.candidates) {
      counts[c.stage]++;
    }

    return counts;
  }

  // =========================================================
  // TABLE COLUMNS — every column below is rendered through the
  // projected #cellTemplate, since candidate/position/experience/
  // ctc/rating/stage are all compound (icon + text, two lines, etc).
  // `meta.filterFields` tells the shared table which real row
  // fields to search, since these column `field`s are just labels.
  // =========================================================
  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', width: '64px' },
    { field: 'candidate', header: 'Candidate', type: 'custom', width: '230px', meta: { filterFields: ['name', 'email', 'phone'] } },
    { field: 'applied_position', header: 'Applied Position', type: 'custom', width: '190px', meta: { filterFields: ['position', 'dept', 'jobCode'] } },
    { field: 'experience_company', header: 'Experience & Company', type: 'custom', width: '170px', meta: { filterFields: ['company', 'experience'] } },
    { field: 'expected_ctc', header: 'Expected CTC / Notice', type: 'custom', width: '160px', meta: { filterFields: ['ctc', 'notice'] } },
    { field: 'rating', header: 'Rating', type: 'custom', width: '100px' },
    { field: 'stage_status', header: 'Stage Status', type: 'custom', width: '150px', meta: { filterFields: ['stageLabel'] } },
    { field: 'applied_date', header: 'Applied Date', type: 'custom', width: '120px', meta: { filterFields: ['appliedDate'] } },
    { field: 'actions', header: 'Action', type: 'actions', width: '110px' },
  ];

  rowActions: PrimeTableRowAction[] = [
    { key: 'resume', label: 'Download Resume (PDF)', icon: 'bi bi-file-earmark-pdf' },
    {
      key: 'schedule',
      label: 'Schedule Interview',
      icon: 'bi bi-calendar-plus',
      color: 'var(--blue-550)',
      hiddenWhen: (row: CandidateRow) => row.stage === 'hired' || row.stage === 'archived',
    },
    {
      key: 'onboard',
      label: 'Fast-Track Onboard Employee',
      icon: 'bi bi-person-check-fill',
      color: 'var(--green-400)',
      hiddenWhen: (row: CandidateRow) => row.stage !== 'hired',
    },
  ];

  onTableAction(event: { action: string; row: CandidateRow }): void {
    switch (event.action) {
      case 'resume':
        // No real resume file in this demo dataset — wire this up to your
        // actual storage/download endpoint.
        alert(`Downloading resume for ${event.row.name}...`);
        break;
      case 'schedule':
        this.router.navigate(['/recruitment/interview-schedule'], { queryParams: { candidate: event.row.name } });
        break;
      case 'onboard':
        this.router.navigate(['/employees/create'], { queryParams: { prefill: event.row.name } });
        break;
    }
  }

  // =========================================================
  // CELL HELPERS (used by #cellTemplate in the .html)
  // =========================================================

  starString(rating: number): string {
    const full = Math.max(0, Math.min(5, Math.round(rating)));
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  stageBadgeClass(stage: CandidateStage): string {
    switch (stage) {
      case 'screening':
        return 'stage-screening';
      case 'tech_interview':
        return 'stage-tech';
      case 'hr_round':
        return 'stage-hr';
      case 'offered':
        return 'stage-offered';
      case 'hired':
        return 'stage-hired';
      case 'archived':
        return 'stage-rejected';
    }
  }

  stageIcon(stage: CandidateStage): string {
    return stage === 'archived' ? 'bi bi-x-circle-fill' : 'bi bi-circle-fill';
  }

  private stageLabelFor(stage: CandidateStage): string {
    switch (stage) {
      case 'screening':
        return 'Screening Call';
      case 'tech_interview':
        return 'Tech Round 1';
      case 'hr_round':
        return 'HR Negotiation';
      case 'offered':
        return 'Offer Released';
      case 'hired':
        return 'Hired (Joining)';
      case 'archived':
        return 'Archived / Rejected';
    }
  }

  // =========================================================
  // ADD CANDIDATE MODAL
  // =========================================================

  jobOptions: JobOption[] = [
    { code: 'JOB-101', title: 'Senior UI/UX Designer', dept: 'Design' },
    { code: 'JOB-102', title: 'Lead Backend Engineer', dept: 'Engineering' },
    { code: 'JOB-103', title: 'iOS App Developer', dept: 'iOS Dev' },
    { code: 'JOB-104', title: 'Financial Analyst', dept: 'Finance' },
    { code: 'JOB-105', title: 'Performance Marketing Specialist', dept: 'Marketing' },
  ];

  candidateFields: ModalField[] = [];

  openAddCandidateModal(): void {
    this.candidateFields = this.buildCandidateFields();
    this.candidateModal.title = 'Add Candidate to Talent Pool';
    this.candidateModal.saveLabel = 'Save Candidate';
    this.candidateModal.submitIcon = 'bi bi-check2-circle';
    this.candidateModal.open('add');
  }

  onCandidateSaved(event: ModalSaveEvent): void {
    const v = event.values;
    const job = this.jobOptions.find((j) => j.code === v['jobCode']);
    const stage = (v['stage'] || 'screening') as CandidateStage;

    const nextId = this.candidates.length > 0 ? Math.max(...this.candidates.map((c) => c.id)) + 1 : 1;
    const today = new Date()
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .replace(/ /g, '-');

    this.candidates = [
      ...this.candidates,
      {
        id: nextId,
        name: v['name'],
        email: v['email'],
        phone: v['phone'],
        avatar: '/assets/profile-1.jpg',
        position: job?.title || v['jobCode'],
        dept: job?.dept || 'General',
        jobCode: v['jobCode'],
        company: v['company'] || 'Previous Org',
        experience: v['experience'] || '2 Years',
        ctc: v['ctc'] || 'Best in Industry',
        notice: v['notice'] || 'Immediate',
        rating: 4,
        stage,
        stageLabel: this.stageLabelFor(stage),
        appliedDate: today,
      },
    ];

    this.persist(this.candidates);
  }

  private buildCandidateFields(): ModalField[] {
    return [
      { key: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Candidate full name', col: 6 },
      { key: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'email@example.com', col: 6 },
      { key: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '+91 98765 43210', col: 6 },
      {
        key: 'jobCode',
        label: 'Applied Job Position',
        type: 'select',
        required: true,
        col: 6,
        options: this.jobOptions.map((j) => ({ label: `${j.code} - ${j.title}`, value: j.code })),
      },
      { key: 'experience', label: 'Current Experience', type: 'text', placeholder: 'e.g. 4.5 Years', col: 4 },
      { key: 'company', label: 'Current Company', type: 'text', placeholder: 'e.g. Infosys', col: 4 },
      { key: 'ctc', label: 'Expected CTC (₹)', type: 'text', placeholder: 'e.g. ₹16 LPA', col: 4 },
      {
        key: 'notice',
        label: 'Notice Period',
        type: 'select',
        col: 6,
        defaultValue: 'Immediate',
        options: [
          { label: 'Immediate Joiner', value: 'Immediate' },
          { label: '15 Days', value: '15 Days' },
          { label: '30 Days', value: '30 Days' },
          { label: '60 Days', value: '60 Days' },
          { label: '90 Days', value: '90 Days' },
        ],
      },
      {
        key: 'stage',
        label: 'Initial Stage',
        type: 'select',
        col: 6,
        defaultValue: 'screening',
        options: [
          { label: 'Screening', value: 'screening' },
          { label: 'Tech Interview', value: 'tech_interview' },
          { label: 'HR Round', value: 'hr_round' },
          { label: 'Offered', value: 'offered' },
          { label: 'Hired', value: 'hired' },
        ],
      },
    ];
  }

  // =========================================================
  // DATA (seeded once, then persisted to localStorage — same
  // pattern used elsewhere in this app for demo data)
  // =========================================================

  candidates: CandidateRow[];

  private load(): CandidateRow[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as CandidateRow[];
      } catch {
        /* fall through to seed */
      }
    }
    const seed = this.seed();
    this.persist(seed);
    return seed;
  }

  private persist(rows: CandidateRow[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  }

  private seed(): CandidateRow[] {
    return [
      { id: 1, name: 'Kavitha Raman', email: 'kavitha.r@example.com', phone: '+91 98401 23456', avatar: 'profile-1', position: 'Senior UI/UX Designer', dept: 'Design', jobCode: 'JOB-101', company: 'Freshworks', experience: '4.5 yrs', ctc: '₹16.5 LPA', notice: '15 Days', rating: 5, stage: 'offered', stageLabel: 'Offer Released', appliedDate: '24-Feb-2026' },

      { id: 2, name: 'Rahul Verma', email: 'rahul.v@example.com', phone: '+91 98765 43210', avatar: 'profile-2', position: 'Lead Backend Engineer', dept: 'Engineering', jobCode: 'JOB-102', company: 'Swiggy', experience: '6 yrs', ctc: '₹26.0 LPA', notice: 'Immediate', rating: 4, stage: 'hired', stageLabel: 'Hired (Joining)', appliedDate: '18-Feb-2026' },
     
      { id: 3, name: 'Siddharth Nair', email: 'sid.nair@example.com', phone: '+91 94441 89012', avatar: 'profile-3', position: 'iOS App Developer', dept: 'iOS Dev', jobCode: 'JOB-103', company: 'Zoho', experience: '3.5 yrs', ctc: '₹14.0 LPA', notice: '30 Days', rating: 4, stage: 'tech_interview', stageLabel: 'Tech Round 2', appliedDate: '22-Feb-2026' },
      
      { id: 4, name: 'Priya Sundaram', email: 'priya.s@example.com', phone: '+91 91234 56780', avatar: 'profile-4', position: 'Financial Analyst', dept: 'Finance', jobCode: 'JOB-104', company: 'Deloitte', experience: '3 yrs', ctc: '₹10.5 LPA', notice: '30 Days', rating: 3, stage: 'screening', stageLabel: 'Screening Call', appliedDate: '26-Feb-2026' },
     
      { id: 5, name: 'Arun Kumar', email: 'arun.k@example.com', phone: '+91 97890 12345', avatar: 'profile-2', position: 'Lead Backend Engineer', dept: 'Engineering', jobCode: 'JOB-102', company: 'Cognizant', experience: '5 yrs', ctc: '₹22.0 LPA', notice: '60 Days', rating: 4, stage: 'hr_round', stageLabel: 'HR Negotiation', appliedDate: '20-Feb-2026' },
     
      { id: 6, name: 'Meera Krishnan', email: 'meera.k@example.com', phone: '+91 98840 54321', avatar: 'profile-1', position: 'Senior UI/UX Designer', dept: 'Design', jobCode: 'JOB-101', company: 'Flipkart', experience: '4 yrs', ctc: '₹17.0 LPA', notice: '30 Days', rating: 4, stage: 'screening', stageLabel: 'Screening Call', appliedDate: '27-Feb-2026' },
     
      { id: 7, name: 'Karthik Rajan', email: 'karthik.r@example.com', phone: '+91 99620 11223', avatar: 'profile-3', position: 'Lead Backend Engineer', dept: 'Engineering', jobCode: 'JOB-102', company: 'Razorpay', experience: '5.5 yrs', ctc: '₹24.0 LPA', notice: '15 Days', rating: 5, stage: 'tech_interview', stageLabel: 'Tech Round 1', appliedDate: '25-Feb-2026' },
     
      { id: 8, name: 'Deepa Balaji', email: 'deepa.b@example.com', phone: '+91 98412 88990', avatar: 'profile-4', position: 'Financial Analyst', dept: 'Finance', jobCode: 'JOB-104', company: 'KPMG', experience: '4 yrs', ctc: '₹11.0 LPA', notice: '30 Days', rating: 4, stage: 'hr_round', stageLabel: 'HR Negotiation', appliedDate: '21-Feb-2026' },
      
      { id: 9, name: 'Ananya Sharma', email: 'ananya.s@example.com', phone: '+91 97110 33445', avatar: 'profile-1', position: 'iOS App Developer', dept: 'iOS Dev', jobCode: 'JOB-103', company: 'Paytm', experience: '3 yrs', ctc: '₹15.0 LPA', notice: 'Immediate', rating: 5, stage: 'offered', stageLabel: 'Offer Released', appliedDate: '23-Feb-2026' }
          ];
  }
}
