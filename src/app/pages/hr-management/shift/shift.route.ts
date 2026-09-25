import { Routes } from '@angular/router';

export const SHIFT_ROUTES: Routes = [
  { path: '', redirectTo: 'manage-shift', pathMatch: 'full' },

  {
    path: 'manage-shift',
    data: {
      title: 'Manage Shift',
      parentTitle: 'Attendance Management',
      icon: 'bi bi-clock-history'
    },
    loadComponent: () =>
      import('./manage-shift/manage-shift')
        .then(m => m.ManageShift),
  },
  {
    path: 'create-shift',
    data: {
      title: 'Create Shift',
      parentTitle: 'Attendance Management',
      icon: 'bi bi-clock-history'
    },
    loadComponent: () =>
      import('./create-shift/create-shift')
        .then(m => m.CreateShift),
  },
  {
    path: 'shift-schedule',
    data: {
      title: 'Shift Schedule',
      parentTitle: 'Attendance Management',
      icon: 'bi bi-clock-history'
    },
    loadComponent: () =>
      import('./shift-schedule/shift-schedule')
        .then(m => m.ShiftSchedule),
  },
  {
    path: 'shift-shedule',
    redirectTo: 'shift-schedule',
    pathMatch: 'full'
  },
];