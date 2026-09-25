import { Component, OnInit, HostListener } from '@angular/core';
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
import { Calendar, TeamMember } from '../../../../shared/calendar/calendar';

export interface AttendanceRecord {
  id: number;
  sno?: number;
  empId: string;
  name: string;
  avatar: string;
  department: string;
  date: string;
  dateKey: string;
  monthKey: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  hoursExpected: number;
  workingHoursFormatted: string;
  workPercent: number;
  overtimeHours?: string;
  statusLabel: string;
  statusKey: 'present' | 'absent' | 'late' | 'half' | 'leave';
  shift: string;
  office: string;
  selected?: boolean;
}

export interface AttendanceEmployee {
  empId: string;
  name: string;
  dept: string;
  avatar: string;
  seed: number;
}

export interface PunchItem {
  key: string;
  label: string;
  icon: string;
  color: string;
  meta: string;
  time: string;
  gapBadge?: { text: string; isLong?: boolean };
}

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-attendance-report',
  standalone: true,
  imports: [CommonModule, FormsModule, Breadcrumb, SelectModule, PrimeDataTable, Calendar],
  templateUrl: './attendance-report.html',
  styleUrl: './attendance-report.scss',
})
export class AttendanceReport implements OnInit {
  // Master Employee Registry
  readonly employees: AttendanceEmployee[] = [
    { empId: 'EMP0001', name: 'Amelia Curr', dept: 'Design', avatar: './assets/img/profile-1.jpg', seed: 3 },
    { empId: 'EMP0002', name: 'Daniel Martinez', dept: 'Design', avatar: './assets/img/profile-2.jpg', seed: 7 },
    { empId: 'EMP0003', name: 'David Anderson', dept: 'iOS Dev', avatar: './assets/img/profile-3.jpg', seed: 11 },
    { empId: 'EMP0004', name: 'Emily Clark', dept: 'Business', avatar: './assets/img/profile-4.jpg', seed: 17 },
    { empId: 'EMP0005', name: 'Sophia Johnson', dept: 'Marketing', avatar: './assets/img/profile-1.jpg', seed: 23 },
  ];

  // PrimeDataTable Configuration
  modalHeader: PrimeTableHeader = {
    title: 'Attendance Report',
    icon: 'bi bi-clock-history',
    count: 0,
    subtitle: 'Daily & monthly employee attendance logs',
  };

  tableActions: PrimeTableActions = {
    add: false,
    edit: false,
    delete: false,
  };

  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', type: 'sno', width: '60px' },
    { field: 'empId', header: 'Employee ID', type: 'text', width: '130px' },
    { field: 'name', header: 'Employee', type: 'avatar', imageField: 'avatar', subField: 'empId', width: '200px' },
    { field: 'department', header: 'Department', type: 'text', width: '140px' },
    { field: 'date', header: 'Date', type: 'text', width: '125px' },
    { field: 'checkIn', header: 'Check-in', type: 'text', width: '110px' },
    { field: 'checkOut', header: 'Check-out', type: 'text', width: '110px' },
    { field: 'hoursWorked', header: 'Working Hours', type: 'custom', width: '150px' },
    { field: 'statusLabel', header: 'Status', type: 'custom', width: '130px' },
    { field: 'actions', header: 'Actions', type: 'custom', width: '160px' },
  ];

  // Filter Dropdown Options (PrimeNG p-select)
  departmentOptions: SelectOption[] = [
    { label: 'All Departments', value: 'all' },
    { label: 'Design', value: 'Design' },
    { label: 'iOS Dev', value: 'iOS Dev' },
    { label: 'Business', value: 'Business' },
    { label: 'Marketing', value: 'Marketing' },
  ];

  statusOptions: SelectOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Present', value: 'present' },
    { label: 'Absent', value: 'absent' },
    { label: 'Late', value: 'late' },
    { label: 'Half Day', value: 'half' },
    { label: 'On Leave', value: 'leave' },
  ];

  shiftOptions: SelectOption[] = [
    { label: 'All Shifts', value: 'all' },
    { label: 'Morning', value: 'Morning' },
    { label: 'General', value: 'General' },
    { label: 'Night', value: 'Night' },
  ];

  officeOptions: SelectOption[] = [
    { label: 'All Offices', value: 'all' },
    { label: 'Zenith Technologies', value: 'Zenith Technologies' },
    { label: 'Core Technologies', value: 'Core Technologies' },
    { label: 'Skylogic Solutions', value: 'Skylogic Solutions' },
    { label: 'Micronest Technologies', value: 'Micronest Technologies' },
  ];

  // Filter Models
  filtersExpanded: boolean = false;
  searchFilter: string = '';
  selectedDepartment: string = 'all';
  selectedStatus: string = 'all';
  selectedShift: string = 'all';
  selectedOffice: string = 'all';
  selectedDateRange: string = '';
  activeKpiStatus: string = 'late'; // Default to 'late' as shown in the user's screenshot!

  // Overtime KPI Card State
  overtimeHoursTotal: string = '36.5';
  overtimeEmployeesCount: number = 3;

  // Table Toolbar State (Columns, Export, Date Navigation)
  selectedDateNav: string = '01-01-2026';
  currentNavDate: Date = new Date(2026, 0, 1);
  exportDropdownOpen: boolean = false;
  allSelected: boolean = false;
  activeActionRowId: number | null = 2; // Row 2 action dropdown open as shown in user's screenshot!

  // Active Filter Chips
  activeFilterChips: { key: string; label: string; displayValue: string }[] = [];

  // Datasets
  allRecords: AttendanceRecord[] = [];
  filteredRecords: AttendanceRecord[] = [];

  // Calendar Options & Data mapped from employees
  get calendarEmployees(): TeamMember[] {
    return this.employees.map((e) => ({
      id: e.empId,
      name: e.name,
      team: e.dept,
      seed: e.seed,
      avatar: e.avatar,
    }));
  }

  readonly calendarTeamOptions = [
    { label: 'All Departments', value: '' },
    { label: 'Design', value: 'Design' },
    { label: 'iOS Dev', value: 'iOS Dev' },
    { label: 'Business', value: 'Business' },
    { label: 'Marketing', value: 'Marketing' },
  ];

  // -------------------------------------------------------------
  // Monthly Calendar Modal State
  // -------------------------------------------------------------
  calendarModalOpen: boolean = false;
  selectedCalendarEmpId: string = 'EMP0003';
  selectedEmpForCalendar: AttendanceEmployee = this.employees[2]; // EMP0003 David Anderson
  calCurrentYear: number = 2026;
  calCurrentMonth: number = 0; // January

  // -------------------------------------------------------------
  // Punch Timeline Modal State
  // -------------------------------------------------------------
  timelineModalOpen: boolean = false;
  selectedRecordForTimeline: AttendanceRecord | null = null;
  timelinePunches: PunchItem[] = [];
  timelineTotalHours: string = '0h';
  timelineBreakTime: string = '0m';
  timelineLunchTime: string = '0m';
  timelineStatusText: string = '—';

  // -------------------------------------------------------------
  // Mark Attendance (2-Step Admin Check-in) Modal State
  // -------------------------------------------------------------
  markModalOpen: boolean = false;
  markCurrentStep: number = 1;
  markSelectedEmpId: string = '';
  markDate: string = '';
  markShift: string = 'General';
  markStatus: 'present' | 'late' | 'half' = 'present';
  markCheckInTime: string = '09:00';
  markCheckOutTime: string = '18:00';
  markNotes: string = '';

  // Toast State
  showToast: boolean = false;
  toastMessage: string = '';
  private toastTimer: any;

  ngOnInit(): void {
    this.generateDummyData();
    this.applyAllFilters();
  }

  // -------------------------------------------------------------
  // Dummy Data Generation (Matching PHP logic)
  // -------------------------------------------------------------
  private generateDummyData(): void {
    const list: AttendanceRecord[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const statusKeys: ('present' | 'present' | 'late' | 'absent' | 'leave')[] = [
      'present',
      'present',
      'late',
      'absent',
      'leave',
    ];
    const statusLabels = ['Present', 'Present', 'Late', 'Absent', 'On Leave'];
    const offices = ['Zenith Technologies', 'Core Technologies', 'Skylogic Solutions', 'Micronest Technologies'];
    const shifts = ['General', 'Morning', 'Night'];

    let idCounter = 1;

    // Generate across 6 months for each employee
    for (let m = 1; m <= 6; m++) {
      const monthIdx = m - 1;
      const monthStr = months[monthIdx];
      const day = m === 8 ? 27 : 26;
      const dateStr = `${day} ${monthStr} 2026`;
      const dateKey = `2026-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const monthKey = `2026-${String(m).padStart(2, '0')}`;

      this.employees.forEach((emp, empIdx) => {
        const sKey = statusKeys[empIdx];
        const sLabel = statusLabels[empIdx];
        const checkIn = sKey === 'late' ? '09:41 AM' : sKey === 'absent' || sKey === 'leave' ? '—' : '09:02 AM';
        const checkOut = sKey === 'absent' || sKey === 'leave' ? '—' : '06:05 PM';
        const hoursWorked = sKey === 'absent' || sKey === 'leave' ? 0 : sKey === 'late' ? 7.8 : 8.7;
        const hoursExpected = 9;
        const workPercent = hoursExpected > 0 ? Math.round((hoursWorked / hoursExpected) * 100) : 0;

        let overtimeHours: string | undefined = undefined;
        if (emp.empId === 'EMP0003') {
          if (m === 1) overtimeHours = '1.5';
          else if (m === 2) overtimeHours = ''; // Shows (Pending Approval) in screenshot
          else if (m === 3) overtimeHours = '2.0';
        } else if (empIdx % 2 === 0 && (sKey === 'present' || sKey === 'late')) {
          overtimeHours = (1 + empIdx * 0.5).toFixed(1);
        }

        list.push({
          id: idCounter++,
          sno: 0,
          empId: emp.empId,
          name: emp.name,
          avatar: emp.avatar,
          department: emp.dept,
          date: dateStr,
          dateKey,
          monthKey,
          checkIn,
          checkOut,
          hoursWorked,
          hoursExpected,
          workingHoursFormatted: `${hoursWorked}h / ${hoursExpected}h`,
          workPercent,
          overtimeHours,
          statusLabel: sLabel,
          statusKey: sKey,
          shift: shifts[empIdx % shifts.length],
          office: offices[empIdx % offices.length],
          selected: false,
        });
      });
    }

    this.allRecords = list;
  }

  // -------------------------------------------------------------
  // KPI Metrics
  // -------------------------------------------------------------
  get totalEmployeesCount(): number {
    return this.employees.length;
  }

  get presentTodayCount(): number {
    return 2;
  }

  get lateArrivalsCount(): number {
    return 1;
  }

  get onLeaveCount(): number {
    return 1;
  }

  get absentTodayCount(): number {
    return 1;
  }

  get presentPercentage(): number {
    return 40;
  }

  get latePercentage(): number {
    return 20;
  }

  get absentPercentage(): number {
    return 20;
  }

  // -------------------------------------------------------------
  // Interactive KPI Cards Click
  // -------------------------------------------------------------
  toggleKpiFilter(status: string): void {
    if (this.activeKpiStatus === status && status !== 'all') {
      this.activeKpiStatus = 'all';
    } else {
      this.activeKpiStatus = status;
    }
    this.applyAllFilters();
  }

  // -------------------------------------------------------------
  // Filter Operations
  // -------------------------------------------------------------
  toggleFilters(): void {
    this.filtersExpanded = !this.filtersExpanded;
  }

  applyFilters(): void {
    this.applyAllFilters();
  }

  clearFilters(): void {
    this.searchFilter = '';
    this.selectedDepartment = 'all';
    this.selectedStatus = 'all';
    this.selectedShift = 'all';
    this.selectedOffice = 'all';
    this.selectedDateRange = '';
    this.activeKpiStatus = 'all';
    this.applyAllFilters();
  }

  removeFilterChip(key: string): void {
    if (key === 'search') this.searchFilter = '';
    if (key === 'dept') this.selectedDepartment = 'all';
    if (key === 'status') {
      this.selectedStatus = 'all';
      this.activeKpiStatus = 'all';
    }
    if (key === 'shift') this.selectedShift = 'all';
    if (key === 'office') this.selectedOffice = 'all';
    this.applyAllFilters();
  }

  applyAllFilters(): void {
    let list = [...this.allRecords];

    // KPI status filter (takes precedence or works together with status select)
    const effectiveStatus = this.activeKpiStatus || (this.selectedStatus !== 'all' ? this.selectedStatus : '');
    if (effectiveStatus && effectiveStatus !== 'all') {
      if (effectiveStatus === 'overtime') {
        list = list.filter((r) => r.overtimeHours !== undefined);
      } else {
        list = list.filter((r) => r.statusKey === effectiveStatus);
      }
    }

    // Search filter (Name or ID)
    if (this.searchFilter.trim()) {
      const q = this.searchFilter.trim().toLowerCase();
      list = list.filter(
        (r) => r.name.toLowerCase().includes(q) || r.empId.toLowerCase().includes(q)
      );
    }

    // Department filter
    if (this.selectedDepartment !== 'all') {
      list = list.filter((r) => r.department === this.selectedDepartment);
    }

    // Shift filter
    if (this.selectedShift !== 'all') {
      list = list.filter((r) => r.shift === this.selectedShift);
    }

    // Office filter
    if (this.selectedOffice !== 'all') {
      list = list.filter((r) => r.office === this.selectedOffice);
    }

    // Assign S.No
    this.filteredRecords = list.map((r, idx) => ({ ...r, sno: idx + 1 }));
    this.modalHeader.count = this.filteredRecords.length;
    this.checkSelectionState();
    this.rebuildActiveFilterChips();
  }

  private rebuildActiveFilterChips(): void {
    const chips: { key: string; label: string; displayValue: string }[] = [];

    if (this.searchFilter.trim()) {
      chips.push({ key: 'search', label: 'Search', displayValue: this.searchFilter.trim() });
    }
    if (this.selectedDepartment !== 'all') {
      chips.push({ key: 'dept', label: 'Department', displayValue: this.selectedDepartment });
    }
    const effectiveStatus = this.activeKpiStatus || (this.selectedStatus !== 'all' ? this.selectedStatus : '');
    if (effectiveStatus && effectiveStatus !== 'all') {
      chips.push({
        key: 'status',
        label: 'Status',
        displayValue: effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1),
      });
    }
    if (this.selectedShift !== 'all') {
      chips.push({ key: 'shift', label: 'Shift', displayValue: this.selectedShift });
    }
    if (this.selectedOffice !== 'all') {
      chips.push({ key: 'office', label: 'Office', displayValue: this.selectedOffice });
    }

    this.activeFilterChips = chips;
  }

  // -------------------------------------------------------------
  // Table Selection & Toolbar Operations
  // -------------------------------------------------------------
  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    this.allSelected = checked;
    this.filteredRecords.forEach((r) => (r.selected = checked));
  }

  checkSelectionState(): void {
    this.allSelected = this.filteredRecords.length > 0 && this.filteredRecords.every((r) => r.selected);
  }

  prevDate(): void {
    this.currentNavDate = new Date(this.currentNavDate.getTime() - 86400000);
    this.updateDateNavString();
  }

  nextDate(): void {
    this.currentNavDate = new Date(this.currentNavDate.getTime() + 86400000);
    this.updateDateNavString();
  }

  private updateDateNavString(): void {
    const d = String(this.currentNavDate.getDate()).padStart(2, '0');
    const m = String(this.currentNavDate.getMonth() + 1).padStart(2, '0');
    const y = this.currentNavDate.getFullYear();
    this.selectedDateNav = `${d}-${m}-${y}`;
  }

  toggleActionDropdown(rowId: number, event: MouseEvent): void {
    event.stopPropagation();
    if (this.activeActionRowId === rowId) {
      this.activeActionRowId = null;
    } else {
      this.activeActionRowId = rowId;
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.activeActionRowId = null;
    this.exportDropdownOpen = false;
  }

  exportCSV(): void {
    this.exportDropdownOpen = false;
    this.triggerToast('Exporting Attendance Report as CSV...');
  }

  exportExcel(): void {
    this.exportDropdownOpen = false;
    this.triggerToast('Exporting Attendance Report as Excel...');
  }

  exportPDF(): void {
    this.exportDropdownOpen = false;
    this.triggerToast('Exporting Attendance Report as PDF...');
  }

  printTable(): void {
    this.exportDropdownOpen = false;
    window.print();
  }

  // -------------------------------------------------------------
  // Monthly Calendar Modal Handlers
  // -------------------------------------------------------------
  openMonthlyCalendar(empId: string): void {
    const found = this.employees.find((e) => e.empId === empId);
    this.selectedEmpForCalendar = found || this.employees[2];
    this.selectedCalendarEmpId = empId;
    this.calCurrentYear = 2026;
    this.calCurrentMonth = 0; // January
    this.calendarModalOpen = true;
  }

  closeMonthlyCalendar(): void {
    this.calendarModalOpen = false;
  }

  // -------------------------------------------------------------
  // Punch Timeline Modal Handlers
  // -------------------------------------------------------------
  openTimeline(record: AttendanceRecord): void {
    this.selectedRecordForTimeline = record;

    if (record.statusKey === 'absent' || record.statusKey === 'leave') {
      this.timelinePunches = [];
      this.timelineTotalHours = '0h';
      this.timelineBreakTime = '0m';
      this.timelineLunchTime = '0m';
      this.timelineStatusText = record.statusLabel;
    } else {
      const isLate = record.statusKey === 'late';
      const checkInTime = isLate ? '09:41 AM' : '09:02 AM';
      const b1Out = '11:15 AM';
      const b1In = '11:32 AM';
      const lOut = '01:05 PM';
      const lIn = '01:50 PM';
      const b2Out = '04:10 PM';
      const b2In = '04:25 PM';
      const checkOutTime = '06:05 PM';

      this.timelinePunches = [
        {
          key: 'checkin',
          label: 'Check In',
          icon: 'bi-box-arrow-in-right',
          color: 'present',
          meta: isLate ? 'Late arrival' : 'Shift started',
          time: checkInTime,
        },
        {
          key: 'breakout1',
          label: 'Break Out',
          icon: 'bi-cup-hot',
          color: 'half',
          meta: 'Tea break',
          time: b1Out,
          gapBadge: { text: '17m away' },
        },
        {
          key: 'breakin1',
          label: 'Break In',
          icon: 'bi-arrow-counterclockwise',
          color: 'half',
          meta: 'Back to desk',
          time: b1In,
        },
        {
          key: 'lunchout',
          label: 'Lunch Out',
          icon: 'bi-egg-fried',
          color: 'leave',
          meta: 'Lunch break',
          time: lOut,
          gapBadge: { text: '45m away', isLong: true },
        },
        {
          key: 'lunchin',
          label: 'Lunch In',
          icon: 'bi-arrow-counterclockwise',
          color: 'leave',
          meta: 'Back to desk',
          time: lIn,
        },
        {
          key: 'breakout2',
          label: 'Break Out',
          icon: 'bi-cup-hot',
          color: 'half',
          meta: 'Evening tea',
          time: b2Out,
          gapBadge: { text: '15m away' },
        },
        {
          key: 'breakin2',
          label: 'Break In',
          icon: 'bi-arrow-counterclockwise',
          color: 'half',
          meta: 'Back to desk',
          time: b2In,
        },
        {
          key: 'checkout',
          label: 'Check Out',
          icon: 'bi-box-arrow-right',
          color: 'present',
          meta: 'Shift ended',
          time: checkOutTime,
        },
      ];

      this.timelineTotalHours = `${record.hoursWorked}h`;
      this.timelineBreakTime = '32m';
      this.timelineLunchTime = '45m';
      this.timelineStatusText = record.statusLabel;
    }

    this.timelineModalOpen = true;
  }

  closeTimeline(): void {
    this.timelineModalOpen = false;
  }

  // -------------------------------------------------------------
  // Mark Attendance Modal Handlers
  // -------------------------------------------------------------
  openMarkAttendance(): void {
    this.markCurrentStep = 1;
    this.markSelectedEmpId = this.employees[0].empId;
    this.markDate = new Date().toISOString().slice(0, 10);
    this.markShift = 'General';
    this.markStatus = 'present';
    this.markCheckInTime = '09:00';
    this.markCheckOutTime = '18:00';
    this.markNotes = '';
    this.markModalOpen = true;
  }

  closeMarkAttendance(): void {
    this.markModalOpen = false;
  }

  nextMarkStep(): void {
    this.markCurrentStep = 2;
  }

  prevMarkStep(): void {
    this.markCurrentStep = 1;
  }

  submitMarkAttendance(): void {
    const emp = this.employees.find((e) => e.empId === this.markSelectedEmpId) || this.employees[0];
    const sLabel = this.markStatus === 'late' ? 'Late' : this.markStatus === 'half' ? 'Half Day' : 'Present';

    const newRecord: AttendanceRecord = {
      id: this.allRecords.length + 1,
      sno: 1,
      empId: emp.empId,
      name: emp.name,
      avatar: emp.avatar,
      department: emp.dept,
      date: '23 Sep 2026',
      dateKey: this.markDate,
      monthKey: '2026-09',
      checkIn: this.markCheckInTime,
      checkOut: this.markCheckOutTime,
      hoursWorked: 8.5,
      hoursExpected: 9,
      workingHoursFormatted: '8.5h / 9h',
      workPercent: 94,
      statusLabel: sLabel,
      statusKey: this.markStatus,
      shift: this.markShift,
      office: 'Zenith Technologies',
    };

    this.allRecords.unshift(newRecord);
    this.applyAllFilters();
    this.closeMarkAttendance();
    this.triggerToast(`Attendance recorded successfully for ${emp.name}.`);
  }

  get selectedMarkEmp(): AttendanceEmployee {
    return this.employees.find((e) => e.empId === this.markSelectedEmpId) || this.employees[0];
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
