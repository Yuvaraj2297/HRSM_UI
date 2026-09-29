import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { EmployeeFormFacade } from '../../facade/employee-form.facade';

import { AppSelect } from '../../../../../../shared/app-select/app-select';
@Component({
  selector: 'app-family-tab',
  imports: [AppSelect, CommonModule,ReactiveFormsModule,InputTextModule,TextareaModule],
  templateUrl: './family-tab.html',
  styleUrl: './family-tab.scss',
})
export class FamilyTab {


  constructor(public fs: EmployeeFormFacade) {}

  get family(): FormGroup {
    return this.fs.group('family');
  }
  get children(): FormArray {
    return this.family.get('children') as FormArray;
  }

  addChild(): void {
    this.children.push(new FormControl(''));
  }
  removeChild(i: number): void {
    this.children.removeAt(i);
  }
}

