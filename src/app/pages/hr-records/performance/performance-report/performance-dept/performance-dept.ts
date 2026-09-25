import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeDataTable, PrimeTableColumn } from '../../../../../shared/primedatatable/primedatatable';


type WorkflowStage = 'completed' | 'stage3' | 'stage2' | 'stage1';

interface DeptEmployeeRow {
  id: string;
  name: string;
  role: string;
  dept: string;
  cycle: string;
  mgrScore: string;
  tlScore: string;
  hrScore: string;
  overall: string;
  status: string;
  statusClass: WorkflowStage;
  avatar: string;
}

interface DeptStat {
  headcount: number;
  avgRating: string;
  kpiAvg: string;
  topEmp: string;
  topScore: string;
}

@Component({
  selector: 'app-performance-dept',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeDataTable],
  templateUrl: './performance-dept.html',
  styleUrl: './performance-dept.scss',
})
export class PerformanceDepartmentReport implements OnInit {

  /** Department to show first. Set by the parent when embedding this view (no routing needed). */
  @Input() initialDept: string | null = null;

  /** Fired when the user clicks "Back to Reports". Parent decides what that means. */
  @Output() backClicked = new EventEmitter<void>();

  // ---------- Department selector ----------
  departments = [
    'All Departments',
    'Engineering',
    'UI/UX Design',
    'Infrastructure',
    'Quality Assurance',
    'Human Resources',
  ];

  currentDept = 'Engineering';

  // ---------- KPI snapshot per department (mirrors the PHP mock DB) ----------
  departmentDatabase: Record<string, DeptStat> = {
    'All Departments': { headcount: 220, avgRating: '4.4', kpiAvg: '89%', topEmp: 'Amelia Curr', topScore: '4.8 / 5.0 Rating' },
    'Engineering': { headcount: 120, avgRating: '4.3', kpiAvg: '88%', topEmp: 'Vikram Sethi', topScore: '4.8 / 5.0 Rating' },
    'UI/UX Design': { headcount: 35, avgRating: '4.4', kpiAvg: '90%', topEmp: 'Amelia Curr', topScore: '4.8 / 5.0 Rating' },
    'Infrastructure': { headcount: 28, avgRating: '4.5', kpiAvg: '91%', topEmp: 'Daniel Martinez', topScore: '4.65 / 5.0 Rating' },
    'Quality Assurance': { headcount: 22, avgRating: '3.8', kpiAvg: '80%', topEmp: 'Swati P', topScore: '3.9 / 5.0 Rating' },
    'Human Resources': { headcount: 15, avgRating: '4.7', kpiAvg: '93%', topEmp: 'Divya Ramesh', topScore: '4.9 / 5.0 Rating' },
  };

  // ---------- Rating distribution (static spread, matches source page) ----------
  ratingDistribution = [
    { label: 'Rating 5★', pct: 40, barClass: 'bg-success' },
    { label: 'Rating 4★', pct: 40, barClass: 'bg-info' },
    { label: 'Rating 3★', pct: 20, barClass: 'bg-primary' },
  ];

  // ---------- Employee breakdown dataset (mirrors allEmployeesList) ----------
  allEmployees: DeptEmployeeRow[] = [
    { id: 'EMP-101', name: 'Arun Kumar', role: 'Senior Software Engineer', dept: 'Engineering', cycle: 'FY25-26 Annual 360° Review', mgrScore: '4.5', tlScore: '4.2', hrScore: '4.0', overall: '4.1', status: 'Completed', statusClass: 'completed', avatar: './assets/img/profile-1.jpg' },
    { id: 'EMP-201', name: 'Amelia Curr', role: 'Design Lead', dept: 'UI/UX Design', cycle: 'Q1 Leadership Check-in', mgrScore: '4.9', tlScore: '4.8', hrScore: '4.7', overall: '4.8', status: 'Completed', statusClass: 'completed', avatar: 'https://ui-avatars.com/api/?name=Amelia+Curr&background=f3e8ff&color=7e22ce' },
    { id: 'EMP-103', name: 'Sanjay V', role: 'Associate Software Engineer', dept: 'Engineering', cycle: 'Probation 360 Review', mgrScore: '4.6', tlScore: '4.4', hrScore: '4.5', overall: '4.5', status: 'Completed', statusClass: 'completed', avatar: 'https://ui-avatars.com/api/?name=Sanjay+V&background=e2e8f0&color=475569' },
    { id: 'EMP-301', name: 'Daniel Martinez', role: 'DevOps & Cloud Lead', dept: 'Infrastructure', cycle: 'Leadership Check-in', mgrScore: '4.8', tlScore: '4.7', hrScore: '4.5', overall: '4.65', status: 'Stage 3: HR Review', statusClass: 'stage3', avatar: './assets/img/profile-2.jpg' },
    { id: 'EMP-203', name: 'Priya Sharma', role: 'Frontend Developer', dept: 'UI/UX Design', cycle: 'FY25-26 Annual Review', mgrScore: '4.2', tlScore: '4.0', hrScore: '-', overall: '4.1', status: 'Stage 2: TL Review', statusClass: 'stage2', avatar: './assets/img/profile-3.jpg' },
    { id: 'EMP-105', name: 'Manoj Kumar', role: 'Junior Software Engineer', dept: 'Engineering', cycle: 'FY25-26 Annual Review', mgrScore: '-', tlScore: '-', hrScore: '-', overall: 'Pending', status: 'Stage 1: Pending (Manager)', statusClass: 'stage1', avatar: 'https://ui-avatars.com/api/?name=Manoj+Kumar&background=f1f5f9&color=334155' },
    { id: 'EMP-102', name: 'Vikram Sethi', role: 'Lead Architect', dept: 'Engineering', cycle: 'FY25-26 Annual 360° Review', mgrScore: '4.8', tlScore: '4.8', hrScore: '4.8', overall: '4.8', status: 'Completed', statusClass: 'completed', avatar: './assets/img/profile-2.jpg' },
    { id: 'EMP-401', name: 'Swati P', role: 'QA Lead', dept: 'Quality Assurance', cycle: 'FY25-26 Annual Review', mgrScore: '3.9', tlScore: '3.9', hrScore: '3.9', overall: '3.9', status: 'Completed', statusClass: 'completed', avatar: './assets/img/profile-3.jpg' },
    { id: 'EMP-501', name: 'Divya Ramesh', role: 'HR Admin', dept: 'Human Resources', cycle: 'FY25-26 Annual 360° Review', mgrScore: '4.9', tlScore: '4.9', hrScore: '4.9', overall: '4.9', status: 'Completed', statusClass: 'completed', avatar: './assets/img/profile-1.jpg' },
  ];

  // ---------- Table columns (fed into the shared PrimeDataTable) ----------
  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.NO', width: '60px' },
    { field: 'name', header: 'Employee', type: 'employee', subField: 'role', imageField: 'avatar' },
    { field: 'dept', header: 'Department', type: 'badge' },
    { field: 'cycle', header: 'Feedback Cycle' },
    { field: 'mgrScore', header: 'MGR Score', type: 'custom' },
    { field: 'tlScore', header: 'TL Score', type: 'custom' },
    { field: 'hrScore', header: 'HR Score', type: 'custom' },
    { field: 'overall', header: 'Overall 360°', type: 'custom' },
    { field: 'status', header: 'Workflow Status', type: 'custom' },
  ];

  // ---------- Toast ----------
  toastMessage = 'Action completed successfully!';
  toastVisible = false;
  private toastTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.currentDept = this.initialDept && this.departments.includes(this.initialDept)
      ? this.initialDept
      : 'Engineering';
  }

  // ---------- Computed ----------
  get deptStat(): DeptStat {
    return this.departmentDatabase[this.currentDept] ?? this.departmentDatabase['Engineering'];
  }

  get filteredEmployees(): DeptEmployeeRow[] {
    if (this.currentDept === 'All Departments') return this.allEmployees;
    return this.allEmployees.filter((e) => e.dept === this.currentDept);
  }

  get headerTitle(): string {
    return this.currentDept === 'All Departments'
      ? 'All Departments - Performance & Employee Breakdown'
      : `${this.currentDept} - Performance & Employee Breakdown`;
  }

  // ---------- Actions ----------
  onDepartmentChange(deptName: string): void {
    this.currentDept = deptName;
    this.showRptToast(`🏢 Filtered by ${deptName}`);
  }

  onBack(): void {
    this.backClicked.emit();
  }

  scoreClass(value: string): string {
    return value === '-' ? 'text-muted fw-normal' : ' text-success';
  }

  overallStyle(value: string): { background: string; color: string; border: string } {
    if (value === 'Pending') {
      return { background: 'var(--bg-soft)', color: 'var(--neutral-500)', border: '1px solid var(--border)' };
    }
    const num = parseFloat(value);
    if (num >= 4.7) {
      return { background: 'var(--green-50-2)', color: 'var(--primary-dark)', border: '1px solid var(--green-100)' };
    }
    return { background: 'var(--yellow-50-5)', color: 'var(--orange-600)', border: '1px solid var(--yellow-100-2)' };
  }

  statusMeta(statusClass: WorkflowStage, label: string): { icon: string; background: string; text: string } {
    switch (statusClass) {
      case 'completed':
        return { icon: 'bi-check-circle-fill', background: 'var(--green-450)', text: label };
      case 'stage3':
        return { icon: 'bi-lightbulb-fill', background: 'var(--blue-450-2)', text: label };
      case 'stage2':
        return { icon: 'bi-bullseye', background: 'var(--orange-400)', text: label };
      case 'stage1':
        return { icon: 'bi-clock', background: 'var(--neutral-650)', text: label };
      default:
        return { icon: 'bi-dot', background: 'var(--neutral-500)', text: label };
    }
  }

  /** Excel (CSV) download or print-based PDF export, scoped to the active department. */
  exportDeptReport(format: 'PDF' | 'Excel'): void {
    const list = this.filteredEmployees;

    if (format === 'Excel') {
      const headers = ['S.NO', 'Employee Name', 'Role', 'Department', 'Feedback Cycle', 'MGR Score', 'TL Score', 'HR Score', 'Overall 360', 'Workflow Status'];
      const rows = list.map((e, idx) => [
        idx + 1,
        `"${e.name}"`,
        `"${e.role}"`,
        `"${e.dept}"`,
        `"${e.cycle}"`,
        e.mgrScore,
        e.tlScore,
        e.hrScore,
        e.overall,
        `"${e.status}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${this.currentDept.replace(/[^a-zA-Z0-9]/g, '_')}_Performance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.showRptToast(`📥 ${this.currentDept} Excel Performance Report downloaded!`);
    } else {
      this.showRptToast(`📄 Preparing ${this.currentDept} PDF Report print layout...`);
      setTimeout(() => window.print(), 500);
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
