import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Breadcrumb } from '../../../../shared/breadcrumb/breadcrumb';

export interface LeaveBalance {
  type: string;
  available: number;
  booked: number;
  icon: string;
  iconClass: string;
}

export interface LeaveEmployee {
  name: string;
  empId: string;
  department: string;
  avatar: string;
}

export interface LeaveItem {
  id: string;
  from: string;
  to: string;
  type: string;
  typeClass: string;
  days: number | string;
  status: 'Pending' | 'Approved' | 'Partial' | 'Rejected' | 'Assigned';
  statusClass: string;
  statusIcon: string;
  approvedDays?: string | number;
  employee?: string;
  rejectionReason?: string;
  year?: string;
  isAssignment?: boolean;
}

export interface HolidayItem {
  id: string;
  date: string;
  name: string;
  type?: string;
  year?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-leave-hoilday-report',
  standalone: true,
  imports: [CommonModule, FormsModule,  SelectModule],
  templateUrl: './leave-hoilday-report.html',
  styleUrl: './leave-hoilday-report.scss',
})
export class LeaveHoildayReport implements OnInit {
  // Navigation & Date
  currentYear: number = 2026;
  get currentYearRange(): string {
    return `01-Jan-${this.currentYear} to 31-Dec-${this.currentYear}`;
  }

  // Filter & Tabs
  selectedCategory: 'all' | 'leaves' | 'holidays' = 'all';
  activeTab: 'upcoming' | 'history' = 'upcoming';

  // Category Options for p-select
  readonly categoryOptions: SelectOption[] = [
    { label: 'Upcoming Leaves & Holidays', value: 'all' },
    { label: 'Upcoming Leaves', value: 'leaves' },
    { label: 'Upcoming Holidays', value: 'holidays' }
  ];

  // Employees demo data
  leaveEmployees: LeaveEmployee[] = [
    { name: 'Amelia Curr', empId: 'EMP0001', department: 'Design', avatar: 'assets/img/profile-1.jpg' },
    { name: 'Daniel Martinez', empId: 'EMP0002', department: 'Design', avatar: 'assets/img/profile-2.jpg' },
    { name: 'David Anderson', empId: 'EMP0003', department: 'iOS Dev', avatar: 'assets/img/profile-3.jpg' },
    { name: 'Emily Clark', empId: 'EMP0004', department: 'Business', avatar: 'assets/img/profile-4.jpg' },
    { name: 'Sophia Johnson', empId: 'EMP0005', department: 'Marketing', avatar: 'assets/img/profile-1.jpg' },
  ];

  get employeeOptions(): SelectOption[] {
    return this.leaveEmployees.map(emp => ({
      label: `${emp.name} — ${emp.empId} (${emp.department})`,
      value: emp.empId
    }));
  }

  get reportingManagerOptions(): SelectOption[] {
    return this.leaveEmployees.map(emp => ({
      label: `${emp.name} (${emp.empId})`,
      value: emp.empId
    }));
  }

  // Leave Balances Cards
  leaveBalances: LeaveBalance[] = [
    { type: 'Annual leave', available: 10, booked: 0, icon: 'bi bi-calendar3', iconClass: 'icon-blue' },
    { type: 'Bereavement leave', available: 1, booked: 0, icon: 'bi bi-bag-plus', iconClass: 'icon-blue' },
    { type: 'Casual Leave', available: 12, booked: 2, icon: 'bi bi-calendar-x-fill', iconClass: 'icon-amber' },
    { type: 'Compensatory off', available: 0, booked: 0, icon: 'bi bi-calendar2-check', iconClass: 'icon-green' },
    { type: 'PTO', available: 2, booked: 0, icon: 'bi bi-briefcase-fill', iconClass: 'icon-blue' },
    { type: 'Sick Leave', available: 12, booked: 0, icon: 'bi bi-calendar-heart-fill', iconClass: 'icon-violet' },
  ];

  // Leave Types options for p-select
  readonly leaveTypeOptions: SelectOption[] = [
    { label: 'Annual leave', value: 'Annual leave' },
    { label: 'Bereavement leave', value: 'Bereavement leave' },
    { label: 'Casual Leave', value: 'Casual Leave' },
    { label: 'Compensatory off', value: 'Compensatory off' },
    { label: 'PTO', value: 'PTO' },
    { label: 'Sick Leave', value: 'Sick Leave' },
    { label: 'Earned Leave', value: 'Earned Leave' }
  ];

  // Day type options
  readonly dayTypeOptions: SelectOption[] = [
    { label: 'Full Day', value: 'Full Day' },
    { label: 'First Half', value: 'First Half' },
    { label: 'Second Half', value: 'Second Half' }
  ];

  // Year options
  readonly yearOptions: SelectOption[] = [
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' },
    { label: '2026', value: '2026' },
    { label: '2027', value: '2027' },
    { label: '2028', value: '2028' }
  ];

  // Holiday type options
  readonly holidayTypeOptions: SelectOption[] = [
    { label: 'Public Holiday', value: 'Public Holiday' },
    { label: 'Optional Holiday', value: 'Optional Holiday' },
    { label: 'Restricted Holiday', value: 'Restricted Holiday' },
    { label: 'Company Holiday', value: 'Company Holiday' }
  ];

  // Approver options
  readonly approverOptions: SelectOption[] = [
    { label: 'Manager', value: 'Manager' },
    { label: 'Team Lead', value: 'Team Lead' },
    { label: 'HR', value: 'HR' }
  ];

  // Upcoming Leaves
  leaveItems: LeaveItem[] = [
    {
      id: 'L1',
      from: '01 Feb, Mon',
      to: '02 Feb, Tue',
      type: 'Casual Leave',
      typeClass: 'type-casual',
      days: 2,
      status: 'Pending',
      statusClass: 'status-pending',
      statusIcon: 'bi-hourglass-split'
    },
    {
      id: 'L2',
      from: '10 Aug, Wed',
      to: '12 Aug, Fri',
      type: 'Annual Leave',
      typeClass: 'type-annual',
      days: 3,
      status: 'Partial',
      statusClass: 'status-approved',
      approvedDays: 2,
      employee: 'Daniel Martinez',
      statusIcon: 'bi-check2-circle'
    },
    {
      id: 'L3',
      from: '05 Sep, Mon',
      to: '06 Sep, Tue',
      type: 'Sick Leave',
      typeClass: 'type-sick',
      days: 2,
      status: 'Rejected',
      statusClass: 'status-rejected',
      rejectionReason: 'Insufficient leave balance for remaining days',
      employee: 'Sophia Johnson',
      statusIcon: 'bi-x-circle-fill'
    }
  ];

  // History Leaves
  historyLeaveItems: LeaveItem[] = [
    {
      id: 'H1',
      from: '15 Dec, Tue',
      to: '17 Dec, Thu',
      type: 'Annual Leave',
      typeClass: 'type-annual',
      days: 3,
      status: 'Approved',
      statusClass: 'status-approved',
      statusIcon: 'bi-check-circle-fill'
    },
    {
      id: 'H2',
      from: '10 Nov, Wed',
      to: '11 Nov, Thu',
      type: 'Sick Leave',
      typeClass: 'type-sick',
      days: 2,
      status: 'Approved',
      statusClass: 'status-approved',
      statusIcon: 'bi-check-circle-fill'
    }
  ];

  // Assigned leaves dynamically added
  assignmentItems: LeaveItem[] = [];

  // Holidays List
  holidayItems: HolidayItem[] = [
    { id: 'HOL1', date: '02 Apr, Fri', name: 'Good Friday', type: 'Public Holiday', year: '2026' },
    { id: 'HOL2', date: '01 May, Sat', name: 'May Day', type: 'Public Holiday', year: '2026' },
    { id: 'HOL3', date: '25 Dec, Sat', name: 'Christmas', type: 'Public Holiday', year: '2026' }
  ];

  // Modals & Offcanvas State
  showApplyLeaveModal: boolean = false;
  showPermissionModal: boolean = false;
  showAssignLeaveOffcanvas: boolean = false;
  showHolidayOffcanvas: boolean = false;
  showRejectionModal: boolean = false;

  // Rejection Reason Details
  selectedRejection: { employee: string; reason: string } = { employee: '', reason: '' };

  // Apply Leave Form
  applyForm = {
    leaveType: '',
    reportingManager: '',
    fromDate: '',
    toDate: '',
    dayType: 'Full Day' as 'Full Day' | 'First Half' | 'Second Half',
    reason: '',
  };

  // Assign Leave Form
  assignForm = {
    isBulk: false,
    employeeId: '',
    leaveType: '',
    days: 1,
    year: '2026',
    note: '',
    bulkFile: null as File | null,
    bulkFileName: '',
    bulkFileSize: ''
  };

  // Add Holiday Form
  holidayForm = {
    isBulk: false,
    name: '',
    date: '',
    type: 'Public Holiday',
    year: '2026',
    bulkFile: null as File | null,
    bulkFileName: '',
    bulkFileSize: ''
  };

  // Permission Form
  permissionForm = {
    date: '',
    fromTime: '',
    toTime: '',
    approver: '',
    reason: '',
    isSubmitted: false,
    resultSummary: '',
    durationMinutes: 0
  };

  // Toast
  isToastVisible: boolean = false;
  toastMessage: string = '';
  private toastTimer: any = null;

  ngOnInit(): void {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.applyForm.fromDate = `${yyyy}-${mm}-${dd}`;
    this.applyForm.toDate = `${yyyy}-${mm}-${dd}`;
    this.permissionForm.date = `${yyyy}-${mm}-${dd}`;
  }

  // Year Navigation
  prevYear(): void {
    this.currentYear--;
  }

  nextYear(): void {
    this.currentYear++;
  }

  // Counts
  get upcomingCount(): number {
    return this.assignmentItems.length + this.leaveItems.length + this.holidayItems.length;
  }

  get historyCount(): number {
    return this.historyLeaveItems.length;
  }

  // Type color helper
  typeClassFor(t: string): string {
    const s = (t || '').toLowerCase();
    if (s.includes('sick')) return 'type-sick';
    if (s.includes('annual')) return 'type-annual';
    if (s === 'pto') return 'type-pto';
    return 'type-casual';
  }

  // Filtering visible lists
  get showAssignments(): boolean {
    return this.activeTab === 'upcoming' && this.selectedCategory !== 'holidays';
  }

  get showLeaves(): boolean {
    return this.selectedCategory !== 'holidays';
  }

  get showHolidays(): boolean {
    return this.activeTab === 'upcoming' && this.selectedCategory !== 'leaves';
  }

  get currentLeaveItems(): LeaveItem[] {
    if (this.selectedCategory === 'holidays') return [];
    return this.activeTab === 'history' ? this.historyLeaveItems : this.leaveItems;
  }

  get currentHolidayItems(): HolidayItem[] {
    if (this.activeTab === 'history' || this.selectedCategory === 'leaves') return [];
    return this.holidayItems;
  }

  get isCurrentListEmpty(): boolean {
    if (this.activeTab === 'upcoming') {
      const hasAssignments = this.showAssignments && this.assignmentItems.length > 0;
      const hasLeaves = this.showLeaves && this.leaveItems.length > 0;
      const hasHolidays = this.showHolidays && this.holidayItems.length > 0;
      return !hasAssignments && !hasLeaves && !hasHolidays;
    } else {
      return this.currentLeaveItems.length === 0;
    }
  }

  // Apply Leave Calculations
  get calculatedLeaveDays(): number {
    if (!this.applyForm.fromDate) return 0;
    const from = new Date(this.applyForm.fromDate);
    const to = this.applyForm.toDate ? new Date(this.applyForm.toDate) : from;
    if (isNaN(from.getTime()) || isNaN(to.getTime())) return 0;

    const diffMs = to.getTime() - from.getTime();
    let days = Math.round(diffMs / 86400000) + 1;
    if (days < 1) days = 1;

    if (this.applyForm.dayType !== 'Full Day') {
      days = days > 1 ? days - 0.5 : 0.5;
    }
    return days;
  }

  get applyDateSummary(): string {
    if (!this.applyForm.fromDate) return 'Select a date';
    const from = new Date(this.applyForm.fromDate);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const fromStr = `${weekdays[from.getDay()]} ${String(from.getDate()).padStart(2, '0')}-${months[from.getMonth()]}-${from.getFullYear()}`;
    if (!this.applyForm.toDate || this.applyForm.toDate === this.applyForm.fromDate) {
      return fromStr;
    }
    const to = new Date(this.applyForm.toDate);
    const toStr = `${weekdays[to.getDay()]} ${String(to.getDate()).padStart(2, '0')}-${months[to.getMonth()]}-${to.getFullYear()}`;
    return `${fromStr}  –  ${toStr}`;
  }

  get currentAvailableForApply(): number {
    if (!this.applyForm.leaveType) return 0;
    const card = this.leaveBalances.find(b => b.type.toLowerCase() === this.applyForm.leaveType.toLowerCase());
    return card ? card.available : 10;
  }

  get balanceAfterBooking(): number {
    return Math.max(this.currentAvailableForApply - this.calculatedLeaveDays, 0);
  }

  get asOfTodayFormatted(): string {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${dd}-${months[d.getMonth()]}-${d.getFullYear()}`;
  }

  // Card click -> Open Apply Leave modal
  openApplyLeaveModal(presetType?: string): void {
    if (presetType) {
      this.applyForm.leaveType = presetType;
    } else if (!this.applyForm.leaveType && this.leaveBalances.length > 0) {
      this.applyForm.leaveType = this.leaveBalances[0].type;
    }
    if (!this.applyForm.reportingManager && this.leaveEmployees.length > 0) {
      this.applyForm.reportingManager = this.leaveEmployees[0].empId;
    }
    this.showApplyLeaveModal = true;
  }

  closeApplyLeaveModal(): void {
    this.showApplyLeaveModal = false;
  }

  submitApplyLeave(): void {
    if (!this.applyForm.leaveType) {
      this.showToast('Please select a leave type');
      return;
    }
    if (!this.applyForm.fromDate) {
      this.showToast('Please select start date');
      return;
    }

    const days = this.calculatedLeaveDays;
    const fromD = new Date(this.applyForm.fromDate);
    const toD = new Date(this.applyForm.toDate || this.applyForm.fromDate);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const fromFormatted = `${String(fromD.getDate()).padStart(2, '0')} ${months[fromD.getMonth()]}, ${weekdays[fromD.getDay()]}`;
    const toFormatted = `${String(toD.getDate()).padStart(2, '0')} ${months[toD.getMonth()]}, ${weekdays[toD.getDay()]}`;

    const newLeave: LeaveItem = {
      id: 'L_' + Date.now(),
      from: fromFormatted,
      to: toFormatted,
      type: this.applyForm.leaveType,
      typeClass: this.typeClassFor(this.applyForm.leaveType),
      days: days,
      status: 'Pending',
      statusClass: 'status-pending',
      statusIcon: 'bi-hourglass-split'
    };

    this.leaveItems.unshift(newLeave);

    // Update matching balance
    const match = this.leaveBalances.find(b => b.type.toLowerCase() === this.applyForm.leaveType.toLowerCase());
    if (match) {
      match.booked += days;
    }

    this.showApplyLeaveModal = false;
    this.activeTab = 'upcoming';
    this.showToast(`Leave request for ${days} Day(s) submitted successfully!`);
  }

  // Assign Leave Offcanvas
  openAssignLeave(): void {
    if (!this.assignForm.employeeId && this.leaveEmployees.length > 0) {
      this.assignForm.employeeId = this.leaveEmployees[0].empId;
    }
    if (!this.assignForm.leaveType && this.leaveTypeOptions.length > 0) {
      this.assignForm.leaveType = this.leaveTypeOptions[0].value;
    }
    this.showAssignLeaveOffcanvas = true;
  }

  closeAssignLeave(): void {
    this.showAssignLeaveOffcanvas = false;
    this.assignForm.days = 1;
    this.assignForm.note = '';
    this.assignForm.bulkFile = null;
    this.assignForm.bulkFileName = '';
    this.assignForm.isBulk = false;
  }

  get selectedAssignEmployee(): LeaveEmployee | undefined {
    return this.leaveEmployees.find(e => e.empId === this.assignForm.employeeId);
  }

  get currentBalanceForAssign(): number {
    if (!this.assignForm.leaveType) return 0;
    const card = this.leaveBalances.find(b => b.type.toLowerCase() === this.assignForm.leaveType.toLowerCase());
    return card ? card.available : 0;
  }

  get totalBalanceAfterAssign(): number {
    return this.currentBalanceForAssign + (this.assignForm.days || 0);
  }

  incrementAssignDays(amount: number): void {
    this.assignForm.days = Math.max(1, (this.assignForm.days || 0) + amount);
  }

  decrementAssignDays(): void {
    this.assignForm.days = Math.max(1, (this.assignForm.days || 1) - 1);
  }

  onAssignFileSelect(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.handleAssignFile(file);
    }
  }

  handleAssignFile(file: File): void {
    const validExts = ['.xlsx', '.xls', '.csv'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExts.includes(ext)) {
      this.showToast('Please upload a valid Excel or CSV file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('File size must be under 5MB.');
      return;
    }
    this.assignForm.bulkFile = file;
    this.assignForm.bulkFileName = file.name;
    this.assignForm.bulkFileSize = this.formatBytes(file.size);
  }

  removeAssignFile(): void {
    this.assignForm.bulkFile = null;
    this.assignForm.bulkFileName = '';
    this.assignForm.bulkFileSize = '';
  }

  downloadAssignSample(): void {
    let csv = 'Employee ID,Employee Name,Leave Type,Days,Leave Year,Note\n';
    csv += 'EMP0001,Amelia Curr,Casual Leave,12,2026,Annual quota\n';
    csv += 'EMP0002,Daniel Martinez,Sick Leave,12,2026,Annual quota\n';
    csv += 'EMP0003,David Anderson,Annual leave,10,2026,Carry forward\n';
    csv += 'EMP0004,Emily Clark,PTO,5,2026,Project buffer\n';
    this.downloadCsvFile(csv, 'assign_leave_sample.csv');
  }

  submitAssignLeave(): void {
    if (this.assignForm.isBulk) {
      if (!this.assignForm.bulkFile) {
        this.showToast('Please choose an Excel file to upload.');
        return;
      }
      this.showToast(`Bulk leave file "${this.assignForm.bulkFileName}" uploaded and processed successfully!`);
      this.closeAssignLeave();
      return;
    }

    if (!this.assignForm.employeeId) {
      this.showToast('Please select an employee.');
      return;
    }
    if (!this.assignForm.leaveType) {
      this.showToast('Please select a leave type.');
      return;
    }
    if (!this.assignForm.days || this.assignForm.days < 1) {
      this.showToast('Days to assign must be at least 1.');
      return;
    }

    const emp = this.selectedAssignEmployee;
    const empName = emp ? emp.name : 'Employee';

    // Add assignment row
    this.assignmentItems.unshift({
      id: 'A_' + Date.now(),
      from: this.assignForm.year || '2026',
      to: 'Leave cycle',
      type: this.assignForm.leaveType,
      typeClass: this.typeClassFor(this.assignForm.leaveType),
      days: this.assignForm.days,
      employee: empName,
      status: 'Assigned',
      statusClass: 'status-approved',
      statusIcon: 'bi-person-check-fill',
      year: this.assignForm.year || '2026',
      isAssignment: true
    });

    // Bump matching balance card
    const match = this.leaveBalances.find(b => b.type.toLowerCase() === this.assignForm.leaveType.toLowerCase());
    if (match) {
      match.available += this.assignForm.days;
    }

    this.activeTab = 'upcoming';
    this.showToast(`Assigned ${this.assignForm.days} Day(s) of ${this.assignForm.leaveType} to ${empName}`);
    this.closeAssignLeave();
  }

  // Add Holiday Offcanvas
  openAddHoliday(): void {
    this.showHolidayOffcanvas = true;
  }

  closeAddHoliday(): void {
    this.showHolidayOffcanvas = false;
    this.holidayForm.name = '';
    this.holidayForm.date = '';
    this.holidayForm.bulkFile = null;
    this.holidayForm.bulkFileName = '';
    this.holidayForm.isBulk = false;
  }

  onHolidayFileSelect(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.handleHolidayFile(file);
    }
  }

  handleHolidayFile(file: File): void {
    const validExts = ['.xlsx', '.xls', '.csv'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExts.includes(ext)) {
      this.showToast('Please upload a valid Excel or CSV file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('File size must be under 5MB.');
      return;
    }
    this.holidayForm.bulkFile = file;
    this.holidayForm.bulkFileName = file.name;
    this.holidayForm.bulkFileSize = this.formatBytes(file.size);
  }

  removeHolidayFile(): void {
    this.holidayForm.bulkFile = null;
    this.holidayForm.bulkFileName = '';
    this.holidayForm.bulkFileSize = '';
  }

  downloadHolidaySample(): void {
    let csv = 'Holiday Name,Date,Holiday Type,Holiday Year\n';
    csv += 'Republic Day,26-01-2026,Public Holiday,2026\n';
    csv += 'Maha Shivaratri,18-03-2026,Public Holiday,2026\n';
    csv += 'Ugadi,28-03-2026,Public Holiday,2026\n';
    csv += 'Good Friday,02-04-2026,Public Holiday,2026\n';
    csv += 'May Day,01-05-2026,Public Holiday,2026\n';
    csv += 'Independence Day,15-08-2026,Public Holiday,2026\n';
    csv += 'Christmas,25-12-2026,Public Holiday,2026\n';
    this.downloadCsvFile(csv, 'holiday_sample_upload.csv');
  }

  submitAddHoliday(): void {
    if (this.holidayForm.isBulk) {
      if (!this.holidayForm.bulkFile) {
        this.showToast('Please choose an Excel file to upload.');
        return;
      }
      this.showToast(`Bulk holiday file "${this.holidayForm.bulkFileName}" uploaded successfully!`);
      this.closeAddHoliday();
      return;
    }

    if (!this.holidayForm.name.trim()) {
      this.showToast('Please enter holiday name.');
      return;
    }
    if (!this.holidayForm.date) {
      this.showToast('Please select holiday date.');
      return;
    }

    const d = new Date(this.holidayForm.date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const formattedDate = `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]}, ${weekdays[d.getDay()]}`;

    this.holidayItems.push({
      id: 'HOL_' + Date.now(),
      name: this.holidayForm.name,
      date: formattedDate,
      type: this.holidayForm.type,
      year: this.holidayForm.year
    });

    this.activeTab = 'upcoming';
    this.showToast(`Holiday "${this.holidayForm.name}" added successfully!`);
    this.closeAddHoliday();
  }

  // Permission Modal
  openPermissionModal(): void {
    this.permissionForm.isSubmitted = false;
    this.permissionForm.fromTime = '';
    this.permissionForm.toTime = '';
    this.permissionForm.approver = '';
    this.permissionForm.reason = '';
    this.showPermissionModal = true;
  }

  closePermissionModal(): void {
    this.showPermissionModal = false;
  }

  get permissionDurationText(): string {
    if (!this.permissionForm.fromTime || !this.permissionForm.toTime) return '--';
    const fromM = this.timeToMinutes(this.permissionForm.fromTime);
    const toM = this.timeToMinutes(this.permissionForm.toTime);
    if (fromM === null || toM === null) return '--';
    const diff = toM - fromM;
    if (diff <= 0) return 'Invalid range';
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    const parts = [];
    if (h) parts.push(`${h}h`);
    if (m || !h) parts.push(`${m}m`);
    return parts.join(' ');
  }

  get isPermissionDurationValid(): boolean {
    if (!this.permissionForm.fromTime || !this.permissionForm.toTime) return true;
    const fromM = this.timeToMinutes(this.permissionForm.fromTime);
    const toM = this.timeToMinutes(this.permissionForm.toTime);
    if (fromM === null || toM === null) return true;
    const diff = toM - fromM;
    return diff > 0 && diff <= 120;
  }

  submitPermission(): void {
    if (!this.permissionForm.date || !this.permissionForm.fromTime || !this.permissionForm.toTime || !this.permissionForm.approver || !this.permissionForm.reason.trim()) {
      this.showToast('Please fill all required fields before submitting.');
      return;
    }
    const fromM = this.timeToMinutes(this.permissionForm.fromTime)!;
    const toM = this.timeToMinutes(this.permissionForm.toTime)!;
    const diff = toM - fromM;
    if (diff <= 0) {
      this.showToast('To time must be after From time.');
      return;
    }
    if (diff > 120) {
      this.showToast('Permission time cannot exceed 2 hours.');
      return;
    }

    this.permissionForm.durationMinutes = diff;
    this.permissionForm.resultSummary = `Sent to ${this.permissionForm.approver} for approval (${this.permissionDurationText}).`;
    this.permissionForm.isSubmitted = true;
  }

  // Rejection Reason Modal
  openRejectionModal(item: LeaveItem): void {
    this.selectedRejection = {
      employee: item.employee || 'Employee',
      reason: item.rejectionReason || 'No rejection reason specified.'
    };
    this.showRejectionModal = true;
  }

  closeRejectionModal(): void {
    this.showRejectionModal = false;
  }

  // Toast Helper
  showToast(message: string): void {
    this.toastMessage = message;
    this.isToastVisible = true;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.isToastVisible = false;
    }, 3200);
  }

  // Helpers
  private timeToMinutes(str: string): number | null {
    if (!str) return null;
    const match = str.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    if (h > 23 || m > 59) return null;
    return h * 60 + m;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private downloadCsvFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
