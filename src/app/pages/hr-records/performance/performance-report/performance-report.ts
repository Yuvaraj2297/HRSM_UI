import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerformanceDepartmentReport } from './performance-dept/performance-dept';

interface Evaluation {
  year: string;
  cycle: string;
  dept: string;
  desig: string;
  mgr: string;
  emp: string;
  kpi: number;
  self: number;
  mgrRating: number;
  final: number;
  status: string;
}

interface HistoryRow {
  cycle: string;
  kpi: string;
  kpiBadge: string;
  self: string;
  mgr: string;
  final: string;
  chip: string;
}

interface EmpHistory {
  role: string;
  dept: string;
  avatar: string;
  badgeText: string;
  rows: HistoryRow[];
}

interface DeptSummary {
  name: string;
  icon: string;
  iconClass: string;
  iconStyle: string;
  desc: string;
  headcount: number;
  avgRating: string;
  avgRatingChip: string;
  kpiAchievement: string;
  completion: string;
  completionClass: string;
}

interface RatingLevel {
  key: 'r5' | 'r4' | 'r3' | 'r2' | 'r1';
  label: string;
  badgeClass: string;
  barClass: string;
  textClass: string;
  count: number;
  pct: number;
}

interface Filters {
  year: string;
  cycle: string;
  dept: string;
  desig: string;
  mgr: string;
  emp: string;
}

@Component({
  selector: 'app-performance-report',
  imports: [CommonModule, FormsModule, PerformanceDepartmentReport],
  templateUrl: './performance-report.html',
  styleUrl: './performance-report.scss',
})
export class PerformanceReport implements OnInit {

  // ---------- Department drill-down (embedded, no routing required) ----------
  showDeptReport = false;
  deptReportDept = 'Engineering';

  // ---------- Filter panel options ----------
  years = [
    { value: 'all', label: 'All Years' },
    { value: '2026', label: '2026 (FY25-26)' },
    { value: '2025', label: '2025 (FY24-25)' },
    { value: '2024', label: '2024 (FY23-24)' },
  ];
  cycles = [
    { value: 'all', label: 'All Cycles' },
    { value: 'annual', label: 'FY25-26 Annual 360° Review' },
    { value: 'q1', label: 'Q1 Leadership Check-in' },
    { value: 'probation', label: 'Probationary 360 Evaluation' },
  ];
  departments = ['Engineering', 'UI/UX Design', 'Infrastructure', 'Quality Assurance', 'Human Resources'];
  designations = ['Software Engineer', 'Design Lead', 'DevOps Lead', 'QA Engineer'];
  managers = [
    { value: 'Rajesh Sharma', label: 'Rajesh Sharma (Eng Director)' },
    { value: 'Karthik Raja', label: 'Karthik Raja (TL)' },
    { value: 'Divya Ramesh', label: 'Divya Ramesh (HR Admin)' },
  ];
  employees = ['Arun Kumar', 'Amelia Curr', 'Sanjay V', 'Daniel Martinez', 'Priya Sharma'];

  filters: Filters = {
    year: '2026',
    cycle: 'all',
    dept: 'all',
    desig: 'all',
    mgr: 'all',
    emp: 'all',
  };

  // ---------- KPI cards (initial values match the HR-approved snapshot) ----------
  kpi = {
    totalEmp: 120,
    completed: 108,
    completedPct: 90,
    pending: 12,
    pendingPct: 10,
    avgRating: '3.8',
    avgKpi: 84,
  };

  // ---------- Rating distribution ----------
  ratingDistCount = '108 Approved Reviews';

  ratingLevels: RatingLevel[] = [
    { key: 'r5', label: 'Rating 5 (Outstanding)', badgeClass: 'bg-success-subtle text-success border-success-subtle', barClass: 'bg-success', textClass: 'text-success', count: 12, pct: 10 },
    { key: 'r4', label: 'Rating 4 (Exceeds)', badgeClass: 'bg-info-subtle text-info border-info-subtle', barClass: 'bg-info', textClass: 'text-info', count: 42, pct: 35 },
    { key: 'r3', label: 'Rating 3 (Meets Expectations)', badgeClass: 'bg-primary-subtle text-primary border-primary-subtle', barClass: 'bg-primary', textClass: 'text-primary', count: 48, pct: 40 },
    { key: 'r2', label: 'Rating 2 (Needs Improvement)', badgeClass: 'bg-warning-subtle text-dark border-warning', barClass: 'bg-warning', textClass: 'text-warning', count: 14, pct: 12 },
    { key: 'r1', label: 'Rating 1 (Unsatisfactory)', badgeClass: 'bg-danger-subtle text-danger border-danger-subtle', barClass: 'bg-danger', textClass: 'text-danger', count: 4, pct: 3 },
  ];

  // ---------- Department performance breakdown (static, matches source page) ----------
  deptSummary: DeptSummary[] = [
    { name: 'Engineering', icon: 'bi-code-slash', iconClass: 'text-primary', iconStyle: '', desc: 'Core Software & Systems', headcount: 120, avgRating: '3.8 / 5.0', avgRatingChip: 'score-chip-good', kpiAchievement: '84%', completion: '92%', completionClass: 'success' },
    { name: 'UI/UX Design', icon: 'bi-palette', iconClass: '', iconStyle: 'color:var(--purple-600);', desc: 'Product Experience', headcount: 35, avgRating: '4.2 / 5.0', avgRatingChip: 'score-chip-high', kpiAchievement: '88%', completion: '100%', completionClass: 'success' },
    { name: 'Infrastructure', icon: 'bi-hdd-network', iconClass: 'text-info', iconStyle: '', desc: 'Cloud & DevOps Operations', headcount: 28, avgRating: '4.0 / 5.0', avgRatingChip: 'score-chip-high', kpiAchievement: '86%', completion: '95%', completionClass: 'success' },
    { name: 'Quality Assurance', icon: 'bi-bug', iconClass: 'text-warning', iconStyle: '', desc: 'Testing & Automation', headcount: 22, avgRating: '3.6 / 5.0', avgRatingChip: 'score-chip-active', kpiAchievement: '79%', completion: '88%', completionClass: 'info' },
    { name: 'Human Resources', icon: 'bi-people', iconClass: 'text-danger', iconStyle: '', desc: 'People Operations', headcount: 15, avgRating: '4.5 / 5.0', avgRatingChip: 'score-chip-high', kpiAchievement: '92%', completion: '100%', completionClass: 'success' },
  ];

  // ---------- Employee performance history ----------
  selectedEmployee = 'Arun Kumar';

  empHistoryData: Record<string, EmpHistory> = {
    'Arun Kumar': {
      role: 'Senior Software Engineer',
      dept: 'Engineering',
      avatar: './assets/img/profile-1.jpg',
      badgeText: '<strong>Top Performer Trajectory:</strong> Consistent year-on-year rating improvement of <strong>+1.0</strong> over 3 cycles.',
      rows: [
        { cycle: 'FY25-26 Annual 360° Review (2026)', kpi: '92%', kpiBadge: '+6%', self: '4.2', mgr: '4.5', final: '4.5 / 5.0', chip: 'score-chip-high' },
        { cycle: 'FY24-25 Annual Review (2025)', kpi: '86%', kpiBadge: '+8%', self: '4.0', mgr: '4.0', final: '4.0 / 5.0', chip: 'score-chip-good' },
        { cycle: 'FY23-24 Annual Review (2024)', kpi: '78%', kpiBadge: '', self: '3.5', mgr: '3.5', final: '3.5 / 5.0', chip: 'score-chip-good' },
      ],
    },
    'Amelia Curr': {
      role: 'Design Lead',
      dept: 'UI/UX Design',
      avatar: './assets/img/profile-1.jpg',
      badgeText: '<strong>Outstanding Design Leadership:</strong> Achieved 96% KPI completion rate & 4.8 final HR approved rating.',
      rows: [
        { cycle: 'FY25-26 Annual 360° Review (2026)', kpi: '96%', kpiBadge: '+6%', self: '4.9', mgr: '4.8', final: '4.8 / 5.0', chip: 'score-chip-high' },
        { cycle: 'FY24-25 Annual Review (2025)', kpi: '90%', kpiBadge: '+6%', self: '4.5', mgr: '4.5', final: '4.5 / 5.0', chip: 'score-chip-high' },
        { cycle: 'FY23-24 Annual Review (2024)', kpi: '84%', kpiBadge: '', self: '4.2', mgr: '4.2', final: '4.2 / 5.0', chip: 'score-chip-good' },
      ],
    },
    'Sanjay V': {
      role: 'Associate Software Engineer',
      dept: 'Engineering',
      avatar: './assets/img/profile-1.jpg',
      badgeText: '<strong>Rapid Career Progression:</strong> Promoted from Associate to Software Engineer in 2 years with 4.5 rating.',
      rows: [
        { cycle: 'FY25-26 Probation Review (2026)', kpi: '88%', kpiBadge: '+8%', self: '4.6', mgr: '4.4', final: '4.5 / 5.0', chip: 'score-chip-high' },
        { cycle: 'FY24-25 Annual Review (2025)', kpi: '80%', kpiBadge: '+5%', self: '4.0', mgr: '4.0', final: '4.0 / 5.0', chip: 'score-chip-good' },
        { cycle: 'FY23-24 Intern Review (2024)', kpi: '75%', kpiBadge: '', self: '3.8', mgr: '3.8', final: '3.8 / 5.0', chip: 'score-chip-good' },
      ],
    },
    'Daniel Martinez': {
      role: 'DevOps & Cloud Lead',
      dept: 'Infrastructure',
      avatar: './assets/img/profile-2.jpg',
      badgeText: '<strong>High Infrastructure Reliability:</strong> 99.99% uptime achieved across multi-cloud infrastructure.',
      rows: [
        { cycle: 'FY25-26 Leadership Check-in (2026)', kpi: '94%', kpiBadge: '+6%', self: '4.8', mgr: '4.7', final: '4.65 / 5.0', chip: 'score-chip-active' },
        { cycle: 'FY24-25 Annual Review (2025)', kpi: '88%', kpiBadge: '+6%', self: '4.4', mgr: '4.3', final: '4.3 / 5.0', chip: 'score-chip-good' },
        { cycle: 'FY23-24 Annual Review (2024)', kpi: '82%', kpiBadge: '', self: '4.0', mgr: '4.0', final: '4.0 / 5.0', chip: 'score-chip-good' },
      ],
    },
    'Priya Sharma': {
      role: 'Frontend Developer',
      dept: 'UI/UX Design',
      avatar: './assets/img/profile-3.jpg',
      badgeText: '<strong>Consistent Skill Expansion:</strong> Mastered React.js & automated Cypress end-to-end testing.',
      rows: [
        { cycle: 'FY25-26 Annual Review (2026)', kpi: '85%', kpiBadge: '+7%', self: '4.2', mgr: '4.0', final: '4.1 / 5.0', chip: 'score-chip-warning' },
        { cycle: 'FY24-25 Annual Review (2025)', kpi: '78%', kpiBadge: '+6%', self: '3.8', mgr: '3.8', final: '3.8 / 5.0', chip: 'score-chip-good' },
        { cycle: 'FY23-24 Probation Review (2024)', kpi: '72%', kpiBadge: '', self: '3.6', mgr: '3.6', final: '3.6 / 5.0', chip: 'score-chip-good' },
      ],
    },
  };

  // ---------- Toast ----------
  toastMessage = 'Action completed successfully!';
  toastVisible = false;
  private toastTimeout?: ReturnType<typeof setTimeout>;

  // ---------- Master HR-approved evaluation dataset ----------
  masterEvaluations: Evaluation[] = [
    { year: '2026', cycle: 'annual', dept: 'Engineering', desig: 'Software Engineer', mgr: 'Rajesh Sharma', emp: 'Arun Kumar', kpi: 92, self: 4.2, mgrRating: 4.5, final: 4.5, status: 'Approved' },
    { year: '2026', cycle: 'probation', dept: 'Engineering', desig: 'Software Engineer', mgr: 'Karthik Raja', emp: 'Sanjay V', kpi: 88, self: 4.6, mgrRating: 4.4, final: 4.5, status: 'Approved' },
    { year: '2026', cycle: 'annual', dept: 'Engineering', desig: 'Software Engineer', mgr: 'Rajesh Sharma', emp: 'Manoj Kumar', kpi: 75, self: 3.5, mgrRating: 3.8, final: 3.8, status: 'Approved' },
    { year: '2026', cycle: 'annual', dept: 'Engineering', desig: 'Software Engineer', mgr: 'Rajesh Sharma', emp: 'Vikram Sethi', kpi: 95, self: 4.8, mgrRating: 4.8, final: 4.8, status: 'Approved' },
    { year: '2026', cycle: 'q1', dept: 'Engineering', desig: 'Software Engineer', mgr: 'Rajesh Sharma', emp: 'Deepa N', kpi: 84, self: 4.0, mgrRating: 4.1, final: 4.1, status: 'Approved' },
    { year: '2026', cycle: 'annual', dept: 'UI/UX Design', desig: 'Design Lead', mgr: 'Rajesh Sharma', emp: 'Amelia Curr', kpi: 96, self: 4.9, mgrRating: 4.8, final: 4.8, status: 'Approved' },
    { year: '2026', cycle: 'annual', dept: 'UI/UX Design', desig: 'Design Lead', mgr: 'Amelia Curr', emp: 'Priya Sharma', kpi: 85, self: 4.2, mgrRating: 4.0, final: 4.1, status: 'Approved' },
    { year: '2026', cycle: 'q1', dept: 'UI/UX Design', desig: 'Design Lead', mgr: 'Amelia Curr', emp: 'Rohan Mehra', kpi: 90, self: 4.2, mgrRating: 4.3, final: 4.3, status: 'Approved' },
    { year: '2026', cycle: 'q1', dept: 'Infrastructure', desig: 'DevOps Lead', mgr: 'Rajesh Sharma', emp: 'Daniel Martinez', kpi: 94, self: 4.8, mgrRating: 4.7, final: 4.65, status: 'Approved' },
    { year: '2026', cycle: 'annual', dept: 'Infrastructure', desig: 'DevOps Lead', mgr: 'Daniel Martinez', emp: 'Karthik Raja', kpi: 89, self: 4.2, mgrRating: 4.4, final: 4.4, status: 'Approved' },
    { year: '2026', cycle: 'annual', dept: 'Quality Assurance', desig: 'QA Engineer', mgr: 'Karthik Raja', emp: 'Swati P', kpi: 82, self: 3.8, mgrRating: 3.9, final: 3.9, status: 'Approved' },
    { year: '2026', cycle: 'probation', dept: 'Quality Assurance', desig: 'QA Engineer', mgr: 'Karthik Raja', emp: 'Anand K', kpi: 78, self: 3.5, mgrRating: 3.6, final: 3.6, status: 'Approved' },
    { year: '2026', cycle: 'annual', dept: 'Human Resources', desig: 'Design Lead', mgr: 'Divya Ramesh', emp: 'Divya Ramesh', kpi: 95, self: 4.9, mgrRating: 4.9, final: 4.9, status: 'Approved' },
    { year: '2026', cycle: 'annual', dept: 'Human Resources', desig: 'Design Lead', mgr: 'Divya Ramesh', emp: 'Kavitha M', kpi: 90, self: 4.4, mgrRating: 4.5, final: 4.5, status: 'Approved' },
    { year: '2025', cycle: 'annual', dept: 'Engineering', desig: 'Software Engineer', mgr: 'Rajesh Sharma', emp: 'Arun Kumar', kpi: 86, self: 4.0, mgrRating: 4.0, final: 4.0, status: 'Approved' },
    { year: '2025', cycle: 'annual', dept: 'UI/UX Design', desig: 'Design Lead', mgr: 'Rajesh Sharma', emp: 'Amelia Curr', kpi: 90, self: 4.5, mgrRating: 4.5, final: 4.5, status: 'Approved' },
    { year: '2025', cycle: 'annual', dept: 'Infrastructure', desig: 'DevOps Lead', mgr: 'Rajesh Sharma', emp: 'Daniel Martinez', kpi: 88, self: 4.4, mgrRating: 4.3, final: 4.3, status: 'Approved' },
    { year: '2024', cycle: 'annual', dept: 'Engineering', desig: 'Software Engineer', mgr: 'Rajesh Sharma', emp: 'Arun Kumar', kpi: 78, self: 3.5, mgrRating: 3.5, final: 3.5, status: 'Approved' },
    { year: '2024', cycle: 'annual', dept: 'UI/UX Design', desig: 'Design Lead', mgr: 'Rajesh Sharma', emp: 'Amelia Curr', kpi: 84, self: 4.2, mgrRating: 4.2, final: 4.2, status: 'Approved' },
  ];

  ngOnInit(): void {
    // Static initial values already mirror the HR-approved snapshot;
    // filters only recompute once the user interacts with the panel.
  }

  // ---------- Computed getters ----------
  get employeeHistory(): EmpHistory {
    return this.empHistoryData[this.selectedEmployee] ?? this.empHistoryData['Arun Kumar'];
  }

  // ---------- Actions ----------
  selectEmployeeHistory(empName: string): void {
    this.selectedEmployee = empName;
  }

  /** Shows the embedded Department Performance Report for the selected department. */
  openDeptDrillDown(deptName: string): void {
    this.deptReportDept = deptName;
    this.showDeptReport = true;
  }

  backToReports(): void {
    this.showDeptReport = false;
  }

  /** Recalculates KPI cards & rating distribution against the active filter set. */
  applyAnalyticsFilters(): void {
    const { year, cycle, dept, desig, mgr, emp } = this.filters;

    let filtered = this.masterEvaluations.filter((item) => {
      if (year !== 'all' && item.year !== year) return false;
      if (cycle !== 'all' && item.cycle !== cycle) return false;
      if (dept !== 'all' && item.dept !== dept) return false;
      if (desig !== 'all' && item.desig !== desig) return false;
      if (mgr !== 'all' && item.mgr !== mgr) return false;
      if (emp !== 'all' && item.emp !== emp) return false;
      return true;
    });

    // Fallback to full master set if an overly strict filter yields nothing
    if (filtered.length === 0) {
      filtered = this.masterEvaluations;
    }

    const totalEmp = filtered.length * 9; // scaling factor to mimic company-wide numbers
    const completed = Math.round(totalEmp * 0.9);
    const pending = totalEmp - completed;

    let sumRating = 0;
    let sumKpi = 0;
    filtered.forEach((item) => {
      sumRating += item.final;
      sumKpi += item.kpi;
    });

    const avgRating = (sumRating / filtered.length).toFixed(1);
    const avgKpi = Math.round(sumKpi / filtered.length);

    this.kpi = { totalEmp, completed, completedPct: 90, pending, pendingPct: 10, avgRating, avgKpi };

    // Rating bell-curve distribution
    let r5 = 0, r4 = 0, r3 = 0, r2 = 0, r1 = 0;
    filtered.forEach((item) => {
      if (item.final >= 4.5) r5++;
      else if (item.final >= 4.0) r4++;
      else if (item.final >= 3.5) r3++;
      else if (item.final >= 3.0) r2++;
      else r1++;
    });

    const totalFiltered = filtered.length;
    const p5 = Math.round((r5 / totalFiltered) * 100);
    const p4 = Math.round((r4 / totalFiltered) * 100);
    const p3 = Math.round((r3 / totalFiltered) * 100);
    const p2 = Math.round((r2 / totalFiltered) * 100);
    const p1 = Math.max(0, 100 - (p5 + p4 + p3 + p2));

    this.ratingDistCount = `${completed} Approved Reviews`;

    const pcts = [p5, p4, p3, p2, p1];
    this.ratingLevels = this.ratingLevels.map((level, i) => ({
      ...level,
      pct: pcts[i],
      count: Math.round(completed * (pcts[i] / 100)),
    }));

    // Sync employee history profile view when a single employee is selected
    if (emp !== 'all') {
      this.selectEmployeeHistory(emp);
    }

    this.showRptToast(
      `📊 Performance Analytics synchronized! Filters active: Dept [${dept.toUpperCase()}] • Cycle [${cycle.toUpperCase()}] • Employee [${emp}]`
    );
  }

  /** Excel (CSV) download or print-based PDF export. */
  exportAnalyticsReport(format: 'PDF' | 'Excel'): void {
    if (format === 'Excel') {
      const headers = ['Year', 'Cycle', 'Department', 'Designation', 'Manager', 'Employee', 'KPI Achievement (%)', 'Self Rating', 'Manager Rating', 'HR Approved Final Rating', 'Status'];
      const rows = this.masterEvaluations.map((e) => [
        e.year,
        e.cycle.toUpperCase(),
        `"${e.dept}"`,
        `"${e.desig}"`,
        `"${e.mgr}"`,
        `"${e.emp}"`,
        `${e.kpi}%`,
        e.self,
        e.mgrRating,
        e.final,
        e.status,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Gharuda_HRMS_Performance_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.showRptToast('📥 Excel Analytics dataset generated & downloaded successfully!');
    } else {
      this.showRptToast('📄 Preparing PDF Analytics print layout...');
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }

  showRptToast(msg: string): void {
    this.toastMessage = msg;
    this.toastVisible = true;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.toastVisible = false;
    }, 3500);
  }
}
