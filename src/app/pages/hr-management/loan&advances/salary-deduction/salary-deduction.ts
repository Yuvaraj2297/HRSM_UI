import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SelectModule } from 'primeng/select';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader
} from '../../../../shared/primedatatable/primedatatable';

export interface LedgerAccount {
  id: number;
  sno?: number;
  refNo: string;
  empId: string;
  empName: string;
  empInitials: string;
  avatarColor: string;
  category: 'Personal Loan' | 'Medical Assistance' | 'Education Support' | 'Salary Advance' | 'Vehicle Loan';
  categoryIcon: string;
  department: 'Finance' | 'Engineering' | 'Design' | 'Marketing' | 'HR' | 'Operations';
  disbursedAmount: number;
  recoveredAmount: number;
  balanceDueAmount: number;
  progressPercent: number;
  tenureTotal: number;
  tenurePaid: number;
  status: 'Pending Repayment' | 'Fully Settled';
  interestRate: number;
  sanctionDate: string;
  installments?: LedgerInstallment[];
}

export interface LedgerInstallment {
  instNo: number;
  date: string;
  principal: number;
  interest: number;
  totalEmi: number;
  balance: number;
  status: 'Payroll Deducted' | 'Pending' | 'Fully Settled';
}

export interface ActiveFilterChip {
  id: string;
  label: string;
}

@Component({
  selector: 'app-salary-deduction',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, SelectModule, PrimeDataTable],
  templateUrl: './salary-deduction.html',
  styleUrl: './salary-deduction.scss',
})
export class SalaryDeduction implements OnInit {
  // Table Configuration
  tableHeader: PrimeTableHeader = {
    title: '',
    icon: ''
  };

  searchPlaceholder = 'Search employee name, code...';

  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.NO', width: '65px', sortable: false },
    { field: 'refNo', header: 'REF #', width: '130px', sortable: true, type: 'custom' },
    { field: 'employee', header: 'EMPLOYEE', width: '220px', sortable: true, type: 'custom' },
    { field: 'category', header: 'CATEGORY', width: '170px', sortable: true, type: 'custom' },
    { field: 'department', header: 'DEPARTMENT', width: '130px', sortable: true, type: 'custom' },
    { field: 'disbursed', header: 'DISBURSED (₹)', width: '150px', sortable: true, type: 'custom' },
    { field: 'recovered', header: 'RECOVERED (₹)', width: '150px', sortable: true, type: 'custom' },
    { field: 'balanceDue', header: 'BALANCE DUE (₹)', width: '150px', sortable: true, type: 'custom' },
    { field: 'progress', header: 'REPAYMENT PROGRESS', width: '190px', sortable: true, type: 'custom' },
    { field: 'tenure', header: 'EMI TENURE', width: '130px', sortable: true, type: 'custom' },
    { field: 'status', header: 'STATUS', width: '180px', sortable: true, type: 'custom' },
    { field: 'action', header: 'ACTION', width: '130px', sortable: false, type: 'custom' },
  ];

  // Master Accounts Dataset (20 accounts: 12 Pending Repayments, 8 Fully Settled)
  allAccounts: LedgerAccount[] = [
    {
      id: 1,
      refNo: 'LN-2026-001',
      empId: 'EMP0001',
      empName: 'Amelia Curr',
      empInitials: 'AC',
      avatarColor: 'var(--blue-450)',
      category: 'Personal Loan',
      categoryIcon: 'bi bi-person-fill',
      department: 'Finance',
      disbursedAmount: 120000,
      recoveredAmount: 40000,
      balanceDueAmount: 80000,
      progressPercent: 33.3,
      tenureTotal: 12,
      tenurePaid: 4,
      status: 'Pending Repayment',
      interestRate: 0.0,
      sanctionDate: '01-May-2026'
    },
    {
      id: 2,
      refNo: 'LN-2026-004',
      empId: 'EMP0003',
      empName: 'David Anderson',
      empInitials: 'DA',
      avatarColor: 'var(--danger)',
      category: 'Medical Assistance',
      categoryIcon: 'bi bi-heart-pulse',
      department: 'Engineering',
      disbursedAmount: 150000,
      recoveredAmount: 50000,
      balanceDueAmount: 100000,
      progressPercent: 33.3,
      tenureTotal: 18,
      tenurePaid: 6,
      status: 'Pending Repayment',
      interestRate: 0.0,
      sanctionDate: '15-Mar-2026'
    },
    {
      id: 3,
      refNo: 'LN-2026-009',
      empId: 'EMP0004',
      empName: 'Emily Clark',
      empInitials: 'EC',
      avatarColor: 'var(--green-350)',
      category: 'Education Support',
      categoryIcon: 'bi bi-mortarboard',
      department: 'Design',
      disbursedAmount: 120000,
      recoveredAmount: 120000,
      balanceDueAmount: 0,
      progressPercent: 100,
      tenureTotal: 12,
      tenurePaid: 12,
      status: 'Fully Settled',
      interestRate: 4.5,
      sanctionDate: '10-Jan-2025'
    },
    {
      id: 4,
      refNo: 'LN-2026-012',
      empId: 'EMP0006',
      empName: 'Michael Brown',
      empInitials: 'MB',
      avatarColor: 'var(--blue-500)',
      category: 'Personal Loan',
      categoryIcon: 'bi bi-person-fill',
      department: 'Engineering',
      disbursedAmount: 150000,
      recoveredAmount: 50000,
      balanceDueAmount: 100000,
      progressPercent: 33.3,
      tenureTotal: 18,
      tenurePaid: 6,
      status: 'Pending Repayment',
      interestRate: 0.0,
      sanctionDate: '01-Apr-2026'
    },
    {
      id: 5,
      refNo: 'ADV-2026-077',
      empId: 'EMP0008',
      empName: 'James Taylor',
      empInitials: 'JT',
      avatarColor: 'var(--warning)',
      category: 'Salary Advance',
      categoryIcon: 'bi bi-cash-stack',
      department: 'Finance',
      disbursedAmount: 45000,
      recoveredAmount: 45000,
      balanceDueAmount: 0,
      progressPercent: 100,
      tenureTotal: 3,
      tenurePaid: 3,
      status: 'Fully Settled',
      interestRate: 0.0,
      sanctionDate: '01-Jun-2026'
    },
    {
      id: 6,
      refNo: 'LN-2026-015',
      empId: 'EMP0011',
      empName: 'Sophia Wilson',
      empInitials: 'SW',
      avatarColor: 'var(--pink-450)',
      category: 'Medical Assistance',
      categoryIcon: 'bi bi-heart-pulse',
      department: 'HR',
      disbursedAmount: 200000,
      recoveredAmount: 80000,
      balanceDueAmount: 120000,
      progressPercent: 40.0,
      tenureTotal: 20,
      tenurePaid: 8,
      status: 'Pending Repayment',
      interestRate: 0.0,
      sanctionDate: '01-Feb-2026'
    },
    {
      id: 7,
      refNo: 'LN-2026-019',
      empId: 'EMP0014',
      empName: 'Robert Johnson',
      empInitials: 'RJ',
      avatarColor: 'var(--teal-350-2)',
      category: 'Vehicle Loan',
      categoryIcon: 'bi bi-car-front',
      department: 'Engineering',
      disbursedAmount: 300000,
      recoveredAmount: 100000,
      balanceDueAmount: 200000,
      progressPercent: 33.3,
      tenureTotal: 24,
      tenurePaid: 8,
      status: 'Pending Repayment',
      interestRate: 6.0,
      sanctionDate: '10-Jan-2026'
    },
    {
      id: 8,
      refNo: 'ADV-2026-085',
      empId: 'EMP0017',
      empName: 'Olivia Davis',
      empInitials: 'OD',
      avatarColor: 'var(--purple-500)',
      category: 'Salary Advance',
      categoryIcon: 'bi bi-cash-stack',
      department: 'Design',
      disbursedAmount: 35000,
      recoveredAmount: 35000,
      balanceDueAmount: 0,
      progressPercent: 100,
      tenureTotal: 3,
      tenurePaid: 3,
      status: 'Fully Settled',
      interestRate: 0.0,
      sanctionDate: '15-May-2026'
    },
    {
      id: 9,
      refNo: 'LN-2026-022',
      empId: 'EMP0020',
      empName: 'William Martinez',
      empInitials: 'WM',
      avatarColor: 'var(--teal-350)',
      category: 'Education Support',
      categoryIcon: 'bi bi-mortarboard',
      department: 'Marketing',
      disbursedAmount: 180000,
      recoveredAmount: 135000,
      balanceDueAmount: 45000,
      progressPercent: 75.0,
      tenureTotal: 12,
      tenurePaid: 9,
      status: 'Pending Repayment',
      interestRate: 4.5,
      sanctionDate: '01-Dec-2025'
    },
    {
      id: 10,
      refNo: 'LN-2026-026',
      empId: 'EMP0023',
      empName: 'Ava Hernandez',
      empInitials: 'AH',
      avatarColor: 'var(--orange-350)',
      category: 'Personal Loan',
      categoryIcon: 'bi bi-person-fill',
      department: 'Engineering',
      disbursedAmount: 100000,
      recoveredAmount: 75000,
      balanceDueAmount: 25000,
      progressPercent: 75.0,
      tenureTotal: 8,
      tenurePaid: 6,
      status: 'Pending Repayment',
      interestRate: 0.0,
      sanctionDate: '01-Mar-2026'
    },
    {
      id: 11,
      refNo: 'LN-2026-030',
      empId: 'EMP0025',
      empName: 'Lucas Miller',
      empInitials: 'LM',
      avatarColor: 'var(--green-350)',
      category: 'Medical Assistance',
      categoryIcon: 'bi bi-heart-pulse',
      department: 'Finance',
      disbursedAmount: 150000,
      recoveredAmount: 150000,
      balanceDueAmount: 0,
      progressPercent: 100,
      tenureTotal: 12,
      tenurePaid: 12,
      status: 'Fully Settled',
      interestRate: 0.0,
      sanctionDate: '01-Aug-2025'
    },
    {
      id: 12,
      refNo: 'ADV-2026-092',
      empId: 'EMP0028',
      empName: 'Mia Garcia',
      empInitials: 'MG',
      avatarColor: 'var(--blue-500)',
      category: 'Salary Advance',
      categoryIcon: 'bi bi-cash-stack',
      department: 'Operations',
      disbursedAmount: 50000,
      recoveredAmount: 50000,
      balanceDueAmount: 0,
      progressPercent: 100,
      tenureTotal: 2,
      tenurePaid: 2,
      status: 'Fully Settled',
      interestRate: 0.0,
      sanctionDate: '01-Jul-2026'
    },
    {
      id: 13,
      refNo: 'LN-2026-034',
      empId: 'EMP0031',
      empName: 'Benjamin Lee',
      empInitials: 'BL',
      avatarColor: 'var(--blue-450)',
      category: 'Personal Loan',
      categoryIcon: 'bi bi-person-fill',
      department: 'Marketing',
      disbursedAmount: 120000,
      recoveredAmount: 90000,
      balanceDueAmount: 30000,
      progressPercent: 75.0,
      tenureTotal: 12,
      tenurePaid: 9,
      status: 'Pending Repayment',
      interestRate: 0.0,
      sanctionDate: '15-Nov-2025'
    },
    {
      id: 14,
      refNo: 'LN-2026-038',
      empId: 'EMP0035',
      empName: 'Charlotte White',
      empInitials: 'CW',
      avatarColor: 'var(--danger)',
      category: 'Vehicle Loan',
      categoryIcon: 'bi bi-car-front',
      department: 'Engineering',
      disbursedAmount: 250000,
      recoveredAmount: 100000,
      balanceDueAmount: 150000,
      progressPercent: 40.0,
      tenureTotal: 24,
      tenurePaid: 10,
      status: 'Pending Repayment',
      interestRate: 6.0,
      sanctionDate: '01-Jan-2026'
    },
    {
      id: 15,
      refNo: 'LN-2026-042',
      empId: 'EMP0039',
      empName: 'Daniel Harris',
      empInitials: 'DH',
      avatarColor: 'var(--purple-500)',
      category: 'Education Support',
      categoryIcon: 'bi bi-mortarboard',
      department: 'Design',
      disbursedAmount: 160000,
      recoveredAmount: 160000,
      balanceDueAmount: 0,
      progressPercent: 100,
      tenureTotal: 16,
      tenurePaid: 16,
      status: 'Fully Settled',
      interestRate: 4.5,
      sanctionDate: '01-Mar-2025'
    },
    {
      id: 16,
      refNo: 'ADV-2026-098',
      empId: 'EMP0041',
      empName: 'Harper Martin',
      empInitials: 'HM',
      avatarColor: 'var(--warning)',
      category: 'Salary Advance',
      categoryIcon: 'bi bi-cash-stack',
      department: 'Finance',
      disbursedAmount: 40000,
      recoveredAmount: 40000,
      balanceDueAmount: 0,
      progressPercent: 100,
      tenureTotal: 2,
      tenurePaid: 2,
      status: 'Fully Settled',
      interestRate: 0.0,
      sanctionDate: '01-Jun-2026'
    },
    {
      id: 17,
      refNo: 'LN-2026-045',
      empId: 'EMP0044',
      empName: 'Alexander King',
      empInitials: 'AK',
      avatarColor: 'var(--teal-350-2)',
      category: 'Medical Assistance',
      categoryIcon: 'bi bi-heart-pulse',
      department: 'Operations',
      disbursedAmount: 110000,
      recoveredAmount: 55000,
      balanceDueAmount: 55000,
      progressPercent: 50.0,
      tenureTotal: 10,
      tenurePaid: 5,
      status: 'Pending Repayment',
      interestRate: 0.0,
      sanctionDate: '01-Apr-2026'
    },
    {
      id: 18,
      refNo: 'LN-2026-048',
      empId: 'EMP0047',
      empName: 'Ella Wright',
      empInitials: 'EW',
      avatarColor: 'var(--pink-450)',
      category: 'Personal Loan',
      categoryIcon: 'bi bi-person-fill',
      department: 'HR',
      disbursedAmount: 130000,
      recoveredAmount: 65000,
      balanceDueAmount: 65000,
      progressPercent: 50.0,
      tenureTotal: 12,
      tenurePaid: 6,
      status: 'Pending Repayment',
      interestRate: 0.0,
      sanctionDate: '01-Feb-2026'
    },
    {
      id: 19,
      refNo: 'LN-2026-052',
      empId: 'EMP0050',
      empName: 'Henry Lopez',
      empInitials: 'HL',
      avatarColor: 'var(--teal-350)',
      category: 'Vehicle Loan',
      categoryIcon: 'bi bi-car-front',
      department: 'Engineering',
      disbursedAmount: 180000,
      recoveredAmount: 75000,
      balanceDueAmount: 105000,
      progressPercent: 41.6,
      tenureTotal: 18,
      tenurePaid: 8,
      status: 'Pending Repayment',
      interestRate: 6.0,
      sanctionDate: '15-Dec-2025'
    },
    {
      id: 20,
      refNo: 'LN-2026-055',
      empId: 'EMP0053',
      empName: 'Chloe Scott',
      empInitials: 'CS',
      avatarColor: 'var(--green-350)',
      category: 'Education Support',
      categoryIcon: 'bi bi-mortarboard',
      department: 'Design',
      disbursedAmount: 100000,
      recoveredAmount: 100000,
      balanceDueAmount: 0,
      progressPercent: 100,
      tenureTotal: 10,
      tenurePaid: 10,
      status: 'Fully Settled',
      interestRate: 4.5,
      sanctionDate: '01-May-2025'
    },
  ];

  // Filtered dataset displayed in PrimeDataTable
  displayedAccounts: LedgerAccount[] = [];

  // Active filter chips list
  activeChips: ActiveFilterChip[] = [];

  // Active status tab: 'all' | 'pending' | 'settled'
  activeStatusTab: 'all' | 'pending' | 'settled' = 'all';

  // Active Quick Preset
  activePreset: string | null = null;

  // Dropdown filter selections
  selectedPaymentStatus: string | null = null;
  selectedCategory: string | null = null;
  selectedProgress: string | null = null;
  selectedDepartment: string | null = null;

  // Options for p-select dropdowns
  paymentStatusOptions = [
    { label: 'All Payment Statuses', value: null },
    { label: 'Pending Repayment', value: 'Pending Repayment' },
    { label: 'Fully Settled', value: 'Fully Settled' },
  ];

  categoryOptions = [
    { label: 'All Categories', value: null },
    { label: 'Personal Loan', value: 'Personal Loan' },
    { label: 'Medical Assistance', value: 'Medical Assistance' },
    { label: 'Education Support', value: 'Education Support' },
    { label: 'Salary Advance', value: 'Salary Advance' },
    { label: 'Vehicle Loan', value: 'Vehicle Loan' },
  ];

  progressOptions = [
    { label: 'All Progress', value: null },
    { label: '< 30% Repaid', value: 'low' },
    { label: '30% - 70% Repaid', value: 'mid' },
    { label: '> 70% Repaid', value: 'high' },
    { label: '100% Cleared', value: 'cleared' },
  ];

  departmentOptions = [
    { label: 'All Departments', value: null },
    { label: 'Finance', value: 'Finance' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Design', value: 'Design' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'HR', value: 'HR' },
    { label: 'Operations', value: 'Operations' },
  ];

  // Statement Modal State
  statementModalOpen = false;
  selectedAccountForStatement: LedgerAccount | null = null;
  statementInstallments: LedgerInstallment[] = [];

  ngOnInit(): void {
    this.applyFilters();
  }

  // KPI Calculations
  get totalDisbursed(): number {
    return this.allAccounts.reduce((acc, a) => acc + a.disbursedAmount, 0);
  }

  get totalRecovered(): number {
    return this.allAccounts.reduce((acc, a) => acc + a.recoveredAmount, 0);
  }

  get totalPendingBalance(): number {
    return this.allAccounts.reduce((acc, a) => acc + a.balanceDueAmount, 0);
  }

  get pendingAccountsCount(): number {
    return this.allAccounts.filter(a => a.status === 'Pending Repayment').length;
  }

  get settledAccountsCount(): number {
    return this.allAccounts.filter(a => a.status === 'Fully Settled').length;
  }

  get recoveredPercentage(): string {
    if (this.totalDisbursed === 0) return '0.0%';
    return ((this.totalRecovered / this.totalDisbursed) * 100).toFixed(1) + '%';
  }

  get settledRecoveredAmount(): number {
    return this.allAccounts
      .filter(a => a.status === 'Fully Settled')
      .reduce((acc, a) => acc + a.recoveredAmount, 0);
  }

  // Filter application
  applyFilters(): void {
    let list = [...this.allAccounts];

    // Status Tab Filter
    if (this.activeStatusTab === 'pending') {
      list = list.filter(a => a.status === 'Pending Repayment');
    } else if (this.activeStatusTab === 'settled') {
      list = list.filter(a => a.status === 'Fully Settled');
    }

    // Quick Presets
    if (this.activePreset === 'high-balance') {
      list = list.filter(a => a.balanceDueAmount >= 100000);
    } else if (this.activePreset === 'near-completion') {
      list = list.filter(a => a.progressPercent >= 70 && a.status === 'Pending Repayment');
    } else if (this.activePreset === 'salary-advance') {
      list = list.filter(a => a.category === 'Salary Advance');
    } else if (this.activePreset === 'medical-assistance') {
      list = list.filter(a => a.category === 'Medical Assistance');
    } else if (this.activePreset === 'engineering') {
      list = list.filter(a => a.department === 'Engineering');
    } else if (this.activePreset === 'long-tenure') {
      list = list.filter(a => a.tenureTotal > 12);
    }

    // Dropdown Filters
    if (this.selectedPaymentStatus) {
      list = list.filter(a => a.status === this.selectedPaymentStatus);
    }

    if (this.selectedCategory) {
      list = list.filter(a => a.category === this.selectedCategory);
    }

    if (this.selectedDepartment) {
      list = list.filter(a => a.department === this.selectedDepartment);
    }

    if (this.selectedProgress) {
      if (this.selectedProgress === 'low') {
        list = list.filter(a => a.progressPercent < 30);
      } else if (this.selectedProgress === 'mid') {
        list = list.filter(a => a.progressPercent >= 30 && a.progressPercent <= 70);
      } else if (this.selectedProgress === 'high') {
        list = list.filter(a => a.progressPercent > 70 && a.progressPercent < 100);
      } else if (this.selectedProgress === 'cleared') {
        list = list.filter(a => a.progressPercent === 100);
      }
    }

    this.displayedAccounts = list.map((item, index) => ({
      ...item,
      sno: index + 1
    }));

    this.updateActiveChips();
  }

  setStatusTab(tab: 'all' | 'pending' | 'settled'): void {
    this.activeStatusTab = tab;
    this.applyFilters();
  }

  togglePreset(preset: string): void {
    if (this.activePreset === preset) {
      this.activePreset = null;
    } else {
      this.activePreset = preset;
    }
    this.applyFilters();
  }

  removeChip(id: string): void {
    if (id === 'preset') {
      this.activePreset = null;
    } else if (id === 'statusTab') {
      this.activeStatusTab = 'all';
    } else if (id === 'paymentStatus') {
      this.selectedPaymentStatus = null;
    } else if (id === 'category') {
      this.selectedCategory = null;
    } else if (id === 'progress') {
      this.selectedProgress = null;
    } else if (id === 'department') {
      this.selectedDepartment = null;
    }
    this.applyFilters();
  }

  private updateActiveChips(): void {
    const chips: ActiveFilterChip[] = [];

    if (this.activeStatusTab !== 'all') {
      chips.push({
        id: 'statusTab',
        label: `Status: ${this.activeStatusTab === 'pending' ? 'Pending Repayments' : 'Fully Settled'}`
      });
    }

    if (this.activePreset) {
      const presetLabels: Record<string, string> = {
        'high-balance': 'Preset: High Balance (≥ ₹1,00,000)',
        'near-completion': 'Preset: Near Completion (> 70%)',
        'salary-advance': 'Preset: Salary Advance',
        'medical-assistance': 'Preset: Medical Assistance',
        'engineering': 'Preset: Engineering',
        'long-tenure': 'Preset: Long Tenure (> 12 EMIs)'
      };
      chips.push({
        id: 'preset',
        label: presetLabels[this.activePreset] || `Preset: ${this.activePreset}`
      });
    }

    if (this.selectedPaymentStatus) {
      chips.push({
        id: 'paymentStatus',
        label: `Payment: ${this.selectedPaymentStatus}`
      });
    }

    if (this.selectedCategory) {
      chips.push({
        id: 'category',
        label: `Category: ${this.selectedCategory}`
      });
    }

    if (this.selectedProgress) {
      const progObj = this.progressOptions.find(p => p.value === this.selectedProgress);
      chips.push({
        id: 'progress',
        label: `Progress: ${progObj ? progObj.label : this.selectedProgress}`
      });
    }

    if (this.selectedDepartment) {
      chips.push({
        id: 'department',
        label: `Dept: ${this.selectedDepartment}`
      });
    }

    this.activeChips = chips;
  }

  resetFilters(): void {
    this.activeStatusTab = 'all';
    this.activePreset = null;
    this.selectedPaymentStatus = null;
    this.selectedCategory = null;
    this.selectedProgress = null;
    this.selectedDepartment = null;
    this.applyFilters();
  }

  // Statement Modal
  openStatement(account: LedgerAccount): void {
    this.selectedAccountForStatement = account;
    this.generateInstallments(account);
    this.statementModalOpen = true;
  }

  closeStatement(): void {
    this.statementModalOpen = false;
    this.selectedAccountForStatement = null;
    this.statementInstallments = [];
  }

  printStatement(): void {
    window.print();
  }

  exportExcel(): void {
    // Basic CSV export of displayed accounts
    const headers = ['S.No', 'Ref #', 'Employee ID', 'Employee Name', 'Category', 'Department', 'Disbursed (₹)', 'Recovered (₹)', 'Balance Due (₹)', 'Repayment %', 'Tenure', 'Status'];
    const rows = this.displayedAccounts.map(a => [
      a.sno,
      a.refNo,
      a.empId,
      `"${a.empName}"`,
      `"${a.category}"`,
      `"${a.department}"`,
      a.disbursedAmount,
      a.recoveredAmount,
      a.balanceDueAmount,
      `${a.progressPercent}%`,
      `"${a.tenurePaid} of ${a.tenureTotal} EMIs"`,
      `"${a.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Loan_Ledger_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private generateInstallments(account: LedgerAccount): void {
    const list: LedgerInstallment[] = [];
    const monthlyPrincipal = Math.round(account.disbursedAmount / account.tenureTotal);
    let remBalance = account.disbursedAmount;

    for (let i = 1; i <= account.tenureTotal; i++) {
      const isPaid = i <= account.tenurePaid;
      const interest = account.interestRate > 0 ? Math.round((remBalance * (account.interestRate / 100)) / 12) : 0;
      const totalEmi = monthlyPrincipal + interest;
      remBalance = Math.max(0, remBalance - monthlyPrincipal);

      const d = new Date(2026, 4 + i, 30);
      const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      list.push({
        instNo: i,
        date: dateStr,
        principal: monthlyPrincipal,
        interest: interest,
        totalEmi: totalEmi,
        balance: remBalance,
        status: isPaid ? (remBalance === 0 ? 'Fully Settled' : 'Payroll Deducted') : 'Pending'
      });
    }

    this.statementInstallments = list;
  }

  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }
}
