import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { Breadcrumb } from '../../../../shared/breadcrumb/breadcrumb';
import {
  EmployeeTicketService,
  EmployeeTicket,
  EmployeeTicketConversation
} from '../../../../services/employee-ticket.service';

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-employee-my-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SelectModule, Breadcrumb, AppStatCard],
  templateUrl: './employee-my-tickets.html',
  styleUrl: './employee-my-tickets.scss',
})
export class EmployeeMyTickets implements OnInit {
  public ticketService = inject(EmployeeTicketService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Filter & Search state
  activeKpiFilter: 'all' | 'open' | 'progress' | 'resolved' = 'all';
  filterCategory: string = '';
  filterStatus: string = '';
  searchTerm: string = '';

  categoryOptions: SelectOption[] = [];
  readonly statusOptions: SelectOption[] = [
    { label: 'All Statuses', value: '' },
    { label: 'Open', value: 'Open' },
    { label: 'Assigned', value: 'Assigned' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Waiting for Employee', value: 'Waiting for Employee' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Closed', value: 'Closed' },
    { label: 'Reopened', value: 'Reopened' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  readonly pageSizeOptions: SelectOption[] = [
    { label: '10', value: '10' },
    { label: '25', value: '25' },
    { label: '50', value: '50' }
  ];

  // Raw and filtered tickets
  myTickets: EmployeeTicket[] = [];

  // Ticket Detail Modal State
  selectedTicket: EmployeeTicket | null = null;
  isModalOpen: boolean = false;
  replyText: string = '';
  replyFileName: string | null = null;

  readonly statusFlow = [
    'Open',
    'Assigned',
    'In Progress',
    'Waiting for Employee',
    'Resolved',
    'Closed'
  ];

  readonly stepCaptions: Record<string, string> = {
    'Open': 'Ticket submitted',
    'Assigned': 'Assigned to department',
    'In Progress': 'Being worked on',
    'Waiting for Employee': 'Awaiting your reply',
    'Resolved': 'Issue resolved',
    'Closed': 'Ticket archived'
  };

  ngOnInit(): void {
    this.loadCategories();
    this.refreshTickets();

    // Check query params for deep link ?ticket=TKT-1001
    this.route.queryParams.subscribe(params => {
      const ticketId = params['ticket'];
      if (ticketId) {
        const found = this.ticketService.getTicket(ticketId);
        if (found) {
          this.openTicket(found);
        }
      }
    });
  }

  loadCategories(): void {
    const cats = this.ticketService.getCategories();
    this.categoryOptions = [
      { label: 'All Categories', value: '' },
      ...cats.map(c => ({
        label: `${c.icon} ${c.name}`,
        value: c.name
      }))
    ];
  }

  refreshTickets(): void {
    this.myTickets = this.ticketService.getMyTickets();
  }

  // KPI counts
  get kpiCounts() {
    let open = 0;
    let progress = 0;
    let resolved = 0;

    this.myTickets.forEach(t => {
      if (['Open', 'Assigned', 'Rejected', 'Cancelled', 'Reopened'].includes(t.status)) {
        open++;
      } else if (['In Progress', 'Waiting for Employee'].includes(t.status)) {
        progress++;
      } else {
        resolved++;
      }
    });

    return {
      all: this.myTickets.length,
      open,
      progress,
      resolved
    };
  }

  setKpiFilter(filter: 'all' | 'open' | 'progress' | 'resolved'): void {
    this.activeKpiFilter = filter;
    this.currentPage = 1;
  }

  onFilterChange(): void {
    this.currentPage = 1;
  }

  get filteredTickets(): EmployeeTicket[] {
    const q = this.searchTerm.trim().toLowerCase();
    const cat = this.filterCategory;
    const st = this.filterStatus;

    return this.myTickets.filter(t => {
      if (this.activeKpiFilter === 'open' && !['Open', 'Assigned', 'Reopened', 'Rejected', 'Cancelled'].includes(t.status)) {
        return false;
      }
      if (this.activeKpiFilter === 'progress' && !['In Progress', 'Waiting for Employee'].includes(t.status)) {
        return false;
      }
      if (this.activeKpiFilter === 'resolved' && !['Resolved', 'Closed'].includes(t.status)) {
        return false;
      }
      if (cat && t.category !== cat) {
        return false;
      }
      if (st && t.status !== st) {
        return false;
      }
      if (q && !(t.subject + ' ' + t.id).toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }

  get paginatedTickets(): EmployeeTicket[] {
    const list = this.filteredTickets;
    const start = (this.currentPage - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredTickets.length / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get startIndex(): number {
    return this.filteredTickets.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize - 1, this.filteredTickets.length);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange(val: string): void {
    this.pageSize = parseInt(val, 10) || 10;
    this.currentPage = 1;
  }

  resetDemoData(): void {
    this.ticketService.resetDemoData();
    this.loadCategories();
    this.refreshTickets();
    if (this.selectedTicket) {
      const refreshed = this.ticketService.getTicket(this.selectedTicket.id);
      this.selectedTicket = refreshed || null;
      if (!this.selectedTicket) {
        this.isModalOpen = false;
      }
    }
  }

  /* Modal operations */
  openTicket(ticket: EmployeeTicket): void {
    this.selectedTicket = ticket;
    this.replyText = '';
    this.replyFileName = null;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedTicket = null;
    this.replyText = '';
    this.replyFileName = null;
  }

  get currentTicketSlaState(): 'ok' | 'at-risk' | 'breached' {
    if (!this.selectedTicket) return 'ok';
    return this.ticketService.slaState(this.selectedTicket);
  }

  getStepperIndex(status: string): number {
    return this.statusFlow.indexOf(status);
  }

  isSpecialStatus(status: string): boolean {
    return ['Rejected', 'Cancelled', 'Reopened'].includes(status);
  }

  reopenTicket(): void {
    if (!this.selectedTicket) return;
    const updated = this.ticketService.updateTicket(this.selectedTicket.id, {
      status: 'Reopened'
    });
    if (updated) {
      this.selectedTicket = updated;
      this.refreshTickets();
    }
  }

  onReplyFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.replyFileName = input.files[0].name;
    }
  }

  removeReplyFile(): void {
    this.replyFileName = null;
  }

  sendReply(): void {
    if (!this.selectedTicket || !this.replyText.trim()) return;

    const updated = this.ticketService.addReply(
      this.selectedTicket.id,
      this.replyText.trim(),
      this.replyFileName,
      false
    );

    if (updated) {
      this.selectedTicket = updated;
      this.replyText = '';
      this.replyFileName = null;
      this.refreshTickets();
    }
  }

  onReplyKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendReply();
    }
  }

  getAvatarColor(name: string): string {
    const colors = ['var(--blue-550)', 'var(--purple-550)', 'var(--green-550)', 'var(--orange-550)', 'var(--red-550)', 'var(--pink-600)'];
    return colors[name.length % colors.length];
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(p => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
