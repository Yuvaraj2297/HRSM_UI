import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  Input,
  OnChanges,
  SimpleChanges,
  forwardRef,
  DoCheck
} from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appCalendarDatepicker]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CalendarDatepickerDirective),
      multi: true
    }
  ]
})
export class CalendarDatepickerDirective
  implements OnInit, OnDestroy, OnChanges, Validator, DoCheck {

  private calendar!: HTMLElement;
  private icon!: HTMLElement;
  private errorMessage!: HTMLElement;
  private resizeObserver?: ResizeObserver;

  private isCalendarOpen = false;

  private static openedCalendar: CalendarDatepickerDirective | null = null;

  months = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec'
  ];

  days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  today = new Date();

  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();

  selectedDate: Date | null = null;

  @Input() minDate?: string | Date | null = null;
  @Input() maxDate?: string | Date | null = null;

  private onChangeFn?: () => void;

  registerOnValidatorChange(fn: () => void): void {
    this.onChangeFn = fn;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['minDate'] || changes['maxDate']) {
      if (this.isCalendarOpen) {
        this.render();
      }
      const current = this.el.nativeElement.value;
      if (current && current.length === 10) {
        this.validateDate(current);
      } else {
        this.clearValidationError();
      }
    }
    if (this.onChangeFn) {
      this.onChangeFn();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const value = control.value;

    if (value.length !== 10) return { invalidDate: true };
    const [ddStr, mmStr, yyStr] = value.split(/[-\/]/);
    if (!yyStr || !/^\d{4}$/.test(yyStr)) return { invalidYear: true };

    const dd = Number(ddStr);
    const mm = Number(mmStr);
    const yy = Number(yyStr);
    const date = new Date(yy, mm - 1, dd);

    const valid =
      date.getDate() === dd &&
      date.getMonth() === mm - 1 &&
      date.getFullYear() === yy;
    if (!valid) return { invalidCalendarDate: true };

    const pMin = this.parseDate(this.minDate);
    if (pMin && date < pMin) {
      return { minDate: { requiredMin: this.formatDate(pMin), actual: value } };
    }

    const pMax = this.parseDate(this.maxDate);
    if (pMax && date > pMax) {
      return { maxDate: { requiredMax: this.formatDate(pMax), actual: value } };
    }

    return null;
  }

  private parseDate(d: string | Date | null | undefined): Date | null {
    if (!d) return null;

    if (d instanceof Date) {
      return isNaN(d.getTime())
        ? null
        : new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    const match = String(d).trim().match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (!match) return null;

    const [, dd, mm, yy] = match;
    const date = new Date(+yy, +mm - 1, +dd);

    return date.getDate() === +dd && date.getMonth() === +mm - 1 ? date : null;
  }

  private formatDate(d: Date): string {
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
  ) { }
  ngDoCheck(): void {
    const value = this.el.nativeElement.value;

    if (!value && this.selectedDate) {
      this.selectedDate = null;
      this.clearValidationError();
    }

    if (this.icon) {
      const isDisabled = this.el.nativeElement.disabled || this.el.nativeElement.readOnly;
      if (isDisabled) {
        this.renderer.setStyle(this.icon, 'pointer-events', 'none');
        this.renderer.setStyle(this.icon, 'cursor', 'not-allowed');
        this.renderer.setStyle(this.icon, 'opacity', '0.5');
        if (this.isCalendarOpen) {
          this.hideCalendar();
        }
      } else {
        this.renderer.setStyle(this.icon, 'pointer-events', 'auto');
        this.renderer.setStyle(this.icon, 'cursor', 'pointer');
        this.renderer.removeStyle(this.icon, 'opacity');
      }
    }
  }

  ngOnInit(): void {

    this.renderer.setAttribute(this.el.nativeElement, 'maxlength', '10');
    this.renderer.setAttribute(this.el.nativeElement, 'autocomplete', 'off');
    this.renderer.setAttribute(this.el.nativeElement, 'aria-invalid', 'false');

    this.createIcon();
    this.createCalendar();
    this.createErrorMessage();
  }

  ngOnDestroy(): void {

    if (CalendarDatepickerDirective.openedCalendar === this) {
      CalendarDatepickerDirective.openedCalendar = null;
    }

    this.resizeObserver?.disconnect();
    this.calendar?.remove();
    this.icon?.remove();
    this.errorMessage?.remove();
  }
  private createIcon(): void {

    const parent = this.el.nativeElement.parentElement;
    if (!parent) return;

    this.renderer.setStyle(parent, 'position', 'relative');

    this.icon = this.renderer.createElement('i');

    this.renderer.addClass(this.icon, 'ti');
    this.renderer.addClass(this.icon, 'ti-calendar-event');
    this.renderer.addClass(this.icon, 'calendar-picker-icon');

    parent.appendChild(this.icon);
    this.positionIcon();

    // The input can still measure as 0x0 the instant this directive
    // initializes (e.g. inside a modal that hasn't finished opening yet),
    // which pins the icon to the top of the field. A ResizeObserver
    // catches the moment the input actually gets its real layout box
    // (and any later layout shift) and repositions the icon correctly -
    // no reliance on a lucky window resize event.
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.positionIcon());
      this.resizeObserver.observe(this.el.nativeElement);
    }

    this.icon.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      if (this.el.nativeElement.disabled || this.el.nativeElement.readOnly) {
        return;
      }
      this.toggleCalendar();
    });
  }

  private positionIcon(): void {
    if (!this.icon) return;
    const input = this.el.nativeElement;
    const top = input.offsetTop + input.offsetHeight / 2;
    this.renderer.setStyle(this.icon, 'top', `${top}px`);
    this.renderer.setStyle(this.icon, 'transform', 'translateY(-50%)');
  }
  private createCalendar(): void {

    this.calendar = this.renderer.createElement('div');

    this.renderer.addClass(this.calendar, 'common-calendar');
    this.renderer.setStyle(this.calendar, 'display', 'none');

    document.body.appendChild(this.calendar);

    this.render();
  }

  private createErrorMessage(): void {

    const parent = this.el.nativeElement.parentElement;
    if (!parent) return;

    this.errorMessage = this.renderer.createElement('small');
    this.renderer.addClass(this.errorMessage, 'calendar-date-error');
    this.renderer.setStyle(this.errorMessage, 'display', 'none');
    this.renderer.setStyle(this.errorMessage, 'color', 'var(--danger)');
    this.renderer.setStyle(this.errorMessage, 'marginTop', '4px');
    this.renderer.setStyle(this.errorMessage, 'fontSize', '12px');
    this.renderer.setProperty(this.errorMessage, 'textContent', 'Invalid date. Use DD/MM/YYYY.');

    parent.appendChild(this.errorMessage);
  }

  private toggleCalendar(): void {
    if (this.el.nativeElement.disabled || this.el.nativeElement.readOnly) {
      if (this.isCalendarOpen) this.hideCalendar();
      return;
    }
    this.isCalendarOpen ? this.hideCalendar() : this.showCalendar();
  }

  private syncValueToCalendar(): void {
    const val = this.el.nativeElement.value;
    const parsed = this.parseDate(val);
    if (parsed) {
      this.selectedDate = parsed;
      this.currentMonth = parsed.getMonth();
      this.currentYear = parsed.getFullYear();
    } else {
      this.selectedDate = null;
      this.currentMonth = this.today.getMonth();
      this.currentYear = this.today.getFullYear();
    }
  }

private showCalendar(): void {
  if (
    this.el.nativeElement.disabled ||
    this.el.nativeElement.readOnly
  ) {
    return;
  }

  // Close any other opened calendar
  if (
    CalendarDatepickerDirective.openedCalendar &&
    CalendarDatepickerDirective.openedCalendar !== this
  ) {
    CalendarDatepickerDirective.openedCalendar.hideCalendar();
  }

  this.syncValueToCalendar();
  this.render();

  const rect = this.el.nativeElement.getBoundingClientRect();

  const targetWidth = Math.max(rect.width, 320);

  // IMPORTANT:
  // Calendar is appended to body, so use fixed positioning.
  this.calendar.style.setProperty(
    'width',
    `${targetWidth}px`,
    'important'
  );

  this.calendar.style.setProperty(
    '--calendar-width',
    String(targetWidth)
  );

  // Bootstrap modal/backdrop compatibility
  this.calendar.style.setProperty(
    'position',
    'fixed',
    'important'
  );

  this.calendar.style.setProperty(
    'z-index',
    '99999',
    'important'
  );

  this.calendar.style.setProperty(
    'visibility',
    'hidden',
    'important'
  );

  // IMPORTANT:
  // !important prevents common-calendar CSS from keeping it hidden
  this.calendar.style.setProperty(
    'display',
    'block',
    'important'
  );

  // Force browser to calculate dimensions
  const calendarHeight = this.calendar.offsetHeight;
  const calendarWidth = this.calendar.offsetWidth;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Since position is fixed, DO NOT use scrollX / scrollY
  let left = rect.left;
  let top = rect.bottom + 8;

  // Keep inside right side of screen
  if (left + calendarWidth > viewportWidth - 10) {
    left = viewportWidth - calendarWidth - 10;
  }

  // Keep inside left side
  if (left < 10) {
    left = 10;
  }

  // Open above input if there isn't enough space below
  if (top + calendarHeight > viewportHeight - 10) {
    top = rect.top - calendarHeight - 8;
  }

  // Prevent going above viewport
  if (top < 10) {
    top = 10;
  }

  this.calendar.style.setProperty(
    'left',
    `${left}px`,
    'important'
  );

  this.calendar.style.setProperty(
    'top',
    `${top}px`,
    'important'
  );

  this.calendar.style.setProperty(
    'visibility',
    'visible',
    'important'
  );

  this.isCalendarOpen = true;

  CalendarDatepickerDirective.openedCalendar = this;
}

private hideCalendar(): void {
  this.calendar.style.setProperty(
    'display',
    'none',
    'important'
  );

  this.calendar.style.setProperty(
    'visibility',
    'hidden',
    'important'
  );

  this.isCalendarOpen = false;

  if (CalendarDatepickerDirective.openedCalendar === this) {
    CalendarDatepickerDirective.openedCalendar = null;
  }
}
  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isCalendarOpen) this.hideCalendar();
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    if (this.calendar.contains(event.target as Node)) return;
    if (this.isCalendarOpen) this.hideCalendar();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.hideCalendar();
    this.positionIcon();
  }
  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {

    const target = event.target as Node;

    if (
      !this.calendar.contains(target) &&
      !this.icon.contains(target)
    ) {
      this.hideCalendar();
    } else {
      const monthSelect = this.calendar.querySelector('#monthSelect') as HTMLElement;
      const yearSelect = this.calendar.querySelector('#yearSelect') as HTMLElement;
      if (monthSelect && !monthSelect.contains(target)) {
        monthSelect.classList.remove('open');
      }
      if (yearSelect && !yearSelect.contains(target)) {
        yearSelect.classList.remove('open');
      }
    }
  }
  @HostListener('input')
  onInput(): void {

    let value = this.el.nativeElement.value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }

    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }

    this.el.nativeElement.value = value.substring(0, 10);

    const parts = value.split(/[-\/]/);

    if (!value || value.length < 10) {
      this.clearValidationError();
    }
    if (parts[0] && Number(parts[0]) > 31) {
      this.el.nativeElement.value = '';
      this.setValidationError('Invalid date. Day must be between 01 and 31.');
      return;
    }
    if (parts[1] && Number(parts[1]) > 12) {
      this.el.nativeElement.value = '';
      this.setValidationError('Invalid date. Month must be between 01 and 12.');
      return;
    }

    if (value.length === 10) {
      this.validateDate(value);
      this.syncValueToCalendar();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {

    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

    if (allowed.includes(e.key)) return;

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  }
  private validateDate(value: string): void {

    const [ddStr, mmStr, yyStr] = value.split(/[-\/]/);
    if (!yyStr || !/^\d{4}$/.test(yyStr)) {
      this.setValidationError('Invalid date. Year must be 4 digits.');
      return;
    }

    const dd = Number(ddStr);
    const mm = Number(mmStr);
    const yy = Number(yyStr);
    if (yy < 1900 || yy > 2100) {
      this.setValidationError('Invalid date. Year must be between 1900 and 2100.');

      return;
    }
    if (dd < 1 || dd > 31 || mm < 1 || mm > 12) {
      this.setValidationError('Invalid date. Please enter a valid DD/MM/YYYY value.');
      return;
    }

    const date = new Date(yy, mm - 1, dd);

    const valid =
      date.getDate() === dd &&
      date.getMonth() === mm - 1 &&
      date.getFullYear() === yy;

    if (!valid) {
      this.setValidationError('Invalid date. Please enter a real calendar date.');
      return;
    }

    const pMin = this.parseDate(this.minDate);
    if (pMin && date < pMin) {
      this.setValidationError(`Date cannot be before ${this.formatDate(pMin)}.`);
      return;
    }

    const pMax = this.parseDate(this.maxDate);
    if (pMax && date > pMax) {
      this.setValidationError(`Date cannot be after ${this.formatDate(pMax)}.`);
      return;
    }

    this.clearValidationError();
  }

  private setValidationError(message: string): void {

    this.el.nativeElement.classList.add('date-error');
    this.el.nativeElement.setCustomValidity(message);
    this.renderer.setAttribute(this.el.nativeElement, 'aria-invalid', 'true');

    if (this.errorMessage) {
      this.renderer.setProperty(this.errorMessage, 'textContent', message);
      this.renderer.setStyle(this.errorMessage, 'display', 'block');
    }
  }

  private clearValidationError(): void {

    this.el.nativeElement.classList.remove('date-error');
    this.el.nativeElement.setCustomValidity('');
    this.renderer.setAttribute(this.el.nativeElement, 'aria-invalid', 'false');

    if (this.errorMessage) {
      this.renderer.setStyle(this.errorMessage, 'display', 'none');
    }
  }
  private render(): void {

    const first = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const dim = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const prev = new Date(this.currentYear, this.currentMonth, 0).getDate();

    const years = Array.from({ length: 151 }, (_, i) => 1950 + i);

    let html = '';

    this.days.forEach(d => {
      html += `<div class="dow">${d}</div>`;
    });

    for (let i = first - 1; i >= 0; i--) {
      html += `<div class="day muted">${prev - i}</div>`;
    }

    for (let d = 1; d <= dim; d++) {

      const isToday =
        d === this.today.getDate() &&
        this.currentMonth === this.today.getMonth() &&
        this.currentYear === this.today.getFullYear();

      const isSelected =
        this.selectedDate &&
        d === this.selectedDate.getDate() &&
        this.currentMonth === this.selectedDate.getMonth() &&
        this.currentYear === this.selectedDate.getFullYear();

      const cellDate = new Date(this.currentYear, this.currentMonth, d);
      let disabled = false;

      const pMin = this.parseDate(this.minDate);
      if (pMin && cellDate < pMin) disabled = true;

      const pMax = this.parseDate(this.maxDate);
      if (pMax && cellDate > pMax) disabled = true;

      html += `
        <div class="day ${isToday ? 'today' : ''} ${isSelected ? 'sel' : ''}" 
             data-day="${d}" 
             ${disabled ? 'data-disabled="true" style="opacity: 0.4; cursor: not-allowed; background: transparent; color: var(--text-muted);"' : ''}>
          ${d}
        </div>`;
    }

    const rem = (7 - (first + dim) % 7) % 7;

    for (let d = 1; d <= rem; d++) {
      html += `<div class="day muted">${d}</div>`;
    }

    this.calendar.innerHTML = `
      <div class="hdr">

        <button type="button" id="prevBtn">&#8249;</button>

        <div class="calendar-custom-select" id="monthSelect">
          <div class="calendar-select-trigger">${this.months[this.currentMonth]}</div>
          <div class="calendar-select-options">
            ${this.months.map((m, i) =>
      `<div class="calendar-select-option ${i === this.currentMonth ? 'selected' : ''}" data-value="${i}">${m}</div>`
    ).join('')}
          </div>
        </div>

        <div class="calendar-custom-select" id="yearSelect">
          <div class="calendar-select-trigger">${this.currentYear}</div>
          <div class="calendar-select-options">
            ${years.map(y =>
      `<div class="calendar-select-option ${y === this.currentYear ? 'selected' : ''}" data-value="${y}">${y}</div>`
    ).join('')}
          </div>
        </div>

        <button type="button" id="nextBtn">&#8250;</button>

      </div>

      <div class="grid">
        ${html}
      </div>
    `;

    this.bindEvents();
  }
  private bindEvents(): void {

    const prev = this.calendar.querySelector('#prevBtn') as HTMLButtonElement;
    const next = this.calendar.querySelector('#nextBtn') as HTMLButtonElement;
    const monthSelect = this.calendar.querySelector('#monthSelect') as HTMLElement;
    const yearSelect = this.calendar.querySelector('#yearSelect') as HTMLElement;
    const monthTrigger = monthSelect.querySelector('.calendar-select-trigger') as HTMLElement;
    const yearTrigger = yearSelect.querySelector('.calendar-select-trigger') as HTMLElement;

    prev.onclick = (e) => {
      e.stopPropagation();

      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }

      this.render();
    };

    next.onclick = (e) => {
      e.stopPropagation();

      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }

      this.render();
    };

    monthTrigger.onclick = (e) => {
      e.stopPropagation();
      const open = monthSelect.classList.contains('open');
      monthSelect.classList.toggle('open', !open);
      yearSelect.classList.remove('open');
      if (!open) {
        const selectedOpt = monthSelect.querySelector('.calendar-select-option.selected') as HTMLElement;
        if (selectedOpt) {
          selectedOpt.scrollIntoView({ block: 'nearest' });
        }
      }
    };

    yearTrigger.onclick = (e) => {
      e.stopPropagation();
      const open = yearSelect.classList.contains('open');
      yearSelect.classList.toggle('open', !open);
      monthSelect.classList.remove('open');
      if (!open) {
        const selectedOpt = yearSelect.querySelector('.calendar-select-option.selected') as HTMLElement;
        if (selectedOpt) {
          selectedOpt.scrollIntoView({ block: 'nearest' });
        }
      }
    };

    monthSelect.querySelectorAll('.calendar-select-option').forEach((opt: any) => {
      opt.onclick = (e: MouseEvent) => {
        e.stopPropagation();
        this.currentMonth = +opt.dataset.value;
        this.render();
      };
    });

    yearSelect.querySelectorAll('.calendar-select-option').forEach((opt: any) => {
      opt.onclick = (e: MouseEvent) => {
        e.stopPropagation();
        this.currentYear = +opt.dataset.value;
        this.render();
      };
    });

    this.calendar.querySelectorAll('.day[data-day]').forEach((el: any) => {

      el.onclick = (e: MouseEvent) => {
        e.stopPropagation();

        if (el.dataset.disabled === "true") {
          return;
        }

        const d = Number(el.dataset.day);

        this.selectedDate = new Date(
          this.currentYear,
          this.currentMonth,
          d
        );

        this.el.nativeElement.value =
          `${String(d).padStart(2, '0')}/` +
          `${String(this.currentMonth + 1).padStart(2, '0')}/` +
          `${this.currentYear}`;

        this.el.nativeElement.dispatchEvent(
          new Event('input', { bubbles: true })
        );
        this.el.nativeElement.dispatchEvent(
          new Event('change', { bubbles: true })
        );

        this.clearValidationError();
        this.hideCalendar();
        this.render();
      };
    });
  }
}