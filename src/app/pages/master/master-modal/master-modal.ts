import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from 'primeng/select';

import { MasterFormFacade, MasterType } from '../facade/master-form.facade';

declare var bootstrap: any;

/* =========================================================
   MODAL FIELD INTERFACE
========================================================= */

export interface ModalField {
  name: string;

  label: string;

  type: 'text' | 'number' | 'select';

  placeholder?: string;

  required?: boolean;

  options?: {
    label: string;
    value: any;
  }[];

  filter?: boolean;

  maxlength?: number;

  min?: number;
}

/* =========================================================
   COMPONENT
========================================================= */

@Component({
  selector: 'app-master-modal',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, SelectModule],

  templateUrl: './master-modal.html',

  styleUrl: './master-modal.scss',
})
export class MasterModal implements AfterViewInit {
  /* =======================================================
     SERVICES
  ======================================================= */

  private formFacade = inject(MasterFormFacade);

  /* =======================================================
     MODAL
  ======================================================= */

  @ViewChild('masterModal')
  masterModal!: ElementRef;

  private modalInstance: any;

  /* =======================================================
     OUTPUT
  ======================================================= */

  @Output()
  saveClicked = new EventEmitter<any>();

  /* =======================================================
     FORM
  ======================================================= */

  masterForm!: FormGroup;

  /* =======================================================
     MASTER TYPE
  ======================================================= */

  masterType: MasterType = 'department';

  modalType: 'add' | 'edit' = 'add';

  /* =======================================================
     STATUS OPTIONS
  ======================================================= */

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

  /* =======================================================
     DEPARTMENT OPTIONS
  ======================================================= */

  departmentOptions = [
    {
      label: 'Design',
      value: 'Design',
    },

    {
      label: 'IOS Dev',
      value: 'IOS Dev',
    },

    {
      label: 'Business',
      value: 'Business',
    },

    {
      label: 'Marketing',
      value: 'Marketing',
    },
  ];

  /* =======================================================
     STATE OPTIONS
  ======================================================= */

  stateOptions = [
    {
      label: 'Tamil Nadu',
      value: 'Tamil Nadu',
    },

    {
      label: 'Kerala',
      value: 'Kerala',
    },

    {
      label: 'Karnataka',
      value: 'Karnataka',
    },

    {
      label: 'Andhra Pradesh',
      value: 'Andhra Pradesh',
    },

    {
      label: 'Telangana',
      value: 'Telangana',
    },

    {
      label: 'Maharashtra',
      value: 'Maharashtra',
    },

    {
      label: 'Delhi',
      value: 'Delhi',
    },
  ];

  /* =======================================================
     DYNAMIC FIELD CONFIGURATION
  ======================================================= */

  fields: Record<MasterType, ModalField[]> = {
    /* =====================================================
       DEPARTMENT
    ===================================================== */

    department: [
      {
        name: 'departmentName',

        label: 'Department Name',

        type: 'text',

        placeholder: 'Enter department name',

        required: true,
      },
    ],

    /* =====================================================
       TEAM
    ===================================================== */

    team: [
      {
        name: 'teamName',

        label: 'Team Name',

        type: 'text',

        placeholder: 'Enter team name',

        required: true,
      },

      {
        name: 'department',

        label: 'Department',

        type: 'select',

        placeholder: 'Select department',

        required: true,

        filter: true,

        options: this.departmentOptions,
      },

      {
        name: 'teamLead',

        label: 'Team Lead',

        type: 'text',

        placeholder: 'Enter team lead name',

        required: true,
      },

      {
        name: 'members',

        label: 'Number of Members',

        type: 'number',

        placeholder: 'Enter number of members',

        required: true,

        min: 1,
      },
    ],

    /* =====================================================
       POSITION
    ===================================================== */

    position: [
      {
        name: 'positionName',

        label: 'Position Name',

        type: 'text',

        placeholder: 'Enter position name',

        required: true,
      },
    ],

    /* =====================================================
       DOCUMENT
    ===================================================== */

    document: [
      {
        name: 'documentName',

        label: 'Document Name',

        type: 'text',

        placeholder: 'Enter document name',

        required: true,
      },
    ],

    /* =====================================================
       WORK LOCATION
    ===================================================== */

    work: [
      {
        name: 'workLocation',

        label: 'Work Location',

        type: 'text',

        placeholder: 'Enter work location',

        required: true,
      },
    ],

    /* =====================================================
       STATE
    ===================================================== */

    state: [
      {
        name: 'stateName',

        label: 'State Name',

        type: 'text',

        placeholder: 'Enter state name',

        required: true,
      },

      {
        name: 'stateCode',

        label: 'State Code',

        type: 'text',

        placeholder: 'e.g. TN',

        maxlength: 5,

        required: true,
      },

      {
        name: 'country',

        label: 'Country',

        type: 'text',

        placeholder: 'Enter country',

        required: true,
      },
    ],

    /* =====================================================
       DISTRICT
    ===================================================== */

    district: [
      {
        name: 'districtName',

        label: 'District Name',

        type: 'text',

        placeholder: 'Enter district name',

        required: true,
      },

      {
        name: 'state',

        label: 'State',

        type: 'select',

        placeholder: 'Select state',

        required: true,

        filter: true,

        options: this.stateOptions,
      },
    ],

    /* =====================================================
       LEAVE TYPE
    ===================================================== */

    leave: [
      {
        name: 'leaveType',

        label: 'Leave Type Name',

        type: 'text',

        placeholder: 'Enter leave type name',

        required: true,
      },

      {
        name: 'totalDays',

        label: 'Total Days',

        type: 'number',

        placeholder: 'Enter total days',

        required: true,

        min: 0,
      },
    ],

    /* =====================================================
       SHIFT
    ===================================================== */

    shift: [
      {
        name: 'shiftName',

        label: 'Shift Name',

        type: 'text',

        placeholder: 'Enter shift name',

        required: true,
      },
    ],
  };

  /* =======================================================
     CONSTRUCTOR
  ======================================================= */

  constructor() {
    this.masterForm = this.formFacade.createForm();
  }

  /* =======================================================
     AFTER VIEW INIT
  ======================================================= */

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || typeof bootstrap === 'undefined' || !bootstrap.Modal) {
      return;
    }

    this.modalInstance = bootstrap.Modal.getOrCreateInstance(this.masterModal.nativeElement, {
      backdrop: 'static',
      keyboard: false,
    });
  }

  /* =======================================================
     CURRENT FIELDS
  ======================================================= */

  get currentFields(): ModalField[] {
    return this.fields[this.masterType] || [];
  }

  /* =======================================================
     MODAL TITLE
  ======================================================= */

  getTitle(): string {
    const titles: Record<MasterType, string> = {
      department: 'Department',

      team: 'Team',

      position: 'Position',

      document: 'Document',

      work: 'Work Location',

      state: 'State',

      district: 'District',

      leave: 'Leave Type',

      shift: 'Shift',
    };

    const title = titles[this.masterType];

    return this.modalType === 'add' ? `${title} Creation` : `Edit ${title}`;
  }

  /* =======================================================
     OPEN MODAL
  ======================================================= */

  open(type: MasterType, mode: 'add' | 'edit', row?: any): void {
    this.masterType = type;

    this.modalType = mode;

    /* Reset form */

    this.formFacade.resetForm(this.masterForm);

    /* Set validators */

    this.formFacade.setValidators(this.masterForm, type);

    /* Edit data */

    if (mode === 'edit' && row) {
      this.formFacade.patchForm(this.masterForm, type, row);
    }

    /* Restart animation */

    const modalElement = this.masterModal.nativeElement;

    modalElement.classList.remove('modal-animation-ready');

    void modalElement.offsetWidth;

    modalElement.classList.add('modal-animation-ready');

    /* Show modal */

    this.modalInstance?.show();
  }

  /* =======================================================
     SAVE
  ======================================================= */

  save(): void {
    const valid = this.formFacade.isValid(this.masterForm);

    if (!valid) {
      return;
    }

    this.saveClicked.emit({
      masterType: this.masterType,

      modalType: this.modalType,

      values: this.masterForm.getRawValue(),
    });

    this.close();
  }

  /* =======================================================
     CLOSE
  ======================================================= */

  close(): void {
    this.modalInstance?.hide();
  }

  /* =======================================================
     VALIDATION
  ======================================================= */

  hasError(controlName: string): boolean {
    const control = this.masterForm.get(controlName);

    return !!(control && control.touched && control.invalid);
  }
}
