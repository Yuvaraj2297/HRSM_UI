import {
  Directive,
  DoCheck,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  booleanAttribute
} from '@angular/core';

import { NgControl } from '@angular/forms';
import { VALIDATION_MESSAGES } from '../../shared/validation/validation-messages';

@Directive({
  selector: '[appInputValidator]',
  standalone: true
})
export class InputValidator implements OnInit, DoCheck {

  @Input() labelName: string = '';
  @Input() modeType: string = '';
  @Input({ transform: booleanAttribute }) isAbsolute: boolean = true;

  errorElement!: HTMLElement;
  tickElement!: HTMLElement;
  constructor(
    private el: ElementRef,
    private control: NgControl,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {

    const isDateField =
      this.el.nativeElement.hasAttribute('appCalendarDatepicker');

    this.errorElement =
      this.renderer.createElement('small');

    this.renderer.addClass(
      this.errorElement,
      'text-danger'
    );

    if (this.isAbsolute) {
      this.renderer.setStyle(
        this.el.nativeElement.parentNode,
        'position',
        'relative'
      );

      this.renderer.setStyle(
        this.errorElement,
        'position',
        'absolute'
      );

      this.renderer.setStyle(
        this.errorElement,
        'z-index',
        '10'
      );

      this.renderer.setStyle(
        this.errorElement,
        'white-space',
        'nowrap'
      );

      this.updateErrorPosition();
    } else {
      this.renderer.setStyle(
        this.errorElement,
        'display',
        'block'
      );

      this.renderer.setStyle(
        this.errorElement,
        'padding-top',
        '5px'
      );
    }

    this.renderer.appendChild(
      this.el.nativeElement.parentNode,
      this.errorElement
    );
    this.tickElement = this.renderer.createElement('i');

    this.renderer.addClass(
      this.tickElement,
      'ti'
    );

    this.renderer.addClass(
      this.tickElement,
      'ti-circle-check'
    );

    this.renderer.setStyle(
      this.tickElement,
      'position',
      'absolute'
    );

    this.renderer.setStyle(
      this.tickElement,
      'right',
      '15px'
    );

    this.renderer.setStyle(
      this.tickElement,
      'top',
      '48px'
    );

    this.renderer.setStyle(
      this.tickElement,
      'transform',
      'translateY(-50%)'
    );

    this.renderer.setStyle(
      this.tickElement,
      'color',
      '#28a745'
    );

    this.renderer.setStyle(
      this.tickElement,
      'display',
      'none'
    );

    this.renderer.appendChild(
      this.el.nativeElement.parentNode,
      this.tickElement
    );
    this.renderer.listen(
      this.el.nativeElement,
      'input',
      () => {

        const formControl = this.control.control;
        if (isDateField) {
          this.renderer.setStyle(
            this.tickElement,
            'display',
            'none'
          );
          return;
        }

        if (formControl?.valid) {

          this.renderer.setStyle(
            this.tickElement,
            'display',
            'block'
          );

        } else {

          this.renderer.setStyle(
            this.tickElement,
            'display',
            'none'
          );
        }
      }
    );


    this.renderer.listen(
      this.el.nativeElement,
      'blur',
      () => {
        this.tickElement.style.display = 'none';
      }
    );

  }
  private getMessage(
    template: string,
    value?: number
  ): string {

    return template
      .replace('{field}', this.labelName)
      .replace('{value}', String(value ?? ''));
  }

  ngDoCheck(): void {
    this.checkValidation();
  }

  checkValidation() {
    const formControl = this.control.control;

    if (!formControl) {
      return;
    }
    if (this.modeType === 'view') {
      this.errorElement.innerText = '';
      this.tickElement.style.display = 'none';
      return;
    }
    if (!formControl.dirty && !formControl.touched) {
      this.errorElement.innerText = '';
      this.tickElement.style.display = 'none';
      return;
    }
    if (formControl.valid) {
      this.errorElement.innerText = '';
      return;
    }

    this.tickElement.style.display = 'none';
    this.errorElement.innerText = '';
    const errors = formControl.errors;
    let errorMessage = '';

    if (errors?.['required']) {
      errorMessage = this.getMessage(VALIDATION_MESSAGES.required);
    } else if (errors?.['minlength']) {
      errorMessage = this.getMessage(
        VALIDATION_MESSAGES.minlength,
        errors['minlength'].requiredLength
      );
    } else if (errors?.['maxlength']) {
      errorMessage = this.getMessage(VALIDATION_MESSAGES.maxlength);
    } else if (errors?.['email']) {
      errorMessage = this.getMessage(VALIDATION_MESSAGES.email);
    } else if (errors?.['invalidFileType']) {
      errorMessage = `Only image files (JPG, JPEG, PNG) are allowed`;
    } else if (errors?.['alphabetOnly']) {
      errorMessage = this.getMessage(VALIDATION_MESSAGES.alphabetOnly);
    } else if (errors?.['phoneNumber']) {
      errorMessage = this.getMessage(
        VALIDATION_MESSAGES.phoneNumber
      );
    } else if (errors?.['indianPhoneNumber']) {
      errorMessage = this.getMessage(
        VALIDATION_MESSAGES.indianPhoneNumber
      );
    } else if (errors?.['panNumber']) {
      errorMessage = VALIDATION_MESSAGES.panNumber;
    } else if (errors?.['postalNumber']) {
      errorMessage = VALIDATION_MESSAGES.postalNumber;
    } else if (errors?.['invalidFormat']) {
      errorMessage = this.getMessage(VALIDATION_MESSAGES.invalidFormat);
    } else if (errors?.['currencyOnly']) {
      errorMessage = this.getMessage(VALIDATION_MESSAGES.currencyOnly);
    } else if (errors?.['ifscFormat']) {
      errorMessage = this.getMessage(VALIDATION_MESSAGES.ifscFormat);
    } else if (errors?.['accountNumber']) {
      errorMessage = VALIDATION_MESSAGES.accountNumber;
    }

    if (errorMessage) {
      this.updateErrorPosition();
      this.errorElement.innerHTML = `<i class="ti ti-exclamation-circle me-1"></i>${errorMessage}`;
    } else {
      this.errorElement.innerText = '';
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.errorElement?.innerText) {
      this.updateErrorPosition();
    }
  }

  private updateErrorPosition(): void {
    if (!this.isAbsolute || !this.errorElement) {
      return;
    }

    const inputEl = this.el.nativeElement as HTMLElement;
    const parentEl = inputEl.parentNode as HTMLElement;
    if (!parentEl) {
      return;
    }
    let leftPosition = inputEl.offsetLeft;
    if (leftPosition === 0 && parentEl.getBoundingClientRect) {
      const inputRect = inputEl.getBoundingClientRect();
      const parentRect = parentEl.getBoundingClientRect();
      const diff = inputRect.left - parentRect.left;
      if (diff > 0) {
        leftPosition = diff;
      }
    }

    this.renderer.setStyle(
      this.errorElement,
      'left',
      `${leftPosition}px`
    );

    if (inputEl.offsetHeight > 0) {
      const topPosition = inputEl.offsetTop + inputEl.offsetHeight + 2;
      this.renderer.setStyle(
        this.errorElement,
        'top',
        `${topPosition}px`
      );
    }
  }
}