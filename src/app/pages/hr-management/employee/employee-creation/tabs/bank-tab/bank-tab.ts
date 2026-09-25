import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { EmployeeFormFacade } from '../../facade/employee-form.facade';

@Component({
  selector: 'app-bank-tab',
  imports: [CommonModule,ReactiveFormsModule,SelectModule,InputTextModule],
  templateUrl: './bank-tab.html',
  styleUrl: './bank-tab.scss',
})
export class BankTab {



  constructor(public fs: EmployeeFormFacade) {}

  get form(): FormGroup { return this.fs.form; }
  get accounts(): FormArray { return this.fs.array('bankAccounts'); }

  add(): void { this.accounts.push(this.fs.bankRow()); }
  remove(i: number): void { this.accounts.removeAt(i); }

  onFile(e: Event, i: number): void {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    this.accounts.at(i).patchValue({ attachment: file });
  }
}


