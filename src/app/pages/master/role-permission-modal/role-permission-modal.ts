import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  computed,
  signal,
} from '@angular/core';

declare var bootstrap: any;

/* =========================================================
   TYPES
========================================================= */

export type CapabilityKey = 'view_own' | 'view_global' | 'create' | 'edit' | 'delete';

export interface PermissionModule {
  id: number;
  key: string;
  group: string;
  name: string;
  caps: CapabilityKey[];
}

/** Emitted on save. `permissions` = ["hr_org_view_own", "hr_org_create", ...] */
export interface RolePermissionSaveEvent {
  roleId: any;
  roleName: string;
  permissions: string[];
}

/* =========================================================
   STATIC CONFIG (same as the PHP master data)
========================================================= */

export const CAP_LABELS: Record<CapabilityKey, string> = {
  view_own: 'View(Own)',
  view_global: 'View(Global)',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
};

export const GROUP_ICONS: Record<string, string> = {
  'HR Management': 'bi-people-fill',
  'Timesheet & Leave': 'bi-clock-history',
  'HR Record': 'bi-folder-symlink',
};

const ALL: CapabilityKey[] = ['view_own', 'view_global', 'create', 'edit', 'delete'];

export const DEFAULT_MODULES: PermissionModule[] = [
  { id: 1, key: 'hr_dashboard', group: 'HR Management', name: 'HR Dashboard', caps: ['view_own'] },
  { id: 2, key: 'hr_org', group: 'HR Management', name: 'Organization', caps: ALL },
  { id: 3, key: 'hr_records', group: 'HR Management', name: 'Employees (Records)', caps: ALL },
  { id: 4, key: 'hr_shift', group: 'HR Management', name: 'Shift Management', caps: ALL },
  { id: 5, key: 'hr_loan', group: 'HR Management', name: 'Loan & Advances', caps: ALL },
  { id: 6, key: 'hr_payroll', group: 'HR Management', name: 'Payroll Management', caps: ALL },
  { id: 7, key: 'ts_checkin', group: 'Timesheet & Leave', name: 'Timesheet Check In Out', caps: ['view_own'] },
  { id: 8, key: 'ts_att', group: 'Timesheet & Leave', name: 'Timesheet - Attendance', caps: ALL },
  { id: 9, key: 'ts_punch', group: 'Timesheet & Leave', name: 'Timesheet - Punch In Reports', caps: ALL },
  { id: 10, key: 'ts_ot', group: 'Timesheet & Leave', name: 'Timesheet - Overtime', caps: ALL },
  { id: 11, key: 'ts_leave', group: 'Timesheet & Leave', name: 'Timesheet - Leave', caps: ALL },
  { id: 12, key: 'ts_leave_report', group: 'Timesheet & Leave', name: 'Leave Report', caps: ['view_own', 'view_global'] },
  { id: 13, key: 'ts_permreq', group: 'Timesheet & Leave', name: 'Permission Requests', caps: ALL },
  { id: 14, key: 'recruit', group: 'HR Record', name: 'Recruitment', caps: ['view_global', 'create', 'edit', 'delete'] },
  { id: 15, key: 'hr_onboard', group: 'HR Record', name: 'Onboarding', caps: ALL },
  { id: 16, key: 'hr_perf', group: 'HR Record', name: 'Performance', caps: ALL },
];

/* =========================================================
   COMPONENT
========================================================= */

@Component({
  selector: 'app-role-permission-modal',
  standalone: true,
  templateUrl: './role-permission-modal.html',
  styleUrl: './role-permission-modal.scss',
})
export class RolePermissionModal implements AfterViewInit {
  @ViewChild('permModal') permModal!: ElementRef;

  @Output() saved = new EventEmitter<RolePermissionSaveEvent>();

  private modalInstance: any;

  readonly capLabels = CAP_LABELS;

  /* ---------- state ---------- */

  role = signal<any>(null);
  modules = signal<PermissionModule[]>(DEFAULT_MODULES);
  selected = signal<ReadonlySet<string>>(new Set());
  search = signal('');

  /* ---------- derived ---------- */

  roleName = computed(() => {
    const r = this.role();
    return r?.roleName ?? r?.role_name ?? r?.name ?? '';
  });

  /** modules filtered by name (search), grouped in original order */
  groups = computed(() => {
    const q = this.search().trim().toLowerCase();

    const map = new Map<string, PermissionModule[]>();
    this.modules()
      .filter((m) => !q || m.name.toLowerCase().includes(q))
      .forEach((m) => {
        if (!map.has(m.group)) map.set(m.group, []);
        map.get(m.group)!.push(m);
      });

    return Array.from(map, ([name, modules]) => ({
      name,
      icon: GROUP_ICONS[name] ?? 'bi-grid-1x2',
      modules,
    }));
  });

  selectedCount = computed(() => {
    const sel = this.selected();
    return this.modules().reduce((n, m) => n + m.caps.filter((c) => sel.has(this.value(m, c))).length, 0);
  });

  /* =======================================================
     LIFECYCLE
  ======================================================= */

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || typeof bootstrap === 'undefined' || !bootstrap.Modal) {
      return;
    }

    this.modalInstance = bootstrap.Modal.getOrCreateInstance(this.permModal.nativeElement);
  }

  /* =======================================================
     OPEN / CLOSE
  ======================================================= */

  /**
   * @param role      the role row that was clicked
   * @param existing  saved permissions: string[] like ["hr_org_view_own"] (or { value: true } map)
   * @param modules   optional module list (defaults to DEFAULT_MODULES)
   */
  open(role: any, existing?: string[] | Record<string, boolean> | null, modules?: PermissionModule[]): void {
    this.role.set(role);
    if (modules) this.modules.set(modules);

    let values: string[] = [];
    if (Array.isArray(existing)) {
      values = existing;
    } else if (existing && typeof existing === 'object') {
      values = Object.keys(existing).filter((k) => existing[k]);
    }

    this.search.set('');
    this.selected.set(new Set(values));

    this.modalInstance?.show();
  }

  close(): void {
    this.modalInstance?.hide();
  }

  /* =======================================================
     CHECKBOX HELPERS
  ======================================================= */

  /** checkbox value, e.g. "hr_org_view_own" */
  value(m: PermissionModule, c: CapabilityKey): string {
    return `${m.key}_${c}`;
  }

  isChecked(m: PermissionModule, c: CapabilityKey): boolean {
    return this.selected().has(this.value(m, c));
  }

  private setMany(values: string[], checked: boolean): void {
    const next = new Set(this.selected());
    values.forEach((v) => (checked ? next.add(v) : next.delete(v)));
    this.selected.set(next);
  }

  toggle(m: PermissionModule, c: CapabilityKey): void {
    this.setMany([this.value(m, c)], !this.isChecked(m, c));
  }

  isRowAll(m: PermissionModule): boolean {
    return m.caps.every((c) => this.isChecked(m, c));
  }

  toggleRow(m: PermissionModule): void {
    this.setMany(
      m.caps.map((c) => this.value(m, c)),
      !this.isRowAll(m),
    );
  }

  /** header links — like the PHP page, they apply to every module (even ones hidden by search) */
  private setAll(checked: boolean): void {
    this.setMany(
      this.modules().flatMap((m) => m.caps.map((c) => this.value(m, c))),
      checked,
    );
  }

  selectAll(): void {
    this.setAll(true);
  }

  deselectAll(): void {
    this.setAll(false);
  }

  /* =======================================================
     SAVE
  ======================================================= */

  save(): void {
    const sel = this.selected();

    const permissions = this.modules().flatMap((m) =>
      m.caps.map((c) => this.value(m, c)).filter((v) => sel.has(v)),
    );

    this.saved.emit({
      roleId: this.role()?.id,
      roleName: this.roleName(),
      permissions,
    });

    this.close();
  }
}