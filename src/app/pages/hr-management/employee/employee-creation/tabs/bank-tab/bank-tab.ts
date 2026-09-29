import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { EmployeeFormFacade } from '../../facade/employee-form.facade';

import { AppSelect } from '../../../../../../shared/app-select/app-select';
@Component({
  selector: 'app-bank-tab',
  imports: [AppSelect, CommonModule,ReactiveFormsModule,InputTextModule],
  templateUrl: './bank-tab.html',
  styleUrl: './bank-tab.scss',
})
export class BankTab {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  /** entry form — saved into the bankAccounts array on Add / Update */
  draft: FormGroup;
  /** index of the row being edited, null when adding a new one */
  editIndex: number | null = null;

  constructor(public fs: EmployeeFormFacade) {
    this.draft = this.fs.bankRow();
  }

  get form(): FormGroup { return this.fs.form; }
  get accounts(): FormArray { return this.fs.array('bankAccounts'); }

  save(): void {
    if (this.draft.invalid) {
      this.draft.markAllAsTouched();
      return;
    }

    const value = this.draft.getRawValue();
    if (this.editIndex === null) {
      const row = this.fs.bankRow();
      row.patchValue(value);
      this.accounts.push(row);
    } else {
      this.accounts.at(this.editIndex).patchValue(value);
    }
    this.accounts.markAsDirty();
    this.reset();
  }

  edit(i: number): void {
    this.editIndex = i;
    this.draft.reset(this.accounts.at(i).getRawValue());
    this.clearFileInput();
  }

  remove(i: number): void {
    this.accounts.removeAt(i);
    this.accounts.markAsDirty();
    if (this.editIndex === i) {
      this.reset();
    } else if (this.editIndex !== null && this.editIndex > i) {
      this.editIndex--;
    }
  }

  reset(): void {
    this.editIndex = null;
    this.draft.reset(this.fs.bankRow().getRawValue());
    this.clearFileInput();
  }

  onFile(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    this.draft.patchValue({ attachment: file });
  }

  statusLabel(value: string | null): string {
    return this.fs.accountStatuses.find(s => s.value === value)?.label ?? '-';
  }

  invalid(name: string): boolean {
    const c = this.draft.get(name);
    return !!c && c.invalid && c.touched;
  }

  private clearFileInput(): void {
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }
}
