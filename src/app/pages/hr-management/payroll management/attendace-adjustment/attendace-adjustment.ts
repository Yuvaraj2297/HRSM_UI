import { Component, DestroyRef, HostListener, computed, inject, signal } from '@angular/core';

export type AttendanceStatus = 'FD' | 'HD' | 'A' | 'WO' | 'LWP';
type SortKey = 'name' | 'role' | 'branch';
type ColumnKey = 'employee' | 'role' | 'branch';
type MenuName = 'columns' | 'export';
type MonthData = Record<number, AttendanceStatus[]>;

export interface Employee {
  id: number;
  name: string;
  role: string;
  branch: string;
}

export interface CalendarDay {
  iso: string; // yyyy-mm-dd
  num: string; // 01
  month: string; // AUG
  weekday: string; // SAT
  dow: number; // 0 = Sunday
}

export interface StatusMenuState {
  empId: number;
  dayIdx: number;
  top: number;
  left: number;
}

export interface AttendanceChange {
  employeeId: number;
  date: string;
  status: AttendanceStatus;
}

/* ------------------------------------------------------------------ */
/*  Static data (was $employees / $statuses in the PHP file)           */
/*  Replace with an HTTP service when the API is ready.                */
/* ------------------------------------------------------------------ */

const STATUSES: AttendanceStatus[] = ['FD', 'HD', 'A', 'WO', 'LWP'];

const LEGEND: { code: AttendanceStatus; label: string }[] = [
  { code: 'FD', label: 'Full Day' },
  { code: 'HD', label: 'Half Day' },
  { code: 'A', label: 'Absent' },
  { code: 'WO', label: 'Week Off' },
  { code: 'LWP', label: 'Leave Without Pay' },
];

const EMPLOYEES: Employee[] = [
  { id: 41, name: 'Salman', role: 'Developer', branch: 'Gharuda Infotech' },
  { id: 40, name: 'Thangamuniyandi', role: 'Senior Developer', branch: 'Gharuda IT Park' },
  { id: 39, name: 'Arun Kumar', role: 'Developer', branch: 'Gharuda Infotech' },
  { id: 38, name: 'Mohammed Suhail', role: 'Developer', branch: 'Gharuda IT Park' },
  { id: 37, name: 'Rajeshwaran', role: 'Mobile App Developer', branch: 'Gharuda Infotech' },
  { id: 36, name: 'Subananthan', role: 'Developer', branch: 'Gharuda IT Park' },
  { id: 35, name: 'Jayaraj JR', role: 'Developer', branch: 'Gharuda Infotech' },
  { id: 34, name: 'Krishna Moorthy', role: 'Developer', branch: 'Gharuda IT Park' },
];

const COLUMNS: { key: ColumnKey; label: string; sort: SortKey }[] = [
  { key: 'employee', label: 'Employee', sort: 'name' },
  { key: 'role', label: 'Roles', sort: 'role' },
  { key: 'branch', label: 'Punch In Branch', sort: 'branch' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const pad = (n: number) => String(n).padStart(2, '0');
const monthKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const fmtDate = (d: Date) => `${pad(d.getDate())}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

function buildDays(first: Date): CalendarDay[] {
  const total = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return Array.from({ length: total }, (_, i) => {
    const d = new Date(first.getFullYear(), first.getMonth(), i + 1);
    return {
      iso: `${monthKey(d)}-${pad(d.getDate())}`,
      num: pad(d.getDate()),
      month: MONTHS[d.getMonth()].toUpperCase(),
      weekday: WEEKDAYS[d.getDay()],
      dow: d.getDay(),
    };
  });
}

/** Small deterministic PRNG so demo data doesn't reshuffle on every render. */
function seeded(seed: number) {
  seed = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b); // spread nearby seeds (employee ids) apart
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Same rules as the PHP demo: Sunday = WO, Saturday = FD (HD if id % 3 == 0), else random. */
function generateMonth(days: CalendarDay[], employees: Employee[]): MonthData {
  const [y, m] = days[0].iso.split('-').map(Number);
  const data: MonthData = {};
  for (const e of employees) {
    const rand = seeded(y * 10000 + m * 100 + e.id);
    data[e.id] = days.map((d) => {
      if (d.dow === 0) return 'WO';
      if (d.dow === 6) return e.id % 3 === 0 ? 'HD' : 'FD';
      return STATUSES[Math.floor(rand() * STATUSES.length)];
    });
  }
  return data;
}

const escapeHtml = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

@Component({
  selector: 'app-attendace-adjustment',
  imports: [],
  templateUrl: './attendace-adjustment.html',
  styleUrl: './attendace-adjustment.scss',
})
export class AttendaceAdjustment {
  readonly statuses = STATUSES;
  readonly legend = LEGEND;
  readonly columns = COLUMNS;
  readonly employees = signal<Employee[]>(EMPLOYEES);
  readonly branches = [...new Set(EMPLOYEES.map((e) => e.branch))];

  // --- filters / view state
  readonly month = signal(new Date(2026, 7, 1)); // Aug 2026, as in the reference
  readonly branch = signal('');
  readonly search = signal('');
  readonly sortKey = signal<SortKey | null>(null);
  readonly sortDir = signal<'asc' | 'desc'>('asc');
  readonly colVisibility = signal<Record<ColumnKey, boolean>>({ employee: true, role: true, branch: true });
  readonly openMenu = signal<MenuName | null>(null);
  readonly statusMenu = signal<StatusMenuState | null>(null);
  readonly scrolled = signal(false);
  readonly toast = signal<string | null>(null);
  readonly brokenAvatars = signal<ReadonlySet<number>>(new Set());

  // --- attendance data: `draft` is what's on screen, `saved` is the last saved state
  private readonly draft = signal<Record<string, MonthData>>({});
  private readonly saved = signal<Record<string, MonthData>>({});
  private toastTimer?: ReturnType<typeof setTimeout>;

  // --- derived
  readonly days = computed(() => buildDays(this.month()));
  readonly monthId = computed(() => monthKey(this.month()));
  readonly rangeLabel = computed(() => {
    const d = this.month();
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return `${fmtDate(d)} to ${fmtDate(last)}`;
  });

  readonly visibleColumns = computed(() => COLUMNS.filter((c) => this.colVisibility()[c.key]));
  readonly colSpan = computed(() => 1 + this.visibleColumns().length + this.days().length);

  readonly rows = computed(() => {
    const q = this.search().trim().toLowerCase();
    const branch = this.branch();
    const list = this.employees().filter(
      (e) =>
        (!branch || e.branch === branch) &&
        (!q || [e.name, e.role, e.branch, `emp${e.id}`].some((v) => v.toLowerCase().includes(q))),
    );
    const key = this.sortKey();
    if (key) {
      const dir = this.sortDir() === 'asc' ? 1 : -1;
      list.sort((a, b) => a[key].localeCompare(b[key]) * dir);
    }
    return list;
  });

  readonly changes = computed<AttendanceChange[]>(() => {
    const draft = this.draft();
    const saved = this.saved();
    const out: AttendanceChange[] = [];
    for (const [key, month] of Object.entries(draft)) {
      for (const [id, row] of Object.entries(month)) {
        row.forEach((status, i) => {
          if (status !== saved[key]?.[Number(id)]?.[i]) {
            out.push({ employeeId: Number(id), date: `${key}-${pad(i + 1)}`, status });
          }
        });
      }
    }
    return out;
  });
  readonly pendingCount = computed(() => this.changes().length);

  constructor() {
    this.loadMonth(this.month());
    inject(DestroyRef).onDestroy(() => clearTimeout(this.toastTimer));
  }

  // ---------------------------------------------------------------- month
  shiftMonth(delta: number): void {
    const d = this.month();
    const next = new Date(d.getFullYear(), d.getMonth() + delta, 1);
    this.loadMonth(next);
    this.month.set(next);
    this.statusMenu.set(null);
  }

  private loadMonth(first: Date): void {
    const key = monthKey(first);
    if (this.draft()[key]) return;
    const data = generateMonth(buildDays(first), this.employees());
    this.draft.update((all) => ({ ...all, [key]: data }));
    this.saved.update((all) => ({ ...all, [key]: clone(data) }));
  }

  // ---------------------------------------------------------------- status cells
  statusOf(empId: number, dayIdx: number): AttendanceStatus {
    return this.draft()[this.monthId()]?.[empId]?.[dayIdx] ?? 'FD';
  }

  isChanged(empId: number, dayIdx: number): boolean {
    return this.statusOf(empId, dayIdx) !== this.saved()[this.monthId()]?.[empId]?.[dayIdx];
  }

  setStatus(empId: number, dayIdx: number, status: AttendanceStatus): void {
    const key = this.monthId();
    this.draft.update((all) => {
      const month = all[key] ?? {};
      const row = [...(month[empId] ?? [])];
      row[dayIdx] = status;
      return { ...all, [key]: { ...month, [empId]: row } };
    });
  }

  statusClass(code: AttendanceStatus): string {
    return 'st-' + code.toLowerCase();
  }

  statusLabel(code: AttendanceStatus): string {
    return LEGEND.find((l) => l.code === code)?.label ?? code;
  }

  cellLabel(emp: Employee, day: CalendarDay, code: AttendanceStatus): string {
    return `${emp.name}, ${day.num} ${day.month}: ${this.statusLabel(code)}. Change status`;
  }

  openStatusMenu(ev: MouseEvent, emp: Employee, dayIdx: number): void {
    const cur = this.statusMenu();
    if (cur && cur.empId === emp.id && cur.dayIdx === dayIdx) {
      this.statusMenu.set(null);
      return;
    }
    const r = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const menuHeight = 12 + STATUSES.length * 30;
    const flip = r.bottom + 4 + menuHeight > window.innerHeight;
    this.statusMenu.set({
      empId: emp.id,
      dayIdx,
      left: Math.max(8, Math.min(r.left, window.innerWidth - 100)),
      top: flip ? r.top - 4 - menuHeight : r.bottom + 4,
    });
    this.openMenu.set(null);
  }

  chooseStatus(status: AttendanceStatus): void {
    const m = this.statusMenu();
    if (!m) return;
    this.setStatus(m.empId, m.dayIdx, status);
    this.statusMenu.set(null);
    // hand focus back to the badge that opened the menu
    queueMicrotask(() => document.getElementById(`cell-${m.empId}-${m.dayIdx}`)?.focus());
  }

  // ---------------------------------------------------------------- filters / sort / columns
  onSearch(e: Event): void {
    this.search.set((e.target as HTMLInputElement).value);
  }

  onBranchChange(e: Event): void {
    this.branch.set((e.target as HTMLSelectElement).value);
  }

  toggleSort(key: SortKey): void {
    if (this.sortKey() !== key) {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    } else if (this.sortDir() === 'asc') {
      this.sortDir.set('desc');
    } else {
      this.sortKey.set(null);
    }
  }

  ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
    if (this.sortKey() !== key) return 'none';
    return this.sortDir() === 'asc' ? 'ascending' : 'descending';
  }

  toggleColumn(key: ColumnKey): void {
    this.colVisibility.update((v) => ({ ...v, [key]: !v[key] }));
  }

  toggleMenu(name: MenuName): void {
    this.openMenu.update((cur) => (cur === name ? null : name));
    this.statusMenu.set(null);
  }

  // ---------------------------------------------------------------- avatar
  avatarSrc(emp: Employee): string {
    return `/assets/profile-1.jpg`;
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('');
  }

  onAvatarError(id: number): void {
    this.brokenAvatars.update((s) => new Set(s).add(id));
  }

  // ---------------------------------------------------------------- save
  save(): void {
    const changes = this.changes();
    if (!changes.length) {
      this.showToast('No changes to save');
      return;
    }
    // TODO: POST `changes` to the API, and only mark as saved on success.
    console.log('Attendance adjustments to save:', changes);
    this.saved.set(clone(this.draft()));
    this.showToast(`Saved ${changes.length} attendance ${changes.length === 1 ? 'change' : 'changes'}`);
  }

  private showToast(message: string): void {
    clearTimeout(this.toastTimer);
    this.toast.set(message);
    this.toastTimer = setTimeout(() => this.toast.set(null), 3000);
  }

  // ---------------------------------------------------------------- export
  export(kind: 'xls' | 'csv'): void {
    this.openMenu.set(null);
    const cols = this.visibleColumns();
    const days = this.days();
    const header = ['S.No', ...cols.map((c) => c.label), ...days.map((d) => `${d.num} ${d.weekday}`)];
    const body = this.rows().map((e, i) => [
      String(i + 1),
      ...cols.map((c) => this.cellText(e, c.key)),
      ...days.map((_, di) => this.statusOf(e.id, di)),
    ]);
    const table = [header, ...body];
    const name = `attendance-adjustment-${this.monthId()}`;

    if (kind === 'csv') {
      const csv = table.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(',')).join('\r\n');
      this.download(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }), `${name}.csv`);
    } else {
      const rows = table
        .map((r, i) => `<tr>${r.map((v) => (i === 0 ? `<th>${escapeHtml(v)}</th>` : `<td>${escapeHtml(v)}</td>`)).join('')}</tr>`)
        .join('');
      const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="utf-8"></head><body><table border="1">${rows}</table></body></html>`;
      this.download(new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel' }), `${name}.xls`);
    }
  }

  private cellText(e: Employee, key: ColumnKey): string {
    if (key === 'employee') return `${e.name} (EMP${e.id})`;
    return key === 'role' ? e.role : e.branch;
  }

  private download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // ---------------------------------------------------------------- global listeners
  onTableScroll(e: Event): void {
    this.scrolled.set((e.target as HTMLElement).scrollLeft > 0);
    this.statusMenu.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    const t = e.target as HTMLElement | null;
    if (!t?.closest('.tb-menu')) this.openMenu.set(null);
    if (!t?.closest('.st-menu, .st-btn')) this.statusMenu.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.openMenu.set(null);
    this.statusMenu.set(null);
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onViewportChange(): void {
    this.statusMenu.set(null);
  }
}
