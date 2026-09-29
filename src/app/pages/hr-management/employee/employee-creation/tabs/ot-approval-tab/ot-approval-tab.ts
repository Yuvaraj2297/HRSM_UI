import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { EmployeeFormFacade } from '../../facade/employee-form.facade';

import { AppSelect } from '../../../../../../shared/app-select/app-select';
@Component({
  selector: 'app-ot-approval-tab',
  standalone: true,
  imports: [AppSelect, CommonModule, ReactiveFormsModule],
  templateUrl: './ot-approval-tab.html',
})
export class OtApprovalTab {
  constructor(public fs: EmployeeFormFacade) {}

  get otApproval(): FormGroup {
    return this.fs.group('otApproval');
  }

  get levels(): FormArray {
    return this.otApproval.get('levels') as FormArray;
  }

  addLevel(): void {
    this.levels.push(new FormControl(null));
  }

  removeLevel(i: number): void {
    this.levels.removeAt(i);
  }

  ordinal(value: number): string {
    const suffix =
      value % 100 >= 11 && value % 100 <= 13
        ? 'th'
        : value % 10 === 1
          ? 'st'
          : value % 10 === 2
            ? 'nd'
            : value % 10 === 3
              ? 'rd'
              : 'th';

    return `${value}${suffix}`;
  }
}
