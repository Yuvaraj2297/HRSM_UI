import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CalendarDatepickerDirective } from '../../common/directives/datepicker';

declare var bootstrap: any;

// =============================================================
// TYPES  (everything the parent can pass)
// =============================================================

export type ModalFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'number'
  | 'textarea'
  | 'select'
  | 'date'
  | 'file'
  | 'info'; // static note box — no form control, `label` is the note text

export interface ModalSelectOption {
  label: string;
  value: any;
}

export interface ModalField {
  key: string; // form control name / key in the emitted values
  label: string;
  type: ModalFieldType;
  placeholder?: string;
  required?: boolean;
  labelNote?: string; // small text after the label, e.g. '(optional)'
  labelIcon?: string; // icon class shown before the label text, e.g. 'bi bi-building'
  col?: number; // bootstrap columns (1-12). default: 6, textarea/file = 12
  defaultValue?: any;

  // select
  options?: ModalSelectOption[];
  filter?: boolean;
  showClear?: boolean;

  // date
  dateFormat?: string; // default 'dd-mm-yy'

  // textarea
  rows?: number;

  // number
  min?: number;
  max?: number;

  // file
  accept?: string; // e.g. '.pdf,.docx'
  maxSizeMB?: number; // default 10
  hint?: string; // small grey text inside the dropzone
}

export interface ModalSaveEvent {
  mode: 'add' | 'edit';
  /** form values. In edit mode the original `data` keys (e.g. id) are kept. */
  values: Record<string, any>;
  /** picked files, by field key (file name is also in values[key]) */
  files: Record<string, File>;
}

@Component({
  selector: 'app-reuse-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule, DatePickerModule, CalendarDatepickerDirective],
  templateUrl: './reuse-model.html',
  styleUrl: './reuse-model.scss',
})
export class ReuseModal implements OnChanges, AfterViewInit {
  private fb = inject(FormBuilder);

  // =========================================================
  // INPUTS  (label, type, placeholder, buttons — all from parent)
  // =========================================================

  /** Form definition: label, type, placeholder, options ... */
  @Input() fields: ModalField[] = [];

  /** Header title in add mode */
  @Input() title = 'Add';

  /** Header title in edit mode (falls back to `title`) */
  @Input() editTitle = '';

  /** Primary button text */
  @Input() saveLabel = 'Save';
  @Input() updateLabel = 'Update';

  /** Primary button icon (tabler class), '' for none */
  @Input() submitIcon = '';

  @Input() cancelLabel = 'Cancel';

  /**
   * Optional check run on Save, after the field validators pass.
   * Return an error message to keep the modal open (e.g. "Name already exists"),
   * or null to save. Pages that don't pass it behave as before.
   */
  @Input() validate?: (event: ModalSaveEvent) => string | null;

  // =========================================================
  // OUTPUTS
  // =========================================================

  @Output() saved = new EventEmitter<ModalSaveEvent>();
  @Output() cancelled = new EventEmitter<void>();

  // =========================================================
  // STATE
  // =========================================================

  @ViewChild('modalRoot') modalRoot!: ElementRef;

  form: FormGroup = this.fb.group({});

  mode: 'add' | 'edit' = 'add';

  private data: Record<string, any> | null = null;

  /** Message from `validate`, shown above the footer */
  formError: string | null = null;

  // file fields
  selectedFiles: Record<string, File | null> = {};
  draggingKey: string | null = null;

  // =========================================================
  // LIFECYCLE
  // =========================================================

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields']) {
      this.buildForm();
    }
  }

  ngAfterViewInit(): void {
    // create the Bootstrap instance up-front (browser only)
    this.bsModal();
  }

  /**
   * Bootstrap instance for the modal element that is in the DOM *now*.
   * Resolved on every open/close instead of cached once: after SSR hydration
   * the element captured in ngAfterViewInit can be replaced, and a cached
   * instance then shows/hides a detached copy — the visible popup never closes.
   */
  private bsModal(): any {
    const el = this.modalRoot?.nativeElement;
    if (!el || typeof bootstrap === 'undefined') return null;

    return bootstrap.Modal.getOrCreateInstance(el, {
      backdrop: 'static',
      keyboard: false,
      focus: false, // Bootstrap's focus trap blocks PrimeNG panels (they live in <body>)
    });
  }

  /** Bound in the template, so it is always on the live element */
  onHidden(): void {
    this.resetForm();
  }

  // =========================================================
  // FORM
  // =========================================================

  private emptyValue(f: ModalField): any {
    if (f.defaultValue !== undefined) return f.defaultValue;

    return f.type === 'select' || f.type === 'date' || f.type === 'number' ? null : '';
  }

  private buildForm(): void {
    const controls: Record<string, any> = {};

    for (const f of this.fields) {
      if (f.type === 'info') continue; // static note — not a real form field

      const validators: ValidatorFn[] = [];

      // file fields keep the file NAME in the control, so `required` works for them too
      if (f.required) validators.push(Validators.required);
      if (f.type === 'email') validators.push(Validators.email);
      if (f.type === 'number' && f.min !== undefined) validators.push(Validators.min(f.min));
      if (f.type === 'number' && f.max !== undefined) validators.push(Validators.max(f.max));

      controls[f.key] = [this.emptyValue(f), validators];
    }

    this.form = this.fb.group(controls);
    this.selectedFiles = {};
  }

  private resetForm(): void {
    const values: Record<string, any> = {};

    for (const f of this.fields) {
      if (f.type === 'info') continue; // static note — not a real form field
      values[f.key] = this.emptyValue(f);
    }

    this.form.reset(values);
    this.selectedFiles = {};
    this.draggingKey = null;
    this.data = null;
    this.formError = null;
  }

  colClass(f: ModalField): string {
    const span = f.col ?? (f.type === 'textarea' || f.type === 'file' ? 12 : 6);

    return `col-12 col-md-${span}`;
  }

  isInvalid(f: ModalField): boolean {
    const c = this.form.get(f.key);

    return !!c && c.invalid && (c.touched || c.dirty);
  }

  getError(f: ModalField): string {
    const errors = this.form.get(f.key)?.errors;

    if (!errors) return '';
    if (errors['required']) return f.type === 'file' ? 'Please upload a file' : `${f.label} is required`;
    if (errors['email']) return 'Enter a valid email address';
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;

    return 'Invalid value';
  }

  // =========================================================
  // PUBLIC API  (parent calls these)
  // =========================================================

  /**
   * open('add')
   * open('edit', { id: 3, policyName: '...', ... })
   *
   * mode + data are passed here (not as @Input) so they are applied
   * immediately, before the modal is shown.
   */
  open(mode: 'add' | 'edit' = 'add', data: Record<string, any> | null = null): void {
    this.resetForm();

    this.mode = mode;
    this.data = mode === 'edit' ? data : null;

    if (mode === 'edit' && data) {
      const patch: Record<string, any> = {};

      for (const f of this.fields) {
        if (f.type === 'info') continue;
        if (f.key in data) patch[f.key] = data[f.key];
      }

      this.form.patchValue(patch);
    }

    this.bsModal()?.show();
  }

  close(): void {
    this.bsModal()?.hide();
  }

  // =========================================================
  // FILE HANDLING  (per file field)
  // =========================================================

  fileOf(f: ModalField): File | null {
    return this.selectedFiles[f.key] ?? null;
  }

  onDragOver(event: DragEvent, f: ModalField): void {
    event.preventDefault();
    event.stopPropagation();
    this.draggingKey = f.key;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.draggingKey = null;
  }

  onDrop(event: DragEvent, f: ModalField): void {
    event.preventDefault();
    event.stopPropagation();
    this.draggingKey = null;

    const file = event.dataTransfer?.files?.[0];
    if (file) this.handleFile(f, file);
  }

  onFileSelected(event: Event, f: ModalField): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) this.handleFile(f, file);

    input.value = '';
  }

  private handleFile(f: ModalField, file: File): void {
    const maxMB = f.maxSizeMB ?? 10;

    if (file.size / (1024 * 1024) > maxMB) {
      alert(`File too large. Max ${maxMB} MB allowed.`);
      return;
    }

    this.selectedFiles[f.key] = file;
    this.form.get(f.key)?.setValue(file.name);
    this.form.get(f.key)?.markAsDirty();
  }

  removeFile(event: MouseEvent, f: ModalField): void {
    event.stopPropagation();

    this.selectedFiles[f.key] = null;
    this.form.get(f.key)?.setValue('');
    this.form.get(f.key)?.markAsDirty();
  }

  // =========================================================
  // SAVE / CANCEL
  // =========================================================

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const files: Record<string, File> = {};

    for (const [key, file] of Object.entries(this.selectedFiles)) {
      if (file) files[key] = file;
    }

    const event: ModalSaveEvent = {
      mode: this.mode,
      values: { ...(this.data ?? {}), ...this.form.getRawValue() },
      files,
    };

    this.formError = this.validate?.(event) ?? null;
    if (this.formError) return;

    this.saved.emit(event);

    this.close();
  }

  onCancel(): void {
    this.cancelled.emit();
    this.close();
  }
}
