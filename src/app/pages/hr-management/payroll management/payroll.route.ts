import { Routes } from '@angular/router';

export const PAYROLL_ROUTES: Routes = [
  { path: '', redirectTo: 'attendace-adjustment', pathMatch: 'full' },

  {
    path: 'attendace-adjustment',
    data: { title: 'Attendance Adjustment', parentTitle: 'Payroll' },
    loadComponent: () =>
      import('./attendace-adjustment/attendace-adjustment')
        .then(m => m.AttendaceAdjustment)
  },
   {
    path: 'salary-structure',
    data: { title: 'Salary Structure', parentTitle: 'Payroll' },
    loadComponent: () =>
      import('./salary-structure/salary-structure')
        .then(m => m.SalaryStructure)
  },
     {
    path: 'payroll-report',
    data: { title: 'Payroll Processing', parentTitle: 'Payroll' },
    loadComponent: () =>
      import('./payroll-processing/payroll-processing')
        .then(m => m.PayrollProcessing)
  },
   {
    path: 'payslip',
    data: { title: 'Pay Slip', parentTitle: 'Payroll' },
    loadComponent: () =>
      import('./payslip/payslip')
        .then(m => m.Payslip)
  }
];