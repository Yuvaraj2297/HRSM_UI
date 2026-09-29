import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionRow, fmtDate, moduleMeta } from '../induction.model';
import { InductionStore } from '../induction.store';

/** Send / resend the invitation for one session (email, WhatsApp, join link) */
@Component({
  selector: 'app-induction-invite-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './invite-modal.html',
  styleUrl: './invite-modal.scss',
})
export class InviteModal {
  private readonly store = inject(InductionStore);
  private readonly fb = inject(FormBuilder);

  readonly moduleMeta = moduleMeta;
  readonly fmtDate = fmtDate;

  readonly row: SessionRow = this.store.row((this.store.modal() as { ref: string }).ref)!;

  readonly form = this.fb.nonNullable.group({
    sendEmail: [true],
    email: [this.row.email, Validators.email],
    attachIcs: [true],
    ccManager: [true],
    sendWhatsApp: [true],
    phone: [this.row.phone],
    message: ['Welcome aboard! Please join 5 minutes early. The orientation pack is attached for you to review beforehand.'],
  });

  /** stable per session + employee, so re-opening shows the same link */
  readonly joinLink = (() => {
    const hash = [...(this.row.ref + this.row.empId)].reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
    const token = 'IND_' + Math.abs(hash).toString(16);
    return `https://hrms.gharuda.com/induction/join?session=${encodeURIComponent(this.row.ref)}&token=${token}`;
  })();

  get canSend(): boolean {
    const v = this.form.getRawValue();
    return (v.sendEmail && !!v.email && this.form.controls.email.valid) || (v.sendWhatsApp && !!v.phone.trim());
  }

  async copyLink(): Promise<void> {
    await this.copy(this.joinLink, 'Join link copied.');
  }

  async copyMessage(): Promise<void> {
    await this.copy(this.messageText(), 'Invitation text copied.');
  }

  openWhatsApp(): void {
    const phone = this.form.controls.phone.value.replace(/\D/g, '');
    const text = encodeURIComponent(this.messageText());
    window.open(phone ? `https://wa.me/${phone}?text=${text}` : `https://api.whatsapp.com/send?text=${text}`, '_blank');
  }

  send(): void {
    if (!this.canSend) return;
    const v = this.form.getRawValue();
    this.store.updateSession(this.row.ref, { notified: true });
    const via = [v.sendEmail && `email (${v.email})`, v.sendWhatsApp && 'WhatsApp'].filter(Boolean).join(' & ');
    this.store.notify(`Invitation sent to ${this.row.emp} via ${via}.`);
    this.store.close();
  }

  close(): void {
    this.store.close();
  }

  private messageText(): string {
    const r = this.row;
    const note = this.form.controls.message.value.trim();
    return [
      `Hello ${r.emp},`,
      '',
      `You are invited to your induction session: ${r.title}`,
      `Date: ${fmtDate(r.date)}  Time: ${r.time}`,
      `Venue: ${r.venue || r.mode}  Trainer: ${r.trainer}`,
      '',
      `Join / check in: ${this.joinLink}`,
      ...(note ? ['', note] : []),
      '',
      '— HR Operations, Gharuda',
    ].join('\n');
  }

  private async copy(text: string, done: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.store.notify(done);
    } catch {
      this.store.notify('Could not copy — your browser blocked clipboard access.', 'warning');
    }
  }
}
