import {
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  effect,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';

import { COMPOSER_MAX_HEIGHT, ChatContact, ChatVariant } from '../chat.model';
import {
  formatTime,
  groupByDay,
  hasPhone,
  initials,
  lastActivity,
  relativeTime,
  smsLength,
} from '../chat.utils';

/**
 * Chat panel (WhatsApp / SMS): contact header, day-grouped messages and the composer.
 * Contacts without a real phone number get a read-only composer.
 */
@Component({
  selector: 'app-chat-window',
  standalone: true,
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.scss',
  host: { '[class.variant-sms]': "variant() === 'sms'" },
})
export class ChatWindow {
  variant = input<ChatVariant>('whatsapp');
  contact = input<ChatContact | null>(null);

  placeholder = input('Type a message');
  /** Shown before a contact is picked */
  emptyHint = input('Pick a contact from the list to start chatting.');
  emptyIcon = input('bi bi-chat-dots');
  showAttach = input(false);
  /** SMS: character count + number of SMS parts */
  showSmsCounter = input(false);

  send = output<string>();
  back = output<void>();

  private scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  private composer = viewChild<ElementRef<HTMLTextAreaElement>>('composer');

  readonly draft = signal('');

  readonly days = computed(() => groupByDay(this.contact()?.messages ?? []));
  readonly canSend = computed(() => hasPhone(this.contact()));
  readonly sms = computed(() => smsLength(this.draft()));

  readonly status = computed(() => {
    const c = this.contact();
    if (!c) return '';
    return c.online ? 'online' : `last seen ${relativeTime(lastActivity(c)) || 'recently'}`;
  });

  readonly initials = initials;
  readonly formatTime = formatTime;

  constructor() {
    // a half-typed message must not carry over to another contact
    effect(() => {
      this.contact()?.id;
      untracked(() => this.draft.set(''));
    });

    // keep the newest message in view when a chat opens or a message arrives
    afterRenderEffect(() => {
      this.contact()?.messages.length;
      const el = this.scroller()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  onInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    this.draft.set(el.value);
    this.autosize(el);
  }

  /** Enter sends, Shift+Enter adds a new line */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  submit(): void {
    const text = this.draft().trim();
    if (!text || !this.contact() || !this.canSend()) return;

    this.send.emit(text);
    this.draft.set('');

    const el = this.composer()?.nativeElement;
    if (el) {
      el.value = '';
      this.autosize(el);
      el.focus();
    }
  }

  private autosize(el: HTMLTextAreaElement): void {
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, COMPOSER_MAX_HEIGHT)}px`;
  }
}
