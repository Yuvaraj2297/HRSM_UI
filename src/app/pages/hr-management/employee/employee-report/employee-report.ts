import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  DEPT_COLORS,
  Employee,
  EMPLOYEES,
  StatCard,
  STATUS_COLORS,
  TEAM_COLORS,
} from '../employee-model';

import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableRowAction,
} from '../../../../shared/primedatatable/primedatatable';

/* =========================================================
   TEAM GROUP INTERFACE
========================================================= */

interface TeamGroup {
  name: string;
  color: string;
  members: Employee[];
}

/* =========================================================
   COMPONENT
========================================================= */

@Component({
  selector: 'app-employee-report',

  standalone: true,

  imports: [CommonModule, PrimeDataTable],

  templateUrl:'./employee-report.html',

  styleUrl: './employee-report.scss',
})
export class EmployeeReport implements OnInit {
  /* =======================================================
     SEARCH
  ======================================================== */

  searchPlaceholder = 'Search employee, ID, department…';

  /* =======================================================
     MAIN TABLE HEADER
  ======================================================== */

  header = {
    title: 'Employees',
    icon: 'ti ti-users',
  };

  

  tableData: Employee[] = [];

  /* =======================================================
     STATISTICS
  ======================================================== */

  statCards: StatCard[] = [];

  /* =======================================================
     VIEW SWITCHER
  ======================================================== */

  views = [
    {
      key: 'all',
      label: 'All Employees',
    },
    {
      key: 'team',
      label: 'Team',
    },
  ];

  activeView = 'all';

  /* =======================================================
     EMPLOYEE TABLE COLUMNS
  ======================================================== */

  columns: PrimeTableColumn[] = [
    {
      field: 'sno',
      header: 'S.NO',
      width: '70px',
    },

    {
      field: 'empId',
      header: 'Employee ID',
      sortable: true,
      type: 'link',
    },

    {
      field: 'name',
      header: 'Name',
      sortable: true,
      type: 'avatar',
      imageField: 'avatar',
      subField: 'email',
    },

    {
      field: 'dept',
      header: 'Department',
      sortable: true,
      type: 'badge',
      colorMap: DEPT_COLORS,
    },

    {
      field: 'position',
      header: 'Position',
      sortable: true,
      type: 'text',
    },

    {
      field: 'office',
      header: 'Office',
      sortable: true,
      type: 'text',
    },

    {
      field: 'team',
      header: 'Team',
      sortable: true,
      type: 'badge',
      colorMap: TEAM_COLORS,
    },

    {
      field: 'status',
      header: 'Status',
      sortable: true,
      type: 'status',
      colorMap: STATUS_COLORS,
    },

    {
      field: 'joined',
      header: 'Date of Joining',
      sortable: true,
      type: 'text',
    },

    {
      field: 'actions',
      header: 'Actions',
      type: 'actions',
      width: '90px',
    },
  ];

  /* =======================================================
     TEAM TABLE COLUMNS
     Same columns except Team column
  ======================================================== */

  teamColumns: PrimeTableColumn[] = this.columns.filter((column) => column.field !== 'team');



  /* =======================================================
     TEAM TABLE ACTIONS
  ======================================================== */

  teamActions = {
    add: false,
    edit: true,
    delete: true,
  };

  /* =======================================================
     ROW ACTION MENU
  ======================================================== */

  rowActions: PrimeTableRowAction[] = [
    {
      key: 'view',
      label: 'View',
      icon: 'bi bi-eye',
    },

    {
      key: 'edit',
      label: 'Edit',
      icon: 'bi bi-pencil',
    },

    {
      key: 'divider',
    },

    {
      key: 'Active',
      label: 'Active',
      icon: 'bi bi-person-check',

      disabledWhen: (row: Employee) => row.status === 'Active',
    },

    {
      key: 'Inactive',
      label: 'Inactive',
      icon: 'bi bi-person-x',

      disabledWhen: (row: Employee) => row.status === 'Inactive',
    },
  ];

  /* =======================================================
     SELECTED TEAM
  ======================================================== */

  selectedTeam: string | null = null;

  /* =======================================================
     VIEW MODAL STATE
  ======================================================== */

  isViewModalOpen = false;

  selectedEmployee: Employee | null = null;

  activeModalTab = 'overview';

  modalTabs = [
    { key: 'overview', label: 'Overview', icon: 'bi bi-person' },
    { key: 'personal', label: 'Personal', icon: 'bi bi-person-vcard' },
    { key: 'employment', label: 'Employment', icon: 'bi bi-briefcase' },
    { key: 'organization', label: 'Organization', icon: 'bi bi-diagram-3' },
    { key: 'documents', label: 'Documents', icon: 'bi bi-file-earmark-text' },
    { key: 'attendance', label: 'Attendance', icon: 'bi bi-clock' },
    { key: 'leave', label: 'Leave', icon: 'bi bi-calendar-x' },
    { key: 'payroll', label: 'Payroll', icon: 'bi bi-cash-coin' },
    { key: 'assets', label: 'Assets', icon: 'bi bi-laptop' },
    { key: 'performance', label: 'Performance', icon: 'bi bi-graph-up' },
    { key: 'training', label: 'Training', icon: 'bi bi-mortarboard' },
    { key: 'history', label: 'History', icon: 'bi bi-clock-history' },
  ];

  /* =======================================================
     CONSTRUCTOR
  ======================================================== */

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  /* =======================================================
     INIT
  ======================================================== */

  ngOnInit(): void {
    /*
     * Clone the static employee data.
     * This prevents direct mutation of EMPLOYEES.
     */
    this.tableData = [...EMPLOYEES];

    this.buildStats();
  }

  /* =======================================================
     STAT CARDS
  ======================================================== */

  private buildStats(): void {
    const total = this.tableData.length;

    const active = this.tableData.filter((employee) => employee.status === 'Active').length;

    const inactive = this.tableData.filter((employee) => employee.status === 'Inactive').length;

    const departments = new Set(this.tableData.map((employee) => employee.dept)).size;

    const newThisMonth = this.tableData.filter((employee) =>
      this.isThisMonth(employee.joined),
    ).length;

    const percentage = (value: number): string => {
      return total ? ((value / total) * 100).toFixed(2) : '0.00';
    };

    this.statCards = [
      {
        label: 'Total Employees',
        value: total,
        delta: 'All time',
        deltaClass: 'text-neutral',
        icon: 'bi bi-people',
        theme: 'violet',
      },

      {
        label: 'Active Employees',
        value: active,
        delta: `${percentage(active)}% of total`,
        deltaClass: 'text-up',
        icon: 'bi bi-person-check',
        theme: 'primary',
      },

      {
        label: 'Inactive Employees',
        value: inactive,
        delta: `${percentage(inactive)}% of total`,
        deltaClass: 'text-down',
        icon: 'bi bi-person-x',
        theme: 'amber',
      },

      {
        label: 'New This Month',
        value: newThisMonth,
        delta: 'Joined this month',
        deltaClass: 'text-neutral',
        icon: 'bi bi-calendar-plus',
        theme: 'blue',
      },

      {
        label: 'Departments',
        value: departments,
        delta: 'Total departments',
        deltaClass: 'text-neutral',
        icon: 'bi bi-diagram-3',
        theme: 'violet',
      },
    ];
  }

  /* =======================================================
     CHECK CURRENT MONTH
  ======================================================== */

  private isThisMonth(joined: string): boolean {
    const date = new Date(joined);

    const now = new Date();

    if (isNaN(date.getTime())) {
      return false;
    }

    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }

  /* =======================================================
     TEAM GROUPING
  ======================================================== */

  get teamGroups(): TeamGroup[] {
    const map = new Map<string, TeamGroup>();

    for (const employee of this.tableData) {
      if (!map.has(employee.team)) {
        map.set(employee.team, {
          name: employee.team,

          color: TEAM_COLORS[employee.team] || 'var(--blue-450)',

          members: [],
        });
      }

      map.get(employee.team)!.members.push(employee);
    }

    return Array.from(map.values());
  }

  /* =======================================================
     SELECTED TEAM MEMBERS
  ======================================================== */

  get teamMembers(): Employee[] {
    if (!this.selectedTeam) {
      return [];
    }

    return this.tableData.filter((employee) => employee.team === this.selectedTeam);
  }

  /* =======================================================
     TEAM TABLE HEADER
  ======================================================== */

  get teamHeader() {
    return {
      title: this.selectedTeam ? `${this.selectedTeam} Members` : 'Team Members',

      icon: 'ti ti-users',
    };
  }

  /* =======================================================
     TEAM SEARCH PLACEHOLDER
  ======================================================== */

  get teamSearchPlaceholder(): string {
    if (!this.selectedTeam) {
      return 'Search team members…';
    }

    return `Search ${this.selectedTeam.toLowerCase()} members…`;
  }

  /* =======================================================
     VISIBLE TEAM AVATARS
  ======================================================== */

  visibleAvatars(group: TeamGroup): Employee[] {
    return group.members.slice(0, 3);
  }

  /* =======================================================
     AVATAR OVERFLOW
  ======================================================== */

  avatarOverflow(group: TeamGroup): number {
    return Math.max(group.members.length - 3, 0);
  }

  /* =======================================================
     TEAM ICON STYLE
  ======================================================== */

  teamIconStyle(color: string) {
    return {
      'background-color': `color-mix(in srgb, ${color} 8%, transparent)`,

      color: color,
    };
  }

  /* =======================================================
     SELECT TEAM
  ======================================================== */

  selectTeam(name: string): void {
    /*
     * Clicking the currently selected team again
     * will deselect it.
     */
    this.selectedTeam = this.selectedTeam === name ? null : name;
  }

  /* =======================================================
     AVATAR ERROR FALLBACK
  ======================================================== */

  onAvatarError(event: Event, name: string): void {
    const image = event.target as HTMLImageElement;

    /*
     * Prevent repeated error events.
     */
    image.onerror = null;

    image.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e2e8f0&color=334155`;
  }

  /* =======================================================
     OPEN CREATE EMPLOYEE
  ======================================================== */

  openCreateModal(): void {
    this.router.navigate(['employee/employee-creation']);
  }

  /* =======================================================
     OPEN / CLOSE VIEW MODAL
  ======================================================== */

  openViewModal(row: Employee): void {
    this.selectedEmployee = row;
    this.activeModalTab = 'overview';
    this.isViewModalOpen = true;
  }

  closeViewModal(): void {
    this.isViewModalOpen = false;
    this.selectedEmployee = null;
  }

  setModalTab(key: string): void {
    this.activeModalTab = key;
  }

  /* =======================================================
     PAYROLL CALCULATIONS (used in Payroll tab)
  ======================================================== */

  private num(value: number | undefined): number {
    return value ?? 0;
  }

  get grossSalary(): number {
    if (!this.selectedEmployee) return 0;

    return (
      this.num(this.selectedEmployee.basic) +
      this.num(this.selectedEmployee.hra) +
      this.num(this.selectedEmployee.specialAllowance) +
      this.num(this.selectedEmployee.otherAllowance)
    );
  }

  get totalDeductions(): number {
    if (!this.selectedEmployee) return 0;

    return (
      this.num(this.selectedEmployee.pf) +
      this.num(this.selectedEmployee.professionalTax) +
      this.num(this.selectedEmployee.tds)
    );
  }

  get netSalary(): number {
    return this.grossSalary - this.totalDeductions;
  }

  money(value: number | undefined): string {
    if (value === undefined || value === null) return '₹ 0';
    return `₹ ${value.toLocaleString('en-IN')}`;
  }

  /* =======================================================
     DOCUMENT STATUS CLASS (used in Documents tab)
  ======================================================== */

  documentStatusClass(status: string): string {
    return (
      (
        {
          Verified: 'text-success',
          Pending: 'text-warning',
          Expired: 'text-danger',
        } as Record<string, string>
      )[status] ?? ''
    );
  }

  /* =======================================================
     TABLE ACTION
  ======================================================== */

  onTableAction(event: { action: string; row: Employee }): void {
    const { action, row } = event;

    switch (action) {
      /* =====================================================
         VIEW EMPLOYEE
      ===================================================== */
      case 'view':
        this.openViewModal(row);
        break;

      /* =====================================================
         EDIT EMPLOYEE
      ===================================================== */
      case 'edit':
        this.router.navigate(['employee/employee-creation'], {
          queryParams: {
            id: row.empId,
          },
        });

        break;

      /* =====================================================
         ACTIVE / INACTIVE
      ===================================================== */
      case 'Active':
      case 'Inactive':
        this.changeStatus(row, action as 'Active' | 'Inactive');

        break;
    }
  }

  /* =======================================================
     CHANGE EMPLOYEE STATUS
  ======================================================== */

  private changeStatus(row: Employee, status: 'Active' | 'Inactive'): void {
    /*
     * Don't update if status is already the same.
     */
    if (row.status === status) {
      return;
    }

    /*
     * Create a new array so Angular detects
     * the data change correctly.
     */
    this.tableData = this.tableData.map((employee) =>
      employee.empId === row.empId
        ? {
            ...employee,
            status,
          }
        : employee,
    );

    /*
     * Keep the modal's snapshot in sync if the
     * employee whose status changed is open in the modal.
     */
    if (this.selectedEmployee && this.selectedEmployee.empId === row.empId) {
      this.selectedEmployee = { ...this.selectedEmployee, status };
    }

    /*
     * Refresh statistics after status change.
     */
    this.buildStats();
  }

  /* =======================================================
     CHANGE MAIN VIEW
  ======================================================== */

  setView(key: string): void {
    this.activeView = key;

    /*
     * Every time Team view is opened,
     * start without a selected team.
     */
    if (key === 'team') {
      this.selectedTeam = null;
    }
  }

  /* =======================================================
     TRACK BY EMPLOYEE
  ======================================================== */

  trackByEmpId(_index: number, employee: Employee): string {
    return employee.empId;
  }

  /* =======================================================
     TRACK BY TEAM
  ======================================================== */

  trackByTeam(_index: number, group: TeamGroup): string {
    return group.name;
  }
}
