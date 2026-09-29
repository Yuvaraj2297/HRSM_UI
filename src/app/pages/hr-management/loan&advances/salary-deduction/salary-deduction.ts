import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
  PrimeTableRowAction,
} from '../../../../shared/primedatatable/primedatatable';

import { AppSelect } from '../../../../shared/app-select/app-select';
type Category = 'Personal Loan' | 'Medical Assistance' | 'Education Support' | 'Salary Advance' | 'Vehicle Loan';
type Department = 'Finance' | 'Engineering' | 'Design' | 'Marketing' | 'HR' | 'Operations';
type LedgerStatus = 'Pending Repayment' | 'Fully Settled';
type StatusTab = 'all' | 'pending' | 'settled';
type ProgressBand = 'low' | 'mid' | 'high' | 'cleared';

/** What the API would send: the sanction and how many EMIs have been deducted */
interface LoanSeed {
  id: number;
  refNo: string;
  empId: string;
  empName: string;
  category: Category;
  department: Department;
  disbursed: number;
  tenure: number;
  paid: number;
  interestRate: number;
  sanctionDate: string; // yyyy-mm-dd
}

/** One ledger row — amounts, progress and status are derived, never stored */
export interface LedgerAccount extends LoanSeed {
  initials: string;
  avatarColor: string;
  categoryIcon: string;
  recovered: number;
  balance: number;
  progress: number;
  status: LedgerStatus;
  emiLabel: string;
}

export interface LedgerInstallment {
  no: number;
  dueDate: Date;
  principal: number;
  interest: number;
  total: number;
  balance: number;
  deducted: boolean;
}

const CATEGORY_ICONS: Record<Category, string> = {
  'Personal Loan': 'bi bi-person-fill',
  'Medical Assistance': 'bi bi-heart-pulse',
  'Education Support': 'bi bi-mortarboard',
  'Salary Advance': 'bi bi-cash-stack',
  'Vehicle Loan': 'bi bi-car-front',
};

const AVATAR_COLORS = [
  'var(--blue-450)', 'var(--danger)', 'var(--green-350)', 'var(--warning)',
  'var(--pink-450)', 'var(--teal-350)', 'var(--purple-500)', 'var(--orange-350)',
];

const LOANS: LoanSeed[] = [
  { id: 1,  refNo: 'LN-2026-001',  empId: 'EMP0001', empName: 'Amelia Curr',      category: 'Personal Loan',      department: 'Finance',     disbursed: 120000, tenure: 12, paid: 4,  interestRate: 0,   sanctionDate: '2026-01-01' },
  { id: 2,  refNo: 'LN-2026-004',  empId: 'EMP0003', empName: 'David Anderson',   category: 'Medical Assistance', department: 'Engineering', disbursed: 150000, tenure: 18, paid: 6,  interestRate: 0,   sanctionDate: '2025-11-15' },
  { id: 3,  refNo: 'LN-2026-009',  empId: 'EMP0004', empName: 'Emily Clark',      category: 'Education Support',  department: 'Design',      disbursed: 120000, tenure: 12, paid: 12, interestRate: 4.5, sanctionDate: '2025-01-10' },
  { id: 4,  refNo: 'LN-2026-012',  empId: 'EMP0006', empName: 'Michael Brown',    category: 'Personal Loan',      department: 'Engineering', disbursed: 150000, tenure: 18, paid: 6,  interestRate: 0,   sanctionDate: '2025-12-01' },
  { id: 5,  refNo: 'ADV-2026-077', empId: 'EMP0008', empName: 'James Taylor',     category: 'Salary Advance',     department: 'Finance',     disbursed: 45000,  tenure: 3,  paid: 3,  interestRate: 0,   sanctionDate: '2026-01-01' },
  { id: 6,  refNo: 'LN-2026-015',  empId: 'EMP0011', empName: 'Sophia Wilson',    category: 'Medical Assistance', department: 'HR',          disbursed: 200000, tenure: 20, paid: 8,  interestRate: 0,   sanctionDate: '2025-10-01' },
  { id: 7,  refNo: 'LN-2026-019',  empId: 'EMP0014', empName: 'Robert Johnson',   category: 'Vehicle Loan',       department: 'Engineering', disbursed: 300000, tenure: 24, paid: 8,  interestRate: 6,   sanctionDate: '2025-10-10' },
  { id: 8,  refNo: 'ADV-2026-085', empId: 'EMP0017', empName: 'Olivia Davis',     category: 'Salary Advance',     department: 'Design',      disbursed: 35000,  tenure: 3,  paid: 3,  interestRate: 0,   sanctionDate: '2026-02-15' },
  { id: 9,  refNo: 'LN-2026-022',  empId: 'EMP0020', empName: 'William Martinez', category: 'Education Support',  department: 'Marketing',   disbursed: 180000, tenure: 12, paid: 9,  interestRate: 4.5, sanctionDate: '2025-09-01' },
  { id: 10, refNo: 'LN-2026-026',  empId: 'EMP0023', empName: 'Ava Hernandez',    category: 'Personal Loan',      department: 'Engineering', disbursed: 100000, tenure: 8,  paid: 6,  interestRate: 0,   sanctionDate: '2025-11-01' },
  { id: 11, refNo: 'LN-2026-030',  empId: 'EMP0025', empName: 'Lucas Miller',     category: 'Medical Assistance', department: 'Finance',     disbursed: 150000, tenure: 12, paid: 12, interestRate: 0,   sanctionDate: '2024-08-01' },
  { id: 12, refNo: 'ADV-2026-092', empId: 'EMP0028', empName: 'Mia Garcia',       category: 'Salary Advance',     department: 'Operations',  disbursed: 50000,  tenure: 2,  paid: 2,  interestRate: 0,   sanctionDate: '2026-03-01' },
  { id: 13, refNo: 'LN-2026-034',  empId: 'EMP0031', empName: 'Benjamin Lee',     category: 'Personal Loan',      department: 'Marketing',   disbursed: 120000, tenure: 12, paid: 9,  interestRate: 0,   sanctionDate: '2025-08-15' },
  { id: 14, refNo: 'LN-2026-038',  empId: 'EMP0035', empName: 'Charlotte White',  category: 'Vehicle Loan',       department: 'Engineering', disbursed: 250000, tenure: 24, paid: 10, interestRate: 6,   sanctionDate: '2025-08-01' },
  { id: 15, refNo: 'LN-2026-042',  empId: 'EMP0039', empName: 'Daniel Harris',    category: 'Education Support',  department: 'Design',      disbursed: 160000, tenure: 16, paid: 16, interestRate: 4.5, sanctionDate: '2024-11-01' },
  { id: 16, refNo: 'ADV-2026-098', empId: 'EMP0041', empName: 'Harper Martin',    category: 'Salary Advance',     department: 'Finance',     disbursed: 40000,  tenure: 2,  paid: 2,  interestRate: 0,   sanctionDate: '2026-03-01' },
  { id: 17, refNo: 'LN-2026-045',  empId: 'EMP0044', empName: 'Alexander King',   category: 'Medical Assistance', department: 'Operations',  disbursed: 110000, tenure: 10, paid: 5,  interestRate: 0,   sanctionDate: '2025-12-01' },
  { id: 18, refNo: 'LN-2026-048',  empId: 'EMP0047', empName: 'Ella Wright',      category: 'Personal Loan',      department: 'HR',          disbursed: 130000, tenure: 12, paid: 6,  interestRate: 0,   sanctionDate: '2025-12-01' },
  { id: 19, refNo: 'LN-2026-052',  empId: 'EMP0050', empName: 'Henry Lopez',      category: 'Vehicle Loan',       department: 'Engineering', disbursed: 180000, tenure: 18, paid: 8,  interestRate: 6,   sanctionDate: '2025-10-15' },
  { id: 20, refNo: 'LN-2026-055',  empId: 'EMP0053', empName: 'Chloe Scott',      category: 'Education Support',  department: 'Design',      disbursed: 100000, tenure: 10, paid: 10, interestRate: 4.5, sanctionDate: '2025-02-01' },
];

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

@Component({
  selector: 'app-salary-deduction',
  standalone: true,
  imports: [AppSelect, CommonModule, FormsModule, RouterLink, PrimeDataTable, AppStatCard],
  templateUrl: './salary-deduction.html',
  styleUrl: './salary-deduction.scss',
})
export class SalaryDeduction {
  readonly tableHeader: PrimeTableHeader = {
    title: 'Loan & Advance Ledger',
    icon: 'bi bi-journal-bookmark',
  };

  // field names are real row keys, so sorting and the table's Export work on them
  readonly columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.NO', width: '65px', sortable: false },
    { field: 'refNo', header: 'REF #', width: '130px', sortable: true, type: 'custom' },
    { field: 'empName', header: 'EMPLOYEE', width: '220px', sortable: true, type: 'custom' },
    { field: 'category', header: 'CATEGORY', width: '180px', sortable: true, type: 'custom' },
    { field: 'disbursed', header: 'DISBURSED', width: '130px', sortable: true, type: 'custom' },
    { field: 'recovered', header: 'RECOVERED', width: '130px', sortable: true, type: 'custom' },
    { field: 'balance', header: 'BALANCE DUE', width: '130px', sortable: true, type: 'custom' },
    { field: 'progress', header: 'REPAYMENT', width: '200px', sortable: true, type: 'custom' },
    { field: 'status', header: 'STATUS', width: '170px', sortable: true, type: 'custom' },
    { field: 'action', header: 'ACTION', width: '90px', sortable: false, type: 'actions' },
  ];

  readonly rowActions: PrimeTableRowAction[] = [
    { key: 'statement', label: 'View Statement', icon: 'bi bi-file-earmark-text' },
  ];

  readonly categoryOptions = Object.keys(CATEGORY_ICONS).map((c) => ({ label: c, value: c }));
  readonly departmentOptions = (['Finance', 'Engineering', 'Design', 'Marketing', 'HR', 'Operations'] as Department[])
    .map((d) => ({ label: d, value: d }));
  readonly progressOptions: { label: string; value: ProgressBand }[] = [
    { label: 'Under 30% repaid', value: 'low' },
    { label: '30% – 70% repaid', value: 'mid' },
    { label: 'Over 70% repaid', value: 'high' },
    { label: '100% cleared', value: 'cleared' },
  ];

  readonly accounts = signal<LedgerAccount[]>(LOANS.map(toAccount));

  // ---------------------------------------------------------------- filters
  readonly statusTab = signal<StatusTab>('all');
  readonly category = signal<Category | null>(null);
  readonly department = signal<Department | null>(null);
  readonly progressBand = signal<ProgressBand | null>(null);

  readonly hasFilters = computed(() => !!(this.category() || this.department() || this.progressBand()));

  readonly rows = computed(() => {
    const tab = this.statusTab();
    const cat = this.category();
    const dept = this.department();
    const band = this.progressBand();

    return this.accounts()
      .filter((a) =>
        (tab === 'all' || (tab === 'pending') === (a.status === 'Pending Repayment')) &&
        (!cat || a.category === cat) &&
        (!dept || a.department === dept) &&
        (!band || inBand(a.progress, band)),
      )
      .map((a, i) => ({ ...a, sno: i + 1 }));
  });

  resetFilters(): void {
    this.category.set(null);
    this.department.set(null);
    this.progressBand.set(null);
  }

  // ---------------------------------------------------------------- KPIs
  readonly stats = computed(() => {
    const list = this.accounts();
    const sum = (f: (a: LedgerAccount) => number, from = list) => from.reduce((t, a) => t + f(a), 0);
    const pending = list.filter((a) => a.status === 'Pending Repayment');
    const settled = list.filter((a) => a.status === 'Fully Settled');
    const disbursed = sum((a) => a.disbursed);
    const recovered = sum((a) => a.recovered);

    return {
      total: list.length,
      disbursed,
      recovered,
      recoveredPct: disbursed ? ((recovered / disbursed) * 100).toFixed(1) : '0.0',
      balance: sum((a) => a.balance),
      pendingCount: pending.length,
      settledCount: settled.length,
      settledAmount: sum((a) => a.recovered, settled),
    };
  });

  // ---------------------------------------------------------------- statement
  readonly statementFor = signal<LedgerAccount | null>(null);
  readonly installments = computed(() => {
    const a = this.statementFor();
    return a ? buildSchedule(a) : [];
  });

  onAction(e: { action: string; row: LedgerAccount }): void {
    if (e.action === 'statement') this.statementFor.set(e.row);
  }

  closeStatement(): void {
    this.statementFor.set(null);
  }

  /** Prints only the statement, not the page behind the modal */
  printStatement(): void {
    const a = this.statementFor();
    if (!a) return;

    const rows = this.installments().map((i) => `
      <tr>
        <td>${i.no}</td><td>${fmtDate(i.dueDate)}</td>
        <td class="r">${inr.format(i.principal)}</td><td class="r">${inr.format(i.interest)}</td>
        <td class="r">${inr.format(i.total)}</td><td class="r">${inr.format(i.balance)}</td>
        <td>${i.deducted ? 'Payroll Deducted' : 'Upcoming'}</td>
      </tr>`).join('');

    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    win.document.write(`<!doctype html><html><head><title>Statement ${a.refNo}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #222; margin: 24px; }
        h2 { margin: 0 0 4px; } p { margin: 0 0 16px; color: #555; }
        .sum { display: flex; gap: 32px; margin-bottom: 16px; }
        .sum b { display: block; font-size: 16px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
        th { background: #f2f2f2; } .r { text-align: right; }
      </style></head><body>
      <h2>Account Deduction Statement — ${a.refNo}</h2>
      <p>${a.empName} (${a.empId}) · ${a.department} · ${a.category} @ ${a.interestRate}%</p>
      <div class="sum">
        <div>Sanctioned<b>${inr.format(a.disbursed)}</b></div>
        <div>Recovered<b>${inr.format(a.recovered)}</b></div>
        <div>Balance<b>${inr.format(a.balance)}</b></div>
      </div>
      <table><thead><tr>
        <th>EMI #</th><th>Due Date</th><th class="r">Principal</th><th class="r">Interest</th>
        <th class="r">Total</th><th class="r">Balance After</th><th>Status</th>
      </tr></thead><tbody>${rows}</tbody></table>
      </body></html>`);
    win.document.close();
    win.focus();
    win.print();
  }

  // ---------------------------------------------------------------- helpers
  inr(amount: number): string {
    return inr.format(amount);
  }

  fmtDate(d: Date): string {
    return fmtDate(d);
  }
}

// ------------------------------------------------------------------ pure helpers

function toAccount(s: LoanSeed): LedgerAccount {
  const paid = Math.min(s.paid, s.tenure);
  const recovered = paid === s.tenure ? s.disbursed : Math.round((s.disbursed / s.tenure) * paid);
  const progress = Math.round((recovered / s.disbursed) * 1000) / 10;

  return {
    ...s,
    paid,
    initials: s.empName.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase(),
    avatarColor: AVATAR_COLORS[s.id % AVATAR_COLORS.length],
    categoryIcon: CATEGORY_ICONS[s.category],
    recovered,
    balance: s.disbursed - recovered,
    progress,
    status: paid === s.tenure ? 'Fully Settled' : 'Pending Repayment',
    emiLabel: `${paid} of ${s.tenure} EMIs`,
  };
}

function inBand(progress: number, band: ProgressBand): boolean {
  switch (band) {
    case 'low': return progress < 30;
    case 'mid': return progress >= 30 && progress <= 70;
    case 'high': return progress > 70 && progress < 100;
    case 'cleared': return progress >= 100;
  }
}

/** Equal-principal schedule; interest on the reducing balance; first EMI one month after sanction */
function buildSchedule(a: LedgerAccount): LedgerInstallment[] {
  const list: LedgerInstallment[] = [];
  const start = new Date(a.sanctionDate);
  const basePrincipal = Math.floor(a.disbursed / a.tenure);
  let balance = a.disbursed;

  for (let no = 1; no <= a.tenure; no++) {
    // last EMI absorbs the rounding remainder so the balance lands on exactly 0
    const principal = no === a.tenure ? balance : basePrincipal;
    const interest = Math.round((balance * a.interestRate) / 100 / 12);
    balance -= principal;

    list.push({
      no,
      dueDate: new Date(start.getFullYear(), start.getMonth() + no, 1),
      principal,
      interest,
      total: principal + interest,
      balance,
      deducted: no <= a.paid,
    });
  }
  return list;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
