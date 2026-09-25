import { Routes } from '@angular/router';

export const ORGANIZATION_ROUTES: Routes = [
  { path: '', redirectTo: 'department-directory', pathMatch: 'full' },

  {
    path: 'department-directory',
    data: { title: 'Department Directory', parentTitle: 'Organization' },
    loadComponent: () =>
      import('./department-directory/department-directory')
        .then(m => m.DepartmentDirectory),
  },
  {
    path: 'employee-tree',
    data: { title: 'Employee Tree', parentTitle: 'Organization' },
    loadComponent: () =>
      import('./employee-tree/employee-tree')
        .then(m => m.EmployeeTree),
  },
  {
    path: 'policy',
    data: { title: 'Policy', parentTitle: 'Organization' },
    loadComponent: () =>
      import('./policy/policy/policy')
        .then(m => m.Policy),
  },

];