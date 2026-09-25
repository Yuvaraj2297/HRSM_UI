import { Routes } from '@angular/router';

export const LOAN_ADVANCES_ROUTES: Routes = [
  { path: '', redirectTo: 'policies', pathMatch: 'full' },
  {
    path: 'policies',
    data: {
      title: 'Advance & Loan Policies',
      parentTitle: 'Loan & Advances',
      icon: 'bi bi-sliders'
    },
    loadComponent: () =>
      import('./advance-loan-policies/advance-loan-policies').then(m => m.AdvanceLoanPolicies),
  },
  {
    path: 'advance-loan-policies',
    redirectTo: 'policies',
    pathMatch: 'full'
  },
  {
    path: 'loan-type',
    redirectTo: 'policies',
    pathMatch: 'full'
  },
  {
    path: 'salary-advance',
    data: {
      title: 'Salary Advance & Company Loans',
      parentTitle: 'Loan & Advances',
      icon: 'bi bi-cash-coin'
    },
    loadComponent: () =>
      import('./salary-advance/salary-advance').then(m => m.SalaryAdvance),
  },
  {
    path: 'loan-requests',
    redirectTo: 'salary-advance',
    pathMatch: 'full'
  },
  {
    path: 'salary-deduction',
    data: {
      title: 'Loan & Advance Ledger Report',
      parentTitle: 'Loan & Advances',
      icon: 'bi bi-credit-card-2-front'
    },
    loadComponent: () =>
      import('./salary-deduction/salary-deduction').then(m => m.SalaryDeduction),
  },
  {
    path: 'loan-report',
    redirectTo: 'salary-deduction',
    pathMatch: 'full'
  }
];
