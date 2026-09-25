import { Component, effect, inject, input, output, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';

import { ENCRYPTIONS, Encryption, MailSettings } from '../../mail-box.model';

const PORT = [Validators.min(1), Validators.max(65535), Validators.pattern(/^\d*$/)];

/** Outgoing (SMTP) + incoming (IMAP) mail server settings */
@Component({
  selector: 'app-mb-settings',
  standalone: true,
  imports: [ReactiveFormsModule, SelectModule],
  templateUrl: './mb-settings.html',
  styleUrl: './mb-settings.scss',
})
export class MbSettings {
  private fb = inject(FormBuilder);

  settings = input<MailSettings | null>(null);
  busy = input(false);

  save = output<MailSettings>();

  readonly encryptions = ENCRYPTIONS;

  /** Passwords start empty: they are write-only and never shown */
  readonly form = this.fb.group({
    smtp: this.fb.group({
      enabled: [false],
      host: [''],
      encryption: ['' as Encryption],
      username: ['', Validators.email],
      password: [''],
      port: [null as number | null, PORT],
      fromName: [''],
    }),
    imap: this.fb.group({
      enabled: [false],
      host: [''],
      encryption: ['' as Encryption],
      username: [''],
      password: [''],
      port: [993 as number | null, PORT],
    }),
  });

  constructor() {
    effect(() => {
      const s = this.settings();
      if (s) untracked(() => this.form.reset({ smtp: { ...s.smtp, password: '' }, imap: { ...s.imap, password: '' } }));
    });
  }

  invalid(path: string): boolean {
    const c = this.form.get(path);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const port = (p: unknown) => (p === null || p === '' ? null : Number(p));

    this.save.emit({
      smtp: {
        enabled: !!v.smtp.enabled,
        host: (v.smtp.host ?? '').trim(),
        encryption: v.smtp.encryption ?? '',
        username: (v.smtp.username ?? '').trim(),
        port: port(v.smtp.port),
        fromName: (v.smtp.fromName ?? '').trim(),
        ...(v.smtp.password ? { password: v.smtp.password } : {}),
      },
      imap: {
        enabled: !!v.imap.enabled,
        host: (v.imap.host ?? '').trim(),
        encryption: v.imap.encryption ?? '',
        username: (v.imap.username ?? '').trim(),
        port: port(v.imap.port),
        ...(v.imap.password ? { password: v.imap.password } : {}),
      },
    });

    // never keep a typed password in the form after saving
    this.form.patchValue({ smtp: { password: '' }, imap: { password: '' } });
  }
}
