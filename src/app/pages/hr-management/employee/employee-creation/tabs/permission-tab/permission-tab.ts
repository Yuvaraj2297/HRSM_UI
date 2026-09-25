import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { SelectModule } from 'primeng/select';

import {
  ALL_PERMISSIONS,
  PERMISSION_GROUPS,
  PermGroup,
  PermModule,
  ROLE_BADGE_CLASS,
  ROLE_DESCRIPTIONS
} from './permissions.data';

import { EmployeeFormFacade } from '../../facade/employee-form.facade';

@Component({
  selector: 'app-permission-tab',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule
  ],

  templateUrl: './permission-tab.html',

  styleUrl: './permission-tab.scss'
})
export class PermissionsTab {

  /* =========================================================
     PERMISSION GROUPS
  ========================================================= */

  groups: PermGroup[] = PERMISSION_GROUPS;


  /* =========================================================
     CONSTRUCTOR
  ========================================================= */

  constructor(
    public fs: EmployeeFormFacade
  ) {}


  /* =========================================================
     PERMISSIONS FORM
  ========================================================= */

  get permissions(): FormGroup {

    return this.fs.group('permissions');

  }


  /* =========================================================
     SELECTED PERMISSIONS
  ========================================================= */

  private get selected(): string[] {

    return this.permissions
      .get('perms')
      ?.value ?? [];

  }


  private set selected(value: string[]) {

    this.permissions
      .get('perms')
      ?.setValue(value);

  }


  /* =========================================================
     ROLE DESCRIPTION
  ========================================================= */

  get roleDescription(): string {

    const role =
      this.permissions
        .get('role')
        ?.value;

    return ROLE_DESCRIPTIONS[role] || '';

  }


  /* =========================================================
     ROLE BADGE
  ========================================================= */

  get badgeClass(): string {

    const role =
      this.permissions
        .get('role')
        ?.value;

    return ROLE_BADGE_CLASS[role] || '';

  }


  /* =========================================================
     CHECK PERMISSION
  ========================================================= */

  has(value: string): boolean {

    return this.selected.includes(value);

  }


  /* =========================================================
     TOGGLE SINGLE PERMISSION
  ========================================================= */

  toggle(value: string): void {

    if (this.has(value)) {

      this.selected =
        this.selected.filter(
          permission =>
            permission !== value
        );

    } else {

      this.selected = [
        ...this.selected,
        value
      ];

    }

  }


  /* =========================================================
     CHECK ALL PERMISSIONS INSIDE MODULE
  ========================================================= */

  allChecked(mod: PermModule): boolean {

    return mod.caps.length > 0 &&
      mod.caps.every(
        cap =>
          this.has(cap.value)
      );

  }


  /* =========================================================
     SELECT / DESELECT MODULE
  ========================================================= */

  toggleModule(mod: PermModule): void {

    const values =
      mod.caps.map(
        cap =>
          cap.value
      );


    /* -------------------------------------------------------
       Already selected -> deselect all
    ------------------------------------------------------- */

    if (this.allChecked(mod)) {

      this.selected =
        this.selected.filter(
          permission =>
            !values.includes(permission)
        );

      return;
    }


    /* -------------------------------------------------------
       Not fully selected -> select all
    ------------------------------------------------------- */

    this.selected =
      Array.from(
        new Set([
          ...this.selected,
          ...values
        ])
      );

  }


  /* =========================================================
     SELECT ALL
  ========================================================= */

  selectAll(): void {

    this.selected = [
      ...ALL_PERMISSIONS
    ];

  }


  /* =========================================================
     DESELECT ALL
  ========================================================= */

  deselectAll(): void {

    this.selected = [];

  }


  /* =========================================================
     ROLE CHANGE
     
     PHP only changes the selected role/description.
     It does not show role -> permission mapping in the
     supplied PHP code.
  ========================================================= */

  applyRole(role: string): void {

    this.permissions
      .get('role')
      ?.setValue(role);

  }

}