import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export type InputCleaner = 'name' | 'digits' | 'pan' | 'code' | 'coordinate' | 'email' | 'text';

export interface FieldRule {
  label: string;
  /** live keystroke cleaner run by applyCleaner() */
  clean?: InputCleaner;
  /** length cap for 'digits' / 'code' / 'text' cleaners (also used for [attr.maxlength]) */
  max?: number;
}

export class ValidationMethods {
static email(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const value = control.value.trim();
    const emailPattern =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(value)) {
      return { invalidEmail: true };
    }

    return null;
  };
}
    preventNumbers(event: any, control?: AbstractControl | null): void {
    const hasNumbers = /[^A-Za-z ]/.test(event.target.value);

    let sanitized = event.target.value
      .replace(/[^A-Za-z ]/g, '') 
      .replace(/\s+/g, ' ')      
      .trimStart()                
      .slice(0, 150);

    event.target.value = sanitized;

    if (control) {
      control.setValue(sanitized, { emitEvent: true });
      if (hasNumbers) {
        control.setErrors({ alphabetOnly: true });
      }
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  preventAlphabets(
    event: any,
    control?: AbstractControl | null
  ): void {

    const sanitized = event.target.value
      .replace(/[^0-9]/g, '')
      .slice(0, 100);

    event.target.value = sanitized;

    if (control) {
      control.setValue(sanitized, {
        emitEvent: true
      });

      control.markAsDirty();
      control.markAsTouched();
    }
  }

  preventAlphabetsCurrency(event: any, control?: AbstractControl | null): void {
    const originalValue = event.target.value;
    let sanitized = originalValue.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }
    if (sanitized.includes('.')) {
      const [integer, decimal] = sanitized.split('.');
      sanitized = integer + '.' + decimal.slice(0, 2);
    }
    sanitized = sanitized.slice(0, 14);

    event.target.value = sanitized;

    if (control) {
      control.setValue(sanitized, { emitEvent: true });

      const hasInvalidChar = /[^0-9.]/.test(originalValue) ||
        (originalValue.match(/\./g) || []).length > 1 ||
        (originalValue.includes('.') && originalValue.split('.')[1].length > 2);

      if (hasInvalidChar) {
        control.setErrors({
          ...(control.errors || {}),
          currencyOnly: true
        });
      } else if (control.hasError('currencyOnly')) {
        const errors = { ...(control.errors || {}) };
        delete errors['currencyOnly'];
        control.setErrors(Object.keys(errors).length ? errors : null);
      }

      control.markAsDirty();
      control.markAsTouched();
    }
  }

  preventEmail(event: any, control?: AbstractControl | null): void {
    const hasInvalidChar = /[^a-zA-Z0-9@._-]/.test(event.target.value);
    const sanitized = event.target.value
      .replace(/[^a-zA-Z0-9@._-]/g, '');

    event.target.value = sanitized;

    if (control) {
      control.setValue(sanitized, { emitEvent: true });
      if (hasInvalidChar) {
        control.setErrors({ email: true });
      }
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  preventName(event: any, control?: AbstractControl | null): void {

    const originalValue = event.target.value;
    const hasInvalidChar = /[^A-Za-z.\s]/.test(originalValue);

    let value = originalValue
      .replace(/[^A-Za-z.\s]/g, '') 
      .replace(/\s+/g, ' ')         
      .replace(/^\s+/, '')          
      .replace(/\.{2,}/g, '.')      
      .replace(/^\./, '')           
      .replace(/\s*\.\s*/g, '.')    
      .slice(0, 150);
    value = value
      .split(/([ .])/)
      .map((part: any) =>
        part === ' ' || part === '.'
          ? part
          : part
            ? part.charAt(0).toUpperCase() + part.substring(1).toLowerCase()
            : ''
      )
      .join('');

    event.target.value = value;

    if (control) {
      control.setValue(value, { emitEvent: true });

      if (hasInvalidChar) {
        control.setErrors({
          ...(control.errors || {}),
          nameFormat: true
        });
      } else if (control.hasError('nameFormat')) {
        const errors = { ...(control.errors || {}) };
        delete errors['nameFormat'];
        control.setErrors(Object.keys(errors).length ? errors : null);
      }

      control.markAsDirty();
      control.markAsTouched();
    }
  }

  preventPANInput(event: any, control?: AbstractControl | null): void {
    const originalValue = event.target.value;
    const sanitized = originalValue
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 10);

    event.target.value = sanitized;

    if (control) {
      control.setValue(sanitized, { emitEvent: true });
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  preventUppercaseInput(event: any, control?: AbstractControl | null): void {
    const originalValue = event.target.value;
    const sanitized = originalValue.toUpperCase();

    event.target.value = sanitized;

    if (control) {
      control.setValue(sanitized, { emitEvent: true });
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  preventGSTInput(event: any, control?: AbstractControl | null): void {
    const originalValue = event.target.value;
    const sanitized = originalValue
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 15);

    event.target.value = sanitized;

    if (control) {
      control.setValue(sanitized, { emitEvent: true });
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  preventSpecialCharacter(event: any, control?: AbstractControl | null): void {
    const originalValue = event.target.value;
    const sanitized = originalValue
      .replace(/[^A-Za-z0-9 .]/g, '')
      .slice(0, 50);

    event.target.value = sanitized;

    if (control) {
      control.setValue(sanitized, { emitEvent: false });
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  preventSpecialCharacterWithSlashAndHyphen(
  event: any,
  control?: AbstractControl | null
): void {
  const originalValue = event.target.value;

  const sanitized = originalValue
    .replace(/[^A-Za-z0-9 .\/-]/g, '')
    .slice(0, 50);

  event.target.value = sanitized;

  if (control) {
    control.setValue(sanitized, { emitEvent: false });
    control.markAsDirty();
    control.markAsTouched();
  }
}


  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      return emailPattern.test(control.value)
        ? null
        : { email: true };
    };
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

      const value = control.value;

      if (!value) {
        return null;
      }


      if (!/^[6-9]/.test(value)) {
        return {
          indianPhoneNumber: true
        };
      }


      if (!/^[0-9]{10}$/.test(value)) {
        return {
          phoneNumber: true
        };
      }

      return null;
    };
  }

  static currencyNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      return /^[0-9]+(\.[0-9]{1,2})?$/.test(control.value)
        ? null
        : { currencyOnly: true };
    };
  }
  static panNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      const value = control.value.toUpperCase();

      if (control.value !== value) {
        control.setValue(value, { emitEvent: false });
      }

      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)
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

  static loanNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      return /^[A-Za-z0-9]+$/.test(control.value)
        ? null
        : { loanNumber: true };
    };
  }


  preventAgeInput(event: any, control?: AbstractControl | null): void {
    const sanitized = event.target.value
      .replace(/[^0-9]/g, '')
      .slice(0, 2);

    event.target.value = sanitized;

    if (control) {
      control.setValue(sanitized, { emitEvent: true });
      control.markAsDirty();
      control.markAsTouched();
    }
  }

  static nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      const value = control.value.trim();
      const pattern = /^[A-Za-z]+([ .][A-Za-z]+)*$/;

      return pattern.test(value)
        ? null
        : { nameFormat: true };
    };
  }
  static ifscValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      const value = control.value.toUpperCase().trim();

      if (control.value !== value) {
        control.setValue(value, { emitEvent: false });
      }
      const pattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;

      if (value.length !== 11) {
        return { ifscFormat: true };
      }

      return pattern.test(value)
        ? null
        : { ifscFormat: true };
    };
  }
  isString(val: any): boolean {
    return typeof val === 'string';
  }

  getFileName(val: any): string {
    if (!val) return '';
    if (val instanceof File) {
      return val.name;
    }
    if (typeof val === 'string') {
      const parts = val.split('/');
      return parts[parts.length - 1];
    }
    return '';
  }

  static numberOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      return /^[0-9]+$/.test(control.value)
        ? null
        : { numberOnly: true };
    };
  }

  static ifscCode(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      const value = control.value.toUpperCase();
      return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)
        ? null
        : { ifscCode: true };
    };
  }

  static accountNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!control.value) {
        return null;
      }

      const value = control.value.trim();
      return /^[0-9]{9,18}$/.test(value)
        ? null
        : { accountNumber: true };
    };
  }
}
