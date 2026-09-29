import { Injectable } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

/* At least one checkbox in the group must be ticked */
const atLeastOneChecked = (group: AbstractControl): ValidationErrors | null =>
  Object.values(group.value ?? {}).some(Boolean) ? null : { noneSelected: true };

/* =========================================================
   MASTER TYPE
========================================================= */

export type MasterType =
  | 'department'
  | 'job_type'
  | 'designation'
  | 'branch'
  | 'employee'
  | 'work'
  | 'country'
  | 'state'
  | 'district'
  |'relieving_type'
  | 'leave'
  | 'shift'
  |'notice_period'
  |'holiday'
  | 'permission'
  | 'role';

/* =========================================================
   FACADE
========================================================= */

@Injectable({
  providedIn: 'root',
})
export class MasterFormFacade {
  constructor(private fb: FormBuilder) {}

  /* =======================================================
     CREATE FORM
  ======================================================= */

  createForm(): FormGroup {
    return this.fb.group({
      /* ID */

      id: [null],

      /* Department */

      departmentName: [''],

      designation: [''],

      /* Team */
      jobType: [''],

      branchName: [''],

      employeeTypeName: [''],

      /* Work Location */

      workLocation: [''],

      /* State */

      stateName: [''],

      stateCode: [''],

      countryName: [''],

      country: [''],

      /* District */

      districtName: [''],

      state: [''],

      /* Leave */

      leaveType: [''],

      totalDays: [''],

      /* Shift */

      shiftName: [''],


      relievingType:[''],

      noticePeriod:[''],
      
      holidayType:[''],

      group:[''],
      module:[''],

      
     capabilities: this.fb.group({
      viewOwn: [false],
      viewGlobal: [false],
      create: [false],
      edit: [false],
      delete: [false],
    }),
    
      roleName: [''],

      /* Common */

      status: ['Enable', Validators.required],
    });
  }

  /* =======================================================
     SET VALIDATORS
  ======================================================= */

  setValidators(form: FormGroup, type: MasterType): void {
    /* Clear all validators */

    Object.keys(form.controls).forEach((controlName) => {
      if (controlName !== 'status') {
        form.get(controlName)?.clearValidators();
      }
    });

    /* Type validators */

    switch (type) {
      case 'department':
        form.get('departmentName')?.setValidators(Validators.required);

        break;

      case 'job_type':
        form.get('jobType')?.setValidators(Validators.required);
        break;

      case 'designation':
        form.get('designation')?.setValidators(Validators.required);
        break;

      case 'branch':
        form.get('branchName')?.setValidators(Validators.required);
        break;

      case 'employee':
        form.get('employeeTypeName')?.setValidators(Validators.required);
        break;

      case 'work':
        form.get('workLocation')?.setValidators(Validators.required);

        break;

      case 'state':
        form.get('stateName')?.setValidators(Validators.required);

        form.get('stateCode')?.setValidators(Validators.required);

        form.get('country')?.setValidators(Validators.required);

        break;

      case 'country':
        form.get('countryName')?.setValidators(Validators.required);
        break;

      case 'district':
        form.get('districtName')?.setValidators(Validators.required);

        form.get('state')?.setValidators(Validators.required);

        break;

      case 'leave':
        form.get('leaveType')?.setValidators(Validators.required);

        form.get('totalDays')?.setValidators([Validators.required, Validators.min(0)]);

        break;

      case 'shift':
        form.get('shiftName')?.setValidators(Validators.required);

        break;

        case 'relieving_type':
        form.get('relievingType')?.setValidators(Validators.required);

        break;

        case 'notice_period':
          form.get('noticePeriod')?.setValidators(Validators.required);
          break;


           case 'holiday':
          form.get('holidayType')?.setValidators(Validators.required);
          break;

        case 'permission':
          form.get('group')?.setValidators(Validators.required);
          form.get('module')?.setValidators(Validators.required);
          form.get('capabilities')?.setValidators(atLeastOneChecked);
          break;

        case 'role':
          form.get('roleName')?.setValidators(Validators.required);
          break;



    }

    /* Status */

    form.get('status')?.setValidators(Validators.required);

    /* Update validity */

    Object.keys(form.controls).forEach((controlName) => {
      form.get(controlName)?.updateValueAndValidity({
        emitEvent: false,
      });
    });
  }

  /* =======================================================
     PATCH EDIT DATA
  ======================================================= */

  patchForm(form: FormGroup, type: MasterType, row: any): void {
    switch (type) {
      /* ===================================================
         DEPARTMENT
      =================================================== */

      case 'department':
        form.patchValue({
          id: row.id,

          departmentName: row.departmentName ?? row.department ?? '',

          status: row.status ?? 'Enable',
        });

        break;

      case 'job_type':
        form.patchValue({
          id: row.id,
          jobType: row.jobType ?? row.job_type ?? '',
          status: row.status ?? 'Enable',
        });
        break;

      case 'designation':
        form.patchValue({
          id: row.id,

          designation: row.designationName ?? row.designation ?? '',

          status: row.status ?? 'Enable',
        });

        break;

      case 'branch':
        form.patchValue({
          id: row.id,

          branchName: row.branchName ?? row.branch ?? '',

          status: row.status ?? 'Enable',
        });

        break;

      case 'employee':
        form.patchValue({
          id: row.id,

          employeeTypeName: row.employeeTypeName ?? row.employee ?? '',

          status: row.status ?? 'Enable',
        });

        break;

      case 'work':
        form.patchValue({
          id: row.id,

          workLocation: row.workLocation ?? '',

          status: row.status ?? 'Enable',
        });

        break;

      case 'country':
        form.patchValue({
          id: row.id,

          countryName: row.countryName ?? row.country ?? '',
          status: row.status ?? 'Enable',
        });

        break;

      case 'state':
        form.patchValue({
          id: row.id,

          stateName: row.stateName ?? row.state ?? '',

          stateCode: row.stateCode ?? '',

          country: row.country ?? '',

          status: row.status ?? 'Enable',
        });

        break;

      case 'district':
        form.patchValue({
          id: row.id,

          districtName: row.districtName ?? row.district ?? '',

          state: row.state ?? '',

          status: row.status ?? 'Enable',
        });

        break;

      /* ===================================================
         LEAVE
      =================================================== */

      case 'leave':
        form.patchValue({
          id: row.id,

          leaveType: row.leaveType ?? row.leaveTypeName ?? '',

          totalDays: row.totalDays ?? '',

          status: row.status ?? 'Enable',
        });

        break;

      /* ===================================================
         SHIFT
      =================================================== */

      case 'shift':
        form.patchValue({
          id: row.id,

          shiftName: row.shiftName ?? row.shift ?? '',

          status: row.status ?? 'Enable',
        });

        break;


         case 'relieving_type':
        form.patchValue({
          id: row.id,

          relievingType: row.relievingType ?? row.relieving ?? '',

          status: row.status ?? 'Enable',
        });

        break;



         case 'notice_period':
        form.patchValue({
          id: row.id,

          noticePeriod: row.noticePeriod ?? row.notice ?? '',

          status: row.status ?? 'Enable',
        });

        break;

      case 'holiday':
        form.patchValue({
          id: row.id,

          holidayType: row.holidayType ?? row.holiday ?? '',

          status: row.status ?? 'Enable',
        });

        break;

      case 'permission':
        form.patchValue({
          id: row.id,

          group: row.group ?? '',

          module: row.module ?? row.moduleName ?? '',

          capabilities: {
            viewOwn: row.capabilities?.viewOwn ?? false,
            viewGlobal: row.capabilities?.viewGlobal ?? false,
            create: row.capabilities?.create ?? false,
            edit: row.capabilities?.edit ?? false,
            delete: row.capabilities?.delete ?? false,
          },

          status: row.status ?? 'Enable',
        });

        break;

      case 'role':
        form.patchValue({
          id: row.id,

          roleName: row.roleName ?? row.role ?? '',

          status: row.status ?? 'Enable',
        });

        break;
    }


    }



  /* =======================================================
     RESET FORM
  ======================================================= */

  resetForm(form: FormGroup): void {
    form.reset({
      id: null,

      departmentName: '',
      designation: '',
      jobType: '',
      branchName: '',
      employeeTypeName: '',
      workLocation: '',

      stateName: '',
      stateCode: '',
      countryName: '',
      country: '',

      districtName: '',
      state: '',

      leaveType: '',
      totalDays: '',

      shiftName: '',
      relievingType: '',
      noticePeriod: '',
      holidayType: '',

      roleName: '',

      group: '',
      module: '',
      capabilities: {
        viewOwn: false,
        viewGlobal: false,
        create: false,
        edit: false,
        delete: false,
      },

      status: 'Enable',
    });
  }

  /* =======================================================
     FORM VALIDATION
  ======================================================= */

  isValid(form: FormGroup): boolean {
    if (form.invalid) {
      Object.keys(form.controls).forEach((controlName) => {
        form.get(controlName)?.markAsTouched();
      });

      return false;
    }

    return true;
  }
}