import { Routes } from '@angular/router';

export const LEADS_ROUTES: Routes = [
  {
    path: 'lead-map',
    data: {
      title: 'Lead Map',
    },
    loadComponent: () =>
      import('./lead-map/lead-map')
        .then(m => m.LeadMap)
  },


   {
    path: 'manage-lead',
    data: {
      title: 'Manage Lead',
    },
    loadComponent: () =>
      import('./lead-manager/manage-lead/manage-lead')
        .then(m => m.ManageLead)
  },
  {
    path: 'staff-visting-report',
    data: {
      title: 'Staff Visiting Reports',
    },
    loadComponent: () =>
      import('./staff-visiting-reports/staff-visiting-reports')
        .then(m => m.StaffVisitingReports)
  },
   {
    path: 'brandwise-report',
    data: {
      title: 'Brandwise Report',
    },
    loadComponent: () =>
      import('./brandwise-report/brandwise-report')
        .then(m => m.BrandwiseReport)
  },
  {
    path: 'lead-stage',
    data: {
      title: 'Lead Stage',
    },
    loadComponent: () =>
      import('./lead-stage/lead-stage')
        .then(m => m.LeadStage)
  },
  {
    path: 'lead-dashboard',
    data: {
      title: 'Sales Analytics',
    },
    loadComponent: () =>
      import('./lead-dashboard/lead-dashboard')
        .then(m => m.LeadDashboard)
  },
  {
    path: 'whatsapp-chat',
    data: {
      title: 'WhatsApp',
    },
    loadComponent: () =>
      import('./lead-manager/whatsapp-chat/whatsapp-chat')
        .then(m => m.WhatsappChat)
  },
  {
    path: 'mail-box',
    data: {
      title: 'Mailbox',
    },
    loadComponent: () =>
      import('./lead-manager/mail-box/mail-box')
        .then(m => m.MailBox)
  },
  {
    path: 'sms',
    data: {
      title: 'SMS',
    },
    loadComponent: () =>
      import('./lead-manager/sms-template/sms-template')
        .then(m => m.SmsTemplate)
  },
{
    path: 'leads',
    data: { title: 'Leads', parentTitle: 'Recruitment' },
    loadComponent: () => import('./leads/leads').then(m => m.Leads),
  },
  {
    path: 'employee-revenue-report',
    data: { title: 'Leads', parentTitle: 'Recruitment' },
    loadComponent: () => import('./employee-revenue-report/employee-revenue-report').then(m => m.EmployeeRevenueReport),
  },
{
    path: 'employee-lead-report',
    data: { title: 'Leads', parentTitle: 'Recruitment' },
    loadComponent: () => import('./employee-lead-report/employee-lead-report').then(m => m.EmployeeLeadReport),
  }
]
