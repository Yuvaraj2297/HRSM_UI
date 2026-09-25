import { Routes } from '@angular/router';

export const HELPDESK_ROUTES: Routes = [
  { path: '', redirectTo: 'customer-create-ticket', pathMatch: 'full' },

  {
    path: 'customer-create-ticket',
    data: {
      title: 'Create Ticket',
      parentTitle: 'Customer Self Service',
      icon: 'bi bi-clock-history'
    },
    loadComponent: () =>
      import('./customer-self-service/create-ticket/create-ticket')
        .then(m => m.CreateTicket),
  },
  {
    path: 'create-ticket',
    redirectTo: 'customer-create-ticket',
    pathMatch: 'full'
  },
  {
    path: 'customer-my-tickets',
    data: {
      title: 'My Tickets',
      parentTitle: 'Customer Self Service',
      icon: 'bi bi-ticket-detailed'
    },
    loadComponent: () =>
      import('./customer-self-service/my-ticket/my-ticket')
        .then(m => m.MyTicket),
  },
  {
    path: 'my-tickets',
    redirectTo: 'customer-my-tickets',
    pathMatch: 'full'
  },

  {
    path: 'employee-create-ticket',
    data: {
      title: 'Create Ticket',
      parentTitle: 'Employee Self Service',
      icon: 'bi bi-life-preserver'
    },
    loadComponent: () =>
      import('./employee-self-service/employee-create-ticket/employee-create-ticket')
        .then(m => m.EmployeeCreateTicket),
  },
  {
    path: 'ticketing',
    redirectTo: 'employee-create-ticket',
    pathMatch: 'full'
  },
  {
    path: 'employee-my-tickets',
    data: {
      title: 'My Tickets',
      parentTitle: 'Employee Self Service',
      icon: 'bi bi-ticket-detailed'
    },
    loadComponent: () =>
      import('./employee-self-service/employee-my-tickets/employee-my-tickets')
        .then(m => m.EmployeeMyTickets),
  },
  {
    path: 'ticket-dashboard',
    data: {
      title: 'Employee Ticket',
      parentTitle: 'HR / Admin',
      icon: 'bi bi-speedometer2'
    },
    loadComponent: () =>
      import('./hr&admin/employee-ticket/employee-ticket')
        .then(m => m.EmployeeTicket),
  },
  {
    path: 'employee-ticket',
    redirectTo: 'ticket-dashboard',
    pathMatch: 'full'
  },
  {
    path: 'customer-ticket',
    data: {
      title: 'Customer Ticket',
      parentTitle: 'HR / Admin',
      icon: 'bi bi-speedometer2'
    },
    loadComponent: () =>
      import('./hr&admin/customer-ticket/customer-ticket')
        .then(m => m.CustomerTicket),
  },
  {
    path: 'customer-ticket-dashboard',
    redirectTo: 'customer-ticket',
    pathMatch: 'full'
  },
  {
    path: 'employee-ticket-report',
    data: {
      title: 'Ticket Reports',
      parentTitle: 'HR / Admin',
      icon: 'bi bi-clipboard-data'
    },
    loadComponent: () =>
      import('./hr&admin/employee-ticket/employee-ticket-report/employee-ticket-report')
        .then(m => m.EmployeeTicketReport),
  },
  {
    path: 'ticket-reports',
    redirectTo: 'employee-ticket-report',
    pathMatch: 'full'
  },
];