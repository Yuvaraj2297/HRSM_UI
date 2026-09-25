import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { ChatMessage } from '../shared/chat/chat.model';
import { SmsData } from './sms-template.model';

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  private http = inject(HttpClient);

  /* =========================================================
     DATA SOURCE
     Contacts + history come from static JSON. Sending / read
     receipts stay in memory for this session — swap them for
     your SMS gateway API (`${environment.apiUrl}...`) later;
     the method signatures stay the same.
  ========================================================== */

  private readonly url = `${environment.jsonPath}leads/sms-chats.json`;

  getChats(): Observable<SmsData> {
    return this.http.get<Partial<SmsData>>(this.url).pipe(
      map((res) => ({
        account: res.account ?? { name: '', senderId: '' },
        contacts: (res.contacts ?? []).map((c) => ({ ...c, messages: c.messages ?? [] })),
      })),
    );
  }

  /** Send an SMS; resolves with the stored message */
  sendMessage(contactId: number, text: string, nextId: number): Observable<ChatMessage> {
    void contactId; // used by the real gateway
    return of({ id: nextId, dir: 'out', text, at: new Date().toISOString() });
  }

  markRead(contactId: number): Observable<void> {
    void contactId;
    return of(undefined);
  }
}
