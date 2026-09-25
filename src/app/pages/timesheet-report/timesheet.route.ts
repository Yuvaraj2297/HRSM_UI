import { Routes } from '@angular/router';

export const TIMESHEET_ROUTES: Routes = [

  // =========================================================
  // DEPARTMENT
  // =========================================================
  {
    path: 'attendance-report',
    data: {
      title: 'Attendance Report',
      parentTitle: 'Attendance Report',
    },
    loadComponent: () =>
      import('./attendance/attendance-report/attendance-report')
        .then(m => m.AttendanceReport)
  },

  // =========================================================
  // TEAM
  // =========================================================
  {
    path: 'punch-in-reports',
    data: {
      title: 'Daily Punch Report',
      parentTitle: 'Daily Punch Report'
    },
    loadComponent: () =>
      import('./attendance/punchin-report/punchin-report')
        .then(m => m.PunchinReport)
  },

  // =========================================================
  // POSITION
  // =========================================================
  {
    path: 'view-leave',
    data: {
      title: 'View Leave',
      parentTitle: 'View Leave'
    },
    loadComponent: () =>
      import('./leave-management/leave-hoilday-report/leave-hoilday-report')
        .then(m => m.LeaveHoildayReport)
  },

  // =========================================================
  // DOCUMENT UPLOAD
  // =========================================================
  {
    path: 'leave-report',
    data: {
      title: 'Leave Report',
      parentTitle: 'Leave Report'
    },
    loadComponent: () =>
      import('./leave-management/leave-report/leave-report')
        .then(m => m.LeaveReport)
  },

  // =========================================================
  // WORK LOCATION
  // =========================================================
  {
    path: 'permission-requests',
    data: {
      title: 'Permission Requests',
      parentTitle: 'Permission Requests'
    },
    loadComponent: () =>
      import('./leave-management/permission-report/permission-report')
        .then(m => m.PermissionReport)
  },

  {
    path: 'over-time',
    data: {
      title: 'Over Time',
      parentTitle: 'Over Time'
    },
    loadComponent: () =>
      import('./attendance/over-time/over-time')
        .then(m => m.OverTime)
  },
];