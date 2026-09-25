import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Breadcrumb } from '../../../../shared/breadcrumb/breadcrumb';
import {
    PrimeDataTable,
    PrimeTableActions,
    PrimeTableColumn,
    PrimeTableHeader,
    PrimeTableRowAction,
} from '../../../../shared/primedatatable/primedatatable';

export interface LeaveRequestRow {
  id: string;
  sno?: number;
  empId: string;
  name: string;
  employee: string;
  avatar: string;
  leaveType: string;
  typeKey: 'casual' | 'sick' | 'earned' | 'wfh' | string;
  from: string;
  rawFrom: string;
  to: string;
  rawTo: string;
  days: number | string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  isPartial?: boolean;
  partialText?: string;
  balance: number;
  quota: number;
  rejectionReason?: string;
}

export interface DayReviewItem {
  index: number;
  dayNum: number;
  dow: string;
  dateStr: string;
  status: 'approved' | 'rejected' | 'pending';
  reason?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

import { Calendar } from '../../../../shared/calendar/calendar';

@Component({
  selector: 'app-leave-report',
  standalone: true,
  imports: [CommonModule, FormsModule, Breadcrumb, SelectModule, PrimeDataTable, Calendar],
  templateUrl: './leave-report.html',
  styleUrl: './leave-report.scss',
})
export class LeaveReport implements OnInit {
  // Navigation Tabs
  activeTab: 'requests' | 'team-calendar' = 'requests';

  // KPI Filter State
  activeKpiFilter: 'all' | 'Approved' | 'Pending' | 'days' | 'Rejected' = 'all';

  // Filter Collapse State
  filtersCollapsed = false;
  filterSearch = '';
  selectedLeaveType = 'All Types';
  selectedStatus = 'All Status';
  selectedDateRange = '';

  // Select Options (PrimeNG p-select)
  leaveTypeFilterOptions: SelectOption[] = [
    { label: 'All Types', value: 'All Types' },
    { label: 'Casual Leave', value: 'Casual Leave' },
    { label: 'Sick Leave', value: 'Sick Leave' },
    { label: 'Earned Leave', value: 'Earned Leave' },
    { label: 'Work From Home', value: 'Work From Home' },
  ];

  statusFilterOptions: SelectOption[] = [
    { label: 'All Status', value: 'All Status' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  applyLeaveTypeOptions: SelectOption[] = [
    { label: 'Select Leave Type', value: '' },
    { label: 'Annual Leave', value: 'Annual Leave' },
    { label: 'Bereavement Leave', value: 'Bereavement Leave' },
    { label: 'Casual Leave', value: 'Casual Leave' },
    { label: 'Compensatory Off', value: 'Compensatory Off' },
    { label: 'PTO', value: 'PTO' },
    { label: 'Sick Leave', value: 'Sick Leave' },
    { label: 'Earned Leave', value: 'Earned Leave' },
    { label: 'Work From Home', value: 'Work From Home' },
  ];

  applyDayTypeOptions: SelectOption[] = [
    { label: 'Full Day', value: 'Full Day' },
    { label: 'First Half', value: 'First Half' },
    { label: 'Second Half', value: 'Second Half' },
  ];

  // PrimeDataTable Configuration
  modalHeader: PrimeTableHeader = {
    title: 'Leave Requests',
    icon: 'bi bi-calendar2-range',
    count: 0,
  };

  tableActions: PrimeTableActions = {
    add: true,
    addLabel: 'Apply Leave',
    addIcon: 'bi bi-plus-lg',
  };

  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', type: 'sno', width: '70px' },
    { field: 'empId', header: 'Employee ID', type: 'link', width: '130px', cellClass: 'fw-semibold text-primary' },
    { field: 'employee', header: 'Employee', type: 'avatar', imageField: 'avatar', subField: 'empId', width: '220px' },
    { field: 'leaveType', header: 'Leave Type', type: 'custom', width: '150px' },
    { field: 'from', header: 'From', type: 'text', width: '120px' },
    { field: 'to', header: 'To', type: 'text', width: '120px' },
    { field: 'days', header: 'Days', type: 'text', width: '80px', cellClass: '' },
    { field: 'reason', header: 'Reason', type: 'text', width: '180px', cellClass: 'text-neutral' },
    { field: 'balance', header: 'Balance', type: 'custom', width: '150px' },
    { field: 'status', header: 'Status', type: 'custom', width: '140px' },
    { field: 'actions', header: 'Actions', type: 'actions', width: '90px' },
  ];

  rowActions: PrimeTableRowAction[] = [
    {
      key: 'approve',
      label: 'Approve',
      icon: 'bi bi-check-lg text-success',
      hiddenWhen: (row) => row.status !== 'Pending',
    },
    {
      key: 'partial',
      label: 'Partial Approve',
      icon: 'bi bi-check2-circle text-primary',
      hiddenWhen: (row) => row.status !== 'Pending' || Number(row.days) <= 1,
    },
    {
      key: 'reject',
      label: 'Reject',
      icon: 'bi bi-x-lg text-danger',
      hiddenWhen: (row) => row.status !== 'Pending',
    },
    {
      key: 'view-reason',
      label: 'View Reason',
      icon: 'bi bi-eye text-info',
      hiddenWhen: (row) => row.status !== 'Rejected' && !row.isPartial,
    },
  ];

  // Master Raw Data (30 rows from leave-report.php)
  allLeaveRows: LeaveRequestRow[] = [];
  filteredLeaveRows: LeaveRequestRow[] = [];

  // Reject Modal State
  rejectModalOpen = false;
  rejectRow: LeaveRequestRow | null = null;
  rejectReason = '';
  rejectError = false;

  // Partial Approve Modal State
  partialModalOpen = false;
  partialRow: LeaveRequestRow | null = null;
  partialDaysList: DayReviewItem[] = [];
  partialNote = '';

  // Day Reject Sub-Modal State
  dayRejectModalOpen = false;
  dayRejectIdx = -1;
  dayRejectReason = '';
  dayRejectError = false;

  // View Reason Modal State
  viewReasonModalOpen = false;
  viewReasonEmployee = '';
  viewReasonText = '';

  // Apply Leave Modal State
  applyModalOpen = false;
  applyLeaveType = '';
  applyFromDate = '';
  applyToDate = '';
  applyDayType = 'Full Day';
  applyReason = '';
  applyTotalDays = '0 Day(s)';
  availableBalance = 5;
  currentlyBooked = 1;
  balanceAfterBooking = 4;
  estimatedBalance = 4;

  // Toast Notification State
  toastMessage = '';
  showToast = false;
  private toastTimer: any;

  ngOnInit(): void {
    this.initData();
    this.applyFilters();
  }

  // -------------------------------------------------------------
  // Data Initialization
  // -------------------------------------------------------------
  private initData(): void {
    const raw: [string, string, string, string, string, string, string, string, 'Approved' | 'Pending' | 'Rejected', number, number][] = [
      ['Amelia Curr', 'EMP0001', 'Casual Leave', '2026-08-27', '2026-08-27', '1', 'Personal work', 'casual', 'Approved', 14, 20],
      ['Daniel Martinez', 'EMP0002', 'Sick Leave', '2026-08-27', '2026-08-28', '2', 'Medical appointment', 'sick', 'Pending', 7, 12],
      ['David Anderson', 'EMP0003', 'Earned Leave', '2026-08-26', '2026-08-29', '4', 'Family function', 'earned', 'Approved', 10, 18],
      ['Emily Clark', 'EMP0004', 'Work From Home', '2026-08-27', '2026-08-27', '1', 'Home maintenance', 'wfh', 'Approved', 8, 10],
      ['Sophia Johnson', 'EMP0005', 'Casual Leave', '2026-08-25', '2026-08-26', '2', 'Personal work', 'casual', 'Rejected', 12, 20],
      ['Liam Wilson', 'EMP0006', 'Sick Leave', '2026-08-20', '2026-08-21', '2', 'Fever and rest', 'sick', 'Approved', 5, 12],
      ['Olivia Brown', 'EMP0007', 'Earned Leave', '2026-08-14', '2026-08-15', '2', 'Travel plan', 'earned', 'Pending', 9, 18],
      ['Noah Davis', 'EMP0008', 'Casual Leave', '2026-08-08', '2026-08-08', '1', 'Personal work', 'casual', 'Approved', 16, 20],
      ['Emma Garcia', 'EMP0009', 'Sick Leave', '2026-08-05', '2026-08-06', '2', 'Cold and cough', 'sick', 'Approved', 4, 12],
      ['James Rodriguez', 'EMP0010', 'Casual Leave', '2026-08-01', '2026-08-02', '2', 'Family event', 'casual', 'Approved', 11, 20],
      ['Olivia Martinez', 'EMP0011', 'Earned Leave', '2026-07-28', '2026-07-30', '3', 'Vacation trip', 'earned', 'Approved', 7, 18],
      ['William Anderson', 'EMP0012', 'Work From Home', '2026-07-25', '2026-07-25', '1', 'Remote work', 'wfh', 'Approved', 6, 10],
      ['Sophia Thomas', 'EMP0013', 'Casual Leave', '2026-07-22', '2026-07-23', '2', 'Personal errands', 'casual', 'Pending', 13, 20],
      ['Benjamin Jackson', 'EMP0014', 'Sick Leave', '2026-07-18', '2026-07-19', '2', 'Doctor visit', 'sick', 'Approved', 3, 12],
      ['Isabella White', 'EMP0015', 'Earned Leave', '2026-07-15', '2026-07-18', '4', 'Holiday trip', 'earned', 'Rejected', 8, 18],
      ['Mason Harris', 'EMP0016', 'Casual Leave', '2026-07-12', '2026-07-12', '1', 'Birthday leave', 'casual', 'Approved', 15, 20],
      ['Mia Clark', 'EMP0017', 'Work From Home', '2026-07-08', '2026-07-09', '2', 'Home repair', 'wfh', 'Pending', 5, 10],
      ['Ethan Lewis', 'EMP0018', 'Sick Leave', '2026-07-05', '2026-07-06', '2', 'Stomach ache', 'sick', 'Approved', 9, 12],
      ['Charlotte Walker', 'EMP0019', 'Earned Leave', '2026-07-01', '2026-07-03', '3', 'Wedding ceremony', 'earned', 'Approved', 6, 18],
      ['Alexander Hall', 'EMP0020', 'Casual Leave', '2026-06-28', '2026-06-29', '2', 'Personal matter', 'casual', 'Rejected', 10, 20],
      ['Amelia Allen', 'EMP0021', 'Sick Leave', '2026-06-25', '2026-06-25', '1', 'Headache', 'sick', 'Approved', 11, 12],
      ['Daniel Young', 'EMP0022', 'Earned Leave', '2026-06-20', '2026-06-22', '3', 'Family vacation', 'earned', 'Pending', 4, 18],
      ['Emily King', 'EMP0023', 'Work From Home', '2026-06-15', '2026-06-15', '1', 'Remote work', 'wfh', 'Approved', 7, 10],
      ['David Wright', 'EMP0024', 'Casual Leave', '2026-06-12', '2026-06-13', '2', 'Relocation', 'casual', 'Approved', 14, 20],
      ['Sophia Lopez', 'EMP0025', 'Sick Leave', '2026-06-08', '2026-06-10', '3', 'Flu recovery', 'sick', 'Approved', 2, 12],
      ['Liam Hill', 'EMP0026', 'Earned Leave', '2026-06-05', '2026-06-07', '3', 'Conference trip', 'earned', 'Pending', 12, 18],
      ['Olivia Scott', 'EMP0027', 'Casual Leave', '2026-06-01', '2026-06-01', '1', 'Personal errands', 'casual', 'Approved', 9, 20],
      ['Noah Green', 'EMP0028', 'Work From Home', '2026-05-28', '2026-05-28', '1', 'Remote work', 'wfh', 'Approved', 6, 10],
      ['Emma Adams', 'EMP0029', 'Sick Leave', '2026-05-25', '2026-05-26', '2', 'Dental appointment', 'sick', 'Rejected', 8, 12],
      ['James Baker', 'EMP0030', 'Earned Leave', '2026-05-20', '2026-05-23', '4', 'Family reunion', 'earned', 'Approved', 5, 18],
    ];

    this.allLeaveRows = raw.map((item, index) => {
      const name = item[0];
      const empId = item[1];
      const leaveType = item[2];
      const from = item[3];
      const to = item[4];
      const days = item[5];
      const reason = item[6];
      const typeKey = item[7];
      const status = item[8];
      const balance = item[9];
      const quota = item[10];
      const avatarIndex = (index % 5) + 1;

      return {
        id: `LR-${index + 1}`,
        sno: index + 1,
        empId,
        name,
        employee: name,
        avatar: `./assets/img/profile-${avatarIndex}.jpg`,
        leaveType,
        typeKey,
        from: this.formatDisplayDate(from),
        rawFrom: from,
        to: this.formatDisplayDate(to),
        rawTo: to,
        days,
        reason,
        status,
        balance,
        quota,
        rejectionReason: name === 'Sophia Johnson' && status === 'Rejected' ? 'Insufficient leave balance' : '',
      };
    });
  }

  private formatDisplayDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }

  // -------------------------------------------------------------
  // KPI Calculations
  // -------------------------------------------------------------
  get totalRequestsCount(): number {
    return this.allLeaveRows.length;
  }

  get approvedCount(): number {
    return this.allLeaveRows.filter((r) => r.status === 'Approved').length;
  }

  get pendingCount(): number {
    return this.allLeaveRows.filter((r) => r.status === 'Pending').length;
  }

  get daysOnLeaveCount(): number {
    return this.allLeaveRows.reduce((acc, r) => acc + (Number(r.days) || 0), 0);
  }

  get rejectedCount(): number {
    return this.allLeaveRows.filter((r) => r.status === 'Rejected').length;
  }

  setKpiFilter(filter: 'all' | 'Approved' | 'Pending' | 'days' | 'Rejected'): void {
    this.activeKpiFilter = filter;
    this.applyFilters();
  }

  // -------------------------------------------------------------
  // Filter Operations
  // -------------------------------------------------------------
  toggleFilters(): void {
    this.filtersCollapsed = !this.filtersCollapsed;
  }

  applyFilters(): void {
    let rows = [...this.allLeaveRows];

    // 1. KPI Filter
    if (this.activeKpiFilter === 'Approved') {
      rows = rows.filter((r) => r.status === 'Approved');
    } else if (this.activeKpiFilter === 'Pending') {
      rows = rows.filter((r) => r.status === 'Pending');
    } else if (this.activeKpiFilter === 'Rejected') {
      rows = rows.filter((r) => r.status === 'Rejected');
    }

    // 2. Search (name or empId)
    const search = this.filterSearch.trim().toLowerCase();
    if (search) {
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(search) ||
          r.empId.toLowerCase().includes(search) ||
          r.reason.toLowerCase().includes(search)
      );
    }

    // 3. Leave Type
    if (this.selectedLeaveType && this.selectedLeaveType !== 'All Types') {
      rows = rows.filter((r) => r.leaveType === this.selectedLeaveType);
    }

    // 4. Status
    if (this.selectedStatus && this.selectedStatus !== 'All Status') {
      rows = rows.filter((r) => r.status === this.selectedStatus);
    }

    // 5. Date Range
    if (this.selectedDateRange.trim()) {
      const q = this.selectedDateRange.trim();
      rows = rows.filter((r) => r.rawFrom.includes(q) || r.rawTo.includes(q) || r.from.includes(q) || r.to.includes(q));
    }

    this.filteredLeaveRows = rows.map((r, i) => ({ ...r, sno: i + 1 }));
    this.modalHeader.count = this.filteredLeaveRows.length;
  }

  clearFilters(): void {
    this.filterSearch = '';
    this.selectedLeaveType = 'All Types';
    this.selectedStatus = 'All Status';
    this.selectedDateRange = '';
    this.activeKpiFilter = 'all';
    this.applyFilters();
  }

  get hasActiveFilters(): boolean {
    return (
      !!this.filterSearch.trim() ||
      this.selectedLeaveType !== 'All Types' ||
      this.selectedStatus !== 'All Status' ||
      !!this.selectedDateRange.trim() ||
      this.activeKpiFilter !== 'all'
    );
  }

  removeSearchFilter(): void {
    this.filterSearch = '';
    this.applyFilters();
  }

  removeTypeFilter(): void {
    this.selectedLeaveType = 'All Types';
    this.applyFilters();
  }

  removeStatusFilter(): void {
    this.selectedStatus = 'All Status';
    this.applyFilters();
  }

  removeDateFilter(): void {
    this.selectedDateRange = '';
    this.applyFilters();
  }

  removeKpiFilter(): void {
    this.activeKpiFilter = 'all';
    this.applyFilters();
  }

  // -------------------------------------------------------------
  // PrimeDataTable Action Handling
  // -------------------------------------------------------------
  handleActionClick(event: { action: string; row: LeaveRequestRow }): void {
    const { action, row } = event;
    if (action === 'approve') {
      this.approveRequest(row);
    } else if (action === 'partial') {
      this.openPartialApproveModal(row);
    } else if (action === 'reject') {
      this.openRejectModal(row);
    } else if (action === 'view-reason') {
      this.openViewReasonModal(row);
    }
  }

  approveRequest(row: LeaveRequestRow): void {
    row.status = 'Approved';
    row.isPartial = false;
    row.partialText = undefined;
    this.applyFilters();
    this.triggerToast(`Leave request for ${row.name} has been approved.`);
  }

  // -------------------------------------------------------------
  // Reject Modal
  // -------------------------------------------------------------
  openRejectModal(row: LeaveRequestRow): void {
    this.rejectRow = row;
    this.rejectReason = '';
    this.rejectError = false;
    this.rejectModalOpen = true;
  }

  closeRejectModal(): void {
    this.rejectModalOpen = false;
    this.rejectRow = null;
    this.rejectReason = '';
    this.rejectError = false;
  }

  submitRejection(): void {
    if (!this.rejectReason.trim()) {
      this.rejectError = true;
      return;
    }
    if (this.rejectRow) {
      this.rejectRow.status = 'Rejected';
      this.rejectRow.rejectionReason = this.rejectReason.trim();
      this.rejectRow.isPartial = false;
      this.rejectRow.partialText = undefined;
      this.applyFilters();
      this.triggerToast(`Leave request for ${this.rejectRow.name} was rejected.`);
    }
    this.closeRejectModal();
  }

  // -------------------------------------------------------------
  // Partial Approve Modal & Per-Day Reviews
  // -------------------------------------------------------------
  openPartialApproveModal(row: LeaveRequestRow): void {
    this.partialRow = row;
    this.partialNote = '';
    const totalDays = parseInt(String(row.days) || '1', 10) || 1;
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const fromDate = new Date(row.rawFrom || new Date());

    this.partialDaysList = [];
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(fromDate);
      d.setDate(d.getDate() + i);
      const dayNum = i + 1;
      const dateStr = this.formatDisplayDate(d.toISOString().slice(0, 10));
      const dow = weekdays[d.getDay()];

      this.partialDaysList.push({
        index: i,
        dayNum,
        dow,
        dateStr,
        status: 'pending',
        reason: '',
      });
    }

    this.partialModalOpen = true;
  }

  closePartialApproveModal(): void {
    this.partialModalOpen = false;
    this.partialRow = null;
    this.partialDaysList = [];
    this.partialNote = '';
  }

  toggleDayApproval(day: DayReviewItem): void {
    if (day.status === 'rejected') {
      return;
    }
    day.status = day.status === 'approved' ? 'pending' : 'approved';
    day.reason = '';
  }

  openDayRejectModal(day: DayReviewItem): void {
    this.dayRejectIdx = day.index;
    this.dayRejectReason = day.reason || '';
    this.dayRejectError = false;
    this.dayRejectModalOpen = true;
  }

  closeDayRejectModal(): void {
    this.dayRejectModalOpen = false;
    this.dayRejectIdx = -1;
    this.dayRejectReason = '';
    this.dayRejectError = false;
  }

  submitDayRejection(): void {
    if (!this.dayRejectReason.trim()) {
      this.dayRejectError = true;
      return;
    }
    if (this.dayRejectIdx > -1 && this.partialDaysList[this.dayRejectIdx]) {
      this.partialDaysList[this.dayRejectIdx].status = 'rejected';
      this.partialDaysList[this.dayRejectIdx].reason = this.dayRejectReason.trim();
    }
    this.closeDayRejectModal();
  }

  viewDayReason(day: DayReviewItem): void {
    const empName = this.partialRow ? this.partialRow.name : 'Employee';
    this.viewReasonEmployee = `${empName} (${day.dow}, ${day.dateStr})`;
    this.viewReasonText = day.reason || 'No rejection reason specified for this day.';
    this.viewReasonModalOpen = true;
  }

  get partialApprovedCount(): number {
    return this.partialDaysList.filter((d) => d.status === 'approved').length;
  }

  get partialRejectedCount(): number {
    return this.partialDaysList.filter((d) => d.status === 'rejected').length;
  }

  get partialPendingCount(): number {
    return this.partialDaysList.filter((d) => d.status === 'pending').length;
  }

  confirmPartialReview(): void {
    if (!this.partialRow) return;

    const approved = this.partialApprovedCount;
    const rejected = this.partialRejectedCount;
    const pending = this.partialPendingCount;
    const total = this.partialDaysList.length;

    if (approved === 0 && rejected === 0) {
      this.closePartialApproveModal();
      return;
    }

    if (approved > 0) {
      this.partialRow.days = approved;
      this.partialRow.status = 'Approved';
      if (approved < total) {
        this.partialRow.isPartial = true;
        this.partialRow.partialText = `Partial (${approved}/${total}d)`;
      } else {
        this.partialRow.isPartial = false;
        this.partialRow.partialText = undefined;
      }
    } else if (rejected > 0 && pending === 0) {
      this.partialRow.status = 'Rejected';
      this.partialRow.isPartial = false;
      this.partialRow.partialText = undefined;
    }

    // Collect day rejection reasons if any
    const reasons = this.partialDaysList
      .filter((d) => d.status === 'rejected' && d.reason)
      .map((d) => `${d.dow} ${d.dateStr}: ${d.reason}`);

    if (this.partialNote.trim()) {
      reasons.push(`Review Note: ${this.partialNote.trim()}`);
    }

    if (reasons.length) {
      this.partialRow.rejectionReason = reasons.join(' | ');
    }

    this.applyFilters();
    this.triggerToast(`Review submitted for ${this.partialRow.name}.`);
    this.closePartialApproveModal();
  }

  // -------------------------------------------------------------
  // View Reason Modal
  // -------------------------------------------------------------
  openViewReasonModal(row: LeaveRequestRow): void {
    this.viewReasonEmployee = row.name;
    this.viewReasonText = row.rejectionReason || 'No rejection reason specified.';
    this.viewReasonModalOpen = true;
  }

  closeViewReasonModal(): void {
    this.viewReasonModalOpen = false;
    this.viewReasonEmployee = '';
    this.viewReasonText = '';
  }

  // -------------------------------------------------------------
  // Apply Leave Modal
  // -------------------------------------------------------------
  openApplyLeaveModal(): void {
    this.applyLeaveType = 'Casual Leave';
    this.applyFromDate = '';
    this.applyToDate = '';
    this.applyDayType = 'Full Day';
    this.applyReason = '';
    this.applyTotalDays = '1 Day(s)';
    this.availableBalance = 5;
    this.currentlyBooked = 1;
    this.balanceAfterBooking = 4;
    this.estimatedBalance = 4;
    this.applyModalOpen = true;
  }

  closeApplyLeaveModal(): void {
    this.applyModalOpen = false;
  }

  onApplyDateChange(): void {
    if (this.applyFromDate && this.applyToDate) {
      const d1 = new Date(this.applyFromDate);
      const d2 = new Date(this.applyToDate);
      if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const total = this.applyDayType === 'Full Day' ? diffDays : diffDays * 0.5;
        this.applyTotalDays = `${total} Day(s)`;
        this.balanceAfterBooking = Math.max(0, this.availableBalance - total);
        return;
      }
    }
    this.applyTotalDays = this.applyDayType === 'Full Day' ? '1 Day(s)' : '0.5 Day(s)';
  }

  submitApplyLeave(): void {
    if (!this.applyLeaveType) {
      this.triggerToast('Please select a leave type.');
      return;
    }

    const newId = `LR-${this.allLeaveRows.length + 1}`;
    const newFrom = this.applyFromDate || new Date().toISOString().slice(0, 10);
    const newTo = this.applyToDate || newFrom;
    const daysNum = parseFloat(this.applyTotalDays) || 1;

    const newRow: LeaveRequestRow = {
      id: newId,
      sno: this.allLeaveRows.length + 1,
      empId: `EMP${String(this.allLeaveRows.length + 1).padStart(4, '0')}`,
      name: 'Current User',
      employee: 'Current User',
      avatar: './assets/img/profile-1.jpg',
      leaveType: this.applyLeaveType,
      typeKey: this.getTypeKey(this.applyLeaveType),
      from: this.formatDisplayDate(newFrom),
      rawFrom: newFrom,
      to: this.formatDisplayDate(newTo),
      rawTo: newTo,
      days: daysNum,
      reason: this.applyReason || 'Personal Leave',
      status: 'Pending',
      balance: this.balanceAfterBooking,
      quota: 20,
    };

    this.allLeaveRows.unshift(newRow);
    this.applyFilters();
    this.closeApplyLeaveModal();
    this.triggerToast('Leave application submitted successfully.');
  }

  private getTypeKey(type: string): string {
    const lower = type.toLowerCase();
    if (lower.includes('sick')) return 'sick';
    if (lower.includes('earn')) return 'earned';
    if (lower.includes('home') || lower.includes('wfh')) return 'wfh';
    return 'casual';
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
