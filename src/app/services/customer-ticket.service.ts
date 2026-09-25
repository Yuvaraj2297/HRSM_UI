import { Injectable } from '@angular/core';

export interface TicketProject {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
}

export interface TicketIssueType {
  id: string;
  icon: string;
  name: string;
  sla: {
    response: string;
    resolution: string;
    responseHrs: number;
    resolutionHrs: number;
  };
}

export interface TicketConversation {
  by: 'customer' | 'staff';
  name: string;
  ts: string;
  text: string;
  attachment?: string | null;
}

export interface CustomerTicket {
  id: string;
  projectId: string;
  projectName: string;
  projectIcon: string;
  issueType: string;
  issueIcon: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'Assigned' | 'In Progress' | 'Waiting for Customer' | 'Resolved' | 'Closed' | 'Reopened';
  customerName: string;
  customerOrg: string;
  contactPerson: string;
  contactPhone?: string | null;
  assignedTeam?: string | null;
  assignedTo?: string | null;
  createdTs: string;
  createdDate: string;
  updatedTs: string;
  responseDueTs: string;
  resolutionDueTs: string;
  expectedDate?: string | null;
  attachment?: string | null;
  conversation: TicketConversation[];
  resolvedTs?: string;
}

export interface CreateTicketInput {
  projectId: string;
  projectName?: string;
  issueType: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  subject: string;
  description: string;
  contactPerson: string;
  contactPhone?: string;
  expectedDate?: string | null;
  attachment?: string | null;
  customerName?: string;
  customerOrg?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerTicketService {
  private readonly STORE_KEY = 'gh_cticket_tickets_v1';
  private readonly SEQ_KEY = 'gh_cticket_seq_v1';
  private readonly PROJECTS_KEY = 'gh_cticket_projects_v1';

  readonly defaultProjects: TicketProject[] = [
    { id: 'jails-court', name: 'Jails Court Project', icon: '⚖️', color: 'var(--blue-550)', bg: 'var(--accent-blue-soft)' },
    { id: 'hrms',        name: 'HRMS Portal',        icon: '🖥️', color: 'var(--green-550)', bg: 'var(--primary-soft)' },
    { id: 'crm',         name: 'CRM Application',    icon: '🤝', color: 'var(--purple-550)', bg: 'var(--blue-50-3)' },
    { id: 'website',     name: 'Corporate Website',  icon: '🌐', color: 'var(--orange-550)', bg: 'var(--orange-50)' },
    { id: 'mobile',      name: 'Mobile App',         icon: '📱', color: 'var(--pink-600)', bg: 'var(--pink-50)' }
  ];

  readonly issueTypes: TicketIssueType[] = [
    { id: 'bug',         icon: '🐞', name: 'Bug / Error',         sla: { response: '1 hr',  resolution: '4 hrs',  responseHrs: 1,  resolutionHrs: 4 } },
    { id: 'technical',   icon: '🔧', name: 'Technical Issue',     sla: { response: '2 hrs', resolution: '1 Day',  responseHrs: 2,  resolutionHrs: 24 } },
    { id: 'ui',          icon: '🎨', name: 'UI / Design Issue',   sla: { response: '8 hrs', resolution: '3 Days', responseHrs: 8,  resolutionHrs: 72 } },
    { id: 'access',      icon: '🔐', name: 'Access / Login Issue',sla: { response: '2 hrs', resolution: '8 hrs',  responseHrs: 2,  resolutionHrs: 8 } },
    { id: 'data',        icon: '📊', name: 'Data Issue',          sla: { response: '4 hrs', resolution: '1 Day',  responseHrs: 4,  resolutionHrs: 24 } },
    { id: 'integration', icon: '🔄', name: 'Integration Issue',   sla: { response: '4 hrs', resolution: '2 Days', responseHrs: 4,  resolutionHrs: 48 } },
    { id: 'change',      icon: '💡', name: 'Change Request',      sla: { response: '24 hrs', resolution: '5 Days', responseHrs: 24, resolutionHrs: 120 } },
    { id: 'feature',     icon: '➕', name: 'New Feature Request', sla: { response: '48 hrs', resolution: '10 Days', responseHrs: 48, resolutionHrs: 240 } },
    { id: 'query',       icon: '❓', name: 'General Query',       sla: { response: '24 hrs', resolution: '3 Days', responseHrs: 24, resolutionHrs: 72 } }
  ];

  readonly priorityFactors: Record<'Low' | 'Medium' | 'High' | 'Critical', number> = {
    Low: 1.5,
    Medium: 1,
    High: 0.5,
    Critical: 0.25
  };

  readonly teams: Record<string, string[]> = {
    'Development': ['Yuvaraj (Developer)', 'Vignesh (Developer)', 'Praveen (Full Stack)'],
    'Design':      ['Deepa (UI Designer)', 'Arun (UX Lead)'],
    'Support':     ['Manoj (Support Lead)', 'Anitha (Support Executive)'],
    'QA':          ['Kavitha (QA Engineer)', 'Suresh (Tester)']
  };

  currentCustomer() {
    return { name: 'Ramesh Iyer', org: 'Madurai Central Prison' };
  }

  getProjects(): TicketProject[] {
    return this.loadJson(this.PROJECTS_KEY, [...this.defaultProjects]);
  }

  getProject(id: string): TicketProject | undefined {
    return this.getProjects().find(p => p.id === id);
  }

  getIssueType(idOrName: string): TicketIssueType | undefined {
    return this.issueTypes.find(i => i.id === idOrName || i.name === idOrName);
  }

  calculateSla(issueTypeIdOrName: string, priority: 'Low' | 'Medium' | 'High' | 'Critical'): string | null {
    const issue = this.getIssueType(issueTypeIdOrName);
    if (!issue) return null;

    const factor = this.priorityFactors[priority] || 1;
    const resp = issue.sla.responseHrs * factor;
    const res = issue.sla.resolutionHrs * factor;

    const respText = resp < 1 ? `${Math.round(resp * 60)} mins` : `${resp} hrs`;
    const resText = res < 24 ? `${Math.round(res)} hrs` : `${Math.round((res / 24) * 10) / 10} days`;

    return `${issue.icon} ${issue.name} · ${priority} → first response within ${respText}, resolution within ${resText}`;
  }

  getAllTickets(): CustomerTicket[] {
    return this.readAll().sort((a, b) => new Date(b.createdTs).getTime() - new Date(a.createdTs).getTime());
  }

  getMyTickets(): CustomerTicket[] {
    const customer = this.currentCustomer();
    return this.getAllTickets().filter(t => t.customerName === customer.name);
  }

  getTicket(id: string): CustomerTicket | undefined {
    return this.readAll().find(t => t.id === id);
  }

  createTicket(input: CreateTicketInput): CustomerTicket {
    const tickets = this.readAll();
    const it = this.getIssueType(input.issueType);
    const factor = this.priorityFactors[input.priority] || 1;
    const base = it ? it.sla : { responseHrs: 24, resolutionHrs: 72 };
    const now = new Date();
    const nowIso = now.toISOString();
    const proj = this.getProject(input.projectId);
    const customer = this.currentCustomer();
    const customerName = input.customerName || customer.name;
    const customerOrg = input.customerOrg || customer.org;

    const seq = this.nextSeq();
    const ticketId = `TKT-${seq}`;

    const newTicket: CustomerTicket = {
      id: ticketId,
      projectId: input.projectId,
      projectName: proj ? proj.name : input.projectName || 'Unknown Project',
      projectIcon: proj ? proj.icon : '📁',
      issueType: it ? it.name : input.issueType,
      issueIcon: it ? it.icon : '❓',
      subject: input.subject,
      description: input.description,
      priority: input.priority,
      status: 'New',
      customerName,
      customerOrg,
      contactPerson: input.contactPerson || customerName,
      contactPhone: input.contactPhone || null,
      assignedTeam: null,
      assignedTo: null,
      createdTs: nowIso,
      createdDate: this.formatDate(nowIso),
      updatedTs: nowIso,
      responseDueTs: new Date(Date.now() + base.responseHrs * factor * 3600000).toISOString(),
      resolutionDueTs: new Date(Date.now() + base.resolutionHrs * factor * 3600000).toISOString(),
      expectedDate: input.expectedDate || null,
      attachment: input.attachment || null,
      conversation: [
        {
          by: 'customer',
          name: customerName,
          ts: nowIso,
          text: input.description,
          attachment: input.attachment || null
        }
      ]
    };

    tickets.unshift(newTicket);
    this.writeAll(tickets);
    return newTicket;
  }

  statusMeta(status: string): { bg: string; color: string; icon: string } {
    const map: Record<string, { bg: string; color: string; icon: string }> = {
      'New': { bg: 'var(--accent-blue-soft)', color: 'var(--blue-550)', icon: 'bi-inbox' },
      'Assigned': { bg: 'var(--blue-50-3)', color: 'var(--purple-550)', icon: 'bi-person-check' },
      'In Progress': { bg: 'var(--orange-50)', color: 'var(--orange-550)', icon: 'bi-hourglass-split' },
      'Waiting for Customer': { bg: 'var(--pink-50)', color: 'var(--pink-600)', icon: 'bi-eye' },
      'Resolved': { bg: 'var(--primary-soft)', color: 'var(--green-550)', icon: 'bi-check-circle' },
      'Closed': { bg: 'var(--border)', color: 'var(--neutral-650)', icon: 'bi-lock' },
      'Reopened': { bg: 'var(--orange-50-2)', color: 'var(--orange-550-3)', icon: 'bi-arrow-counterclockwise' }
    };
    return map[status] || { bg: 'var(--border)', color: 'var(--neutral-650)', icon: 'bi-tag' };
  }

  priorityMeta(priority: string): { bg: string; color: string } {
    const map: Record<string, { bg: string; color: string }> = {
      'Low': { bg: 'var(--primary-soft)', color: 'var(--green-550)' },
      'Medium': { bg: 'var(--orange-50)', color: 'var(--orange-550)' },
      'High': { bg: 'var(--orange-50-2)', color: 'var(--orange-550-3)' },
      'Critical': { bg: 'var(--danger-soft)', color: 'var(--red-550)' }
    };
    return map[priority] || { bg: 'var(--border)', color: 'var(--neutral-650)' };
  }

  allowedNextStatuses(ticket: CustomerTicket): string[] {
    switch (ticket.status) {
      case 'New': return ['Assigned', 'In Progress', 'Closed'];
      case 'Assigned': return ['In Progress', 'Closed'];
      case 'In Progress': return ['Waiting for Customer', 'Resolved'];
      case 'Waiting for Customer': return ['In Progress', 'Resolved'];
      case 'Resolved': return ['Closed'];
      case 'Closed': return [];
      case 'Reopened': return ['Assigned', 'In Progress'];
      default: return [];
    }
  }

  slaState(ticket: CustomerTicket): 'breached' | 'at-risk' | 'ok' {
    const openish = ['New', 'Assigned', 'In Progress', 'Waiting for Customer', 'Reopened'].indexOf(ticket.status) !== -1;
    const now = Date.now();
    const res = new Date(ticket.resolutionDueTs).getTime();
    const resp = new Date(ticket.responseDueTs).getTime();
    const firstStaff = (ticket.conversation || []).some(m => m.by === 'staff');
    if (!openish) return 'ok';
    if (!firstStaff && now > resp) return 'breached';
    if (now > res) return 'breached';
    if (res - now < 8 * 3600000) return 'at-risk';
    return 'ok';
  }

  overdueState(ticket: CustomerTicket): boolean {
    if (!ticket.expectedDate) return false;
    const openish = ['New', 'Assigned', 'In Progress', 'Waiting for Customer', 'Reopened'].indexOf(ticket.status) !== -1;
    if (!openish) return false;
    const parts = String(ticket.expectedDate).split('-');
    if (parts.length !== 3) return false;
    const exp = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]), 23, 59, 59).getTime();
    return Date.now() > exp;
  }

  counts(): {
    total: number;
    newT: number;
    assigned: number;
    inProgress: number;
    waiting: number;
    resolved: number;
    closed: number;
    reopened: number;
    breached: number;
    unassigned: number;
    highCritical: number;
    overdue: number;
  } {
    const all = this.readAll();
    const c = { total: all.length, newT: 0, assigned: 0, inProgress: 0, waiting: 0, resolved: 0, closed: 0, reopened: 0, breached: 0, unassigned: 0, highCritical: 0, overdue: 0 };
    all.forEach(t => {
      if (t.status === 'New') c.newT++;
      else if (t.status === 'Assigned') c.assigned++;
      else if (t.status === 'In Progress') c.inProgress++;
      else if (t.status === 'Waiting for Customer') c.waiting++;
      else if (t.status === 'Resolved') c.resolved++;
      else if (t.status === 'Closed') c.closed++;
      else if (t.status === 'Reopened') c.reopened++;
      if (!t.assignedTo) c.unassigned++;
      if (t.priority === 'High' || t.priority === 'Critical') c.highCritical++;
      if (this.overdueState(t)) c.overdue++;
      if (this.slaState(t) === 'breached') c.breached++;
    });
    return c;
  }

  issueSplit(): { bugs: number; changes: number; others: number } {
    const all = this.readAll();
    let bugs = 0, changes = 0, others = 0;
    all.forEach(t => {
      if (t.issueType === 'Bug / Error') bugs++;
      else if (t.issueType === 'Change Request' || t.issueType === 'New Feature Request') changes++;
      else others++;
    });
    return { bugs, changes, others };
  }

  customerAllowedActions(ticket: CustomerTicket): string[] {
    switch (ticket.status) {
      case 'New': return ['Close'];
      case 'Assigned': return ['Close'];
      case 'In Progress': return ['Close'];
      case 'Waiting for Customer': return ['Reply', 'Close'];
      case 'Resolved': return ['Reopen', 'Close'];
      case 'Closed': return [];
      case 'Reopened': return ['Close'];
      default: return [];
    }
  }

  updateTicket(id: string, updates: Partial<CustomerTicket>): CustomerTicket | null {
    let tickets = this.readAll();
    let updatedTicket: CustomerTicket | null = null;
    tickets = tickets.map(t => {
      if (t.id === id) {
        updatedTicket = {
          ...t,
          ...updates,
          updatedTs: new Date().toISOString()
        };
        return updatedTicket;
      }
      return t;
    });
    this.writeAll(tickets);
    return updatedTicket;
  }

  addReply(id: string, text: string, attachment: string | null = null, byStaff = false, senderName?: string): CustomerTicket | null {
    let tickets = this.readAll();
    const customer = this.currentCustomer();
    let updatedTicket: CustomerTicket | null = null;
    const nowIso = new Date().toISOString();

    tickets = tickets.map(t => {
      if (t.id === id) {
        const conversation = [...(t.conversation || [])];
        conversation.push({
          by: byStaff ? 'staff' : 'customer',
          name: byStaff ? (senderName || 'Support Team') : customer.name,
          ts: nowIso,
          text,
          attachment: attachment || null
        });
        updatedTicket = {
          ...t,
          conversation,
          updatedTs: nowIso
        };
        return updatedTicket;
      }
      return t;
    });
    this.writeAll(tickets);
    return updatedTicket;
  }

  formatTs(dateIso: string): string {
    const d = new Date(dateIso);
    const t = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${this.formatDate(dateIso)} · ${t}`;
  }

  private readAll(): CustomerTicket[] {
    try {
      const raw = localStorage.getItem(this.STORE_KEY);
      if (!raw) {
        const seeded = this.seedTickets();
        localStorage.setItem(this.STORE_KEY, JSON.stringify(seeded));
        return seeded;
      }
      return JSON.parse(raw);
    } catch {
      return this.seedTickets();
    }
  }

  private writeAll(tickets: CustomerTicket[]): void {
    try {
      localStorage.setItem(this.STORE_KEY, JSON.stringify(tickets));
    } catch {
      // Ignore quota errors
    }
  }

  private nextSeq(): number {
    try {
      const s = parseInt(localStorage.getItem(this.SEQ_KEY) || '2006', 10) || 2006;
      const next = s + 1;
      localStorage.setItem(this.SEQ_KEY, String(next));
      return next;
    } catch {
      return 2007;
    }
  }

  private formatDate(dateIso: string): string {
    const d = new Date(dateIso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}-${mm}-${d.getFullYear()}`;
  }

  private loadJson<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const v = JSON.parse(raw);
      return (v === null || v === undefined) ? fallback : v;
    } catch {
      return fallback;
    }
  }

  private seedTickets(): CustomerTicket[] {
    const dayMs = 86400000;
    const iso = (daysAgo: number) => new Date(Date.now() - daysAgo * dayMs).toISOString();

    return [
      {
        id: 'TKT-2001',
        projectId: 'jails-court',
        projectName: 'Jails Court Project',
        projectIcon: '⚖️',
        issueType: 'Bug / Error',
        issueIcon: '🐞',
        subject: 'Case creation page not loading',
        description: 'When I click "New Case" the page spins for a while and shows a blank screen. Happens every time since yesterday.',
        priority: 'Critical',
        status: 'In Progress',
        customerName: 'Ramesh Iyer',
        customerOrg: 'Madurai Central Prison',
        contactPerson: 'Ramesh Iyer',
        contactPhone: '9843011223',
        assignedTeam: 'Development',
        assignedTo: 'Yuvaraj (Developer)',
        createdTs: iso(0.1),
        createdDate: this.formatDate(iso(0.1)),
        updatedTs: iso(0.05),
        responseDueTs: iso(0.1 - 0.25 / 24),
        resolutionDueTs: iso(0.1 - 1 / 24),
        expectedDate: this.formatDate(iso(-3)),
        attachment: 'error-screenshot.png',
        conversation: [
          { by: 'customer', name: 'Ramesh Iyer', ts: iso(0.1), text: 'Unable to open the case creation page since yesterday. Getting a blank screen after the spinner.', attachment: 'error-screenshot.png' },
          { by: 'staff', name: 'Manoj (Support Lead)', ts: iso(0.08), text: 'Thanks for reporting. Our team is looking into it on priority.', attachment: null },
          { by: 'staff', name: 'Yuvaraj (Developer)', ts: iso(0.05), text: 'Login API issue identified — a null check is failing for court codes with special characters. Fix is in testing.', attachment: null }
        ]
      },
      {
        id: 'TKT-2002',
        projectId: 'hrms',
        projectName: 'HRMS Portal',
        projectIcon: '🖥️',
        issueType: 'Data Issue',
        issueIcon: '📊',
        subject: 'Attendance report showing wrong totals',
        description: 'Monthly attendance summary shows 2 extra present days for some employees.',
        priority: 'High',
        status: 'Assigned',
        customerName: 'Priya Venkatesh',
        customerOrg: 'Sunrise Textiles',
        contactPerson: 'Priya Venkatesh',
        contactPhone: '9440055667',
        assignedTeam: 'Support',
        assignedTo: 'Manoj (Support Lead)',
        createdTs: iso(0.6),
        createdDate: this.formatDate(iso(0.6)),
        updatedTs: iso(0.4),
        responseDueTs: iso(0.35),
        resolutionDueTs: iso(0.1),
        expectedDate: this.formatDate(iso(-1)),
        attachment: null,
        conversation: [
          { by: 'customer', name: 'Priya Venkatesh', ts: iso(0.6), text: 'Monthly attendance summary shows 2 extra present days for a few employees who took leave.', attachment: null },
          { by: 'staff', name: 'Manoj (Support Lead)', ts: iso(0.4), text: 'Ticket assigned to the support team. We are replicating the issue with your data.', attachment: null }
        ]
      },
      {
        id: 'TKT-2003',
        projectId: 'crm',
        projectName: 'CRM Application',
        projectIcon: '🤝',
        issueType: 'UI / Design Issue',
        issueIcon: '🎨',
        subject: 'Dashboard chart labels overlapping',
        description: 'On the CRM dashboard, the pipeline chart labels overlap when there are more than 6 stages.',
        priority: 'Low',
        status: 'Resolved',
        customerName: 'Karthik Raja',
        customerOrg: 'Nova Enterprises',
        contactPerson: 'Karthik Raja',
        contactPhone: '9952788990',
        assignedTeam: 'Design',
        assignedTo: 'Deepa (UI Designer)',
        createdTs: iso(3),
        createdDate: this.formatDate(iso(3)),
        updatedTs: iso(1.2),
        responseDueTs: iso(2.6),
        resolutionDueTs: iso(2),
        expectedDate: this.formatDate(iso(2)),
        attachment: null,
        resolvedTs: iso(1.2),
        conversation: [
          { by: 'customer', name: 'Karthik Raja', ts: iso(3), text: 'Pipeline chart labels overlap when there are more than 6 stages.', attachment: null },
          { by: 'staff', name: 'Deepa (UI Designer)', ts: iso(1.2), text: 'Fixed — labels now rotate and wrap. Please hard refresh and confirm.', attachment: null },
          { by: 'customer', name: 'Karthik Raja', ts: iso(1.1), text: 'Working fine now, thank you!', attachment: null }
        ]
      }
    ];
  }
}
