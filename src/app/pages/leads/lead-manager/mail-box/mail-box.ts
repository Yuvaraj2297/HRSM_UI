import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { MbCompose } from './components/mb-compose/mb-compose';
import { MbMailList } from './components/mb-mail-list/mb-mail-list';
import { MbMailReader } from './components/mb-mail-reader/mb-mail-reader';
import { MbSettings } from './components/mb-settings/mb-settings';
import { MailBoxService } from './mail-box.service';
import {
  ComposePrefill,
  ComposeValue,
  FOLDERS,
  Folder,
  Mail,
  MailAddress,
  MailSettings,
  MailView,
  VIEW_TITLES,
} from './mail-box.model';

type Feedback = { type: 'success' | 'danger'; text: string };

@Component({
  selector: 'app-mail-box',
  standalone: true,
  imports: [MbMailList, MbMailReader, MbCompose, MbSettings],
  templateUrl: './mail-box.html',
  styleUrl: './mail-box.scss',
})
export class MailBox {
  private service = inject(MailBoxService);
  private destroyRef = inject(DestroyRef);
  private feedbackTimer?: ReturnType<typeof setTimeout>;

  readonly folders = FOLDERS;

  /* =========================================================
     STATE
  ========================================================== */

  readonly account = signal<MailAddress>({ name: '', email: '' });
  readonly mails = signal<Mail[]>([]);
  readonly settings = signal<MailSettings | null>(null);

  readonly view = signal<MailView>('inbox');
  readonly readingId = signal<number | null>(null);
  readonly prefill = signal<ComposePrefill | null>(null);

  readonly loading = signal(false);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly feedback = signal<Feedback | null>(null);

  /* =========================================================
     DERIVED
  ========================================================== */

  /** Current folder when a list/reader is shown, else null */
  readonly folder = computed<Folder | null>(() => {
    const v = this.view();
    return v === 'compose' || v === 'setting' ? null : v;
  });

  readonly folderMails = computed(() => {
    const f = this.folder();
    return f ? this.mails().filter((m) => m.folder === f) : [];
  });

  readonly reading = computed(() => this.mails().find((m) => m.id === this.readingId()) ?? null);

  readonly counts = computed(() => ({
    inbox: this.mails().filter((m) => m.folder === 'inbox' && m.unread).length,
    draft: this.mails().filter((m) => m.folder === 'draft').length,
  }));

  readonly title = computed(() => (this.reading() ? this.reading()!.subject : VIEW_TITLES[this.view()]));

  constructor() {
    // data is browser-only: routes are prerendered, where relative HTTP URLs don't resolve
    if (isPlatformBrowser(inject(PLATFORM_ID))) this.load();
    this.destroyRef.onDestroy(() => clearTimeout(this.feedbackTimer));
  }

  /* =========================================================
     DATA
  ========================================================== */

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.service
      .getMailbox()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (d) => {
          this.account.set(d.account);
          this.mails.set(d.mails);
          this.settings.set(d.settings);
        },
        error: () => this.error.set('Unable to load the mailbox. Please try again.'),
      });
  }

  /* =========================================================
     NAVIGATION
  ========================================================== */

  setView(view: MailView): void {
    this.view.set(view);
    this.readingId.set(null);
  }

  compose(prefill: ComposePrefill = {}): void {
    this.prefill.set({ ...prefill }); // new object -> compose form resets
    this.setView('compose');
  }

  back(): void {
    this.readingId.set(null);
  }

  /** Drafts reopen in the editor; everything else in the reader */
  openMail(m: Mail): void {
    if (m.folder === 'draft') {
      this.compose({
        draftId: m.id,
        to: m.to,
        cc: m.cc,
        subject: m.subject === '(no subject)' ? '' : m.subject,
        html: m.html ?? textToHtml(m.body),
        attachments: m.attachments,
      });
      return;
    }

    if (m.unread) this.patch(m.id, { unread: false });
    this.readingId.set(m.id);
  }

  reply(m: Mail): void {
    const subject = /^re:/i.test(m.subject) ? m.subject : `Re: ${m.subject}`;
    const to = m.folder === 'sent' ? (m.to ?? []) : [m.from.email];
    this.compose({ to, subject });
  }

  /* =========================================================
     MAIL ACTIONS
  ========================================================== */

  toggleStar(m: Mail): void {
    this.patch(m.id, { starred: !m.starred });
  }

  moveToTrash(m: Mail): void {
    this.patch(m.id, { folder: 'trash', restoreTo: m.folder });
    if (this.readingId() === m.id) this.readingId.set(null);
    this.notify('success', 'Moved to Trash.');
  }

  restore(m: Mail): void {
    const to = m.restoreTo ?? 'inbox';
    this.patch(m.id, { folder: to, restoreTo: undefined });
    if (this.readingId() === m.id) this.readingId.set(null);
    this.notify('success', `Restored to ${VIEW_TITLES[to]}.`);
  }

  purge(m: Mail): void {
    if (!window.confirm(`Delete "${m.subject}" forever? This cannot be undone.`)) return;
    this.mails.update((list) => list.filter((x) => x.id !== m.id));
    if (this.readingId() === m.id) this.readingId.set(null);
    this.notify('success', 'Email deleted permanently.');
  }

  /* =========================================================
     COMPOSE
  ========================================================== */

  send(value: ComposeValue): void {
    this.busy.set(true);
    this.service
      .send(value, this.account())
      .pipe(
        finalize(() => this.busy.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (sent) => {
          // a sent draft leaves the Draft folder
          this.mails.update((list) => [sent, ...list.filter((x) => x.id !== sent.id)]);
          this.setView('sent');
          this.notify('success', `Email sent to ${value.to.join(', ')}.`);
        },
        error: () => this.notify('danger', 'Email could not be sent. Please try again.'),
      });
  }

  saveDraft(value: ComposeValue): void {
    this.busy.set(true);
    this.service
      .saveDraft(value, this.account())
      .pipe(
        finalize(() => this.busy.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (draft) => {
          this.mails.update((list) => [draft, ...list.filter((x) => x.id !== draft.id)]);
          this.setView('draft');
          this.notify('success', 'Draft saved.');
        },
        error: () => this.notify('danger', 'Draft could not be saved. Please try again.'),
      });
  }

  /* =========================================================
     SETTINGS
  ========================================================== */

  saveSettings(value: MailSettings): void {
    this.busy.set(true);
    this.service
      .saveSettings(value)
      .pipe(
        finalize(() => this.busy.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (saved) => {
          this.settings.set(saved);
          this.notify('success', 'Settings saved successfully.');
        },
        error: () => this.notify('danger', 'Settings could not be saved. Please try again.'),
      });
  }

  /* =========================================================
     HELPERS
  ========================================================== */

  private patch(id: number, changes: Partial<Mail>): void {
    this.mails.update((list) => list.map((m) => (m.id === id ? { ...m, ...changes } : m)));
  }

  private notify(type: Feedback['type'], text: string): void {
    clearTimeout(this.feedbackTimer);
    this.feedback.set({ type, text });
    this.feedbackTimer = setTimeout(() => this.feedback.set(null), 4000);
  }
}

/** Plain-text draft body -> editor HTML (escaped) */
function textToHtml(text: string): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return (text ?? '')
    .split('\n')
    .map((line) => `<p>${line ? esc(line) : '<br>'}</p>`)
    .join('');
}
