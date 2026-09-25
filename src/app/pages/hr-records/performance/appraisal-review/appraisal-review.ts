import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReuseModal, ModalField, ModalSaveEvent } from '../../../../shared/reuse-model/reuse-model';


// =============================================================
// TYPES
// =============================================================

export type MainPortal = 'employee' | 'admin';
export type AdminSubtab = 'tl' | 'hr' | 'mgr' | 'all';

export interface EmployeeAppraisal {
  key: string;
  id: string;
  name: string;
  email: string;
  dept: string;
  role: string;
  tl: string;
  projects: string;
  tools: string;
  summary: string;
  achievements: string;
  rating: string;
  certs: string;

  tlApproved: boolean;
  tlRating: string;
  tlHike: string;
  tlPromo: string;
  tlFeedback: string;

  hrApproved: boolean;
  hrRating: string;
  hrHike: string;
  hrPromo: string;
  hrComments: string;

  mgrApproved: boolean;
  mgrRating: string;
  mgrHike: string;
  mgrReply: string;
}

interface ToastState {
  title: string;
  message: string;
}

@Component({
  selector: 'app-appraisal-review',
  standalone: true,
  imports: [CommonModule, FormsModule, ReuseModal],
  templateUrl: './appraisal-review.html',
  styleUrl: './appraisal-review.scss',
})
export class AppraisalReview {
  // =========================================================
  // MOCK DATABASE  (ported 1:1 from the PHP `employeeDatabase`)
  // =========================================================

  employeeDatabase: Record<string, EmployeeAppraisal> = {
    ARUN: {
      key: 'ARUN', id: 'EMP-0104', name: 'Arun Kumar', email: 'arun.k@gharuda.com',
      dept: 'Engineering', role: 'Senior Backend Engineer', tl: 'Rajesh V (Tech Lead)',
      projects: 'Payment Gateway Modernization, Microservices Migration, Kafka Data Pipeline',
      tools: 'PHP, Node.js, Docker, Kubernetes, PostgreSQL, Redis, AWS',
      summary: 'Over the past fiscal year, I successfully led the backend microservices refactoring, integrated payment webhooks, and ensured 99.98% platform reliability during high-traffic quarters.',
      achievements: '• Completed high-throughput API gateway migration 2 weeks ahead of schedule.\n• Reduced Redis memory footprint by 28% through key compression.\n• Mentored 2 junior engineers through onboarding.',
      rating: '4.5', certs: 'Certified Kubernetes Administrator (CKA), AWS Cloud Solutions',
      tlApproved: true, tlRating: '4.6', tlHike: '15%', tlPromo: 'Promoted to Tech Lead',
      tlFeedback: 'Demonstrated exemplary technical ownership during the Q3-Q4 microservices migration. Code reviews were thorough.',
      hrApproved: true, hrRating: '4.8', hrHike: '15%', hrPromo: 'Promoted to Tech Lead',
      hrComments: 'Performance verified with project stakeholders. Proposed 15% increment aligns with annual merit budget.',
      mgrApproved: false, mgrRating: '4.8', mgrHike: '15%',
      mgrReply: 'Good! Outstanding contributions to backend microservices, Kafka pipelines, and zero downtime. Full promotion to Tech Lead approved with 15% merit increment.',
    },
    PRIYA: {
      key: 'PRIYA', id: 'EMP-0108', name: 'Priya Sharma', email: 'priya.s@gharuda.com',
      dept: 'Product Design', role: 'Lead UI/UX Designer', tl: 'Sneha Sen (Design Lead)',
      projects: 'HRMS Design System 2.0, Mobile App Redesign',
      tools: 'Figma, Adobe XD, Design Tokens',
      summary: 'Redesigned complete HRMS suite with modern design tokens resulting in 96% positive client feedback.',
      achievements: '• Delivered complete Design System 2.0 with 150+ interactive UI components.',
      rating: '4.8', certs: 'NN/g UX Master Certification',
      tlApproved: true, tlRating: '4.7', tlHike: '15%', tlPromo: 'Principal Product Designer',
      tlFeedback: 'Exceptional creativity and timely delivery of design tokens.',
      hrApproved: false, hrRating: '4.8', hrHike: '15%', hrPromo: 'Principal Product Designer', hrComments: '',
      mgrApproved: false, mgrRating: '4.9', mgrHike: '15%',
      mgrReply: 'Good! Exceptional leadership on Design System 2.0.',
    },
    DEEPIKA: {
      key: 'DEEPIKA', id: 'EMP-0102', name: 'Deepika Rao', email: 'deepika.r@gharuda.com',
      dept: 'Human Resources', role: 'Senior Talent Acquisition Lead', tl: 'Ananya Roy (HRBP)',
      projects: 'Campus Hiring Drive 2025, Lateral Tech Hiring',
      tools: 'LinkedIn Recruiter, Gharuda ATS',
      summary: 'Closed 65+ critical technical roles across product engineering.',
      achievements: '• Achieved 120% of annual recruitment targets.',
      rating: '4.8', certs: 'SHRM-CP Certified',
      tlApproved: true, tlRating: '4.9', tlHike: '16.5%', tlPromo: 'Promoted to Talent Partner',
      tlFeedback: 'Exceeded all recruiting KPIs.',
      hrApproved: true, hrRating: '4.9', hrHike: '16.5%', hrPromo: 'Promoted to Talent Partner',
      hrComments: 'Top recruiter across company branches.',
      mgrApproved: true, mgrRating: '5.0', mgrHike: '16.5%',
      mgrReply: 'Good! Outstanding hiring targets achieved. Exceeded all FY25 onboarding quotas by 120%. Exemplary dedication.',
    },
  };

  employeeOptions = [
    { value: 'ARUN', label: 'Arun Kumar (Senior Backend Engineer)' },
    { value: 'PRIYA', label: 'Priya Sharma (Lead UI/UX Designer)' },
    { value: 'DEEPIKA', label: 'Deepika Rao (Senior Talent Acquisition)' },
  ];

  currentEmpKey = 'ARUN';

  get data(): EmployeeAppraisal {
    return this.employeeDatabase[this.currentEmpKey];
  }

  get ledgerRows(): EmployeeAppraisal[] {
    return Object.values(this.employeeDatabase);
  }

  // =========================================================
  // PORTAL / TAB / STAGE STATE
  // =========================================================

  mainPortal: MainPortal = 'employee';
  adminSubtab: AdminSubtab = 'tl';
  activeEmpStage = 1;

  private stageTitles: Record<number, string> = {
    1: 'Stage 1: Employee Self-Appraisal Form',
    2: 'Stage 2: Team Lead (TL) Review & Rating Status',
    3: 'Stage 3: HR Department Policy & Increment Check Status',
    4: 'Stage 4: Executive Manager Final Decision & Reply Status',
    5: 'Stage 5: Official Performance Appraisal Scorecard',
  };

  private stageSubs: Record<number, string> = {
    1: 'Fill and submit your self-appraisal details below. The approval progress is shown in the lifecycle stepper above.',
    2: 'View the evaluation score, increment recommendation, and feedback from your Team Lead.',
    3: 'View HR policy verification, increment endorsement, and benchmark review.',
    4: "View the Executive Manager's final rating and personalized recognition reply message.",
    5: 'Official merit scorecard certificate awarded upon completion of all appraisal stages.',
  };

  get empHubTitle(): string {
    return this.stageTitles[this.activeEmpStage] ?? this.stageTitles[1];
  }

  get empHubSub(): string {
    return this.stageSubs[this.activeEmpStage] ?? this.stageSubs[1];
  }

  switchMainPortal(portal: MainPortal): void {
    this.mainPortal = portal;
  }

  switchEmpStage(stage: number): void {
    this.activeEmpStage = stage;
  }

  switchAdminSubtab(tab: AdminSubtab): void {
    this.adminSubtab = tab;
  }

  // step/connector state helpers (mirror updateEmployeePortalStatusTracker)
  stepClass(stage: number): string {
    const d = this.data;
    let cls = 'journey-step-item';

    if (stage === 1) cls += ' completed-pass';
    else if (stage === 2) cls += d.tlApproved ? ' completed-pass' : ' active';
    else if (stage === 3) cls += d.hrApproved ? ' completed-pass' : d.tlApproved ? ' active' : '';
    else if (stage === 4) cls += d.mgrApproved ? ' completed-pass' : d.hrApproved ? ' active' : '';
    else if (stage === 5) cls += d.mgrApproved ? ' completed-pass' : '';

    if (this.activeEmpStage === stage) cls += ' selected-step';
    return cls;
  }

  connectorActive(after: number): boolean {
    const d = this.data;
    if (after === 1) return d.tlApproved;
    if (after === 2) return d.hrApproved;
    if (after === 3) return d.mgrApproved;
    if (after === 4) return d.mgrApproved;
    return false;
  }

  stageSubtitle(stage: number): string {
    const d = this.data;
    if (stage === 1) return 'Form Submitted';
    if (stage === 2) return d.tlApproved ? `Approved (${d.tlRating})` : 'Pending Review';
    if (stage === 3) return d.hrApproved ? `Approved (${d.hrRating})` : d.tlApproved ? 'In Review' : 'Waiting for HR';
    if (stage === 4) return d.mgrApproved ? 'Approved & Replied' : d.hrApproved ? 'Pending Signoff' : 'Awaiting Manager';
    if (stage === 5) return d.mgrApproved ? 'Scorecard Ready' : 'Locked';
    return '';
  }

  get portalStatusLabel(): string {
    return this.data.mgrApproved ? 'Appraisal Completed' : 'In Progress';
  }

  // =========================================================
  // DRAFT FORMS  (editable copies — committed back to `data` on submit,
  // exactly like the PHP forms that only wrote back on submit/approve)
  // =========================================================

  selfDraft = { name: '', email: '', dept: '', role: '', tl: '', projects: '', tools: '', summary: '', achievements: '', rating: '', certs: '' };
  tlDraft = { rating: '', hike: '', promo: '', feedback: '' };
  hrDraft = { rating: '', hike: '', promo: '', comments: '' };
  mgrDraft = { rating: '', hike: '', reply: '' };

  constructor() {
    this.resetDrafts();
  }

  onProfileChange(key: string): void {
    this.currentEmpKey = key;
    this.resetDrafts();
  }

  private resetDrafts(): void {
    const d = this.data;

    this.selfDraft = {
      name: d.name, email: d.email, dept: d.dept, role: d.role, tl: d.tl,
      projects: d.projects, tools: d.tools, summary: d.summary,
      achievements: d.achievements, rating: d.rating, certs: d.certs,
    };
    this.tlDraft = { rating: d.tlRating || '4.6', hike: d.tlHike || '15%', promo: d.tlPromo || 'Promoted to Tech Lead', feedback: d.tlFeedback || '' };
    this.hrDraft = { rating: d.hrRating || '4.8', hike: d.hrHike || '15%', promo: d.hrPromo || 'Promoted to Tech Lead', comments: d.hrComments || '' };
    this.mgrDraft = { rating: d.mgrRating || '4.8', hike: d.mgrHike || '15%', reply: d.mgrReply || 'Good! Outstanding performance.' };
  }

  // =========================================================
  // EMPLOYEE SUBMIT
  // =========================================================

  submitEmpSelfReview(): void {
    const d = this.data;
    d.name = this.selfDraft.name;
    d.summary = this.selfDraft.summary;
    d.achievements = this.selfDraft.achievements;
    d.rating = this.selfDraft.rating;

    this.showToast('Submitted to Team Lead', 'Your self-appraisal has been sent to Team Lead in the Admin Portal.');
  }

  saveDraft(): void {
    this.showToast('Draft Saved', 'Your self-appraisal draft has been saved.');
  }

  // =========================================================
  // ADMIN APPROVAL DESKS
  // =========================================================

  processAdminTLApproval(): void {
    const d = this.data;
    d.tlApproved = true;
    d.tlRating = this.tlDraft.rating;
    d.tlHike = this.tlDraft.hike;
    d.tlPromo = this.tlDraft.promo;
    d.tlFeedback = this.tlDraft.feedback;

    this.showToast('TL Approved', 'Stage 2 approved by Team Lead. Forwarded to HR Approval Hub.');
    this.switchAdminSubtab('hr');
  }

  processAdminHRApproval(): void {
    const d = this.data;
    d.hrApproved = true;
    d.hrRating = this.hrDraft.rating;
    d.hrHike = this.hrDraft.hike;
    d.hrPromo = this.hrDraft.promo;
    d.hrComments = this.hrDraft.comments;

    this.showToast('HR Approved', `Stage 3 policy verified with ${d.hrHike} increment. Forwarded to Executive Manager.`);
    this.switchAdminSubtab('mgr');
  }

  processAdminManagerSignoff(): void {
    const d = this.data;
    d.mgrApproved = true;
    d.mgrRating = this.mgrDraft.rating;
    d.mgrHike = this.mgrDraft.hike;
    d.mgrReply = this.mgrDraft.reply;

    this.showToast('Manager Confirmed & Signed Off', `Appraisal completed with reply: "${d.mgrReply.substring(0, 30)}..."! Employee Portal updated.`);
    this.switchAdminSubtab('all');
  }

  setAdminMgrPreset(text: string): void {
    this.mgrDraft.reply = text;
  }

  // =========================================================
  // MASTER LEDGER
  // =========================================================

  ledgerStatus(row: EmployeeAppraisal): { label: string; cls: string } {
    if (row.mgrApproved) return { label: 'Completed', cls: 'bg-success-subtle text-success border-success' };
    if (row.hrApproved) return { label: 'Pending Manager', cls: 'bg-warning-subtle text-warning border-warning' };
    if (row.tlApproved) return { label: 'Pending HR', cls: 'bg-warning-subtle text-warning border-warning' };
    return { label: 'Pending TL', cls: 'bg-light text-muted border-secondary' };
  }

  ledgerAction(row: EmployeeAppraisal): void {
    this.currentEmpKey = row.key;
    this.resetDrafts();

    if (row.mgrApproved) {
      this.openScorecardModalFromEmp();
      return;
    }

    const nextTab: AdminSubtab = !row.tlApproved ? 'tl' : !row.hrApproved ? 'hr' : 'mgr';
    this.switchAdminSubtab(nextTab);
  }

  // =========================================================
  // SCORECARD MODAL
  // =========================================================

  scorecardModalOpen = false;

  openScorecardModalFromEmp(): void {
    this.scorecardModalOpen = true;
  }

  closeScorecardModal(): void {
    this.scorecardModalOpen = false;
  }

  openScorecardIfReady(): void {
    if (this.data.mgrApproved) {
      this.openScorecardModalFromEmp();
    } else {
      this.showToast('Scorecard Locked', 'The official scorecard certificate will unlock once the Executive Manager approves and signs off.');
    }
  }

  print(): void {
    window.print();
  }

  // =========================================================
  // LAUNCH NEW CYCLE MODAL  (app-reuse-modal)
  // =========================================================

  cycleFields: ModalField[] = [
    {
      key: 'frequency',
      label: 'Appraisal Frequency / Cadence',
      type: 'select',
      required: true,
      col: 6,
      defaultValue: 'quarterly',
      options: [
        { label: 'Quarterly (3 Months Once - Q1..Q4)', value: 'quarterly' },
        { label: 'Half-Yearly (6 Months Once)', value: 'half_yearly' },
        { label: 'Annual (Once a Year)', value: 'annual' },
      ],
    },
    {
      key: 'reviewPeriod',
      label: 'Review Period',
      type: 'select',
      required: true,
      col: 6,
      defaultValue: 'q3',
      options: [
        { label: 'Q1 (Apr-Jun 2026)', value: 'q1' },
        { label: 'Q2 (Jul-Sep 2026)', value: 'q2' },
        { label: 'Q3 (Oct-Dec 2026)', value: 'q3' },
        { label: 'Q4 (Jan-Mar 2027)', value: 'q4' },
      ],
    },
    {
      key: 'cycleTitle',
      label: 'Appraisal Cycle Title',
      type: 'text',
      required: true,
      col: 12,
      defaultValue: 'Q3 2026-27 Performance Appraisal Cycle',
    },
    {
      key: 'deptScope',
      label: 'Target Department Scope',
      type: 'select',
      required: true,
      col: 6,
      labelIcon: 'bi bi-building',
      defaultValue: 'all',
      options: [
        { label: 'All Company Departments', value: 'all' },
        { label: 'Engineering', value: 'engineering' },
        { label: 'Product Design', value: 'design' },
        { label: 'Human Resources', value: 'hr' },
        { label: 'Finance & Accounts', value: 'finance' },
      ],
    },
    {
      key: 'employeeScope',
      label: 'Select Employee',
      type: 'select',
      required: true,
      col: 6,
      labelIcon: 'bi bi-person-vcard',
      labelNote: '19 Employees',
      defaultValue: 'all',
      options: [
        { label: '– All Employees in Scope (19) –', value: 'all' },
        { label: 'Arun Kumar (Senior Backend Engineer)', value: 'ARUN' },
        { label: 'Priya Sharma (Lead UI/UX Designer)', value: 'PRIYA' },
        { label: 'Deepika Rao (Senior Talent Acquisition)', value: 'DEEPIKA' },
      ],
    },
    {
      key: 'selfReviewDue',
      label: 'Self-Review Due Date',
      type: 'date',
      col: 4,
      defaultValue: new Date(2026, 9, 31),
    },
    {
      key: 'tlHrDeadline',
      label: 'TL & HR Review Deadline',
      type: 'date',
      col: 4,
      defaultValue: new Date(2026, 10, 15),
    },
    {
      key: 'finalSignoffDeadline',
      label: 'Final Signoff Deadline',
      type: 'date',
      col: 4,
      defaultValue: new Date(2026, 10, 30),
    },
    {
      key: 'launchNote',
      type: 'info',
      label:
        'Launching this cycle will initiate the 5-stage workflow (Self-Review → TL → Manager Decision → HR Approval → Scorecard) across all selected employees.',
    },
  ];

  onCycleLaunched(event: ModalSaveEvent): void {
    const title = event.values['cycleTitle'] || 'New appraisal cycle';
    this.showToast('Cycle Launched', `"${title}" has been published to all employees in scope.`);
  }

  // =========================================================
  // TOAST
  // =========================================================

  toast: ToastState | null = null;
  private toastTimer: any;

  showToast(title: string, message: string): void {
    this.toast = { title, message };
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = null), 4000);
  }
}
