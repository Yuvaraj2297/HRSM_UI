import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Breadcrumb } from '../../../../../shared/breadcrumb/breadcrumb';
import {
  EmployeeTicketService,
  EmployeeTicket,
  TicketCategory
} from '../../../../../services/employee-ticket.service';

interface BarItem {
  label: string;
  value: number;
  icon?: string;
  color?: string;
  pct?: number;
}

interface EmployeeRow {
  name: string;
  emp: string;
  total: number;
  open: number;
  resolved: number;
}

interface SlaBreachedRow {
  id: string;
  subject: string;
  priority: string;
  createdDate: string;
  overdueHrs: number;
}

interface MonthlyRow {
  label: string;
  created: number;
  resolved: number;
  reopened: number;
  breached: number;
  avgHours: string | number;
}

@Component({
  selector: 'app-employee-ticket-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Breadcrumb],
  templateUrl: './employee-ticket-report.html',
  styleUrl: './employee-ticket-report.scss',
})
export class EmployeeTicketReport implements OnInit {
  public ticketService = inject(EmployeeTicketService);

  readonly BAR_COLORS: string[] = [
    'var(--blue-550)', 'var(--purple-550)', 'var(--green-550)', 'var(--orange-550)', 'var(--red-550)',
    'var(--pink-600)', 'var(--teal-550)', 'var(--green-550-4)', 'var(--orange-550-3)', 'var(--text)',
    'var(--purple-650)', 'var(--primary-dark)', 'var(--orange-550-2)', 'var(--pink-650)', 'var(--neutral-650)'
  ];

  // Summary KPIs
  kpi = {
    total: 0,
    pending: 0,
    resolved: 0,
    reopened: 0,
    breached: 0,
    avgResolution: '0h'
  };

  // Bar Charts Data
  categoryBars: BarItem[] = [];
  priorityBars: BarItem[] = [];
  deptBars: BarItem[] = [];
  statusBars: BarItem[] = [];

  // Table Data
  employeeRows: EmployeeRow[] = [];
  slaBreachedRows: SlaBreachedRow[] = [];
  monthlyRows: MonthlyRow[] = [];

  allTickets: EmployeeTicket[] = [];

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.allTickets = this.ticketService.getAllTickets();
    this.renderKpis();
    this.renderCategoryBars();
    this.renderPriorityBars();
    this.renderDeptBars();
    this.renderStatusBars();
    this.renderEmployeeTable();
    this.renderSlaTable();
    this.renderMonthlyReport();
  }

  private renderKpis(): void {
    const all = this.allTickets;
    const pendingCount = all.filter(t =>
      ['Open', 'Assigned', 'In Progress', 'Waiting for Employee', 'Reopened'].includes(t.status)
    ).length;
    const resolvedCount = all.filter(t => ['Resolved', 'Closed'].includes(t.status)).length;
    const reopenedCount = all.filter(t => t.status === 'Reopened').length;
    const breachedCount = all.filter(t => this.ticketService.slaState(t) === 'breached').length;

    const resolvedWithTs = all.filter(t => t.resolvedTs);
    let avgHours = 0;
    if (resolvedWithTs.length) {
      const sum = resolvedWithTs.reduce((acc, t) => {
        return acc + (new Date(t.resolvedTs!).getTime() - new Date(t.createdTs).getTime()) / 3600000;
      }, 0);
      avgHours = Math.round((sum / resolvedWithTs.length) * 10) / 10;
    }

    this.kpi = {
      total: all.length,
      pending: pendingCount,
      resolved: resolvedCount,
      reopened: reopenedCount,
      breached: breachedCount,
      avgResolution: `${avgHours}h`
    };
  }

  private renderCategoryBars(): void {
    const map: Record<string, number> = {};
    this.allTickets.forEach(t => {
      map[t.category] = (map[t.category] || 0) + 1;
    });

    const categories = this.ticketService.getCategories();
    const items: BarItem[] = Object.keys(map).map(catName => {
      const cat = categories.find(c => c.name === catName);
      return {
        label: catName,
        value: map[catName],
        icon: cat ? cat.icon : '📢'
      };
    }).sort((a, b) => b.value - a.value);

    const max = Math.max(...items.map(i => i.value), 1);
    this.categoryBars = items.map((item, idx) => ({
      ...item,
      color: this.BAR_COLORS[idx % this.BAR_COLORS.length],
      pct: Math.round((item.value / max) * 100)
    }));
  }

  private renderPriorityBars(): void {
    const colors: Record<string, string> = {
      'Low': 'var(--green-550)',
      'Medium': 'var(--orange-400)',
      'High': 'var(--orange-450-2)',
      'Urgent': 'var(--red-550)'
    };

    const priorities = ['Low', 'Medium', 'High', 'Urgent'];
    const items: BarItem[] = priorities.map(p => ({
      label: p,
      value: this.allTickets.filter(t => t.priority === p).length,
      icon: '●',
      color: colors[p]
    }));

    const max = Math.max(...items.map(i => i.value), 1);
    this.priorityBars = items.map(item => ({
      ...item,
      pct: Math.round((item.value / max) * 100)
    }));
  }

  private renderDeptBars(): void {
    const colors: Record<string, string> = {
      'HR': 'var(--blue-550)',
      'IT': 'var(--purple-550)',
      'Payroll': 'var(--green-550)',
      'Finance': 'var(--orange-550)',
      'Admin': 'var(--pink-600)'
    };

    const categories = this.ticketService.getCategories();
    const items: BarItem[] = Object.keys(colors).map(dept => {
      const count = this.allTickets.filter(t => {
        const cat = categories.find(c => c.name === t.category);
        return (t.assignedDept === dept) || (!t.assignedDept && cat && cat.dept === dept);
      }).length;

      return {
        label: dept,
        value: count,
        icon: '●',
        color: colors[dept]
      };
    });

    const max = Math.max(...items.map(i => i.value), 1);
    this.deptBars = items.map(item => ({
      ...item,
      pct: Math.round((item.value / max) * 100)
    }));
  }

  private renderStatusBars(): void {
    const statuses = [
      'Open', 'Assigned', 'In Progress', 'Waiting for Employee',
      'Resolved', 'Closed', 'Reopened', 'Rejected'
    ];

    const items: BarItem[] = statuses.map(s => {
      const meta = this.ticketService.statusMeta(s);
      return {
        label: s,
        value: this.allTickets.filter(t => t.status === s).length,
        icon: '●',
        color: meta.color
      };
    }).filter(i => i.value > 0);

    const max = Math.max(...items.map(i => i.value), 1);
    this.statusBars = items.map(item => ({
      ...item,
      pct: Math.round((item.value / max) * 100)
    }));
  }

  private renderEmployeeTable(): void {
    const map: Record<string, EmployeeRow> = {};
    this.allTickets.forEach(t => {
      const key = t.createdByEmp;
      if (!map[key]) {
        map[key] = {
          name: t.createdBy,
          emp: t.createdByEmp,
          total: 0,
          open: 0,
          resolved: 0
        };
      }
      map[key].total++;
      if (['Open', 'Assigned', 'In Progress', 'Waiting for Employee', 'Reopened'].includes(t.status)) {
        map[key].open++;
      }
      if (['Resolved', 'Closed'].includes(t.status)) {
        map[key].resolved++;
      }
    });

    this.employeeRows = Object.values(map).sort((a, b) => b.total - a.total);
  }

  private renderSlaTable(): void {
    const breached = this.allTickets.filter(t => this.ticketService.slaState(t) === 'breached');
    this.slaBreachedRows = breached.map(t => {
      const overdueHrs = Math.round(
        ((Date.now() - new Date(t.resolutionDueTs).getTime()) / 3600000) * 10
      ) / 10;

      return {
        id: t.id,
        subject: t.subject,
        priority: t.priority,
        createdDate: t.createdDate,
        overdueHrs: Math.max(0, overdueHrs)
      };
    });
  }

  private renderMonthlyReport(): void {
    interface MonthAgg {
      label: string;
      created: number;
      resolved: number;
      reopened: number;
      breached: number;
      resHours: number[];
    }

    const map: Record<string, MonthAgg> = {};

    this.allTickets.forEach(t => {
      const d = new Date(t.createdTs);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map[key]) {
        map[key] = {
          label: d.toLocaleString('en', { month: 'long', year: 'numeric' }),
          created: 0,
          resolved: 0,
          reopened: 0,
          breached: 0,
          resHours: []
        };
      }

      map[key].created++;
      if (t.status === 'Reopened') map[key].reopened++;
      if (this.ticketService.slaState(t) === 'breached') map[key].breached++;
      if (t.resolvedTs) {
        map[key].resolved++;
        map[key].resHours.push(
          (new Date(t.resolvedTs).getTime() - new Date(t.createdTs).getTime()) / 3600000
        );
      }
    });

    const keys = Object.keys(map).sort().reverse();
    this.monthlyRows = keys.map(k => {
      const m = map[k];
      const avg = m.resHours.length
        ? Math.round((m.resHours.reduce((a, b) => a + b, 0) / m.resHours.length) * 10) / 10
        : '—';

      return {
        label: m.label,
        created: m.created,
        resolved: m.resolved,
        reopened: m.reopened,
        breached: m.breached,
        avgHours: avg
      };
    });
  }

  exportCsv(): void {
    const headers = [
      'Ticket ID', 'Employee', 'Emp ID', 'Category', 'Sub Category',
      'Subject', 'Priority', 'Status', 'Assigned Dept', 'Assigned To',
      'Created', 'Resolution Due', 'SLA State'
    ];

    const lines = [headers.join(',')];
    this.allTickets.forEach(t => {
      lines.push([
        t.id,
        `"${t.createdBy}"`,
        t.createdByEmp,
        t.category,
        `"${t.subCategory}"`,
        `"${t.subject.replace(/"/g, '""')}"`,
        t.priority,
        t.status,
        t.assignedDept || '',
        `"${t.assignedTo || ''}"`,
        t.createdDate,
        this.ticketService.fmtTs(t.resolutionDueTs),
        this.ticketService.slaState(t)
      ].join(','));
    });

    const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ticket-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
