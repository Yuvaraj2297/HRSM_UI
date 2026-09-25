import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PayrollRow {
  sno: number;
  img?:any;
  employeeId: string;
  employeeName: string;
  department: string;
  payPeriod: string;
  present: number;
  absent: number;
  basic: number;
  hra: number;
  da: number;
  convey: number;
  medical: number;
  special: number;
  gross: number;
  pf: number;
  esi: number;
  profTax: number;
  tds: number;
  netPay: number;
  status: 'paid' | 'processing' | 'hold' | 'draft';
}

interface DeptStat {
  count: number;
  gross: number;
  ded: number;
}

interface CustomComponentRow {
  id: number;
  label: string;
  amount: number;
}

type RunType = 'bulk' | 'department' | 'individual' | '';

@Component({
  selector: 'app-payroll-processing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payroll-processing.html',
  styleUrl: './payroll-processing.scss',
})
export class PayrollProcessing {
  // ===================== Static reference data =====================
  departments = ['Design', 'Engineering', 'Finance', 'Marketing', 'HR'];
  payPeriods = ['Aug 2026', 'Jul 2026', 'Jun 2026', 'May 2026', 'Apr 2026'];
  statusOptions = ['Paid', 'Processing', 'On Hold', 'Draft'];
    avatarSrc(): string {
      return `/assets/profile-1.jpg`;
    }
      onAvatarError(id: number): void {
    // this.brokenAvatars.update((s) => new Set(s).add(id));
  }
  employees = [
    { id: 'EMP0001', name: 'Amelia Curr' },
    { id: 'EMP0002', name: 'Daniel Martinez' },
    { id: 'EMP0003', name: 'David Anderson' },
    { id: 'EMP0004', name: 'Emily Clark' },
    { id: 'EMP0005', name: 'Sophia Johnson' },
    { id: 'EMP0006', name: 'Michael Brown' },
    { id: 'EMP0007', name: 'Olivia Wilson' },
    { id: 'EMP0008', name: 'James Taylor' },
    { id: 'EMP0009', name: 'Isabella Moore' },
    { id: 'EMP0010', name: 'William Thomas' },
  ];

  deptStats: Record<string, DeptStat> = {
    Design: { count: 42, gross: 5320000, ded: 731000 },
    Engineering: { count: 58, gross: 7240000, ded: 998000 },
    Finance: { count: 24, gross: 3010000, ded: 415000 },
    Marketing: { count: 36, gross: 4520000, ded: 623000 },
    HR: { count: 26, gross: 3260000, ded: 449000 },
  };

  // ===================== KPI summary =====================
  kpis = {
    employeesProcessed: 186,
    activeEmployees: 198,
    grossPayroll: 2486000,
    grossCycle: 'August 2026 cycle',
    totalDeductions: 342000,
    pendingReview: 12,
  };

  // ===================== Table + filters =====================
  private allRows: PayrollRow[] = this.generateRows();
  rows: PayrollRow[] = [];
  contentVisible = false;

  filtersOpen = false;
  filterEmployee = '';
  filterDept = 'All Departments';
  filterPeriod = 'All Periods';
  filterStatus = 'All Status';

  activeFilters: { key: string; label: string; value: string }[] = [];

  // ===================== Run Payroll modal =====================
  showRunModal = false;
  runStep: 1 | 2 = 1;
  selectedType: RunType = '';
  rpBulkPeriod = '';
  rpDeptSelected = '';
  rpDeptPeriod = '';
  rpEmpSelected = '';
  rpIndPeriod = '';

  // ===================== Progress modal =====================
  showProgressModal = false;
  progressPct = 0;
  progressTitle = 'Processing Payroll...';
  progressSub = '';
  progressDone = false;
  private progressTimer: ReturnType<typeof setInterval> | undefined;

  // ===================== Edit Salary modal =====================
  showEditModal = false;
  editRow: PayrollRow | null = null;
  edit = {
    basic: 0, hra: 0, da: 0, convey: 0, medical: 0, special: 0,
    pf: 0, esi: 0, profTax: 0, tds: 0, present: 0, absent: 0,
  };

  // ===================== Add Salary Structure modal =====================
  showAddModal = false;
  addStep: 1 | 2 | 3 = 1;
  add = {
    employeeId: '',
    basic: 25000, hra: 10000, da: 5000, convey: 3200, medical: 2000, special: 4800,
    pf: 3000, esi: 375, profTax: 200, tds: 2500,
  };
  customEarnings: CustomComponentRow[] = [];
  customDeductions: CustomComponentRow[] = [];
  private customIdCounter = 1;

  // ===================== Helpers =====================
  formatINR(n: number): string {
    if (Math.abs(n) >= 100000) return '₹' + (n / 100000).toFixed(2) + 'L';
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  statusLabel(status: PayrollRow['status']): string {
    switch (status) {
      case 'paid': return 'Paid';
      case 'processing': return 'Processing';
      case 'hold': return 'On Hold';
      default: return 'Draft';
    }
  }

  private statusKeyFromLabel(label: string): PayrollRow['status'] {
    switch (label) {
      case 'Paid': return 'paid';
      case 'Processing': return 'processing';
      case 'On Hold': return 'hold';
      default: return 'draft';
    }
  }

  private generateRows(): PayrollRow[] {
    const factors = [1, 1.2, 0.9, 1.4, 1.1, 0.8, 1.3, 1, 0.95, 1.25];
    const statusCycle: PayrollRow['status'][] =
      ['paid', 'paid', 'processing', 'hold', 'draft', 'paid', 'processing', 'paid', 'hold', 'paid'];

    return this.employees.map((emp, i) => {
      const f = factors[i % factors.length];
      const basic = Math.round(25000 * f);
      const hra = Math.round(10000 * f);
      const da = Math.round(5000 * f);
      const convey = Math.round(3200 * f);
      const medical = Math.round(2000 * f);
      const special = Math.round(4800 * f);
      const gross = basic + hra + da + convey + medical + special;
      const pf = Math.round(3000 * f);
      const esi = Math.round(375 * f);
      const profTax = 200;
      const tds = Math.round(2500 * f);
      const netPay = gross - (pf + esi + profTax + tds);

      return {
        sno: i + 1,
        employeeId: emp.id,
        employeeName: emp.name,
        department: this.departments[i % this.departments.length],
        payPeriod: 'Aug 2026',
        present: 26 - (i % 3),
        absent: i % 3,
        basic, hra, da, convey, medical, special, gross,
        pf, esi, profTax, tds, netPay,
        status: statusCycle[i % statusCycle.length],
      };
    });
  }

  // ===================== Filters =====================
  toggleFilters(): void {
    this.filtersOpen = !this.filtersOpen;
  }

  applyFilters(): void {
    const chips: { key: string; label: string; value: string }[] = [];
    if (this.filterEmployee.trim()) chips.push({ key: 'employee', label: 'Employee', value: this.filterEmployee.trim() });
    if (this.filterDept !== 'All Departments') chips.push({ key: 'dept', label: 'Department', value: this.filterDept });
    if (this.filterPeriod !== 'All Periods') chips.push({ key: 'period', label: 'Pay Period', value: this.filterPeriod });
    if (this.filterStatus !== 'All Status') chips.push({ key: 'status', label: 'Status', value: this.filterStatus });
    this.activeFilters = chips;
    this.runFilter();
  }

  clearFilters(): void {
    this.filterEmployee = '';
    this.filterDept = 'All Departments';
    this.filterPeriod = 'All Periods';
    this.filterStatus = 'All Status';
    this.activeFilters = [];
    this.runFilter();
  }

  removeFilterChip(key: string): void {
    this.activeFilters = this.activeFilters.filter((c) => c.key !== key);
    if (key === 'employee') this.filterEmployee = '';
    if (key === 'dept') this.filterDept = 'All Departments';
    if (key === 'period') this.filterPeriod = 'All Periods';
    if (key === 'status') this.filterStatus = 'All Status';
    this.runFilter();
  }

  private runFilter(): void {
    const term = this.filterEmployee.trim().toLowerCase();
    this.rows = this.allRows.filter((r) => {
      const matchesEmp = !term
        || r.employeeName.toLowerCase().includes(term)
        || r.employeeId.toLowerCase().includes(term);
      const matchesDept = this.filterDept === 'All Departments' || r.department === this.filterDept;
      const matchesPeriod = this.filterPeriod === 'All Periods' || r.payPeriod === this.filterPeriod;
      const matchesStatus = this.filterStatus === 'All Status' || r.status === this.statusKeyFromLabel(this.filterStatus);
      return matchesEmp && matchesDept && matchesPeriod && matchesStatus;
    });
  }

  // ===================== Run Payroll modal =====================
  openRunPayrollModal(): void {
    this.resetRunModal();
    this.showRunModal = true;
  }

  closeRunPayrollModal(): void {
    this.showRunModal = false;
  }

  private resetRunModal(): void {
    this.runStep = 1;
    this.selectedType = '';
    this.rpBulkPeriod = '';
    this.rpDeptSelected = '';
    this.rpDeptPeriod = '';
    this.rpEmpSelected = '';
    this.rpIndPeriod = '';
  }

  selectRunType(type: RunType): void {
    this.selectedType = type;
  }

  get deptSummary(): DeptStat | null {
    return this.rpDeptSelected ? this.deptStats[this.rpDeptSelected] ?? null : null;
  }

  runNext(): void {
    if (!this.selectedType) return;
    this.runStep = 2;
  }

  runBack(): void {
    this.runStep = 1;
  }

  get canProcess(): boolean {
    if (this.selectedType === 'bulk') return !!this.rpBulkPeriod;
    if (this.selectedType === 'department') return !!this.rpDeptSelected && !!this.rpDeptPeriod;
    if (this.selectedType === 'individual') return !!this.rpEmpSelected && !!this.rpIndPeriod;
    return false;
  }

  // ===================== Processing =====================
  processPayroll(): void {
    if (!this.canProcess) return;

    let payPeriod = '';
    let empLabel = '';

    if (this.selectedType === 'bulk') {
      payPeriod = this.rpBulkPeriod;
      empLabel = '186 employees';
    } else if (this.selectedType === 'department') {
      payPeriod = this.rpDeptPeriod;
      const stats = this.deptStats[this.rpDeptSelected];
      empLabel = `${this.rpDeptSelected} department (${stats ? stats.count : 0} employees)`;
    } else {
      payPeriod = this.rpIndPeriod;
      const emp = this.employees.find((e) => e.id === this.rpEmpSelected);
      empLabel = emp ? `${emp.name} (${emp.id})` : '';
    }

    this.showRunModal = false;
    this.progressPct = 0;
    this.progressDone = false;
    this.progressTitle = 'Processing Payroll...';
    this.progressSub = `Calculating salaries for ${empLabel} — ${payPeriod}`;
    this.showProgressModal = true;

    clearInterval(this.progressTimer);
    this.progressTimer = setInterval(() => {
      this.progressPct += Math.random() * 15 + 5;
      if (this.progressPct >= 100) {
        this.progressPct = 100;
        clearInterval(this.progressTimer);
        this.progressTitle = 'Payroll Processed!';
        this.progressSub = `${empLabel} processed successfully for ${payPeriod}`;
        this.progressDone = true;
        return;
      }
      this.progressPct = Math.round(this.progressPct);
      if (this.progressPct > 70) this.progressSub = `Finalizing payroll... (${payPeriod})`;
      else if (this.progressPct > 40) this.progressSub = `Validating deductions... (${payPeriod})`;
    }, 300);
  }

  viewResult(): void {
    this.showProgressModal = false;
    this.contentVisible = true;
    this.rows = this.allRows;
  }

  // ===================== Edit Salary modal =====================
  openEditModal(row: PayrollRow): void {
    this.editRow = row;
    this.edit = {
      basic: row.basic, hra: row.hra, da: row.da, convey: row.convey, medical: row.medical, special: row.special,
      pf: row.pf, esi: row.esi, profTax: row.profTax, tds: row.tds, present: row.present, absent: row.absent,
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  get editNetPay(): number {
    const gross = this.edit.basic + this.edit.hra + this.edit.da + this.edit.convey + this.edit.medical + this.edit.special;
    const ded = this.edit.pf + this.edit.esi + this.edit.profTax + this.edit.tds;
    return gross - ded;
  }

  saveEdit(): void {
    if (!this.editRow) return;
    const gross = this.edit.basic + this.edit.hra + this.edit.da + this.edit.convey + this.edit.medical + this.edit.special;
    Object.assign(this.editRow, this.edit, { gross, netPay: this.editNetPay });
    this.showEditModal = false;
  }

  // ===================== Add Salary Structure modal =====================
  openAddSalaryModal(): void {
    this.addStep = 1;
    this.add = {
      employeeId: '', basic: 25000, hra: 10000, da: 5000, convey: 3200, medical: 2000, special: 4800,
      pf: 3000, esi: 375, profTax: 200, tds: 2500,
    };
    this.customEarnings = [];
    this.customDeductions = [];
    this.showAddModal = true;
  }

  closeAddSalaryModal(): void {
    this.showAddModal = false;
  }

  addNext(): void {
    if (this.addStep < 3) this.addStep = (this.addStep + 1) as 1 | 2 | 3;
  }

  addBack(): void {
    if (this.addStep > 1) this.addStep = (this.addStep - 1) as 1 | 2 | 3;
  }

  addCustomEarning(): void {
    this.customEarnings.push({ id: this.customIdCounter++, label: '', amount: 0 });
  }

  removeCustomEarning(id: number): void {
    this.customEarnings = this.customEarnings.filter((e) => e.id !== id);
  }

  addCustomDeduction(): void {
    this.customDeductions.push({ id: this.customIdCounter++, label: '', amount: 0 });
  }

  removeCustomDeduction(id: number): void {
    this.customDeductions = this.customDeductions.filter((d) => d.id !== id);
  }

  get addNetPreview(): number {
    const extraEarn = this.customEarnings.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    const extraDed = this.customDeductions.reduce((s, d) => s + (Number(d.amount) || 0), 0);
    const gross = this.add.basic + this.add.hra + this.add.da + this.add.convey + this.add.medical + this.add.special + extraEarn;
    const ded = this.add.pf + this.add.esi + this.add.profTax + this.add.tds + extraDed;
    return gross - ded;
  }

  saveAddSalary(): void {
    // Hook this up to your salary-structure API/service.
    this.showAddModal = false;
  }
}
