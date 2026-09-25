import { Component, computed, effect, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

import {
  ChatBrand,
  ChatContact,
  ChatTab,
  ChatVariant,
  ContactType,
  REPLY_FILTERS,
  ReplyFilter,
  TYPE_CHIP,
} from '../chat.model';
import { initials, lastActivity, lastMessage, relativeTime, timeOf } from '../chat.utils';

/**
 * Chat sidebar (WhatsApp / SMS): brand header, search, reply filter,
 * contact-type tabs and the contact list.
 */
@Component({
  selector: 'app-chat-contact-list',
  standalone: true,
  imports: [FormsModule, SelectModule],
  templateUrl: './chat-contact-list.html',
  styleUrl: './chat-contact-list.scss',
  host: { '[class.variant-sms]': "variant() === 'sms'" },
})
export class ChatContactList {
  variant = input<ChatVariant>('whatsapp');
  brand = input<ChatBrand>({ name: '' });
  tabs = input.required<ChatTab[]>();
  contacts = input<ChatContact[]>([]);
  activeId = input<number | null>(null);
  loading = input(false);

  select = output<number>();

  readonly replyFilters = REPLY_FILTERS;
  readonly chip = TYPE_CHIP;

  readonly tab = signal<ContactType>('lead');
  readonly search = signal('');
  readonly replyFilter = signal<ReplyFilter>('all');

  constructor() {
    // start on the first configured tab
    effect(() => {
      const first = this.tabs()[0]?.key;
      if (first) untracked(() => this.tab.set(first));
    });
  }

  /** Contacts per type (tab badges) */
  readonly counts = computed(() => {
    const out: Record<ContactType, number> = { lead: 0, customer: 0, internal: 0 };
    for (const c of this.contacts()) out[c.type]++;
    return out;
  });

  /** Tabs holding unread chats (dot on the badge) */
  readonly unreadTabs = computed(() => {
    const out: Record<ContactType, boolean> = { lead: false, customer: false, internal: false };
    for (const c of this.contacts()) if (c.unread) out[c.type] = true;
    return out;
  });

  /** Current tab, filtered and searched, most recent first */
  readonly visible = computed(() => {
    const q = this.search().trim().toLowerCase();
    const filter = this.replyFilter();

    return this.contacts()
      .filter((c) => c.type === this.tab())
      .filter((c) => {
        if (filter === 'all') return true;
        const last = lastMessage(c);
        if (!last) return false;
        // unanswered = the contact wrote last and is waiting for us
        return filter === 'unanswered' ? last.dir === 'in' : last.dir === 'out';
      })
      .filter((c) => !q || `${c.name} ${c.phone}`.toLowerCase().includes(q))
      .sort((a, b) => timeOf(lastActivity(b)) - timeOf(lastActivity(a)));
  });

  readonly initials = initials;

  when(c: ChatContact): string {
    return relativeTime(lastActivity(c));
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }
}
