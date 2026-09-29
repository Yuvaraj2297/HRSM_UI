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


import { MasterFormFacade, MasterType } from '../facade/master-form.facade';

import { AppSelect } from '../../../shared/app-select/app-select';
declare var bootstrap: any;

/* =========================================================
   MODAL FIELD INTERFACE
========================================================= */

export interface ModalField {
  name: string;

  label: string;

  type: 'text' | 'number' | 'select' | 'checkbox';

  placeholder?: string;

  required?: boolean;

  options?: {
    label: string;
    value: any;
  }[];

  checkboxOptions?: {
    key: string;
    label: string;
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

  imports: [AppSelect, CommonModule, ReactiveFormsModule],

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

  @ViewChild('masterModal') masterModal!: ElementRef;

  private modalInstance: any;

  /* =======================================================
     OUTPUT
  ======================================================= */

  @Output() saveClicked = new EventEmitter<any>();

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


      job_type: [
      {
        name: 'jobType',

        label: 'Job Type',

        type: 'text',

        placeholder: 'Enter Job Type',

        required: true,
      },
    ],


      designation: [
      {
        name: 'designation',

        label: 'Designation',

        type: 'text',

        placeholder: 'Enter Designation',

        required: true,
      },
    ],

 
      branch: [
      {
        name: 'branchName',

        label: 'Branch',

        type: 'text',

        placeholder: 'Enter Branch',

        required: true,
      },
    ],


      employee: [
      {
        name: 'employeeTypeName',

        label: 'Employee Type Name',

        type: 'text',

        placeholder: 'Enter Employee Type Name',

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


     country: [
      {
        name: 'countryName',

        label: 'Country Name',

        type: 'text',

        placeholder: 'Enter country name',

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



    relieving_type:[

      {
        name: 'relievingType',

        label: 'Relieving Type',

        type: 'text',

        placeholder: 'Enter relieving type',

        required: true,
      },

    ],

    
    notice_period:[

      {
        name: 'noticePeriod',

        label: 'Notice Period',

        type: 'text',

        placeholder: 'Enter Notice Period (e.g. 30 Days)',

        required: true,
      },

    ],


     holiday: [
      {
        name: 'holidayType',

        label: 'Holiday Type',

        type: 'text',

        placeholder: 'Enter Holiday Type',

        required: true,
      },
    ],



    role: [
      {
        name: 'roleName',
        label: 'Role Name',
        type: 'text',
        placeholder: 'Enter role name',
        required: true,
      },
    ],

    permission: [
      {
        name: 'group',
        label: 'Group',
        type: 'text',
        placeholder: 'e.g. HR Management',
        required: true,
      },

      {
        name: 'module',
        label: 'Module Name',
        type: 'text',
        placeholder: 'e.g. HR Dashboard',
        required: true,
      },

      {
        name: 'capabilities',
        label: 'Capabilities',
        type: 'checkbox',
        required: true,
        checkboxOptions: [
          { key: 'viewOwn', label: 'View (Own)' },
          { key: 'viewGlobal', label: 'View (Global)' },
          { key: 'create', label: 'Create' },
          { key: 'edit', label: 'Edit' },
          { key: 'delete', label: 'Delete' },
        ],
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

      job_type:'Job Type',

      designation:'Designation',

      branch:'Branch',

      employee:'Employee Type',

      work: 'Work Location',

      country:'Country',

      state: 'State',

      district: 'District',

      leave: 'Leave Type',

      relieving_type:'Relieving Type',

      shift: 'Shift',

      notice_period:'Notice Period',

      holiday:'Holiday',

      permission: 'Module',

      role: 'Role',

      
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