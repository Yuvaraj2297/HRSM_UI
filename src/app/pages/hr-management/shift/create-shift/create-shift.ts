import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { Breadcrumb } from '../../../../shared/breadcrumb/breadcrumb';
import { TimePicker } from '../../../../shared/time-picker/time-picker';

export interface ShiftColor {
  id: string;
  name: string;
  hex: string;
}

export interface DayShiftTiming {
  day: string;
  isWeekend: boolean;
  startTime: string;
  endTime: string;
  breakStart: string;
  breakEnd: string;
  showBreakDropdown?: boolean;
}

@Component({
  selector: 'app-create-shift',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, SelectModule, Breadcrumb, TimePicker],
  templateUrl: './create-shift.html',
  styleUrl: './create-shift.scss',
})
export class CreateShift {
  // Reactive Form Group
  shiftForm = new FormGroup({
    shiftName: new FormControl<string | null>(null, [Validators.required]),
    department: new FormControl<string | null>(null, [Validators.required]),
    position: new FormControl<string | null>(null, [Validators.required]),
    color: new FormControl<ShiftColor | null>(null, [Validators.required]),
  });
  // Preset shifts for dropdown / suggestion
  existingShifts = [
    { id: 1, shift_name: 'General Shift', start_time: '09:30 AM', end_time: '06:30 PM' },
    { id: 2, shift_name: 'Morning Shift', start_time: '06:00 AM', end_time: '02:00 PM' },
    { id: 3, shift_name: 'Evening Shift', start_time: '02:00 PM', end_time: '10:00 PM' },
    { id: 4, shift_name: 'Night Shift', start_time: '10:00 PM', end_time: '06:00 AM' },
    { id: 5, shift_name: 'Weekend Support Shift', start_time: '10:00 AM', end_time: '07:00 PM' },
  ];

  shiftNameOptions = [
    { label: 'General Shift', value: 'General Shift' },
    { label: 'Morning Shift', value: 'Morning Shift' },
    { label: 'Evening Shift', value: 'Evening Shift' },
    { label: 'Night Shift', value: 'Night Shift' },
    { label: 'Weekend Support Shift', value: 'Weekend Support Shift' }
  ];

  departmentOptions = [
    { label: 'Developer', value: 'Developer' },
    { label: 'Designer', value: 'Designer' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'HR', value: 'HR' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Admin', value: 'Admin' }
  ];

  positionOptions = [
    { label: 'OpenSource', value: 'OpenSource' },
    { label: 'Backend', value: 'Backend' },
    { label: 'Frontend', value: 'Frontend' },
    { label: 'Full Stack', value: 'Full Stack' },
    { label: 'DevOps', value: 'DevOps' },
    { label: 'UI/UX', value: 'UI/UX' },
    { label: 'Graphic Design', value: 'Graphic Design' },
    { label: 'Content Writer', value: 'Content Writer' },
    { label: 'Digital Marketing', value: 'Digital Marketing' },
    { label: 'Recruiter', value: 'Recruiter' },
    { label: 'Accountant', value: 'Accountant' },
    { label: 'Office Admin', value: 'Office Admin' }
  ];

  // Brand color palette
  shiftColors: ShiftColor[] = [
    { id: 'primary', name: 'Green', hex: 'var(--green-400)' },
    { id: 'blue', name: 'Sky Blue', hex: 'var(--blue-450)' },
    { id: 'amber', name: 'Amber', hex: 'var(--warning)' },
    { id: 'red', name: 'Coral Red', hex: 'var(--danger)' },
    { id: 'violet', name: 'Violet', hex: 'var(--purple-500)' },
    { id: 'pink', name: 'Pink', hex: 'var(--pink-450)' },
  ];

  // Form Fields
  shiftName = '';
  department = '';
  position = '';
  selectedColor: ShiftColor | null = null;
  colorDropdownOpen = false;

  // Common timing for all days
  commonStartTime = '';
  commonEndTime = '';
  commonBreakStart = '';
  commonBreakEnd = '';
  commonBreakDropdownOpen = false;

  // Day records
  days: DayShiftTiming[] = [
    { day: 'Sunday', isWeekend: true, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
    { day: 'Monday', isWeekend: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
    { day: 'Tuesday', isWeekend: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
    { day: 'Wednesday', isWeekend: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
    { day: 'Thursday', isWeekend: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
    { day: 'Friday', isWeekend: false, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
    { day: 'Saturday', isWeekend: true, startTime: '', endTime: '', breakStart: '', breakEnd: '' },
  ];

  // Alert message
  alertMessage: string | null = null;
  alertType: 'success' | 'danger' = 'danger';

  constructor(private router: Router) { }

  // ---------------- Color Picker ----------------
  toggleColorDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.colorDropdownOpen = !this.colorDropdownOpen;
  }

  selectColor(color: ShiftColor, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedColor = color;
    this.colorDropdownOpen = false;
  }

  // ---------------- Shift Preset Selection ----------------
  onShiftNameChange(value: string): void {
    if (value) {
      this.shiftForm.controls.shiftName.setValue(value);
    }
    const preset = this.existingShifts.find(s => s.shift_name === value);
    if (preset) {
      this.commonStartTime = preset.start_time;
      this.commonEndTime = preset.end_time;
      this.applyToAllDays();
    }
  }

  // ---------------- Common Timing ----------------
  get canApplyAll(): boolean {
    return !!(this.commonStartTime && this.commonEndTime);
  }

  applyToAllDays(): void {
    if (!this.canApplyAll) return;
    this.days.forEach(day => {
      day.startTime = this.commonStartTime;
      day.endTime = this.commonEndTime;
      day.breakStart = this.commonBreakStart;
      day.breakEnd = this.commonBreakEnd;
    });
  }

  toggleCommonBreak(event: MouseEvent): void {
    event.stopPropagation();
    this.commonBreakDropdownOpen = !this.commonBreakDropdownOpen;
  }

  removeCommonBreak(): void {
    this.commonBreakStart = '';
    this.commonBreakEnd = '';
    this.commonBreakDropdownOpen = false;
  }

  doneCommonBreak(): void {
    this.commonBreakDropdownOpen = false;
  }

  // ---------------- Per-day Break Actions ----------------
  toggleDayBreak(day: DayShiftTiming, event: MouseEvent): void {
    event.stopPropagation();
    this.days.forEach(d => {
      if (d !== day) d.showBreakDropdown = false;
    });
    this.commonBreakDropdownOpen = false;
    day.showBreakDropdown = !day.showBreakDropdown;
  }

  removeDayBreak(day: DayShiftTiming): void {
    day.breakStart = '';
    day.breakEnd = '';
    day.showBreakDropdown = false;
  }

  doneDayBreak(day: DayShiftTiming): void {
    day.showBreakDropdown = false;
  }

  // ---------------- Copy Day to All ----------------
  copyDayToAll(source: DayShiftTiming): void {
    if (!source.startTime || !source.endTime) {
      this.showAlert('danger', "Set this day's start and end time before copying it to the rest of the week.");
      return;
    }
    this.days.forEach(d => {
      if (d !== source) {
        d.startTime = source.startTime;
        d.endTime = source.endTime;
        d.breakStart = source.breakStart;
        d.breakEnd = source.breakEnd;
      }
    });
  }

  // ---------------- Working Hours Calculation ----------------
  toMinutes(val: string): number | null {
    if (!val) return null;
    val = val.trim();

    // Match "01:49 PM" or "1:49 PM"
    const ampmMatch = val.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (ampmMatch) {
      let h = parseInt(ampmMatch[1], 10);
      const m = parseInt(ampmMatch[2], 10);
      const ap = ampmMatch[3].toUpperCase();
      if (ap === 'PM' && h !== 12) h += 12;
      if (ap === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    }

    // Match 24h format "13:49"
    const parts = val.split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) || 0;
    if (isNaN(h)) return null;
    return h * 60 + m;
  }

  computeWorkingHours(day: DayShiftTiming): string {
    const s = this.toMinutes(day.startTime);
    const e = this.toMinutes(day.endTime);
    if (s == null || e == null) return '-';

    let total = e - s;
    if (total <= 0) total += 24 * 60; // handles overnight shift

    const bs = this.toMinutes(day.breakStart);
    const be = this.toMinutes(day.breakEnd);
    if (bs != null && be != null) {
      let brk = be - bs;
      if (brk <= 0) brk += 24 * 60;
      total -= brk;
    }

    const netMins = Math.max(total, 0);
    const h = Math.floor(netMins / 60);
    const m = netMins % 60;
    return `${h}h ${String(m).padStart(2, '0')}m`;
  }

  hasWorkingHours(day: DayShiftTiming): boolean {
    return this.computeWorkingHours(day) !== '-';
  }

  formatBreakLabel(start: string, end: string): string {
    if (!start || !end) return 'Add Break';
    return `${start} - ${end}`;
  }

  // ---------------- Global Click to Close Popovers ----------------
  @HostListener('document:click')
  onDocumentClick(): void {
    this.colorDropdownOpen = false;
    this.commonBreakDropdownOpen = false;
    this.days.forEach(d => (d.showBreakDropdown = false));
  }

  // ---------------- Save & Validation ----------------
  showAlert(type: 'success' | 'danger', msg: string): void {
    this.alertType = type;
    this.alertMessage = msg;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  dismissAlert(): void {
    this.alertMessage = null;
  }

  saveShift(): void {
    const { shiftName, department, position, color } = this.shiftForm.value;

    if (!shiftName?.trim()) {
      this.showAlert('danger', 'Please enter or select a shift name.');
      return;
    }
    if (!department?.trim()) {
      this.showAlert('danger', 'Please select a department.');
      return;
    }
    if (!position?.trim()) {
      this.showAlert('danger', 'Please select a position.');
      return;
    }
    if (!color) {
      this.showAlert('danger', 'Please choose a shift color.');
      return;
    }

    const hasTiming = this.days.some(d => d.startTime && d.endTime);
    if (!hasTiming) {
      this.showAlert('danger', 'Set the shift timing (common time or at least one day) before saving.');
      return;
    }

    const payload = {
      shift_name: shiftName.trim(),
      department: department.trim(),
      position: position.trim(),
      color_id: color.id,
      color_hex: color.hex,
      days: this.days.map(d => ({
        day: d.day,
        start_time: d.startTime || null,
        end_time: d.endTime || null,
        break_start: d.breakStart || null,
        break_end: d.breakEnd || null,
      }))
    };

    console.log('Shift created payload:', payload);
    this.showAlert('success', `Shift "${payload.shift_name}" created successfully. Redirecting to Manage Shift…`);

    setTimeout(() => {
      this.router.navigate(['/shift/manage-shift']);
    }, 1200);
  }
}
