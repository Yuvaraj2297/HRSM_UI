import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarDatepickerDirective } from '../../../../common/directives/datepicker';
import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
} from '../../../../shared/primedatatable/primedatatable';

import { AppSelect } from '../../../../shared/app-select/app-select';
type Milestone = 'Pre-Boarding' | 'Day 1 Induction' | 'Week 1 Milestones' | '30-Day Review' | '60-90 Day Goal';
type TaskStatus = 'Upcoming' | 'Pending' | 'In Progress' | 'Completed';
type StatusFilter = TaskStatus | 'overdue' | null;

interface ChecklistTask {
  id: number;
  title: string;
  milestone: Milestone;
  joiner: string; // '' = template default for all joiners
  owner: string;
  dueDate: string; // yyyy-mm-dd, '' = no due date
  status: TaskStatus;
}

/** a table row: the task plus display-only fields */
interface ChecklistRow extends ChecklistTask {
  sno: number;
  role: string;
  department: string;
  overdue: boolean;
}

const MILESTONES: { value: Milestone; icon: string; tone: string }[] = [
  { value: 'Pre-Boarding',      icon: 'bi bi-envelope-paper', tone: 'var(--warning)' },
  { value: 'Day 1 Induction',   icon: 'bi bi-door-open',      tone: 'var(--blue-450)' },
  { value: 'Week 1 Milestones', icon: 'bi bi-calendar-week',  tone: 'var(--purple-500)' },
  { value: '30-Day Review',     icon: 'bi bi-clipboard-check', tone: 'var(--teal-350)' },
  { value: '60-90 Day Goal',    icon: 'bi bi-flag',           tone: 'var(--primary)' },
];

const STATUSES: TaskStatus[] = ['Upcoming', 'Pending', 'In Progress', 'Completed'];

const JOINERS: { name: string; role: string; department: string }[] = [
  { name: 'Kavitha Raman',  role: 'UI/UX Designer',    department: 'Design' },
  { name: 'Rahul Verma',    role: 'Backend Engineer',  department: 'Engineering' },
  { name: 'Siddharth Nair', role: 'iOS App Developer', department: 'Engineering' },
  { name: 'Priya Sundaram', role: 'Financial Analyst', department: 'Finance' },
];

const TASKS: ChecklistTask[] = [
  { id: 1, title: 'Complete Background Verification & Address Proof',      milestone: 'Pre-Boarding',      joiner: 'Kavitha Raman',  owner: 'HR Operations',         dueDate: '2026-09-10', status: 'Completed' },
  { id: 2, title: 'Issue Hardware & Work Email ID (Laptop + Access Card)', milestone: 'Day 1 Induction',   joiner: 'Kavitha Raman',  owner: 'IT Admin',              dueDate: '2026-09-15', status: 'Completed' },
  { id: 3, title: 'Conduct HR Policy Briefing & Code of Conduct Sign-off', milestone: 'Day 1 Induction',   joiner: 'Rahul Verma',    owner: 'Sarah Mitchell (HR)',   dueDate: '2026-09-22', status: 'Pending' },
  { id: 4, title: 'Department Architecture Walkthrough & Buddy Pairing',   milestone: 'Week 1 Milestones', joiner: 'Siddharth Nair', owner: 'David Anderson (Lead)', dueDate: '2026-10-02', status: 'In Progress' },
  { id: 5, title: '30-Day Performance Review & Probation Assessment',      milestone: '30-Day Review',     joiner: 'Priya Sundaram', owner: 'Emily Clark (Manager)', dueDate: '2026-10-20', status: 'Upcoming' },
  { id: 6, title: 'Set 90-Day Goals with Reporting Manager',               milestone: '60-90 Day Goal',    joiner: '',               owner: 'Reporting Manager',     dueDate: '',           status: 'Upcoming' },
];

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [AppSelect, CommonModule, ReactiveFormsModule, PrimeDataTable, AppStatCard, CalendarDatepickerDirective],
  templateUrl: './checklist.html',
  styleUrl: './checklist.scss',
})
export class Checklist {
  private readonly fb = inject(FormBuilder);

  readonly milestones = MILESTONES;

  readonly tableHeader: PrimeTableHeader = {
    title: 'Onboarding Checklist',
    icon: 'bi bi-list-check',
  };

  readonly columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.NO', width: '65px', sortable: false },
    { field: 'title', header: 'TASK', width: '340px', sortable: true, type: 'custom' },
    { field: 'milestone', header: 'MILESTONE', width: '180px', sortable: true, type: 'custom' },
    { field: 'joiner', header: 'JOINER', width: '200px', sortable: true, type: 'custom' },
    { field: 'owner', header: 'TASK OWNER', width: '180px', sortable: true },
    { field: 'dueDate', header: 'DUE DATE', width: '130px', sortable: true, type: 'custom' },
    { field: 'status', header: 'STATUS', width: '140px', sortable: true, type: 'custom' },
    { field: 'actions', header: 'ACTION', width: '100px', type: 'actions' },
  ];

  readonly tableActions = { add: false, edit: true, delete: true };

  readonly milestoneOptions = MILESTONES.map((m) => ({ label: m.value, value: m.value }));
  readonly statusOptions = STATUSES.map((s) => ({ label: s, value: s }));
  readonly joinerOptions = [
    { label: 'All joiners (template default)', value: '' },
    ...JOINERS.map((j) => ({ label: `${j.name} (${j.role})`, value: j.name })),
  ];

  readonly tasks = signal<ChecklistTask[]>(TASKS);

  // ---------------------------------------------------------------- filters
  readonly milestone = signal<Milestone | null>(null);
  readonly statusFilter = signal<StatusFilter>(null);

  private readonly allRows = computed<ChecklistRow[]>(() => {
    const today = todayIso();
    return this.tasks().map((t, i) => {
      const j = JOINERS.find((x) => x.name === t.joiner);
      return {
        ...t,
        sno: i + 1,
        role: j?.role ?? '',
        department: j?.department ?? '',
        overdue: !!t.dueDate && t.status !== 'Completed' && t.dueDate < today,
      };
    });
  });

  readonly rows = computed(() => {
    const ms = this.milestone();
    const st = this.statusFilter();
    return this.allRows()
      .filter((r) => (!ms || r.milestone === ms) && matchesStatus(r, st))
      .map((r, i) => ({ ...r, sno: i + 1 }));
  });

  /** tab counts follow the status filter, so the numbers match what you'll see */
  readonly milestoneCounts = computed(() => {
    const st = this.statusFilter();
    const counts: Record<string, number> = {};
    for (const r of this.allRows()) {
      if (matchesStatus(r, st)) counts[r.milestone] = (counts[r.milestone] ?? 0) + 1;
    }
    return counts;
  });

  readonly stats = computed(() => {
    const rows = this.allRows();
    const completed = rows.filter((r) => r.status === 'Completed').length;
    return {
      total: rows.length,
      completed,
      completedPct: rows.length ? Math.round((completed / rows.length) * 100) : 0,
      inProgress: rows.filter((r) => r.status === 'In Progress').length,
      overdue: rows.filter((r) => r.overdue).length,
    };
  });

  /** stat cards double as a status filter — click again to clear */
  toggleStatus(s: StatusFilter): void {
    this.statusFilter.set(this.statusFilter() === s ? null : s);
  }

  milestoneMeta(m: Milestone) {
    return MILESTONES.find((x) => x.value === m)!;
  }

  /** the tick box in the Task cell: tick = Completed, untick = back to In Progress */
  toggleComplete(row: ChecklistRow, checked: boolean): void {
    this.patch(row.id, { status: checked ? 'Completed' : 'In Progress' });
  }

  onAction(e: { action: string; row: ChecklistRow }): void {
    if (e.action === 'edit') this.openEdit(e.row);
    if (e.action === 'delete') this.deleting.set(e.row);
  }

  // ---------------------------------------------------------------- add / edit modal
  readonly modalOpen = signal(false);
  editingId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(150)]],
    milestone: ['Pre-Boarding' as Milestone, Validators.required],
    joiner: [''],
    owner: [''],
    dueDate: [''], // DD/MM/YYYY from the calendar picker
    status: ['Pending' as TaskStatus, Validators.required],
  });

  openAdd(): void {
    this.editingId = null;
    this.form.reset({ milestone: this.milestone() ?? 'Pre-Boarding', status: 'Pending' });
    this.modalOpen.set(true);
  }

  openEdit(row: ChecklistRow): void {
    this.editingId = row.id;
    this.form.reset({
      title: row.title,
      milestone: row.milestone,
      joiner: row.joiner,
      owner: row.owner,
      dueDate: isoToDmy(row.dueDate),
      status: row.status,
    });
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const task = {
      title: v.title.trim(),
      milestone: v.milestone,
      joiner: v.joiner,
      owner: v.owner.trim(),
      dueDate: dmyToIso(v.dueDate),
      status: v.status,
    };

    if (this.editingId !== null) {
      this.patch(this.editingId, task);
    } else {
      this.tasks.update((list) => [...list, { id: Math.max(0, ...list.map((t) => t.id)) + 1, ...task }]);
    }
    this.closeModal();
  }

  invalid(name: 'title' | 'milestone'): boolean {
    const c = this.form.controls[name];
    return c.invalid && c.touched;
  }

  // ---------------------------------------------------------------- delete confirm
  readonly deleting = signal<ChecklistRow | null>(null);

  confirmDelete(): void {
    const row = this.deleting();
    if (row) this.tasks.update((list) => list.filter((t) => t.id !== row.id));
    this.deleting.set(null);
  }

  // ---------------------------------------------------------------- helpers
  private patch(id: number, changes: Partial<ChecklistTask>): void {
    this.tasks.update((list) => list.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  }

  statusClass(s: TaskStatus): string {
    return { Completed: 'status-success', 'In Progress': 'status-warning', Pending: 'status-pending', Upcoming: 'status-muted' }[s];
  }

  fmtDate(iso: string): string {
    return iso
      ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—';
  }
}

// ------------------------------------------------------------------ pure helpers

function matchesStatus(r: ChecklistRow, f: StatusFilter): boolean {
  if (!f) return true;
  return f === 'overdue' ? r.overdue : r.status === f;
}

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isoToDmy(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function dmyToIso(dmy: string): string {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dmy.trim());
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
}
