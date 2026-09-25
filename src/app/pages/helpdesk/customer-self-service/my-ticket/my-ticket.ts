import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SelectModule } from 'primeng/select';
import {
  CustomerTicketService,
  CustomerTicket,
  TicketProject,
  TicketIssueType
} from '../../../../services/customer-ticket.service';

interface StepItem {
  name: string;
  isDone: boolean;
  isCurrent: boolean;
  caption: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-my-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SelectModule],
  templateUrl: './my-ticket.html',
  styleUrl: './my-ticket.scss',
})
export class MyTicket implements OnInit {
  @ViewChild('chatScroll') chatScrollRef?: ElementRef<HTMLDivElement>;

  allTickets: CustomerTicket[] = [];
  filteredTickets: CustomerTicket[] = [];

  projects: TicketProject[] = [];
  issueTypes: TicketIssueType[] = [];

  projectOptions: SelectOption[] = [];
  issueOptions: SelectOption[] = [];
  priorityOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [];

  readonly priorities = ['Low', 'Medium', 'High', 'Critical'];
  readonly statuses = [
    'New',
    'Assigned',
    'In Progress',
    'Waiting for Customer',
    'Resolved',
    'Closed',
    'Reopened'
  ];

  filterProject = '';
  filterIssue = '';
  filterPriority = '';
  filterStatus = '';
  searchQuery = '';

  // Modal view
  isModalOpen = false;
  currentTicket: CustomerTicket | null = null;
  replyText = '';

  // Toast
  toastMessage = '';
  isToastVisible = false;
  private toastTimer?: any;

  constructor(
    public ticketService: CustomerTicketService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projects = this.ticketService.getProjects();
    this.issueTypes = this.ticketService.issueTypes;
    this.initFilterOptions();
    this.loadTickets();

    // Check for deep link query param: ?ticket=TKT-2001
    this.route.queryParams.subscribe(params => {
      const ticketId = params['ticket'];
      if (ticketId) {
        const match = this.allTickets.find(t => t.id.toLowerCase() === ticketId.toLowerCase());
        if (match) {
          this.openTicket(match);
        }
      }
    });
  }

  initFilterOptions(): void {
    this.projectOptions = [
      { label: 'All Projects', value: '' },
      ...this.projects.map(p => ({ label: `${p.icon} ${p.name}`, value: p.id }))
    ];

    this.issueOptions = [
      { label: 'All Issue Types', value: '' },
      ...this.issueTypes.map(i => ({ label: `${i.icon} ${i.name}`, value: i.name }))
    ];

    this.priorityOptions = [
      { label: 'All Priorities', value: '' },
      ...this.priorities.map(pr => ({ label: pr, value: pr }))
    ];

    this.statusOptions = [
      { label: 'All Statuses', value: '' },
      ...this.statuses.map(st => ({ label: st, value: st }))
    ];
  }

  loadTickets(): void {
    this.allTickets = this.ticketService.getMyTickets();
    this.applyFilters();
  }

  applyFilters(): void {
    const q = (this.searchQuery || '').trim().toLowerCase();
    const pj = this.filterProject || '';
    const it = this.filterIssue || '';
    const pr = this.filterPriority || '';
    const st = this.filterStatus || '';

    this.filteredTickets = this.allTickets.filter(t => {
      if (pj && t.projectId !== pj) return false;
      if (it && t.issueType !== it) return false;
      if (pr && t.priority !== pr) return false;
      if (st && t.status !== st) return false;
      if (q) {
        const combined = `${t.id} ${t.subject} ${t.issueType} ${t.projectName}`.toLowerCase();
        if (!combined.includes(q)) return false;
      }
      return true;
    });
  }

  openTicket(ticket: CustomerTicket): void {
    // Refresh latest ticket state from service
    const fresh = this.ticketService.getTicket(ticket.id) || ticket;
    this.currentTicket = fresh;
    this.replyText = '';
    this.isModalOpen = true;
    setTimeout(() => this.scrollChatToBottom(), 50);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.currentTicket = null;
    this.replyText = '';
  }

  getStepper(ticket: CustomerTicket): StepItem[] {
    const flow = ['New', 'Assigned', 'In Progress', 'Resolved'];
    const currentIdx = flow.indexOf(ticket.status);
    const idx = currentIdx === -1 ? 2 : currentIdx;

    const captions: Record<string, string> = {
      'New': 'We received your ticket',
      'Assigned': 'Routed to a team',
      'In Progress': 'Team is working',
      'Resolved': 'Fixed & verified'
    };

    return flow.map((s, i) => {
      const isDone = i < idx;
      const isCurrent = i === idx;
      let cap = '';
      if (isCurrent) {
        cap = ticket.status === 'Waiting for Customer'
          ? 'Awaiting your confirmation'
          : captions[s];
      }
      return {
        name: s,
        isDone,
        isCurrent,
        caption: cap
      };
    });
  }

  avatarColor(name: string): string {
    const colors = ['var(--blue-550)', 'var(--purple-550)', 'var(--green-550)', 'var(--orange-550)', 'var(--red-550)', 'var(--pink-600)', 'var(--teal-350)'];
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

  dayLabel(ts: string): string {
    const d = new Date(ts);
    const today = new Date();
    const yest = new Date(Date.now() - 86400000);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yest.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
  }

  shouldShowDaySep(idx: number): boolean {
    if (!this.currentTicket || !this.currentTicket.conversation) return false;
    if (idx === 0) return true;
    const prev = new Date(this.currentTicket.conversation[idx - 1].ts).toDateString();
    const curr = new Date(this.currentTicket.conversation[idx].ts).toDateString();
    return prev !== curr;
  }

  formatDue(dueIso: string): string {
    const due = new Date(dueIso);
    return `${due.toLocaleDateString([], { day: '2-digit', month: 'short' })} · ${due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  sendReply(): void {
    if (!this.currentTicket) return;
    const text = this.replyText.trim();
    if (!text) return;

    this.ticketService.addReply(this.currentTicket.id, text, null, false);
    this.replyText = '';
    this.loadTickets();

    this.currentTicket = this.ticketService.getTicket(this.currentTicket.id) || null;
    setTimeout(() => this.scrollChatToBottom(), 50);
    this.showToast(`Reply sent on ${this.currentTicket?.id}`);
  }

  onReplyKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendReply();
    }
  }

  doReopen(): void {
    if (!this.currentTicket) return;
    this.ticketService.updateTicket(this.currentTicket.id, { status: 'Reopened' });
    this.ticketService.addReply(
      this.currentTicket.id,
      'Ticket reopened — issue is not fully resolved.',
      null,
      false
    );
    this.loadTickets();
    this.currentTicket = this.ticketService.getTicket(this.currentTicket.id) || null;
    this.showToast(`${this.currentTicket?.id} reopened`);
  }

  doClose(): void {
    if (!this.currentTicket) return;
    this.ticketService.updateTicket(this.currentTicket.id, {
      status: 'Closed',
      resolvedTs: this.currentTicket.resolvedTs || new Date().toISOString()
    });
    this.loadTickets();
    this.currentTicket = this.ticketService.getTicket(this.currentTicket.id) || null;
    this.showToast(`${this.currentTicket?.id} closed`);
  }

  showToast(msg: string): void {
    this.toastMessage = msg;
    this.isToastVisible = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.isToastVisible = false;
    }, 3000);
  }

  private scrollChatToBottom(): void {
    if (this.chatScrollRef) {
      const el = this.chatScrollRef.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
