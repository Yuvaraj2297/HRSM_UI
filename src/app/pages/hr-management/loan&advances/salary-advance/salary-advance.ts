import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SelectModule } from 'primeng/select';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
  PrimeTableActions
} from '../../../../shared/primedatatable/primedatatable';
import { CalendarDatepickerDirective } from '../../../../common/directives/datepicker';

export interface LoanTransaction {
  date: string;
  ref: string;
  type: string;
  amount: number;
  isCredit: boolean;
  balance: number;
  mode: string;
  by: string;
  status: string;
  filter: 'disburse' | 'payroll' | 'manual';
}

export interface LoanInstallment {
  instNo: number;
  cycle: string;
  openingBal: number;
  principal: number;
  interest: number;
  emi: number;
  closingBal: number;
  mode: string;
  status: 'Deducted' | 'Upcoming' | 'Scheduled' | 'Pending';
  statusCat: 'deducted' | 'upcoming' | 'scheduled';
}

export interface LoanAccount {
  id: number;
  sno?: number;
  ref: string;
  empId: string;
  name: string;
  avatar: string;
  avatarColor: string;
  empInitials: string;
  dept: string;
  salary: string;
  purpose: string;
  category: 'Personal Loan' | 'Salary Advance' | 'Medical Assistance' | 'Education Support';
  principal: number;
  tenure: number;
  emi: number;
  repaid: number;
  balance: number;
  paidCount: number;
  startDate: string;
  maturityDate: string;
  startMonth: string;
  nextEmiDate: string;
  status: 'approved' | 'pending' | 'completed' | 'rejected';
  statusText: string;
  interestRate: number;
  bankAccount: string;
  approvedBy: string;
  transactions: LoanTransaction[];
}

export interface ActiveFilterChip {
  id: string;
  label: string;
}

@Component({
  selector: 'app-salary-advance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,  SelectModule, PrimeDataTable, CalendarDatepickerDirective],
  templateUrl: './salary-advance.html',
  styleUrl: './salary-advance.scss'
})
export class SalaryAdvance implements OnInit {
  // Table Configuration
  tableHeader: PrimeTableHeader = {
    title: '',
    icon: ''
  };

  searchPlaceholder = 'Search employee name, ID, loan ref...';

  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.NO', width: '65px', sortable: false },
    { field: 'ref', header: 'REF #', width: '135px', sortable: true, type: 'custom' },
    { field: 'employee', header: 'EMPLOYEE', width: '230px', sortable: true, type: 'custom' },
    { field: 'category', header: 'CATEGORY', width: '175px', sortable: true, type: 'custom' },
    { field: 'principal', header: 'PRINCIPAL', width: '130px', sortable: true, type: 'custom' },
    { field: 'tenureEmi', header: 'TENURE / EMI', width: '145px', sortable: true, type: 'custom' },
    { field: 'repaidBalance', header: 'REPAID / BALANCE', width: '185px', sortable: true, type: 'custom' },
    { field: 'startDate', header: 'REQUEST DATE', width: '130px', sortable: true, type: 'custom' },
    { field: 'status', header: 'STATUS', width: '165px', sortable: true, type: 'custom' },
    { field: 'actions', header: 'ACTIONS', width: '160px', sortable: false, type: 'custom' }
  ];

  // Master Dataset from loan-requests.php
  loans: LoanAccount[] = [
    {
      id: 1,
      ref: 'LN-2026-001',
      empId: 'EMP0001',
      name: 'Amelia Curr',
      avatar: './assets/profile-1.jpg',
      avatarColor: 'var(--green-350)',
      empInitials: 'AC',
      dept: 'Design',
      salary: '₹75,000',
      purpose: 'Personal relocation & family support',
      category: 'Personal Loan',
      principal: 120000,
      tenure: 12,
      emi: 10000,
      repaid: 40000,
      balance: 80000,
      paidCount: 4,
      startDate: '15-Jan-2026',
      maturityDate: '31-Dec-2026',
      startMonth: 'Jan 2026',
      nextEmiDate: '31-May-2026',
      status: 'approved',
      statusText: 'Active',
      interestRate: 0.0,
      bankAccount: 'HDFC Bank ••••• 4920',
      approvedBy: 'HR Director & Finance Controller',
      transactions: [
        { date: '15-Jan-2026', ref: 'TXN-DSB-101', type: 'Disbursement', amount: 120000, isCredit: true, balance: 120000, mode: 'Direct Bank Transfer', by: 'Accounts Team', status: 'Completed', filter: 'disburse' },
        { date: '31-Jan-2026', ref: 'PAY-JAN-2026', type: 'Payroll Auto-Debit', amount: 10000, isCredit: false, balance: 110000, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '28-Feb-2026', ref: 'PAY-FEB-2026', type: 'Payroll Auto-Debit', amount: 10000, isCredit: false, balance: 100000, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '31-Mar-2026', ref: 'PAY-MAR-2026', type: 'Payroll Auto-Debit', amount: 10000, isCredit: false, balance: 90000, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '30-Apr-2026', ref: 'PAY-APR-2026', type: 'Payroll Auto-Debit', amount: 10000, isCredit: false, balance: 80000, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' }
      ]
    },
    {
      id: 2,
      ref: 'ADV-2026-088',
      empId: 'EMP0002',
      name: 'Daniel Martinez',
      avatar: './assets/profile-2.jpg',
      avatarColor: 'var(--warning)',
      empInitials: 'DM',
      dept: 'Engineering',
      salary: '₹95,000',
      purpose: 'Festival season advance',
      category: 'Salary Advance',
      principal: 30000,
      tenure: 1,
      emi: 30000,
      repaid: 0,
      balance: 30000,
      paidCount: 0,
      startDate: '28-Feb-2026',
      maturityDate: '31-Mar-2026',
      startMonth: 'Mar 2026',
      nextEmiDate: '31-Mar-2026',
      status: 'pending',
      statusText: 'Pending Approval',
      interestRate: 0.0,
      bankAccount: 'ICICI Bank ••••• 3819',
      approvedBy: 'Pending Review',
      transactions: [
        { date: '28-Feb-2026', ref: 'REQ-ADV-088', type: 'Advance Request', amount: 30000, isCredit: true, balance: 30000, mode: 'Pending Disbursal', by: 'Employee Self-Service', status: 'Pending Review', filter: 'disburse' }
      ]
    },
    {
      id: 3,
      ref: 'LN-2026-004',
      empId: 'EMP0003',
      name: 'David Anderson',
      avatar: './assets/profile-3.jpg',
      avatarColor: 'var(--danger)',
      empInitials: 'DA',
      dept: 'Engineering',
      salary: '₹1,20,000',
      purpose: 'Medical emergency hospitalization',
      category: 'Medical Assistance',
      principal: 200000,
      tenure: 24,
      emi: 8333,
      repaid: 100000,
      balance: 100000,
      paidCount: 12,
      startDate: '10-Nov-2025',
      maturityDate: '31-Oct-2027',
      startMonth: 'Nov 2025',
      nextEmiDate: '31-May-2026',
      status: 'approved',
      statusText: 'Active',
      interestRate: 0.0,
      bankAccount: 'Axis Bank ••••• 9102',
      approvedBy: 'HR Director & CFO',
      transactions: [
        { date: '10-Nov-2025', ref: 'TXN-DSB-094', type: 'Disbursement', amount: 200000, isCredit: true, balance: 200000, mode: 'Direct NEFT Transfer', by: 'Accounts Team', status: 'Completed', filter: 'disburse' },
        { date: '30-Nov-2025', ref: 'PAY-NOV-2025', type: 'Payroll Auto-Debit', amount: 8333, isCredit: false, balance: 191667, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '31-Dec-2025', ref: 'PAY-DEC-2025', type: 'Payroll Auto-Debit', amount: 8333, isCredit: false, balance: 183334, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '31-Jan-2026', ref: 'PAY-JAN-2026', type: 'Payroll Auto-Debit', amount: 8333, isCredit: false, balance: 175001, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '28-Feb-2026', ref: 'PAY-FEB-2026', type: 'Payroll Auto-Debit', amount: 8333, isCredit: false, balance: 166668, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '15-Mar-2026', ref: 'MAN-PRP-401', type: 'Manual Prepayment', amount: 66668, isCredit: false, balance: 100000, mode: 'UPI Transfer', by: 'Finance Admin', status: 'Completed', filter: 'manual' }
      ]
    },
    {
      id: 4,
      ref: 'LN-2026-009',
      empId: 'EMP0004',
      name: 'Emily Clark',
      avatar: './assets/profile-4.jpg',
      avatarColor: 'var(--blue-450)',
      empInitials: 'EC',
      dept: 'Finance',
      salary: '₹85,000',
      purpose: 'Higher education course certification',
      category: 'Education Support',
      principal: 80000,
      tenure: 8,
      emi: 10000,
      repaid: 80000,
      balance: 0,
      paidCount: 8,
      startDate: '05-Jun-2025',
      maturityDate: '31-Jan-2026',
      startMonth: 'Jun 2025',
      nextEmiDate: 'Completed',
      status: 'completed',
      statusText: 'Settled',
      interestRate: 0.0,
      bankAccount: 'SBI Bank ••••• 8210',
      approvedBy: 'VP Operations',
      transactions: [
        { date: '05-Jun-2025', ref: 'TXN-DSB-077', type: 'Disbursement', amount: 80000, isCredit: true, balance: 80000, mode: 'Direct Bank Transfer', by: 'Accounts Team', status: 'Completed', filter: 'disburse' },
        { date: '30-Jun-2025', ref: 'PAY-JUN-2025', type: 'Payroll Auto-Debit', amount: 10000, isCredit: false, balance: 70000, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '31-Jul-2025', ref: 'PAY-JUL-2025', type: 'Payroll Auto-Debit', amount: 10000, isCredit: false, balance: 60000, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '31-Aug-2025', ref: 'PAY-AUG-2025', type: 'Payroll Auto-Debit', amount: 10000, isCredit: false, balance: 50000, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '30-Sep-2025', ref: 'PAY-SEP-2025', type: 'Payroll Auto-Debit', amount: 10000, isCredit: false, balance: 40000, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '31-Oct-2025', ref: 'PAY-OCT-2025', type: 'Payroll Auto-Debit', amount: 10000, isCredit: false, balance: 30000, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '30-Nov-2025', ref: 'PAY-NOV-2025', type: 'Payroll Auto-Debit', amount: 10000, isCredit: false, balance: 20000, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '31-Dec-2025', ref: 'PAY-DEC-2025', type: 'Payroll Auto-Debit', amount: 10000, isCredit: false, balance: 10000, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '31-Jan-2026', ref: 'PAY-JAN-2026', type: 'Payroll Auto-Debit', amount: 10000, isCredit: false, balance: 0, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' }
      ]
    },
    {
      id: 5,
      ref: 'ADV-2026-092',
      empId: 'EMP0005',
      name: 'Sophia Johnson',
      avatar: './assets/profile-1.jpg',
      avatarColor: 'var(--pink-450)',
      empInitials: 'SJ',
      dept: 'Marketing',
      salary: '₹68,000',
      purpose: 'Short-term personal necessity',
      category: 'Salary Advance',
      principal: 20000,
      tenure: 2,
      emi: 10000,
      repaid: 0,
      balance: 20000,
      paidCount: 0,
      startDate: '01-Mar-2026',
      maturityDate: '30-Apr-2026',
      startMonth: 'Apr 2026',
      nextEmiDate: '30-Apr-2026',
      status: 'pending',
      statusText: 'Pending Approval',
      interestRate: 0.0,
      bankAccount: 'Kotak Bank ••••• 1192',
      approvedBy: 'Pending Review',
      transactions: [
        { date: '01-Mar-2026', ref: 'REQ-ADV-092', type: 'Advance Request', amount: 20000, isCredit: true, balance: 20000, mode: 'Pending Disbursal', by: 'Employee Self-Service', status: 'Pending Review', filter: 'disburse' }
      ]
    },
    {
      id: 6,
      ref: 'LN-2026-012',
      empId: 'EMP0006',
      name: 'Michael Brown',
      avatar: './assets/profile-2.jpg',
      avatarColor: 'var(--blue-500)',
      empInitials: 'MB',
      dept: 'Design',
      salary: '₹88,000',
      purpose: 'Personal home improvement',
      category: 'Personal Loan',
      principal: 150000,
      tenure: 18,
      emi: 8333,
      repaid: 50000,
      balance: 100000,
      paidCount: 6,
      startDate: '20-Oct-2025',
      maturityDate: '30-Apr-2027',
      startMonth: 'Nov 2025',
      nextEmiDate: '31-May-2026',
      status: 'approved',
      statusText: 'Active',
      interestRate: 0.0,
      bankAccount: 'Axis Bank ••••• 3390',
      approvedBy: 'HR Director',
      transactions: [
        { date: '20-Oct-2025', ref: 'TXN-DSB-089', type: 'Disbursement', amount: 150000, isCredit: true, balance: 150000, mode: 'Direct Bank Transfer', by: 'Accounts Team', status: 'Completed', filter: 'disburse' },
        { date: '30-Nov-2025', ref: 'PAY-NOV-2025', type: 'Payroll Auto-Debit', amount: 8333, isCredit: false, balance: 141667, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '31-Dec-2025', ref: 'PAY-DEC-2025', type: 'Payroll Auto-Debit', amount: 8333, isCredit: false, balance: 133334, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '31-Jan-2026', ref: 'PAY-JAN-2026', type: 'Payroll Auto-Debit', amount: 8333, isCredit: false, balance: 125001, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '28-Feb-2026', ref: 'PAY-FEB-2026', type: 'Payroll Auto-Debit', amount: 8333, isCredit: false, balance: 116668, mode: 'Salary Slip Deduction', by: 'Payroll Engine', status: 'Completed', filter: 'payroll' },
        { date: '10-Mar-2026', ref: 'MAN-PAY-112', type: 'Manual Partial Payment', amount: 16668, isCredit: false, balance: 100000, mode: 'Online UPI', by: 'Finance Admin', status: 'Completed', filter: 'manual' }
      ]
    }
  ];

  displayedLoans: LoanAccount[] = [];

  // Filter State
  filtersOpen = false;
  searchFilter = '';
  selectedCategory: string | null = null;
  selectedDept: string | null = null;
  selectedStatus: string | null = null;
  activeChips: ActiveFilterChip[] = [];

  // Dropdown Options for p-select
  categoryOptions = [
    { label: 'All Categories', value: null },
    { label: 'Personal Loan', value: 'Personal Loan' },
    { label: 'Salary Advance', value: 'Salary Advance' },
    { label: 'Medical Assistance', value: 'Medical Assistance' },
    { label: 'Education Support', value: 'Education Support' }
  ];

  departmentOptions = [
    { label: 'All Departments', value: null },
    { label: 'Design', value: 'Design' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Marketing', value: 'Marketing' }
  ];

  statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Active / Approved', value: 'approved' },
    { label: 'Pending Approval', value: 'pending' },
    { label: 'Completed / Settled', value: 'completed' },
    { label: 'Rejected', value: 'rejected' }
  ];

  // Options for p-select in Apply View
  employeeOptions = [
    { label: 'EMP0001 - Amelia Curr (Design)', value: 'EMP0001' },
    { label: 'EMP0002 - Daniel Martinez (Engineering)', value: 'EMP0002' },
    { label: 'EMP0003 - David Anderson (Engineering)', value: 'EMP0003' },
    { label: 'EMP0004 - Emily Clark (Finance)', value: 'EMP0004' },
    { label: 'EMP0005 - Sophia Johnson (Marketing)', value: 'EMP0005' },
    { label: 'EMP0006 - Michael Brown (Design)', value: 'EMP0006' }
  ];

  advanceTypeOptions = [
    { label: 'Salary Advance', value: 'salary-advance' },
    { label: 'Personal Loan', value: 'personal-loan' },
    { label: 'Medical Assistance', value: 'medical' },
    { label: 'Education Support', value: 'education' }
  ];

  tenureOptions = [
    { label: '1 Month (Full deduction in next payroll)', value: 1 },
    { label: '2 Months (Deduct 50% across 2 cycles)', value: 2 },
    { label: '3 Months (Deduct 33.3% across 3 cycles)', value: 3 },
    { label: '6 Months', value: 6 },
    { label: '12 Months', value: 12 }
  ];

  // Options for Quick Advance modal p-select
  quickAdvanceEmployeeOptions = [
    { label: 'EMP0001 - Amelia Curr (Design)', value: 'Amelia Curr (EMP0001)' },
    { label: 'EMP0002 - Daniel Martinez (Engineering)', value: 'Daniel Martinez (EMP0002)' },
    { label: 'EMP0005 - Sophia Johnson (Marketing)', value: 'Sophia Johnson (EMP0005)' },
    { label: 'EMP0006 - Michael Brown (Design)', value: 'Michael Brown (EMP0006)' }
  ];

  quickAdvanceTenureOptions = [
    { label: '1 Month (Deduct 100% in next payroll cycle)', value: 1 },
    { label: '2 Months (Deduct 50% across 2 payroll cycles)', value: 2 },
    { label: '3 Months (Deduct 33.3% across 3 payroll cycles)', value: 3 }
  ];

  // Options for Ledger Payment p-select
  ledgerTypeOptions = [
    { label: 'Manual Partial Payment (Ad-hoc)', value: 'Manual Partial Payment' },
    { label: 'Advance Prepayment (EMI Reduction)', value: 'Advance Prepayment' },
    { label: 'Full Foreclosure / Settlement', value: 'Full Foreclosure' },
    { label: 'Payroll Adjustment', value: 'Payroll Adjustment' }
  ];

  ledgerModeOptions = [
    { label: 'UPI / Online Transfer', value: 'UPI / Online Transfer' },
    { label: 'NEFT / RTGS Bank Transfer', value: 'NEFT / RTGS Bank Transfer' },
    { label: 'Payroll Salary Deduction', value: 'Payroll Salary Deduction' },
    { label: 'Cash Receipt', value: 'Cash Receipt' }
  ];

  // View mode: 'list' or 'apply' (from loan-apply.php)
  viewMode: 'list' | 'apply' = 'list';

  // Apply Form Data (matching loan-apply.php)
  applyForm = {
    employeeId: 'EMP0001',
    advanceType: 'salary-advance',
    amount: 20000,
    tenure: 2,
    startDate: new Date().toISOString().split('T')[0],
    reason: ''
  };

  // Employee Eligibility Dataset
  employeeEligibilityList = [
    { id: 'EMP0001', name: 'Amelia Curr', dept: 'Design', salary: 75000, maxAdvance: 37500, outstanding: 80000 },
    { id: 'EMP0002', name: 'Daniel Martinez', dept: 'Engineering', salary: 95000, maxAdvance: 47500, outstanding: 30000 },
    { id: 'EMP0003', name: 'David Anderson', dept: 'Engineering', salary: 120000, maxAdvance: 60000, outstanding: 100000 },
    { id: 'EMP0004', name: 'Emily Clark', dept: 'Finance', salary: 85000, maxAdvance: 42500, outstanding: 0 },
    { id: 'EMP0005', name: 'Sophia Johnson', dept: 'Marketing', salary: 68000, maxAdvance: 34000, outstanding: 20000 },
    { id: 'EMP0006', name: 'Michael Brown', dept: 'Design', salary: 88000, maxAdvance: 44000, outstanding: 100000 }
  ];

  get currentEmployeeEligibility() {
    return this.employeeEligibilityList.find(e => e.id === this.applyForm.employeeId) || this.employeeEligibilityList[0];
  }

  get applyEmi(): number {
    const amt = Number(this.applyForm.amount) || 0;
    const t = Number(this.applyForm.tenure) || 1;
    return Math.round(amt / t);
  }

  get applyTotal(): number {
    return Number(this.applyForm.amount) || 0;
  }

  setApplyQuickAmount(amt: number | 'max'): void {
    if (amt === 'max') {
      this.applyForm.amount = this.currentEmployeeEligibility.maxAdvance;
    } else {
      this.applyForm.amount = amt;
    }
  }

  openApplyView(): void {
    this.viewMode = 'apply';
    this.applyForm = {
      employeeId: 'EMP0001',
      advanceType: 'salary-advance',
      amount: 20000,
      tenure: 2,
      startDate: new Date().toISOString().split('T')[0],
      reason: ''
    };
  }

  backToList(): void {
    this.viewMode = 'list';
  }

  submitApplyForm(): void {
    if (!this.applyForm.advanceType || !this.applyForm.amount || !this.applyForm.tenure) {
      alert('Please fill in all required fields.');
      return;
    }

    const emp = this.currentEmployeeEligibility;
    const nextId = this.loans.length + 1;
    let cat: 'Salary Advance' | 'Personal Loan' | 'Medical Assistance' | 'Education Support' = 'Salary Advance';
    let prefix = 'ADV';
    if (this.applyForm.advanceType === 'personal-loan') {
      cat = 'Personal Loan';
      prefix = 'LN';
    } else if (this.applyForm.advanceType === 'medical') {
      cat = 'Medical Assistance';
      prefix = 'LN';
    } else if (this.applyForm.advanceType === 'education') {
      cat = 'Education Support';
      prefix = 'LN';
    }

    const refCode = `${prefix}-2026-09${nextId + 3}`;

    const newLoan: LoanAccount = {
      id: nextId,
      ref: refCode,
      empId: emp.id,
      name: emp.name,
      avatar: `./assets/profile-${(nextId % 4) + 1}.jpg`,
      avatarColor: 'var(--green-350)',
      empInitials: emp.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      dept: emp.dept,
      salary: this.formatCurrency(emp.salary),
      purpose: this.applyForm.reason || `${cat} application`,
      category: cat,
      principal: Number(this.applyForm.amount),
      tenure: Number(this.applyForm.tenure),
      emi: Math.round(Number(this.applyForm.amount) / Number(this.applyForm.tenure)),
      repaid: 0,
      balance: Number(this.applyForm.amount),
      paidCount: 0,
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
      maturityDate: '31-Aug-2026',
      startMonth: 'Jun 2026',
      nextEmiDate: '30-Jun-2026',
      status: 'pending',
      statusText: 'Pending Approval',
      interestRate: 0.0,
      bankAccount: 'HDFC Bank ••••• 5521',
      approvedBy: 'Pending Review',
      transactions: [
        {
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
          ref: `REQ-${prefix}-${nextId}09`,
          type: `${cat} Request`,
          amount: Number(this.applyForm.amount),
          isCredit: true,
          balance: Number(this.applyForm.amount),
          mode: 'Pending Disbursal',
          by: 'Employee Self-Service',
          status: 'Pending Review',
          filter: 'disburse'
        }
      ]
    };

    this.loans.unshift(newLoan);
    this.applyFilters();
    this.viewMode = 'list';
    this.showFeedback(`Salary advance request of ${this.formatCurrency(newLoan.principal)} submitted successfully! It will be reviewed by HR/Finance.`, 'success');
  }

  // Quick Advance Modal State
  quickAdvanceModalOpen = false;
  quickAdvanceData = {
    employee: '',
    amount: 25000,
    tenure: 1,
    reason: ''
  };

  // Request Salary Advance / Loan Application Modal State
  requestLoanModalOpen = false;
  requestLoanData = {
    employee: '',
    category: 'Salary Advance' as 'Salary Advance' | 'Personal Loan' | 'Medical Assistance' | 'Education Support',
    amount: 30000,
    tenure: 3,
    reason: ''
  };

  // Loan Details Hub Modal State
  hubModalOpen = false;
  activeHubTab: 'overview' | 'schedule' | 'ledger' | 'foreclosure' = 'overview';
  selectedLoan: LoanAccount | null = null;

  // Hub Schedule Sub-filter
  activeSchedFilter: 'all' | 'deducted' | 'upcoming' | 'scheduled' = 'all';
  displayedInstallments: LoanInstallment[] = [];

  // Hub Ledger Sub-tabs & Filter
  activeLedgerSubTab: 'history' | 'entry' = 'history';
  activeLedgerFilter: 'all' | 'payroll' | 'manual' | 'disburse' = 'all';

  // Record Payment Form
  ledgerPaymentForm = {
    date: new Date().toISOString().split('T')[0],
    amount: 10000,
    type: 'Manual Partial Payment',
    mode: 'UPI / Online Transfer',
    ref: '',
    admin: 'Finance Admin',
    remarks: ''
  };

  // Toast / Feedback Message
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'warning' | 'danger' = 'success';

  ngOnInit(): void {
    this.applyFilters();
  }

  // KPI Computations
  get totalDisbursed(): string {
    const sum = this.loans.reduce((acc, l) => acc + l.principal, 0);
    return this.formatCurrency(sum);
  }

  get monthlyRecovery(): string {
    const sum = this.loans
      .filter(l => l.status === 'approved')
      .reduce((acc, l) => acc + l.emi, 0);
    return this.formatCurrency(sum);
  }

  get pendingCount(): number {
    return this.loans.filter(l => l.status === 'pending').length;
  }

  get outstandingBalance(): string {
    const sum = this.loans
      .filter(l => l.status === 'approved' || l.status === 'pending')
      .reduce((acc, l) => acc + l.balance, 0);
    return this.formatCurrency(sum);
  }

  // Filter application
  toggleFilters(): void {
    this.filtersOpen = !this.filtersOpen;
  }

  applyFilters(): void {
    let list = [...this.loans];

    if (this.searchFilter.trim()) {
      const q = this.searchFilter.toLowerCase().trim();
      list = list.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.empId.toLowerCase().includes(q) ||
        l.ref.toLowerCase().includes(q) ||
        l.dept.toLowerCase().includes(q)
      );
    }

    if (this.selectedCategory) {
      list = list.filter(l => l.category === this.selectedCategory);
    }

    if (this.selectedDept) {
      list = list.filter(l => l.dept === this.selectedDept);
    }

    if (this.selectedStatus) {
      list = list.filter(l => l.status === this.selectedStatus);
    }

    this.displayedLoans = list.map((item, index) => ({
      ...item,
      sno: index + 1
    }));

    this.updateActiveChips();
  }

  clearFilters(): void {
    this.searchFilter = '';
    this.selectedCategory = null;
    this.selectedDept = null;
    this.selectedStatus = null;
    this.applyFilters();
  }

  removeChip(id: string): void {
    if (id === 'search') this.searchFilter = '';
    if (id === 'category') this.selectedCategory = null;
    if (id === 'dept') this.selectedDept = null;
    if (id === 'status') this.selectedStatus = null;
    this.applyFilters();
  }

  private updateActiveChips(): void {
    const chips: ActiveFilterChip[] = [];

    if (this.searchFilter.trim()) {
      chips.push({ id: 'search', label: `Search: "${this.searchFilter}"` });
    }
    if (this.selectedCategory) {
      chips.push({ id: 'category', label: `Category: ${this.selectedCategory}` });
    }
    if (this.selectedDept) {
      chips.push({ id: 'dept', label: `Dept: ${this.selectedDept}` });
    }
    if (this.selectedStatus) {
      const s = this.statusOptions.find(o => o.value === this.selectedStatus);
      chips.push({ id: 'status', label: `Status: ${s ? s.label : this.selectedStatus}` });
    }

    this.activeChips = chips;
  }

  // Format currency
  formatCurrency(val: number): string {
    if (!val && val !== 0) return '₹0';
    return '₹' + Math.round(val).toLocaleString('en-IN');
  }

  getProgressPercent(loan: LoanAccount): number {
    if (loan.principal <= 0) return 0;
    const pct = Math.round((loan.repaid / loan.principal) * 100);
    return Math.min(100, Math.max(0, pct));
  }

  // Quick Advance Modal
  openQuickAdvance(): void {
    this.quickAdvanceData = {
      employee: 'Amelia Curr (EMP0001)',
      amount: 25000,
      tenure: 1,
      reason: 'Urgent family medical support'
    };
    this.quickAdvanceModalOpen = true;
  }

  closeQuickAdvance(): void {
    this.quickAdvanceModalOpen = false;
  }

  submitQuickAdvance(): void {
    if (!this.quickAdvanceData.employee || !this.quickAdvanceData.amount) {
      alert('Please fill in employee and amount.');
      return;
    }

    const nextId = this.loans.length + 1;
    const refCode = `ADV-2026-09${nextId + 2}`;
    const nameMatch = this.quickAdvanceData.employee.split(' (');
    const name = nameMatch[0] || 'Employee';
    const empId = (nameMatch[1] || 'EMP0099').replace(')', '');

    const newLoan: LoanAccount = {
      id: nextId,
      ref: refCode,
      empId: empId,
      name: name,
      avatar: './assets/profile-1.jpg',
      avatarColor: 'var(--green-350)',
      empInitials: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      dept: 'Operations',
      salary: '₹60,000',
      purpose: this.quickAdvanceData.reason || 'Quick Salary Advance',
      category: 'Salary Advance',
      principal: Number(this.quickAdvanceData.amount),
      tenure: Number(this.quickAdvanceData.tenure),
      emi: Math.round(Number(this.quickAdvanceData.amount) / Number(this.quickAdvanceData.tenure)),
      repaid: 0,
      balance: Number(this.quickAdvanceData.amount),
      paidCount: 0,
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
      maturityDate: '30-Jun-2026',
      startMonth: 'May 2026',
      nextEmiDate: '31-May-2026',
      status: 'approved',
      statusText: 'Active',
      interestRate: 0.0,
      bankAccount: 'HDFC Bank ••••• 7819',
      approvedBy: 'Auto-Approved (Quick Advance)',
      transactions: [
        {
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
          ref: `TXN-DSB-${nextId}02`,
          type: 'Disbursement',
          amount: Number(this.quickAdvanceData.amount),
          isCredit: true,
          balance: Number(this.quickAdvanceData.amount),
          mode: 'Direct Bank Transfer',
          by: 'Accounts Team',
          status: 'Completed',
          filter: 'disburse'
        }
      ]
    };

    this.loans.unshift(newLoan);
    this.applyFilters();
    this.closeQuickAdvance();
    this.showFeedback(`Quick salary advance of ${this.formatCurrency(newLoan.principal)} disbursed for ${newLoan.name}!`, 'success');
  }

  // Request Salary Advance / Loan Application Modal
  openRequestLoan(): void {
    this.requestLoanData = {
      employee: 'Daniel Martinez (EMP0002)',
      category: 'Salary Advance',
      amount: 30000,
      tenure: 3,
      reason: ''
    };
    this.requestLoanModalOpen = true;
  }

  closeRequestLoan(): void {
    this.requestLoanModalOpen = false;
  }

  submitRequestLoan(): void {
    if (!this.requestLoanData.employee || !this.requestLoanData.amount) {
      alert('Please fill in all required fields.');
      return;
    }

    const nextId = this.loans.length + 1;
    const prefix = this.requestLoanData.category === 'Salary Advance' ? 'ADV' : 'LN';
    const refCode = `${prefix}-2026-09${nextId + 3}`;
    const nameMatch = this.requestLoanData.employee.split(' (');
    const name = nameMatch[0] || 'Employee';
    const empId = (nameMatch[1] || 'EMP0099').replace(')', '');

    const newLoan: LoanAccount = {
      id: nextId,
      ref: refCode,
      empId: empId,
      name: name,
      avatar: './assets/profile-2.jpg',
      avatarColor: 'var(--warning)',
      empInitials: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      dept: 'Engineering',
      salary: '₹80,000',
      purpose: this.requestLoanData.reason || `${this.requestLoanData.category} request`,
      category: this.requestLoanData.category,
      principal: Number(this.requestLoanData.amount),
      tenure: Number(this.requestLoanData.tenure),
      emi: Math.round(Number(this.requestLoanData.amount) / Number(this.requestLoanData.tenure)),
      repaid: 0,
      balance: Number(this.requestLoanData.amount),
      paidCount: 0,
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
      maturityDate: '31-Aug-2026',
      startMonth: 'Jun 2026',
      nextEmiDate: '30-Jun-2026',
      status: 'pending',
      statusText: 'Pending Approval',
      interestRate: 0.0,
      bankAccount: 'ICICI Bank ••••• 4410',
      approvedBy: 'Pending Review',
      transactions: [
        {
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
          ref: `REQ-${prefix}-${nextId}03`,
          type: `${this.requestLoanData.category} Request`,
          amount: Number(this.requestLoanData.amount),
          isCredit: true,
          balance: Number(this.requestLoanData.amount),
          mode: 'Pending Disbursal',
          by: 'Employee Self-Service',
          status: 'Pending Review',
          filter: 'disburse'
        }
      ]
    };

    this.loans.unshift(newLoan);
    this.applyFilters();
    this.closeRequestLoan();
    this.showFeedback(`New request ${refCode} submitted for approval.`, 'success');
  }

  // Approve / Reject Actions
  approveLoan(loan: LoanAccount, event?: Event): void {
    if (event) event.stopPropagation();
    loan.status = 'approved';
    loan.statusText = 'Active';
    loan.approvedBy = 'HR Director & Accounts';
    this.applyFilters();
    this.showFeedback(`Request ${loan.ref} for ${loan.name} has been approved!`, 'success');
  }

  rejectLoan(loan: LoanAccount, event?: Event): void {
    if (event) event.stopPropagation();
    loan.status = 'rejected';
    loan.statusText = 'Rejected';
    this.applyFilters();
    this.showFeedback(`Request ${loan.ref} for ${loan.name} has been rejected.`, 'danger');
  }

  // Loan Details Hub
  openLoanHub(loan: LoanAccount, tab: 'overview' | 'schedule' | 'ledger' | 'foreclosure' = 'overview', event?: Event): void {
    if (event) event.stopPropagation();
    this.selectedLoan = loan;
    this.activeHubTab = tab;
    this.activeSchedFilter = 'all';
    this.activeLedgerSubTab = 'history';
    this.activeLedgerFilter = 'all';
    this.generateScheduleInstallments();
    this.initLedgerForm();
    this.hubModalOpen = true;
  }

  closeLoanHub(): void {
    this.hubModalOpen = false;
    this.selectedLoan = null;
  }

  setHubTab(tab: 'overview' | 'schedule' | 'ledger' | 'foreclosure'): void {
    this.activeHubTab = tab;
    if (tab === 'schedule') {
      this.generateScheduleInstallments();
    }
  }

  // Schedule Generation
  generateScheduleInstallments(): void {
    if (!this.selectedLoan) return;
    const loan = this.selectedLoan;
    const tenure = loan.tenure || 1;
    const emi = loan.emi;
    const principal = loan.principal;
    const paidCount = loan.paidCount || 0;
    const isPending = loan.status === 'pending';

    const startMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const parts = (loan.startMonth || 'Jan 2026').split(' ');
    let curMonthIdx = Math.max(0, startMonths.indexOf(parts[0]));
    let curYear = parseInt(parts[1]) || 2026;

    let runningBal = principal;
    const list: LoanInstallment[] = [];

    for (let i = 1; i <= tenure; i++) {
      const cycleStr = `${startMonths[curMonthIdx]} ${curYear}`;
      const openBal = runningBal;
      const closeBal = Math.max(0, openBal - emi);
      runningBal = closeBal;

      let statusText: 'Deducted' | 'Upcoming' | 'Scheduled' | 'Pending' = 'Scheduled';
      let statusCat: 'deducted' | 'upcoming' | 'scheduled' = 'scheduled';
      let mode = 'Payroll Deduction';

      if (isPending) {
        statusText = 'Pending';
        statusCat = 'scheduled';
        mode = 'Pending Sanction';
      } else if (i <= paidCount) {
        statusText = 'Deducted';
        statusCat = 'deducted';
      } else if (i === paidCount + 1 && loan.balance > 0) {
        statusText = 'Upcoming';
        statusCat = 'upcoming';
      } else if (loan.balance <= 0) {
        statusText = 'Deducted';
        statusCat = 'deducted';
      }

      list.push({
        instNo: i,
        cycle: cycleStr,
        openingBal: openBal,
        principal: emi,
        interest: 0,
        emi: emi,
        closingBal: closeBal,
        mode: mode,
        status: statusText,
        statusCat: statusCat
      });

      curMonthIdx++;
      if (curMonthIdx >= 12) {
        curMonthIdx = 0;
        curYear++;
      }
    }

    this.displayedInstallments = list;
  }

  get filteredInstallments(): LoanInstallment[] {
    if (this.activeSchedFilter === 'all') return this.displayedInstallments;
    return this.displayedInstallments.filter(inst => inst.statusCat === this.activeSchedFilter);
  }

  setSchedFilter(filter: 'all' | 'deducted' | 'upcoming' | 'scheduled'): void {
    this.activeSchedFilter = filter;
  }

  get schedPaidCount(): number {
    return this.displayedInstallments.filter(i => i.statusCat === 'deducted').length;
  }

  get schedUpcomingCount(): number {
    return this.displayedInstallments.filter(i => i.statusCat === 'upcoming').length;
  }

  get schedScheduledCount(): number {
    return this.displayedInstallments.filter(i => i.statusCat === 'scheduled').length;
  }

  exportScheduleCSV(): void {
    if (!this.selectedLoan) return;
    const header = 'Inst #,Payroll Cycle,Opening Balance,Principal,Interest,EMI Amount,Closing Balance,Payment Mode,Status\n';
    const rows = this.displayedInstallments.map(i =>
      `${i.instNo},${i.cycle},${i.openingBal},${i.principal},${i.interest},${i.emi},${i.closingBal},${i.mode},${i.status}`
    ).join('\n');

    this.downloadFile(header + rows, `${this.selectedLoan.ref}_Schedule.csv`, 'text/csv');
  }

  // Ledger Tab Actions
  get filteredTransactions(): LoanTransaction[] {
    if (!this.selectedLoan) return [];
    if (this.activeLedgerFilter === 'all') return this.selectedLoan.transactions;
    return this.selectedLoan.transactions.filter(t => t.filter === this.activeLedgerFilter);
  }

  initLedgerForm(): void {
    if (!this.selectedLoan) return;
    this.ledgerPaymentForm = {
      date: new Date().toISOString().split('T')[0],
      amount: this.selectedLoan.emi,
      type: 'Manual Partial Payment',
      mode: 'UPI / Online Transfer',
      ref: `MAN-${Date.now().toString().slice(-6)}`,
      admin: 'Finance Admin',
      remarks: ''
    };
  }

  setQuickAmount(type: 'emi' | 'half' | 'full'): void {
    if (!this.selectedLoan) return;
    if (type === 'emi') {
      this.ledgerPaymentForm.amount = Math.min(this.selectedLoan.emi, this.selectedLoan.balance);
    } else if (type === 'half') {
      this.ledgerPaymentForm.amount = Math.round(this.selectedLoan.balance / 2);
    } else if (type === 'full') {
      this.ledgerPaymentForm.amount = this.selectedLoan.balance;
    }
  }

  get projectedNewBalance(): number {
    if (!this.selectedLoan) return 0;
    const amt = Number(this.ledgerPaymentForm.amount) || 0;
    return Math.max(0, this.selectedLoan.balance - amt);
  }

  postLedgerPayment(): void {
    if (!this.selectedLoan) return;
    const amt = Number(this.ledgerPaymentForm.amount);
    if (!amt || amt <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    const newBal = Math.max(0, this.selectedLoan.balance - amt);
    this.selectedLoan.repaid += amt;
    this.selectedLoan.balance = newBal;
    this.selectedLoan.paidCount = Math.min(
      this.selectedLoan.tenure,
      Math.floor(this.selectedLoan.repaid / this.selectedLoan.emi)
    );

    if (this.selectedLoan.balance === 0) {
      this.selectedLoan.status = 'completed';
      this.selectedLoan.statusText = 'Settled';
    }

    const newTxn: LoanTransaction = {
      date: new Date(this.ledgerPaymentForm.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
      ref: this.ledgerPaymentForm.ref || `TXN-MAN-${Date.now().toString().slice(-5)}`,
      type: this.ledgerPaymentForm.type,
      amount: amt,
      isCredit: false,
      balance: newBal,
      mode: this.ledgerPaymentForm.mode,
      by: this.ledgerPaymentForm.admin,
      status: 'Completed',
      filter: 'manual'
    };

    this.selectedLoan.transactions.push(newTxn);
    this.generateScheduleInstallments();
    this.activeLedgerSubTab = 'history';
    this.applyFilters();
    this.showFeedback(`Payment of ${this.formatCurrency(amt)} recorded for ${this.selectedLoan.ref}!`, 'success');
  }

  exportLedgerCSV(): void {
    if (!this.selectedLoan) return;
    const header = 'Date,Txn Ref #,Type,Amount,Running Balance,Payment Mode,Processed By,Status\n';
    const rows = this.selectedLoan.transactions.map(t =>
      `${t.date},${t.ref},${t.type},${t.amount},${t.balance},${t.mode},${t.by},${t.status}`
    ).join('\n');

    this.downloadFile(header + rows, `${this.selectedLoan.ref}_Statement.csv`, 'text/csv');
  }

  // Foreclosure & Full Settlement
  executeForeclosure(): void {
    if (!this.selectedLoan) return;
    const bal = this.selectedLoan.balance;
    if (bal <= 0) {
      alert('This loan is already completely settled.');
      return;
    }

    if (!confirm(`Are you sure you want to execute early settlement of ${this.formatCurrency(bal)} for ${this.selectedLoan.ref}? This will close the loan account.`)) {
      return;
    }

    this.selectedLoan.repaid += bal;
    this.selectedLoan.balance = 0;
    this.selectedLoan.paidCount = this.selectedLoan.tenure;
    this.selectedLoan.status = 'completed';
    this.selectedLoan.statusText = 'Settled';

    this.selectedLoan.transactions.push({
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
      ref: `FCL-NOC-${Date.now().toString().slice(-5)}`,
      type: 'Full Foreclosure / Early Settlement',
      amount: bal,
      isCredit: false,
      balance: 0,
      mode: 'Bank Transfer / Payroll Settlement',
      by: 'Finance Controller',
      status: 'Completed',
      filter: 'manual'
    });

    this.generateScheduleInstallments();
    this.applyFilters();
    this.showFeedback(`Loan account ${this.selectedLoan.ref} has been completely foreclosed and settled!`, 'success');
  }

  printHub(): void {
    window.print();
  }

  private showFeedback(msg: string, type: 'success' | 'warning' | 'danger'): void {
    this.feedbackMessage = msg;
    this.feedbackType = type;
    setTimeout(() => {
      this.feedbackMessage = null;
    }, 4500);
  }

  private downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type: `${type};charset=utf-8;` });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
