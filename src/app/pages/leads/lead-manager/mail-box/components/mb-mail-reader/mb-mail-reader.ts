import { Component, input, output } from '@angular/core';

import { Folder, Mail } from '../../mail-box.model';
import { formatDate, formatTime, initials } from '../../mail-box.utils';

/** One opened mail: header, body (text or sanitised HTML), attachments, actions */
@Component({
  selector: 'app-mb-mail-reader',
  standalone: true,
  templateUrl: './mb-mail-reader.html',
  styleUrl: './mb-mail-reader.scss',
})
export class MbMailReader {
  mail = input.required<Mail>();
  folder = input.required<Folder>();

  reply = output<Mail>();
  trash = output<Mail>();
  restore = output<Mail>();
  purge = output<Mail>();
  star = output<Mail>();

  readonly initials = initials;

  stamp(iso: string): string {
    return `${formatDate(iso)} · ${formatTime(iso)}`;
  }
}
