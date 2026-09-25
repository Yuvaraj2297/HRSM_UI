import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableRowAction,
} from '../../../../shared/primedatatable/primedatatable';

import {
  ReuseModal,
  ModalField,
  ModalSaveEvent,
} from '../../../../shared/reuse-model/reuse-model';

// =============================================================
// TYPES
// =============================================================
export type TLRecommendation = 'Strong Hire' | 'Hire' | 'Hold' | 'Reject';

export type EvaluationStatus =
  | 'Pending TL Evaluation'
  | 'Evaluated - Sent to HR'
  | 'HR Approved for Offer';

export interface CandidateEvaluation {
  eval_id: string;
  candidate_id: string;
  candidate_name: string;
  job_title: string;
  source: string;
  assigned_tl: string;
  tl_role: string;
  department: string;
  round: string;
  tech_score: number;
  practical_score: number;
  culture_score: number;
  overall_score: number;
  recommendation: TLRecommendation;
  status: EvaluationStatus;
  tl_comments: string;
  assigned_date: string;
  evaluated_date: string;
  hr_action: string;
}

type TabKey = 'all' | 'pending_tl' | 'sent_hr' | 'hr_approved';

const STORAGE_KEY = 'candidate_evaluations_v1';

@Component({
  selector: 'app-tl-evaluation-scores',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeDataTable, ReuseModal],
  templateUrl: './tl-evaluation-scores.html',
  styleUrl: './tl-evaluation-scores.scss',
})
export class TlEvaluationScores {
  @ViewChild('assignModal') assignModal!: ReuseModal;
  @ViewChild('scoreModal') scoreModal!: ReuseModal;

  // =========================================================
  // DATA
  // =========================================================
  evaluations: CandidateEvaluation[] = [];
  currentFilter: TabKey = 'all';

  departments: string[] = [
    'Frontend Engineering Team',
    'Backend Engineering Team',
    'UI/UX Design Team',
    'Mobile / iOS Engineering Team',
    'Marketing & PPC Team',
    'HR & Talent Acquisition Team',
    'Finance & Accounts Team',
  ];

  teamLeadMap: Record<string, string[]> = {
    'Frontend Engineering Team': [
      'Santhosh Kumar (Frontend Tech Lead)',
      'Anand (Senior Frontend Lead)',
    ],
    'Backend Engineering Team': [
      'Karthik V (Backend Tech Lead)',
      'Ramesh (Principal Backend Architect)',
    ],
    'UI/UX Design Team': [
      'Deepak (Lead UI/UX Designer)',
      'Ananya S (Senior Design Lead)',
    ],
    'Mobile / iOS Engineering Team': [
      'Anitha R (iOS Mobile Tech Lead)',
      'Priya (Mobile Lead)',
    ],
    'Marketing & PPC Team': [
      'Priya S (Performance Marketing Lead)',
      'Vikram (Growth Lead)',
    ],
    'HR & Talent Acquisition Team': [
      'Meena S (HR Operations Lead)',
      'Kavitha (Talent Lead)',
    ],
    'Finance & Accounts Team': ['Suresh Kumar (Finance Manager)'],
  };

  candidates = [
    { id: 'LNK-2026-001', name: 'Ananya Sundaram', job: 'Senior UI/UX Designer', source: 'LinkedIn Easy Apply' },
    { id: 'LNK-2026-002', name: 'Vikramaditya Rao', job: 'Lead Backend Engineer', source: 'LinkedIn Job Share' },
    { id: 'LNK-2026-003', name: 'Priya Ramakrishnan', job: 'iOS App Developer', source: 'LinkedIn Easy Apply' },
  ];

  // =========================================================
  // TABLE
  // =========================================================
  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', width: '64px' },
    { field: 'candidate_name', header: 'Candidate Details', type: 'custom', width: '240px' },
    { field: 'job_title', header: 'Position & Source', type: 'custom', width: '220px' },
    { field: 'assigned_tl', header: 'Assigned Team Lead', type: 'custom', width: '180px' },
    { field: 'round', header: 'Interview Round', width: '200px' },
    { field: 'overall_score', header: 'Interview Score', type: 'custom', width: '140px' },
    { field: 'recommendation', header: 'TL Recommendation', type: 'custom', width: '150px' },
    { field: 'status', header: 'Evaluation Status', type: 'custom', width: '200px' },
    { field: 'actions', header: 'Action', type: 'actions', width: '220px' },
  ];

rowActions: PrimeTableRowAction[] = [
  { key: 'schedule', label: 'Schedule Interview', icon: 'bi bi-calendar-plus',  color: 'var(--green-400)' },
  { key: 'score',    label: 'Scorecard',           icon: 'bi bi-pencil-square', color: 'var(--green-400)' },
  { key: 'view',     label: 'HR Review',           icon: 'bi bi-eye',            color: 'var(--neutral-500)' },  // gray
];

  // =========================================================
  // MODAL FIELDS
  // =========================================================
  assignFields: ModalField[] = [];

  scoreFields: ModalField[] = [
    {
      key: 'tech_score',
      label: 'Technical / Domain Score',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      defaultValue: 9.0,
      col: 4,
    },
    {
      key: 'practical_score',
      label: 'Practical Task / Code Quality',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      defaultValue: 8.5,
      col: 4,
    },
    {
      key: 'culture_score',
      label: 'Communication & Culture',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      defaultValue: 9.0,
      col: 4,
    },
    {
      key: 'recommendation',
      label: 'Overall Recommendation',
      type: 'select',
      required: true,
      col: 12,
      defaultValue: 'Strong Hire',
      options: [
        { label: '🚀 Strong Hire (Highly Recommended)', value: 'Strong Hire' },
        { label: '✅ Hire (Qualified Fit)', value: 'Hire' },
        { label: '⚠️ Hold (Needs 2nd Review)', value: 'Hold' },
        { label: '❌ Reject (Not Recommended)', value: 'Reject' },
      ],
    },
    {
      key: 'tl_comments',
      label: 'Detailed Interview Comments & Feedback',
      type: 'textarea',
      required: true,
      rows: 3,
      col: 12,
      placeholder:
        'Provide detailed breakdown of strengths, technical test findings, and feedback...',
    },
  ];

  constructor(private router: Router) {
    this.evaluations = this.load();
    this.assignFields = this.buildAssignFields();
  }

  // =========================================================
  // LOCAL PERSISTENCE
  // =========================================================
  private load(): CandidateEvaluation[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as CandidateEvaluation[];
      } catch {
        /* fall through to seed */
      }
    }
    const seed = this.seed();
    this.persist(seed);
    return seed;
  }

  private persist(rows: CandidateEvaluation[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  }

  private seed(): CandidateEvaluation[] {
    const fmt = (offsetDays: number) => {
      const d = new Date();
      d.setDate(d.getDate() + offsetDays);
      return d
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        .replace(/ /g, '-');
    };

    return [
      {
        eval_id: 'EVAL-2026-001',
        candidate_id: 'LNK-2026-001',
        candidate_name: 'Ananya Sundaram',
        job_title: 'Senior UI/UX Designer',
        source: 'LinkedIn Easy Apply',
        assigned_tl: 'Santhosh Kumar',
        tl_role: 'UI/UX Design Lead',
        department: 'Design',
        round: 'Tech & Portfolio Review',
        tech_score: 9.0,
        practical_score: 8.5,
        culture_score: 9.0,
        overall_score: 8.8,
        recommendation: 'Strong Hire',
        status: 'Evaluated - Sent to HR',
        tl_comments:
          'Exceptional design system knowledge, great Figma architecture, and clear user research methodology.',
        assigned_date: fmt(-2),
        evaluated_date: fmt(-1),
        hr_action: 'Pending HR Offer Release',
      },
      {
        eval_id: 'EVAL-2026-002',
        candidate_id: 'LNK-2026-002',
        candidate_name: 'Vikramaditya Rao',
        job_title: 'Lead Backend Engineer',
        source: 'LinkedIn Job Share',
        assigned_tl: 'Karthik V',
        tl_role: 'Principal Architect',
        department: 'Engineering',
        round: 'System Design & Microservices',
        tech_score: 9.5,
        practical_score: 9.0,
        culture_score: 8.5,
        overall_score: 9.0,
        recommendation: 'Strong Hire',
        status: 'HR Approved for Offer',
        tl_comments:
          'Excellent grasp of distributed caching, Redis, Docker orchestration and PHP microservices.',
        assigned_date: fmt(-3),
        evaluated_date: fmt(-2),
        hr_action: 'Offer Approved by HR',
      },
      {
        eval_id: 'EVAL-2026-003',
        candidate_id: 'LNK-2026-003',
        candidate_name: 'Priya Ramakrishnan',
        job_title: 'iOS App Developer',
        source: 'LinkedIn Easy Apply',
        assigned_tl: 'Anitha R',
        tl_role: 'Mobile Tech Lead',
        department: 'iOS Dev',
        round: 'Swift & Live Coding',
        tech_score: 7.5,
        practical_score: 7.0,
        culture_score: 8.0,
        overall_score: 7.5,
        recommendation: 'Hire',
        status: 'Pending TL Evaluation',
        tl_comments: 'Good Swift knowledge. Live coding exercise pending review.',
        assigned_date: fmt(-1),
        evaluated_date: '-',
        hr_action: 'Awaiting TL Scorecard',
      },
    ];
  }

  // =========================================================
  // KPI
  // =========================================================
  get totalAssigned(): number {
    return this.evaluations.length;
  }

  get totalEvaluated(): number {
    return this.evaluations.filter((e) => e.status !== 'Pending TL Evaluation').length;
  }

  get strongHires(): number {
    return this.evaluations.filter((e) => e.recommendation === 'Strong Hire').length;
  }

  get pendingHrAction(): number {
    return this.evaluations.filter((e) => e.status === 'Evaluated - Sent to HR').length;
  }

  // =========================================================
  // FILTER
  // =========================================================
  get filteredEvaluations(): CandidateEvaluation[] {
    switch (this.currentFilter) {
      case 'pending_tl':
        return this.evaluations.filter((e) => e.status === 'Pending TL Evaluation');
      case 'sent_hr':
        return this.evaluations.filter((e) => e.status === 'Evaluated - Sent to HR');
      case 'hr_approved':
        return this.evaluations.filter((e) => e.status === 'HR Approved for Offer');
      default:
        return this.evaluations;
    }
  }

  setFilter(key: TabKey): void {
    this.currentFilter = key;
  }

  // =========================================================
  // CELL HELPERS
  // =========================================================
  scoreBadgeClass(score: number): string {
    if (!score) return 'score-pending';
    if (score >= 8.5) return 'score-high';
    if (score >= 6.5) return 'score-mid';
    return 'score-pending';
  }

  scoreText(score: number): string {
    return score > 0 ? `${score.toFixed(1)} / 10` : 'Pending';
  }

  recPillClass(rec: TLRecommendation): string {
    switch (rec) {
      case 'Strong Hire':
        return 'rec-strong';
      case 'Hire':
        return 'rec-hire';
      case 'Hold':
        return 'rec-hold';
      case 'Reject':
        return 'rec-reject';
      default:
        return 'rec-hire';
    }
  }

  statusBadgeClass(status: string): string {
    switch (status) {
      case 'Evaluated - Sent to HR':
        return 'bg-primary-subtle text-primary border border-primary-subtle';
      case 'HR Approved for Offer':
        return 'bg-success-subtle text-success border border-success-subtle';
      default:
        return 'bg-light text-secondary border';
    }
  }

  initials(name: string): string {
    return (name || 'C').charAt(0).toUpperCase();
  }

  // =========================================================
  // TABLE ACTIONS
  // =========================================================
  onTableAction(event: { action: string; row: CandidateEvaluation }): void {
    switch (event.action) {
      case 'schedule':
        this.openSchedule(event.row);
        break;
      case 'score':
        this.openScorecard(event.row, false);
        break;
      case 'view':
        this.openScorecard(event.row, true);
        break;
    }
  }

  // =========================================================
  // MODAL 1 — ASSIGN TO TL
  // =========================================================
  private buildAssignFields(): ModalField[] {
    return [
      {
        key: 'candidate_id',
        label: 'Select Social / Web Candidate',
        type: 'select',
        required: true,
        col: 12,
        options: this.candidates.map((c) => ({
          label: `${c.name} (${c.job} - ${c.id})`,
          value: c.id,
        })),
      },
      {
        key: 'department',
        label: 'Select Target Team',
        type: 'select',
        required: true,
        col: 6,
        defaultValue: 'Frontend Engineering Team',
        options: this.departments.map((d) => ({ label: d, value: d })),
      },
      {
        key: 'assigned_tl',
        label: 'Assign Team Lead (TL)',
        type: 'select',
        required: true,
        col: 6,
        options: this.teamLeadMap['Frontend Engineering Team'].map((t) => ({
          label: t,
          value: t,
        })),
      },
      {
        key: 'instructions',
        label: 'Shortlisting Notes & Focus Areas for TL',
        type: 'textarea',
        rows: 3,
        col: 12,
        placeholder:
          'Specify key skill checks, portfolio aspects, or technical questions for the Team Lead...',
      },
    ];
  }

  openAssignModal(): void {
    this.assignFields = this.buildAssignFields();
    this.assignModal.title = 'Shortlist & Forward to Team Lead';
    this.assignModal.saveLabel = 'Forward Resume';
    this.assignModal.submitIcon = 'bi bi-send';
    this.assignModal.open('add');
  }

  onAssignSaved(event: ModalSaveEvent): void {
    const v = event.values as {
      candidate_id: string;
      department: string;
      assigned_tl: string;
      instructions?: string;
    };

    const cand = this.candidates.find((c) => c.id === v.candidate_id);
    if (!cand) return;

    const rows = [...this.evaluations];
    const nextId =
      'EVAL-' + new Date().getFullYear() + '-' + String(rows.length + 1).padStart(3, '0');
    const today = new Date()
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .replace(/ /g, '-');

    const tlFull: string = v.assigned_tl || '';
    const tlName = tlFull.split(' (')[0];
    const tlRole = tlFull.includes('(') ? tlFull.split('(')[1].replace(')', '') : 'Team Lead';

    rows.push({
      eval_id: nextId,
      candidate_id: cand.id,
      candidate_name: cand.name,
      job_title: cand.job,
      source: cand.source,
      assigned_tl: tlName,
      tl_role: tlRole,
      department: v.department,
      round: 'Technical Interview Evaluation',
      tech_score: 0,
      practical_score: 0,
      culture_score: 0,
      overall_score: 0,
      recommendation: 'Hire',
      status: 'Pending TL Evaluation',
      tl_comments: v.instructions || '',
      assigned_date: today,
      evaluated_date: '-',
      hr_action: 'Awaiting TL Scorecard',
    });

    this.evaluations = rows;
    this.persist(rows);
  }

  // =========================================================
  // MODAL 2 — SCORECARD
  // =========================================================
  scorecardReadonly = false;

  openScorecard(row: CandidateEvaluation, readonly: boolean): void {
    this.scorecardReadonly = readonly;

    this.scoreModal.title = readonly
      ? 'HR Read-Only Score Breakdown'
      : 'Submit Interview Scorecard';
    this.scoreModal.editTitle = readonly
      ? 'HR Read-Only Score Breakdown'
      : `Scorecard — ${row.candidate_name}`;
    this.scoreModal.saveLabel = 'Submit Scorecard & Send to HR';
    this.scoreModal.updateLabel = readonly ? 'Close' : 'Submit Scorecard & Send to HR';
    this.scoreModal.submitIcon = readonly ? '' : 'bi bi-send';

    this.scoreModal.fields = readonly ? this.buildReadonlyFields() : this.scoreFields;

    this.scoreModal.open('edit', {
      ...row,
      tech_score: row.tech_score || 8.0,
      practical_score: row.practical_score || 8.0,
      culture_score: row.culture_score || 8.0,
    });
  }

  private buildReadonlyFields(): ModalField[] {
    return [
      { key: 'tech_score', label: 'Technical / Domain Score', type: 'text', col: 4 },
      { key: 'practical_score', label: 'Practical Task / Code Quality', type: 'text', col: 4 },
      { key: 'culture_score', label: 'Communication & Culture', type: 'text', col: 4 },
      { key: 'overall_score', label: 'Calculated Overall Score', type: 'text', col: 12 },
      { key: 'recommendation', label: 'Overall Recommendation', type: 'text', col: 12 },
      { key: 'tl_comments', label: 'Detailed Comments & Feedback', type: 'textarea', col: 12, rows: 4 },
    ];
  }

  onScoreSaved(event: ModalSaveEvent): void {
    if (this.scorecardReadonly) return;

    const v = event.values as {
      eval_id: string;
      tech_score: number;
      practical_score: number;
      culture_score: number;
      recommendation: TLRecommendation;
      tl_comments: string;
    };

    if (!v.eval_id) return;

    const tech = Number(v.tech_score);
    const practical = Number(v.practical_score);
    const culture = Number(v.culture_score);
    const overall = Number(((tech + practical + culture) / 3).toFixed(1));

    const idx = this.evaluations.findIndex((e) => e.eval_id === v.eval_id);
    if (idx === -1) return;

    const today = new Date()
      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      .replace(/ /g, '-');

    const updated: CandidateEvaluation = {
      ...this.evaluations[idx],
      tech_score: tech,
      practical_score: practical,
      culture_score: culture,
      overall_score: overall,
      recommendation: v.recommendation,
      tl_comments: v.tl_comments,
      status: 'Evaluated - Sent to HR',
      evaluated_date: today,
      hr_action: 'Pending HR Offer Release',
    };

    const rows = [...this.evaluations];
    rows[idx] = updated;
    this.evaluations = rows;
    this.persist(rows);
  }

  // =========================================================
  // MODAL 3 — SCHEDULE
  // =========================================================
  scheduleVisible = false;
  schedulingRow: CandidateEvaluation | null = null;

  scheduleForm = {
    eval_id: '',
    candidate_name: '',
    job_title: '',
    round: 'Technical Round 2 (System Arch / Live Coding)',
    interviewer: 'Sarah Mitchell (HR Head)',
    date: '2026-09-17',
    time: '11:00',
    duration: '45 mins',
    meeting_link: 'https://meet.google.com/xyz-abcd-efg',
    candidate_email: '',
    candidate_phone: '+91 98765 43210',
    send_email: true,
    send_whatsapp: true,
  };

  openSchedule(row: CandidateEvaluation): void {
    this.schedulingRow = row;
    const clean = row.candidate_name.toLowerCase().replace(/[^a-z]/g, '.');

    this.scheduleForm = {
      eval_id: row.eval_id,
      candidate_name: row.candidate_name,
      job_title: row.job_title,
      round: 'Technical Round 2 (System Arch / Live Coding)',
      interviewer: 'Sarah Mitchell (HR Head)',
      date: '2026-09-17',
      time: '11:00',
      duration: '45 mins',
      meeting_link: 'https://meet.google.com/xyz-abcd-efg',
      candidate_email: `${clean}@gmail.com`,
      candidate_phone: '+91 98765 43210',
      send_email: true,
      send_whatsapp: true,
    };

    this.scheduleVisible = true;
  }

  closeSchedule(): void {
    this.scheduleVisible = false;
    this.schedulingRow = null;
  }

  buildWhatsappText(): string {
    const f = this.scheduleForm;
    return (
      `Dear ${f.candidate_name},\n\n` +
      `Your next interview for *${f.job_title}* (*${f.round}*) has been scheduled!\n\n` +
      `📅 Date: ${f.date}\n` +
      `⏰ Time: ${f.time}\n` +
      `👨‍💼 Interviewer: ${f.interviewer}\n` +
      `🔗 Meeting Link: ${f.meeting_link}\n\n` +
      `Please join 5 mins before start time. Wish you the very best!\n\n` +
      `Regards,\nTalent Acquisition Team`
    );
  }

  openWhatsappDirect(): void {
    const phone = this.scheduleForm.candidate_phone.replace(/[^0-9]/g, '') || '919876543210';
    const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(
      phone,
    )}&text=${encodeURIComponent(this.buildWhatsappText())}`;
    window.open(url, '_blank');
  }

  submitSchedule(): void {
    const f = this.scheduleForm;
    if (f.send_whatsapp) this.openWhatsappDirect();

    const channels: string[] = [];
    if (f.send_email) channels.push(`Email Calendar Invite to ${f.candidate_email}`);
    if (f.send_whatsapp) channels.push(`WhatsApp Invite to ${f.candidate_phone}`);
    const summary = channels.length ? channels.join(' and ') : 'Invites dispatched';

    alert(
      `Interview successfully scheduled for ${f.candidate_name}!\n\n${summary}. Redirecting to Interview Calendar...`,
    );
    this.closeSchedule();
  }

  // =========================================================
  // NAV
  // =========================================================
  goToSocialApplicants(): void {
    this.router.navigate(['/recruitment/social-web-applicants']);
  }

  goToPipeline(): void {
    this.router.navigate(['/recruitment/candidates']);
  }

  // =========================================================
  // DEV HELPER — reset to seed data
  // =========================================================
  resetData(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.evaluations = this.seed();
    this.persist(this.evaluations);
  }
}