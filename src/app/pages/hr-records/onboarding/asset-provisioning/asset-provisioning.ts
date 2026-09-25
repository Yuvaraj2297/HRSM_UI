import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { PrimeDataTable } from '../../../../shared/primedatatable/primedatatable';
import { SelectModule } from 'primeng/select';
import { CalendarDatepickerDirective } from '../../../../common/directives/datepicker';

declare var bootstrap: any;

type AssetStatus = 'Requested' | 'Approved' | 'Assigned' | 'Returned' | 'Damaged';

type AssetType =
  | 'Laptop'
  | 'Desktop'
  | 'Monitor'
  | 'Mobile'
  | 'Headset'
  | 'ID Card'
  | 'Access Card';

interface AssetRow {
  sno: number;
  empName: string;
  empId: string;
  dept: string;
  role: string;
  avatar?: string;

  type: AssetType;
  model: string;
  assetId: string;
  serial: string;

  assignedDate: string;
  assignedBy: string;

  condition: 'New' | 'Good' | 'Used' | 'Damaged';

  accessories: string;
  location: string;
  returnDate: string;

  status: AssetStatus;
  remarks: string;
}

interface EmployeeOption {
  name: string;
  empId: string;
  dept: string;
  role: string;
}

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-asset-provisioning',
  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, SelectModule, PrimeDataTable, CalendarDatepickerDirective],

  templateUrl: './asset-provisioning.html',
  styleUrl: './asset-provisioning.scss',
})
export class AssetProvisioning implements OnInit, AfterViewInit {
  // =========================================================
  // FORM BUILDER
  // =========================================================

  private fb = new FormBuilder();

  // =========================================================
  // MODAL REFERENCES
  // =========================================================

  @ViewChild('provisionAssetModal')
  provisionAssetModalRef!: ElementRef;

  @ViewChild('viewAssetModal')
  viewAssetModalRef!: ElementRef;

  @ViewChild('editAssetModal')
  editAssetModalRef!: ElementRef;

  private provisionModal: any;
  private viewModal: any;
  private editModal: any;

  // =========================================================
  // PAGE CONFIG
  // =========================================================

  header = 'Asset Provisioning & Lifecycle Management';

  searchPlaceholder = 'Search employee, asset ID, serial #...';

  // =========================================================
  // EMPLOYEES
  // =========================================================

  employees: EmployeeOption[] = [
    {
      name: 'Kavitha Raman',
      empId: 'EMP-2026-041',
      dept: 'Design',
      role: 'UI/UX Designer',
    },

    {
      name: 'Rahul Verma',
      empId: 'EMP-2026-042',
      dept: 'Engineering',
      role: 'Backend Engineer',
    },

    {
      name: 'Siddharth Nair',
      empId: 'EMP-2026-043',
      dept: 'iOS Dev',
      role: 'iOS App Developer',
    },

    {
      name: 'Priya Sundaram',
      empId: 'EMP-2026-044',
      dept: 'Finance',
      role: 'Financial Analyst',
    },

    {
      name: 'Ananya Sundaram',
      empId: 'EMP-2026-045',
      dept: 'Design',
      role: 'UI/UX Designer',
    },
  ];

  // =========================================================
  // ASSET TYPES
  // =========================================================

  assetTypes: SelectOption[] = [
    {
      value: 'Laptop',
      label: 'Laptop Workstation',
    },

    {
      value: 'Desktop',
      label: 'Desktop PC',
    },

    {
      value: 'Monitor',
      label: 'Monitor & Display',
    },

    {
      value: 'Mobile',
      label: 'Mobile / Test Device',
    },

    {
      value: 'Headset',
      label: 'Headset & Audio',
    },

    {
      value: 'ID Card',
      label: 'Employee ID Card',
    },

    {
      value: 'Access Card',
      label: 'Access Card / Key',
    },
  ];

  // =========================================================
  // DROPDOWN OPTIONS
  // =========================================================

  conditionOptions: SelectOption[] = [
    {
      label: 'New',
      value: 'New',
    },

    {
      label: 'Good',
      value: 'Good',
    },

    {
      label: 'Used',
      value: 'Used',
    },

    {
      label: 'Damaged',
      value: 'Damaged',
    },
  ];

  locationOptions: SelectOption[] = [
    {
      label: 'Office (HQ - Chennai)',
      value: 'Office (HQ - Chennai)',
    },

    {
      label: 'Branch Office',
      value: 'Branch Office',
    },

    {
      label: 'Remote (WFH)',
      value: 'Remote (WFH)',
    },
  ];

  assignedByOptions: SelectOption[] = [
    {
      label: 'IT Admin (Sarah Mitchell)',
      value: 'IT Admin (Sarah Mitchell)',
    },

    {
      label: 'HR Operations',
      value: 'HR Operations',
    },

    {
      label: 'Admin Support',
      value: 'Admin Support',
    },
  ];

  statusOptions: SelectOption[] = [
    {
      label: 'Requested',
      value: 'Requested',
    },

    {
      label: 'Approved',
      value: 'Approved',
    },

    {
      label: 'Assigned',
      value: 'Assigned',
    },

    {
      label: 'Returned',
      value: 'Returned',
    },

    {
      label: 'Damaged',
      value: 'Damaged',
    },
  ];

  // =========================================================
  // TABLE CONFIGURATION
  // =========================================================

  columns = [
    {
      field: 'sno',
      header: 'S.No',
      sortable: false,
      width: '60px',
    },

    {
      field: 'empName',
      header: 'Employee',
      sortable: true,
      type: 'avatarText',
      avatarField: 'avatar',
      subField: 'empSub',
    },

    {
      field: 'type',
      header: 'Asset Type & Model',
      sortable: true,
      type: 'iconTitleSub',
      iconField: 'typeIcon',
      subField: 'model',
    },

    {
      field: 'assetId',
      header: 'Asset Tag & Serial #',
      sortable: false,
      type: 'tagSerial',
      tagField: 'assetId',
      serialField: 'serial',
    },

    {
      field: 'assignedDate',
      header: 'Assigned Date & By',
      sortable: true,
      type: 'dateBy',
      dateField: 'assignedDateDisplay',
      byField: 'assignedBy',
    },

    {
      field: 'condition',
      header: 'Condition & Location',
      sortable: false,
      type: 'twoBadges',
      firstField: 'condition',
      secondField: 'location',
    },

    {
      field: 'accessories',
      header: 'Accessories',
      sortable: false,
      type: 'pillText',
    },

    {
      field: 'returnDate',
      header: 'Expected Return',
      sortable: false,
      type: 'text',
      displayField: 'returnDateDisplay',
    },

    {
      field: 'status',
      header: 'Status',
      sortable: true,
      type: 'statusBadge',
      statusClassField: 'statusClass',
      statusIconField: 'statusIcon',
    },

    // ---------------------------------------------------------
    // ACTION COLUMN — pill-actions style.
    // Buttons live on the column itself (col.buttons), and the
    // table renders them as segmented "pill-action-seg" buttons
    // via visibleButtons()/onPillButton(). This fires
    // (actionClick) the same way the icon-button 'actions' type
    // did, so onTableAction()/onAction() below needs no changes.
    // ---------------------------------------------------------
    {
      field: 'actions',
      header: 'Action',
      type: 'pill-actions',
      width: '120px',
      buttons: [
        {
          key: 'view',
          label: 'View',
          icon: 'ti ti-eye',
          variant: 'outline' as const,
          tooltip: 'View asset details',
        },
        {
          key: 'edit',
          label: 'Edit',
          icon: 'ti ti-pencil',
          tooltip: 'Edit asset',
        },
      ],
    },
  ];

  // =========================================================
  // DATA
  // =========================================================

  assets: AssetRow[] = [];

  tableData: any[] = [];

  // =========================================================
  // FILTER
  // =========================================================

  activeFilter: 'all' | 'requested' | 'approved' | 'assigned' | 'returned' = 'all';

  stageTabs: {
    key: 'all' | 'requested' | 'approved' | 'assigned' | 'returned';

    label: string;
  }[] = [
    {
      key: 'all',
      label: 'All Assets',
    },

    {
      key: 'requested',
      label: 'Requested',
    },

    {
      key: 'approved',
      label: 'Approved',
    },

    {
      key: 'assigned',
      label: 'Assigned (In Use)',
    },

    {
      key: 'returned',
      label: 'Returned',
    },
  ];

  // =========================================================
  // KPI
  // =========================================================

  kpis = {
    totalProvisioned: 0,

    pendingApproval: 0,

    activeInUse: 0,

    returnedOrDamaged: 0,
  };

  // =========================================================
  // REACTIVE FORMS
  // =========================================================

  addForm!: FormGroup;

  editForm!: FormGroup;

  // =========================================================
  // VIEW MODAL
  // =========================================================

  viewData: any = null;

  viewWorkflowSteps: {
    key: string;
    icon: string;
    label: string;
    state: '' | 'completed' | 'active';
  }[] = [];

  // =========================================================
  // EDITING ROW
  // =========================================================

  editingRow: AssetRow | null = null;

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.createForms();

    this.assets = [
      {
        sno: 1,
        empName: 'Kavitha Raman',
        empId: 'EMP-2026-041',
        dept: 'Design',
        role: 'UI/UX Designer',
        avatar: './assets/img/profile-1.jpg',
        type: 'Laptop',
        model: 'MacBook Pro 16" (M3 Max, 36GB RAM, 1TB SSD)',
        assetId: 'AST-MAC-2026-081',
        serial: 'C02G4109Q05P',
        assignedDate: '2026-03-15',
        assignedBy: 'IT Admin (Sarah Mitchell)',
        condition: 'New',
        accessories: 'Magic Mouse, 140W USB-C Charger, Laptop Bag',
        location: 'Office (HQ - Chennai)',
        returnDate: '',
        status: 'Assigned',
        remarks: 'High-performance workstation for design team.',
      },

      {
        sno: 2,
        empName: 'Rahul Verma',
        empId: 'EMP-2026-042',
        dept: 'Engineering',
        role: 'Backend Engineer',
        avatar: './assets/img/profile-2.jpg',
        type: 'Monitor',
        model: 'Dell UltraSharp 27" 4K USB-C Monitor',
        assetId: 'AST-MON-2026-014',
        serial: 'CN-0V283H-74261',
        assignedDate: '2026-04-01',
        assignedBy: 'IT Hardware Lead',
        condition: 'Good',
        accessories: 'HDMI Cable, DisplayPort, Power Cable',
        location: 'Office (HQ - Chennai)',
        returnDate: '',
        status: 'Approved',
        remarks: 'Allocation approved by Tech Lead, awaiting employee pickup.',
      },

      {
        sno: 3,
        empName: 'Siddharth Nair',
        empId: 'EMP-2026-043',
        dept: 'iOS Dev',
        role: 'iOS App Developer',
        avatar: './assets/img/profile-3.jpg',
        type: 'Mobile',
        model: 'iPhone 15 Pro 256GB (Test Device)',
        assetId: 'AST-MOB-2026-009',
        serial: 'F2LXW099PN23',
        assignedDate: '2026-03-20',
        assignedBy: 'IT Support',
        condition: 'Used',
        accessories: 'USB-C Cable, Protective Case',
        location: 'Remote (WFH)',
        returnDate: '2026-09-20',
        status: 'Requested',
        remarks: 'Requested for iOS build & testing.',
      },

      {
        sno: 4,
        empName: 'Priya Sundaram',
        empId: 'EMP-2026-044',
        dept: 'Finance',
        role: 'Financial Analyst',
        type: 'Access Card',
        model: 'Biometric Smart RFID Access Card',
        assetId: 'ACC-BLR-8819',
        serial: 'RFID-994821',
        assignedDate: '2026-01-10',
        assignedBy: 'HR Operations',
        condition: 'Good',
        accessories: 'Company Lanyard, Card Holder',
        location: 'Branch Office',
        returnDate: '2026-03-31',
        status: 'Returned',
        remarks: 'Returned upon employee exit clearance.',
      },

      {
        sno: 5,
        empName: 'Ananya Sundaram',
        empId: 'EMP-2026-045',
        dept: 'Design',
        role: 'UI/UX Designer',
        type: 'Headset',
        model: 'Jabra Evolve2 65 Wireless Headset',
        assetId: 'AST-HDS-2026-033',
        serial: 'JAB-772910',
        assignedDate: '2026-02-05',
        assignedBy: 'IT Support',
        condition: 'Damaged',
        accessories: 'Charging Stand, USB Dongle',
        location: 'Office (HQ - Chennai)',
        returnDate: '',
        status: 'Damaged',
        remarks: 'Mic boom arm faulty; sent to vendor repair.',
      },
    ];

    this.recalcKpis();

    this.applyFilter();
  }

  // =========================================================
  // CREATE FORMS
  // =========================================================

  private createForms(): void {
    // -------------------------------------------------------
    // ADD / REQUEST FORM
    // -------------------------------------------------------

    this.addForm = this.fb.group({
      empKey: ['', Validators.required],

      type: ['Laptop', Validators.required],

      model: ['', [Validators.required, Validators.minLength(2)]],

      assetId: ['', Validators.required],

      serial: ['', Validators.required],

      assignedDate: [this.todayIso(), Validators.required],

      assignedBy: ['IT Admin (Sarah Mitchell)', Validators.required],

      condition: ['New', Validators.required],

      accessories: [''],

      location: ['Office (HQ - Chennai)', Validators.required],

      returnDate: [''],

      status: ['Assigned', Validators.required],

      remarks: [''],
    });

    // -------------------------------------------------------
    // EDIT FORM
    // -------------------------------------------------------

    this.editForm = this.fb.group({
      empName: ['', Validators.required],

      empInfo: [''],

      type: ['Laptop', Validators.required],

      model: ['', Validators.required],

      assetId: ['', Validators.required],

      serial: ['', Validators.required],

      assignedDate: ['', Validators.required],

      assignedBy: ['', Validators.required],

      condition: ['New', Validators.required],

      accessories: [''],

      location: ['Office (HQ - Chennai)', Validators.required],

      returnDate: [''],

      status: ['Assigned', Validators.required],

      remarks: [''],
    });
  }

  // =========================================================
  // AFTER VIEW INIT
  // =========================================================

  ngAfterViewInit(): void {
    if (typeof bootstrap !== 'undefined') {
      this.provisionModal = bootstrap.Modal.getOrCreateInstance(
        this.provisionAssetModalRef.nativeElement,
        { backdrop: true, keyboard: true },
      );

      this.viewModal = bootstrap.Modal.getOrCreateInstance(
        this.viewAssetModalRef.nativeElement,
        { backdrop: true, keyboard: true },
      );

      this.editModal = bootstrap.Modal.getOrCreateInstance(
        this.editAssetModalRef.nativeElement,
        { backdrop: true, keyboard: true },
      );
    }
  }

  // =========================================================
  // HELPERS
  // =========================================================

  private todayIso(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private formatDateForDisplay(str: string): string {
    if (!str) {
      return 'N/A';
    }

    const d = new Date(str);

    if (isNaN(d.getTime())) {
      return str;
    }

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const day = String(d.getDate()).padStart(2, '0');

    return `${day}-${months[d.getMonth()]}-${d.getFullYear()}`;
  }

  private assetIcon(type: AssetType): string {
    switch (type) {
      case 'Laptop':
        return 'bi-laptop text-white';

      case 'Desktop':
        return 'bi-pc-display text-white';

      case 'Monitor':
        return 'bi-display text-white';

      case 'Mobile':
        return 'bi-phone text-white';

      case 'Headset':
        return 'bi-headphones text-white';

      case 'ID Card':
        return 'bi-person-badge text-white';

      case 'Access Card':
        return 'bi-key-fill text-white';

      default:
        return 'bi-box-seam text-white';
    }
  }

  private statusMeta(status: AssetStatus): {
    cls: string;
    icon: string;
  } {
    switch (status) {
      case 'Requested':
        return {
          cls: 'asset-status-requested',
          icon: 'bi-hourglass-split',
        };

      case 'Approved':
        return {
          cls: 'asset-status-approved',
          icon: 'bi-hand-thumbs-up-fill',
        };

      case 'Assigned':
        return {
          cls: 'asset-status-assigned',
          icon: 'bi-check-circle-fill',
        };

      case 'Returned':
        return {
          cls: 'asset-status-returned',
          icon: 'bi-box-arrow-in-left',
        };

      case 'Damaged':
        return {
          cls: 'asset-status-damaged',
          icon: 'bi-exclamation-triangle-fill',
        };

      default:
        return {
          cls: '',
          icon: '',
        };
    }
  }

  // =========================================================
  // FORM VALIDATION HELPER
  // =========================================================

  private markFormTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach((controlName) => {
      form.controls[controlName].markAsTouched();
    });
  }

  // =========================================================
  // KPI
  // =========================================================

  private recalcKpis(): void {
    this.kpis.totalProvisioned = this.assets.length;

    this.kpis.pendingApproval = this.assets.filter((a) => a.status === 'Requested').length;

    this.kpis.activeInUse = this.assets.filter((a) => a.status === 'Assigned').length;

    this.kpis.returnedOrDamaged = this.assets.filter(
      (a) => a.status === 'Returned' || a.status === 'Damaged',
    ).length;
  }

  // =========================================================
  // TAB COUNTS
  // =========================================================

  get tabCounts(): Record<string, number> {
    return {
      all: this.assets.length,

      requested: this.assets.filter((a) => a.status === 'Requested').length,

      approved: this.assets.filter((a) => a.status === 'Approved').length,

      assigned: this.assets.filter((a) => a.status === 'Assigned').length,

      returned: this.assets.filter((a) => a.status === 'Returned' || a.status === 'Damaged').length,
    };
  }

  // =========================================================
  // FILTER
  // =========================================================

  selectFilter(key: 'all' | 'requested' | 'approved' | 'assigned' | 'returned'): void {
    this.activeFilter = key;

    this.applyFilter();
  }

  private applyFilter(): void {
    let filtered = this.assets;

    if (this.activeFilter === 'requested') {
      filtered = this.assets.filter((a) => a.status === 'Requested');
    } else if (this.activeFilter === 'approved') {
      filtered = this.assets.filter((a) => a.status === 'Approved');
    } else if (this.activeFilter === 'assigned') {
      filtered = this.assets.filter((a) => a.status === 'Assigned');
    } else if (this.activeFilter === 'returned') {
      filtered = this.assets.filter((a) => a.status === 'Returned' || a.status === 'Damaged');
    }

    this.tableData = filtered.map((a, idx) => {
      const meta = this.statusMeta(a.status);

      return {
        ...a,

        sno: idx + 1,

        empSub: `${a.empId} • ${a.role}`,

        typeIcon: this.assetIcon(a.type),

        assignedDateDisplay: this.formatDateForDisplay(a.assignedDate),

        returnDateDisplay: a.returnDate
          ? this.formatDateForDisplay(a.returnDate)
          : 'N/A (Permanent)',

        statusClass: meta.cls,

        statusIcon: meta.icon,
      };
    });
  }

  // =========================================================
  // ADD / REQUEST ASSET
  // =========================================================

  openProvisionModal(): void {
    this.addForm.reset({
      empKey: '',

      type: 'Laptop',

      model: '',

      assetId: '',

      serial: '',

      assignedDate: this.todayIso(),

      assignedBy: 'IT Admin (Sarah Mitchell)',

      condition: 'New',

      accessories: '',

      location: 'Office (HQ - Chennai)',

      returnDate: '',

      status: 'Assigned',

      remarks: '',
    });

    this.addForm.markAsPristine();

    this.addForm.markAsUntouched();

    this.provisionModal?.show();
  }

  // =========================================================
  // SAVE NEW ASSET
  // =========================================================

  saveNewAsset(): void {
    if (this.addForm.invalid) {
      this.markFormTouched(this.addForm);

      return;
    }

    const formValue = this.addForm.getRawValue();

    const emp = this.employees.find((e) => e.name === formValue.empKey);

    if (!emp) {
      this.addForm.get('empKey')?.setErrors({
        invalidEmployee: true,
      });

      return;
    }

    const newRow: AssetRow = {
      sno: this.assets.length + 1,

      empName: emp.name,

      empId: emp.empId,

      dept: emp.dept,

      role: emp.role,

      type: formValue.type as AssetType,

      model: formValue.model.trim(),

      assetId: formValue.assetId.trim(),

      serial: formValue.serial.trim(),

      assignedDate: formValue.assignedDate,

      assignedBy: formValue.assignedBy,

      condition: formValue.condition,

      accessories: formValue.accessories?.trim() || '',

      location: formValue.location,

      returnDate: formValue.returnDate || '',

      status: formValue.status,

      remarks: formValue.remarks?.trim() || '',
    };

    this.assets.push(newRow);

    this.recalcKpis();

    this.applyFilter();

    this.provisionModal?.hide();
  }

  // =========================================================
  // VIEW ASSET
  // =========================================================

  openViewAsset(row: AssetRow): void {
    const meta = this.statusMeta(row.status);

    this.viewData = {
      ...row,

      typeIcon: this.assetIcon(row.type),

      assignedDateDisplay: this.formatDateForDisplay(row.assignedDate),

      returnDateDisplay: row.returnDate ? this.formatDateForDisplay(row.returnDate) : 'N/A',

      statusClass: meta.cls,

      accessoriesList: (row.accessories || 'Standard accessories')
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
    };

    const stageOrder = ['Requested', 'Approved', 'Assigned', 'Returned', 'Inspected'];

    const icons = ['bi-check', 'bi-check', 'bi-laptop', 'bi-box-arrow-in-left', 'bi-search'];

    let activeIndex = 0;

    if (row.status === 'Requested') {
      activeIndex = 0;
    } else if (row.status === 'Approved') {
      activeIndex = 1;
    } else if (row.status === 'Assigned') {
      activeIndex = 2;
    } else if (row.status === 'Returned') {
      activeIndex = 3;
    } else {
      activeIndex = 4;
    }

    this.viewWorkflowSteps = stageOrder.map((label, i) => ({
      key: label.toLowerCase(),

      icon: icons[i],

      label,

      state: i < activeIndex ? 'completed' : i === activeIndex ? 'active' : '',
    }));

    requestAnimationFrame(() => {
      this.viewModal?.show();
    });
  }

  // =========================================================
  // EDIT ASSET
  // =========================================================

  openEditAsset(row: AssetRow): void {
    this.editingRow = row;

    this.editForm.reset({
      empName: row.empName,

      empInfo: `${row.empId} • ${row.dept}`,

      type: row.type,

      model: row.model,

      assetId: row.assetId,

      serial: row.serial,

      assignedDate: row.assignedDate,

      assignedBy: row.assignedBy,

      condition: row.condition,

      accessories: row.accessories,

      location: row.location,

      returnDate: row.returnDate,

      status: row.status,

      remarks: row.remarks,
    });

    this.editForm.markAsPristine();

    this.editForm.markAsUntouched();

    this.editModal?.show();
  }

  // =========================================================
  // UPDATE ASSET
  // =========================================================

  updateAsset(): void {
    if (!this.editingRow) {
      return;
    }

    if (this.editForm.invalid) {
      this.markFormTouched(this.editForm);

      return;
    }

    const formValue = this.editForm.getRawValue();

    Object.assign(this.editingRow, {
      empName: formValue.empName.trim(),

      type: formValue.type,

      model: formValue.model.trim(),

      assetId: formValue.assetId.trim(),

      serial: formValue.serial.trim(),

      assignedDate: formValue.assignedDate,

      assignedBy: formValue.assignedBy.trim(),

      condition: formValue.condition,

      accessories: formValue.accessories?.trim() || '',

      location: formValue.location,

      returnDate: formValue.returnDate || '',

      status: formValue.status,

      remarks: formValue.remarks?.trim() || '',
    });

    this.recalcKpis();

    this.applyFilter();

    this.editModal?.hide();

    this.editingRow = null;
  }

  // =========================================================
  // TABLE ACTION
  // (fired by pill-actions' onPillButton -> (actionClick), same
  //  payload shape as the old icon-button 'actions' type)
  // =========================================================

  onTableAction(event: { action: string; row: AssetRow }): void {
    const original = this.assets.find((a) => a.assetId === event.row.assetId) || event.row;

    switch (event.action) {
      case 'view':
        this.openViewAsset(original);

        break;

      case 'edit':
        this.openEditAsset(original);

        break;
    }
  }
}