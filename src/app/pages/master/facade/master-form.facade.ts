import { Injectable } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/* =========================================================
   MASTER TYPE
========================================================= */

export type MasterType =
  | 'department'
  | 'team'
  | 'position'
  | 'document'
  | 'work'
  | 'state'
  | 'district'
  | 'leave'
  | 'shift';

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

      /* Team */

      teamName: [''],

      department: [''],

      teamLead: [''],

      members: [''],

      /* Position */

      positionName: [''],

      /* Document */

      documentName: [''],

      /* Work Location */

      workLocation: [''],

      /* State */

      stateName: [''],

      stateCode: [''],

      country: [''],

      /* District */

      districtName: [''],

      state: [''],

      /* Leave */

      leaveType: [''],

      totalDays: [''],

      /* Shift */

      shiftName: [''],

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

      case 'team':
        form.get('teamName')?.setValidators(Validators.required);

        form.get('department')?.setValidators(Validators.required);

        form.get('teamLead')?.setValidators(Validators.required);

        form.get('members')?.setValidators([Validators.required, Validators.min(1)]);

        break;

      case 'position':
        form.get('positionName')?.setValidators(Validators.required);

        break;

      case 'document':
        form.get('documentName')?.setValidators(Validators.required);

        break;

      case 'work':
        form.get('workLocation')?.setValidators(Validators.required);

        break;

      case 'state':
        form.get('stateName')?.setValidators(Validators.required);

        form.get('stateCode')?.setValidators(Validators.required);

        form.get('country')?.setValidators(Validators.required);

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

      /* ===================================================
         TEAM
      =================================================== */

      case 'team':
        form.patchValue({
          id: row.id,

          teamName: row.teamName ?? '',

          department: row.department ?? '',

          teamLead: row.teamLead ?? row.lead ?? '',

          members: row.members ?? '',

          status: row.status ?? 'Enable',
        });

        break;

      /* ===================================================
         POSITION
      =================================================== */

      case 'position':
        form.patchValue({
          id: row.id,

          positionName: row.positionName ?? row.position ?? '',

          status: row.status ?? 'Enable',
        });

        break;

      /* ===================================================
         DOCUMENT
      =================================================== */

      case 'document':
        form.patchValue({
          id: row.id,

          documentName: row.documentName ?? row.document ?? '',

          status: row.status ?? 'Enable',
        });

        break;

      /* ===================================================
         WORK LOCATION
      =================================================== */

      case 'work':
        form.patchValue({
          id: row.id,

          workLocation: row.workLocation ?? '',

          status: row.status ?? 'Enable',
        });

        break;

      /* ===================================================
         STATE
      =================================================== */

      case 'state':
        form.patchValue({
          id: row.id,

          stateName: row.stateName ?? row.state ?? '',

          stateCode: row.stateCode ?? '',

          country: row.country ?? '',

          status: row.status ?? 'Enable',
        });

        break;

      /* ===================================================
         DISTRICT
      =================================================== */

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
    }
  }

  /* =======================================================
     RESET FORM
  ======================================================= */

  resetForm(form: FormGroup): void {
    form.reset({
      id: null,

      /* Department */

      departmentName: '',

      /* Team */

      teamName: '',

      department: '',

      teamLead: '',

      members: '',

      /* Position */

      positionName: '',

      /* Document */

      documentName: '',

      /* Work */

      workLocation: '',

      /* State */

      stateName: '',

      stateCode: '',

      country: '',

      /* District */

      districtName: '',

      state: '',

      /* Leave */

      leaveType: '',

      totalDays: '',

      /* Shift */

      shiftName: '',

      /* Common */

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
