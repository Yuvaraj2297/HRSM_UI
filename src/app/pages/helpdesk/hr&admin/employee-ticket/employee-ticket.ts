import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { Breadcrumb } from '../../../../shared/breadcrumb/breadcrumb';
import {
  EmployeeTicketService,
  TicketCategory,
  IEmployeeTicket,
  EmployeeTicketConversation
} from '../../../../services/employee-ticket.service';

export type { IEmployeeTicket };

interface SelectOption {
  label: string;
  value: string;
}

interface DeptMapItem {
  dept: string;
  icon: string;
  bg: string;
  color: string;
  unassignedCount: number;
  categories: TicketCategory[];
}

interface StaffWorkloadItem {
  name: string;
  dept: string;
  activeCount: number;
  percent: number;
  color: string;
}

interface AttentionItem {
  ticket: IEmployeeTicket;
  label: string;
  bg: string;
  color: string;
  barClass: string;
  createdDate?: string;
}

@Component({
  selector: 'app-employee-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SelectModule, Breadcrumb],
  templateUrl: './employee-ticket.html',
  styleUrl: './employee-ticket.scss',
})
export class EmployeeTicket implements OnInit {
  public ticketService = inject(EmployeeTicketService);
  private route = inject(ActivatedRoute);

  // Quick filter by KPI card
  quickFilter: 'all' | 'open' | 'progress' | 'resolved' | 'breached' | '' = '';

  // Toolbar filters
  filterCategory: string = '';
  filterPriority: string = '';
  filterStatus: string = '';
  filterDept: string = '';
  searchTerm: string = '';

  // Dropdown options
  categoryOptions: SelectOption[] = [];
  readonly priorityOptions: SelectOption[] = [
    { label: 'All Priorities', value: '' },
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
    { label: 'Urgent', value: 'Urgent' }
  ];
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
  readonly deptOptions: SelectOption[] = [
    { label: 'All Departments', value: '' },
    { label: 'HR', value: 'HR' },
    { label: 'IT', value: 'IT' },
    { label: 'Payroll', value: 'Payroll' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Admin', value: 'Admin' }
  ];

  // All tickets cache
  allTickets: IEmployeeTicket[] = [];

  // Manage Modal State
  isManageModalOpen: boolean = false;
  currentTicket: IEmployeeTicket | null = null;
  modalDept: string = '';
  modalAssignee: string = '';
  modalPriority: 'Low' | 'Medium' | 'High' | 'Urgent' = 'Medium';
  modalStatus: string = 'Open';
  modalRejectNote: string = '';
  modalReplyText: string = '';

  assigneeOptions: SelectOption[] = [];
  modalStatusOptions: SelectOption[] = [];

  // Toast State
  toastMessage: string = '';
  isToastVisible: boolean = false;
  private toastTimer: any = null;

  ngOnInit(): void {
    this.loadCategories();
    this.refreshAll();

    // Deep link query param ?ticket=TKT-1001
    this.route.queryParams.subscribe(params => {
      const tid = params['ticket'];
      if (tid) {
        const found = this.ticketService.getTicket(tid);
        if (found) {
          this.openManageModal(found);
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

  refreshAll(): void {
    this.allTickets = this.ticketService.getAllTickets();
  }

  // KPI calculations
  get kpiData() {
    let open = 0;
    let progress = 0;
    let resolved = 0;
    let breached = 0;

    this.allTickets.forEach(t => {
      if (t.status === 'Open') {
        open++;
      } else if (['Assigned', 'In Progress', 'Waiting for Employee'].includes(t.status)) {
        progress++;
      } else if (['Resolved', 'Closed'].includes(t.status)) {
        resolved++;
      }

      if (this.ticketService.slaState(t) === 'breached') {
        breached++;
      }
    });

    return {
      total: this.allTickets.length,
      open,
      progress,
      resolved,
      breached
    };
  }

  toggleQuickFilter(filter: 'all' | 'open' | 'progress' | 'resolved' | 'breached'): void {
    this.quickFilter = this.quickFilter === filter ? '' : filter;
  }

  clearFilters(): void {
    this.filterCategory = '';
    this.filterPriority = '';
    this.filterStatus = '';
    this.filterDept = '';
    this.searchTerm = '';
    this.quickFilter = '';
  }

  applyFilters(): void {
    // Triggers change detection on getter
    this.refreshAll();
  }

  get filteredTickets(): IEmployeeTicket[] {
    const q = this.searchTerm.trim().toLowerCase();
    const cat = this.filterCategory;
    const pr = this.filterPriority;
    const st = this.filterStatus;
    const dept = this.filterDept;

    return this.allTickets.filter(t => {
      // Quick filter
      if (this.quickFilter === 'breached' && this.ticketService.slaState(t) !== 'breached') return false;
      if (this.quickFilter === 'open' && t.status !== 'Open') return false;
      if (this.quickFilter === 'progress' && !['Assigned', 'In Progress', 'Waiting for Employee'].includes(t.status)) return false;
      if (this.quickFilter === 'resolved' && !['Resolved', 'Closed'].includes(t.status)) return false;

      // Dropdown filters
      if (cat && t.category !== cat) return false;
      if (pr && t.priority !== pr) return false;
      if (st && t.status !== st) return false;
      if (dept && t.assignedDept !== dept && !(dept === 'IT' && ['IT Support', 'Internet', 'Access Request'].includes(t.category) && !t.assignedDept)) {
        return false;
      }

      // Search query
      if (q && !(t.id + ' ' + t.subject + ' ' + t.createdBy + ' ' + t.createdByEmp).toLowerCase().includes(q)) {
        return false;
      }

      return true;
    });
  }

  // SLA Due Date formatted
  formatSlaDue(dateIso: string): string {
    const d = new Date(dateIso);
    const day = d.toLocaleDateString([], { day: '2-digit', month: 'short' });
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `Due ${day} ${time}`;
  }

  // Side lists: Category -> Department routing map
  get deptMap(): DeptMapItem[] {
    const all = this.allTickets;
    const seen = new Set<string>();
    const list: DeptMapItem[] = [];

    const meta: Record<string, { icon: string; bg: string; color: string }> = {
      'HR': { icon: 'bi-people', bg: 'var(--accent-blue-soft)', color: 'var(--blue-550)' },
      'IT': { icon: 'bi-pc-display', bg: 'var(--blue-50-3)', color: 'var(--purple-550)' },
      'Payroll': { icon: 'bi-cash-coin', bg: 'var(--primary-soft)', color: 'var(--green-550)' },
      'Finance': { icon: 'bi-bank', bg: 'var(--orange-50)', color: 'var(--orange-550)' },
      'Admin': { icon: 'bi-building', bg: 'var(--pink-50)', color: 'var(--pink-600)' }
    };

    const categories = this.ticketService.getCategories();
    categories.forEach(c => {
      if (seen.has(c.dept)) return;
      seen.add(c.dept);

      const dMeta = meta[c.dept] || { icon: 'bi-grid', bg: 'var(--border)', color: 'var(--neutral-650)' };
      const deptCats = categories.filter(x => x.dept === c.dept);
      const unassigned = all.filter(t => {
        return t.category && !t.assignedTo && deptCats.some(x => x.name === t.category);
      }).length;

      list.push({
        dept: c.dept,
        icon: dMeta.icon,
        bg: dMeta.bg,
        color: dMeta.color,
        unassignedCount: unassigned,
        categories: deptCats
      });
    });

    return list;
  }

  // Side lists: Staff Workload
  get staffWorkload(): StaffWorkloadItem[] {
    const assignees = this.ticketService.deptAssignees;
    const all = this.allTickets;
    let max = 1;
    const rawList: Array<{ name: string; dept: string; active: number }> = [];

    Object.keys(assignees).forEach(dept => {
      assignees[dept].forEach(person => {
        const active = all.filter(t => {
          return t.assignedTo === person && !['Resolved', 'Closed', 'Rejected', 'Cancelled'].includes(t.status);
        }).length;
        rawList.push({ name: person, dept, active });
        if (active > max) max = active;
      });
    });

    return rawList.map(item => {
      const color = item.active >= 3 ? 'var(--red-550)' : item.active >= 1 ? 'var(--orange-550)' : 'var(--green-550)';
      return {
        name: item.name,
        dept: item.dept,
        activeCount: item.active,
        percent: Math.round((item.active / max) * 100),
        color
      };
    });
  }

  // Side lists: Needs Attention
  get attentionList(): AttentionItem[] {
    const list: AttentionItem[] = [];

    this.allTickets.forEach(t => {
      if (this.ticketService.slaState(t) === 'breached') {
        list.push({
          ticket: t,
          label: 'SLA breached',
          bg: 'var(--danger-soft)',
          color: 'var(--red-550)',
          barClass: 'bar-red',
          createdDate: '21-09-2026'
        });
      } else if (!t.assignedTo) {
        list.push({
          ticket: t,
          label: 'Unassigned',
          bg: 'var(--accent-blue-soft)',
          color: 'var(--blue-550)',
          barClass: 'bar-blue',
          createdDate: '21-09-2026'
        });
      } else if (t.status === 'Waiting for Employee') {
        list.push({
          ticket: t,
          label: 'Waiting on employee',
          bg: 'var(--pink-50)',
          color: 'var(--pink-600)',
          barClass: 'bar-pink',
          createdDate: '21-09-2026'
        });
      }
    });

    return list.slice(0, 5);
  }

  // Avatar Initials & Color
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

  /* ================= Manage Modal ================= */
  openManageModal(ticket: IEmployeeTicket): void {
    this.currentTicket = ticket;
    this.modalDept = ticket.assignedDept || '';
    this.modalPriority = ticket.priority;
    this.modalStatus = ticket.status;
    this.modalRejectNote = '';
    this.modalReplyText = '';

    this.onDeptChange(this.modalDept, ticket.assignedTo || '');
    this.updateStatusOptions(ticket);
    this.isManageModalOpen = true;
  }

  closeManageModal(): void {
    this.isManageModalOpen = false;
    this.currentTicket = null;
  }

  onDeptChange(dept: string, selectedAssignee: string = ''): void {
    this.modalDept = dept;
    const people = this.ticketService.deptAssignees[dept];
    if (people && people.length) {
      this.assigneeOptions = [
        { label: 'Select person...', value: '' },
        ...people.map(p => ({ label: p, value: p }))
      ];
      this.modalAssignee = selectedAssignee && people.includes(selectedAssignee) ? selectedAssignee : '';
    } else {
      this.assigneeOptions = [{ label: 'Select dept first', value: '' }];
      this.modalAssignee = '';
    }
  }

  updateStatusOptions(t: IEmployeeTicket): void {
    const nextList = [t.status, ...this.ticketService.allowedNextStatuses(t)];
    const unique = Array.from(new Set(nextList));
    this.modalStatusOptions = unique.map(s => ({ label: s, value: s }));
  }

  get showRejectWrap(): boolean {
    return this.modalStatus === 'Rejected' || this.modalStatus === 'Cancelled';
  }

  saveTicketUpdates(): void {
    if (!this.currentTicket) return;

    const updates: Partial<IEmployeeTicket> = {
      assignedDept: this.modalDept || null,
      assignedTo: this.modalAssignee || null,
      priority: this.modalPriority,
      status: this.modalStatus as IEmployeeTicket['status']
    };

    // Priority change -> recalc resolution due
    if (this.modalPriority !== this.currentTicket.priority) {
      const sla = this.ticketService.slaMatrix[this.modalPriority];
      updates.resolutionDueTs = new Date(
        new Date(this.currentTicket.createdTs).getTime() + sla.resolutionHrs * 3600000
      ).toISOString();
    }

    if (this.modalStatus === 'Resolved' && this.currentTicket.status !== 'Resolved') {
      updates.resolvedTs = new Date().toISOString();
    }

    const updated = this.ticketService.updateTicket(this.currentTicket.id, updates);

    // Optional reply sent together with update
    if (this.modalReplyText.trim()) {
      this.ticketService.addReply(
        this.currentTicket.id,
        this.modalReplyText.trim(),
        null,
        true
      );
      this.modalReplyText = '';
    }

    this.closeManageModal();
    this.refreshAll();
    this.showToast(`${this.currentTicket.id} updated successfully`);
  }

  sendReplyOnly(): void {
    if (!this.currentTicket || !this.modalReplyText.trim()) return;

    const updated = this.ticketService.addReply(
      this.currentTicket.id,
      this.modalReplyText.trim(),
      null,
      true
    );

    if (updated) {
      this.currentTicket = updated;
      this.modalReplyText = '';
      this.refreshAll();
      this.showToast(`Reply added to ${this.currentTicket.id}`);
    }
  }

  onReplyKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendReplyOnly();
    }
  }

  showToast(message: string): void {
    this.toastMessage = message;
    this.isToastVisible = true;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.isToastVisible = false;
    }, 3200);
  }
}
