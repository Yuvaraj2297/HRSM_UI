import { Component, computed, input, output, signal } from '@angular/core';

import { EMPTY_STATE, Folder, Mail } from '../../mail-box.model';
import { initials, shortStamp, snippet, timeOf } from '../../mail-box.utils';

/** Mails of one folder: search, star, open, trash / restore / delete forever */
@Component({
  selector: 'app-mb-mail-list',
  standalone: true,
  templateUrl: './mb-mail-list.html',
  styleUrl: './mb-mail-list.scss',
})
export class MbMailList {
  mails = input<Mail[]>([]);
  folder = input.required<Folder>();

  open = output<Mail>();
  star = output<Mail>();
  trash = output<Mail>();
  restore = output<Mail>();
  purge = output<Mail>();

  readonly search = signal('');

  readonly visible = computed(() => {
    const q = this.search().trim().toLowerCase();
    return [...this.mails()]
      .filter((m) => !q || `${m.from.name} ${m.from.email} ${m.subject} ${(m.to ?? []).join(' ')} ${snippet(m, 500)}`.toLowerCase().includes(q))
      .sort((a, b) => timeOf(b.at) - timeOf(a.at));
  });

  readonly empty = computed(() => EMPTY_STATE[this.folder()]);

  readonly initials = initials;
  readonly stamp = shortStamp;
  readonly snippet = snippet;

  /** Sent / draft rows show the recipient instead of ourselves */
  who(m: Mail): { name: string; email: string } {
    if ((this.folder() === 'sent' || this.folder() === 'draft') && m.to?.length) {
      return { name: `To: ${m.to[0]}${m.to.length > 1 ? ` +${m.to.length - 1}` : ''}`, email: '' };
    }
    return m.from;
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }
}
