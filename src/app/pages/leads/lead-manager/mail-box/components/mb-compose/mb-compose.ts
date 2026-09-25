import { Component, effect, inject, input, output, signal, untracked } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { EditorModule } from 'primeng/editor';

import { ComposePrefill, ComposeValue, MAX_ATTACHMENT_MB } from '../../mail-box.model';
import { firstInvalidEmail, isBlankHtml, splitAddresses } from '../../mail-box.utils';

/** Comma / semicolon separated list where every address must be valid */
function emailList(control: AbstractControl): ValidationErrors | null {
  const bad = firstInvalidEmail(splitAddresses(control.value ?? ''));
  return bad ? { emailList: bad } : null;
}

/** Compose / reply / edit draft */
@Component({
  selector: 'app-mb-compose',
  standalone: true,
  imports: [ReactiveFormsModule, EditorModule],
  templateUrl: './mb-compose.html',
  styleUrl: './mb-compose.scss',
})
export class MbCompose {
  private fb = inject(FormBuilder);

  prefill = input<ComposePrefill | null>(null);
  busy = input(false);

  send = output<ComposeValue>();
  saveDraft = output<ComposeValue>();
  discard = output<void>();

  readonly maxMb = MAX_ATTACHMENT_MB;

  /** Quill toolbar (same tools as the PHP page) */
  readonly editorModules = {
    toolbar: [
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ color: [] }, { background: [] }],
      ['bold', 'italic', 'underline'],
      [{ align: [] }],
      ['link', 'image'],
      [{ list: 'bullet' }, { list: 'ordered' }],
      ['clean'],
    ],
  };

  readonly form = this.fb.nonNullable.group({
    to: ['', [Validators.required, emailList]],
    cc: ['', emailList],
    subject: ['', Validators.required],
    html: [''],
  });

  readonly attachments = signal<string[]>([]);
  readonly fileError = signal<string | null>(null);

  /** Draft being edited (kept so saving/sending replaces it) */
  private draftId: number | null = null;

  constructor() {
    // (re)fill the form whenever a new prefill arrives (compose / reply / open draft)
    effect(() => {
      const p = this.prefill();
      untracked(() => this.reset(p));
    });
  }

  private reset(p: ComposePrefill | null): void {
    this.draftId = p?.draftId ?? null;
    this.form.reset({
      to: (p?.to ?? []).join(', '),
      cc: (p?.cc ?? []).join(', '),
      subject: p?.subject ?? '',
      html: p?.html ?? '',
    });
    this.attachments.set(p?.attachments ?? []);
    this.fileError.set(null);
  }

  /* =========================================================
     ATTACHMENTS
  ========================================================== */

  onFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    const tooBig = files.filter((f) => f.size > this.maxMb * 1024 * 1024);

    this.fileError.set(tooBig.length ? `${tooBig.map((f) => f.name).join(', ')} is over ${this.maxMb} MB.` : null);
    this.attachments.update((list) => [
      ...list,
      ...files.filter((f) => !tooBig.includes(f) && !list.includes(f.name)).map((f) => f.name),
    ]);

    input.value = ''; // allow picking the same file again
  }

  removeFile(name: string): void {
    this.attachments.update((list) => list.filter((n) => n !== name));
  }

  /* =========================================================
     SUBMIT
  ========================================================== */

  invalid(name: 'to' | 'cc' | 'subject'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  error(name: 'to' | 'cc' | 'subject'): string {
    const e = this.form.controls[name].errors;
    if (!e) return '';
    if (e['required']) return name === 'to' ? 'Email To is required.' : 'Subject is required.';
    return `"${e['emailList']}" is not a valid email address.`;
  }

  onSend(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.send.emit(this.value());
  }

  /** Drafts may be incomplete, but addresses that are typed must be valid */
  onSaveDraft(): void {
    const { to, cc } = this.form.controls;
    if (to.hasError('emailList') || cc.hasError('emailList')) {
      to.markAsTouched();
      cc.markAsTouched();
      return;
    }
    this.saveDraft.emit(this.value());
  }

  private value(): ComposeValue {
    const v = this.form.getRawValue();
    return {
      draftId: this.draftId,
      to: splitAddresses(v.to),
      cc: splitAddresses(v.cc),
      subject: v.subject.trim(),
      html: isBlankHtml(v.html) ? '' : v.html,
      attachments: this.attachments(),
    };
  }
}
