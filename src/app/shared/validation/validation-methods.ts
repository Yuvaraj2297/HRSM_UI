import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ValidationMethods {

  preventNumbers(event: any, control?: AbstractControl | null): void {
    const sanitized = event.target.value
      .replace(/[^A-Za-z ]/g, '')
      .slice(0, 150);

    event.target.value = sanitized;

    if (control) {
      control.setValue(sanitized, { emitEvent: true });
      control.markAsDirty();
      control.markAsTouched();
    }
  }

 preventAlphabets(event: any, control?: AbstractControl | null): void {
    const sanitized = event.target.value
      .replace(/[^0-9]/g, '')
      .slice(0, 10);

    event.target.value = sanitized;

    if (control) {
      control.setValue(sanitized, { emitEvent: true });
      control.markAsDirty();
      control.markAsTouched();
    }
  }

   preventEmail(event: any, control?: AbstractControl | null): void {
    const sanitized = event.target.value
      .replace(/[^a-zA-Z0-9@._-]/g, '');

    event.target.value = sanitized;

    if (control) {
      control.setValue(sanitized, { emitEvent: true });
      control.markAsDirty();
      control.markAsTouched();
    }
  }
  static alphabetOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      if (/\d/.test(control.value)) {
        return { alphabetOnly: true };
      }

      if (!/^[A-Za-z.\s]+$/.test(control.value)) {
        return { invalidFormat: true };
      }

      return null;
    };
  }

  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      return /^[0-9]{10}$/.test(control.value)
        ? null
        : { phoneNumber: true };
    };
  }

  static panNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(control.value)
        ? null
        : { panNumber: true };
    };
  }

  static postalNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      return /^[A-Z]{2}[0-9]{9}[A-Z]{2}$/.test(control.value)
    ? null
    : { postalNumber: true };
    };
  }
}