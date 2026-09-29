import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarDatepickerDirective } from '../../../../common/directives/datepicker';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
} from '../../../../shared/primedatatable/primedatatable';
import { AppStatCard } from '../../../../shared/stat-card/stat-card';

import { AppSelect } from '../../../../shared/app-select/app-select';
type AssetType = 'Laptop' | 'Desktop' | 'Monitor' | 'Mobile' | 'Headset' | 'ID Card' | 'Access Card';
type AssetStatus = 'Requested' | 'Approved' | 'Assigned' | 'Returned' | 'Damaged';
type Condition = 'New' | 'Good' | 'Used' | 'Damaged';
/** stat-card filter: one status, or a group of statuses */
type StatusFilter = 'pending' | 'Assigned' | 'closed' | null;

interface Employee {
  name: string;
  empId: string;
  dept: string;
  role: string;
  avatar: string;
}

interface Asset {
  id: number;
  empId: string;
  type: AssetType;
  model: string;
  assetTag: string;
  serial: string;
  assignedDate: string; // yyyy-mm-dd
  assignedBy: string;
  condition: Condition;
  accessories: string;
  location: string;
  returnDate: string; // yyyy-mm-dd, '' = permanent
  status: AssetStatus;
  remarks: string;
}

/** a table row: the asset plus the employee it belongs to */
interface AssetRow extends Asset {
  sno: number;
  empName: string;
  role: string;
  dept: string;
  avatar: string;
}

const ASSET_TYPES: { value: AssetType; label: string; icon: string }[] = [
  { value: 'Laptop',      label: 'Laptop',               icon: 'bi bi-laptop' },
  { value: 'Desktop',     label: 'Desktop PC',           icon: 'bi bi-pc-display' },
  { value: 'Monitor',     label: 'Monitor',              icon: 'bi bi-display' },
  { value: 'Mobile',      label: 'Mobile / Test Device', icon: 'bi bi-phone' },
  { value: 'Headset',     label: 'Headset',              icon: 'bi bi-headphones' },
  { value: 'ID Card',     label: 'ID Card',              icon: 'bi bi-person-badge' },
  { value: 'Access Card', label: 'Access Card / Key',    icon: 'bi bi-key' },
];

/** lifecycle order; Damaged is an exit state after Assigned */
const LIFECYCLE: AssetStatus[] = ['Requested', 'Approved', 'Assigned', 'Returned'];

const STATUS_META: Record<AssetStatus, { cls: string; icon: string }> = {
  Requested: { cls: 'status-pending',  icon: 'bi bi-hourglass-split' },
  Approved:  { cls: 'status-warning',  icon: 'bi bi-hand-thumbs-up' },
  Assigned:  { cls: 'status-success',  icon: 'bi bi-check-circle-fill' },
  Returned:  { cls: 'status-muted',    icon: 'bi bi-box-arrow-in-left' },
  Damaged:   { cls: 'status-rejected', icon: 'bi bi-exclamation-triangle-fill' },
};

/** the one-click "next step" offered in the view modal */
const NEXT_STEP: Partial<Record<AssetStatus, { to: AssetStatus; label: string; icon: string }>> = {
  Requested: { to: 'Approved', label: 'Approve Request',  icon: 'bi bi-hand-thumbs-up' },
  Approved:  { to: 'Assigned', label: 'Mark Handed Over', icon: 'bi bi-box-arrow-right' },
  Assigned:  { to: 'Returned', label: 'Mark Returned',    icon: 'bi bi-box-arrow-in-left' },
};

const EMPLOYEES: Employee[] = [
  { name: 'Kavitha Raman',   empId: 'EMP-2026-041', dept: 'Design',      role: 'UI/UX Designer',    avatar: 'assets/profile-1.jpg' },
  { name: 'Rahul Verma',     empId: 'EMP-2026-042', dept: 'Engineering', role: 'Backend Engineer',  avatar: 'assets/profile-2.jpg' },
  { name: 'Siddharth Nair',  empId: 'EMP-2026-043', dept: 'Engineering', role: 'iOS App Developer', avatar: 'assets/profile-3.jpg' },
  { name: 'Priya Sundaram',  empId: 'EMP-2026-044', dept: 'Finance',     role: 'Financial Analyst', avatar: 'assets/profile-4.jpg' },
  { name: 'Ananya Sundaram', empId: 'EMP-2026-045', dept: 'Design',      role: 'UI/UX Designer',    avatar: '' },
];

const ASSETS: Asset[] = [
  { id: 1, empId: 'EMP-2026-041', type: 'Laptop',      model: 'MacBook Pro 16" (M3 Max, 36GB, 1TB)', assetTag: 'AST-MAC-2026-081', serial: 'C02G4109Q05P',    assignedDate: '2026-09-01', assignedBy: 'IT Admin (Sarah Mitchell)', condition: 'New',     accessories: 'Magic Mouse, 140W USB-C Charger, Laptop Bag', location: 'Office (HQ - Chennai)', returnDate: '',           status: 'Assigned',  remarks: 'Workstation for the design team.' },
  { id: 2, empId: 'EMP-2026-042', type: 'Monitor',     model: 'Dell UltraSharp 27" 4K USB-C',        assetTag: 'AST-MON-2026-014', serial: 'CN-0V283H-74261', assignedDate: '2026-09-20', assignedBy: 'IT Admin (Sarah Mitchell)', condition: 'Good',    accessories: 'HDMI Cable, DisplayPort Cable, Power Cable',  location: 'Office (HQ - Chennai)', returnDate: '',           status: 'Approved',  remarks: 'Approved by Tech Lead, awaiting pickup.' },
  { id: 3, empId: 'EMP-2026-043', type: 'Mobile',      model: 'iPhone 15 Pro 256GB (Test Device)',   assetTag: 'AST-MOB-2026-009', serial: 'F2LXW099PN23',    assignedDate: '2026-09-25', assignedBy: 'Admin Support',             condition: 'Used',    accessories: 'USB-C Cable, Protective Case',                location: 'Remote (WFH)',          returnDate: '2027-03-31', status: 'Requested', remarks: 'For iOS build & testing.' },
  { id: 4, empId: 'EMP-2026-044', type: 'Access Card', model: 'Biometric RFID Access Card',          assetTag: 'ACC-BLR-8819',     serial: 'RFID-994821',     assignedDate: '2026-01-10', assignedBy: 'HR Operations',             condition: 'Good',    accessories: 'Company Lanyard, Card Holder',                location: 'Branch Office',         returnDate: '2026-08-31', status: 'Returned',  remarks: 'Returned at exit clearance.' },
  { id: 5, empId: 'EMP-2026-045', type: 'Headset',     model: 'Jabra Evolve2 65 Wireless',           assetTag: 'AST-HDS-2026-033', serial: 'JAB-772910',      assignedDate: '2026-02-05', assignedBy: 'Admin Support',             condition: 'Damaged', accessories: 'Charging Stand, USB Dongle',                  location: 'Office (HQ - Chennai)', returnDate: '',           status: 'Damaged',   remarks: 'Mic boom arm faulty; sent for vendor repair.' },
  { id: 6, empId: 'EMP-2026-041', type: 'ID Card',     model: 'Employee Photo ID Card',              assetTag: 'IDC-2026-0412',    serial: 'IDC-0412',        assignedDate: '2026-09-01', assignedBy: 'HR Operations',             condition: 'New',     accessories: 'Lanyard',                                     location: 'Office (HQ - Chennai)', returnDate: '',           status: 'Assigned',  remarks: '' },
];

const opts = (...v: string[]) => v.map((x) => ({ label: x, value: x }));

@Component({
  selector: 'app-asset-provisioning',
  standalone: true,
  imports: [AppSelect, CommonModule, ReactiveFormsModule, PrimeDataTable, AppStatCard, CalendarDatepickerDirective],
  templateUrl: './asset-provisioning.html',
  styleUrl: './asset-provisioning.scss',
})
export class AssetProvisioning {
  private readonly fb = inject(FormBuilder);

  readonly assetTypes = ASSET_TYPES;
  readonly lifecycle = LIFECYCLE;

  readonly tableHeader: PrimeTableHeader = {
    title: 'Asset Provisioning',
    icon: 'bi bi-laptop',
  };

  readonly columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.NO', width: '65px', sortable: false },
    { field: 'empName', header: 'EMPLOYEE', width: '220px', sortable: true, type: 'custom' },
    { field: 'model', header: 'ASSET', width: '260px', sortable: true, type: 'custom' },
    { field: 'assetTag', header: 'TAG / SERIAL', width: '180px', sortable: true, type: 'custom' },
    { field: 'assignedDate', header: 'ASSIGNED', width: '190px', sortable: true, type: 'custom' },
    { field: 'condition', header: 'CONDITION', width: '190px', sortable: true, type: 'custom' },
    { field: 'returnDate', header: 'RETURN BY', width: '130px', sortable: true, type: 'custom' },
    { field: 'status', header: 'STATUS', width: '140px', sortable: true, type: 'custom' },
    {
      field: 'actions', header: 'ACTION', width: '150px', type: 'pill-actions',
      buttons: [
        { key: 'view', label: '', icon: 'bi bi-eye', variant: 'outline', tooltip: 'View asset' },
        { key: 'edit', icon: 'bi bi-pencil', tooltip: 'Edit asset' },
      ],
    },
  ];

  readonly employeeOptions = EMPLOYEES.map((e) => ({ label: e.name, value: e.empId, sub: `${e.empId} • ${e.role}` }));
  readonly typeOptions = ASSET_TYPES.map((t) => ({ label: t.label, value: t.value, icon: t.icon }));
  readonly statusOptions = opts('Requested', 'Approved', 'Assigned', 'Returned', 'Damaged');
  readonly conditionOptions = opts('New', 'Good', 'Used', 'Damaged');
  readonly locationOptions = opts('Office (HQ - Chennai)', 'Branch Office', 'Remote (WFH)');
  readonly assignedByOptions = opts('IT Admin (Sarah Mitchell)', 'HR Operations', 'Admin Support');

  readonly assets = signal<Asset[]>(ASSETS);

  // ---------------------------------------------------------------- filters
  readonly type = signal<AssetType | null>(null);
  readonly statusFilter = signal<StatusFilter>(null);

  private readonly allRows = computed<AssetRow[]>(() =>
    this.assets().map((a, i) => {
      const e = employee(a.empId);
      return { ...a, sno: i + 1, empName: e?.name ?? a.empId, role: e?.role ?? '', dept: e?.dept ?? '', avatar: e?.avatar ?? '' };
    }),
  );

  readonly rows = computed(() => {
    const t = this.type();
    const st = this.statusFilter();
    return this.allRows()
      .filter((r) => (!t || r.type === t) && matchesStatus(r.status, st))
      .map((r, i) => ({ ...r, sno: i + 1 }));
  });

  /** tab counts follow the status filter, so the numbers match what you'll see */
  readonly typeCounts = computed(() => {
    const st = this.statusFilter();
    const counts: Record<string, number> = {};
    for (const a of this.assets()) {
      if (matchesStatus(a.status, st)) counts[a.type] = (counts[a.type] ?? 0) + 1;
    }
    return counts;
  });

  readonly stats = computed(() => {
    const list = this.assets();
    return {
      total: list.length,
      pending: list.filter((a) => matchesStatus(a.status, 'pending')).length,
      inUse: list.filter((a) => a.status === 'Assigned').length,
      closed: list.filter((a) => matchesStatus(a.status, 'closed')).length,
    };
  });

  toggleStatus(s: StatusFilter): void {
    this.statusFilter.set(this.statusFilter() === s ? null : s);
  }

  onAction(e: { action: string; row: AssetRow }): void {
    if (e.action === 'view') this.viewing.set(e.row.id);
    if (e.action === 'edit') this.openEdit(e.row);
  }

  // ---------------------------------------------------------------- view modal
  private readonly viewing = signal<number | null>(null);

  /** looked up live, so the modal reflects a lifecycle change made from inside it */
  readonly viewRow = computed(() => this.allRows().find((r) => r.id === this.viewing()) ?? null);

  closeView(): void {
    this.viewing.set(null);
  }

  nextStep(status: AssetStatus) {
    return NEXT_STEP[status] ?? null;
  }

  advance(row: AssetRow): void {
    const step = NEXT_STEP[row.status];
    if (!step) return;
    this.patch(row.id, {
      status: step.to,
      ...(step.to === 'Returned' && !row.returnDate ? { returnDate: todayIso() } : {}),
    });
  }

  markDamaged(row: AssetRow): void {
    this.patch(row.id, { status: 'Damaged', condition: 'Damaged' });
  }

  /** stepper state for each lifecycle stage */
  stepState(status: AssetStatus, stage: AssetStatus): 'completed' | 'active' | '' {
    // a damaged asset got as far as Assigned, then left the normal flow
    const at = status === 'Damaged' ? LIFECYCLE.indexOf('Assigned') : LIFECYCLE.indexOf(status);
    const i = LIFECYCLE.indexOf(stage);
    if (i < at || (status === 'Returned' && i === at)) return 'completed';
    return i === at ? 'active' : '';
  }

  accessoriesList(s: string): string[] {
    return s.split(',').map((x) => x.trim()).filter(Boolean);
  }

  // ---------------------------------------------------------------- add / edit modal
  readonly formOpen = signal(false);
  editingId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    empId: ['', Validators.required],
    type: ['Laptop' as AssetType, Validators.required],
    model: ['', [Validators.required, Validators.maxLength(120)]],
    assetTag: ['', Validators.required],
    serial: ['', Validators.required],
    assignedDate: ['', Validators.required], // DD/MM/YYYY from the calendar picker
    assignedBy: ['IT Admin (Sarah Mitchell)', Validators.required],
    condition: ['New' as Condition, Validators.required],
    accessories: [''],
    location: ['Office (HQ - Chennai)', Validators.required],
    returnDate: [''],
    status: ['Requested' as AssetStatus, Validators.required],
    remarks: [''],
  });

  openAdd(): void {
    this.editingId = null;
    this.form.reset({ type: this.type() ?? 'Laptop', assignedDate: isoToDmy(todayIso()) });
    this.formOpen.set(true);
  }

  openEdit(row: AssetRow): void {
    this.editingId = row.id;
    this.form.reset({
      empId: row.empId,
      type: row.type,
      model: row.model,
      assetTag: row.assetTag,
      serial: row.serial,
      assignedDate: isoToDmy(row.assignedDate),
      assignedBy: row.assignedBy,
      condition: row.condition,
      accessories: row.accessories,
      location: row.location,
      returnDate: isoToDmy(row.returnDate),
      status: row.status,
      remarks: row.remarks,
    });
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
  }

  save(): void {
    const tag = this.form.controls.assetTag;
    const clash = this.assets().some(
      (a) => a.id !== this.editingId && a.assetTag.toLowerCase() === tag.value.trim().toLowerCase(),
    );
    if (clash) tag.setErrors({ duplicate: true });

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const asset = {
      ...v,
      model: v.model.trim(),
      assetTag: v.assetTag.trim(),
      serial: v.serial.trim(),
      accessories: v.accessories.trim(),
      remarks: v.remarks.trim(),
      assignedDate: dmyToIso(v.assignedDate),
      returnDate: dmyToIso(v.returnDate),
    };

    if (this.editingId !== null) {
      this.patch(this.editingId, asset);
    } else {
      this.assets.update((list) => [...list, { id: Math.max(0, ...list.map((a) => a.id)) + 1, ...asset }]);
    }
    this.closeForm();
  }

  error(name: string): string | null {
    const c = this.form.get(name);
    if (!c || !c.touched || c.valid) return null;
    if (c.hasError('duplicate')) return 'This asset tag is already in use.';
    return 'This field is required.';
  }

  // ---------------------------------------------------------------- helpers
  private patch(id: number, changes: Partial<Asset>): void {
    this.assets.update((list) => list.map((a) => (a.id === id ? { ...a, ...changes } : a)));
  }

  typeIcon(t: AssetType): string {
    return ASSET_TYPES.find((x) => x.value === t)?.icon ?? 'bi bi-box-seam';
  }

  statusMeta(s: AssetStatus) {
    return STATUS_META[s];
  }

  initials(name: string): string {
    return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  fmtDate(iso: string): string {
    return iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
  }
}

// ------------------------------------------------------------------ pure helpers

function employee(empId: string): Employee | undefined {
  return EMPLOYEES.find((e) => e.empId === empId);
}

function matchesStatus(s: AssetStatus, f: StatusFilter): boolean {
  switch (f) {
    case null: return true;
    case 'pending': return s === 'Requested' || s === 'Approved';
    case 'closed': return s === 'Returned' || s === 'Damaged';
    default: return s === f;
  }
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
