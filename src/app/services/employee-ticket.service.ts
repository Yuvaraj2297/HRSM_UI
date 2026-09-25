import { Injectable } from '@angular/core';

export interface TicketCategory {
  id: string;
  icon: string;
  name: string;
  example: string;
  dept: string;
  suggestedPriority: 'Low' | 'Medium' | 'High' | 'Urgent';
  subCategories: string[];
}

export interface EmployeeTicketConversation {
  by: 'employee' | 'staff';
  name: string;
  ts: string;
  text: string;
  attachment?: string | null;
}

export interface EmployeeTicket {
  id: string;
  category: string;
  categoryIcon: string;
  subCategory: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Waiting for Employee' | 'Resolved' | 'Closed' | 'Rejected' | 'Cancelled' | 'Reopened';
  createdBy: string;
  createdByEmp: string;
  assignedTo?: string | null;
  assignedDept?: string | null;
  createdDate: string;
  createdTs: string;
  updatedTs: string;
  responseDueTs: string;
  resolutionDueTs: string;
  attachment?: string | null;
  preferredContact: string;
  resolvedTs?: string;
  conversation: EmployeeTicketConversation[];
}

export type IEmployeeTicket = EmployeeTicket;
export type EmployeeTickets = EmployeeTicket;
export type EmployeeTicketItem = EmployeeTicket;

export interface CreateEmployeeTicketInput {
  category: string;
  categoryIcon: string;
  subCategory: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  attachment?: string | null;
  preferredContact: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeTicketService {
  private readonly STORE_KEY = 'gh_ticketing_tickets_v1';
  private readonly SEQ_KEY = 'gh_ticketing_seq_v1';
  private readonly CUSTOM_KEY = 'gh_ticketing_custom_categories_v1';
  private readonly OVERRIDES_KEY = 'gh_ticketing_category_overrides_v1';
  private readonly REMOVED_KEY = 'gh_ticketing_removed_categories_v1';

  readonly defaultCategories: TicketCategory[] = [
    { id: 'hr', icon: '👤', name: 'HR', example: 'Employee details, ID card, HR documents', dept: 'HR', suggestedPriority: 'Low', subCategories: ['Employee Details Correction', 'ID Card Request', 'HR Documents', 'Other HR Query'] },
    { id: 'leave', icon: '🏖️', name: 'Leave', example: 'Leave balance, cancellation, correction', dept: 'HR', suggestedPriority: 'Medium', subCategories: ['Leave Balance Issue', 'Leave Cancellation', 'Leave Correction', 'LOP Clarification'] },
    { id: 'attendance', icon: '⏰', name: 'Attendance', example: 'Missing punch, wrong check-in/out', dept: 'HR', suggestedPriority: 'Medium', subCategories: ['Missing Punch', 'Wrong Check-in', 'Wrong Check-out', 'Attendance Correction'] },
    { id: 'payroll', icon: '💰', name: 'Payroll', example: 'Salary issue, payslip, deduction', dept: 'Payroll', suggestedPriority: 'High', subCategories: ['Salary Issue', 'Payslip Request', 'Deduction Clarification', 'Tax Related'] },
    { id: 'reimbursement', icon: '🏦', name: 'Reimbursement', example: 'Travel, food, internet reimbursement', dept: 'Finance', suggestedPriority: 'Low', subCategories: ['Travel Reimbursement', 'Food Reimbursement', 'Internet / Wi-Fi', 'Other Claims'] },
    { id: 'it', icon: '💻', name: 'IT Support', example: 'Laptop, system, software, VPN issue', dept: 'IT', suggestedPriority: 'High', subCategories: ['Laptop / Hardware', 'Software Install', 'Email Issue', 'VPN Issue', 'System Slow'] },
    { id: 'internet', icon: '🌐', name: 'Internet', example: 'Wi-Fi / network issue', dept: 'IT', suggestedPriority: 'Medium', subCategories: ['Wi-Fi Not Working', 'Slow Network', 'LAN / Wired Connection', 'VPN Network'] },
    { id: 'access', icon: '🪪', name: 'Access Request', example: 'Application / system access', dept: 'IT', suggestedPriority: 'Medium', subCategories: ['New Application Access', 'Permission Change', 'Folder / Drive Access', 'Remove Access'] },
    { id: 'facilities', icon: '🏢', name: 'Facilities', example: 'Desk, AC, electricity, office facility', dept: 'Admin', suggestedPriority: 'Low', subCategories: ['Desk / Seating', 'AC / Temperature', 'Electricity', 'Housekeeping', 'Other Facility'] },
    { id: 'documents', icon: '📄', name: 'Documents', example: 'Experience letter, salary certificate', dept: 'HR', suggestedPriority: 'Medium', subCategories: ['Experience Letter', 'Salary Certificate', 'Employment Letter', 'Address Proof', 'Other Certificates'] },
    { id: 'manager', icon: '👨‍💼', name: 'Manager', example: 'Reporting manager change', dept: 'HR', suggestedPriority: 'Medium', subCategories: ['Reporting Manager Change', 'Team Transfer', 'Team Related Request'] },
    { id: 'shift', icon: '🔄', name: 'Shift', example: 'Shift change request', dept: 'HR', suggestedPriority: 'Low', subCategories: ['Shift Change', 'Permanent Shift Swap', 'Temporary Shift Change'] },
    { id: 'location', icon: '📍', name: 'Work Location', example: 'WFH / office location request', dept: 'HR', suggestedPriority: 'Low', subCategories: ['Work From Home', 'Office Location Change', 'Client Location Deputation'] },
    { id: 'general', icon: '📢', name: 'General', example: 'Other HR / company queries', dept: 'HR', suggestedPriority: 'Low', subCategories: ['General HR Query', 'Company Policy Query', 'Suggestion / Feedback', 'Other'] }
  ];

  readonly slaMatrix: Record<'Low' | 'Medium' | 'High' | 'Urgent', { response: string; resolution: string; responseHrs: number; resolutionHrs: number }> = {
    Low: { response: '24 hrs', resolution: '3 Days', responseHrs: 24, resolutionHrs: 72 },
    Medium: { response: '8 hrs', resolution: '2 Days', responseHrs: 8, resolutionHrs: 48 },
    High: { response: '2 hrs', resolution: '1 Day', responseHrs: 2, resolutionHrs: 24 },
    Urgent: { response: '30 mins', resolution: '4 hrs', responseHrs: 0.5, resolutionHrs: 4 }
  };

  readonly deptAssignees: Record<string, string[]> = {
    'HR': ['Kumar (HR Executive)', 'Priya (HR Lead)', 'Meena (HR Executive)'],
    'Payroll': ['Rajesh (Payroll Officer)'],
    'IT': ['Vignesh (IT Support)', 'Arun (System Admin)'],
    'Admin': ['Sathish (Admin Officer)'],
    'Finance': ['Divya (Finance Executive)']
  };

  allowedNextStatuses(ticket: EmployeeTicket): string[] {
    switch (ticket.status) {
      case 'Open': return ['Assigned', 'In Progress', 'Rejected'];
      case 'Assigned': return ['In Progress', 'Rejected'];
      case 'In Progress': return ['Waiting for Employee', 'Resolved'];
      case 'Waiting for Employee': return ['In Progress', 'Resolved'];
      case 'Resolved': return ['Closed', 'Reopened'];
      case 'Closed': return [];
      case 'Reopened': return ['In Progress', 'Assigned'];
      default: return ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
    }
  }

  currentEmployee() {
    return { name: 'Arun Kumar', empId: 'EMP0001', dept: 'Development' };
  }

  getCategories(): TicketCategory[] {
    let cats = this.defaultCategories.map(c => ({ ...c, subCategories: [...c.subCategories] }));

    // Apply custom categories
    const custom = this.loadJson<TicketCategory[]>(this.CUSTOM_KEY, []);
    custom.forEach(c => {
      if (c && c.id && c.name) cats.push(c);
    });

    // Apply overrides
    const overrides = this.loadJson<Record<string, Partial<TicketCategory>>>(this.OVERRIDES_KEY, {});
    cats.forEach(cat => {
      if (overrides[cat.id]) {
        const ov = overrides[cat.id];
        if (ov.name) cat.name = ov.name;
        if (ov.icon) cat.icon = ov.icon;
        if (ov.subCategories?.length) cat.subCategories = [...ov.subCategories];
      }
    });

    // Drop removed
    const removedIds = this.loadJson<string[]>(this.REMOVED_KEY, []);
    if (removedIds.length) {
      cats = cats.filter(c => !removedIds.includes(c.id));
    }

    return cats;
  }

  getCategory(id: string): TicketCategory | undefined {
    return this.getCategories().find(c => c.id === id);
  }

  addCategory(input: { name: string; icon: string; subCategories: string[] }): TicketCategory | null {
    const name = input.name.trim();
    if (!name) return null;
    const cats = this.getCategories();
    if (cats.some(c => c.name.toLowerCase() === name.toLowerCase())) return null;

    const newCat: TicketCategory = {
      id: 'cat-' + Date.now(),
      name,
      icon: input.icon || '📌',
      dept: 'HR',
      example: input.subCategories.slice(0, 3).join(', '),
      suggestedPriority: 'Medium',
      subCategories: input.subCategories
    };

    const custom = this.loadJson<TicketCategory[]>(this.CUSTOM_KEY, []);
    custom.push(newCat);
    this.saveJson(this.CUSTOM_KEY, custom);
    return newCat;
  }

  updateCategory(id: string, updates: { name?: string; icon?: string; subCategories?: string[] }): TicketCategory | null {
    const custom = this.loadJson<TicketCategory[]>(this.CUSTOM_KEY, []);
    const idx = custom.findIndex(c => c.id === id);

    if (idx !== -1) {
      custom[idx] = { ...custom[idx], ...updates };
      this.saveJson(this.CUSTOM_KEY, custom);
      return custom[idx];
    } else {
      // It's a built-in category, save overrides
      const overrides = this.loadJson<Record<string, Partial<TicketCategory>>>(this.OVERRIDES_KEY, {});
      overrides[id] = { ...(overrides[id] || {}), ...updates };
      this.saveJson(this.OVERRIDES_KEY, overrides);
      return this.getCategory(id) || null;
    }
  }

  removeCategory(id: string): void {
    const custom = this.loadJson<TicketCategory[]>(this.CUSTOM_KEY, []);
    const filtered = custom.filter(c => c.id !== id);
    if (filtered.length !== custom.length) {
      this.saveJson(this.CUSTOM_KEY, filtered);
    } else {
      const removed = this.loadJson<string[]>(this.REMOVED_KEY, []);
      if (!removed.includes(id)) {
        removed.push(id);
        this.saveJson(this.REMOVED_KEY, removed);
      }
    }
  }

  getAllTickets(): EmployeeTicket[] {
    return this.readAll().sort((a, b) => new Date(b.createdTs).getTime() - new Date(a.createdTs).getTime());
  }

  getMyTickets(): EmployeeTicket[] {
    const emp = this.currentEmployee();
    return this.readAll()
      .filter(t => t.createdByEmp === emp.empId)
      .sort((a, b) => new Date(b.createdTs).getTime() - new Date(a.createdTs).getTime());
  }

  getTicket(id: string): any | undefined {
    return this.readAll().find(t => t.id === id);
  }

  updateTicket(id: string, updates: Partial<EmployeeTicket>): EmployeeTicket | null {
    let tickets = this.readAll();
    let updated: EmployeeTicket | null = null;
    tickets = tickets.map(t => {
      if (t.id === id) {
        updated = {
          ...t,
          ...updates,
          updatedTs: new Date().toISOString()
        };
        return updated;
      }
      return t;
    });
    if (updated) {
      this.writeAll(tickets);
    }
    return updated;
  }

  addReply(id: string, text: string, attachment?: string | null, byStaff: boolean = false): EmployeeTicket | null {
    const tickets = this.readAll();
    const u = this.currentEmployee();
    let target: EmployeeTicket | null = null;

    tickets.forEach(t => {
      if (t.id === id) {
        t.conversation.push({
          by: byStaff ? 'staff' : 'employee',
          name: byStaff ? (t.assignedTo || 'Helpdesk Support') : u.name,
          ts: new Date().toISOString(),
          text,
          attachment: attachment || null
        });
        t.updatedTs = new Date().toISOString();
        target = t;
      }
    });

    if (target) {
      this.writeAll(tickets);
    }
    return target;
  }

  slaState(ticket: EmployeeTicket): 'ok' | 'at-risk' | 'breached' {
    const openish = ['Open', 'Assigned', 'In Progress', 'Waiting for Employee', 'Reopened'].includes(ticket.status);
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

  statusMeta(status: string): { bg: string; color: string; icon: string } {
    const map: Record<string, { bg: string; color: string; icon: string }> = {
      'Open': { bg: 'var(--accent-blue-soft)', color: 'var(--blue-550)', icon: 'bi-inbox' },
      'Assigned': { bg: 'var(--blue-50-3)', color: 'var(--purple-550)', icon: 'bi-person-check' },
      'In Progress': { bg: 'var(--orange-50)', color: 'var(--orange-550)', icon: 'bi-hourglass-split' },
      'Waiting for Employee': { bg: 'var(--pink-50)', color: 'var(--pink-600)', icon: 'bi-arrow-return-left' },
      'Resolved': { bg: 'var(--primary-soft)', color: 'var(--green-550)', icon: 'bi-check-circle' },
      'Closed': { bg: 'var(--border)', color: 'var(--neutral-650)', icon: 'bi-lock' },
      'Rejected': { bg: 'var(--danger-soft)', color: 'var(--red-550)', icon: 'bi-x-circle' },
      'Cancelled': { bg: 'var(--bg-muted)', color: 'var(--neutral-500-2)', icon: 'bi-slash-circle' },
      'Reopened': { bg: 'var(--orange-50-2)', color: 'var(--orange-550-3)', icon: 'bi-arrow-counterclockwise' }
    };
    return map[status] || { bg: 'var(--border)', color: 'var(--neutral-650)', icon: 'bi-tag' };
  }

  priorityMeta(priority: string): { bg: string; color: string } {
    const map: Record<string, { bg: string; color: string }> = {
      'Low': { bg: 'var(--primary-soft)', color: 'var(--green-550)' },
      'Medium': { bg: 'var(--orange-50)', color: 'var(--orange-550)' },
      'High': { bg: 'var(--orange-50-2)', color: 'var(--orange-550-3)' },
      'Urgent': { bg: 'var(--danger-soft)', color: 'var(--red-550)' }
    };
    return map[priority] || { bg: 'var(--border)', color: 'var(--neutral-650)' };
  }

  fmtTs(dateIso: string): string {
    const d = new Date(dateIso);
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${this.formatDate(dateIso)} · ${time}`;
  }

  resetDemoData(): void {
    try {
      localStorage.removeItem(this.STORE_KEY);
      localStorage.removeItem(this.SEQ_KEY);
      this.readAll(); // re-seeds
    } catch {
      // Ignore
    }
  }

  createTicket(input: CreateEmployeeTicketInput): EmployeeTicket {
    const tickets = this.readAll();
    const emp = this.currentEmployee();
    const now = new Date();
    const nowIso = now.toISOString();
    const sla = this.slaMatrix[input.priority] || this.slaMatrix['Medium'];

    const seq = this.nextSeq();
    const ticketId = `TKT-${seq}`;

    const newTicket: EmployeeTicket = {
      id: ticketId,
      category: input.category,
      categoryIcon: input.categoryIcon,
      subCategory: input.subCategory,
      subject: input.subject,
      description: input.description,
      priority: input.priority,
      status: 'Open',
      createdBy: emp.name,
      createdByEmp: emp.empId,
      assignedTo: null,
      assignedDept: null,
      createdDate: this.formatDate(nowIso),
      createdTs: nowIso,
      updatedTs: nowIso,
      responseDueTs: new Date(Date.now() + sla.responseHrs * 3600000).toISOString(),
      resolutionDueTs: new Date(Date.now() + sla.resolutionHrs * 3600000).toISOString(),
      attachment: input.attachment || null,
      preferredContact: input.preferredContact,
      conversation: [
        {
          by: 'employee',
          name: emp.name,
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

  private readAll(): EmployeeTicket[] {
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

  private writeAll(tickets: EmployeeTicket[]): void {
    try {
      localStorage.setItem(this.STORE_KEY, JSON.stringify(tickets));
    } catch {
      // Ignore
    }
  }

  private nextSeq(): number {
    try {
      const s = parseInt(localStorage.getItem(this.SEQ_KEY) || '1003', 10) || 1003;
      const next = s + 1;
      localStorage.setItem(this.SEQ_KEY, String(next));
      return next;
    } catch {
      return 1004;
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

  private saveJson(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore
    }
  }

  private seedTickets(): EmployeeTicket[] {
    const dayMs = 86400000;
    const iso = (daysAgo: number) => new Date(Date.now() - daysAgo * dayMs).toISOString();

    return [
      {
        id: 'TKT-1001',
        category: 'Attendance',
        categoryIcon: '⏰',
        subCategory: 'Missing Punch',
        subject: 'Missing checkout punch',
        description: 'Yesterday I forgot to punch out while leaving the office. Kindly correct my attendance.',
        priority: 'Medium',
        status: 'In Progress',
        createdBy: 'Arun Kumar',
        createdByEmp: 'EMP0001',
        assignedTo: 'Kumar (HR Executive)',
        assignedDept: 'HR',
        createdDate: this.formatDate(iso(0)),
        createdTs: iso(0),
        updatedTs: iso(0),
        responseDueTs: iso(0),
        resolutionDueTs: iso(-2),
        attachment: null,
        preferredContact: 'Email',
        conversation: [
          { by: 'employee', name: 'Arun Kumar', ts: iso(0), text: 'Yesterday checkout punch missing. I left the office at 6:35 PM but forgot to punch out.', attachment: null },
          { by: 'staff', name: 'Kumar (HR Executive)', ts: iso(0.2), text: 'Please confirm your actual checkout time and share any exit log proof if available.', attachment: null },
          { by: 'employee', name: 'Arun Kumar', ts: iso(0.3), text: '6:35 PM. I do not have proof, but the security register will have the entry.', attachment: null }
        ]
      },
      {
        id: 'TKT-1002',
        category: 'IT Support',
        categoryIcon: '💻',
        subCategory: 'Laptop / Hardware',
        subject: 'Laptop not booting',
        description: 'My laptop shows a black screen on power on. Tried hard reset, no response.',
        priority: 'High',
        status: 'Assigned',
        createdBy: 'Ravi Shankar',
        createdByEmp: 'EMP0002',
        assignedTo: 'Vignesh (IT Support)',
        assignedDept: 'IT',
        createdDate: this.formatDate(iso(0.8)),
        createdTs: iso(0.8),
        updatedTs: iso(0.7),
        responseDueTs: iso(0.8 - 2 / 24),
        resolutionDueTs: iso(0.8 - 1),
        attachment: null,
        preferredContact: 'Phone',
        conversation: [
          { by: 'employee', name: 'Ravi Shankar', ts: iso(0), text: 'Laptop is completely dead since morning. Model: Dell Latitude 5420.', attachment: null },
          { by: 'staff', name: 'Vignesh (IT Support)', ts: iso(0.1), text: 'Ticket assigned. Will come to your desk within the hour.', attachment: null }
        ]
      },
      {
        id: 'TKT-1003',
        category: 'Payroll',
        categoryIcon: '💰',
        subCategory: 'Salary Issue',
        subject: 'Salary query',
        description: 'August salary seems ₹2,000 less than expected. Need clarification on deductions.',
        priority: 'Low',
        status: 'Resolved',
        createdBy: 'Priya Darshini',
        createdByEmp: 'EMP0003',
        assignedTo: 'Rajesh (Payroll Officer)',
        assignedDept: 'Payroll',
        createdDate: this.formatDate(iso(1)),
        createdTs: iso(1),
        updatedTs: iso(0.5),
        responseDueTs: iso(0.9),
        resolutionDueTs: iso(-2),
        attachment: null,
        preferredContact: 'Email',
        resolvedTs: iso(0.5),
        conversation: [
          { by: 'employee', name: 'Priya Darshini', ts: iso(1), text: 'August salary seems ₹2,000 less than expected. Need clarification on deductions.', attachment: null }
        ]
      }
    ];
  }
}
