import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  PrimeDataTable,
  PrimeTableColumn
} from '../../../shared/primedatatable/primedatatable';

import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';

declare var bootstrap: any;

@Component({
  selector: 'app-department',
  standalone: true,

  imports: [ReactiveFormsModule, PrimeDataTable, SelectModule, CommonModule],

  templateUrl: './department.html',
  styleUrl: './department.scss',
})
export class Department implements AfterViewInit {
  private fb = inject(FormBuilder);

  // =========================================================
  // MASTER TYPE
  // =========================================================

  @Input() masterType:
    | 'department'
    | 'team'
    | 'document'
    | 'position'
    | 'district'
    | 'state'
    | 'leave'
    | 'work'
    | 'shift' = 'department';

  searchPlaceholder = '';

  // =========================================================
  // MODAL
  // =========================================================

  @ViewChild('departmentModal')
  departmentModal!: ElementRef;

  departmentModalInstance: any;

  modalType: 'add' | 'edit' = 'add';

  // =========================================================
  // ACTIONS
  // =========================================================

  actions = { add: true, edit: true, delete: true };

  // =========================================================
  // HEADER
  // =========================================================

  header = { title: '', icon: '' };

  // =========================================================
  // FORM
  // =========================================================

  departmentForm!: FormGroup;

  // =========================================================
  // STATUS
  // =========================================================

  statusOptions = [
    {
      label: 'Enable',
      value: 'Enable',
    },
    {
      label: 'Disable',
      value: 'Disable',
    },
  ];

  // =========================================================
  // DEPARTMENT DATA
  // =========================================================

  departmentData = [
    {
      id: 1,
      department: 'Design',
      status: 'Enable',
      date: '18-12-2025',
    },
    {
      id: 2,
      department: 'IOS Dev',
      status: 'Enable',
      date: '20-12-2025',
    },
    {
      id: 3,
      department: 'Business',
      status: 'Enable',
      date: '22-12-2025',
    },
    {
      id: 4,
      department: 'Marketing',
      status: 'Disable',
      date: '05-01-2026',
    },
  ];

  // =========================================================
  // TEAM DATA
  // =========================================================

  teamData = [
    {
      id: 1,
      teamName: 'Frontend',
      department: 'Design',
      lead: 'Alice Johnson',
      members: 5,
      status: 'Enable',
      date: '10-01-2026',
    },
    {
      id: 2,
      teamName: 'Backend',
      department: 'IOS Dev',
      lead: 'Bob Smith',
      members: 4,
      status: 'Enable',
      date: '12-01-2026',
    },
    {
      id: 3,
      teamName: 'QA Testing',
      department: 'Business',
      lead: 'Carol White',
      members: 3,
      status: 'Enable',
      date: '15-01-2026',
    },
    {
      id: 4,
      teamName: 'Data Analytics',
      department: 'Marketing',
      lead: 'David Brown',
      members: 6,
      status: 'Disable',
      date: '20-01-2026',
    },
  ];

  // =========================================================
  // POSITION DATA
  // =========================================================

  positionData = [
    {
      id: 1,
      position: 'Software Developer',
      status: 'Enable',
      date: '10-01-2026',
    },
    {
      id: 2,
      position: 'Team Lead',
      status: 'Enable',
      date: '12-01-2026',
    },
    {
      id: 3,
      position: 'HR Manager',
      status: 'Disable',
      date: '15-01-2026',
    },
  ];

  // =========================================================
  // DOCUMENT DATA
  // =========================================================

  documentData = [
    {
      id: 1,
      document: 'Aadhar Card',
      status: 'Enable',
      date: '10-01-2026',
    },
    {
      id: 2,
      document: 'PAN Card',
      status: 'Enable',
      date: '12-01-2026',
    },
    {
      id: 3,
      document: 'Driving License',
      status: 'Disable',
      date: '15-01-2026',
    },
  ];

  columns: PrimeTableColumn[] = [];

  tableData: any[] = [];

  constructor() {
    this.createForm();
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || typeof bootstrap === 'undefined' || !bootstrap.Modal) {
      return;
    }

    this.departmentModalInstance = bootstrap.Modal.getOrCreateInstance(
      this.departmentModal.nativeElement,
      {
        backdrop: 'static',
        keyboard: false,
      },
    );
  }

  // =========================================================
  // ON INIT / INPUT CHANGE
  // =========================================================

  ngOnChanges(): void {
    this.loadMaster();
  }

  // =========================================================
  // LOAD MASTER
  // =========================================================

  loadMaster(): void {
    switch (this.masterType) {
      case 'department':
        this.header = {
          title: 'Department',
          icon: 'ti ti-sitemap',
        };

        this.searchPlaceholder = ' department...';

        this.columns = this.departmentColumns();

        this.tableData = this.departmentData;

        break;

      case 'team':
        this.header = {
          title: 'Team',
          icon: 'ti ti-users',
        };

        this.searchPlaceholder = ' team...';

        this.columns = this.teamColumns();

        this.tableData = this.teamData;

        break;

      case 'document':
        this.header = {
          title: 'Document',
          icon: 'ti ti-file',
        };

        this.searchPlaceholder = ' document...';

        this.columns = this.documentColumns();

        this.tableData = this.documentData;

        break;

      case 'position':
        this.header = {
          title: 'Position',
          icon: 'ti ti-briefcase',
        };

        this.searchPlaceholder = 'position...';

        this.columns = this.positionColumns();

        this.tableData = this.positionData;

        break;

      case 'district':
        this.header = {
          title: 'Country',
          icon: 'ti ti-world',
        };

        this.searchPlaceholder = 'Search country...';

        this.columns = this.commonColumns('Country');

        this.tableData = [];

        break;

      case 'state':
        this.header = {
          title: 'State',
          icon: 'ti ti-map',
        };

        this.searchPlaceholder = 'Search state...';

        this.columns = this.commonColumns('State');

        this.tableData = [];

        break;

      case 'team':
        this.header = {
          title: 'City',
          icon: 'ti ti-building',
        };

        this.searchPlaceholder = 'Search city...';

        this.columns = this.commonColumns('City');

        this.tableData = [];

        break;
    }
  }

  // =========================================================
  // DEPARTMENT COLUMNS
  // =========================================================

  departmentColumns(): PrimeTableColumn[] {
    return [
      {
        field: 'sno',
        header: 'S.NO',
        type: 'text',
        width: '80px',
        sortable: false,
      },

      {
        field: 'department',
        header: 'DEPARTMENT NAME',
        type: 'text',
        width: '150px',
        sortable: true,
      },

      {
        field: 'status',
        header: 'STATUS',
        type: 'status',
        width: '140px',
        sortable: true,
      },

      {
        field: 'date',
        header: 'CREATE DATE',
        type: 'text',
        width: '160px',
        sortable: true,
      },

      {
        field: 'actions',
        header: 'ACTION',
        type: 'actions',
        width: '120px',
        sortable: false,
      },
    ];
  }

  // =========================================================
  // TEAM COLUMNS
  // =========================================================

  teamColumns(): PrimeTableColumn[] {
    return [
      {
        field: 'sno',
        header: 'S.NO',
        type: 'text',
        width: '80px',
        sortable: false,
      },

      {
        field: 'teamName',
        header: 'TEAM NAME',
        type: 'text',
        width: '150px',
        sortable: true,
      },

      {
        field: 'department',
        header: 'DEPARTMENT',
        type: 'text',
        width: '150px',
        sortable: true,
      },

      {
        field: 'lead',
        header: 'TEAM LEAD',
        type: 'text',
        width: '150px',
        sortable: true,
      },

      {
        field: 'members',
        header: 'MEMBERS',
        type: 'text',
        width: '100px',
        sortable: true,
      },

      {
        field: 'status',
        header: 'STATUS',
        type: 'status',
        width: '140px',
        sortable: true,
      },

      {
        field: 'date',
        header: 'CREATE DATE',
        type: 'text',
        width: '160px',
        sortable: true,
      },

      {
        field: 'actions',
        header: 'ACTION',
        type: 'actions',
        width: '120px',
        sortable: false,
      },
    ];
  }

  // =========================================================
  // DOCUMENT COLUMNS
  // =========================================================

  documentColumns(): PrimeTableColumn[] {
    return [
      {
        field: 'sno',
        header: 'S.NO',
        type: 'text',
        width: '80px',
        sortable: false,
      },

      {
        field: 'document',
        header: 'DOCUMENT NAME',
        type: 'text',
        width: '200px',
        sortable: true,
      },

      {
        field: 'status',
        header: 'STATUS',
        type: 'status',
        width: '140px',
        sortable: true,
      },

      {
        field: 'date',
        header: 'CREATE DATE',
        type: 'text',
        width: '160px',
        sortable: true,
      },

      {
        field: 'actions',
        header: 'ACTION',
        type: 'actions',
        width: '120px',
        sortable: false,
      },
    ];
  }

  // =========================================================
  // POSITION COLUMNS
  // =========================================================

  positionColumns(): PrimeTableColumn[] {
    return [
      {
        field: 'sno',
        header: 'S.NO',
        type: 'text',
        width: '80px',
        sortable: false,
      },

      {
        field: 'position',
        header: 'POSITION NAME',
        type: 'text',
        width: '200px',
        sortable: true,
      },

      {
        field: 'status',
        header: 'STATUS',
        type: 'status',
        width: '140px',
        sortable: true,
      },

      {
        field: 'date',
        header: 'CREATE DATE',
        type: 'text',
        width: '160px',
        sortable: true,
      },

      {
        field: 'actions',
        header: 'ACTION',
        type: 'actions',
        width: '120px',
        sortable: false,
      },
    ];
  }

  // =========================================================
  // COMMON COLUMNS
  // =========================================================

  commonColumns(name: string): PrimeTableColumn[] {
    return [
      {
        field: 'sno',
        header: 'S.NO',
        type: 'text',
        width: '80px',
        sortable: false,
      },

      {
        field: name.toLowerCase(),
        header: `${name.toUpperCase()} NAME`,
        type: 'text',
        width: '200px',
        sortable: true,
      },

      {
        field: 'status',
        header: 'STATUS',
        type: 'status',
        width: '140px',
        sortable: true,
      },

      {
        field: 'date',
        header: 'CREATE DATE',
        type: 'text',
        width: '160px',
        sortable: true,
      },

      {
        field: 'actions',
        header: 'ACTION',
        type: 'actions',
        width: '120px',
        sortable: false,
      },
    ];
  }

  // =========================================================
  // FORM
  // =========================================================

  createForm(): void {
    this.departmentForm = this.fb.group({
      id: [0],

      departmentName: ['', Validators.required],

      status: ['Enable', Validators.required],
    });
  }

  // =========================================================
  // CREATE
  // =========================================================

  openCreateModal(): void {
    this.modalType = 'add';

    this.departmentForm.reset({
      id: 0,

      departmentName: '',

      status: 'Enable',
    });

    this.openModal();
  }

  // =========================================================
  // EDIT
  // =========================================================

  openEditModal(row: any): void {
    this.modalType = 'edit';

    if (this.masterType === 'department') {
      this.departmentForm.patchValue({
        id: row.id,

        departmentName: row.department,

        status: row.status,
      });
    } else if (this.masterType === 'position') {
      this.departmentForm.patchValue({
        id: row.id,

        departmentName: row.position,

        status: row.status,
      });
    } else if (this.masterType === 'document') {
      this.departmentForm.patchValue({
        id: row.id,

        departmentName: row.document,

        status: row.status,
      });
    }

    this.openModal();
  }

  // =========================================================
  // OPEN MODAL
  // =========================================================

  openModal(): void {
    if (this.departmentModalInstance) {
      this.departmentModalInstance.show();
    }
  }

  // =========================================================
  // CLOSE
  // =========================================================

  onClose(): void {
    if (this.departmentModalInstance) {
      this.departmentModalInstance.hide();
    }
  }

  // =========================================================
  // TABLE ACTION
  // =========================================================

  onTableAction(event: { action: string; row: any }): void {
    if (event.action === 'edit') {
      this.openEditModal(event.row);
    }

    if (event.action === 'delete') {
      this.deleteMaster(event.row);
    }
  }

  // =========================================================
  // SAVE
  // =========================================================

  saveBtn(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();

      return;
    }

    const formData = this.departmentForm.value;

    console.log(
      this.modalType === 'add' ? `Create ${this.masterType}` : `Update ${this.masterType}`,
      formData,
    );

    this.onClose();
  }

  // =========================================================
  // DELETE
  // =========================================================

  deleteMaster(row: any): void {
    console.log(`Delete ${this.masterType}:`, row);
  }
}