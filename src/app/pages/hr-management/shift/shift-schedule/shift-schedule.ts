import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Breadcrumb } from '../../../../shared/breadcrumb/breadcrumb';
import { PrimeDataTable, PrimeTableColumn, PrimeTableHeader } from '../../../../shared/primedatatable/primedatatable';

export interface ShiftMaster {
  id: number;
  shift_name: string;
  shift_code: string;
  start_time: string;
  end_time: string;
  status: 'Enable' | 'Disable';
  badge_class: string;
}

export interface EmployeeSchedule {
  id: number;
  emp_id: number;
  name: string;
  gender: 'Male' | 'Female';
  role: string;
  sub_role: string;
  branch: string;
  avatar: string;
  shift_type: 'regular' | 'overtime';
  shifts: Record<string, number | null>;
  selected?: boolean;
}

export interface DayCol {
  key: string;
  dayLabel: string;
  dayNum: number;
  isPast: boolean;
  isToday?: boolean;
}

export interface ActiveFilterChip {
  id: string;
  key: string;
  value: string;
  label: string;
}

export interface ShiftChangeRequest {
  id: string;
  empId: number;
  empName: string;
  empRole: string;
  empSubRole: string;
  empAvatar: string;
  dayLabel: string;
  dayKey: string;
  currentShift: ShiftMaster | null;
  requestedShift: ShiftMaster;
  reason: string;
  reasonLabel: string;
  remarks?: string;
  approverName: string;
  approverRole: string;
  approverAvatar: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  createdAt: string;
}

@Component({
  selector: 'app-shift-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule, Breadcrumb, PrimeDataTable, AppStatCard],
  templateUrl: './shift-schedule.html',
  styleUrl: './shift-schedule.scss'
})
export class ShiftSchedule implements OnInit {
  // Master shifts (Enable shifts only assignable)
  shifts: ShiftMaster[] = [
    { id: 1, shift_name: 'General Shift', shift_code: 'GEN', start_time: '09:30 AM', end_time: '06:30 PM', status: 'Enable', badge_class: 'shift-badge-gen' },
    { id: 2, shift_name: 'Morning Shift', shift_code: 'MOR', start_time: '06:00 AM', end_time: '02:00 PM', status: 'Enable', badge_class: 'shift-badge-mor' },
    { id: 3, shift_name: 'Evening Shift', shift_code: 'EVE', start_time: '02:00 PM', end_time: '10:00 PM', status: 'Enable', badge_class: 'shift-badge-eve' },
    { id: 4, shift_name: 'Night Shift', shift_code: 'NGT', start_time: '10:00 PM', end_time: '06:00 AM', status: 'Enable', badge_class: 'shift-badge-ngt' },
    { id: 5, shift_name: 'Weekend Support Shift', shift_code: 'WKD', start_time: '10:00 AM', end_time: '07:00 PM', status: 'Disable', badge_class: 'shift-badge-wkd' },
  ];

  // Dummy Employee dataset matching PHP
  allEmployees: EmployeeSchedule[] = [];
  filteredEmployees: EmployeeSchedule[] = [];
  displayedEmployees: EmployeeSchedule[] = [];

  // PrimeDataTable Configuration
  columns: PrimeTableColumn[] = [];
  tableHeader: PrimeTableHeader = {
    title: 'Employee Shift Schedule',
    icon: 'ti ti-calendar-time',
    count: 0
  };

  // View Mode: 'weekly' | 'monthly'
  viewMode: 'weekly' | 'monthly' = 'weekly';
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();

  // Days list for table columns
  weeklyDays: DayCol[] = [];
  monthlyDays: DayCol[] = [];

  // Stats
  statTotal = 0;
  statBoys = 0;
  statGirls = 0;
  statDeptCount = 0;
  activeGenderFilter: 'all' | 'Male' | 'Female' = 'all';
  deptBreakdownOpen = false;
  deptBreakdownList: { name: string; count: number }[] = [];

  // Filter Collapse
  filtersOpen = false;

  // Filter Form Controls
  filterForm = new FormGroup({
    search: new FormControl<string | null>(null),
    shiftId: new FormControl<string | number | null>(null),
    shiftType: new FormControl<string | null>(null),
    department: new FormControl<string | null>(null),
    position: new FormControl<string | null>(null),
    scheduleType: new FormControl<string | null>(null),
  });

  // Dropdown options
  shiftOptions: { label: string; value: any }[] = [];
  shiftTypeOptions = [
    { label: 'All Types', value: null },
    { label: 'Regular Shift', value: 'regular' },
    { label: 'Overtime Shift', value: 'overtime' },
  ];
  departmentOptions = [
    { label: 'All Departments', value: null },
    { label: 'Developer', value: 'Developer' },
    { label: 'Branch Manager', value: 'Branch Manager' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'HR', value: 'HR' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Designer', value: 'Designer' },
    { label: 'Admin', value: 'Admin' },
  ];
  positionOptions = [
    { label: 'All Positions', value: null },
    { label: 'OpenSource', value: 'OpenSource' },
    { label: 'Branch Manager', value: 'Branch Manager' },
    { label: 'Backend', value: 'Backend' },
    { label: 'UI/UX', value: 'UI/UX' },
    { label: 'Frontend', value: 'Frontend' },
    { label: 'Recruiter', value: 'Recruiter' },
    { label: 'DevOps', value: 'DevOps' },
    { label: 'Accountant', value: 'Accountant' },
    { label: 'Content Writer', value: 'Content Writer' },
    { label: 'Full Stack', value: 'Full Stack' },
    { label: 'QA', value: 'QA' },
    { label: 'Office Admin', value: 'Office Admin' },
    { label: 'Digital Marketing', value: 'Digital Marketing' },
  ];
  scheduleTypeOptions = [
    { label: 'All Types', value: null },
    { label: 'Permanent', value: 'permanent' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'Custom Range', value: 'custom' },
  ];
  monthOptions: { label: string; value: number }[] = [];

  // Active filter chips
  activeChips: ActiveFilterChip[] = [];

  // Pagination
  pageSize = 10;
  pageSizeOptions = [10, 25, 50, 100];
  currentPage = 1;
  totalPages = 1;
  startIndex = 0;
  endIndex = 0;

  // Selection
  selectAll = false;
  selectedEmployees: EmployeeSchedule[] = [];

  // Shift Change Request Modal State (matching mockup)
  assignModalOpen = false;
  assigningTargetEmployees: EmployeeSchedule[] = [];
  targetEmployee: EmployeeSchedule | null = null;
  targetDayCol: DayCol | null = null;
  targetDateFormatted = '';
  currentShift: ShiftMaster | null = null;
  requestedShift: ShiftMaster | null = null;
  assignShiftId: number | null = null;
  changeReason: string | null = null;
  assignDurationType: 'day' | 'week' | 'month' | 'permanent' = 'day';
  assignRemarks = '';
  singleTargetDayKey: string | null = null;

  reasonOptions = [
    { label: 'Health / Medical reason', value: 'medical' },
    { label: 'Personal emergency / Family obligation', value: 'family' },
    { label: 'Commute / Transport issue', value: 'commute' },
    { label: 'Education / Evening class', value: 'education' },
    { label: 'Project deadline / Overtime support', value: 'project' },
    { label: 'Mutual swap with colleague', value: 'swap' },
    { label: 'Other reason', value: 'other' },
  ];

  applyForOptions = [
    { label: 'This day only', value: 'day' },
    { label: 'This entire week', value: 'week' },
    { label: 'This entire month', value: 'month' },
    { label: 'Permanent change', value: 'permanent' },
  ];

  shiftOptionsForModal: { label: string; value: number }[] = [];

  // Bulk Upload Offcanvas State
  bulkUploadOpen = false;
  uploadedFileName = '';
  uploadedRowCount = 0;
  uploadedPreviewRows: any[] = [];
  isDraggingFile = false;

  // Export Menu
  exportMenuOpen = false;

  // Shift Requests Full-Screen View / Modal State
  shiftRequestsModalOpen = false;
  shiftRequestsViewMode: 'employee' | 'manager' = 'employee';
  shiftRequestsList: ShiftChangeRequest[] = [];

  get pendingRequestsCount(): number {
    return this.shiftRequestsList.filter(r => r.status === 'Pending').length;
  }

  get filteredShiftRequests(): ShiftChangeRequest[] {
    return this.shiftRequestsList;
  }

  openShiftRequestsModal(): void {
    this.shiftRequestsModalOpen = true;
  }

  closeShiftRequestsModal(): void {
    this.shiftRequestsModalOpen = false;
  }

  approveRequest(req: ShiftChangeRequest): void {
    req.status = 'Approved';
    const emp = this.allEmployees.find(e => e.emp_id === req.empId);
    if (emp) {
      const shiftText = `${req.requestedShift.shift_code} (${req.requestedShift.start_time})`;
      if (req.dayKey && req.dayKey !== 'all') {
        emp.shifts[req.dayKey] = req.requestedShift.id;
        (emp as any)[req.dayKey] = shiftText;
      } else {
        Object.keys(emp.shifts).forEach(k => {
          if (k !== 'Sun') {
            emp.shifts[k] = req.requestedShift.id;
            (emp as any)[k] = shiftText;
          }
        });
      }
      this.calculateStats();
      this.applyFilters();
    }
  }

  rejectRequest(req: ShiftChangeRequest): void {
    req.status = 'Rejected';
  }

  cancelRequest(req: ShiftChangeRequest): void {
    req.status = 'Cancelled';
  }

  ngOnInit(): void {
    this.initOptions();
    this.initDates();
    this.initEmployees();
    this.calculateStats();
    this.applyFilters();
    this.updateTableColumns();
  }

  private initOptions(): void {
    this.shiftOptions = [
      { label: 'All Shifts', value: null },
      ...this.shifts.map(s => ({ label: `${s.shift_name} (${s.shift_code})`, value: s.id })),
      { label: 'Not Assigned', value: 'unassigned' }
    ];

    this.shiftOptionsForModal = this.shifts
      .filter(s => s.status === 'Enable')
      .map(s => ({
        label: `${s.shift_name} (${s.start_time} - ${s.end_time})`,
        value: s.id,
      }));

    this.monthOptions = this.monthNames.map((name, i) => ({
      label: name,
      value: i + 1
    }));
  }

  onRequestedShiftSelect(shiftId: number | null): void {
    this.assignShiftId = shiftId;
    this.requestedShift = shiftId ? (this.getShiftById(shiftId) || null) : null;
  }

  get affectedDaysText(): string {
    switch (this.assignDurationType) {
      case 'week': return '7 day(s) will be affected';
      case 'month': return '30 day(s) will be affected';
      case 'permanent': return 'All future days will be affected';
      default: return '1 day(s) will be affected';
    }
  }

  private initDates(): void {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sun

    // Generate Weekly Days (Sun to Sat)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - currentDay);

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.weeklyDays = dayLabels.map((lbl, idx) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + idx);
      const isPast = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isToday = d.toDateString() === today.toDateString();
      return {
        key: lbl,
        dayLabel: lbl,
        dayNum: d.getDate(),
        isPast,
        isToday
      };
    });

    // Generate Monthly Days
    this.recomputeMonthlyDays();
  }

  private recomputeMonthlyDays(): void {
    const today = new Date();
    const daysInMonth = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    this.monthlyDays = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(this.selectedYear, this.selectedMonth - 1, day);
      const isPast = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isToday = d.toDateString() === today.toDateString();
      this.monthlyDays.push({
        key: String(day),
        dayLabel: dayLabels[d.getDay()],
        dayNum: day,
        isPast,
        isToday
      });
    }
  }

  private initEmployees(): void {
    const maleNames = ['Vijai', 'Anbarasan', 'venkatesanB', 'Karthik Raja', 'Mohammed Farhan', 'Suresh Kumar', 'Arun Prakash', 'Rajesh Verma', 'Vignesh T', 'Senthil Nathan', 'Kiran Patel', 'Mohan Raj', 'Prabhu K', 'Thirunavukkarasu', 'Yuvaraj S', 'Ravi Shankar', 'Manikandan R', 'Balaji Venkat', 'Gokul Krishna', 'Dinesh Babu', 'Saravanan M', 'Prasanna Kumar', 'Tharun S', 'Karthikeyan P', 'Aakash Singh', 'Sabari Ganesh'];

    const raw = [
      { id: 1, emp_id: 41, name: 'Vijai', role: 'Developer', sub_role: 'OpenSource', branch: 'Gharuda Infotech', avatar: 'https://i.pravatar.cc/150?img=11', shifts: { Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 } },
      { id: 2, emp_id: 40, name: 'Anbarasan', role: 'Developer', sub_role: 'OpenSource', branch: 'Gharuda Infotech', avatar: 'https://i.pravatar.cc/150?img=12', shifts: { Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 } },
      { id: 3, emp_id: 39, name: 'Shailni Raj', role: 'Branch Manager', sub_role: 'Branch Manager', branch: 'Gharuda Infotech', avatar: 'https://i.pravatar.cc/150?img=23', shifts: { Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 } },
      { id: 4, emp_id: 36, name: 'venkatesanB', role: 'Developer', sub_role: 'Windows', branch: 'Gharuda Infotech', avatar: 'https://i.pravatar.cc/150?img=14', shifts: { Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 } },
      { id: 5, emp_id: 35, name: 'Bhuvaneswari', role: 'Marketing', sub_role: 'Marketing Executive', branch: 'Gharuda Infotech', avatar: 'https://i.pravatar.cc/150?img=25', shifts: { Sun: 2, Mon: 2, Tue: 2, Wed: 2, Thu: 2, Fri: 2, Sat: 2 } },
      { id: 6, emp_id: 34, name: 'Karthik Raja', role: 'Developer', sub_role: 'Backend', branch: 'Gharuda Infotech', avatar: 'https://i.pravatar.cc/150?img=16', shifts: { Sun: 1, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: null } },
      { id: 7, emp_id: 33, name: 'Priya Sharma', role: 'Designer', sub_role: 'UI/UX', branch: 'Gharuda Infotech', avatar: 'https://i.pravatar.cc/150?img=27', shifts: { Sun: null, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: null } },
      { id: 8, emp_id: 32, name: 'Mohammed Farhan', role: 'Developer', sub_role: 'Frontend', branch: 'Gharuda IT Park', avatar: 'https://i.pravatar.cc/150?img=18', shifts: { Sun: null, Mon: 2, Tue: 2, Wed: 2, Thu: 2, Fri: 2, Sat: null } },
      { id: 9, emp_id: 31, name: 'Deepa Nair', role: 'HR', sub_role: 'Recruiter', branch: 'Gharuda Infotech', avatar: 'https://i.pravatar.cc/150?img=29', shifts: { Sun: null, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: null } },
      { id: 10, emp_id: 30, name: 'Suresh Kumar', role: 'Developer', sub_role: 'DevOps', branch: 'Gharuda IT Park', avatar: 'https://i.pravatar.cc/150?img=30', shifts: { Sun: null, Mon: 3, Tue: 3, Wed: 3, Thu: 3, Fri: 3, Sat: null } },
      { id: 11, emp_id: 29, name: 'Lakshmi Devi', role: 'Finance', sub_role: 'Accountant', branch: 'Gharuda Infotech', avatar: 'https://i.pravatar.cc/150?img=31', shifts: { Sun: null, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: null } },
      { id: 12, emp_id: 28, name: 'Arun Prakash', role: 'Developer', sub_role: 'Mobile', branch: 'Gharuda Infotech', avatar: 'https://i.pravatar.cc/150?img=32', shifts: { Sun: null, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 } },
      { id: 13, emp_id: 27, name: 'Nithya Selvi', role: 'Marketing', sub_role: 'Content Writer', branch: 'Gharuda Infotech', avatar: 'https://i.pravatar.cc/150?img=33', shifts: { Sun: null, Mon: 2, Tue: 2, Wed: 2, Thu: 2, Fri: 2, Sat: null } },
      { id: 14, emp_id: 26, name: 'Rajesh Verma', role: 'Developer', sub_role: 'Full Stack', branch: 'Gharuda IT Park', avatar: 'https://i.pravatar.cc/150?img=34', shifts: { Sun: null, Mon: 3, Tue: 3, Wed: 3, Thu: 3, Fri: 3, Sat: null } },
      { id: 15, emp_id: 25, name: 'Divya Prakash', role: 'HR', sub_role: 'HR Manager', branch: 'Gharuda Infotech', avatar: 'https://i.pravatar.cc/150?img=35', shifts: { Sun: null, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: null } },
      { id: 16, emp_id: 24, name: 'Vignesh T', role: 'Developer', sub_role: 'QA', branch: 'Gharuda Infotech', avatar: 'https://i.pravatar.cc/150?img=36', shifts: { Sun: null, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: 1 } },
      { id: 17, emp_id: 23, name: 'Meena Kumari', role: 'Admin', sub_role: 'Office Admin', branch: 'Gharuda Infotech', avatar: 'https://i.pravatar.cc/150?img=37', shifts: { Sun: null, Mon: 1, Tue: 1, Wed: 1, Thu: 1, Fri: 1, Sat: null } },
      { id: 18, emp_id: 22, name: 'Senthil Nathan', role: 'Developer', sub_role: 'ML Engineer', branch: 'Gharuda IT Park', avatar: 'https://i.pravatar.cc/150?img=38', shifts: { Sun: null, Mon: 3, Tue: 3, Wed: 3, Thu: 3, Fri: 3, Sat: 3 } },
      { id: 19, emp_id: 21, name: 'Harini R', role: 'Designer', sub_role: 'Graphic Design', branch: 'Gharuda Infotech', avatar: 'https://i.pravatar.cc/150?img=39', shifts: { Sun: null, Mon: 2, Tue: 2, Wed: 2, Thu: 2, Fri: 2, Sat: null } },
      { id: 20, emp_id: 20, name: 'Kiran Patel', role: 'Developer', sub_role: 'Cloud', branch: 'Gharuda IT Park', avatar: 'https://i.pravatar.cc/150?img=40', shifts: { Sun: null, Mon: 3, Tue: 3, Wed: 3, Thu: 3, Fri: 3, Sat: null } },
    ];

    this.allEmployees = raw.map((item, idx) => {
      const gender: 'Male' | 'Female' = maleNames.includes(item.name) ? 'Male' : 'Female';
      const shift_type = idx % 5 === 0 ? 'overtime' : 'regular';
      
      // Populate monthly shifts as well
      const shiftsWithMonthly: Record<string, number | null> = { ...item.shifts };
      for (let day = 1; day <= 31; day++) {
        shiftsWithMonthly[String(day)] = (day % 7 === 0 || day % 7 === 1) ? null : ((idx % 3) + 1);
      }

      const empRecord: any = {
        ...item,
        gender,
        shift_type,
        shifts: shiftsWithMonthly,
        selected: false
      };

      Object.keys(shiftsWithMonthly).forEach(k => {
        const sid = shiftsWithMonthly[k];
        const s = sid ? this.getShiftById(sid) : null;
        empRecord[k] = s ? `${s.shift_code} (${s.start_time})` : 'Off';
      });

      return empRecord;
    });
  }

  calculateStats(): void {
    this.statTotal = this.allEmployees.length;
    this.statBoys = this.allEmployees.filter(e => e.gender === 'Male').length;
    this.statGirls = this.allEmployees.filter(e => e.gender === 'Female').length;

    const deptMap: Record<string, number> = {};
    this.allEmployees.forEach(e => {
      deptMap[e.role] = (deptMap[e.role] || 0) + 1;
    });

    this.statDeptCount = Object.keys(deptMap).length;
    this.deptBreakdownList = Object.entries(deptMap).map(([name, count]) => ({ name, count }));
  }

  // ---------------- View Toggle & PrimeDataTable Columns ----------------
  setViewMode(mode: 'weekly' | 'monthly'): void {
    this.viewMode = mode;
    this.updateTableColumns();
  }

  onMonthChange(): void {
    this.recomputeMonthlyDays();
    this.updateTableColumns();
  }

  updateTableColumns(): void {
    const baseCols: PrimeTableColumn[] = [
      { field: 'emp_id', header: 'Emp ID', width: this.viewMode === 'weekly' ? '95px' : '85px', sortable: true },
      { field: 'name', header: 'Employee', width: this.viewMode === 'weekly' ? '220px' : '190px', type: 'custom', sortable: true },
      { field: 'role', header: 'Role', width: this.viewMode === 'weekly' ? '160px' : '140px', type: 'custom', sortable: true },
      { field: 'branch', header: 'Branch', width: this.viewMode === 'weekly' ? '160px' : '140px', sortable: true },
    ];

    const days = this.viewMode === 'weekly' ? this.weeklyDays : this.monthlyDays;
    const dayCols: PrimeTableColumn[] = days.map(day => ({
      field: day.key,
      header: `${day.dayLabel} ${day.dayNum}`,
      type: 'custom',
      width: this.viewMode === 'weekly' ? '115px' : '52px',
      cellClass: 'text-center' + (day.isToday ? ' today-cell' : '') + (day.isPast ? ' past-day-cell' : ''),
      meta: day
    }));

    this.columns = [...baseCols, ...dayCols];
  }

  isDayColumn(field: string): boolean {
    return (
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].includes(field) ||
      (!isNaN(Number(field)) && Number(field) >= 1 && Number(field) <= 31)
    );
  }

  onSelectionChange(selected: EmployeeSchedule[]): void {
    this.selectedEmployees = selected || [];
  }

  // ---------------- Gender / Stat Filter ----------------
  setGenderFilter(gender: 'all' | 'Male' | 'Female'): void {
    this.activeGenderFilter = gender;
    this.applyFilters();
  }

  toggleDeptBreakdown(): void {
    this.deptBreakdownOpen = !this.deptBreakdownOpen;
  }

  filterByDepartment(deptName: string): void {
    this.filterForm.controls.department.setValue(deptName);
    this.applyFilters();
  }

  // ---------------- Filters & Chips ----------------
  toggleFilters(): void {
    this.filtersOpen = !this.filtersOpen;
  }

  applyFilters(): void {
    const { search, shiftId, shiftType, department, position, scheduleType } = this.filterForm.value;

    this.filteredEmployees = this.allEmployees.filter(emp => {
      // Gender card filter
      if (this.activeGenderFilter !== 'all' && emp.gender !== this.activeGenderFilter) {
        return false;
      }

      // Search (Name or ID)
      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = emp.name.toLowerCase().includes(q);
        const matchesId = String(emp.emp_id).includes(q);
        if (!matchesName && !matchesId) return false;
      }

      // Shift Name filter
      if (shiftId) {
        if (shiftId === 'unassigned') {
          const hasAny = Object.values(emp.shifts).some(v => v !== null);
          if (hasAny) return false;
        } else {
          const hasShift = Object.values(emp.shifts).some(v => v === Number(shiftId));
          if (!hasShift) return false;
        }
      }

      // Shift Type
      if (shiftType && emp.shift_type !== shiftType) {
        return false;
      }

      // Department
      if (department && emp.role !== department) {
        return false;
      }

      // Position
      if (position && emp.sub_role !== position) {
        return false;
      }

      return true;
    });

    this.buildActiveChips();
    this.tableHeader = {
      ...this.tableHeader,
      count: this.filteredEmployees.length
    };
    this.currentPage = 1;
    this.updatePagination();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.activeGenderFilter = 'all';
    this.applyFilters();
  }

  removeChip(chipId: string): void {
    switch (chipId) {
      case 'search': this.filterForm.controls.search.setValue(null); break;
      case 'shiftId': this.filterForm.controls.shiftId.setValue(null); break;
      case 'shiftType': this.filterForm.controls.shiftType.setValue(null); break;
      case 'department': this.filterForm.controls.department.setValue(null); break;
      case 'position': this.filterForm.controls.position.setValue(null); break;
      case 'gender': this.activeGenderFilter = 'all'; break;
    }
    this.applyFilters();
  }

  private buildActiveChips(): void {
    const chips: ActiveFilterChip[] = [];
    const val = this.filterForm.value;

    if (val.search) chips.push({ id: 'search', key: 'Search', value: val.search, label: `Search: ${val.search}` });
    if (val.shiftId) {
      const shiftName = val.shiftId === 'unassigned' ? 'Not Assigned' : this.getShiftById(Number(val.shiftId))?.shift_name || val.shiftId;
      chips.push({ id: 'shiftId', key: 'Shift', value: String(shiftName), label: `Shift: ${shiftName}` });
    }
    if (val.shiftType) chips.push({ id: 'shiftType', key: 'Shift Type', value: val.shiftType, label: `Type: ${val.shiftType}` });
    if (val.department) chips.push({ id: 'department', key: 'Department', value: val.department, label: `Dept: ${val.department}` });
    if (val.position) chips.push({ id: 'position', key: 'Position', value: val.position, label: `Pos: ${val.position}` });
    if (this.activeGenderFilter !== 'all') {
      chips.push({ id: 'gender', key: 'Gender', value: this.activeGenderFilter, label: `Gender: ${this.activeGenderFilter}` });
    }

    this.activeChips = chips;
  }

  // ---------------- Pagination ----------------
  updatePagination(): void {
    const total = this.filteredEmployees.length;
    this.totalPages = Math.ceil(total / this.pageSize) || 1;
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, total);
    this.displayedEmployees = this.filteredEmployees.slice(this.startIndex, this.endIndex);
    this.syncSelectAllState();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
    this.updatePagination();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = Number(newSize);
    this.currentPage = 1;
    this.updatePagination();
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // ---------------- Selection & Bulk Actions ----------------
  toggleSelectAll(): void {
    this.displayedEmployees.forEach(e => (e.selected = this.selectAll));
    this.updateSelectedList();
  }

  onRowSelectChange(): void {
    this.syncSelectAllState();
    this.updateSelectedList();
  }

  private syncSelectAllState(): void {
    this.selectAll = this.displayedEmployees.length > 0 && this.displayedEmployees.every(e => e.selected);
  }

  private updateSelectedList(): void {
    this.selectedEmployees = this.allEmployees.filter(e => e.selected);
  }

  clearSelection(): void {
    this.allEmployees.forEach(e => (e.selected = false));
    this.selectAll = false;
    this.selectedEmployees = [];
  }

  // ---------------- Helper ----------------
  getShiftById(id: number | null): ShiftMaster | undefined {
    if (!id) return undefined;
    return this.shifts.find(s => s.id === id);
  }

  getShiftForDay(emp: EmployeeSchedule, dayKey: string): ShiftMaster | null {
    const shiftId = emp.shifts[dayKey];
    if (!shiftId) return null;
    return this.getShiftById(shiftId) || null;
  }

  // ---------------- Assign Shift Modal ----------------
  openAssignModalForDay(emp: EmployeeSchedule, dayKey: string): void {
    this.singleTargetDayKey = dayKey;
    this.targetEmployee = emp;
    this.assigningTargetEmployees = [emp];

    const days = this.viewMode === 'weekly' ? this.weeklyDays : this.monthlyDays;
    this.targetDayCol = days.find(d => d.key === dayKey) || null;

    const dayNum = this.targetDayCol?.dayNum || new Date().getDate();
    const dayStr = String(dayNum).padStart(2, '0');
    const monthStr = String(this.selectedMonth).padStart(2, '0');
    this.targetDateFormatted = `${dayStr}-${monthStr}-${this.selectedYear}`;

    const currentShiftId = emp.shifts[dayKey];
    this.currentShift = currentShiftId ? (this.getShiftById(currentShiftId) || null) : null;

    // Reset requested shift to null (renders 'Not selected' as in mockup)
    this.assignShiftId = null;
    this.requestedShift = null;
    this.changeReason = null;
    this.assignDurationType = 'day';
    this.assignRemarks = '';
    this.assignModalOpen = true;
  }

  openBulkAssignModal(): void {
    if (this.selectedEmployees.length === 0) return;
    this.singleTargetDayKey = null;
    this.targetEmployee = this.selectedEmployees[0];
    this.assigningTargetEmployees = [...this.selectedEmployees];

    const now = new Date();
    const dayStr = String(now.getDate()).padStart(2, '0');
    const monthStr = String(this.selectedMonth).padStart(2, '0');
    this.targetDateFormatted = `${dayStr}-${monthStr}-${this.selectedYear}`;
    this.targetDayCol = {
      key: 'bulk',
      dayLabel: `${this.selectedEmployees.length} selected`,
      dayNum: now.getDate(),
      isPast: false
    };

    this.currentShift = null;
    this.assignShiftId = null;
    this.requestedShift = null;
    this.changeReason = null;
    this.assignDurationType = 'week';
    this.assignRemarks = '';
    this.assignModalOpen = true;
  }

  closeAssignModal(): void {
    this.assignModalOpen = false;
  }

  saveShiftAssignment(): void {
    if (!this.assignShiftId) return;

    const assignedShift = this.getShiftById(this.assignShiftId);
    const shiftCodeText = assignedShift ? `${assignedShift.shift_code} (${assignedShift.start_time})` : 'Off';

    this.assigningTargetEmployees.forEach(emp => {
      const match = this.allEmployees.find(e => e.id === emp.id) as any;
      if (match) {
        if (this.singleTargetDayKey) {
          if (this.assignDurationType === 'day') {
            match.shifts[this.singleTargetDayKey] = this.assignShiftId;
            match[this.singleTargetDayKey] = shiftCodeText;
          } else {
            // Apply for entire week or month
            Object.keys(match.shifts).forEach(k => {
              if (k !== 'Sun') {
                match.shifts[k] = this.assignShiftId;
                match[k] = shiftCodeText;
              }
            });
          }
        } else {
          // Bulk assign to all days
          Object.keys(match.shifts).forEach(k => {
            if (k !== 'Sun') {
              match.shifts[k] = this.assignShiftId;
              match[k] = shiftCodeText;
            }
          });
        }
      }

      // Record Shift Change Request
      if (assignedShift) {
        const newReq: ShiftChangeRequest = {
          id: `#REQ-${String(this.shiftRequestsList.length + 1).padStart(3, '0')}`,
          empId: emp.emp_id,
          empName: emp.name,
          empRole: emp.role,
          empSubRole: emp.sub_role,
          empAvatar: emp.avatar,
          dayLabel: `${this.targetDateFormatted} (${this.targetDayCol?.dayLabel || 'Day'})`,
          dayKey: this.singleTargetDayKey || 'all',
          currentShift: this.currentShift,
          requestedShift: assignedShift,
          reason: this.changeReason || 'other',
          reasonLabel: this.reasonOptions.find(r => r.value === this.changeReason)?.label || 'General Request',
          remarks: this.assignRemarks,
          approverName: 'Shailni Raj',
          approverRole: 'Branch Manager',
          approverAvatar: 'assets/profile-3.jpg',
          status: 'Pending',
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.shiftRequestsList.unshift(newReq);
      }
    });

    this.closeAssignModal();
    this.clearSelection();
    this.applyFilters();
  }

  // ---------------- Bulk Upload Offcanvas ----------------
  openBulkUpload(): void {
    this.bulkUploadOpen = true;
    this.uploadedFileName = '';
    this.uploadedRowCount = 0;
    this.uploadedPreviewRows = [];
  }

  closeBulkUpload(): void {
    this.bulkUploadOpen = false;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingFile = false;
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingFile = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingFile = false;
  }

  private handleFile(file: File): void {
    this.uploadedFileName = file.name;
    // Simulate parsing spreadsheet rows
    this.uploadedRowCount = 12;
    this.uploadedPreviewRows = [
      { empId: 41, name: 'Vijai', shift: 'General Shift', from: '2026-09-01', to: 'Permanent' },
      { empId: 40, name: 'Anbarasan', shift: 'General Shift', from: '2026-09-01', to: 'Permanent' },
      { empId: 39, name: 'Shailni Raj', shift: 'Morning Shift', from: '2026-09-01', to: '2026-09-30' },
      { empId: 35, name: 'Bhuvaneswari', shift: 'Evening Shift', from: '2026-09-01', to: '2026-09-15' },
    ];
  }

  removeUploadedFile(): void {
    this.uploadedFileName = '';
    this.uploadedRowCount = 0;
    this.uploadedPreviewRows = [];
  }

  confirmBulkUpload(): void {
    alert(`Successfully imported shift schedule for ${this.uploadedRowCount} employees.`);
    this.closeBulkUpload();
  }

  // ---------------- Export ----------------
  toggleExportMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.exportMenuOpen = !this.exportMenuOpen;
  }

  exportCSV(): void {
    const headers = ['S.No', 'Emp ID', 'Name', 'Role', 'Department', 'Branch'];
    const rows = this.filteredEmployees.map((e, idx) => [
      idx + 1,
      e.emp_id,
      `"${e.name}"`,
      `"${e.role}"`,
      `"${e.sub_role}"`,
      `"${e.branch}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shift-schedule-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    this.exportMenuOpen = false;
  }

  exportPrint(): void {
    window.print();
    this.exportMenuOpen = false;
  }
}
