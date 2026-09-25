import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { ChatContactList } from '../shared/chat/chat-contact-list/chat-contact-list';
import { ChatWindow } from '../shared/chat/chat-window/chat-window';
import { ChatBrand } from '../shared/chat/chat.model';
import { WhatsAppChatService } from './whatsapp-chat.service';
import { ChatContact, WHATSAPP_TABS, WhatsAppAccount } from './whatsapp-chat.model';

@Component({
  selector: 'app-whatsapp-chat',
  standalone: true,
  imports: [ChatContactList, ChatWindow],
  templateUrl: './whatsapp-chat.html',
  styleUrl: './whatsapp-chat.scss',
})
export class WhatsappChat {
  private service = inject(WhatsAppChatService);
  private destroyRef = inject(DestroyRef);

  /* =========================================================
     STATE
  ========================================================== */

  readonly account = signal<WhatsAppAccount | null>(null);
  readonly contacts = signal<ChatContact[]>([]);
  readonly activeId = signal<number | null>(null);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly sendError = signal<string | null>(null);

  readonly tabs = WHATSAPP_TABS;

  readonly brand = computed<ChatBrand>(() => ({
    name: this.account()?.name || 'WhatsApp',
    subtitle: this.account()?.label,
    logoIcon: 'bi bi-whatsapp',
  }));

  readonly active = computed(() => this.contacts().find((c) => c.id === this.activeId()) ?? null);

  readonly connected = computed(() => this.account()?.connected ?? false);

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
        error: () => this.error.set('Unable to load WhatsApp chats. Please try again.'),
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
        error: () => this.sendError.set('Message not sent. Please try again.'),
      });
  }

  /** Immutable update so signals / OnPush views pick up the change */
  private patch(id: number, fn: (c: ChatContact) => ChatContact): void {
    this.contacts.update((list) => list.map((c) => (c.id === id ? fn(c) : c)));
  }
}
