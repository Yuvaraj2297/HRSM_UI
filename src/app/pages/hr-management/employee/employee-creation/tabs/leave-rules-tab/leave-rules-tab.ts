import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTextModule } from 'primeng/inputtext';

import { EmployeeFormFacade } from '../../facade/employee-form.facade';

/** Master list of leave types the dropdown offers. Extend freely. */
const ALL_LEAVE_TYPES = [ 'Earned Leave', 'Maternity Leave', 'Paternity Leave'];

/** Rows present in the table by default, before the user adds anything. */
const DEFAULT_LEAVE_TYPES = ['Casual Leave', 'Sick Leave'];

@Component({
  selector: 'app-leave-rules-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SelectModule, ToggleSwitchModule, InputTextModule],
  templateUrl: './leave-rules-tab.html',
  styles: [`
    .rules-hint2 { display:block; margin-top:6px; font-size:12px; color:var(--aw-ink-500,var(--neutral-450)); }
    .rules-note { font-size:11.5px; color:var(--aw-ink-500,var(--neutral-450)); margin-top:12px; }
    .rules-empty { padding:24px 12px; color:var(--aw-ink-500,var(--neutral-450)); font-size:13px; }
    .days-input {
      width:110px; display:inline-block; text-align:center;
      border-radius:999px; border-color:var(--primary); color:var(--primary); font-weight:600;
    }
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