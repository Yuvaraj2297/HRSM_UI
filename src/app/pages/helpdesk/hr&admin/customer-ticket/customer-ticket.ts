import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { Breadcrumb } from '../../../../shared/breadcrumb/breadcrumb';
import {
  CustomerTicketService,
  CustomerTicket,
  TicketProject,
  TicketIssueType,
  TicketConversation
} from '../../../../services/customer-ticket.service';

interface SelectOption {
  label: string;
  value: string;
}

interface ProjectStatItem {
  id: string;
  name: string;
  icon: string;
  bg: string;
  color: string;
  total: number;
  active: number;
  unassigned: number;
  firstTicketId?: string;
}

interface TeamWorkloadItem {
  person: string;
  team: string;
  active: number;
  pct: number;
  color: string;
  initials: string;
  teamColor: string;
}

interface AttentionItem {
  ticket: CustomerTicket;
  label: string;
  color: string;
}

interface IssueSplitData {
  bugs: number;
  changes: number;
  others: number;
  bugsPct: number;
  changesPct: number;
  othersPct: number;
}

@Component({
  selector: 'app-customer-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SelectModule, Breadcrumb],
  templateUrl: './customer-ticket.html',
  styleUrl: './customer-ticket.scss',
})
export class CustomerTicketComponent implements OnInit {
  public ticketService = inject(CustomerTicketService);
  private route = inject(ActivatedRoute);

  // Quick Filter via KPI cards
  quickFilter: 'all' | 'new' | 'progress' | 'resolved' | 'high' | '' = '';

  // Toolbar Filters
  filterProject: string = '';
  filterIssue: string = '';
  filterStatus: string = '';
  searchTerm: string = '';

  // Select Options
  projectOptions: SelectOption[] = [];
  issueOptions: SelectOption[] = [];
  statusOptions: SelectOption[] = [
    { label: 'All Statuses', value: '' },
    { label: 'New', value: 'New' },
    { label: 'Assigned', value: 'Assigned' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Waiting for Customer', value: 'Waiting for Customer' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Closed', value: 'Closed' },
    { label: 'Reopened', value: 'Reopened' }
  ];

  // Ticket Records
  allTickets: CustomerTicket[] = [];
  filteredTickets: CustomerTicket[] = [];

  // KPI Counts
  kpiData = {
    total: 0,
    newT: 0,
    progress: 0,
    resolved: 0,
    highCritical: 0
  };

  // Side Cards Data
  projectStats: ProjectStatItem[] = [];
  teamWorkload: TeamWorkloadItem[] = [];
  attentionItems: AttentionItem[] = [];
  issueSplit: IssueSplitData = {
    bugs: 0,
    changes: 0,
    others: 0,
    bugsPct: 0,
    changesPct: 0,
    othersPct: 0
  };

  // Quick Assign Modal
  isQuickAssignOpen: boolean = false;
  assignTicketId: string = '';
  selectedAssignPerson: string = '';
  assigneeList: string[] = [
    'John Doe',
    'Sarah Connor',
    'Alex Smith',
    'Yuvaraj (Developer)',
    'Vignesh (Developer)',
    'Praveen (Full Stack)',
    'Deepa (UI Designer)',
    'Arun (UX Lead)',
    'Manoj (Support Lead)',
    'Anitha (Support Executive)',
    'Kavitha (QA Engineer)',
    'Suresh (Tester)'
  ];

  // Fullscreen Manage Modal
  isManageOpen: boolean = false;
  currentTicket: CustomerTicket | null = null;
  manageTeam: string = '';
  manageAssignee: string = '';
  managePriority: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
  manageStatus: string = 'New';
  manageReplyText: string = '';

  teamList: string[] = [];
  manageAssigneeOptions: string[] = [];
  manageStatusOptions: string[] = [];

  // Toast Notification
  toastMessage: string = '';
  isToastVisible: boolean = false;
  private toastTimer: any = null;

  ngOnInit(): void {
    this.teamList = Object.keys(this.ticketService.teams);
    this.populateFilterDropdowns();
    this.loadTickets();

    // Check query params for deep-link: ?ticket=TKT-2001
    this.route.queryParams.subscribe(params => {
      if (params['ticket']) {
        const ticket = this.ticketService.getTicket(params['ticket']);
        if (ticket) {
          this.openManage(ticket);
        }
      }
    });
  }

  populateFilterDropdowns(): void {
    this.projectOptions = [
      { label: 'All Projects', value: '' },
      ...this.ticketService.getProjects().map(p => ({
        label: `${p.icon} ${p.name}`,
        value: p.id
      }))
    ];

    this.issueOptions = [
      { label: 'All Issue Types', value: '' },
      ...this.ticketService.issueTypes.map(i => ({
        label: `${i.icon} ${i.name}`,
        value: i.name
      }))
    ];
  }

  loadTickets(): void {
    this.allTickets = this.ticketService.getAllTickets();
    this.calculateKpis();
    this.applyFilters();
    this.computeProjectStats();
    this.computeTeamWorkload();
    this.computeAttentionItems();
    this.computeIssueSplit();
  }

  calculateKpis(): void {
    const c = this.ticketService.counts();
    this.kpiData = {
      total: c.total,
      newT: c.newT + c.reopened,
      progress: c.assigned + c.inProgress + c.waiting,
      resolved: c.resolved + c.closed,
      highCritical: c.highCritical
    };
  }

  toggleQuickFilter(filter: 'all' | 'new' | 'progress' | 'resolved' | 'high'): void {
    this.quickFilter = this.quickFilter === filter ? '' : filter;
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.searchTerm.trim().toLowerCase();

    this.filteredTickets = this.allTickets.filter(t => {
      // KPI quick filter
      if (this.quickFilter === 'new' && !['New', 'Reopened'].includes(t.status)) return false;
      if (this.quickFilter === 'progress' && !['Assigned', 'In Progress', 'Waiting for Customer'].includes(t.status)) return false;
      if (this.quickFilter === 'resolved' && !['Resolved', 'Closed'].includes(t.status)) return false;
      if (this.quickFilter === 'high' && !['High', 'Critical'].includes(t.priority)) return false;

      // Dropdown filters
      if (this.filterProject && t.projectId !== this.filterProject) return false;
      if (this.filterIssue && t.issueType !== this.filterIssue) return false;
      if (this.filterStatus && t.status !== this.filterStatus) return false;

      // Keyword search
      if (q) {
        const text = `${t.id} ${t.subject} ${t.customerName} ${t.customerOrg} ${t.contactPerson || ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }

  clearFilters(): void {
    this.filterProject = '';
    this.filterIssue = '';
    this.filterStatus = '';
    this.searchTerm = '';
    this.quickFilter = '';
    this.applyFilters();
  }

  computeProjectStats(): void {
    const all = this.allTickets;
    this.projectStats = this.ticketService.getProjects()
      .map(p => {
        const list = all.filter(t => t.projectId === p.id);
        const active = list.filter(t => !['Resolved', 'Closed'].includes(t.status)).length;
        const unassigned = list.filter(t => !t.assignedTo).length;
        return {
          id: p.id,
          name: p.name,
          icon: p.icon,
          bg: p.bg,
          color: p.color,
          total: list.length,
          active,
          unassigned,
          firstTicketId: list[0]?.id
        };
      })
      .filter(ps => ps.total > 0);
  }

  computeTeamWorkload(): void {
    const peopleMap: Record<string, { team: string; active: number }> = {};
    let maxActive = 1;

    Object.keys(this.ticketService.teams).forEach(team => {
      this.ticketService.teams[team].forEach(person => {
        const active = this.allTickets.filter(
          t => t.assignedTo === person && !['Resolved', 'Closed'].includes(t.status)
        ).length;
        peopleMap[person] = { team, active };
        if (active > maxActive) maxActive = active;
      });
    });

    const teamColors: Record<string, string> = {
      'Development': 'var(--blue-550)',
      'Design': 'var(--purple-550)',
      'Support': 'var(--green-550)',
      'QA': 'var(--orange-550)'
    };

    this.teamWorkload = Object.keys(peopleMap).map(person => {
      const s = peopleMap[person];
      const color = s.active >= 3 ? 'var(--red-550)' : (s.active >= 1 ? 'var(--orange-550)' : 'var(--green-550)');
      const pct = Math.round((s.active / maxActive) * 100);
      const initials = person.split(' ')[0][0] || 'U';
      const teamColor = teamColors[s.team] || 'var(--neutral-650)';
      return {
        person,
        team: s.team,
        active: s.active,
        pct,
        color,
        initials,
        teamColor
      };
    });
  }

  computeAttentionItems(): void {
    const items: AttentionItem[] = [];

    this.allTickets.forEach(t => {
      if (this.ticketService.slaState(t) === 'breached') {
        items.push({ ticket: t, label: 'SLA breached', color: 'var(--red-550)' });
      } else if (this.ticketService.overdueState(t)) {
        items.push({ ticket: t, label: 'Past expected date', color: 'var(--orange-550-3)' });
      } else if (!t.assignedTo) {
        items.push({ ticket: t, label: 'Unassigned', color: 'var(--blue-550)' });
      } else if (t.status === 'Waiting for Customer') {
        items.push({ ticket: t, label: 'Waiting on customer', color: 'var(--pink-600)' });
      }
    });

    this.attentionItems = items.slice(0, 5);
  }

  computeIssueSplit(): void {
    const s = this.ticketService.issueSplit();
    const total = s.bugs + s.changes + s.others || 1;
    this.issueSplit = {
      bugs: s.bugs,
      changes: s.changes,
      others: s.others,
      bugsPct: Math.round((s.bugs / total) * 100),
      changesPct: Math.round((s.changes / total) * 100),
      othersPct: Math.round((s.others / total) * 100)
    };
  }

  // Quick Assign Modal
  openQuickAssign(ticket: CustomerTicket, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.assignTicketId = ticket.id;
    this.selectedAssignPerson = '';
    this.isQuickAssignOpen = true;
  }

  closeQuickAssign(): void {
    this.isQuickAssignOpen = false;
    this.assignTicketId = '';
    this.selectedAssignPerson = '';
  }

  saveQuickAssign(): void {
    if (!this.selectedAssignPerson) {
      alert('Please select a person to assign!');
      return;
    }

    this.ticketService.updateTicket(this.assignTicketId, {
      assignedTo: this.selectedAssignPerson,
      status: 'Assigned'
    });

    const assignedId = this.assignTicketId;
    const person = this.selectedAssignPerson;
    this.closeQuickAssign();
    this.loadTickets();
    this.showToast(`${assignedId} assigned to ${person}`);
  }

  // Fullscreen Manage Modal
  openManage(ticket: CustomerTicket): void {
    const t = this.ticketService.getTicket(ticket.id) || ticket;
    this.currentTicket = t;
    this.manageTeam = t.assignedTeam || '';
    this.manageAssignee = t.assignedTo || '';
    this.managePriority = t.priority;
    this.manageStatus = t.status;
    this.manageReplyText = '';

    this.onTeamChange(this.manageTeam, this.manageAssignee);
    this.manageStatusOptions = [t.status, ...this.ticketService.allowedNextStatuses(t)];

    this.isManageOpen = true;
  }

  closeManage(): void {
    this.isManageOpen = false;
    this.currentTicket = null;
    this.manageReplyText = '';
  }

  onTeamChange(team: string, defaultAssignee: string = ''): void {
    if (!team || !this.ticketService.teams[team]) {
      this.manageAssigneeOptions = [];
      this.manageAssignee = '';
      return;
    }
    this.manageAssigneeOptions = this.ticketService.teams[team];
    this.manageAssignee = defaultAssignee || (this.manageAssigneeOptions.includes(this.manageAssignee) ? this.manageAssignee : '');
  }

  sendReply(): void {
    if (!this.currentTicket || !this.manageReplyText.trim()) return;

    const sender = this.manageAssignee || 'Support Team';
    const updated = this.ticketService.addReply(
      this.currentTicket.id,
      this.manageReplyText.trim(),
      null,
      true,
      sender
    );

    if (updated) {
      this.currentTicket = updated;
    }
    this.manageReplyText = '';
    this.loadTickets();
    this.showToast(`Reply sent on ${this.currentTicket.id}`);
  }

  saveManageTicket(): void {
    if (!this.currentTicket) return;

    const updates: Partial<CustomerTicket> = {
      assignedTeam: this.manageTeam || null,
      assignedTo: this.manageAssignee || null,
      priority: this.managePriority,
      status: this.manageStatus as any
    };

    if (this.manageStatus === 'Resolved' && this.currentTicket.status !== 'Resolved') {
      updates.resolvedTs = new Date().toISOString();
    }
    if (this.manageStatus === 'Reopened') {
      updates.resolvedTs = undefined;
    }

    const ticketId = this.currentTicket.id;
    this.ticketService.updateTicket(ticketId, updates);
    this.closeManage();
    this.loadTickets();
    this.showToast(`${ticketId} updated successfully`);
  }

  // Helpers
  getSlaDueFormatted(dueIso: string): string {
    if (!dueIso) return '—';
    const due = new Date(dueIso);
    const dateStr = due.toLocaleDateString([], { day: '2-digit', month: 'short' });
    const timeStr = due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `Due ${dateStr} ${timeStr}`;
  }

  getAvatarColor(name: string): string {
    const colors = ['var(--blue-550)', 'var(--purple-550)', 'var(--green-550)', 'var(--orange-550)', 'var(--red-550)', 'var(--pink-600)', 'var(--teal-350)'];
    return colors[(name || '').length % colors.length];
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }

  showToast(msg: string): void {
    this.toastMessage = msg;
    this.isToastVisible = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.isToastVisible = false;
    }, 3200);
  }
}

export { CustomerTicketComponent as CustomerTicket };

