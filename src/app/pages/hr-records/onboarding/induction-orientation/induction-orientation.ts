import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PrimeDataTable } from '../../../../shared/primedatatable/primedatatable';
import { SelectModule } from 'primeng/select';

declare var bootstrap: any;

type SessionStatus = 'Scheduled' | 'Conducted' | 'Completed';
type Attendance = 'Present' | 'Pending' | 'Absent';

interface SessionRow {
  ref: string;
  empId: string;
  emp: string;
  email: string;
  phone: string;
  role: string;
  dept: string;
  program: string;
  title: string;
  trainer: string;
  mode: 'In-person' | 'Online' | 'Hybrid';
  venue: string;
  date: string; // yyyy-MM-dd
  time: string;
  notified: 'Yes' | 'No';
  conducted: 'Yes' | 'No';
  attendance: Attendance;
  materials: string;
  assessment: string;
  rating: string;
  feedback: string;
  status: SessionStatus;
  mandatory: 'Yes' | 'No';
}

interface ClearanceRow {
  branch: 'yes' | 'no';
  emp: string;
  empId: string;
  dept: string;
  role: string;
  modulesDone: number;
  modulesTotal: number;
  pending?: string;
  certDate?: string;
  score?: string;
}

@Component({
  selector: 'app-induction-orientation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimeDataTable, SelectModule, FormsModule, AppStatCard],
  templateUrl: './induction-orientation.html',
  styleUrl: './induction-orientation.scss',
})
export class InductionOrientation implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scheduleInductionModal') scheduleModalRef!: ElementRef<HTMLElement>;
  @ViewChild('sessionExecutionModal') execModalRef!: ElementRef<HTMLElement>;
  @ViewChild('sendInviteModal') inviteModalRef!: ElementRef<HTMLElement>;
  @ViewChild('inductionCertificateModal') certModalRef!: ElementRef<HTMLElement>;
  @ViewChild('pendingSessionsModal') pendingModalRef!: ElementRef<HTMLElement>;
  @ViewChild('viewSessionModal') viewModalRef!: ElementRef<HTMLElement>;
  @ViewChild('workflowHelpModal') helpModalRef!: ElementRef<HTMLElement>;

  private scheduleModal: any;
  private execModal: any;
  private inviteModal: any;
  private certModal: any;
  private pendingModal: any;
  private viewModal: any;
  private helpModal: any;

  activeTab: 'sessions' | 'clearance' = 'sessions';

  // ----- 11-step workflow stepper (static display data) -----
  workflowSteps = [
    { label: '1. Employee Selected', icon: 'bi-person-check', state: 'completed' },
    { label: '2. Program Assigned', icon: 'bi-journal-check', state: 'completed' },
    { label: '3. Sessions Scheduled', icon: 'bi-calendar-event', state: 'completed' },
    { label: '4. Employee Notified', icon: 'bi-bell', state: 'completed' },
    { label: '5. Session Conducted', icon: 'bi-easel', state: 'completed' },
    { label: '6. Attendance Captured', icon: 'bi-clipboard-check', state: 'active' },
    { label: '7. Materials Shared', icon: 'bi-file-earmark-text', state: '' },
    { label: '8. Assessment / Ack', icon: 'bi-patch-question', state: '' },
    { label: '9. Feedback Received', icon: 'bi-star', state: '' },
    { label: '10. Session Completed', icon: 'bi-check-circle', state: '' },
  ];

  // ----- KPIs -----
  kpis = { totalJoiners: 18, scheduled: 7, pendingBranch: 6, certifiedBranch: 12 };

  // ----- dropdown option sources (feed pselect / native select) -----
  stageOptions = [
    { value: 'all', label: 'All Stages' },
    { value: 'Scheduled', label: '3. Scheduled (Upcoming)' },
    { value: 'Notified', label: '4. Notified (Email/WhatsApp)' },
    { value: 'Conducted', label: '5 & 6. Conducted & Attendance' },
    { value: 'Completed', label: '10. Completed & Cleared' },
  ];
  moduleOptions = [
    { value: 'all', label: 'All Programs' },
    { value: 'General Company Induction', label: 'General Company Induction' },
    { value: 'Department & Role Orientation', label: 'Department & Role Orientation' },
    { value: 'IT & Data Security Setup', label: 'IT & Data Security Setup' },
    { value: 'HR Policies & Code of Conduct', label: 'HR Policies & Code of Conduct' },
  ];
  attendanceFilterOptions = [
    { value: 'all', label: 'All Attendance' },
    { value: 'Present', label: 'Present' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Absent', label: 'Absent / Reschedule' },
  ];
  deptOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Design', label: 'Design' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'HR', label: 'HR' },
    { value: 'Operations', label: 'Operations' },
  ];
  clearanceStatusOptions = [
    { value: 'all', label: 'All Employees' },
    { value: 'no', label: '❌ Branch: No (Pending Mandatory Sessions)' },
    { value: 'yes', label: '✅ Branch: Yes (Induction Fully Certified)' },
  ];

  employees = [
    {
      name: 'Kavitha Raman',
      empId: 'EMP-2026-041',
      dept: 'Design',
      role: 'UI/UX Designer',
      email: 'kavitha.raman@gharudahr.com',
      phone: '+91 98401 23456',
    },
    {
      name: 'Rajesh Kannan',
      empId: 'EMP-2026-042',
      dept: 'Engineering',
      role: 'Senior Fullstack Engineer',
      email: 'rajesh.k@gharudahr.com',
      phone: '+91 98842 67890',
    },
    {
      name: 'Ananya Sen',
      empId: 'EMP-2026-043',
      dept: 'Finance',
      role: 'Financial Analyst',
      email: 'ananya.sen@gharudahr.com',
      phone: '+91 97908 11223',
    },
    {
      name: 'Mohammed Farhan',
      empId: 'EMP-2026-044',
      dept: 'Marketing',
      role: 'Digital Marketing Lead',
      email: 'm.farhan@gharudahr.com',
      phone: '+91 99403 55678',
    },
    {
      name: 'Deepak Verma',
      empId: 'EMP-2026-045',
      dept: 'HR',
      role: 'HR Recruiter',
      email: 'deepak.v@gharudahr.com',
      phone: '+91 98410 99887',
    },
  ];

  programOptions = [
    {
      value: 'General Company Induction',
      label: 'General Induction (Vision, Culture, Founders & Org Chart)',
    },
    {
      value: 'Department & Role Orientation',
      label: 'Department Orientation (Role KPIs, Tools & Tech Stack)',
    },
    {
      value: 'IT & Data Security Setup',
      label: 'IT & Security Orientation (VPN, MFA & InfoSec Policies)',
    },
    {
      value: 'HR Policies & Code of Conduct',
      label: 'HR Policies & Compliance (POSH, Leaves & Ethics Code)',
    },
  ];
  modeOptions = [
    { value: 'In-person', label: 'In-person' },
    { value: 'Online', label: 'Online (Google Meet / Zoom)' },
    { value: 'Hybrid', label: 'Hybrid' },
  ];
  conductedOptions = [
    { value: 'Yes', label: 'Yes - Session Successfully Conducted' },
    { value: 'In Progress', label: 'In Progress (Currently Happening)' },
    { value: 'No', label: 'No - Scheduled Upcoming' },
    { value: 'Rescheduled', label: 'Rescheduled / Cancelled' },
  ];
  attendanceExecOptions = [
    { value: 'Present', label: '✅ Present (Participated in Full)' },
    { value: 'Pending', label: '⏳ Pending' },
    { value: 'Absent', label: '❌ Absent / Unexcused' },
  ];
  assessmentOptions = [
    { value: 'Passed (100%)', label: 'Passed (100% Score)' },
    { value: 'Passed (95%)', label: 'Passed (95% Score)' },
    { value: 'Passed (90%)', label: 'Passed (90% Score)' },
    { value: 'Passed (80%)', label: 'Passed (80% Score)' },
    { value: 'Digital Sign-off Completed', label: 'Digital Sign-off Completed' },
    { value: 'Pending Sign-off', label: 'Pending Sign-off / Test' },
  ];
  ratingOptions = [
    { value: '5.0', label: '⭐⭐⭐⭐⭐ 5.0 / 5.0 (Excellent)' },
    { value: '4.8', label: '⭐⭐⭐⭐⭐ 4.8 / 5.0 (Very Good)' },
    { value: '4.0', label: '⭐⭐⭐⭐ 4.0 / 5.0 (Good)' },
    { value: '3.0', label: '⭐⭐⭐ 3.0 / 5.0 (Average)' },
    { value: 'Unrated', label: 'Unrated' },
  ];
  execStatusOptions = [
    { value: 'Completed', label: 'Completed (Signed Off)' },
    { value: 'Conducted', label: 'Conducted (Assessment In Review)' },
    { value: 'Scheduled', label: 'Scheduled (Upcoming)' },
  ];

  // ----- table config -----
  // NOTE: same "custom cell type" shape used in asset-provisioning; align field
  // names with the real PrimeTableColumn type if it differs.
  columns = [
    { field: 'sno', header: 'S.No', sortable: false, width: '60px' },
    {
      field: 'emp',
      header: '1. Employee Selected',
      sortable: true,
      type: 'avatarText',
      subField: 'empSub',
    },
    {
      field: 'title',
      header: '2. Program Assigned',
      sortable: true,
      type: 'titleSub',
      subField: 'program',
    },
    {
      field: 'date',
      header: '3. Schedule & Mode',
      sortable: true,
      type: 'dateBy',
      dateField: 'dateDisplay',
      byField: 'timeVenue',
    },
    {
      field: 'notified',
      header: '4. Notified',
      sortable: false,
      type: 'badgeText',
      displayField: 'notifiedDisplay',
    },
    {
      field: 'conducted',
      header: '5 & 6. Conduct & Attendance',
      sortable: false,
      type: 'badgeText',
      displayField: 'conductDisplay',
    },
    {
      field: 'materials',
      header: '7. Materials',
      sortable: false,
      type: 'badgeText',
      displayField: 'materialsDisplay',
    },
    {
      field: 'assessment',
      header: '8 & 9. Assessment & Feedback',
      sortable: false,
      type: 'badgeText',
      displayField: 'assessmentDisplay',
    },
    {
      field: 'status',
      header: '10. Status',
      sortable: true,
      type: 'badgeText',
      displayField: 'status',
    },

    // ---------------------------------------------------------
    // ACTION COLUMN — icon-only pill buttons (send / edit / view),
    // each tinted with its own color to match the design. Buttons
    // live on the column itself; the table renders them and fires
    // (actionClick) with { action: key, row } — same as before.
    // ---------------------------------------------------------
    {
      field: 'actions',
      header: 'Action',
      type: 'pill-actions',
      width: '120px',
      buttons: [
        {
          key: 'invite',
          icon: 'bi bi-send-fill',
          variant: 'outline' as const,
          color: 'var(--primary)',
          tooltip: 'Send Invitation Link & Access',
        },
        {
          key: 'execute',
          icon: 'bi bi-pencil-square',
          variant: 'outline' as const,
          color: 'var(--accent-blue)',
          tooltip: 'Execute & Update Workflow',
        },
        {
          key: 'view',
          icon: 'bi bi-eye',
          variant: 'outline' as const,
          color: 'var(--text-light)',
          tooltip: 'View Full Details',
        },
      ],
    },
  ];

  accessActions = {
    add: false,
    edit: false,
    delete: false,
  };

  sessions: SessionRow[] = [];
  tableData: any[] = [];
  clearance: ClearanceRow[] = [];
  clearanceDisplay: ClearanceRow[] = [];

  // ----- reactive forms -----
  filterForm!: FormGroup;
  scheduleForm!: FormGroup;
  execForm!: FormGroup;
  inviteForm!: FormGroup;

  currentExecRow: SessionRow | null = null;
  currentInviteRow: SessionRow | null = null;

  viewData: any = null;
  certData: any = null;
  pendingData: { emp: string; items: string[] } = { emp: '', items: [] };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForms();
    this.loadData();
    this.applyFilters();
  }

  ngAfterViewInit(): void {
    // Bootstrap places the backdrop under <body>. If the modal stays inside
    // a parent that has transform/overflow/z-index, the backdrop can appear
    // while the modal itself remains hidden behind that parent.
    // Move every modal directly under <body> before initializing Bootstrap.
    this.moveModalToBody(this.scheduleModalRef);
    this.moveModalToBody(this.execModalRef);
    this.moveModalToBody(this.inviteModalRef);
    this.moveModalToBody(this.certModalRef);
    this.moveModalToBody(this.pendingModalRef);
    this.moveModalToBody(this.viewModalRef);
    this.moveModalToBody(this.helpModalRef);

    if (typeof bootstrap === 'undefined' || !bootstrap.Modal) {
      console.error('Bootstrap Modal is not available. Make sure Bootstrap JS is loaded.');
      return;
    }

    this.scheduleModal = bootstrap.Modal.getOrCreateInstance(this.scheduleModalRef.nativeElement, {
      backdrop: true,
      keyboard: true,
      focus: true,
    });
    this.execModal = bootstrap.Modal.getOrCreateInstance(this.execModalRef.nativeElement, {
      backdrop: true,
      keyboard: true,
      focus: true,
    });
    this.inviteModal = bootstrap.Modal.getOrCreateInstance(this.inviteModalRef.nativeElement, {
      backdrop: true,
      keyboard: true,
      focus: true,
    });
    this.certModal = bootstrap.Modal.getOrCreateInstance(this.certModalRef.nativeElement, {
      backdrop: true,
      keyboard: true,
      focus: true,
    });
    this.pendingModal = bootstrap.Modal.getOrCreateInstance(this.pendingModalRef.nativeElement, {
      backdrop: true,
      keyboard: true,
      focus: true,
    });
    this.viewModal = bootstrap.Modal.getOrCreateInstance(this.viewModalRef.nativeElement, {
      backdrop: true,
      keyboard: true,
      focus: true,
    });
    this.helpModal = bootstrap.Modal.getOrCreateInstance(this.helpModalRef.nativeElement, {
      backdrop: true,
      keyboard: true,
      focus: true,
    });
  }

  private moveModalToBody(modalRef: ElementRef<HTMLElement>): void {
    const modalElement = modalRef?.nativeElement;
    if (!modalElement) {
      console.error('Modal element was not found.');
      return;
    }

    if (modalElement.parentElement !== document.body) {
      document.body.appendChild(modalElement);
    }
  }

  private openBootstrapModal(modal: any): void {
    if (!modal) {
      console.error('Bootstrap modal instance is not initialized.');
      return;
    }

    modal.show();
  }

  ngOnDestroy(): void {
    this.scheduleModal?.dispose();
    this.execModal?.dispose();
    this.inviteModal?.dispose();
    this.certModal?.dispose();
    this.pendingModal?.dispose();
    this.viewModal?.dispose();
    this.helpModal?.dispose();

    this.scheduleModalRef?.nativeElement.remove();
    this.execModalRef?.nativeElement.remove();
    this.inviteModalRef?.nativeElement.remove();
    this.certModalRef?.nativeElement.remove();
    this.pendingModalRef?.nativeElement.remove();
    this.viewModalRef?.nativeElement.remove();
    this.helpModalRef?.nativeElement.remove();
  }

  private buildForms(): void {
    this.filterForm = this.fb.group({
      stage: ['all'],
      module: ['all'],
      attendance: ['all'],
      department: ['all'],
      search: [''],
    });
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());

    this.scheduleForm = this.fb.group({
      empKey: ['', Validators.required],
      program: ['Department & Role Orientation', Validators.required],
      title: ['', Validators.required],
      trainer: ['', Validators.required],
      date: [this.todayIso(), Validators.required],
      time: ['11:30 AM - 12:30 PM', Validators.required],
      mode: ['In-person'],
      venue: ['Design Studio 2'],
      notifyWhatsApp: [true],
      notifyEmail: [true],
    });

    this.execForm = this.fb.group({
      conducted: ['No'],
      attendance: ['Pending'],
      materials: [''],
      assessment: ['Digital Sign-off Completed'],
      rating: ['5.0'],
      feedback: [''],
      status: ['Scheduled' as SessionStatus],
      completedBy: ['HR Manager (Priya Sharma)'],
    });

    this.inviteForm = this.fb.group({
      phone: [''],
      email: [''],
      sendWhatsApp: [true],
      sendEmail: [true],
      attachIcs: [true],
      ccManager: [true],
      customMessage: [
        'Welcome to Gharuda! Please join 5 minutes prior to the session. You can review the attached orientation pack beforehand.',
      ],
    });
  }

  private todayIso(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private formatDateForDisplay(str: string): string {
    if (!str) return 'N/A';
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
  }

  private loadData(): void {
    this.sessions = [
      {
        ref: 'SES-2026-101',
        empId: 'EMP-2026-041',
        emp: 'Kavitha Raman',
        email: 'kavitha.raman@gharudahr.com',
        phone: '+91 98401 23456',
        role: 'UI/UX Designer',
        dept: 'Design',
        program: 'Department & Role Orientation',
        title: 'Design System & UX Framework Walkthrough',
        trainer: 'Amelia Curr (Design Lead)',
        mode: 'In-person',
        venue: 'Design Studio 2',
        date: '2026-09-18',
        time: '11:30 AM - 12:30 PM',
        notified: 'Yes',
        conducted: 'No',
        attendance: 'Pending',
        materials: 'Design_System_v2.pdf, Figma_Handbook.pdf',
        assessment: 'Pending',
        rating: 'Unrated',
        feedback: '',
        status: 'Scheduled',
        mandatory: 'Yes',
      },
      {
        ref: 'SES-2026-102',
        empId: 'EMP-2026-041',
        emp: 'Kavitha Raman',
        email: 'kavitha.raman@gharudahr.com',
        phone: '+91 98401 23456',
        role: 'UI/UX Designer',
        dept: 'Design',
        program: 'General Company Induction',
        title: 'Vision, Culture, Founders & Org Chart',
        trainer: 'Priya Sharma (HR Manager)',
        mode: 'In-person',
        venue: 'Auditorium - Level 3',
        date: '2026-09-12',
        time: '10:00 AM - 12:00 PM',
        notified: 'Yes',
        conducted: 'Yes',
        attendance: 'Present',
        materials: 'Employee_Handbook_2026.pdf, Culture_Code.pdf',
        assessment: 'Passed (96%)',
        rating: '5.0',
        feedback: 'Great interactive session, very clear company vision!',
        status: 'Completed',
        mandatory: 'Yes',
      },
      {
        ref: 'SES-2026-103',
        empId: 'EMP-2026-042',
        emp: 'Rajesh Kannan',
        email: 'rajesh.k@gharudahr.com',
        phone: '+91 98842 67890',
        role: 'Senior Fullstack Engineer',
        dept: 'Engineering',
        program: 'IT & Data Security Setup',
        title: 'Data Privacy, VPN, MFA & Security Protocol',
        trainer: 'Karthik V (InfoSec Lead)',
        mode: 'Online',
        venue: 'Google Meet (meet.google.com/xyz-sec)',
        date: '2026-09-14',
        time: '02:30 PM - 04:00 PM',
        notified: 'Yes',
        conducted: 'Yes',
        attendance: 'Present',
        materials: 'InfoSec_Policy_v4.pdf, VPN_Setup_Guide.pdf',
        assessment: 'Passed (100%)',
        rating: '4.8',
        feedback: 'Setup completed smoothly. Hardware keys enrolled.',
        status: 'Completed',
        mandatory: 'Yes',
      },
      {
        ref: 'SES-2026-104',
        empId: 'EMP-2026-043',
        emp: 'Ananya Sen',
        email: 'ananya.sen@gharudahr.com',
        phone: '+91 97908 11223',
        role: 'Financial Analyst',
        dept: 'Finance',
        program: 'HR Policies & Code of Conduct',
        title: 'Leave Policy, POSH, Code of Ethics & Appraisal',
        trainer: 'Priya Sharma (HR Manager)',
        mode: 'In-person',
        venue: 'Conference Room A',
        date: '2026-09-16',
        time: '03:00 PM - 04:30 PM',
        notified: 'Yes',
        conducted: 'Yes',
        attendance: 'Present',
        materials: 'HR_Policy_Manual.pdf, POSH_Policy.pdf',
        assessment: 'Pending Sign-off',
        rating: 'Unrated',
        feedback: '',
        status: 'Conducted',
        mandatory: 'Yes',
      },
      {
        ref: 'SES-2026-105',
        empId: 'EMP-2026-044',
        emp: 'Mohammed Farhan',
        email: 'm.farhan@gharudahr.com',
        phone: '+91 99403 55678',
        role: 'Digital Marketing Lead',
        dept: 'Marketing',
        program: 'Department & Role Orientation',
        title: 'Campaigns, SEO Stack & Agency Handoff',
        trainer: 'Sneha Roy (VP Marketing)',
        mode: 'Hybrid',
        venue: 'Room 4 & Zoom',
        date: '2026-09-15',
        time: '11:00 AM - 12:30 PM',
        notified: 'Yes',
        conducted: 'Yes',
        attendance: 'Absent',
        materials: 'Marketing_Playbook.pdf',
        assessment: 'Pending',
        rating: 'Unrated',
        feedback: 'Employee was unwell; session to be rescheduled.',
        status: 'Scheduled',
        mandatory: 'Yes',
      },
      {
        ref: 'SES-2026-106',
        empId: 'EMP-2026-042',
        emp: 'Rajesh Kannan',
        email: 'rajesh.k@gharudahr.com',
        phone: '+91 98842 67890',
        role: 'Senior Fullstack Engineer',
        dept: 'Engineering',
        program: 'General Company Induction',
        title: 'Vision, Culture, Founders & Org Chart',
        trainer: 'Priya Sharma (HR Manager)',
        mode: 'In-person',
        venue: 'Auditorium - Level 3',
        date: '2026-09-12',
        time: '10:00 AM - 12:00 PM',
        notified: 'Yes',
        conducted: 'Yes',
        attendance: 'Present',
        materials: 'Employee_Handbook_2026.pdf',
        assessment: 'Passed (98%)',
        rating: '5.0',
        feedback: 'Inspiring introductory session.',
        status: 'Completed',
        mandatory: 'Yes',
      },
      {
        ref: 'SES-2026-107',
        empId: 'EMP-2026-042',
        emp: 'Rajesh Kannan',
        email: 'rajesh.k@gharudahr.com',
        phone: '+91 98842 67890',
        role: 'Senior Fullstack Engineer',
        dept: 'Engineering',
        program: 'Department & Role Orientation',
        title: 'Code Architecture, CI/CD Pipeline & GitHub Repos',
        trainer: 'Sundar Pichai V (Tech Director)',
        mode: 'In-person',
        venue: 'Tech Lab 1',
        date: '2026-09-13',
        time: '03:00 PM - 05:00 PM',
        notified: 'Yes',
        conducted: 'Yes',
        attendance: 'Present',
        materials: 'Architecture_Blueprint.pdf, GitFlow_Cheatsheet.pdf',
        assessment: 'Passed (95%)',
        rating: '5.0',
        feedback: 'Clear onboarding repo and local dev container instructions.',
        status: 'Completed',
        mandatory: 'Yes',
      },
      {
        ref: 'SES-2026-108',
        empId: 'EMP-2026-042',
        emp: 'Rajesh Kannan',
        email: 'rajesh.k@gharudahr.com',
        phone: '+91 98842 67890',
        role: 'Senior Fullstack Engineer',
        dept: 'Engineering',
        program: 'HR Policies & Code of Conduct',
        title: 'Leave Policy, POSH, Code of Ethics & Appraisal',
        trainer: 'Priya Sharma (HR Manager)',
        mode: 'In-person',
        venue: 'Conference Room A',
        date: '2026-09-14',
        time: '11:00 AM - 12:30 PM',
        notified: 'Yes',
        conducted: 'Yes',
        attendance: 'Present',
        materials: 'HR_Policy_Manual.pdf, POSH_Policy.pdf',
        assessment: 'Passed (94%)',
        rating: '4.8',
        feedback: 'All statutory policies understood and acknowledged.',
        status: 'Completed',
        mandatory: 'Yes',
      },
    ];

    this.clearance = [
      {
        branch: 'yes',
        emp: 'Rajesh Kannan',
        empId: 'EMP-2026-042',
        dept: 'Engineering',
        role: 'Senior Fullstack Engineer',
        modulesDone: 4,
        modulesTotal: 4,
        certDate: '14-Sep-2026',
        score: '96.7%',
      },
      {
        branch: 'no',
        emp: 'Kavitha Raman',
        empId: 'EMP-2026-041',
        dept: 'Design',
        role: 'UI/UX Designer',
        modulesDone: 1,
        modulesTotal: 4,
        pending:
          'Design System Walkthrough (Scheduled 18-Sep), IT Security Setup (Unscheduled), HR Policies & Code of Conduct (Unscheduled)',
      },
      {
        branch: 'no',
        emp: 'Ananya Sen',
        empId: 'EMP-2026-043',
        dept: 'Finance',
        role: 'Financial Analyst',
        modulesDone: 2,
        modulesTotal: 4,
        pending: 'HR Policies Acknowledgement & Quiz, Finance ERP & Ledger Walkthrough',
      },
      {
        branch: 'no',
        emp: 'Mohammed Farhan',
        empId: 'EMP-2026-044',
        dept: 'Marketing',
        role: 'Digital Marketing Lead',
        modulesDone: 1,
        modulesTotal: 4,
        pending:
          'Dept Campaign Handoff (Absent - Re-schedule Needed), IT Security Setup, HR Policies & Code of Conduct',
      },
    ];
    this.clearanceDisplay = this.clearance;
  }

  // ----- filtering -----
  applyFilters(): void {
    const f = this.filterForm.value;
    let filtered = this.sessions;

    if (f.stage !== 'all') {
      if (f.stage === 'Scheduled') filtered = filtered.filter((s) => s.status === 'Scheduled');
      if (f.stage === 'Notified') filtered = filtered.filter((s) => s.notified === 'Yes');
      if (f.stage === 'Conducted') filtered = filtered.filter((s) => s.conducted === 'Yes');
      if (f.stage === 'Completed') filtered = filtered.filter((s) => s.status === 'Completed');
    }
    if (f.module !== 'all') filtered = filtered.filter((s) => s.program === f.module);
    if (f.attendance !== 'all') filtered = filtered.filter((s) => s.attendance === f.attendance);
    if (f.department !== 'all') filtered = filtered.filter((s) => s.dept === f.department);
    if (f.search) {
      const q = f.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.emp.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.trainer.toLowerCase().includes(q),
      );
    }

    this.tableData = filtered.map((s, idx) => ({
      ...s,
      sno: idx + 1,
      empSub: `${s.empId} • ${s.dept}`,
      dateDisplay: this.formatDateForDisplay(s.date),
      timeVenue: `${s.time} • ${s.venue}`,
      notifiedDisplay: s.notified === 'Yes' ? 'Notified' : 'Not Notified',
      conductDisplay:
        s.conducted === 'Yes' ? `Conducted • ${s.attendance}` : `Upcoming • ${s.attendance}`,
      materialsDisplay: s.materials ? `${s.materials.split(',').length} Files` : 'None',
      assessmentDisplay: `${s.assessment} ${s.rating !== 'Unrated' ? '• ' + s.rating : ''}`,
    }));
  }

  resetFilters(): void {
    this.filterForm.reset({
      stage: 'all',
      module: 'all',
      attendance: 'all',
      department: 'all',
      search: '',
    });
  }

  get activeFilterLabel(): string {
    const f = this.filterForm.value;
    const parts: string[] = [];
    if (f.stage !== 'all')
      parts.push(this.stageOptions.find((o) => o.value === f.stage)?.label || f.stage);
    if (f.module !== 'all') parts.push(f.module);
    if (f.attendance !== 'all') parts.push('Attendance: ' + f.attendance);
    if (f.department !== 'all') parts.push(f.department);
    return parts.length ? parts.join(' • ') : 'All Sessions';
  }

  filterClearance(): void {
    // bound to clearanceStatus control below (kept separate from session filterForm)
  }

  clearanceStatus = 'all';
  onClearanceStatusChange(val: string): void {
    this.clearanceStatus = val;
    this.clearanceDisplay =
      val === 'all' ? this.clearance : this.clearance.filter((c) => c.branch === val);
  }

  selectTab(tab: 'sessions' | 'clearance'): void {
    this.activeTab = tab;
  }

  // ----- table action bridge (adjust to real emitted shape) -----
  onTableAction(event: any): void {
    const action = event.action ?? event.key;
    const row: SessionRow = this.sessions.find((s) => s.ref === event.row?.ref) || event.row;
    if (action === 'invite') this.openInviteModal(row);
    if (action === 'execute') this.openExecModal(row);
    if (action === 'view') this.openViewModal(row);
  }

  // ----- Schedule modal (Steps 1-4) -----
  openScheduleModal(): void {
    this.scheduleForm.reset({
      empKey: '',
      program: 'Department & Role Orientation',
      title: '',
      trainer: '',
      date: this.todayIso(),
      time: '11:30 AM - 12:30 PM',
      mode: 'In-person',
      venue: 'Design Studio 2',
      notifyWhatsApp: true,
      notifyEmail: true,
    });
    this.openBootstrapModal(this.scheduleModal);
  }

  submitSchedule(): void {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      alert(
        'Please fill in all required fields (Employee, Program, Title, Trainer, Date and Time).',
      );
      return;
    }
    const v = this.scheduleForm.value;
    const emp = this.employees.find((e) => e.name === v.empKey) || this.employees[0];
    const notifyChannel =
      v.notifyWhatsApp && v.notifyEmail
        ? 'WhatsApp & Email'
        : v.notifyWhatsApp
          ? 'WhatsApp'
          : 'Email';

    const newRow: SessionRow = {
      ref: `SES-2026-${100 + this.sessions.length + 1}`,
      empId: emp.empId,
      emp: emp.name,
      email: emp.email,
      phone: emp.phone,
      role: emp.role,
      dept: emp.dept,
      program: v.program,
      title: v.title,
      trainer: v.trainer,
      mode: v.mode,
      venue: v.venue,
      date: v.date,
      time: v.time,
      notified: 'Yes',
      conducted: 'No',
      attendance: 'Pending',
      materials: 'Onboarding_Handbook.pdf',
      assessment: 'Pending',
      rating: 'Unrated',
      feedback: '',
      status: 'Scheduled',
      mandatory: 'Yes',
    };

    this.sessions.unshift(newRow);
    this.applyFilters();
    this.scheduleModal?.hide();
    alert(`Session scheduled & invites dispatched to ${emp.name} via ${notifyChannel}!`);
  }

  // ----- Execution modal (Steps 5-10) -----
  openExecModal(row: SessionRow): void {
    this.currentExecRow = row;
    this.execForm.reset({
      conducted: row.conducted === 'Yes' ? 'Yes' : 'No',
      attendance: row.attendance,
      materials: row.materials,
      assessment: row.assessment || 'Digital Sign-off Completed',
      rating: row.rating || '5.0',
      feedback: row.feedback,
      status: row.status,
      completedBy: 'HR Manager (Priya Sharma)',
    });
    this.openBootstrapModal(this.execModal);
  }

  saveExecution(): void {
    if (!this.currentExecRow) return;
    const v = this.execForm.value;
    Object.assign(this.currentExecRow, {
      conducted: v.conducted === 'Yes' ? 'Yes' : 'No',
      attendance: v.attendance,
      materials: v.materials,
      assessment: v.assessment,
      rating: v.rating,
      feedback: v.feedback,
      status: v.status,
    });
    this.applyFilters();
    this.execModal?.hide();
  }

  // ----- View session modal -----
  openViewModal(row: SessionRow): void {
    this.viewData = {
      ...row,
      dateDisplay: `${this.formatDateForDisplay(row.date)} (${row.time})`,
    };
    this.openBootstrapModal(this.viewModal);
  }

  // ----- Send Invite modal -----
  openInviteModal(row?: SessionRow): void {
    const target = row || this.sessions[0];
    this.currentInviteRow = target;
    this.inviteForm.patchValue({
      phone: target.phone,
      email: target.email,
      sendWhatsApp: true,
      sendEmail: true,
      attachIcs: true,
      ccManager: true,
    });
    this.openBootstrapModal(this.inviteModal);
  }

  get inviteJoinLink(): string {
    if (!this.currentInviteRow) return '';
    const r = this.currentInviteRow;
    const token =
      'IND_' +
      Math.abs(
        (r.ref + r.empId).split('').reduce((a, c) => (a << 5) - a + c.charCodeAt(0), 0),
      ).toString(16);
    return `https://hrms.gharuda.com/induction/join?session=${encodeURIComponent(r.ref)}&token=${token}&emp=${encodeURIComponent(r.empId)}`;
  }

  copyInviteLink(): void {
    navigator.clipboard?.writeText(this.inviteJoinLink);
    alert('Joining link copied to clipboard!');
  }

  copyInviteMessage(): void {
    if (!this.currentInviteRow) return;
    const r = this.currentInviteRow;
    const v = this.inviteForm.value;
    const msg = `Induction & Orientation Invitation - Gharuda HRMS\n\nHello ${r.emp},\n\nTopic: ${r.title}\nDate: ${this.formatDateForDisplay(r.date)}\nTime: ${r.time}\nVenue: ${r.venue}\nTrainer: ${r.trainer}\n\nAccess Link: ${this.inviteJoinLink}\n\n${v.customMessage ? 'Note: ' + v.customMessage + '\n\n' : ''}Best regards,\nHR Operations Team | Gharuda`;
    navigator.clipboard?.writeText(msg);
    alert('Complete invitation text copied to clipboard!');
  }

  sendViaWhatsApp(): void {
    if (!this.currentInviteRow) return;
    const r = this.currentInviteRow;
    const phone = (this.inviteForm.value.phone || '').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${r.emp},\n\nYou are scheduled for your Induction Session: ${r.title} on ${this.formatDateForDisplay(r.date)} at ${r.time} (${r.venue}).\n\nAccess link:\n${this.inviteJoinLink}\n\n- Gharuda HRMS`,
    );
    const url = phone
      ? `https://wa.me/${phone}?text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, '_blank');
  }

  dispatchAllInvites(): void {
    if (!this.currentInviteRow) return;
    const v = this.inviteForm.value;
    this.currentInviteRow.notified = 'Yes';
    this.applyFilters();
    this.inviteModal?.hide();
    const channels = [v.sendEmail ? `Email (${v.email})` : null, v.sendWhatsApp ? 'WhatsApp' : null]
      .filter(Boolean)
      .join(' & ');
    alert(
      `Official Induction Invites successfully dispatched to ${this.currentInviteRow.emp} via ${channels}!`,
    );
  }

  // ----- Step 11: certificate / pending sessions -----
  openCertificate(row: ClearanceRow): void {
    this.certData = row;
    this.openBootstrapModal(this.certModal);
  }

  openPendingSessions(row: ClearanceRow): void {
    this.pendingData = {
      emp: row.emp,
      items: (row.pending || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    this.openBootstrapModal(this.pendingModal);
  }

  openScheduleFromPending(): void {
    this.pendingModal?.hide();
    this.openScheduleModal();
  }

  openHelpModal(): void {
    this.openBootstrapModal(this.helpModal);
  }

  printReport(): void {
    window.print();
  }

  downloadCertificate(): void {
    alert('Downloading high-resolution Clearance Certificate (PDF)...');
  }

  exportSessions(): void {
    alert('Exporting official Induction & Orientation Lifecycle Report (.xlsx)...');
  }
}
