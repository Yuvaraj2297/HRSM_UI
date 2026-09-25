import { Routes } from '@angular/router';

export const EMPLOYEE_ROUTES: Routes = [

  {
    path: 'employee-report',
    data: {
      title: 'Employee Report',
    },
    loadComponent: () =>
      import('./employee-report/employee-report')
        .then(m => m.EmployeeReport)
  },

   {
    path: 'employee-creation',
    data: {
      title: 'Add New Employee',
      parentTitle: 'Employee Directory',
    },
    loadComponent: () =>
      import('./employee-creation/employee-creation')
        .then(m => m.EmployeeCreation)
  },

   {
    path: 'view',
    loadComponent: () =>
      import('./employee-report/employee-view/employee-view')
        .then(m => m.EmployeeView)
  }
  
];