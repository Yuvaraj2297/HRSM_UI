import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Breadcrumb } from '../../../../shared/breadcrumb/breadcrumb';

export interface QueueItem {
  id: string;
  sno: number;
  date: string;
  empId: string;
  empName: string;
  empEmail: string;
  dept: string;
  initiatedBy: 'Company Assigned' | 'Employee Request';
  timeSlot: string;
  startTime: string;
  endTime: string;
  hours: number;
  hoursDisplay: string;
  project: string;
  reason: string;
  otType: string;
  status: 'Assigned' | 'Pending Approval' | 'Approved' | 'Rejected';
  decisionSummary?: string;
}

export interface HistoryItem {
  sno: number;
  date: string;
  empId: string;
  empName: string;
  dept: string;
  timeSlot: string;
  hours: string;
  rateInfo: string;
  totalPay: number;
  status: 'Approved' | 'Rejected';
  remarks: string;
}

export interface ValidationItem {
  sno: number;
  empName: string;
  dept: string;
  date: string;
  shiftHours: string;
  actualPunchOut: string;
  isEarlyExit?: boolean;
  approvedHours: string;
  overstay: string;
  statusText: string;
  isWarning?: boolean;
}

export interface PayrollItem {
  sno: number;
  empId: string;
  empName: string;
  dept: string;
  baseRate: number;
  approvedHours: number;
  multiplierText: string;
  multiplierVal: number;
  grossPayout: number;
  slipStatus: string;
}

export interface DeptReportItem {
  sno: number;
  dept: string;
  totalEmployees: number;
  totalHours: string;
  approvedHours: string;
  rejectedHours: string;
  totalCost: string;
  breakdown: Array<{
    empName: string;
    role: string;
    approvedOt: string;
    rateMultiplier: string;
    payout: number;
    status: string;
  }>;
}

export interface EmployeeSalaryItem {
  sno: number;
  empId: string;
  empName: string;
  empEmail: string;
  dept: string;
  monthlySalary: string;
  baseHourlyRate: string;
  approvedHours: string;
  standardHours: string;
  holidayHours: string;
  totalOtSalary: string;
  logs: Array<{
    date: string;
    work: string;
    hours: string;
    multiplier: string;
    pay: string;
    status: string;
  }>;
}

export interface ToastMessage {
  type: 'success' | 'danger' | 'info' | 'warning';
  title: string;
  message: string;
}

@Component({
  selector: 'app-over-time',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, Breadcrumb, AppStatCard],
  templateUrl: './over-time.html',
  styleUrl: './over-time.scss',
})
export class OverTime implements OnInit {
  // Navigation Tabs
  activeTab: 'queue' | 'history' | 'validation' | 'payroll' | 'reports' = 'queue';

  // Filters State - Tab 1 (Queue)
  queueDeptFilter: string = '';
  queueEmpFilter: string = '';
  queueSearchQuery: string = '';

  // Filters State - Tab 2 (History)
  histDeptFilter: string = '';
  histEmpFilter: string = '';
  histStatusFilter: string = '';
  histSearchQuery: string = '';

  // Filters State - Tab 3 (Validation)
  valDeptFilter: string = '';
  valEmpFilter: string = '';
  valSearchQuery: string = '';

  // Filters State - Tab 4 (Payroll)
  payDeptFilter: string = '';
  payEmpFilter: string = '';
  paySearchQuery: string = '';

  // Filters State - Tab 5 (Reports)
  rptDeptFilter: string = '';
  rptEmpFilter: string = '';
  rptSearchQuery: string = '';

  // Select Dropdown Options
  readonly deptOptions = [
    { label: 'All Departments', value: '' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'HR & Admin', value: 'HR & Admin' },
    { label: 'Operations', value: 'Operations' },
    { label: 'Sales & Marketing', value: 'Sales & Marketing' },
  ];

  readonly empOptions = [
    { label: 'All Employees', value: '' },
    { label: 'Rajesh Kumar (EMP0102)', value: 'Rajesh Kumar' },
    { label: 'Priya Sharma (EMP0105)', value: 'Priya Sharma' },
    { label: 'Anish Verma (EMP0142)', value: 'Anish Verma' },
    { label: 'Suresh Raina (EMP0190)', value: 'Suresh Raina' },
  ];

  readonly histStatusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  readonly employeeDirectory = [
    { id: 'EMP0102', name: 'Rajesh Kumar', email: 'rajesh.k@company.com', dept: 'Engineering', shift: '9:00 AM - 6:00 PM', baseRate: 150 },
    { id: 'EMP0105', name: 'Priya Sharma', email: 'priya.s@company.com', dept: 'HR & Admin', shift: '9:00 AM - 6:00 PM', baseRate: 140 },
    { id: 'EMP0142', name: 'Anish Verma', email: 'anish.v@company.com', dept: 'Sales & Marketing', shift: '9:00 AM - 6:00 PM', baseRate: 120 },
    { id: 'EMP0190', name: 'Suresh Raina', email: 'suresh.r@company.com', dept: 'Operations', shift: '8:00 AM - 5:00 PM', baseRate: 130 },
  ];

  readonly otTypeOptions = [
    { label: 'Standard OT (1.5x Pay)', value: 'Standard 1.5x' },
    { label: 'Weekend / Holiday OT (2.0x Pay)', value: 'Holiday 2.0x' },
    { label: 'Night Shift OT (1.5x Pay)', value: 'Night Shift 1.5x' },
  ];

  // Toast State
  toast: ToastMessage | null = null;
  private toastTimeout: any;

  // Data: Approval Queue
  queueList: QueueItem[] = [
    {
      id: 'OT-2026-901',
      sno: 1,
      date: '22 Sep 2026',
      empId: 'EMP0102',
      empName: 'Rajesh Kumar',
      empEmail: 'rajesh.k@company.com',
      dept: 'Engineering',
      initiatedBy: 'Company Assigned',
      timeSlot: '6:00 PM – 9:00 PM',
      startTime: '18:00',
      endTime: '21:00',
      hours: 3.0,
      hoursDisplay: '3.0 Hours',
      project: 'Production Support',
      reason: 'Release hotfix deployment support',
      otType: 'Standard 1.5x',
      status: 'Assigned',
    },
    {
      id: 'OT-2026-902',
      sno: 2,
      date: '22 Sep 2026',
      empId: 'EMP0105',
      empName: 'Priya Sharma',
      empEmail: 'priya.s@company.com',
      dept: 'HR & Admin',
      initiatedBy: 'Employee Request',
      timeSlot: '6:30 PM – 8:30 PM',
      startTime: '18:30',
      endTime: '20:30',
      hours: 2.0,
      hoursDisplay: '2.0 Hours',
      project: 'Monthly Payroll Processing',
      reason: 'Audit and verify September payslips',
      otType: 'Standard 1.5x',
      status: 'Pending Approval',
    },
    {
      id: 'OT-2026-903',
      sno: 3,
      date: '21 Sep 2026',
      empId: 'EMP0142',
      empName: 'Anish Verma',
      empEmail: 'anish.v@company.com',
      dept: 'Sales & Marketing',
      initiatedBy: 'Employee Request',
      timeSlot: '7:00 PM – 10:00 PM',
      startTime: '19:00',
      endTime: '22:00',
      hours: 3.0,
      hoursDisplay: '3.0 Hours',
      project: 'Client Demo Call',
      reason: 'US Client product walkthrough presentation',
      otType: 'Night Shift 1.5x',
      status: 'Pending Approval',
    },
    {
      id: 'OT-2026-904',
      sno: 4,
      date: '20 Sep 2026',
      empId: 'EMP0190',
      empName: 'Suresh Raina',
      empEmail: 'suresh.r@company.com',
      dept: 'Operations',
      initiatedBy: 'Company Assigned',
      timeSlot: '10:00 AM – 4:00 PM',
      startTime: '10:00',
      endTime: '16:00',
      hours: 6.0,
      hoursDisplay: '6.0 Hours',
      project: 'Sunday Warehouse Audit',
      reason: 'Quarterly physical inventory count',
      otType: 'Holiday 2.0x',
      status: 'Assigned',
    },
  ];

  // Data: OT History
  historyList: HistoryItem[] = [
    {
      sno: 1,
      date: '19 Sep 2026',
      empId: 'EMP0102',
      empName: 'Rajesh Kumar (EMP0102)',
      dept: 'Engineering',
      timeSlot: '6:00 PM – 9:00 PM',
      hours: '3.0 hrs',
      rateInfo: '₹ 100/hr × 1.5x',
      totalPay: 450,
      status: 'Approved',
      remarks: 'Approved by HR Manager (Production fix verified)',
    },
    {
      sno: 2,
      date: '18 Sep 2026',
      empId: 'EMP0105',
      empName: 'Priya Sharma (EMP0105)',
      dept: 'HR & Admin',
      timeSlot: '6:00 PM – 8:00 PM',
      hours: '2.0 hrs',
      rateInfo: '₹ 100/hr × 1.5x',
      totalPay: 300,
      status: 'Approved',
      remarks: 'Approved by Admin Head',
    },
    {
      sno: 3,
      date: '17 Sep 2026',
      empId: 'EMP0190',
      empName: 'Suresh Raina (EMP0190)',
      dept: 'Operations',
      timeSlot: '5:30 PM – 9:30 PM',
      hours: '4.0 hrs',
      rateInfo: '₹ 120/hr × 1.5x',
      totalPay: 720,
      status: 'Approved',
      remarks: 'Approved by Ops Director',
    },
    {
      sno: 4,
      date: '15 Sep 2026',
      empId: 'EMP0142',
      empName: 'Anish Verma (EMP0142)',
      dept: 'Sales & Marketing',
      timeSlot: '7:00 PM – 9:00 PM',
      hours: '2.0 hrs',
      rateInfo: '₹ 90/hr × 1.5x',
      totalPay: 0,
      status: 'Rejected',
      remarks: 'Rejected (Prior manager pre-approval missing)',
    },
  ];

  // Data: Attendance Validation
  validationList: ValidationItem[] = [
    {
      sno: 1,
      empName: 'Rajesh Kumar (EMP0102)',
      dept: 'Engineering',
      date: '19 Sep 2026',
      shiftHours: '9:00 AM – 6:00 PM',
      actualPunchOut: '9:05 PM',
      approvedHours: '3.0 Hours',
      overstay: '3 hrs 5 mins',
      statusText: 'Fully Validated',
      isWarning: false,
    },
    {
      sno: 2,
      empName: 'Priya Sharma (EMP0105)',
      dept: 'HR & Admin',
      date: '18 Sep 2026',
      shiftHours: '9:00 AM – 6:00 PM',
      actualPunchOut: '8:02 PM',
      approvedHours: '2.0 Hours',
      overstay: '2 hrs 2 mins',
      statusText: 'Fully Validated',
      isWarning: false,
    },
    {
      sno: 3,
      empName: 'Suresh Raina (EMP0190)',
      dept: 'Operations',
      date: '17 Sep 2026',
      shiftHours: '8:00 AM – 5:00 PM',
      actualPunchOut: '8:45 PM',
      isEarlyExit: true,
      approvedHours: '4.0 Hours',
      overstay: '3 hrs 45 mins',
      statusText: '15 Min Punch Shortfall',
      isWarning: true,
    },
  ];

  // Data: Payroll Payout
  payrollList: PayrollItem[] = [
    {
      sno: 1,
      empId: 'EMP0102',
      empName: 'Rajesh Kumar',
      dept: 'Engineering',
      baseRate: 150,
      approvedHours: 18.0,
      multiplierText: '1.5x (₹ 225/hr)',
      multiplierVal: 1.5,
      grossPayout: 4050,
      slipStatus: 'Synced to Payslip',
    },
    {
      sno: 2,
      empId: 'EMP0105',
      empName: 'Priya Sharma',
      dept: 'HR & Admin',
      baseRate: 140,
      approvedHours: 12.0,
      multiplierText: '1.5x (₹ 210/hr)',
      multiplierVal: 1.5,
      grossPayout: 2520,
      slipStatus: 'Synced to Payslip',
    },
    {
      sno: 3,
      empId: 'EMP0190',
      empName: 'Suresh Raina',
      dept: 'Operations',
      baseRate: 130,
      approvedHours: 24.0,
      multiplierText: '2.0x Holiday (₹ 260/hr)',
      multiplierVal: 2.0,
      grossPayout: 6240,
      slipStatus: 'Synced to Payslip',
    },
  ];

  // Data: Department Reports
  deptReportList: DeptReportItem[] = [
    {
      sno: 1,
      dept: 'Engineering & IT',
      totalEmployees: 10,
      totalHours: '72 hrs',
      approvedHours: '68 hrs',
      rejectedHours: '4 hrs',
      totalCost: '₹ 11,200',
      breakdown: [
        { empName: 'Rajesh Kumar (EMP0102)', role: 'Senior Developer', approvedOt: '18.0 hrs', rateMultiplier: '₹225 / hr (1.5x)', payout: 4050, status: 'Approved' },
        { empName: 'Vikram Sethi (EMP0118)', role: 'DevOps Lead', approvedOt: '24.0 hrs', rateMultiplier: '₹250 / hr (2.0x)', payout: 6000, status: 'Approved' },
        { empName: 'Sneha Reddy (EMP0125)', role: 'QA Automation Lead', approvedOt: '26.0 hrs', rateMultiplier: '₹215 / hr (1.5x)', payout: 1150, status: 'Approved' },
      ],
    },
    {
      sno: 2,
      dept: 'Operations & Logistics',
      totalEmployees: 8,
      totalHours: '60 hrs',
      approvedHours: '54 hrs',
      rejectedHours: '6 hrs',
      totalCost: '₹ 9,600',
      breakdown: [
        { empName: 'Suresh Raina (EMP0190)', role: 'Warehouse Supervisor', approvedOt: '24.0 hrs', rateMultiplier: '₹260 / hr (2.0x)', payout: 6240, status: 'Approved' },
        { empName: 'Karthik Rao (EMP0194)', role: 'Logistics Officer', approvedOt: '18.0 hrs', rateMultiplier: '₹190 / hr (1.5x)', payout: 2160, status: 'Approved' },
        { empName: 'Manoj Kumar (EMP0198)', role: 'Inventory Specialist', approvedOt: '12.0 hrs', rateMultiplier: '₹170 / hr (1.5x)', payout: 1200, status: 'Approved' },
      ],
    },
    {
      sno: 3,
      dept: 'HR & Admin',
      totalEmployees: 4,
      totalHours: '30 hrs',
      approvedHours: '28 hrs',
      rejectedHours: '2 hrs',
      totalCost: '₹ 4,500',
      breakdown: [
        { empName: 'Priya Sharma (EMP0105)', role: 'HR Executive', approvedOt: '12.0 hrs', rateMultiplier: '₹210 / hr (1.5x)', payout: 2520, status: 'Approved' },
        { empName: 'Divya Nair (EMP0109)', role: 'Admin Coordinator', approvedOt: '16.0 hrs', rateMultiplier: '₹180 / hr (1.5x)', payout: 1980, status: 'Approved' },
      ],
    },
    {
      sno: 4,
      dept: 'Sales & Marketing',
      totalEmployees: 3,
      totalHours: '24 hrs',
      approvedHours: '20 hrs',
      rejectedHours: '4 hrs',
      totalCost: '₹ 3,200',
      breakdown: [
        { empName: 'Anish Verma (EMP0142)', role: 'Account Manager', approvedOt: '10.0 hrs', rateMultiplier: '₹180 / hr (1.5x)', payout: 1800, status: 'Approved' },
        { empName: 'Rohit Joshi (EMP0145)', role: 'Pre-Sales Engineer', approvedOt: '10.0 hrs', rateMultiplier: '₹170 / hr (1.5x)', payout: 1400, status: 'Approved' },
      ],
    },
  ];

  // Data: Employee Overtime Salary Breakdown
  employeeSalaryList: EmployeeSalaryItem[] = [
    {
      sno: 1,
      empId: 'EMP0102',
      empName: 'Rajesh Kumar',
      empEmail: 'rajesh.k@company.com',
      dept: 'Engineering & IT',
      monthlySalary: '₹ 45,000 / mo',
      baseHourlyRate: '₹ 216.35 / hr',
      approvedHours: '18.0 hrs',
      standardHours: '12.0 hrs',
      holidayHours: '6.0 hrs',
      totalOtSalary: '₹ 5,841',
      logs: [
        { date: '19 Sep 2026', work: 'Production Hotfix Deployment Support', hours: '3.0 hrs', multiplier: '1.5x Standard', pay: '₹ 973.58', status: 'Approved' },
        { date: '12 Sep 2026', work: 'Database Server Migration (Night Shift)', hours: '4.0 hrs', multiplier: '1.5x Standard', pay: '₹ 1,298.10', status: 'Approved' },
        { date: '06 Sep 2026', work: 'Sunday Stock Audit & System Verification', hours: '6.0 hrs', multiplier: '2.0x Holiday', pay: '₹ 2,596.20', status: 'Approved' },
        { date: '02 Sep 2026', work: 'Release Build Deployment & Testing', hours: '5.0 hrs', multiplier: '1.5x Standard', pay: '₹ 973.58', status: 'Approved' },
      ],
    },
    {
      sno: 2,
      empId: 'EMP0105',
      empName: 'Priya Sharma',
      empEmail: 'priya.s@company.com',
      dept: 'HR & Admin',
      monthlySalary: '₹ 38,000 / mo',
      baseHourlyRate: '₹ 182.69 / hr',
      approvedHours: '12.0 hrs',
      standardHours: '12.0 hrs',
      holidayHours: '0.0 hrs',
      totalOtSalary: '₹ 3,288',
      logs: [
        { date: '18 Sep 2026', work: 'Monthly Payroll Processing Audit', hours: '2.0 hrs', multiplier: '1.5x Standard', pay: '₹ 548.07', status: 'Approved' },
        { date: '14 Sep 2026', work: 'Employee Onboarding Batch Verification', hours: '4.0 hrs', multiplier: '1.5x Standard', pay: '₹ 1,096.14', status: 'Approved' },
        { date: '05 Sep 2026', work: 'Statutory Compliance Documentation', hours: '6.0 hrs', multiplier: '1.5x Standard', pay: '₹ 1,643.79', status: 'Approved' },
      ],
    },
    {
      sno: 3,
      empId: 'EMP0190',
      empName: 'Suresh Raina',
      empEmail: 'suresh.r@company.com',
      dept: 'Operations & Logistics',
      monthlySalary: '₹ 40,000 / mo',
      baseHourlyRate: '₹ 192.31 / hr',
      approvedHours: '24.0 hrs',
      standardHours: '8.0 hrs',
      holidayHours: '16.0 hrs',
      totalOtSalary: '₹ 8,462',
      logs: [
        { date: '17 Sep 2026', work: 'Quarterly Physical Inventory Audit', hours: '4.0 hrs', multiplier: '1.5x Standard', pay: '₹ 1,153.86', status: 'Approved' },
        { date: '10 Sep 2026', work: 'Sunday Bulk Shipment Offloading', hours: '8.0 hrs', multiplier: '2.0x Holiday', pay: '₹ 3,076.96', status: 'Approved' },
        { date: '03 Sep 2026', work: 'Warehouse Reorganization & Dispatch', hours: '8.0 hrs', multiplier: '2.0x Holiday', pay: '₹ 3,076.96', status: 'Approved' },
        { date: '01 Sep 2026', work: 'Emergency Vendor Equipment Inspection', hours: '4.0 hrs', multiplier: '1.5x Standard', pay: '₹ 1,153.86', status: 'Approved' },
      ],
    },
    {
      sno: 4,
      empId: 'EMP0142',
      empName: 'Anish Verma',
      empEmail: 'anish.v@company.com',
      dept: 'Sales & Marketing',
      monthlySalary: '₹ 35,000 / mo',
      baseHourlyRate: '₹ 168.27 / hr',
      approvedHours: '10.0 hrs',
      standardHours: '10.0 hrs',
      holidayHours: '0.0 hrs',
      totalOtSalary: '₹ 2,524',
      logs: [
        { date: '15 Sep 2026', work: 'US Client Product Demo Presentation', hours: '3.0 hrs', multiplier: '1.5x Standard', pay: '₹ 757.21', status: 'Approved' },
        { date: '08 Sep 2026', work: 'International RFP Proposal Preparation', hours: '4.0 hrs', multiplier: '1.5x Standard', pay: '₹ 1,009.62', status: 'Approved' },
        { date: '04 Sep 2026', work: 'Client Pitch Deck & Pricing Review', hours: '3.0 hrs', multiplier: '1.5x Standard', pay: '₹ 757.21', status: 'Approved' },
      ],
    },
  ];

  // -------------------------------------------------------------
  // Modals State
  // -------------------------------------------------------------
  showAssignModal: boolean = false;
  showRequestModal: boolean = false;
  showReviewModal: boolean = false;
  showDeptModal: boolean = false;
  showSalaryModal: boolean = false;

  // Form State: Assign Modal
  asgnForm = {
    empId: '',
    empName: '',
    dept: '',
    date: '2026-09-23',
    shift: '9:00 AM - 6:00 PM',
    otType: 'Standard 1.5x',
    startTime: '18:00',
    endTime: '21:00',
    hours: 3.0,
    hoursDisplay: '3.0 Hours',
    project: '',
    remarks: '',
  };

  // Form State: Request Modal
  reqForm = {
    empId: 'EMP0102',
    empName: 'Rajesh Kumar',
    date: '2026-09-23',
    otType: 'Standard 1.5x',
    startTime: '18:30',
    endTime: '20:30',
    hours: 2.0,
    hoursDisplay: '2.0 Hours',
    project: '',
    reason: '',
  };

  // State: Review Modal
  reviewItem: QueueItem | null = null;
  reviewForm = {
    decision: 'Approved' as 'Approved' | 'Rejected',
    approvedHours: 3.0,
    rateMultiplier: 1.5,
    baseRate: 150,
    remarks: '',
  };

  // State: Department Details Modal
  selectedDeptReport: DeptReportItem | null = null;

  // State: Salary Details Modal
  selectedSalaryEmp: EmployeeSalaryItem | null = null;

  ngOnInit(): void {
    this.calcAsgnHours();
    this.calcReqHours();
  }

  // -------------------------------------------------------------
  // Tab Switcher
  // -------------------------------------------------------------
  switchTab(tab: 'queue' | 'history' | 'validation' | 'payroll' | 'reports'): void {
    this.activeTab = tab;
  }

  // -------------------------------------------------------------
  // KPI Calculations
  // -------------------------------------------------------------
  get kpiPendingCount(): number {
    return this.queueList.filter(q => q.status === 'Assigned' || q.status === 'Pending Approval').length;
  }

  get kpiApprovedHours(): number {
    return 170;
  }

  get kpiRejectedHours(): number {
    return 16;
  }

  get kpiTotalHours(): number {
    return 186;
  }

  get kpiTotalEmployees(): number {
    return 25;
  }

  get kpiTotalAmount(): string {
    return '₹ 28,500';
  }

  // -------------------------------------------------------------
  // Filter Getters
  // -------------------------------------------------------------
  get filteredQueueList(): QueueItem[] {
    return this.queueList.filter(item => {
      const matchDept = !this.queueDeptFilter || item.dept.toLowerCase().includes(this.queueDeptFilter.toLowerCase());
      const matchEmp = !this.queueEmpFilter || item.empName.toLowerCase().includes(this.queueEmpFilter.toLowerCase());
      const matchQuery = !this.queueSearchQuery ||
        item.empName.toLowerCase().includes(this.queueSearchQuery.toLowerCase()) ||
        item.empId.toLowerCase().includes(this.queueSearchQuery.toLowerCase()) ||
        item.project.toLowerCase().includes(this.queueSearchQuery.toLowerCase()) ||
        item.reason.toLowerCase().includes(this.queueSearchQuery.toLowerCase());
      return matchDept && matchEmp && matchQuery;
    });
  }

  get filteredHistoryList(): HistoryItem[] {
    return this.historyList.filter(item => {
      const matchDept = !this.histDeptFilter || item.dept.toLowerCase().includes(this.histDeptFilter.toLowerCase());
      const matchEmp = !this.histEmpFilter || item.empName.toLowerCase().includes(this.histEmpFilter.toLowerCase());
      const matchStatus = !this.histStatusFilter || item.status === this.histStatusFilter;
      const matchQuery = !this.histSearchQuery ||
        item.empName.toLowerCase().includes(this.histSearchQuery.toLowerCase()) ||
        item.empId.toLowerCase().includes(this.histSearchQuery.toLowerCase()) ||
        item.remarks.toLowerCase().includes(this.histSearchQuery.toLowerCase());
      return matchDept && matchEmp && matchStatus && matchQuery;
    });
  }

  get filteredValidationList(): ValidationItem[] {
    return this.validationList.filter(item => {
      const matchDept = !this.valDeptFilter || item.dept.toLowerCase().includes(this.valDeptFilter.toLowerCase());
      const matchEmp = !this.valEmpFilter || item.empName.toLowerCase().includes(this.valEmpFilter.toLowerCase());
      const matchQuery = !this.valSearchQuery ||
        item.empName.toLowerCase().includes(this.valSearchQuery.toLowerCase()) ||
        item.statusText.toLowerCase().includes(this.valSearchQuery.toLowerCase());
      return matchDept && matchEmp && matchQuery;
    });
  }

  get filteredPayrollList(): PayrollItem[] {
    return this.payrollList.filter(item => {
      const matchDept = !this.payDeptFilter || item.dept.toLowerCase().includes(this.payDeptFilter.toLowerCase());
      const matchEmp = !this.payEmpFilter || item.empName.toLowerCase().includes(this.payEmpFilter.toLowerCase());
      const matchQuery = !this.paySearchQuery ||
        item.empName.toLowerCase().includes(this.paySearchQuery.toLowerCase()) ||
        item.empId.toLowerCase().includes(this.paySearchQuery.toLowerCase());
      return matchDept && matchEmp && matchQuery;
    });
  }

  get filteredDeptReportList(): DeptReportItem[] {
    return this.deptReportList.filter(item => {
      const matchDept = !this.rptDeptFilter || item.dept.toLowerCase().includes(this.rptDeptFilter.toLowerCase());
      const matchQuery = !this.rptSearchQuery || item.dept.toLowerCase().includes(this.rptSearchQuery.toLowerCase());
      return matchDept && matchQuery;
    });
  }

  get filteredEmployeeSalaryList(): EmployeeSalaryItem[] {
    return this.employeeSalaryList.filter(item => {
      const matchDept = !this.rptDeptFilter || item.dept.toLowerCase().includes(this.rptDeptFilter.toLowerCase());
      const matchEmp = !this.rptEmpFilter || item.empName.toLowerCase().includes(this.rptEmpFilter.toLowerCase());
      const matchQuery = !this.rptSearchQuery ||
        item.empName.toLowerCase().includes(this.rptSearchQuery.toLowerCase()) ||
        item.empId.toLowerCase().includes(this.rptSearchQuery.toLowerCase());
      return matchDept && matchEmp && matchQuery;
    });
  }

  // -------------------------------------------------------------
  // Assignment Modal Helpers
  // -------------------------------------------------------------
  openAssignModal(): void {
    this.asgnForm = {
      empId: '',
      empName: '',
      dept: '',
      date: '2026-09-23',
      shift: '9:00 AM - 6:00 PM',
      otType: 'Standard 1.5x',
      startTime: '18:00',
      endTime: '21:00',
      hours: 3.0,
      hoursDisplay: '3.0 Hours',
      project: '',
      remarks: '',
    };
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
  }

  onAsgnEmpChange(empName: string): void {
    const found = this.employeeDirectory.find(e => e.name === empName);
    if (found) {
      this.asgnForm.empId = found.id;
      this.asgnForm.empName = found.name;
      this.asgnForm.dept = found.dept;
      this.asgnForm.shift = found.shift;
    } else {
      this.asgnForm.dept = '';
      this.asgnForm.shift = '9:00 AM - 6:00 PM';
    }
  }

  calcAsgnHours(): void {
    const diff = this.computeHoursDiff(this.asgnForm.startTime, this.asgnForm.endTime);
    this.asgnForm.hours = diff;
    this.asgnForm.hoursDisplay = `${diff.toFixed(1)} Hours`;
  }

  saveOTAssignment(): void {
    if (!this.asgnForm.empName || !this.asgnForm.project) {
      this.showToast('warning', 'Incomplete Form', 'Please choose an employee and specify the project name.');
      return;
    }

    const emp = this.employeeDirectory.find(e => e.name === this.asgnForm.empName);
    const newId = `OT-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newItem: QueueItem = {
      id: newId,
      sno: this.queueList.length + 1,
      date: '23 Sep 2026',
      empId: emp ? emp.id : 'EMP0999',
      empName: this.asgnForm.empName,
      empEmail: emp ? emp.email : `${this.asgnForm.empName.toLowerCase().replace(/\s+/g, '.')}@company.com`,
      dept: this.asgnForm.dept || 'Engineering',
      initiatedBy: 'Company Assigned',
      timeSlot: `${this.formatTimeSlot(this.asgnForm.startTime)} – ${this.formatTimeSlot(this.asgnForm.endTime)}`,
      startTime: this.asgnForm.startTime,
      endTime: this.asgnForm.endTime,
      hours: this.asgnForm.hours,
      hoursDisplay: this.asgnForm.hoursDisplay,
      project: this.asgnForm.project,
      reason: this.asgnForm.remarks || 'Manager assigned overtime work',
      otType: this.asgnForm.otType,
      status: 'Assigned',
    };

    this.queueList.unshift(newItem);
    this.closeAssignModal();
    this.showToast('success', 'OT Assigned', `Overtime assigned to ${newItem.empName} (${newItem.hoursDisplay}).`);
  }

  // -------------------------------------------------------------
  // Request Modal Helpers
  // -------------------------------------------------------------
  openRequestModal(): void {
    this.reqForm = {
      empId: 'EMP0102',
      empName: 'Rajesh Kumar',
      date: '2026-09-23',
      otType: 'Standard 1.5x',
      startTime: '18:30',
      endTime: '20:30',
      hours: 2.0,
      hoursDisplay: '2.0 Hours',
      project: '',
      reason: '',
    };
    this.showRequestModal = true;
  }

  closeRequestModal(): void {
    this.showRequestModal = false;
  }

  calcReqHours(): void {
    const diff = this.computeHoursDiff(this.reqForm.startTime, this.reqForm.endTime);
    this.reqForm.hours = diff;
    this.reqForm.hoursDisplay = `${diff.toFixed(1)} Hours`;
  }

  saveOTRequest(): void {
    if (!this.reqForm.project || !this.reqForm.reason) {
      this.showToast('warning', 'Incomplete Request', 'Please describe the project and reason for overtime.');
      return;
    }

    const emp = this.employeeDirectory.find(e => e.id === this.reqForm.empId) || this.employeeDirectory[0];
    const newId = `OT-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newItem: QueueItem = {
      id: newId,
      sno: this.queueList.length + 1,
      date: '23 Sep 2026',
      empId: emp.id,
      empName: emp.name,
      empEmail: emp.email,
      dept: emp.dept,
      initiatedBy: 'Employee Request',
      timeSlot: `${this.formatTimeSlot(this.reqForm.startTime)} – ${this.formatTimeSlot(this.reqForm.endTime)}`,
      startTime: this.reqForm.startTime,
      endTime: this.reqForm.endTime,
      hours: this.reqForm.hours,
      hoursDisplay: this.reqForm.hoursDisplay,
      project: this.reqForm.project,
      reason: this.reqForm.reason,
      otType: this.reqForm.otType,
      status: 'Pending Approval',
    };

    this.queueList.unshift(newItem);
    this.closeRequestModal();
    this.showToast('success', 'Request Submitted', `OT request submitted for ${newItem.empName}. Awaiting manager review.`);
  }

  // -------------------------------------------------------------
  // Review Modal Helpers
  // -------------------------------------------------------------
  openReviewModal(item: QueueItem): void {
    this.reviewItem = item;
    const emp = this.employeeDirectory.find(e => e.id === item.empId);
    this.reviewForm = {
      decision: 'Approved',
      approvedHours: item.hours,
      rateMultiplier: item.otType.includes('2.0') ? 2.0 : 1.5,
      baseRate: emp ? emp.baseRate : 150,
      remarks: `Verified logs for ${item.project}. Approved ${item.hours} hrs OT payout.`,
    };
    this.showReviewModal = true;
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.reviewItem = null;
  }

  saveReviewDecision(): void {
    if (!this.reviewItem) return;

    const otPay = Math.round(this.reviewForm.approvedHours * this.reviewForm.baseRate * this.reviewForm.rateMultiplier);
    this.reviewItem.status = this.reviewForm.decision;
    this.reviewItem.decisionSummary = this.reviewForm.decision === 'Approved' ? `Approved ₹ ${otPay}` : 'Rejected';

    // Add to history
    this.historyList.unshift({
      sno: this.historyList.length + 1,
      date: this.reviewItem.date,
      empId: this.reviewItem.empId,
      empName: `${this.reviewItem.empName} (${this.reviewItem.empId})`,
      dept: this.reviewItem.dept,
      timeSlot: this.reviewItem.timeSlot,
      hours: `${this.reviewForm.approvedHours} hrs`,
      rateInfo: `₹ ${this.reviewForm.baseRate}/hr × ${this.reviewForm.rateMultiplier}x`,
      totalPay: this.reviewForm.decision === 'Approved' ? otPay : 0,
      status: this.reviewForm.decision,
      remarks: this.reviewForm.remarks || `${this.reviewForm.decision} by manager`,
    });

    const isAppr = this.reviewForm.decision === 'Approved';
    this.closeReviewModal();
    this.showToast(
      isAppr ? 'success' : 'danger',
      `OT ${this.reviewForm.decision}`,
      isAppr
        ? `Overtime approved for ${this.reviewItem.empName}. Payout: ₹ ${otPay}.`
        : `Overtime request rejected for ${this.reviewItem.empName}.`
    );
  }

  quickRejectOT(item: QueueItem): void {
    if (confirm(`Are you sure you want to reject Overtime for ${item.empName}?`)) {
      item.status = 'Rejected';
      item.decisionSummary = 'Rejected';
      this.historyList.unshift({
        sno: this.historyList.length + 1,
        date: item.date,
        empId: item.empId,
        empName: `${item.empName} (${item.empId})`,
        dept: item.dept,
        timeSlot: item.timeSlot,
        hours: `${item.hours} hrs`,
        rateInfo: '₹ 100/hr × 1.5x',
        totalPay: 0,
        status: 'Rejected',
        remarks: 'Rejected directly by manager',
      });
      this.showToast('danger', 'Request Rejected', `OT request for ${item.empName} has been rejected.`);
    }
  }

  // -------------------------------------------------------------
  // Department Report & Salary Modals
  // -------------------------------------------------------------
  openDeptReportModal(dept: DeptReportItem): void {
    this.selectedDeptReport = dept;
    this.showDeptModal = true;
  }

  closeDeptReportModal(): void {
    this.showDeptModal = false;
    this.selectedDeptReport = null;
  }

  downloadDeptReportCSV(): void {
    if (!this.selectedDeptReport) return;
    let csv = `Department Overtime Audit Report - ${this.selectedDeptReport.dept}\n`;
    csv += 'Employee Name,Role,Approved OT Hours,Rate Multiplier,Total Payout (INR),Status\n';
    this.selectedDeptReport.breakdown.forEach(row => {
      csv += `"${row.empName}","${row.role}","${row.approvedOt}","${row.rateMultiplier}",${row.payout},"${row.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${this.selectedDeptReport.dept.replace(/[^a-zA-Z0-9]/g, '_')}_OT_Report.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
    this.showToast('success', 'CSV Downloaded', `Exported OT Report for ${this.selectedDeptReport.dept}.`);
  }

  openSalaryModal(emp: EmployeeSalaryItem): void {
    this.selectedSalaryEmp = emp;
    this.showSalaryModal = true;
  }

  closeSalaryModal(): void {
    this.showSalaryModal = false;
    this.selectedSalaryEmp = null;
  }

  syncPayrollSlips(): void {
    this.showToast('success', 'Payroll Synced', 'OT calculations successfully synced with monthly Salary Slips!');
  }

  printWindow(): void {
    window.print();
  }

  // -------------------------------------------------------------
  // Utilities & Helpers
  // -------------------------------------------------------------
  private computeHoursDiff(start: string, end: string): number {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let diffMinutes = (eh * 60 + em) - (sh * 60 + sm);
    if (diffMinutes < 0) diffMinutes += 24 * 60;
    return parseFloat((diffMinutes / 60).toFixed(1));
  }

  private formatTimeSlot(timeStr: string): string {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    const minuteStr = m < 10 ? `0${m}` : `${m}`;
    return `${hour12}:${minuteStr} ${ampm}`;
  }

  showToast(type: 'success' | 'danger' | 'info' | 'warning', title: string, message: string): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toast = { type, title, message };
    this.toastTimeout = setTimeout(() => {
      this.toast = null;
    }, 4500);
  }

  closeToast(): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toast = null;
  }
}
