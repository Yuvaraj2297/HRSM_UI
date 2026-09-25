import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { ChatContactList } from '../shared/chat/chat-contact-list/chat-contact-list';
import { ChatWindow } from '../shared/chat/chat-window/chat-window';
import { ChatBrand, ChatContact } from '../shared/chat/chat.model';
import { SmsService } from './sms-template.service';
import { SMS_TABS, SmsAccount } from './sms-template.model';

/** SMS conversations with leads and customers (shared chat UI, SMS variant) */
@Component({
  selector: 'app-sms-template',
  standalone: true,
  imports: [ChatContactList, ChatWindow],
  templateUrl: './sms-template.html',
  styleUrl: './sms-template.scss',
})
export class SmsTemplate {
  private service = inject(SmsService);
  private destroyRef = inject(DestroyRef);

  readonly tabs = SMS_TABS;

  /* =========================================================
     STATE
  ========================================================== */

  readonly account = signal<SmsAccount | null>(null);
  readonly contacts = signal<ChatContact[]>([]);
  readonly activeId = signal<number | null>(null);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly sendError = signal<string | null>(null);

  readonly brand = computed<ChatBrand>(() => ({
    name: this.account()?.name || 'SMS',
    subtitle: this.account()?.senderId ? `Sender ID · ${this.account()!.senderId}` : undefined,
    logoText: this.account()?.senderId || 'SMS',
  }));

  readonly active = computed(() => this.contacts().find((c) => c.id === this.activeId()) ?? null);

  constructor() {
    // data is browser-only: routes are prerendered, where relative HTTP URLs don't resolve
    if (isPlatformBrowser(inject(PLATFORM_ID))) this.load();
  }

  /* =========================================================
     DATA
  ========================================================== */

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.service
      .getChats()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (d) => {
          this.account.set(d.account);
          this.contacts.set(d.contacts);
        },
        error: () => this.error.set('Unable to load SMS conversations. Please try again.'),
      });
  }

  /* =========================================================
     ACTIONS
  ========================================================== */

  open(id: number): void {
    this.activeId.set(id);
    this.sendError.set(null);

    const c = this.contacts().find((x) => x.id === id);
    if (c?.unread) {
      this.patch(id, (x) => ({ ...x, unread: 0 }));
      this.service.markRead(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    }
  }

  closeChat(): void {
    this.activeId.set(null);
  }

  send(text: string): void {
    const c = this.active();
    if (!c) return;

    const nextId = Math.max(0, ...c.messages.map((m) => m.id)) + 1;
    this.sendError.set(null);

    this.service
      .sendMessage(c.id, text, nextId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (msg) => this.patch(c.id, (x) => ({ ...x, messages: [...x.messages, msg] })),
        error: () => this.sendError.set('SMS not sent. Please try again.'),
      });
  }

  /** Immutable update so signals pick up the change */
  private patch(id: number, fn: (c: ChatContact) => ChatContact): void {
    this.contacts.update((list) => list.map((c) => (c.id === id ? fn(c) : c)));
  }
}
