import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeDataTable, PrimeTableColumn } from '../../../../shared/primedatatable/primedatatable';

declare var bootstrap: any;

export interface ProposalRow {
  no: string;
  subject: string;
  total: string;
  date: string;
  openTill: string;
  tags: string[];
  dateCreated: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
}

export interface LeadRow {
  id: number;
  name: string;
  company: string;
  enquiryCode: string;
  country: string;
  stagePct: number;
  nextReminder: string;
  closureDate: string;
  phone: string;
  product: string;
  value: string;
  tags: string[];
  assigned: string;
  sourcer: string;
  status: string;
  source: string;
  lastContact: string;
  created: string;
  profession: string;
  leadScore: string;
  position?: string;
  email?: string;
  address?: string;
  state?: string;
  city?: string;
  zip?: string;
}

type LdTab = 'profile' | 'proposals' | 'appointments' | 'tasks' | 'attachments' | 'reminders' | 'notes' | 'activity' | 'score' | 'emails';

@Component({
  selector: 'app-lead-detail-modal',
  standalone: true,
  imports: [CommonModule, PrimeDataTable],
  templateUrl: './lead-detail-modal.html',
  styleUrl: './lead-detail-modal.scss',
})
export class LeadDetailModal implements AfterViewInit {
  @ViewChild('modalRoot') modalRoot!: ElementRef;
  private modalInstance: any;

  lead: LeadRow | null = null;
  activeTab: LdTab = 'profile';

  tabs: { id: LdTab; label: string; badge?: number }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'proposals', label: 'Proposals', badge: 1 },
    { id: 'appointments', label: 'Appointments' },
    { id: 'tasks', label: 'Tasks', badge: 1 },
    { id: 'attachments', label: 'Attachments', badge: 1 },
    { id: 'reminders', label: 'Reminders' },
    { id: 'notes', label: 'Notes', badge: 1 },
    { id: 'activity', label: 'Activity Log' },
    { id: 'score', label: 'Lead Score' },
    { id: 'emails', label: 'Email Log' },
  ];

  // TODO: replace with real data from your API, scoped to the open lead's id
  proposals: ProposalRow[] = [
    { no: 'PRO-147', subject: 'New Proposal', total: '₹0.00', date: '17-09-2026', openTill: '24-09-2026', tags: [], dateCreated: '17-09-2026 15:52:49', status: 'Draft' },
    { no: 'PRO-145', subject: 'Solar Panel Installation 10 x 10', total: '₹1,18,000.00', date: '09-09-2026', openTill: '16-09-2026', tags: [], dateCreated: '09-09-2026 14:39:25', status: 'Accepted' },
    { no: 'PRO-140', subject: 'Product', total: '₹5,407.50', date: '21-08-2026', openTill: '28-08-2026', tags: [], dateCreated: '21-08-2026 14:13:03', status: 'Accepted' },
  ];

  proposalColumns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', width: '70px' },
    { field: 'no', header: 'Proposal #', sortable: true, cellClass: 'text-link' },
    { field: 'subject', header: 'Subject', sortable: true },
    { field: 'total', header: 'Total', sortable: true },
    { field: 'date', header: 'Date', sortable: true },
    { field: 'openTill', header: 'Open Till', sortable: true },
    { field: 'tags', header: 'Tags', type: 'custom' },
    { field: 'dateCreated', header: 'Date Created', sortable: true },
    {
      field: 'status', header: 'Status', type: 'status', sortable: true,
      colorMap: { Draft: 'var(--orange-300)', Sent: 'var(--blue-550)', Accepted: 'var(--green-400-2)', Rejected: 'var(--danger)' },
    },
  ];

  appointments: { title: string; date: string; with: string }[] = [];
  tasks = [{ title: 'Follow up call', due: '20-09-2026', done: false }];
  attachments = [{ name: 'requirements.pdf', size: '1.2 MB' }];
  reminders: { date: string; note: string }[] = [];
  notes = [{ author: 'GHARUDA SOFTWARE', date: '17-09-2026', text: 'Discussed pricing, awaiting approval.' }];

  ngAfterViewInit(): void {
    this.modalInstance = bootstrap.Modal.getOrCreateInstance(this.modalRoot.nativeElement, { backdrop: 'static' });
  }

  open(lead: LeadRow): void {
    this.lead = lead;
    this.activeTab = 'profile';
    this.modalInstance?.show();
  }

  close(): void {
    this.modalInstance?.hide();
  }

  setTab(tab: LdTab): void {
    this.activeTab = tab;
  }

  /**
   * Opens the proposal print/quotation view in a new tab.
   * The original PHP built this from a large inline string-HTML generator
   * (apBuildQuotationHtml / apBuildProposalViewHtml, ~3k lines of markup).
   * Port that generator here (or, better, render it server-side / as a
   * dedicated print component) rather than string-building it in TS.
   */
  viewProposal(_proposalNo: string): void {
    // TODO: wire up proposal print view
    console.log('view proposal', _proposalNo);
  }

  onProposalRowClick(row: ProposalRow): void {
    this.viewProposal(row.no);
  }

  newProposal(): void {
    // TODO: open blank proposal builder
    console.log('new proposal for lead', this.lead?.id);
  }

  automaticProposal(): void {
    // TODO: generate proposal from lead's items
    console.log('automatic proposal for lead', this.lead?.id);
  }

  manualProposal(): void {
    // TODO: open manual proposal builder
    console.log('manual proposal for lead', this.lead?.id);
  }

  syncData(): void {
    // TODO: re-sync proposal data from source system
    console.log('sync data for lead', this.lead?.id);
  }
}
