import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { EmployeeFormFacade } from '../../facade/employee-form.facade';

@Component({
  selector: 'app-document-tab',
  imports: [CommonModule,ReactiveFormsModule,InputTextModule],
  templateUrl: './document-tab.html',
  styleUrl: './document-tab.scss',
})
export class DocumentTab {

  fixedDocs = [
    { key: 'resume', label: 'Resume / CV', hint: 'PDF, DOC (Max 5MB)', accept: '.pdf,.doc,.docx' },
    { key: 'idProof', label: 'ID Proof', hint: 'PDF, JPG, PNG (Max 5MB)', accept: '.pdf,image/*' },
    { key: 'addressProof', label: 'Address Proof', hint: 'PDF, JPG, PNG (Max 5MB)', accept: '.pdf,image/*' },
    { key: 'offerLetter', label: 'Offer Letter', hint: 'PDF (Max 5MB)', accept: '.pdf' },
  ];

  constructor(public fs: EmployeeFormFacade) {}

  get form(): FormGroup { return this.fs.group('documents'); }
  get custom(): FormArray { return this.form.get('custom') as FormArray; }


  onFixedFile(e: Event, key: string): void {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    this.form.get(key)?.setValue(file);
  }

  addCustom(): void { this.custom.push(this.fs.customDocRow()); }
  removeCustom(i: number): void { this.custom.removeAt(i); }

  onCustomFile(e: Event, i: number): void {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    this.custom.at(i).patchValue({ file, fileName: file ? file.name : '' });
  }
}


