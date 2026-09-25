import { Routes } from '@angular/router';
import { Layout } from './layout/layout';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
      },
      {
        path: 'master',
        loadChildren: () =>
          import('./pages/master/master.route').then((m) => m.MASTER_ROUTES),
      },
      {
        path: 'organization',
        loadChildren: () =>
          import('./pages/hr-management/organization/organization.route').then((m) => m.ORGANIZATION_ROUTES),
      },
      {
        path: 'employee',
        loadChildren: () =>
          import('./pages/hr-management/employee/employee-routes').then((m) => m.EMPLOYEE_ROUTES),
      },
      {
        path: 'shift',
        loadChildren: () =>
          import('./pages/hr-management/shift/shift.route').then((m) => m.SHIFT_ROUTES),
      },
      {
        path: 'loanAdv',
        loadChildren: () =>
          import('./pages/hr-management/loan&advances/loan-advances.route').then((m) => m.LOAN_ADVANCES_ROUTES),
      },
      {
        path: 'timesheet',
        loadChildren: () =>
          import('./pages/timesheet-report/timesheet.route').then((m) => m.TIMESHEET_ROUTES),
      },
      {
        path: 'helpdesk',
        loadChildren: () =>
          import('./pages/helpdesk/helpdesk.route').then((m) => m.HELPDESK_ROUTES),
      },
       {
        path: 'payroll',
        loadChildren: () =>
          import('./pages/hr-management/payroll management/payroll.route').then((m) => m.PAYROLL_ROUTES),
      },
       {
        path: 'recruitment',
        loadChildren: () =>
          import('./pages/hr-records/hr-record.route').then((m) => m.HR_ROUTES),
      },
      {
        path: 'leads',
        loadChildren: () =>
          import('./pages/leads/lead.route').then((m) => m.LEADS_ROUTES),
      }
    ],
  },
];
