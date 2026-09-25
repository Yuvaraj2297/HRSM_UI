import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReuseModal, ModalSaveEvent, ModalField } from '../../../shared/reuse-model/reuse-model';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableRowAction,
} from '../../../shared/primedatatable/primedatatable';

import { ImportLeadsModal } from './lead-model/import-leads-modal';
import { LeadDetailModal, LeadRow } from './lead-model/lead-detail-modal';
import { CalendarDatepickerDirective } from '../../../common/directives/datepicker';

interface StatsRow {
  label: string;
  danger?: boolean;
  values: (string | number)[];
}

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, FormsModule, ReuseModal, PrimeDataTable, ImportLeadsModal, LeadDetailModal,CalendarDatepickerDirective],
  templateUrl: './leads.html',
  styleUrl: './leads.scss',
})
export class Leads {
  @ViewChild('newLeadModal') newLeadModal!: ReuseModal;
  @ViewChild('importModal') importModal!: ImportLeadsModal;
  @ViewChild('detailModal') detailModal!: LeadDetailModal;

  // ===== page view tabs (All Leads / Activity Stats) =====
  activeTab: 'leads' | 'stats' = 'leads';

  // ===== filters =====
  filtersOpen = false;
  filters = {
    staff: '',
    sourcer: '',
    status: ['Lead', 'Quotation', 'Followup', 'Qualified', 'DIRECT'],
    source: '',
    fromDate: '',
    toDate: '',
    type: '',
    closurePeriod: 'All Time',
  };

  staffOptions = ['Harish D.', 'Divya A.', 'Karthik R.', 'Priya S.'];
  sourcerOptions = ['Harish D.', 'Website Form', 'Facebook Ads', 'Referral'];
  statusOptions = ['Lead', 'Quotation', 'Followup', 'Qualified', 'DIRECT', 'Negotiation', 'Won', 'Lost'];
  sourceOptions = ['Website', 'Facebook Ads', 'Google Ads', 'Referral', 'Walk-in', 'Cold Call'];
  typeOptions = ['Hot Lead', 'Warm Lead', 'Cold Lead', 'Repeat Customer'];
  closurePeriodOptions = ['All Time', 'This Week', 'This Month', 'This Quarter', 'This Year'];

  clearFilters(): void {
    this.filters = {
      staff: '', sourcer: '', status: [], source: '', fromDate: '', toDate: '', type: '', closurePeriod: 'All Time',
    };
  }

  // ===== activity / pipeline stats matrix =====
  statsRows: StatsRow[] = [
    { label: 'Actual', values: [0, 0, 1, 0, 0, 1, 2, '1 / ₹0.00', '2 / ₹23,629.00', '3 / ₹1,41,629.00', '0 / ₹0.00', '0 / ₹0.00', '0 / ₹0.00'] },
    { label: 'Completed', danger: true, values: [0, '-', '-', 0, 0, '-', '-', '-', '-', '-', '-', '-', '-'] },
  ];

  // ===== leads table (mock rows; wire to your API service) =====
  leads: LeadRow[] = [
    {
      id: 1, name: 'Suresh Babu', company: 'GHARUDA TECHNOLOGY', enquiryCode: 'ENQ-0171', country: 'India',
      stagePct: 65, nextReminder: '—', closureDate: '15-07-2026', phone: '9500123456',
      product: 'HRMS Subscription', value: '₹23,629.00', tags: ['Warm Lead'], assigned: 'GHRAUDA SOFTWARE',
      sourcer: 'GHRAUDA SOFTWARE', status: 'Followup', source: 'IndiaMart', lastContact: '17-09-2026',
      created: '21-08-2026', profession: 'Architect', leadScore: 'Hot',
    },
  ];

  // ===== PrimeDataTable column config =====
  leadColumns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', width: '70px' },
    { field: 'id', header: '#', sortable: true, width: '70px' },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'company', header: 'Company', sortable: true },
    { field: 'enquiryCode', header: 'Enquiry Code' },
    { field: 'country', header: 'Country', sortable: true },
    { field: 'stagePct', header: 'Stage %', type: 'custom', width: '90px' },
    { field: 'nextReminder', header: 'Next Reminder Date' },
    { field: 'closureDate', header: 'Closure Date', sortable: true },
    { field: 'phone', header: 'Phone' },
    { field: 'product', header: 'Product' },
    { field: 'value', header: 'Value', sortable: true },
    { field: 'tags', header: 'Tags', type: 'custom' },
    { field: 'assigned', header: 'Assigned', sortable: true },
    { field: 'sourcer', header: 'Sourcer' },
    {
      field: 'status', header: 'Status', type: 'status', sortable: true,
      colorMap: {
        Lead: 'var(--blue-550)', Quotation: 'var(--orange-300)', Followup: 'var(--blue-500-3)', Qualified: 'var(--green-400-2)',
        Negotiation: 'var(--pink-500)', Won: 'var(--green-400-2)', Lost: 'var(--danger)', DIRECT: 'var(--blue-300)',
      },
    },
    { field: 'source', header: 'Source' },
    { field: 'lastContact', header: 'Last Contact', sortable: true },
    { field: 'created', header: 'Created', sortable: true },
    { field: 'profession', header: 'Profession' },
    {
      field: 'leadScore', header: 'Lead Score', type: 'badge',
      colorMap: { Hot: 'var(--danger)', Warm: 'var(--orange-300)', Cold: 'var(--blue-300)' },
    },
    { field: 'actions', header: 'Action', type: 'actions', width: '110px' },
  ];

  leadRowActions: PrimeTableRowAction[] = [
    { key: 'view', label: 'View', icon: 'bi bi-eye' },
    { key: 'edit', label: 'Edit', icon: 'bi bi-pencil' },
    { key: 'delete', label: 'Delete', icon: 'bi bi-trash' },
  ];

  onLeadTableAction(evt: { action: string; row: LeadRow }): void {
    if (evt.action === 'view') this.openDetail(evt.row);
    else if (evt.action === 'edit') this.newLeadModal.open('edit', evt.row as any);
    else if (evt.action === 'delete') this.deleteLead(evt.row);
  }

  deleteLead(row: LeadRow): void {
    // TODO: call your delete API here
    this.leads = this.leads.filter(l => l.id !== row.id);
  }

  // ===== New Lead modal (built on the shared ReuseModal) =====
  newLeadFields: ModalField[] = [
    { key: 'status', label: 'Status', type: 'select', required: true, col: 3, options: this.statusOptions.map(o => ({ label: o, value: o })) },
    { key: 'source', label: 'Source', type: 'select', required: true, col: 3, options: this.sourceOptions.map(o => ({ label: o, value: o })) },
    { key: 'assigned', label: 'Assigned', type: 'select', required: true, col: 3, defaultValue: 'GHARUDA SOFTWARE', options: this.staffOptions.map(o => ({ label: o, value: o })) },
    { key: 'sourcer', label: 'Sourcer', type: 'select', col: 3, defaultValue: 'GHARUDA SOFTWARE', options: this.sourcerOptions.map(o => ({ label: o, value: o })) },
    { key: 'brand', label: 'Brand', type: 'select', col: 4, options: ['Product A', 'Product B', 'Product C'].map(o => ({ label: o, value: o })) },
    { key: 'qualification', label: 'Lead Qualification', type: 'select', col: 4, options: ['Hot', 'Warm', 'Cold'].map(o => ({ label: o, value: o })) },
    { key: 'tags', label: 'Tags', type: 'text', col: 12, placeholder: 'Comma-separated tags' },
    { key: 'company', label: 'Company', type: 'text', required: true, col: 6 },
    { key: 'name', label: 'Name', type: 'text', required: true, col: 6 },
    { key: 'enquiryCode', label: 'Enquiry Code', type: 'text', col: 6, defaultValue: 'ENQ-0171' },
    { key: 'address', label: 'Address', type: 'textarea', col: 6, rows: 2 },
    { key: 'position', label: 'Position', type: 'text', col: 6, placeholder: 'e.g. Manager' },
    { key: 'country', label: 'Country', type: 'select', col: 6, defaultValue: 'India', options: ['India', 'United States', 'United Kingdom', 'UAE', 'Singapore', 'Australia'].map(o => ({ label: o, value: o })) },
    { key: 'email', label: 'Email Address', type: 'email', col: 6 },
    { key: 'state', label: 'State', type: 'select', col: 6, options: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala', 'Telangana', 'Gujarat', 'Rajasthan'].map(o => ({ label: o, value: o })) },
    { key: 'website', label: 'Website', type: 'text', col: 6, placeholder: 'https://example.com' },
    { key: 'city', label: 'City', type: 'select', col: 6, options: ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Kochi', 'Pune'].map(o => ({ label: o, value: o })) },
    { key: 'phone', label: 'Phone', type: 'tel', col: 6, placeholder: '10-digit mobile number' },
    { key: 'area', label: 'Area', type: 'text', col: 6, placeholder: 'e.g. T. Nagar' },
    { key: 'value', label: 'Lead value', type: 'number', col: 6 },
    { key: 'zip', label: 'Zip Code', type: 'text', col: 6 },
    { key: 'closureDate', label: 'Closure Date', type: 'date', col: 6 },
    { key: 'product', label: 'Product', type: 'select', col: 6, options: ['HRMS Subscription', 'Payroll Module', 'Attendance Module', 'Recruitment Module', 'Custom Development'].map(o => ({ label: o, value: o })) },
    { key: 'lat', label: 'Latitude (Google Maps)', type: 'text', col: 6 },
    { key: 'lng', label: 'Longitude (Google Maps)', type: 'text', col: 6 },
    { key: 'description', label: 'Description', type: 'textarea', col: 12, rows: 3 },
  ];

  // ===== page tabs =====
  setTab(tab: 'leads' | 'stats'): void {
    this.activeTab = tab;
  }

  // ===== modal openers =====
  openNewLead(): void {
    this.newLeadModal.open('add');
  }

  openImport(): void {
    this.importModal.open();
  }

  openDetail(lead: LeadRow): void {
    this.detailModal.open(lead);
  }

  onLeadSaved(evt: ModalSaveEvent): void {
    // TODO: call your leads API here
    console.log('lead saved', evt);
  }
}
