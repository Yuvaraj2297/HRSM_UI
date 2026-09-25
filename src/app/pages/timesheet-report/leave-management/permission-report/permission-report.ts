import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Breadcrumb } from '../../../../shared/breadcrumb/breadcrumb';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
  PrimeTableActions,
} from '../../../../shared/primedatatable/primedatatable';

export interface PermissionRequest {
  id: number;
  sno?: number;
  emp_id: number | string;
  name: string;
  role?: string;
  avatar: string;
  empSubtitle?: string;
  type: 'Late Coming' | 'Early Leaving' | 'Out Permission' | string;
  date: string;
  dateKey: string;
  from: string;
  to: string;
  totalMin: number;
  total: string;
  approver: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedOn: string;
  requestedOnKey?: string;
}

export interface TeamPermissionRequest {
  id: number;
  emp_id: number | string;
  name: string;
  role: string;
  avatar: string;
  type: string;
  date: string;
  from: string;
  to: string;
  totalMin: number;
  total: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedOn: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-permission-report',
  standalone: true,
  imports: [CommonModule, FormsModule, Breadcrumb, SelectModule, PrimeDataTable, AppStatCard],
  templateUrl: './permission-report.html',
  styleUrl: './permission-report.scss',
})
export class PermissionReport implements OnInit {
  // Current Date
  today: Date = new Date();
  currentYear: number = 2026;
  currentMonth: number = 8; // September (0-indexed)

  // Filters State
  selectedMonth: number = 8;
  selectedYear: number = 2026;
  activeStatusFilter: '' | 'Pending' | 'Approved' | 'Rejected' = '';

  // Select Options (PrimeNG p-select)
  monthOptions: SelectOption[] = [
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 },
  ];

  yearOptions: SelectOption[] = [
    { label: '2026', value: 2026 },
    { label: '2025', value: 2025 },
    { label: '2024', value: 2024 },
  ];

  permissionTypeOptions: SelectOption[] = [
    { label: 'Select permission type', value: '' },
    { label: 'Late Coming', value: 'Late Coming' },
    { label: 'Early Leaving', value: 'Early Leaving' },
    { label: 'Out Permission', value: 'Out Permission' },
  ];

  approverOptions: SelectOption[] = [
    { label: 'Select approver', value: '' },
    { label: 'Manager', value: 'Manager' },
    { label: 'Team Lead', value: 'Team Lead' },
    { label: 'HR', value: 'HR' },
  ];

  // PrimeDataTable Config
  modalHeader: PrimeTableHeader = {
    title: 'My Permission Requests',
    icon: 'bi bi-clock-history',
    count: 0,
    subtitle: 'Your permission history & status',
  };

  tableActions: PrimeTableActions = {
    add: false,
    edit: false,
    delete: false,
  };

  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', type: 'sno', width: '60px' },
    { field: 'name', header: 'Employee', type: 'avatar', imageField: 'avatar', subField: 'empSubtitle', width: '200px' },
    { field: 'type', header: 'Permission Type', type: 'custom', width: '160px' },
    { field: 'date', header: 'Date', type: 'text', width: '120px' },
    { field: 'from', header: 'From Time', type: 'text', width: '110px' },
    { field: 'to', header: 'To Time', type: 'text', width: '110px' },
    { field: 'total', header: 'Total Hours', type: 'custom', width: '110px' },
    { field: 'approver', header: 'Approved By', type: 'text', width: '130px' },
    { field: 'reason', header: 'Reason', type: 'text', width: '220px', cellClass: 'text-neutral' },
    { field: 'requestedOn', header: 'Requested On', type: 'text', width: '120px' },
    { field: 'status', header: 'Status', type: 'custom', width: '120px' },
  ];

  // Datasets
  allRequests: PermissionRequest[] = [];
  filteredRequests: PermissionRequest[] = [];
  teamRequests: TeamPermissionRequest[] = [];

  // Current logged in employee
  currentUser = {
    emp_id: 41,
    name: 'Vijai',
    role: 'Developer',
    avatar: './assets/img/profile-1.jpg',
  };

  // Modals State
  applyModalOpen: boolean = false;
  applySubmittedSuccess: boolean = false;
  employeePermModalOpen: boolean = false;

  // Apply Form Models
  applyDate: string = '';
  applyType: string = '';
  applyFromTime: string = '';
  applyToTime: string = '';
  applyApprover: string = '';
  applyReason: string = '';
  applyTotalDuration: string = '–';
  applyDurationMinutes: number = 0;
  applyFormErrors: { [key: string]: string | boolean } = {};
  applyIsSubmitting: boolean = false;

  // Toast Notification
  toastMessage: string = '';
  showToast: boolean = false;
  private toastTimer: any;

  ngOnInit(): void {
    this.currentYear = this.today.getFullYear();
    this.currentMonth = this.today.getMonth();
    this.selectedYear = this.currentYear;
    this.selectedMonth = this.currentMonth;

    this.initRequestsData();
    this.initTeamRequestsData();
    this.applyStatusFilter(this.activeStatusFilter);
  }

  // -------------------------------------------------------------
  // Data Generation (Matching PHP logic)
  // -------------------------------------------------------------
  private initRequestsData(): void {
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const yr = this.selectedYear;
    const mo = this.selectedMonth;

    const configs: [number, string, string, string, string, string, 'Pending' | 'Approved' | 'Rejected'][] = [
      [0, 'Late Coming', '09:45 AM', '10:45 AM', 'Manager', 'Traffic delay due to vehicle breakdown', 'Pending'],
      [1, 'Early Leaving', '04:30 PM', '05:30 PM', 'Team Lead', 'Family function at home', 'Pending'],
      [2, 'Out Permission', '11:00 AM', '01:00 PM', 'HR', 'Bank work - loan document submission', 'Pending'],
      [4, 'Late Coming', '10:00 AM', '11:00 AM', 'Manager', 'Annual medical checkup', 'Rejected'],
      [5, 'Out Permission', '02:00 PM', '03:30 PM', 'Team Lead', 'Courier pickup at residence', 'Approved'],
      [6, 'Early Leaving', '05:00 PM', '06:00 PM', 'Manager', 'Child school pickup', 'Approved'],
      [7, 'Late Coming', '09:30 AM', '10:30 AM', 'HR', 'Train delayed by 45 minutes', 'Approved'],
      [9, 'Out Permission', '12:00 PM', '02:00 PM', 'Manager', 'Aadhaar update at government office', 'Rejected'],
      [10, 'Early Leaving', '03:30 PM', '05:00 PM', 'Team Lead', 'Eye checkup appointment', 'Approved'],
      [11, 'Late Coming', '10:15 AM', '11:15 AM', 'Manager', 'Flat tyre on the way to office', 'Approved'],
      [13, 'Out Permission', '10:00 AM', '11:00 AM', 'HR', 'Property document signing', 'Approved'],
      [14, 'Early Leaving', '04:00 PM', '05:00 PM', 'Team Lead', 'Tenant house visit', 'Approved'],
    ];

    const todayD = this.today.getDate();
    const rows: PermissionRequest[] = [];

    configs.forEach((c, index) => {
      const d = Math.max(1, todayD - c[0]);
      const dayStr = `${d} ${monthsShort[mo]} ${yr}`;
      const dateKey = `${yr}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const totalMin = this.calcMinutes(c[2], c[3]);

      rows.push({
        id: index + 1,
        sno: index + 1,
        emp_id: this.currentUser.emp_id,
        name: this.currentUser.name,
        role: this.currentUser.role,
        avatar: this.currentUser.avatar,
        empSubtitle: `EMP ${this.currentUser.emp_id}`,
        type: c[1],
        date: dayStr,
        dateKey,
        from: c[2],
        to: c[3],
        totalMin,
        total: this.durText(totalMin),
        approver: c[4],
        reason: c[5],
        status: c[6],
        requestedOn: dayStr,
      });
    });

    this.allRequests = rows;
  }

  private initTeamRequestsData(): void {
    const teamList: TeamPermissionRequest[] = [
      {
        id: 101,
        emp_id: 34,
        name: 'Karthik Raja',
        role: 'Developer',
        avatar: './assets/img/profile-2.jpg',
        type: 'Go on business',
        date: '19 Sep 2026',
        from: '11:16 AM',
        to: '12:37 PM',
        totalMin: 81,
        total: '1h 21m',
        reason: 'Flat tyre on the way to office',
        status: 'Pending',
        requestedOn: '19 Sep 2026',
      },
      {
        id: 102,
        emp_id: 32,
        name: 'Mohammed Farhan',
        role: 'Developer',
        avatar: './assets/img/profile-4.jpg',
        type: 'Early Leaving',
        date: '18 Sep 2026',
        from: '04:49 PM',
        to: '05:31 PM',
        totalMin: 42,
        total: '42m',
        reason: 'Aadhaar update at government office',
        status: 'Pending',
        requestedOn: '18 Sep 2026',
      },
      {
        id: 103,
        emp_id: 31,
        name: 'Deepa Nair',
        role: 'HR',
        avatar: './assets/img/profile-1.jpg',
        type: 'Go on business',
        date: '16 Sep 2026',
        from: '12:24 PM',
        to: '02:07 PM',
        totalMin: 103,
        total: '1h 43m',
        reason: 'Property document signing',
        status: 'Pending',
        requestedOn: '16 Sep 2026',
      },
      {
        id: 104,
        emp_id: 31,
        name: 'Deepa Nair',
        role: 'HR',
        avatar: './assets/img/profile-1.jpg',
        type: 'Late Coming',
        date: '11 Sep 2026',
        from: '10:21 AM',
        to: '11:08 AM',
        totalMin: 47,
        total: '47m',
        reason: 'Flat tyre on the way to office',
        status: 'Pending',
        requestedOn: '11 Sep 2026',
      },
      {
        id: 105,
        emp_id: 31,
        name: 'Deepa Nair',
        role: 'HR',
        avatar: './assets/img/profile-1.jpg',
        type: 'Out Permission',
        date: '10 Sep 2026',
        from: '12:10 PM',
        to: '12:47 PM',
        totalMin: 37,
        total: '37m',
        reason: 'Train delayed by 45 minutes',
        status: 'Pending',
        requestedOn: '10 Sep 2026',
      },
      {
        id: 106,
        emp_id: 34,
        name: 'Karthik Raja',
        role: 'Developer',
        avatar: './assets/img/profile-2.jpg',
        type: 'Out Permission',
        date: '9 Sep 2026',
        from: '11:44 AM',
        to: '12:34 PM',
        totalMin: 50,
        total: '50m',
        reason: 'Flat tyre on the way to office',
        status: 'Pending',
        requestedOn: '9 Sep 2026',
      },
      {
        id: 107,
        emp_id: 33,
        name: 'Priya Sharma',
        role: 'Designer',
        avatar: './assets/img/profile-3.jpg',
        type: 'Go on business',
        date: '8 Sep 2026',
        from: '12:49 PM',
        to: '01:59 PM',
        totalMin: 70,
        total: '1h 10m',
        reason: 'Family function at home',
        status: 'Pending',
        requestedOn: '8 Sep 2026',
      },
      {
        id: 108,
        emp_id: 39,
        name: 'Shailni Raj',
        role: 'Branch Manager',
        avatar: './assets/img/profile-3.jpg',
        type: 'Out Permission',
        date: '8 Sep 2026',
        from: '11:38 AM',
        to: '12:39 PM',
        totalMin: 61,
        total: '1h 1m',
        reason: 'Eye checkup appointment',
        status: 'Pending',
        requestedOn: '8 Sep 2026',
      },
      {
        id: 109,
        emp_id: 34,
        name: 'Karthik Raja',
        role: 'Developer',
        avatar: './assets/img/profile-2.jpg',
        type: 'Late Coming',
        date: '7 Sep 2026',
        from: '10:05 AM',
        to: '11:02 AM',
        totalMin: 57,
        total: '57m',
        reason: 'Traffic delay due to vehicle breakdown',
        status: 'Pending',
        requestedOn: '7 Sep 2026',
      },
      {
        id: 110,
        emp_id: 40,
        name: 'Anbarasan',
        role: 'Developer',
        avatar: './assets/img/profile-2.jpg',
        type: 'Early Leaving',
        date: '5 Sep 2026',
        from: '04:30 PM',
        to: '05:30 PM',
        totalMin: 60,
        total: '1h',
        reason: 'Bank work - loan document submission',
        status: 'Pending',
        requestedOn: '5 Sep 2026',
      },
    ];

    this.teamRequests = teamList;
  }

  // -------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------
  private calcMinutes(fromStr: string, toStr: string): number {
    const f = this.parse12hToMin(fromStr);
    const t = this.parse12hToMin(toStr);
    return Math.max(0, t - f);
  }

  private parse12hToMin(s: string): number {
    const m = s.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!m) return 0;
    let hh = parseInt(m[1], 10) % 12;
    if (m[3].toUpperCase() === 'PM') hh += 12;
    return hh * 60 + parseInt(m[2], 10);
  }

  private durText(mins: number): string {
    const hh = Math.floor(mins / 60);
    const mm = mins % 60;
    const p: string[] = [];
    if (hh) p.push(`${hh}h`);
    if (mm || !hh) p.push(`${mm}m`);
    return p.join(' ');
  }

  private to12h(time24: string): string {
    if (!time24) return '';
    const parts = time24.split(':');
    if (parts.length < 2) return '';
    const hh = parseInt(parts[0], 10);
    const mm = parseInt(parts[1], 10);
    const sfx = hh >= 12 ? 'PM' : 'AM';
    let h12 = hh % 12;
    if (h12 === 0) h12 = 12;
    return `${String(h12).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${sfx}`;
  }

  // -------------------------------------------------------------
  // KPI Metrics
  // -------------------------------------------------------------
  get totalCount(): number {
    return this.allRequests.length;
  }

  get pendingCount(): number {
    return this.allRequests.filter((r) => r.status === 'Pending').length;
  }

  get approvedCount(): number {
    return this.allRequests.filter((r) => r.status === 'Approved').length;
  }

  get rejectedCount(): number {
    return this.allRequests.filter((r) => r.status === 'Rejected').length;
  }

  // -------------------------------------------------------------
  // Filter Operations
  // -------------------------------------------------------------
  onKpiClick(status: '' | 'Pending' | 'Approved' | 'Rejected'): void {
    if (this.activeStatusFilter === status) {
      this.activeStatusFilter = '';
    } else {
      this.activeStatusFilter = status;
    }
    this.applyStatusFilter(this.activeStatusFilter);
  }

  applyMonthYearFilter(): void {
    this.initRequestsData();
    this.applyStatusFilter(this.activeStatusFilter);
    const monthName = this.monthOptions.find((m) => m.value === this.selectedMonth)?.label || '';
    this.modalHeader.subtitle = `Permission history · ${monthName} ${this.selectedYear}`;
    this.triggerToast(`Viewing permission requests for ${monthName} ${this.selectedYear}`);
  }

  applyStatusFilter(status: '' | 'Pending' | 'Approved' | 'Rejected'): void {
    if (!status) {
      this.filteredRequests = [...this.allRequests].map((r, i) => ({ ...r, sno: i + 1 }));
    } else {
      this.filteredRequests = this.allRequests
        .filter((r) => r.status === status)
        .map((r, i) => ({ ...r, sno: i + 1 }));
    }
    this.modalHeader.count = this.filteredRequests.length;
  }

  // -------------------------------------------------------------
  // Apply Permission Modal
  // -------------------------------------------------------------
  openApplyModal(): void {
    this.applyDate = new Date().toISOString().slice(0, 10);
    this.applyType = '';
    this.applyFromTime = '09:45';
    this.applyToTime = '10:45';
    this.applyApprover = 'Manager';
    this.applyReason = '';
    this.applyFormErrors = {};
    this.applySubmittedSuccess = false;
    this.recalcApplyTotal();
    this.applyModalOpen = true;
  }

  closeApplyModal(): void {
    this.applyModalOpen = false;
    this.applySubmittedSuccess = false;
  }

  recalcApplyTotal(): void {
    if (!this.applyFromTime || !this.applyToTime) {
      this.applyTotalDuration = '–';
      this.applyDurationMinutes = 0;
      return;
    }
    const [fH, fM] = this.applyFromTime.split(':').map(Number);
    const [tH, tM] = this.applyToTime.split(':').map(Number);
    const fromMin = fH * 60 + fM;
    const toMin = tH * 60 + tM;
    const diff = toMin - fromMin;

    if (diff <= 0) {
      this.applyTotalDuration = 'Invalid range';
      this.applyDurationMinutes = 0;
      return;
    }
    this.applyDurationMinutes = diff;
    this.applyTotalDuration = this.durText(diff);
  }

  submitApplyPermission(): void {
    const errors: { [key: string]: string | boolean } = {};
    if (!this.applyDate) errors['date'] = true;
    if (!this.applyType) errors['type'] = true;
    if (!this.applyFromTime || !this.applyToTime) {
      errors['time'] = 'Please select both From and To time';
    } else if (this.applyDurationMinutes <= 0) {
      errors['time'] = 'To time should be after From time';
    } else if (this.applyDurationMinutes > 120) {
      errors['time'] = 'Permission total cannot be more than 2 hours';
    }
    if (!this.applyApprover) errors['approver'] = true;
    if (!this.applyReason.trim() || this.applyReason.trim().length < 5) {
      errors['reason'] = true;
    }

    this.applyFormErrors = errors;
    if (Object.keys(errors).length > 0) return;

    this.applyIsSubmitting = true;

    setTimeout(() => {
      this.applyIsSubmitting = false;

      const d = new Date(this.applyDate);
      const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateStr = `${d.getDate()} ${monthsShort[d.getMonth()]} ${d.getFullYear()}`;

      const newRow: PermissionRequest = {
        id: this.allRequests.length + 1,
        sno: 1,
        emp_id: this.currentUser.emp_id,
        name: this.currentUser.name,
        role: this.currentUser.role,
        avatar: this.currentUser.avatar,
        empSubtitle: `EMP ${this.currentUser.emp_id}`,
        type: this.applyType,
        date: dateStr,
        dateKey: this.applyDate,
        from: this.to12h(this.applyFromTime),
        to: this.to12h(this.applyToTime),
        totalMin: this.applyDurationMinutes,
        total: this.applyTotalDuration,
        approver: this.applyApprover,
        reason: this.applyReason.trim(),
        status: 'Pending',
        requestedOn: dateStr,
      };

      this.allRequests.unshift(newRow);
      this.activeStatusFilter = 'Pending';
      this.applyStatusFilter('Pending');
      this.applySubmittedSuccess = true;
      this.triggerToast('Permission request submitted successfully.');
    }, 450);
  }

  // -------------------------------------------------------------
  // Employee Permissions Fullscreen Modal
  // -------------------------------------------------------------
  openEmployeePermModal(): void {
    this.employeePermModalOpen = true;
  }

  closeEmployeePermModal(): void {
    this.employeePermModalOpen = false;
  }

  approveTeamRequest(req: TeamPermissionRequest): void {
    req.status = 'Approved';
    this.triggerToast(`Approved permission request for ${req.name}`);
  }

  rejectTeamRequest(req: TeamPermissionRequest): void {
    req.status = 'Rejected';
    this.triggerToast(`Rejected permission request for ${req.name}`);
  }

  get pendingTeamRequests(): TeamPermissionRequest[] {
    return this.teamRequests.filter((r) => r.status === 'Pending');
  }

  get pendingTeamCount(): number {
    return this.pendingTeamRequests.length;
  }

  // -------------------------------------------------------------
  // Toast Helper
  // -------------------------------------------------------------
  triggerToast(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.showToast = false;
    }, 3500);
  }
}
