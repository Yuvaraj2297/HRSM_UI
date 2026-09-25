import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { EmployeeFormFacade } from '../../facade/employee-form.facade';
import { CalendarDatepickerDirective } from '../../../../../../common/directives/datepicker';
import { ValidationMethods } from '../../../../../../shared/validation/validation-methods';

@Component({
  selector: 'app-profile-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,CalendarDatepickerDirective, SelectModule, DatePickerModule, InputTextModule, TextareaModule, CheckboxModule],
  templateUrl: './profile-tab.html',
  styles: [`
    .pw-meter { height:4px; background:var(--neutral-50-8); border-radius:2px; margin-top:6px; overflow:hidden; }
    .pw-meter-fill { height:100%; transition:width .3s, background .3s; }
    .pw-hint { font-size:11px; color:var(--aw-ink-500,var(--neutral-450)); margin-top:4px; }
    .pw-match { font-size:11px; margin-top:4px; }
    .btn-remove { border:none; background:var(--accent-red-soft,var(--danger-soft)); color:var(--aw-red,var(--danger));
      border-radius:8px; font-weight:600; font-size:12px; padding:7px 12px; margin-bottom:2px; }
  `],
})
export class ProfileTab extends ValidationMethods{
  showPw = false;
  showCpw = false;
  photoPreview = signal<string>('');
  
  constructor(public fs: EmployeeFormFacade) {
    super()
  }

  get form(): FormGroup { return this.fs.form; }
  get profile(): FormGroup { return this.fs.group('profile'); }
  get emergency(): FormGroup { return this.fs.group('emergency'); }
  get job(): FormGroup { return this.fs.group('job'); }
  get salary(): FormGroup { return this.fs.group('salary'); }
  get interview(): FormGroup { return this.fs.group('interview'); }
  get social(): FormGroup { return this.fs.group('social'); }
  get account(): FormGroup { return this.fs.group('account'); }
  get welcomeKit(): FormArray { return this.fs.array('welcomeKit'); }

  // ---- photo ----
  onPhoto(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.profile.patchValue({ photo: file });
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result);
      this.photoPreview.set(src);
      this.profile.patchValue({ photoPreview: src });
    };
    reader.readAsDataURL(file);
  }

  // ---- age from birthday ----
  calcAge(): void {
    const dob: Date | null = this.profile.get('birthday')?.value;
    if (!dob) {
      this.profile.get('age')?.setValue('');
      return;
    }
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
    this.profile.get('age')?.setValue(age >= 0 && age < 150 ? String(age) : '');
  }

  
  // ---- password ----
  get strength(): number {
    const v = this.account.get('password')?.value || '';
    let s = 0;
    if (v.length >= 8) s++;
    if (v.length >= 12) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return s;
  }
  get strengthColor(): string {
    const s = this.strength;
    return s <= 1 ? 'var(--danger)' : s <= 3 ? 'var(--warning)' : 'var(--green-400-2)';
  }
  get passwordsMatch(): boolean {
    const { password, confirmPassword } = this.account.value;
    return !!password && password === confirmPassword;
  }
}