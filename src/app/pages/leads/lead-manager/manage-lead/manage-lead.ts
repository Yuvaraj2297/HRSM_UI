import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeDataTable, PrimeTableColumn, PrimeTableRowAction } from '../../../../shared/primedatatable/primedatatable';


/* =========================================================
   MODELS
========================================================= */

export interface Lead {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  assigned: string;
  status: string;
  lastContact: string;
  nextFollow: string;
  created: string;
  remark: string;
  leadScore: number;
  source: string;
  year: string;
  month: string;
}

interface LeadActivity {
  type: 'call' | 'sms' | 'recordings' | 'conference' | 'remarks';
  label: string;
  text: string;
  when: string;
  by: string;
  direction: string;
  recorded: string;
}

interface RemarkItem {
  text: string;
  when: string;
  by: string;
}

type LeadViewTab = 'all' | 'call' | 'sms' | 'recordings' | 'conference' | 'remarks';

const STATUS_OPTIONS = [
  'Lead',
  'Quotation',
  'Followup',
  'Qualified',
  'DIRECT',
  'New Enquiry',
  'New',
  'Customer',
  'Waiting for Response',
];

/* =========================================================
   COMPONENT
========================================================= */

@Component({
  selector: 'app-manage-lead',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimeDataTable],
  templateUrl: './manage-lead.html',
  styleUrl: './manage-lead.scss',
})
export class ManageLead implements OnInit {
 

  leads: Lead[] = [
    {
      id: 172,
      name: 'f',
      company: '',
      phone: '',
      email: 'f.contact@gharuda-hrms.in',
      assigned: 'GHRAUDA SOFTWARE',
      status: 'Lead',
      lastContact: '3 days ago',
      nextFollow: 'No',
      created: '3 days ago',
      remark: '',
      leadScore: 0,
      source: 'Direct',
      year: '2026',
      month: 'September',
    },
    {
      id: 171,
      name: 'MOHAN',
      company: 'GG COMPANY',
      phone: '9677063368',
      email: 'mohan@ggcompany.com',
      assigned: 'GHRAUDA SOFTWARE',
      status: 'New',
      lastContact: '23 hrs ago',
      nextFollow: 'No',
      created: '6 days ago',
      remark: 'New enquiry from website',
      leadScore: 0,
      source: 'Website Form',
      year: '2026',
      month: 'September',
    },
    {
      id: 170,
      name: 'Sample Data',
      company: 'Sample Data',
      phone: 'Sample Data',
      email: 'sample.data@gharuda-hrms.in',
      assigned: 'GHRAUDA SOFTWARE',
      status: 'Quotation',
      lastContact: '',
      nextFollow: 'No',
      created: '4 weeks ago',
      remark: 'Quotation shared',
      leadScore: 0,
      source: 'Indiamart',
      year: '2026',
      month: 'August',
    },
    {
      id: 169,
      name: 'test',
      company: 'q',
      phone: '8015603089',
      email: 'test.q@gharuda-hrms.in',
      assigned: 'GHRAUDA SOFTWARE',
      status: 'Lead',
      lastContact: '4 weeks ago',
      nextFollow: 'No',
      created: '4 weeks ago',
      remark: '',
      leadScore: 0,
      source: 'Direct',
      year: '2026',
      month: 'August',
    },
    {
      id: 168,
      name: 'Vasanth',
      company: 'Tgk TEST',
      phone: '09003247271',
      email: 'vasanth@tgktest.com',
      assigned: 'GHRAUDA SOFTWARE',
      status: 'Lead',
      lastContact: '4 weeks ago',
      nextFollow: 'No',
      created: '4 weeks ago',
      remark: 'Interested in basic plan',
      leadScore: 0,
      source: 'Website Form',
      year: '2026',
      month: 'August',
    },
    {
      id: 167,
      name: 'QA TEST ENGINEER',
      company: 'TGK',
      phone: '8015',
      email: 'qa.engineer@tgk.com',
      assigned: 'GHRAUDA SOFTWARE',
      status: 'New',
      lastContact: '4 weeks ago',
      nextFollow: 'No',
      created: '4 weeks ago',
      remark: '',
      leadScore: 0,
      source: 'Referral',
      year: '2026',
      month: 'August',
    },
    {
      id: 166,
      name: 'Suresh',
      company: 'ghrA SOFTWARE TECHNOLOGY',
      phone: '9876543218',
      email: 'suresh@ghratechnology.com',
      assigned: 'GHRAUDA SOFTWARE',
      status: 'Followup',
      lastContact: '17 hrs ago',
      nextFollow: 'No',
      created: 'a month ago',
      remark: 'Payment follow-up pending',
      leadScore: 0,
      source: 'Indiamart',
      year: '2026',
      month: 'August',
    },
    {
      id: 116,
      name: 'Hamid/ Mehdi',
      company: 'Kings Wharf/ Fares',
      phone: '',
      email: 'hamid.mehdi@kingswharf.com',
      assigned: 'GHRAUDA SOFTWARE',
      status: 'Lead',
      lastContact: '',
      nextFollow: 'No',
      created: 'a month ago',
      remark: 'Import enquiry',
      leadScore: 0,
      source: 'Referral',
      year: '2026',
      month: 'August',
    },
    {
      id: 117,
      name: 'James',
      company: 'Morrison Hershfield',
      phone: '',
      email: 'james@morrisonhershfield.com',
      assigned: 'GHRAUDA SOFTWARE',
      status: 'Lead',
      lastContact: '',
      nextFollow: 'No',
      created: '10 months ago',
      remark: '',
      leadScore: 0,
      source: 'Direct',
      year: '2025',
      month: 'December',
    },
    {
      id: 118,
      name: 'Priya Sundar',
      company: 'Sundar Enterprises',
      phone: '9840011223',
      email: 'priya@sundarenterprises.com',
      assigned: 'GHRAUDA SOFTWARE',
      status: 'Quotation',
      lastContact: '2 days ago',
      nextFollow: 'No',
      created: 'a month ago',
      remark: 'Solar package quotation',
      leadScore: 0,
      source: 'Exhibition',
      year: '2026',
      month: 'July',
    },
    {
      id: 119,
      name: 'Karthik Raja',
      company: 'KR Traders',
      phone: '9884455667',
      email: 'karthik@krtraders.in',
      assigned: 'GHRAUDA SOFTWARE',
      status: 'New',
      lastContact: '5 days ago',
      nextFollow: 'No',
      created: '2 months ago',
      remark: '',
      leadScore: 0,
      source: 'Indiamart',
      year: '2026',
      month: 'July',
    },
    {
      id: 120,
      name: 'Lakshmi Pharma',
      company: 'Lakshmi Pharma',
      phone: '9884200088',
      email: 'info@lakshmipharma.in',
      assigned: 'GHRAUDA SOFTWARE',
      status: 'Followup',
      lastContact: '1 week ago',
      nextFollow: 'No',
      created: '14 months ago',
      remark: 'AMC renewal discussion',
      leadScore: 0,
      source: 'Website Form',
      year: '2025',
      month: 'July',
    },
  ];

  /** unfiltered base snapshot used by the filter panel */
  private baseLeads: Lead[] = [];

  tableData: Lead[] = [];

  statusOptions = STATUS_OPTIONS;

  header = { title: '', icon: '' }; // header row is custom-built in HTML, not via PrimeDataTable

  searchPlaceholder = 'Search leads...';

  /* =======================================================
     TABLE COLUMNS
  ======================================================== */



 columns: PrimeTableColumn[] = [
  { field: 'id', header: '#', sortable: true, width: '60px' },
  { field: 'name', header: 'Name', sortable: true, type: 'link' },

  {
    field: 'leadManager', // was 'assigned' — collided with the Assigned column below
    header: 'Lead Manager',
    type: 'pill-actions',
    buttons: [
      { key: 'sms', icon: 'bi bi-chat-dots-fill', variant: 'outline', color: 'var(--primary)', tooltip: 'SMS' },
      { key: 'mail', icon: 'bi bi-envelope-fill', variant: 'outline', color: 'var(--primary)', tooltip: 'Email' },
    ],
  },

  { field: 'company', header: 'Company', sortable: true },
  { field: 'phone', header: 'Phone', type: 'custom' },
  { field: 'assigned', header: 'Assigned', type: 'custom' },
  { field: 'status', header: 'Status', sortable: true, type: 'custom' },
  { field: 'lastContact', header: 'Last Contact' },
  { field: 'nextFollow', header: 'Next Follow up', type: 'custom' },
  { field: 'created', header: 'Created' },

  {
    field: 'remark',
    header: 'Remark',
    type: 'pill-actions',
    buttons: [
      { key: 'remarkDoc', icon: 'bi bi-file-earmark-text-fill', variant: 'outline', color: 'var(--warning)', tooltip: 'View / Edit remark' },
      { key: 'remarkEye', icon: 'bi bi-eye-fill', variant: 'outline', color: 'var(--primary)', tooltip: 'View remark' },
    ],
  },

  { field: 'leadScore', header: 'Lead Score', sortable: true },

  {
    field: 'action',
    header: 'Action',
    type: 'pill-actions',
    width: '130px',
    buttons: [
      { key: 'view', icon: 'bi bi-eye-fill', variant: 'outline', color: 'var(--primary)', tooltip: 'View lead' },
      { key: 'delete', icon: 'bi bi-trash-fill', variant: 'outline', color: 'var(--danger)', tooltip: 'Delete lead' },
      { key: 'mail', icon: 'bi bi-envelope-fill', variant: 'outline', color: 'var(--warning)', tooltip: 'Send to Email' },
    ],
  },
];

  rowActions: PrimeTableRowAction[] = [];

  /* =======================================================
     SELECTION (for bulk SMS)
  ======================================================== */

  selectedLeads: Lead[] = [];

  get selectedCount(): number {
    return this.selectedLeads.length;
  }

  /* =======================================================
     FILTERS
  ======================================================== */

  filtersOpen = false;

  filters = {
    search: '',
    status: '',
    assigned: '',
    source: '',
    year: '',
  };

  applied = { search: '', status: '', assigned: '', source: '', year: '' };

  get statusFilterOptions(): string[] {
    return this.uniq(this.baseLeads.map((l) => l.status));
  }

  get assignedFilterOptions(): string[] {
    return this.uniq(this.baseLeads.map((l) => l.assigned));
  }

  get sourceFilterOptions(): string[] {
    return this.uniq(this.baseLeads.map((l) => l.source));
  }

  get yearFilterOptions(): string[] {
    return this.uniq(this.baseLeads.map((l) => l.year));
  }

  get activeFilterChips(): { key: string; label: string; value: string }[] {
    const labels: Record<string, string> = {
      search: 'Search',
      status: 'Status',
      assigned: 'Assigned',
      source: 'Source',
      year: 'Year',
    };
    return (Object.keys(this.applied) as (keyof typeof this.applied)[])
      .filter((k) => this.applied[k])
      .map((k) => ({ key: k, label: labels[k], value: this.applied[k] }));
  }

  private uniq(values: string[]): string[] {
    return Array.from(new Set(values.filter(Boolean))).sort();
  }

  /* =======================================================
     BULK SMS MODAL
  ======================================================== */

  isBulkSmsOpen = false;
  bulkSmsMessage = '';
  bulkSmsSending = false;

  /* =======================================================
     SINGLE SMS MODAL
  ======================================================== */

  isSmsOpen = false;
  smsTargetLead: Lead | null = null;
  smsMessage = '';
  smsSending = false;

  /* =======================================================
     COMPOSE EMAIL MODAL
  ======================================================== */

  isEmailOpen = false;
  emailSmtp = 'USE SYSTEM SMTP ( info@gharuda-hrms.in )';
  emailTemplate = '';
  emailTo = '';
  emailCc = '';
  emailSubject = '';
  emailBody = '';
  emailAttachments: File[] = [];
  emailSending = false;

  emailTemplates: Record<string, string> = {
    'Standard Quotation':
      'Dear Customer,\n\nPlease find our standard quotation attached.\n\nKind Regards,\nGHARUDA SOFTWARE',
    'Solar Installation':
      'Dear Customer,\n\nThank you for your interest in our solar installation services.\n\nKind Regards,\nGHARUDA SOFTWARE',
  };

  /* =======================================================
     ADD REMARK MODAL
  ======================================================== */

  isRemarkOpen = false;
  remarkTargetLead: Lead | null = null;
  remarkMessage = '';
  remarkFollowUp = '';
  remarkSaving = false;

  /* =======================================================
     REMARKS VIEW MODAL
  ======================================================== */

  isRemarksViewOpen = false;
  remarksViewLead: Lead | null = null;
  remarksViewItems: RemarkItem[] = [];

  /* =======================================================
     LEAD VIEW MODAL (tabs + activity timeline)
  ======================================================== */

  isViewLeadOpen = false;
  viewLead: Lead | null = null;
  viewActiveTab: LeadViewTab = 'all';

  viewTabs: { key: LeadViewTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'call', label: 'Call Details' },
    { key: 'sms', label: 'Sms' },
    { key: 'recordings', label: 'Recordings' },
    { key: 'conference', label: 'Conference call' },
    { key: 'remarks', label: 'Remarks' },
  ];

  /* =======================================================
     INIT
  ======================================================== */

  ngOnInit(): void {
    this.baseLeads = [...this.leads];
    this.tableData = [...this.leads];
  }

  /* =======================================================
     STATUS PILL CLASS
  ======================================================== */

  statusClass(status: string): string {
    if (status === 'New') return 'ml-st-new';
    if (status === 'Followup') return 'ml-st-followup';
    return '';
  }

  changeStatus(row: Lead, status: string): void {
    row.status = status;
    this.tableData = this.tableData.map((l) => (l.id === row.id ? { ...l, status } : l));
  }

  /* =======================================================
     TABLE ACTION HANDLER
  ======================================================== */

  onTableAction(event: { action: string; row: Lead }): void {
    const { action, row } = event;

    switch (action) {
      case 'view':
        this.openViewLead(row);
        break;

      case 'delete':
        this.deleteLead(row);
        break;

      case 'mail':
        this.openComposeEmail(row);
        break;

      case 'sms':
        this.openSms(row);
        break;

      case 'remarkDoc':
        this.openRemark(row);
        break;

      case 'remarkEye':
        this.openRemarksView(row);
        break;
    }
  }

  deleteLead(row: Lead): void {
    const ok = confirm(
      `Are you sure you want to delete Lead #${row.id}${row.name ? ' — ' + row.name : ''}?`,
    );
    if (!ok) return;

    this.leads = this.leads.filter((l) => l.id !== row.id);
    this.baseLeads = this.baseLeads.filter((l) => l.id !== row.id);
    this.tableData = this.tableData.filter((l) => l.id !== row.id);
  }

  /* =======================================================
     SELECTION / BULK SMS
  ======================================================== */

  onSelectionChange(selection: Lead[]): void {
    this.selectedLeads = selection || [];
  }

  openBulkSms(): void {
    if (!this.selectedCount) return;
    this.bulkSmsMessage = '';
    this.isBulkSmsOpen = true;
  }

  closeBulkSms(): void {
    this.isBulkSmsOpen = false;
  }

  confirmBulkSms(): void {
    if (!this.bulkSmsMessage.trim()) {
      alert('Please type a message.');
      return;
    }

    this.bulkSmsSending = true;

    setTimeout(() => {
      this.bulkSmsSending = false;
      this.isBulkSmsOpen = false;
      alert(`✅ Bulk SMS sent to ${this.selectedCount} lead(s).`);
      this.bulkSmsMessage = '';
      this.selectedLeads = [];
    }, 800);
  }

  /* =======================================================
     SINGLE SMS
  ======================================================== */

  openSms(row: Lead): void {
    this.smsTargetLead = row;
    this.smsMessage = '';
    this.isSmsOpen = true;
  }

  closeSms(): void {
    this.isSmsOpen = false;
    this.smsTargetLead = null;
  }

  sendSms(): void {
    if (!this.smsMessage.trim()) {
      alert('Please type a message.');
      return;
    }

    this.smsSending = true;

    setTimeout(() => {
      this.smsSending = false;
      const target = this.smsTargetLead;
      this.isSmsOpen = false;
      alert(`✅ SMS sent — #${target?.id}${target?.name ? ' - ' + target.name : ''}.`);
      this.smsMessage = '';
      this.smsTargetLead = null;
    }, 800);
  }

  /* =======================================================
     COMPOSE EMAIL
  ======================================================== */

  openComposeEmail(row?: Lead): void {
    this.emailTemplate = '';
    this.emailTo = row?.email ?? '';
    this.emailCc = '';
    this.emailSubject = row ? `Lead #${row.id}${row.name ? ' - ' + row.name : ''}` : '';
    this.emailBody = '';
    this.emailAttachments = [];
    this.isEmailOpen = true;
  }

  closeComposeEmail(): void {
    this.isEmailOpen = false;
  }

  onEmailTemplateChange(): void {
    this.emailBody = this.emailTemplates[this.emailTemplate] ?? '';
  }

  onEmailAttachmentsSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.emailAttachments = [...this.emailAttachments, ...Array.from(input.files)];
    input.value = '';
  }

  removeEmailAttachment(index: number): void {
    this.emailAttachments = this.emailAttachments.filter((_, i) => i !== index);
  }

  get emailToOptions(): Lead[] {
    return this.leads.filter((l) => !!l.email);
  }

  sendEmail(): void {
    if (!this.emailTo) {
      alert('Please select Email To.');
      return;
    }

    if (!this.emailSubject.trim()) {
      alert('Email Subject is required.');
      return;
    }

    this.emailSending = true;

    setTimeout(() => {
      this.emailSending = false;
      this.isEmailOpen = false;

      const toLead = this.emailToOptions.find((l) => l.email === this.emailTo);
      alert(
        `✅ Email sent to ${toLead ? toLead.name + ' ( ' + toLead.email + ' )' : this.emailTo}.`,
      );

      this.emailTo = '';
      this.emailCc = '';
      this.emailSubject = '';
      this.emailBody = '';
      this.emailTemplate = '';
      this.emailAttachments = [];
    }, 900);
  }

  /* =======================================================
     ADD REMARK
  ======================================================== */

  openRemark(row: Lead): void {
    this.remarkTargetLead = row;
    this.remarkMessage = row.remark || '';
    this.remarkFollowUp = '';
    this.isRemarkOpen = true;
  }

  closeRemark(): void {
    this.isRemarkOpen = false;
    this.remarkTargetLead = null;
  }

  saveRemark(): void {
    if (!this.remarkMessage.trim()) {
      alert('Please enter a remark message.');
      return;
    }

    this.remarkSaving = true;

    setTimeout(() => {
      this.remarkSaving = false;

      if (this.remarkTargetLead) {
        const id = this.remarkTargetLead.id;
        const message = this.remarkMessage.trim();
        const followUp = this.remarkFollowUp;

        this.leads = this.leads.map((l) =>
          l.id === id ? { ...l, remark: message, nextFollow: followUp || l.nextFollow } : l,
        );
        this.baseLeads = this.baseLeads.map((l) =>
          l.id === id ? { ...l, remark: message, nextFollow: followUp || l.nextFollow } : l,
        );
        this.tableData = this.tableData.map((l) =>
          l.id === id ? { ...l, remark: message, nextFollow: followUp || l.nextFollow } : l,
        );
      }

      this.isRemarkOpen = false;
      this.remarkTargetLead = null;
      this.remarkMessage = '';
      this.remarkFollowUp = '';
      alert('✅ Remark saved successfully.');
    }, 300);
  }

  /* =======================================================
     REMARKS VIEW (history)
  ======================================================== */

  openRemarksView(row: Lead): void {
    this.remarksViewLead = row;

    const items: RemarkItem[] = [];

    if (row.remark) {
      items.push({ text: row.remark, when: '17 MINUTES AGO', by: row.assigned });
    }

    items.push(
      {
        text: 'Customer requested revised quotation with GST breakdown',
        when: 'AN HOUR AGO',
        by: row.assigned,
      },
      {
        text: 'Discussed payment terms — 50% advance confirmed',
        when: '5 HOURS AGO',
        by: row.assigned,
      },
      {
        text: 'Site visit scheduled for next week inspection',
        when: 'YESTERDAY',
        by: row.assigned,
      },
      { text: 'Initial enquiry received from Indiamart', when: '2 DAYS AGO', by: row.assigned },
      { text: 'Lead assigned and first contact made', when: '3 DAYS AGO', by: row.assigned },
    );

    this.remarksViewItems = items;
    this.isRemarksViewOpen = true;
  }

  closeRemarksView(): void {
    this.isRemarksViewOpen = false;
    this.remarksViewLead = null;
  }

  initials(name: string): string {
    return (name || '')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 4)
      .toUpperCase();
  }

  /* =======================================================
     LEAD VIEW MODAL — activity timeline
  ======================================================== */

  openViewLead(row: Lead): void {
    this.viewLead = row;
    this.viewActiveTab = 'all';
    this.isViewLeadOpen = true;
  }

  closeViewLead(): void {
    this.isViewLeadOpen = false;
    this.viewLead = null;
  }

  setViewTab(tab: LeadViewTab): void {
    this.viewActiveTab = tab;
  }

  get viewActivities(): LeadActivity[] {
    if (!this.viewLead) return [];

    const lead = this.viewLead;

    return [
      {
        type: 'remarks',
        label: 'REMARKS',
        text: lead.remark || 'Lead created and under follow-up',
        when: '17 minutes ago',
        by: lead.assigned,
        direction: 'Outgoing',
        recorded: 'No',
      },
      {
        type: 'call',
        label: 'CALL DETAILS',
        text: 'Call duration 4m 32s',
        when: '2 hours ago',
        by: lead.assigned,
        direction: 'Outgoing',
        recorded: 'Yes',
      },
      {
        type: 'call',
        label: 'CALL DETAILS',
        text: 'Call duration 1m 08s',
        when: '1 day ago',
        by: lead.assigned,
        direction: 'Incoming',
        recorded: 'No',
      },
      {
        type: 'sms',
        label: 'SMS',
        text: 'Quotation details shared via SMS',
        when: '2 days ago',
        by: lead.assigned,
        direction: 'Outgoing',
        recorded: 'No',
      },
      {
        type: 'recordings',
        label: 'RECORDING',
        text: `call-recording-${lead.id}-0214.mp3`,
        when: '3 days ago',
        by: lead.assigned,
        direction: 'Outgoing',
        recorded: 'Yes',
      },
      {
        type: 'conference',
        label: 'CONFERENCE CALL',
        text: 'Conference with 3 participants (20 min)',
        when: '5 days ago',
        by: lead.assigned,
        direction: 'Outgoing',
        recorded: 'Yes',
      },
      {
        type: 'remarks',
        label: 'REMARKS',
        text: 'Customer asked for revised pricing',
        when: '1 week ago',
        by: lead.assigned,
        direction: 'Outgoing',
        recorded: 'No',
      },
    ];
  }

  get filteredActivities(): LeadActivity[] {
    const acts = this.viewActivities;
    return this.viewActiveTab === 'all' ? acts : acts.filter((a) => a.type === this.viewActiveTab);
  }

  tabCount(tab: LeadViewTab): number {
    const acts = this.viewActivities;
    return tab === 'all' ? acts.length : acts.filter((a) => a.type === tab).length;
  }

  activityIcon(type: LeadActivity['type']): string {
    const map: Record<LeadActivity['type'], string> = {
      call: 'bi-telephone-fill',
      sms: 'bi-chat-dots-fill',
      recordings: 'bi-mic-fill',
      conference: 'bi-people-fill',
      remarks: 'bi-sticky-fill',
    };
    return map[type];
  }

  activityColor(type: LeadActivity['type']): string {
    const map: Record<LeadActivity['type'], string> = {
      call: 'var(--blue-550)',
      sms: 'var(--purple-500)',
      recordings: 'var(--warning)',
      conference: 'var(--pink-450)',
      remarks: 'var(--primary)',
    };
    return map[type];
  }

  /* =======================================================
     FILTERS PANEL
  ======================================================== */

  toggleFilters(): void {
    this.filtersOpen = !this.filtersOpen;
  }

  applyFilters(): void {
    this.applied = { ...this.filters };

    this.tableData = this.baseLeads.filter((lead) => {
      if (this.applied.search) {
        const q = this.applied.search.toLowerCase();
        const hay = `${lead.name} ${lead.company} ${lead.phone} ${lead.email}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (this.applied.status && lead.status !== this.applied.status) return false;
      if (this.applied.assigned && lead.assigned !== this.applied.assigned) return false;
      if (this.applied.source && lead.source !== this.applied.source) return false;
      if (this.applied.year && lead.year !== this.applied.year) return false;
      return true;
    });
  }

  clearFilters(): void {
    this.filters = { search: '', status: '', assigned: '', source: '', year: '' };
    this.applyFilters();
  }

  removeFilterChip(key: string): void {
    (this.filters as any)[key] = '';
    this.applyFilters();
  }
}
