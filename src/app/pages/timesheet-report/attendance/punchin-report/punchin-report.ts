import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

export interface PunchItem {
  time: string;
  warn?: boolean;
}

export interface EmployeePunchRow {
  id: number;
  emp_id: number | string;
  name: string;
  role: string;
  sub_role: string;
  branch: string;
  avatar: string;
}

export interface DateHeader {
  key: string; // '2026-08-01'
  date: string; // '1-08-2026'
  full: string; // '1 August 2026'
  day: string; // 'Saturday'
  shortDay: string; // 'Sat'
}

export interface StatusBadge {
  cls: 'full-day' | 'half-day' | 'absent' | 'weekoff';
  text: string;
  icon: string;
}

export interface TimelinePunchDisplay {
  index: number;
  time: string;
  timeDisplay: string;
  isIn: boolean;
  warn?: boolean;
  breakAfter?: string | null;
}

@Component({
  selector: 'app-punchin-report',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule],
  templateUrl: './punchin-report.html',
  styleUrl: './punchin-report.scss',
})
export class PunchinReport implements OnInit {
  // -------------------------------------------------------------
  // Filter Options & State
  // -------------------------------------------------------------
  dateRangeDisplay: string = '01 Aug 2026  —  31 Aug 2026';
  startDateStr: string = '2026-08-01';
  endDateStr: string = '2026-08-31';

  readonly branchOptions = [
    { label: 'All Branches', value: '' },
    { label: 'Gharuda Infotech', value: 'Gharuda Infotech' },
    { label: 'Gharuda IT Park', value: 'Gharuda IT Park' },
  ];

  selectedBranch: string = '';
  activeBranchFilter: string = '';
  searchQuery: string = '';

  // -------------------------------------------------------------
  // Master Employee Dataset (38 records matching PHP source)
  // -------------------------------------------------------------
  readonly allEmployees: EmployeePunchRow[] = [
    { id: 1, emp_id: 41, name: 'Vijai', role: 'Developer', sub_role: 'OpenSource', branch: 'Gharuda Infotech', avatar: 'profile-1.jpg' },
    { id: 2, emp_id: 40, name: 'Anbarasan', role: 'Developer', sub_role: 'OpenSource', branch: 'Gharuda Infotech', avatar: 'profile-2.jpg' },
    { id: 3, emp_id: 39, name: 'Shailni Raj', role: 'Branch Manager', sub_role: 'Branch Manager', branch: 'Gharuda Infotech', avatar: 'profile-3.jpg' },
    { id: 4, emp_id: 36, name: 'venkatesanB', role: 'Developer', sub_role: 'Windows', branch: 'Gharuda Infotech', avatar: 'profile-4.jpg' },
    { id: 5, emp_id: 35, name: 'Bhuvaneswari', role: 'Marketing', sub_role: 'Marketing Executive', branch: 'Gharuda Infotech', avatar: 'profile-1.jpg' },
    { id: 6, emp_id: 34, name: 'Karthik Raja', role: 'Developer', sub_role: 'Backend', branch: 'Gharuda Infotech', avatar: 'profile-2.jpg' },
    { id: 7, emp_id: 33, name: 'Priya Sharma', role: 'Designer', sub_role: 'UI/UX', branch: 'Gharuda Infotech', avatar: 'profile-3.jpg' },
    { id: 8, emp_id: 32, name: 'Mohammed Farhan', role: 'Developer', sub_role: 'Frontend', branch: 'Gharuda IT Park', avatar: 'profile-4.jpg' },
    { id: 9, emp_id: 31, name: 'Deepa Nair', role: 'HR', sub_role: 'Recruiter', branch: 'Gharuda Infotech', avatar: 'profile-1.jpg' },
    { id: 10, emp_id: 30, name: 'Suresh Kumar', role: 'Developer', sub_role: 'DevOps', branch: 'Gharuda IT Park', avatar: 'profile-2.jpg' },
    { id: 11, emp_id: 29, name: 'Lakshmi Devi', role: 'Finance', sub_role: 'Accountant', branch: 'Gharuda Infotech', avatar: 'profile-3.jpg' },
    { id: 12, emp_id: 28, name: 'Arun Prakash', role: 'Developer', sub_role: 'Mobile', branch: 'Gharuda Infotech', avatar: 'profile-4.jpg' },
    { id: 13, emp_id: 27, name: 'Nithya Selvi', role: 'Marketing', sub_role: 'Content Writer', branch: 'Gharuda Infotech', avatar: 'profile-1.jpg' },
    { id: 14, emp_id: 26, name: 'Rajesh Verma', role: 'Developer', sub_role: 'Full Stack', branch: 'Gharuda IT Park', avatar: 'profile-2.jpg' },
    { id: 15, emp_id: 25, name: 'Divya Prakash', role: 'HR', sub_role: 'HR Manager', branch: 'Gharuda Infotech', avatar: 'profile-3.jpg' },
    { id: 16, emp_id: 24, name: 'Vignesh T', role: 'Developer', sub_role: 'QA', branch: 'Gharuda Infotech', avatar: 'profile-4.jpg' },
    { id: 17, emp_id: 23, name: 'Meena Kumari', role: 'Admin', sub_role: 'Office Admin', branch: 'Gharuda Infotech', avatar: 'profile-1.jpg' },
    { id: 18, emp_id: 22, name: 'Senthil Nathan', role: 'Developer', sub_role: 'ML Engineer', branch: 'Gharuda IT Park', avatar: 'profile-2.jpg' },
    { id: 19, emp_id: 21, name: 'Harini R', role: 'Designer', sub_role: 'Graphic Design', branch: 'Gharuda Infotech', avatar: 'profile-3.jpg' },
    { id: 20, emp_id: 20, name: 'Kiran Patel', role: 'Developer', sub_role: 'Cloud', branch: 'Gharuda IT Park', avatar: 'profile-4.jpg' },
    { id: 21, emp_id: 19, name: 'Swathi Reddy', role: 'Marketing', sub_role: 'Digital Marketing', branch: 'Gharuda Infotech', avatar: 'profile-1.jpg' },
    { id: 22, emp_id: 18, name: 'Mohan Raj', role: 'Developer', sub_role: 'Java', branch: 'Gharuda Infotech', avatar: 'profile-2.jpg' },
    { id: 23, emp_id: 17, name: 'Anitha J', role: 'Finance', sub_role: 'Payroll Officer', branch: 'Gharuda Infotech', avatar: 'profile-3.jpg' },
    { id: 24, emp_id: 16, name: 'Prabhu K', role: 'Developer', sub_role: 'Python', branch: 'Gharuda IT Park', avatar: 'profile-4.jpg' },
    { id: 25, emp_id: 15, name: 'Revathi M', role: 'HR', sub_role: 'Payroll', branch: 'Gharuda Infotech', avatar: 'profile-1.jpg' },
    { id: 26, emp_id: 14, name: 'Thirunavukkarasu', role: 'Developer', sub_role: 'React', branch: 'Gharuda Infotech', avatar: 'profile-2.jpg' },
    { id: 27, emp_id: 13, name: 'Kavitha B', role: 'Admin', sub_role: 'Facilities', branch: 'Gharuda Infotech', avatar: 'profile-3.jpg' },
    { id: 28, emp_id: 12, name: 'Yuvaraj S', role: 'Developer', sub_role: 'Node.js', branch: 'Gharuda IT Park', avatar: 'profile-4.jpg' },
    { id: 29, emp_id: 11, name: 'Sabari Ganesh', role: 'Designer', sub_role: 'Motion Design', branch: 'Gharuda Infotech', avatar: 'profile-1.jpg' },
    { id: 30, emp_id: 10, name: 'Geetha Lakshmi', role: 'Finance', sub_role: 'Auditor', branch: 'Gharuda Infotech', avatar: 'profile-2.jpg' },
    { id: 31, emp_id: 9, name: 'Ravi Shankar', role: 'Developer', sub_role: 'Angular', branch: 'Gharuda IT Park', avatar: 'profile-3.jpg' },
    { id: 32, emp_id: 8, name: 'Pooja Verma', role: 'Marketing', sub_role: 'SEO Specialist', branch: 'Gharuda Infotech', avatar: 'profile-4.jpg' },
    { id: 33, emp_id: 7, name: 'Manikandan R', role: 'Developer', sub_role: 'Flutter', branch: 'Gharuda Infotech', avatar: 'profile-1.jpg' },
    { id: 34, emp_id: 6, name: 'Sunitha Devi', role: 'HR', sub_role: 'Training', branch: 'Gharuda Infotech', avatar: 'profile-2.jpg' },
    { id: 35, emp_id: 5, name: 'Balaji Venkat', role: 'Developer', sub_role: 'C++', branch: 'Gharuda IT Park', avatar: 'profile-3.jpg' },
    { id: 36, emp_id: 4, name: 'Aparna Rajan', role: 'Designer', sub_role: 'Product Design', branch: 'Gharuda Infotech', avatar: 'profile-4.jpg' },
    { id: 37, emp_id: 3, name: 'Gokul Krishna', role: 'Developer', sub_role: 'Spring Boot', branch: 'Gharuda IT Park', avatar: 'profile-1.jpg' },
    { id: 38, emp_id: 2, name: 'Nandhini K', role: 'Finance', sub_role: 'Billing', branch: 'Gharuda Infotech', avatar: 'profile-2.jpg' },
  ];

  // -------------------------------------------------------------
  // Dynamic Dates & Punch Data
  // -------------------------------------------------------------
  dateHeaders: DateHeader[] = [];
  punchData: { [empId: number]: { [dateKey: string]: PunchItem[] } } = {};

  // Table View & Pagination
  filteredEmployees: EmployeePunchRow[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  readonly pageSizeOptions: number[] = [10, 25, 50, 100];
  exportDropdownOpen: boolean = false;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredEmployees.length / this.pageSize));
  }

  get paginatedEmployees(): EmployeePunchRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  get startIndex(): number {
    return this.filteredEmployees.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredEmployees.length);
  }

  // -------------------------------------------------------------
  // Attendance Log Offcanvas State
  // -------------------------------------------------------------
  offcanvasOpen: boolean = false;
  selectedEmp: EmployeePunchRow | null = null;
  selectedDateStr: string = '';
  selectedDateHeader: DateHeader | null = null;
  selectedStatusBadge: StatusBadge = { cls: 'full-day', text: 'Full Day', icon: 'bi-check-circle-fill' };
  selectedDayHoursLogged: string = '';
  timelinePunches: TimelinePunchDisplay[] = [];
  activeActionDropdownIndex: number | null = null;

  // Accordion Toggles inside Offcanvas
  quickActionsOpen: boolean = true;
  insightOpen: boolean = true;

  // Insight Metrics for Selected Employee
  insightWorkingDays: number = 0;
  insightTotalPunches: number = 0;
  insightTotalHours: string = '0h 0m';

  // -------------------------------------------------------------
  // Add / Edit Punch Modal State
  // -------------------------------------------------------------
  addPunchModalOpen: boolean = false;
  isEditMode: boolean = false;
  editPunchIndex: number = -1;
  punchType: 'in' | 'out' = 'in';
  punchTimeInput: string = '09:00 AM';

  readonly inPresetTimes = ['09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM', '10:00 AM', '10:30 AM', '11:00 AM', '01:00 PM'];
  readonly outPresetTimes = ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '09:00 PM'];

  isSavingPunch: boolean = false;

  // Toast
  showToast: boolean = false;
  toastMessage: string = '';
  private toastTimer: any;

  ngOnInit(): void {
    this.buildDateHeaders();
    this.generateAllPunchData();
    this.applyFilters();
  }

  // -------------------------------------------------------------
  // Date Helpers
  // -------------------------------------------------------------
  private buildDateHeaders(): void {
    const list: DateHeader[] = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let day = 1; day <= 31; day++) {
      const dt = new Date(2026, 7, day); // Month is 7 for August (0-indexed)
      const dateKey = `2026-08-${String(day).padStart(2, '0')}`;
      list.push({
        key: dateKey,
        date: `${day}-08-2026`,
        full: `${day} ${monthNames[dt.getMonth()]} 2026`,
        day: dayNames[dt.getDay()],
        shortDay: shortDayNames[dt.getDay()],
      });
    }
    this.dateHeaders = list;
  }

  private getDateHeader(dateKey: string): DateHeader {
    const found = this.dateHeaders.find((d) => d.key === dateKey);
    if (found) return found;
    return {
      key: dateKey,
      date: dateKey,
      full: dateKey,
      day: '',
      shortDay: '',
    };
  }

  // -------------------------------------------------------------
  // Punch Data Generation (Matching PHP logic & overrides)
  // -------------------------------------------------------------
  private generateAllPunchData(): void {
    let seed = 42;
    const srand = () => {
      seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    const randInt = (a: number, b: number) => a + Math.floor(srand() * (b - a + 1));
    const randTime = (h1: number, m1: number, h2: number, m2: number) => {
      const h = randInt(h1, h2);
      const m = h === h1 && h === h2 ? randInt(m1, m2) : randInt(0, 59);
      const sfx = h >= 12 ? 'PM' : 'AM';
      let h12 = h % 12;
      if (h12 === 0) h12 = 12;
      return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${sfx}`;
    };

    const data: { [empId: number]: { [dateKey: string]: PunchItem[] } } = {};

    this.allEmployees.forEach((emp) => {
      const ps: { [dateKey: string]: PunchItem[] } = {};
      for (let day = 1; day <= 31; day++) {
        const dt = new Date(2026, 7, day);
        const key = `2026-08-${String(day).padStart(2, '0')}`;
        const dow = dt.getDay();

        if (dow === 0) {
          ps[key] = [];
          continue;
        }
        if (dow === 6 && emp.id % 3 === 0) {
          ps[key] = [];
          continue;
        }

        let shift = 'general';
        const sr = emp.sub_role.toLowerCase();
        if (
          sr.includes('marketing') ||
          sr.includes('content') ||
          sr.includes('graphic') ||
          sr.includes('seo') ||
          sr.includes('social') ||
          sr.includes('motion') ||
          sr.includes('brand')
        ) {
          shift = 'morning';
        } else if (
          sr.includes('devops') ||
          sr.includes('ml') ||
          sr.includes('cloud') ||
          sr.includes('angular') ||
          sr.includes('node') ||
          sr.includes('go') ||
          sr.includes('rust') ||
          sr.includes('ios') ||
          sr.includes('typescript') ||
          sr.includes('python') ||
          emp.branch === 'Gharuda IT Park'
        ) {
          shift = 'evening';
        }

        if (randInt(1, 100) <= 10) {
          ps[key] = [];
          continue;
        }

        const arr: PunchItem[] = [];
        if (shift === 'morning') {
          arr.push({ time: randTime(5, 50, 6, 20) });
          arr.push({ time: randTime(13, 45, 14, 15) });
          if (randInt(1, 100) <= 5) {
            arr.splice(1, 0, { time: randTime(10, 0, 12, 0), warn: true });
          }
        } else if (shift === 'evening') {
          arr.push({ time: randTime(13, 45, 14, 15) });
          arr.push({ time: randTime(21, 45, 22, 15) });
          if (randInt(1, 100) <= 5) {
            arr.splice(1, 0, { time: randTime(17, 0, 19, 0), warn: true });
          }
        } else {
          arr.push({ time: randTime(9, 15, 9, 45) });
          arr.push({ time: randTime(18, 15, 18, 45) });
          if (randInt(1, 100) <= 8) {
            arr.splice(1, 0, { time: randTime(12, 30, 13, 0) });
            arr.splice(2, 0, { time: randTime(13, 15, 13, 45) });
          }
          if (randInt(1, 100) <= 4) {
            arr.splice(1, 0, { time: randTime(15, 0, 17, 0), warn: true });
          }
        }
        ps[key] = arr;
      }
      data[emp.id] = ps;
    });

    // Exact Overrides from PHP source for employees 1–3
    data[1] = {};
    '2026-08-01 01:05PM 01:32PM 07:08PM|2026-08-03 01:02PM 01:35PM 07:10PM|2026-08-04 01:08PM 01:30PM 07:05PM|2026-08-05 01:00PM 01:38PM 07:12PM|2026-08-06 01:10PM 01:33PM 07:08PM|2026-08-07 01:06PM 01:36PM 07:15PM|2026-08-08 01:03PM 01:31PM 07:09PM|2026-08-10 01:07PM 01:34PM 07:11PM|2026-08-11 01:01PM 01:37PM 07:06PM|2026-08-12 01:09PM 01:32PM 07:13PM|2026-08-13 01:04PM 01:35PM 07:07PM|2026-08-14 01:06PM 01:30PM 07:10PM|2026-08-17 01:03PM 01:36PM 07:12PM|2026-08-18 01:08PM 01:31PM 07:09PM|2026-08-19 01:05PM 01:33PM 07:08PM|2026-08-20 07:05PM 07:12PM|2026-08-21 01:04PM 01:35PM 07:08PM|2026-08-24 01:02PM 01:39PM 07:08PM|2026-08-25 01:05PM 01:39PM 07:10PM|2026-08-26 01:05PM 01:33PM 07:12PM|2026-08-27 01:04PM 01:37PM 07:13PM|2026-08-28 01:06PM 01:32PM 07:11PM|2026-08-29 01:03PM 01:34PM 07:09PM|2026-08-31 01:07PM 01:30PM 07:14PM'
      .split('|')
      .forEach((s) => {
        const p = s.split(' ');
        const k = p[0];
        const a: PunchItem[] = [];
        for (let i = 1; i < p.length; i++) a.push({ time: p[i] });
        data[1][k] = a;
      });

    data[2] = {};
    '2026-08-01 09:55AM 07:02PM|2026-08-03 09:48AM 07:05PM|2026-08-04 09:52AM 07:08PM|2026-08-05 09:50AM 07:00PM|2026-08-06 09:58AM 07:03PM|2026-08-07 09:45AM 07:10PM|2026-08-08 09:53AM 07:06PM|2026-08-10 09:51AM 07:04PM|2026-08-11 09:47AM 07:09PM|2026-08-12 09:56AM 07:01PM|2026-08-13 09:49AM 07:07PM|2026-08-14 09:54AM 07:05PM|2026-08-17 09:50AM 07:08PM|2026-08-18 09:46AM 07:02PM|2026-08-19 09:52AM 07:06PM|2026-08-20 07:02PM 07:12PM|2026-08-21 09:50AM 07:09PM|2026-08-24 09:53AM 07:08PM|2026-08-25 09:54AM 01:05PM 01:29PM 07:20PM|2026-08-26 09:50AM 01:07PM 01:36PM 07:33PM|2026-08-28 09:51AM 07:05PM|2026-08-29 09:48AM 07:03PM|2026-08-31 09:55AM 07:07PM'
      .split('|')
      .forEach((s) => {
        const p = s.split(' ');
        const k = p[0];
        const a: PunchItem[] = [];
        for (let i = 1; i < p.length; i++) a.push({ time: p[i] });
        data[2][k] = a;
      });

    data[3] = {};
    '2026-08-01 10:05AM 06:50PM|2026-08-03 10:02AM 06:55PM|2026-08-04 09:58AM 06:48PM|2026-08-05 10:08AM 06:52PM|2026-08-06 10:00AM 06:45PM|2026-08-07 09:55AM 06:58PM|2026-08-08 10:03AM 06:50PM|2026-08-10 10:01AM 06:53PM|2026-08-11 09:57AM 06:47PM|2026-08-12 10:06AM 06:55PM|2026-08-13 09:59AM 06:50PM|2026-08-14 10:04AM 06:52PM|2026-08-17 10:00AM 06:48PM|2026-08-18 09:56AM 06:55PM|2026-08-19 10:02AM 06:50PM|2026-08-20 09:52AM 03:53PM* 07:06PM|2026-08-21 10:01AM 10:03AM|2026-08-22 11:05AM 04:16PM|2026-08-24 10:03AM 06:56PM|2026-08-25 10:26AM 06:47PM|2026-08-26 10:05AM 06:55PM|2026-08-27 10:06AM 01:42PM|2026-08-28 10:00AM 06:50PM|2026-08-29 09:58AM 06:53PM|2026-08-31 10:04AM 06:48PM'
      .split('|')
      .forEach((s) => {
        const p = s.split(' ');
        const k = p[0];
        const a: PunchItem[] = [];
        for (let i = 1; i < p.length; i++) {
          if (p[i].includes('*')) a.push({ time: p[i].replace('*', ''), warn: true });
          else a.push({ time: p[i] });
        }
        data[3][k] = a;
      });

    this.punchData = data;
  }

  // -------------------------------------------------------------
  // Table Punch Getter
  // -------------------------------------------------------------
  getPunchesFor(empId: number, dateKey: string): PunchItem[] {
    return (this.punchData[empId] && this.punchData[empId][dateKey]) || [];
  }

  // -------------------------------------------------------------
  // Filter & Search Operations
  // -------------------------------------------------------------
  applyFilters(): void {
    let result = [...this.allEmployees];

    if (this.activeBranchFilter) {
      result = result.filter((e) => e.branch === this.activeBranchFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          String(e.emp_id).toLowerCase().includes(q) ||
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.sub_role.toLowerCase().includes(q) ||
          e.branch.toLowerCase().includes(q)
      );
    }

    this.filteredEmployees = result;
    this.currentPage = 1;
  }

  onSearchBtnClick(): void {
    this.activeBranchFilter = this.selectedBranch;
    this.applyFilters();
  }

  clearBranchFilter(): void {
    this.selectedBranch = '';
    this.activeBranchFilter = '';
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.selectedBranch = '';
    this.activeBranchFilter = '';
    this.searchQuery = '';
    this.applyFilters();
  }

  // -------------------------------------------------------------
  // Pagination Methods
  // -------------------------------------------------------------
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  // -------------------------------------------------------------
  // Attendance Log Offcanvas Handling
  // -------------------------------------------------------------
  openAttendanceLog(emp: EmployeePunchRow, dateKey: string): void {
    this.selectedEmp = emp;
    this.selectedDateStr = dateKey;
    this.selectedDateHeader = this.getDateHeader(dateKey);
    this.activeActionDropdownIndex = null;

    this.refreshOffcanvasCalculations();
    this.offcanvasOpen = true;
  }

  closeOffcanvas(): void {
    this.offcanvasOpen = false;
    this.activeActionDropdownIndex = null;
  }

  private refreshOffcanvasCalculations(): void {
    if (!this.selectedEmp || !this.selectedDateStr) return;
    const empId = this.selectedEmp.id;
    const dateStr = this.selectedDateStr;
    const ps = this.getPunchesFor(empId, dateStr);

    // Compute status badge
    this.selectedStatusBadge = this.computeStatusBadge(empId, dateStr, ps);

    // Compute day total hours (paired punches)
    let dayMin = 0;
    for (let k = 0; k + 1 < ps.length; k += 2) {
      const diff = this.parseMinutes(ps[k + 1].time) - this.parseMinutes(ps[k].time);
      dayMin += diff < 0 ? diff + 1440 : diff;
    }
    const dayH = Math.floor(dayMin / 60);
    const dayM = dayMin % 60;
    this.selectedDayHoursLogged = dayMin > 0 ? `${dayH}h ${dayM}m` : '';

    // Build timeline punch list with break intervals
    const timeline: TimelinePunchDisplay[] = [];
    for (let i = 0; i < ps.length; i++) {
      const isIn = i % 2 === 0;
      let breakAfter: string | null = null;
      if (!isIn && i + 1 < ps.length) {
        breakAfter = this.computeBreakTime(ps[i].time, ps[i + 1].time);
      }
      timeline.push({
        index: i,
        time: ps[i].time,
        timeDisplay: ps[i].time.replace(/\s+/, ''),
        isIn,
        warn: ps[i].warn,
        breakAfter,
      });
    }
    this.timelinePunches = timeline;

    // Monthly insight computation
    let totalDays = 0;
    let totalPunches = 0;
    let totalMin = 0;
    this.dateHeaders.forEach((d) => {
      const dayPs = this.getPunchesFor(empId, d.key);
      if (dayPs.length > 0) totalDays++;
      totalPunches += dayPs.length;
      for (let i = 0; i + 1 < dayPs.length; i += 2) {
        let diff = this.parseMinutes(dayPs[i + 1].time) - this.parseMinutes(dayPs[i].time);
        if (diff < 0) diff += 1440;
        totalMin += diff;
      }
    });
    this.insightWorkingDays = totalDays;
    this.insightTotalPunches = totalPunches;
    this.insightTotalHours = `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`;
  }

  private computeStatusBadge(empId: number, dateStr: string, ps: PunchItem[]): StatusBadge {
    const dt = new Date(`${dateStr}T00:00:00`);
    const dow = dt.getDay();
    if (dow === 0 || (dow === 6 && empId % 3 === 0)) {
      return { cls: 'weekoff', text: 'Week Off', icon: 'bi-moon-stars-fill' };
    }
    if (ps.length === 0) {
      return { cls: 'absent', text: 'Absent', icon: 'bi-x-circle-fill' };
    }
    if (ps.length === 2) {
      let diff = this.parseMinutes(ps[1].time) - this.parseMinutes(ps[0].time);
      if (diff < 0) diff += 1440;
      if (diff < 360) {
        return { cls: 'half-day', text: 'Half Day', icon: 'bi-hourglass-split' };
      }
    }
    return { cls: 'full-day', text: 'Full Day', icon: 'bi-check-circle-fill' };
  }

  private parseMinutes(t: string): number {
    const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!m) return 0;
    let h = parseInt(m[1], 10);
    const mn = parseInt(m[2], 10);
    const ap = m[3].toUpperCase();
    if (ap === 'PM' && h !== 12) h += 12;
    if (ap === 'AM' && h === 12) h = 0;
    return h * 60 + mn;
  }

  private computeBreakTime(outTime: string, inTime: string): string | null {
    const o = this.parseMinutes(outTime);
    const i = this.parseMinutes(inTime);
    let diff = i - o;
    if (diff < 0) diff += 1440;
    const bh = Math.floor(diff / 60);
    const bm = diff % 60;
    return `${String(bh).padStart(2, '0')}h ${String(bm).padStart(2, '0')}m`;
  }

  // -------------------------------------------------------------
  // Quick Actions Handlers
  // -------------------------------------------------------------
  executeQuickAction(actionName: string): void {
    if (!this.selectedEmp || !this.selectedDateStr) return;
    const empId = this.selectedEmp.id;
    const dateStr = this.selectedDateStr;

    if (!this.punchData[empId]) this.punchData[empId] = {};

    switch (actionName) {
      case 'Full Day':
        this.punchData[empId][dateStr] = [{ time: '09:00 AM' }, { time: '06:00 PM' }];
        this.triggerToast(`Marked Full Day for ${this.selectedEmp.name}`);
        break;
      case 'Half Day':
        this.punchData[empId][dateStr] = [{ time: '09:00 AM' }, { time: '01:30 PM' }];
        this.triggerToast(`Marked Half Day for ${this.selectedEmp.name}`);
        break;
      case 'Absent':
        this.punchData[empId][dateStr] = [];
        this.triggerToast(`Marked Absent for ${this.selectedEmp.name}`);
        break;
      case 'Week Off':
        this.punchData[empId][dateStr] = [];
        this.triggerToast(`Marked Week Off for ${this.selectedEmp.name}`);
        break;
      case 'Paid Leave':
        this.punchData[empId][dateStr] = [];
        this.triggerToast(`Converted to Paid Leave for ${this.selectedEmp.name}`);
        break;
      default:
        this.triggerToast(`Action '${actionName}' executed successfully`);
        break;
    }

    this.refreshOffcanvasCalculations();
  }

  // -------------------------------------------------------------
  // Add / Edit Punch Modal Handlers
  // -------------------------------------------------------------
  openAddPunchModal(): void {
    this.isEditMode = false;
    this.editPunchIndex = -1;
    this.punchType = 'in';
    this.punchTimeInput = '09:00 AM';
    this.activeActionDropdownIndex = null;
    this.addPunchModalOpen = true;
  }

  openEditPunchModal(index: number): void {
    if (!this.selectedEmp || !this.selectedDateStr) return;
    const ps = this.getPunchesFor(this.selectedEmp.id, this.selectedDateStr);
    const punch = ps[index];
    if (!punch) return;

    this.isEditMode = true;
    this.editPunchIndex = index;
    this.punchType = index % 2 === 0 ? 'in' : 'out';
    this.punchTimeInput = punch.time;
    this.activeActionDropdownIndex = null;
    this.addPunchModalOpen = true;
  }

  closeAddPunchModal(): void {
    this.addPunchModalOpen = false;
    this.isSavingPunch = false;
    this.isEditMode = false;
    this.editPunchIndex = -1;
  }

  setPresetTime(time: string): void {
    this.punchTimeInput = time;
  }

  savePunch(): void {
    if (!this.selectedEmp || !this.selectedDateStr || !this.punchTimeInput.trim()) return;
    const empId = this.selectedEmp.id;
    const dateStr = this.selectedDateStr;

    if (!this.punchData[empId]) this.punchData[empId] = {};
    if (!this.punchData[empId][dateStr]) this.punchData[empId][dateStr] = [];

    const ps = this.punchData[empId][dateStr];
    const displayTime = this.punchTimeInput.trim();

    this.isSavingPunch = true;

    setTimeout(() => {
      if (this.isEditMode && this.editPunchIndex >= 0 && this.editPunchIndex < ps.length) {
        ps[this.editPunchIndex].time = displayTime;
      } else {
        if (this.punchType === 'in') {
          ps.unshift({ time: displayTime });
        } else {
          ps.push({ time: displayTime });
        }
      }

      this.isSavingPunch = false;
      this.closeAddPunchModal();
      this.refreshOffcanvasCalculations();
      this.triggerToast(this.isEditMode ? 'Punch updated successfully' : 'New punch added successfully');
    }, 600);
  }

  deletePunch(index: number): void {
    if (!this.selectedEmp || !this.selectedDateStr) return;
    const empId = this.selectedEmp.id;
    const dateStr = this.selectedDateStr;
    const ps = this.getPunchesFor(empId, dateStr);

    if (index >= 0 && index < ps.length) {
      ps.splice(index, 1);
      this.activeActionDropdownIndex = null;
      this.refreshOffcanvasCalculations();
      this.triggerToast('Punch record deleted');
    }
  }

  toggleActionDropdown(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.activeActionDropdownIndex = this.activeActionDropdownIndex === index ? null : index;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.activeActionDropdownIndex = null;
    this.exportDropdownOpen = false;
  }

  // -------------------------------------------------------------
  // Toast & Export Actions
  // -------------------------------------------------------------
  triggerToast(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.showToast = false;
    }, 2800);
  }

  exportCSV(): void {
    this.exportDropdownOpen = false;
    this.triggerToast('Exporting Daily Punch Report to CSV...');
  }

  exportExcel(): void {
    this.exportDropdownOpen = false;
    this.triggerToast('Exporting Daily Punch Report to Excel...');
  }

  exportPDF(): void {
    this.exportDropdownOpen = false;
    this.triggerToast('Exporting Daily Punch Report to PDF...');
  }

  printTable(): void {
    this.exportDropdownOpen = false;
    window.print();
  }
}
