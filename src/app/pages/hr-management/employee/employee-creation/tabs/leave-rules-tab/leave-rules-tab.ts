import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTextModule } from 'primeng/inputtext';

import { EmployeeFormFacade } from '../../facade/employee-form.facade';

import { AppSelect } from '../../../../../../shared/app-select/app-select';
/** Master list of leave types the dropdown offers. Extend freely. */
const ALL_LEAVE_TYPES = [ 'Earned Leave', 'Maternity Leave', 'Paternity Leave'];

/** Rows present in the table by default, before the user adds anything. */
const DEFAULT_LEAVE_TYPES = ['Casual Leave', 'Sick Leave'];

@Component({
  selector: 'app-leave-rules-tab',
  standalone: true,
  imports: [AppSelect, CommonModule, ReactiveFormsModule, FormsModule, ToggleSwitchModule, InputTextModule],
  templateUrl: './leave-rules-tab.html',
  styles: [`
    /* layout only */
    .col-type { width: 22%; }
    .days-input { width: 110px; display: inline-block; text-align: center; }
  `],
})
export class LeaveRulesTab implements OnInit {
  /** bound to the "Leave Type" p-select; always reset to null after adding */
  pendingType: string | null = null;

  constructor(public fs: EmployeeFormFacade) {}

  get form(): FormGroup { return this.fs.form; }
  get rules(): FormArray { return this.fs.array('leaveRules'); }

  ngOnInit(): void {
    // seed Casual Leave + Sick Leave once, don't duplicate on re-entering the tab
    if (this.rules.length) return;
    DEFAULT_LEAVE_TYPES.forEach((type) => this.rules.push(this.fs.leaveRuleRow(type)));
  }

  /** leave types not already present as a row — feeds the dropdown */
  get availableLeaveTypes(): string[] {
    const used = this.rules.controls.map((c) => c.value.type);
    return ALL_LEAVE_TYPES.filter((t) => !used.includes(t));
  }

  addLeaveType(type: string | null): void {
    if (!type) return;
    this.rules.push(this.fs.leaveRuleRow(type));
    this.pendingType = null; // reset dropdown so it shows the placeholder again
  }

  removeLeaveType(i: number): void {
    this.rules.removeAt(i);
  }

  /** trainee ⊃ probation ⊃ confirmation */
  cascade(i: number, stage: 'trainee' | 'probation' | 'confirmation'): void {
    const row = this.rules.at(i);
    const v = row.value;

    if (stage === 'trainee' && v.trainee) {
      row.patchValue({ probation: true, confirmation: true }, { emitEvent: false });
    }
    if (stage === 'probation') {
      v.probation
        ? row.patchValue({ confirmation: true }, { emitEvent: false })
        : row.patchValue({ trainee: false }, { emitEvent: false });
    }
    if (stage === 'confirmation' && !v.confirmation) {
      row.patchValue({ probation: false, trainee: false }, { emitEvent: false });
    }
  }
}