import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
} from '../../../../shared/primedatatable/primedatatable';

type Category = 'Identity' | 'Address' | 'Education' | 'Employment' | 'Bank / Payroll' | 'Statutory / UAN';
type DocStatus = 'Verified' | 'Pending HR Review' | 'Rejected';

interface DocRow {
  id: number;
  employeeId: number;
  name: string;
  designation: string;
  avatar: string;
  category: Category;
  docType: string;
  docNumber: string;
  fileName: string;
  uploadDate: string; // yyyy-mm-dd
  status: DocStatus;
  verifiedBy: string;
  remarks?: string;
}

const CATEGORIES: { value: Category; icon: string; tone: string }[] = [
  { value: 'Identity',        icon: 'bi bi-person-vcard',      tone: 'var(--blue-450)' },
  { value: 'Address',         icon: 'bi bi-geo-alt',           tone: 'var(--primary)' },
  { value: 'Education',       icon: 'bi bi-mortarboard',       tone: 'var(--warning)' },
  { value: 'Employment',      icon: 'bi bi-briefcase',         tone: 'var(--purple-500)' },
  { value: 'Bank / Payroll',  icon: 'bi bi-bank',              tone: 'var(--teal-350)' },
  { value: 'Statutory / UAN', icon: 'bi bi-file-earmark-text', tone: 'var(--danger)' },
];

const DOCS: DocRow[] = [
  { id: 1, employeeId: 101, name: 'Kavitha Raman',  designation: 'UX Designer',       avatar: 'assets/profile-1.jpg', category: 'Identity',        docType: 'Aadhaar Card',                  docNumber: 'XXXX-XXXX-8921',    fileName: 'Aadhaar_Kavitha.pdf',       uploadDate: '2026-03-08', status: 'Verified',          verifiedBy: 'Sarah Mitchell (HR)' },
  { id: 2, employeeId: 102, name: 'Rahul Verma',    designation: 'Full Stack Dev',    avatar: 'assets/profile-2.jpg', category: 'Identity',        docType: 'PAN Card',                      docNumber: 'ABCDE1234F',        fileName: 'PAN_Card_Rahul.jpg',        uploadDate: '2026-03-01', status: 'Pending HR Review', verifiedBy: '' },
  { id: 3, employeeId: 103, name: 'Siddharth Nair', designation: 'iOS Dev',           avatar: 'assets/profile-3.jpg', category: 'Address',         docType: 'Passport (Address Page)',       docNumber: 'Z9876543',          fileName: 'Passport_Addr_Sid.pdf',     uploadDate: '2026-03-04', status: 'Verified',          verifiedBy: 'Sarah Mitchell (HR)' },
  { id: 4, employeeId: 104, name: 'Priya Sundaram', designation: 'Financial Analyst', avatar: 'assets/profile-4.jpg', category: 'Education',       docType: 'Degree Certificate',            docNumber: 'MBA/FIN/2021/41',   fileName: 'MBA_Degree_Priya.pdf',      uploadDate: '2026-02-20', status: 'Verified',          verifiedBy: 'Sarah Mitchell (HR)' },
  { id: 5, employeeId: 103, name: 'Siddharth Nair', designation: 'iOS Dev',           avatar: 'assets/profile-3.jpg', category: 'Employment',      docType: 'Relieving & Experience Letter', docNumber: 'ZOHO/EXP/2026/99',  fileName: 'Zoho_Relieving_Letter.pdf', uploadDate: '2026-02-25', status: 'Verified',          verifiedBy: 'Sarah Mitchell (HR)' },
  { id: 6, employeeId: 105, name: 'Ananya Gupta',   designation: 'HR Generalist',     avatar: '',                     category: 'Bank / Payroll',  docType: 'Cancelled Cheque',              docNumber: 'HDFC 000123984712', fileName: 'HDFC_Cheque_Ananya.jpg',    uploadDate: '2026-03-10', status: 'Pending HR Review', verifiedBy: '' },
  { id: 7, employeeId: 101, name: 'Kavitha Raman',  designation: 'UX Designer',       avatar: 'assets/profile-1.jpg', category: 'Statutory / UAN', docType: 'UAN & PF Details Form 11',      docNumber: 'UAN: 101293847561', fileName: 'UAN_Form11_Kavitha.pdf',    uploadDate: '2026-03-09', status: 'Verified',          verifiedBy: 'Sarah Mitchell (HR)' },
  { id: 8, employeeId: 106, name: 'Arjun Mehta',    designation: 'QA Engineer',       avatar: '',                     category: 'Education',       docType: 'B.Tech Marksheet',              docNumber: 'VTU/2019/CS/118',   fileName: 'Marksheet_Arjun.jpg',       uploadDate: '2026-03-06', status: 'Rejected',          verifiedBy: 'Sarah Mitchell (HR)', remarks: 'Scan is blurred — please upload a clear copy.' },
];

const REVIEWER = 'You (HR)';

@Component({
  selector: 'app-document-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeDataTable, AppStatCard],
  templateUrl: './document-verification.html',
  styleUrl: './document-verification.scss',
})
export class DocumentVerification {
  private readonly router = inject(Router);

  readonly categories = CATEGORIES;

  readonly tableHeader: PrimeTableHeader = {
    title: 'Document Verification & KYC',
    icon: 'bi bi-shield-check',
  };

  readonly columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.NO', width: '65px', sortable: false },
    { field: 'name', header: 'JOINER', width: '210px', sortable: true, type: 'custom' },
    { field: 'category', header: 'CATEGORY', width: '160px', sortable: true, type: 'custom' },
    { field: 'docType', header: 'DOCUMENT', width: '230px', sortable: true, type: 'custom' },
    { field: 'fileName', header: 'FILE', width: '220px', sortable: false, type: 'custom' },
    { field: 'uploadDate', header: 'UPLOADED', width: '120px', sortable: true, type: 'custom' },
    { field: 'status', header: 'STATUS', width: '170px', sortable: true, type: 'custom' },
    { field: 'verifiedBy', header: 'VERIFIED BY', width: '170px', sortable: true, type: 'custom' },
    {
      field: 'actions', header: 'ACTION', width: '170px', type: 'pill-actions',
      buttons: [
        { key: 'review', label: 'Review', icon: 'bi bi-eye', variant: 'solid',
          hiddenWhen: (r: DocRow) => r.status !== 'Pending HR Review' },
        { key: 'view', label: 'View', icon: 'bi bi-eye', variant: 'outline',
          hiddenWhen: (r: DocRow) => r.status === 'Pending HR Review' },
      ],
    },
  ];

  readonly docs = signal<DocRow[]>(DOCS);

  // ---------------------------------------------------------------- filters
  readonly category = signal<Category | null>(null);
  readonly status = signal<DocStatus | null>(null);

  readonly rows = computed(() => {
    const cat = this.category();
    const st = this.status();
    return this.docs().filter((d) => (!cat || d.category === cat) && (!st || d.status === st));
  });

  /** tab counts follow the status filter, so the numbers match what you'll see */
  readonly categoryCounts = computed(() => {
    const st = this.status();
    const counts: Record<string, number> = {};
    for (const d of this.docs()) {
      if (!st || d.status === st) counts[d.category] = (counts[d.category] ?? 0) + 1;
    }
    return counts;
  });

  readonly stats = computed(() => {
    const list = this.docs();
    const count = (s: DocStatus) => list.filter((d) => d.status === s).length;
    return {
      total: list.length,
      verified: count('Verified'),
      pending: count('Pending HR Review'),
      rejected: count('Rejected'),
    };
  });

  /** stat cards double as a status filter — click again to clear */
  toggleStatus(s: DocStatus | null): void {
    this.status.set(this.status() === s ? null : s);
  }

  categoryMeta(c: Category) {
    return CATEGORIES.find((x) => x.value === c)!;
  }

  // ---------------------------------------------------------------- review modal
  readonly reviewing = signal<DocRow | null>(null);
  rejectMode = false;
  rejectReason = '';

  onAction(e: { action: string; row: DocRow }): void {
    if (e.action === 'review' || e.action === 'view') this.openReview(e.row);
  }

  openReview(row: DocRow): void {
    this.rejectMode = false;
    this.rejectReason = '';
    this.reviewing.set(row);
  }

  closeReview(): void {
    this.reviewing.set(null);
  }

  approve(): void {
    const doc = this.reviewing();
    if (!doc) return;
    this.update(doc.id, { status: 'Verified', verifiedBy: REVIEWER, remarks: undefined });
    this.notify(`${doc.docType} for ${doc.name} verified.`);
    this.closeReview();
  }

  reject(): void {
    const doc = this.reviewing();
    const reason = this.rejectReason.trim();
    if (!doc || !reason) return;
    this.update(doc.id, { status: 'Rejected', verifiedBy: REVIEWER, remarks: reason });
    this.notify(`Resubmission requested from ${doc.name}.`, 'warning');
    this.closeReview();
  }

  private update(id: number, patch: Partial<DocRow>): void {
    this.docs.update((list) => list.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }

  // ---------------------------------------------------------------- page actions
  sendReminders(): void {
    const joiners = new Set(this.docs().filter((d) => d.status !== 'Verified').map((d) => d.name));
    this.notify(
      joiners.size
        ? `Reminder sent to ${joiners.size} joiner${joiners.size > 1 ? 's' : ''} with pending or rejected documents.`
        : 'No pending documents — nobody to remind.',
      joiners.size ? 'success' : 'warning',
    );
  }

  uploadDocuments(): void {
    this.router.navigate(['employee/employee-creation']);
  }

  // ---------------------------------------------------------------- feedback banner
  readonly feedback = signal<{ text: string; type: 'success' | 'warning' } | null>(null);
  private feedbackTimer?: ReturnType<typeof setTimeout>;

  private notify(text: string, type: 'success' | 'warning' = 'success'): void {
    clearTimeout(this.feedbackTimer);
    this.feedback.set({ text, type });
    this.feedbackTimer = setTimeout(() => this.feedback.set(null), 4000);
  }

  // ---------------------------------------------------------------- helpers
  fileIcon(fileName: string): string {
    return /\.pdf$/i.test(fileName) ? 'bi bi-file-earmark-pdf text-danger' : 'bi bi-file-earmark-image text-primary';
  }

  initials(name: string): string {
    return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
