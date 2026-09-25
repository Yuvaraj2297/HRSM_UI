import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { EmployeeFormFacade } from '../../facade/employee-form.facade';
import { CalendarDatepickerDirective } from '../../../../../../common/directives/datepicker';

@Component({
  selector: 'app-education-tab',
  imports: [CommonModule,ReactiveFormsModule,DatePickerModule,CalendarDatepickerDirective,InputTextModule],
  templateUrl: './education-tab.html',
  styleUrl: './education-tab.scss',
})
export class EducationTab {


  constructor(public fs: EmployeeFormFacade) {}

  get form(): FormGroup { return this.fs.form; }
  get education(): FormArray { return this.fs.array('education'); }

  add(): void { this.education.push(this.fs.educationRow()); }
  remove(i: number): void { this.education.removeAt(i); }

  onFile(e: Event, i: number): void {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    this.education.at(i).patchValue({ certificate: file });
  }
}


