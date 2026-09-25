import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PrimeDataTable, PrimeTableColumn, PrimeTableHeader, PrimeTableHeaderButton, PrimeTableRowAction } from '../../../../shared/primedatatable/primedatatable';
import { ModalField, ModalSaveEvent, ReuseModal } from '../../../../shared/reuse-model/reuse-model';

// NOTE: adjust these two import paths to wherever primedatatable.ts and
// reuse-model.ts actually live in your project (e.g. a shared/ folder).


declare var bootstrap: any;

// =====================================================================
// TYPES
// =====================================================================

export type PipelineStage =
  | 'Screening'
  | 'Tech Round'
  | 'HR Round'
  | 'Offered'
  | 'Hired'
  | 'Archived';

export interface Applicant {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  experience: string;
  currentCompany: string;
  currentCtc: string;
  expectedCtc: string;
  noticePeriod: string;
  appliedDate: string;
  source: string;
  stage: PipelineStage;
  rating: number;
  skills: string[];
  resume: string;
  coverLetter: string;
}

type SourceFilter = 'all' | 'easy_apply' | 'job_share' | 'portal';

@Component({
  selector: 'app-social-webapp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PrimeDataTable, ReuseModal],
  templateUrl: './social-webapp.html',
  styleUrl: './social-webapp.scss',
})
export class SocialWebapp implements OnInit {
  // =====================================================================
  // SEED DATA  (stand-in for the linkedin_applications.json file)
  // In a real integration, replace loadApplicants() with an HTTP call.
  // =====================================================================

  applicants: Applicant[] = [
    {
      id: 'LNK-2026-001',
      jobId: 'JOB-101',
      jobTitle: 'Senior UI/UX Designer',
      fullName: 'Ananya Sundaram',
      email: 'ananya.s@linkedin-profile.com',
      phone: '+91 98842 11223',
      linkedinUrl: 'https://www.linkedin.com/in/ananyasundaram-uiux',
      experience: '5.5 Years',
      currentCompany: 'Cognizant Digital',
      currentCtc: '₹12.0 LPA',
      expectedCtc: '₹17.5 LPA',
      noticePeriod: '15 Days',
      appliedDate: '22-Sep-2026 08:10',
      source: 'LinkedIn Easy Apply',
      stage: 'Screening',
      rating: 5,
      skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
      resume: 'Ananya_Sundaram_Resume.pdf',
      coverLetter:
        'Hi Hiring Team, I saw this role on LinkedIn and am excited to apply! Over 5+ years crafting enterprise SaaS product designs.',
    },
    {
      id: 'LNK-2026-002',
      jobId: 'JOB-102',
      jobTitle: 'Lead Backend Engineer',
      fullName: 'Vikramaditya Rao',
      email: 'vikram.rao@devnet.io',
      phone: '+91 97110 55432',
      linkedinUrl: 'https://www.linkedin.com/in/vikram-backend-lead',
      experience: '7.0 Years',
      currentCompany: 'Zoho Corporation',
      currentCtc: '₹20.0 LPA',
      expectedCtc: '₹28.0 LPA',
      noticePeriod: 'Immediate',
      appliedDate: '22-Sep-2026 05:05',
      source: 'LinkedIn Job Share',
      stage: 'Tech Round',
      rating: 4,
      skills: ['PHP / Laravel', 'Node.js', 'MySQL', 'Docker', 'Redis'],
      resume: 'Vikram_Rao_Backend_Lead.pdf',
      coverLetter:
        'Extensive background in scalable microservices & high-throughput API architecture.',
    },
    {
      id: 'LNK-2026-003',
      jobId: 'JOB-103',
      jobTitle: 'iOS App Developer',
      fullName: 'Priya Ramakrishnan',
      email: 'priya.ram@gmail.com',
      phone: '+91 94451 88990',
      linkedinUrl: 'https://www.linkedin.com/in/priya-swift-dev',
      experience: '3.5 Years',
      currentCompany: 'Paytm Payments',
      currentCtc: '₹10.5 LPA',
      expectedCtc: '₹15.0 LPA',
      noticePeriod: '30 Days',
      appliedDate: '21-Sep-2026 09:40',
      source: 'LinkedIn Easy Apply',
      stage: 'HR Round',
      rating: 5,
      skills: ['Swift', 'SwiftUI', 'CoreData', 'Combine'],
      resume: 'Priya_Ramakrishnan_iOS.pdf',
      coverLetter: 'Built payment mobile apps used by millions of active daily users.',
    },
  ];

  // =====================================================================
  // SOURCE TABS
  // =====================================================================

  sourceFilter: SourceFilter = 'all';

  sourceTabs: { key: SourceFilter; label: string; icon?: string }[] = [
    { key: 'all', label: 'All Applicants' },
    { key: 'easy_apply', label: 'Easy Apply', icon: 'ti ti-brand-linkedin' },
    { key: 'job_share', label: 'Job Share Link', icon: 'ti ti-share' },
    { key: 'portal', label: 'Careers Portal', icon: 'ti ti-world' },
  ];

  get filteredApplicants(): Applicant[] {
    if (this.sourceFilter === 'all') return this.applicants;

    return this.applicants.filter((a) => {
      const src = (a.source || '').toLowerCase();
      if (this.sourceFilter === 'easy_apply') return src.includes('easy apply');
      if (this.sourceFilter === 'job_share') return src.includes('job share');
      if (this.sourceFilter === 'portal') return src.includes('portal');
      return true;
    });
  }

  selectSourceTab(tab: SourceFilter): void {
    this.sourceFilter = tab;
    this.refreshTableData();
  }

  // =====================================================================
  // KPI METRICS  (derived, always reflect current applicants[])
  // =====================================================================

  get totalCount(): number {
    return this.applicants.length;
  }

  get easyApplyCount(): number {
    return this.applicants.filter((a) => (a.source || '').includes('Easy Apply')).length;
  }

  get shortlistedCount(): number {
    return this.applicants.filter((a) =>
      ['Tech Round', 'HR Round', 'Screening'].includes(a.stage),
    ).length;
  }

  get hiredCount(): number {
    return this.applicants.filter((a) => ['Offered', 'Hired'].includes(a.stage)).length;
  }

  // =====================================================================
  // TABLE CONFIG  (app-primedatatable)
  // =====================================================================

  modalHeader: PrimeTableHeader = {
    title: 'Social & Web Applicants',
    icon: 'ti ti-share',
  };

  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', width: '60px' },
    { field: 'fullName', header: 'Candidate Name', type: 'custom', sortable: true },
    { field: 'source', header: 'Application Profile', type: 'custom' },
    { field: 'jobTitle', header: 'Applied Position', type: 'custom', sortable: true },
    { field: 'currentCompany', header: 'Experience & Company', type: 'custom' },
    { field: 'expectedCtc', header: 'Expected CTC / Notice', type: 'custom' },
    { field: 'rating', header: 'Rating', type: 'custom', sortable: true },
    { field: 'stage', header: 'Pipeline Stage', type: 'custom', sortable: true },
    { field: 'appliedDate', header: 'Applied Date', type: 'text', sortable: true },
    { field: 'actions', header: 'Action', type: 'actions', width: '150px' },
  ];

  // covers the fields that aren't picked up automatically (skills, email, id ...)
  globalFilterFields = [
    'fullName',
    'email',
    'phone',
    'id',
    'jobTitle',
    'currentCompany',
    'expectedCtc',
    'stage',
    'source',
    'skillsText',
  ];

  rowActions: PrimeTableRowAction[] = [
    { key: 'view', label: 'View Full Profile', icon: 'ti ti-eye' },
    { key: 'export', label: 'Download Resume Archive', icon: 'ti ti-file-download' },
    { key: 'forward', label: 'Forward Resume to Team Lead', icon: 'ti ti-send' },
  ];

  headerButtons: PrimeTableHeaderButton[] = [
    { id: 'bulkZip', label: 'Bulk Download Resumes (.csv)', icon: 'ti ti-file-download', variant: 'outline' },
    { id: 'tlEval', label: 'TL Evaluations', icon: 'ti ti-clipboard-check', variant: 'outline', routerLink: '/candidate-evaluations' },
    { id: 'shareJob', label: 'Post Job Link', icon: 'ti ti-share', variant: 'outline' },
  ];

  selection: Applicant[] = [];

  // Rows actually bound to [data] on the table, plus a flattened skills
  // string for search. Kept as a plain property (recomputed only when the
  // underlying applicants/filter change) rather than a getter, so PrimeNG's
  // table doesn't see a new array reference on every change-detection pass.
  tableData: (Applicant & { skillsText: string })[] = [];

  private refreshTableData(): void {
    this.tableData = this.filteredApplicants.map((a) => ({
      ...a,
      skillsText: (a.skills || []).join(', '),
    }));
  }

  // =====================================================================
  // BATCH ACTION BAR
  // =====================================================================

  get batchCount(): number {
    return this.selection.length;
  }

  clearSelection(): void {
    this.selection = [];
  }

  onSelectionChange(sel: Applicant[]): void {
    this.selection = sel;
  }

  // =====================================================================
  // ADD CANDIDATE  (app-reuse-modal)
  // =====================================================================

  @ViewChild('addModal') addModal!: ReuseModal;

  positionOptions = [
    { label: 'Senior UI/UX Designer', value: 'Senior UI/UX Designer' },
    { label: 'Lead Backend Engineer', value: 'Lead Backend Engineer' },
    { label: 'iOS App Developer', value: 'iOS App Developer' },
    { label: 'HR Talent Acquisition Specialist', value: 'HR Talent Acquisition Specialist' },
  ];

  addFields: ModalField[] = [
    { key: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. Ramesh Kumar', col: 12 },
    { key: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'ramesh@example.com' },
    { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210' },
    { key: 'linkedinUrl', label: 'LinkedIn Profile URL', type: 'text', required: true, placeholder: 'https://www.linkedin.com/in/username', col: 12 },
    { key: 'jobTitle', label: 'Applied Position', type: 'select', options: this.positionOptions, showClear: true },
    { key: 'experience', label: 'Total Experience', type: 'text', placeholder: 'e.g. 4.5 Years' },
    { key: 'expectedCtc', label: 'Expected CTC', type: 'text', placeholder: 'e.g. ₹16 LPA' },
    { key: 'noticePeriod', label: 'Notice Period', type: 'text', placeholder: 'e.g. Immediate / 15 days' },
  ];

  openAddModal(): void {
    this.addModal.open('add');
  }

  onAddSaved(event: ModalSaveEvent): void {
    const v = event.values;
    const newApplicant: Applicant = {
      id: 'LNK-2026-' + String(this.applicants.length + 1).padStart(3, '0'),
      jobId: 'JOB-MANUAL',
      jobTitle: v['jobTitle'] || 'Not specified',
      fullName: v['fullName'],
      email: v['email'],
      phone: v['phone'] || '',
      linkedinUrl: v['linkedinUrl'] || '',
      experience: v['experience'] || '',
      currentCompany: '',
      currentCtc: '',
      expectedCtc: v['expectedCtc'] || '',
      noticePeriod: v['noticePeriod'] || '',
      appliedDate: this.formatNow(),
      source: 'LinkedIn Easy Apply (Manual)',
      stage: 'Screening',
      rating: 5,
      skills: [],
      resume: '',
      coverLetter: '',
    };

    // TODO: replace with a real POST to your candidates API.
    this.applicants = [newApplicant, ...this.applicants];
    this.refreshTableData();
  }

  private formatNow(): string {
    const d = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}-${months[d.getMonth()]}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // =====================================================================
  // ROW ACTIONS
  // =====================================================================

  onAction(event: { action: string; row: Applicant }): void {
    const { action, row } = event;

    if (action === 'view') this.openViewModal(row);
    else if (action === 'export') this.downloadResumeArchive([row]);
    else if (action === 'forward') this.openForwardModal(row);
  }

  onHeaderButtonClick(btn: PrimeTableHeaderButton): void {
    if (btn.id === 'bulkZip') this.downloadResumeArchive(this.filteredApplicants);
    else if (btn.id === 'shareJob') this.openShareModal();
  }

  // =====================================================================
  // VIEW CANDIDATE PROFILE  (custom modal — richer layout than the
  // generic field-list dialog supports, so it's built directly here
  // using the same Bootstrap modal pattern as ReuseModal)
  // =====================================================================

  @ViewChild('viewModalRoot') viewModalRoot!: ElementRef;
  viewModalInstance: any;

  selectedApplicant: Applicant | null = null;
  draftStage: PipelineStage = 'Screening';
  draftRating = 5;

  stageOptions: { value: PipelineStage; label: string }[] = [
    { value: 'Screening', label: 'Screening (Pending Review)' },
    { value: 'Tech Round', label: 'Technical Interview' },
    { value: 'HR Round', label: 'HR Discussion' },
    { value: 'Offered', label: 'Offer Released' },
    { value: 'Hired', label: 'Hired (Onboard)' },
    { value: 'Archived', label: 'Archived / Rejected' },
  ];

  ratingOptions = [
    { value: 5, label: '★★★★★ Excellent Fit (5 Star)' },
    { value: 4, label: '★★★★☆ Good Candidate (4 Star)' },
    { value: 3, label: '★★★☆☆ Average (3 Star)' },
    { value: 2, label: '★★☆☆☆ Underqualified (2 Star)' },
  ];

  openViewModal(row: Applicant): void {
    this.selectedApplicant = row;
    this.draftStage = row.stage;
    this.draftRating = row.rating;

    this.viewModalInstance =
      this.viewModalInstance ||
      bootstrap.Modal.getOrCreateInstance(this.viewModalRoot.nativeElement, { focus: false });

    this.viewModalInstance.show();
  }

  saveViewChanges(): void {
    if (!this.selectedApplicant) return;

    this.applicants = this.applicants.map((a) =>
      a.id === this.selectedApplicant!.id ? { ...a, stage: this.draftStage, rating: this.draftRating } : a,
    );

    // TODO: replace with a real PATCH to your candidates API.
    this.refreshTableData();
    this.viewModalInstance?.hide();
  }

  stars(rating: number): string {
    if (rating >= 5) return '★★★★★';
    if (rating === 4) return '★★★★☆';
    if (rating === 3) return '★★★☆☆';
    if (rating === 2) return '★★☆☆☆';
    return '★☆☆☆☆';
  }

  stageClass(stage: string): string {
    switch (stage) {
      case 'Tech Round': return 'stage-tech';
      case 'HR Round': return 'stage-hr';
      case 'Offered': return 'stage-offered';
      case 'Hired': return 'stage-hired';
      case 'Archived': return 'stage-archived';
      default: return 'stage-screening';
    }
  }

  sourceMeta(source: string): { icon: string; label: string } {
    const src = source || 'Social & Web Application';
    if (/linkedin/i.test(src)) return { icon: 'ti ti-brand-linkedin', label: 'LinkedIn Profile' };
    if (/share/i.test(src)) return { icon: 'ti ti-share', label: 'Shared Post Link' };
    if (/portal/i.test(src)) return { icon: 'ti ti-window', label: 'Web Portal' };
    return { icon: 'ti ti-world', label: 'Application Profile' };
  }

  // =====================================================================
  // FORWARD RESUME TO TEAM LEAD  (app-reuse-modal)
  // =====================================================================

  @ViewChild('forwardModal') forwardModal!: ReuseModal;

  teamOptions = [
    { label: 'Frontend Engineering Team', value: 'Frontend Engineering Team' },
    { label: 'Backend Engineering Team', value: 'Backend Engineering Team' },
    { label: 'UI/UX Design Team', value: 'UI/UX Design Team' },
    { label: 'Mobile / iOS Engineering Team', value: 'Mobile / iOS Engineering Team' },
    { label: 'Marketing & PPC Team', value: 'Marketing & PPC Team' },
    { label: 'HR & Talent Acquisition Team', value: 'HR & Talent Acquisition Team' },
    { label: 'Finance & Accounts Team', value: 'Finance & Accounts Team' },
  ];

  // Flattened across teams — the generic reuse modal doesn't support one
  // field's options reacting live to another field's value, so every TL
  // is offered here and the *default* team is still auto-picked below.
  tlOptions = [
    { label: 'Santhosh Kumar (Frontend Tech Lead)', value: 'Santhosh Kumar (Frontend Tech Lead)' },
    { label: 'Anand (Senior Frontend Lead)', value: 'Anand (Senior Frontend Lead)' },
    { label: 'Karthik V (Backend Tech Lead)', value: 'Karthik V (Backend Tech Lead)' },
    { label: 'Ramesh (Principal Backend Architect)', value: 'Ramesh (Principal Backend Architect)' },
    { label: 'Deepak (Lead UI/UX Designer)', value: 'Deepak (Lead UI/UX Designer)' },
    { label: 'Ananya S (Senior Design Lead)', value: 'Ananya S (Senior Design Lead)' },
    { label: 'Anitha R (iOS Mobile Tech Lead)', value: 'Anitha R (iOS Mobile Tech Lead)' },
    { label: 'Priya (Mobile Lead)', value: 'Priya (Mobile Lead)' },
    { label: 'Priya S (Performance Marketing Lead)', value: 'Priya S (Performance Marketing Lead)' },
    { label: 'Vikram (Growth Lead)', value: 'Vikram (Growth Lead)' },
    { label: 'Meena S (HR Operations Lead)', value: 'Meena S (HR Operations Lead)' },
    { label: 'Kavitha (Talent Lead)', value: 'Kavitha (Talent Lead)' },
    { label: 'Suresh Kumar (Finance Manager)', value: 'Suresh Kumar (Finance Manager)' },
  ];

  roundOptions = [
    { label: 'Technical Round 1 (Live Coding / Practical)', value: 'Tech & Coding Round 1' },
    { label: 'System Design & Architecture', value: 'System Design & Architecture' },
    { label: 'Portfolio & UI/UX Design Review', value: 'Portfolio & UI/UX Design Review' },
    { label: 'Domain & PPC Strategy Test', value: 'Domain & PPC Strategy Test' },
    { label: 'Managerial & Culture Fit', value: 'Managerial & Culture Fit' },
  ];

  forwardFields: ModalField[] = [
    { key: 'department', label: 'Select Target Team / Department', type: 'select', required: true, options: this.teamOptions },
    { key: 'assignedTl', label: 'Assign Team Lead (TL)', type: 'select', required: true, options: this.tlOptions },
    { key: 'round', label: 'Interview Evaluation Round', type: 'select', required: true, options: this.roundOptions },
    { key: 'tlRole', label: 'Evaluator Role', type: 'text', defaultValue: 'Technical Evaluator' },
    { key: 'instructions', label: 'Manager Shortlist Notes & Key Skill Focus Areas for TL', type: 'textarea', rows: 3, col: 12,
      placeholder: 'Provide instructions for the Team Lead (e.g. check React/Next.js experience, evaluate database indexing)...' },
  ];

  private forwardCandidate: Applicant | null = null;

  private defaultTeamForJob(job: string): string {
    const j = (job || '').toLowerCase();
    if (j.includes('design') || j.includes('ui/ux')) return 'UI/UX Design Team';
    if (j.includes('backend') || j.includes('node') || j.includes('php') || j.includes('python')) return 'Backend Engineering Team';
    if (j.includes('ios') || j.includes('android') || j.includes('mobile') || j.includes('app')) return 'Mobile / iOS Engineering Team';
    if (j.includes('marketing') || j.includes('ppc') || j.includes('seo')) return 'Marketing & PPC Team';
    if (j.includes('hr') || j.includes('talent') || j.includes('recruiter')) return 'HR & Talent Acquisition Team';
    if (j.includes('finance') || j.includes('analyst') || j.includes('account')) return 'Finance & Accounts Team';
    return 'Frontend Engineering Team';
  }

  openForwardModal(row: Applicant): void {
    this.forwardCandidate = row;

    this.forwardModal.editTitle = `Forward Resume — ${row.fullName}`;
    this.forwardModal.open('edit', {
      department: this.defaultTeamForJob(row.jobTitle),
    });
  }

  onForwardSaved(event: ModalSaveEvent): void {
    if (!this.forwardCandidate) return;

    const payload = {
      candidateId: this.forwardCandidate.id,
      candidateName: this.forwardCandidate.fullName,
      jobTitle: this.forwardCandidate.jobTitle,
      source: this.forwardCandidate.source,
      ...event.values,
    };

    // TODO: replace with a real POST to your candidate-evaluation API.
    console.log('Forwarding candidate to TL:', payload);
    alert(`${this.forwardCandidate.fullName}'s resume has been forwarded to the Team Lead.`);

    this.forwardCandidate = null;
  }

  // =====================================================================
  // SHARE JOB ON LINKEDIN  (custom modal)
  // =====================================================================

  @ViewChild('shareModalRoot') shareModalRoot!: ElementRef;
  shareModalInstance: any;

  jobShareOptions = [
    { jobId: 'JOB-101', title: 'Senior UI/UX Designer', exp: '4-6 yrs', loc: 'Chennai / Hybrid' },
    { jobId: 'JOB-102', title: 'Lead Backend Engineer', exp: '5+ yrs', loc: 'Bangalore / Remote' },
    { jobId: 'JOB-103', title: 'iOS App Developer', exp: '3-5 yrs', loc: 'Chennai' },
  ];

  selectedJobId = this.jobShareOptions[0].jobId;
  shareApplyUrl = '';
  sharePostTemplate = '';
  shareLinkedInUrl = '';
  copyLinkLabel = 'Copy Link';

  openShareModal(): void {
    this.updateShareContent();

    this.shareModalInstance =
      this.shareModalInstance ||
      bootstrap.Modal.getOrCreateInstance(this.shareModalRoot.nativeElement, { focus: false });

    this.shareModalInstance.show();
  }

  onShareJobChange(): void {
    this.updateShareContent();
  }

  private updateShareContent(): void {
    const job = this.jobShareOptions.find((j) => j.jobId === this.selectedJobId);
    if (!job) return;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin + '/' : '/';
    this.shareApplyUrl = `${baseUrl}job-apply?job_id=${job.jobId}`;

    this.sharePostTemplate =
      `🚀 WE ARE HIRING: ${job.title}!\n\n` +
      `📍 Location: ${job.loc}\n💼 Experience: ${job.exp}\n\n` +
      `Join our fast-growing engineering & product design team. Apply directly below 👇\n\n` +
      `Apply Link: ${this.shareApplyUrl}\n\n` +
      `#Hiring #JobOpportunity #${job.title.replace(/[^a-zA-Z0-9]/g, '')} #Jobs2026`;

    this.shareLinkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.shareApplyUrl)}`;
  }

  copyShareUrl(): void {
    navigator.clipboard.writeText(this.shareApplyUrl).then(() => {
      this.copyLinkLabel = 'Copied!';
      setTimeout(() => (this.copyLinkLabel = 'Copy Link'), 2000);
    });
  }

  copyPostText(): void {
    navigator.clipboard.writeText(this.sharePostTemplate);
  }

  // =====================================================================
  // RESUME ARCHIVE / REPORT EXPORT
  // (The PHP version streamed a server-built .zip / .csv. In this
  // client-only conversion the equivalent report is generated and
  // downloaded as CSV; wire this up to a real export endpoint for
  // an actual .zip of resume files.)
  // =====================================================================

  downloadResumeArchive(rows: Applicant[]): void {
    if (!rows.length) {
      alert('Please select at least one candidate.');
      return;
    }

    const headers = [
      'Candidate ID','Full Name','Email','Phone','Applied Position','Experience',
      'Current Company','Current CTC','Expected CTC','Notice Period','Rating',
      'Pipeline Stage','Applied Date','Source','Resume File','LinkedIn Profile',
    ];

    const csvRows = rows.map((a) => [
      a.id, a.fullName, a.email, a.phone, a.jobTitle, a.experience,
      a.currentCompany, a.currentCtc, a.expectedCtc, a.noticePeriod,
      `${a.rating} Stars`, a.stage, a.appliedDate, a.source, a.resume, a.linkedinUrl,
    ]);

    const csv = [headers, ...csvRows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `LinkedIn_Applicants_Report_${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  downloadSelectedResumes(): void {
    this.downloadResumeArchive(this.selection);
  }

  ngOnInit(): void {
    this.refreshTableData();
  }
}
