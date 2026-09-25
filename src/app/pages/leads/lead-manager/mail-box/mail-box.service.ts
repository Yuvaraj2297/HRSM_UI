import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { ComposeValue, Mail, MailAddress, MailSettings, MailboxData } from './mail-box.model';

@Injectable({
  providedIn: 'root',
})
export class MailBoxService {
  private http = inject(HttpClient);

  /* =========================================================
     DATA SOURCE
     Mails + settings come from static JSON. Send / draft /
     settings changes stay in memory for this session — swap
     each method for your mail API (`${environment.apiUrl}...`)
     later; the signatures stay the same.
     Passwords are write-only: never stored in the JSON / page.
  ========================================================== */

  private readonly url = `${environment.jsonPath}leads/mailbox.json`;
  private nextId = 1000;

  getMailbox(): Observable<MailboxData> {
    return this.http.get<Partial<MailboxData>>(this.url).pipe(
      map((res) => ({
        account: res.account ?? { name: '', email: '' },
        mails: res.mails ?? [],
        settings: res.settings ?? {
          smtp: { enabled: false, host: '', encryption: '', username: '', port: null, fromName: '' },
          imap: { enabled: false, host: '', encryption: '', username: '', port: 993 },
        },
      })),
    );
  }

  /** Send a composed mail; resolves with the stored "sent" copy */
  send(value: ComposeValue, from: MailAddress): Observable<Mail> {
    return of(this.toMail(value, from, 'sent', 'var(--purple-650-2)'));
  }

  /** Create or update a draft; resolves with the stored draft */
  saveDraft(value: ComposeValue, from: MailAddress): Observable<Mail> {
    return of(this.toMail(value, from, 'draft', 'var(--neutral-500-2)'));
  }

  /** Password fields are only sent when filled in */
  saveSettings(settings: MailSettings): Observable<MailSettings> {
    const { password: _smtpPass, ...smtp } = settings.smtp;
    const { password: _imapPass, ...imap } = settings.imap;
    return of({ smtp, imap });
  }

  private toMail(v: ComposeValue, from: MailAddress, folder: 'sent' | 'draft', color: string): Mail {
    return {
      id: v.draftId ?? this.nextId++,
      folder,
      from,
      to: v.to,
      cc: v.cc,
      color,
      subject: v.subject || '(no subject)',
      body: '',
      html: v.html,
      attachments: v.attachments,
      at: new Date().toISOString(),
      unread: false,
      starred: false,
    };
  }
}
