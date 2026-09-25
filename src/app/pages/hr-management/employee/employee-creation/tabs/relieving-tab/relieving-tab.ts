import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { EmployeeFormFacade } from '../../facade/employee-form.facade';
import { CalendarDatepickerDirective } from '../../../../../../common/directives/datepicker';

@Component({
  selector: 'app-relieving-tab',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    DatePickerModule,
    CalendarDatepickerDirective,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './relieving-tab.html',
  styleUrl: './relieving-tab.scss',
})
export class RelievingTab {
  constructor(public fs: EmployeeFormFacade) {}

  // =========================================================
  // RELIEVING FORM
  // =========================================================

  get relieving(): FormGroup {
    return this.fs.group('relieving');
  }

  // =========================================================
  // EMPLOYEE NAME
  // Auto-filled from Profile tab
  // =========================================================

  get employeeName(): string {
    const profile = this.fs.group('profile').value;

    const firstName = profile.firstName || '';
    const lastName = profile.lastName || '';

    return `${firstName} ${lastName}`.trim();
  }

  // =========================================================
  // FILE NAME
  // =========================================================

  get selectedFileName(): string {
    const file = this.relieving.get('letter')?.value;

    return file?.name || 'No file chosen';
  }

  // =========================================================
  // FILE UPLOAD
  // =========================================================

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0] ?? null;

    this.relieving.patchValue({
      letter: file,
    });

    this.relieving.get('letter')?.markAsDirty();
  }

  // =========================================================
  // VALIDATION
  // =========================================================

  isInvalid(controlName: string): boolean {
    const control = this.relieving.get(controlName);

    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  // =========================================================
  // SUBMIT REQUEST
  // =========================================================

  submitRequest(): void {
    if (this.relieving.invalid) {
      this.relieving.markAllAsTouched();

      return;
    }

    const formData = this.relieving.getRawValue();

    console.log('Resignation / Relieving Request:', formData);

    /*
      Add your API call here.

      Example:

      this.fs.submitRelievingRequest(formData);
    */
  }
}
