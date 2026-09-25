import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-time-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-picker.html',
  styleUrl: './time-picker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePicker),
      multi: true,
    },
  ],
})
export class TimePicker implements ControlValueAccessor {
  @Input() placeholder: string = 'HH:MM';
  @Input() inputClass: string = '';
  @Input() disabled: boolean = false;
  @Input() id: string = '';

  @Output() timeChange = new EventEmitter<string>();

  value: string = '';
  isOpen: boolean = false;

  // Active custom dropdown inside popup: 'hour' | 'minute' | 'period' | null
  activeDropdown: 'hour' | 'minute' | 'period' | null = null;

  hours: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  minutes: string[] = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  periods: string[] = ['AM', 'PM'];

  selectedHour: string = '12';
  selectedMinute: string = '00';
  selectedPeriod: string = 'AM';

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  writeValue(val: string): void {
    this.value = val || '';
    this.parseValueToControls(this.value);
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  togglePopup(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    this.activeDropdown = null;
    if (this.isOpen) {
      this.parseValueToControls(this.value);
    }
  }

  closePopup(): void {
    this.isOpen = false;
    this.activeDropdown = null;
  }

  toggleDropdown(type: 'hour' | 'minute' | 'period', event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.activeDropdown = this.activeDropdown === type ? null : type;
    if (this.activeDropdown) {
      setTimeout(() => this.scrollToActive(type), 10);
    }
  }

  selectHour(h: string, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.selectedHour = h;
    this.activeDropdown = null;
  }

  selectMinute(m: string, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.selectedMinute = m;
    this.activeDropdown = null;
  }

  selectPeriod(p: string, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.selectedPeriod = p;
    this.activeDropdown = null;
  }

  private scrollToActive(type: string): void {
    const activeEl = this.elementRef.nativeElement.querySelector(
      `.unit-dropdown-list.${type}-list .unit-option.selected`
    );
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  private parseValueToControls(val: string): void {
    if (!val) {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes();
      this.selectedPeriod = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      this.selectedHour = String(h).padStart(2, '0');
      this.selectedMinute = String(m).padStart(2, '0');
      return;
    }

    // Match "01:49 PM" or "1:49 PM"
    const ampmMatch = val.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (ampmMatch) {
      let h = parseInt(ampmMatch[1], 10);
      if (h === 0) h = 12;
      this.selectedHour = String(h).padStart(2, '0');
      this.selectedMinute = ampmMatch[2];
      this.selectedPeriod = ampmMatch[3].toUpperCase();
      return;
    }

    // Match 24h "13:49"
    const parts = val.split(':');
    if (parts.length >= 2) {
      let h = parseInt(parts[0], 10);
      const m = parts[1].slice(0, 2);
      this.selectedPeriod = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      this.selectedHour = String(h).padStart(2, '0');
      this.selectedMinute = m;
    }
  }

  setNow(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    this.selectedPeriod = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    this.selectedHour = String(h).padStart(2, '0');
    this.selectedMinute = String(m).padStart(2, '0');
    this.apply();
  }

  clear(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.value = '';
    this.onChange(this.value);
    this.timeChange.emit(this.value);
    this.closePopup();
  }

  apply(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.value = `${this.selectedHour}:${this.selectedMinute} ${this.selectedPeriod}`;
    this.onChange(this.value);
    this.timeChange.emit(this.value);
    this.closePopup();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closePopup();
    }
  }
}
