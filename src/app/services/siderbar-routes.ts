import { Injectable } from '@angular/core';

export const RAIL_ICONS: Record<string, string> = {
    DAS: 'bi bi-grid-1x2-fill',
    MAS: 'bi bi-database',
    HRM: 'bi bi-people',
    TSL: 'bi bi-calendar-check',
    HRR: 'bi bi-folder-symlink',
    HDT: 'bi bi-life-preserver',
    LEAD: 'bi bi-kanban',
};

export interface SidebarSubItem {
    title: string;
    route: string;
}

export interface SidebarItem {
    title: string;
    route: string;
    icon?: string;
    children?: SidebarSubItem[];
}

export interface SidebarSection {
    title: string;
    items: SidebarItem[];
}

export interface SidebarRailMenuItem {
    key: string;
    title: string;
    short: string;
    railIcon?: string;
}

export type SidebarMenuMap = Record<string, SidebarSection>;

@Injectable({
  providedIn: 'root',
})
export class SidebarRoutes {
  private _sidebarMenus: SidebarMenuMap = {
    DAS: {
      title: 'Dashboard',
      items: [{ title: 'Dashboard', route: 'dashboard', icon: 'bi bi-grid-1x2-fill' }],
    },
    MAS: {
      title: 'Master',
      items: [
        { title: 'Department', route: 'master/department', icon: 'bi bi-diagram-3' },
        { title: 'Team', route: 'master/teams', icon: 'bi bi-people-fill' },
        { title: 'Position', route: 'master/position', icon: 'bi bi-briefcase' },
        {
          title: 'Document Upload',
          route: 'master/document-upload',
          icon: 'bi bi-file-earmark-arrow-up',
        },
        { title: 'Work Location', route: 'master/work-location', icon: 'bi bi-geo-alt' },
        { title: 'State', route: 'master/state', icon: 'bi bi-map' },
        { title: 'District', route: 'master/district', icon: 'bi bi-pin-map' },
        { title: 'Leave Type', route: 'master/leave-type', icon: 'bi bi-pin-map' },
        { title: 'Shift', route: 'master/shift', icon: 'bi bi-clock-history' },
      ],
    },
    HRM: {
      title: 'HR Management',
      items: [
        {
          title: 'Organization',
          route: 'organization',
          icon: 'bi bi-building',
          children: [
            { title: 'Department Directory', route: '/organization/department-directory' },
            { title: 'Employee Tree', route: '/organization/employee-tree' },
            { title: 'Policy', route: '/organization/policy' },
            { title: 'Calendar', route: '/organization/calendar' },
          ],
        },
        {
          title: 'Employee',
          route: 'employee',
          icon: 'bi bi-people',
          children: [
            { title: 'Employee Creation', route: 'employee/employee-creation' },
            { title: 'Employee Report', route: 'employee/employee-report' },
          ],
        },
        {
          title: 'Shift',
          route: 'shift',
          icon: 'bi bi-clock-history',
          children: [
            { title: 'Manage Shift', route: 'shift/manage-shift' },
            { title: 'Create Shift', route: 'shift/create-shift' },
            { title: 'Shift Schedule', route: 'shift/shift-schedule' },
          ],
        },
        {
          title: 'Loan & Advances',
          route: 'loanAdv',
          icon: 'bi bi-credit-card-2-front',
          children: [
            { title: 'Salary Advance & Loans', route: 'loanAdv/salary-advance' },
            { title: 'Advance & Loan Policies', route: 'loanAdv/policies' },
            { title: 'Salary Deduction Ledger', route: 'loanAdv/salary-deduction' },
          ],
        },
        {
          title: 'Payroll Management',
          route: 'payroll',
          icon: 'bi bi-cash-stack',
          children: [
            { title: 'Attendance Adjustment', route: 'payroll/attendace-adjustment' },
            { title: 'Salary Structure', route: 'payroll/salary-structure' },
            { title: 'Payroll Processing', route: 'payroll/payroll-report' },
            { title: 'Payslip', route: 'payroll/payslip' },
          ],
        },
      ],
    },
    TSL: {
      title: 'Time Sheet & Leave',
      items: [
        {
          title: 'Attendace',
          route: 'attendace',
          icon: 'bi bi-building',
          children: [
            { title: 'Attandance Report', route: 'timesheet/attendance-report' },
            { title: 'Punch In Reports', route: 'timesheet/punch-in-reports' },
            { title: 'Over Time', route: 'timesheet/over-time' },
          ],
        },
        {
          title: 'Leave',
          route: 'leave',
          icon: 'bi bi-building',
          children: [
            { title: 'Leave and Hoilday', route: 'timesheet/view-leave' },
            { title: 'Leave Report', route: 'timesheet/leave-report' },
            { title: 'Permission Request', route: 'timesheet/permission-requests' },
          ],
        },
      ],
    },
    HRR: {
      title: 'HR Records',
      items: [
        {
          title: 'Recruitment',
          route: 'recruitment',
          icon: 'bi bi-people-fill me-2',
          children: [
            { title: 'Job Opening', route: 'recruitment/job-opening' },
            { title: 'Social and Web Applicants', route: 'recruitment/social-web-applicants' },
            {
              title: 'Candidate Evaluations & Scorecards',
              route: 'recruitment/candidate-evaluation',
            },
            { title: 'Candidate Pipeline', route: 'recruitment/candidate-pipeline' },
            { title: 'Offer Letter', route: 'recruitment/offer-letter' },
            { title: 'Recruitment Reports', route: 'recruitment/recruitment-reports' },
          ],
        },
        {
          title: 'Onboarding',
          route: 'onboarding',
          icon: 'bi bi-person-check me-2',
          children: [
            { title: 'Joining Pipeline', route: 'recruitment/joining-pipeline' },
            { title: ' Document Verification', route: 'recruitment/document-verification' },
            { title: 'Checklists', route: 'recruitment/checklists' },
            { title: 'Asset Provisioning', route: 'recruitment/asset-provisioning' },
            { title: 'Induction Orientation', route: 'recruitment/induction-orientation' },
          ],
        },
        {
          title: 'Performance',
          route: 'performance',
          icon: 'bi bi-bar-chart-line me-2',
          children: [
            { title: 'Appraisal Reviews', route: 'recruitment/appraisal-review' },
            { title: '360 Feedback', route: 'recruitment/performance-feedback' },
            { title: 'Performance Report', route: 'recruitment/performance-report' },
          ],
        },
        {
          title: 'Reports & Analytics',
          route: 'reports-analytics',
          icon: 'bi bi-clipboard-data me-2',
        },
      ],
    },
    HDT: {
      title: 'Helpdesk / Ticketing',
      items: [
        {
          title: 'Customer Self Service',
          route: 'helpdesk/customer',
          icon: 'bi bi-person-badge',
          children: [
            { title: 'Create Ticket', route: 'helpdesk/customer-create-ticket' },
            { title: 'My Tickets', route: 'helpdesk/customer-my-tickets' },
          ],
        },
        {
          title: 'Employee Self Service',
          route: 'helpdesk/employee',
          icon: 'bi bi-person',
          children: [
            { title: 'Create Ticket', route: 'helpdesk/employee-create-ticket' },
            { title: 'My Tickets', route: 'helpdesk/employee-my-tickets' },
          ],
        },
        {
          title: 'HR / Admin',
          route: 'helpdesk/admin',
          icon: 'bi bi-headset',
          children: [
            { title: 'Employee Ticket', route: 'helpdesk/ticket-dashboard' },
            { title: 'Customer Ticket', route: 'helpdesk/customer-ticket' },
          ],
        },
      ],
    },
    LEAD: {
      title: 'Lead Management',
      items: [
        {
          title: 'Leads',
          route: 'leads',
          icon: 'bi bi-people-fill me-2',
          children: [
            { title: 'Map', route: 'leads/lead-map' },
            { title: 'Staff Visiting Reports', route: 'leads/staff-visting-report' },
             { title: 'Brandwise Report', route: 'leads/brandwise-report' },
             { title: 'Lead Stage', route: 'leads/lead-stage' },            
            { title: 'Lead Dashboard', route: 'leads/lead-dashboard' },
 { title: 'Leads', route: 'leads/leads' },
            { title: 'employee-revenue-report', route: 'leads/employee-revenue-report' },
            { title: 'employee-lead-report', route: 'leads/employee-lead-report' },
          ],
        },
        {
          title: 'Manage Lead ',
          route: 'leads',
          icon: 'bi bi-person-check me-2',
          children: [
            { title: 'Manage Lead', route: 'leads/manage-lead' },
            { title: 'SMS', route: 'leads/sms' },
            { title: 'Mailbox', route: 'leads/mail-box' },            
            { title: 'WhatsApp', route: 'leads/whatsapp-chat' },
            
          ],
        },
        
      ],
    },
  };

  private _menuList: SidebarRailMenuItem[] = [
    { key: 'DAS', title: 'Dashboard', short: 'DAS', railIcon: RAIL_ICONS['DAS'] },
    { key: 'MAS', title: 'Master', short: 'MAS', railIcon: RAIL_ICONS['MAS'] },
    { key: 'HRM', title: 'HR Management', short: 'HRM', railIcon: RAIL_ICONS['HRM'] },
    { key: 'TSL', title: 'Time Sheet & Leave', short: 'TSL', railIcon: RAIL_ICONS['TSL'] },
    { key: 'HRR', title: 'HR Records', short: 'HRR', railIcon: RAIL_ICONS['HRR'] },
    { key: 'HDT', title: 'Helpdesk / Ticketing', short: 'HDT', railIcon: RAIL_ICONS['HDT'] },
     { key: 'LEAD', title: 'LEAD', short: 'LEAD', railIcon: RAIL_ICONS['LEAD'] },
  ];

  get sidebarMenus(): SidebarMenuMap {
    return this._sidebarMenus;
  }

  get menuList(): SidebarRailMenuItem[] {
    return this._menuList;
  }

  getMenuByKey(key: string): SidebarSection | undefined {
    return this._sidebarMenus[key];
  }

  setSidebarMenus(menus: SidebarMenuMap): void {
    this._sidebarMenus = menus;
  }

  setMenuList(menuList: SidebarRailMenuItem[]): void {
    this._menuList = menuList;
  }
}
