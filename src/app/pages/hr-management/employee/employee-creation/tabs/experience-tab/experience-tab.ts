import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { EmployeeFormFacade } from '../../facade/employee-form.facade';
import { CalendarDatepickerDirective } from '../../../../../../common/directives/datepicker';

@Component({
  selector: 'app-experience-tab',
  imports: [CommonModule,ReactiveFormsModule,DatePickerModule,CalendarDatepickerDirective, InputTextModule],
  templateUrl: './experience-tab.html',
  styleUrl: './experience-tab.scss',
})
export class ExperienceTab {


  constructor(public fs: EmployeeFormFacade) {}

  get form(): FormGroup { return this.fs.form; }
  get experience(): FormArray { return this.fs.array('experience'); }

  add(): void { this.experience.push(this.fs.experienceRow()); }
  remove(i: number): void { this.experience.removeAt(i); }

  onFile(e: Event, i: number, field: string): void {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    this.experience.at(i).patchValue({ [field]: file });
  }
}


