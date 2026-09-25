import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { ChatMessage, WhatsAppData } from './whatsapp-chat.model';

@Injectable({
  providedIn: 'root',
})
export class WhatsAppChatService {
  private http = inject(HttpClient);

  /* =========================================================
     DATA SOURCE
     Contacts + history come from static JSON. Sending / read
     receipts stay in memory for this session — swap them for
     your WhatsApp API calls (`${environment.apiUrl}...`) later;
     the method signatures stay the same.
  ========================================================== */

  private readonly url = `${environment.jsonPath}leads/whatsapp-chats.json`;

  getChats(): Observable<WhatsAppData> {
    return this.http.get<Partial<WhatsAppData>>(this.url).pipe(
      map((res) => ({
        account: res.account ?? { name: '', label: 'WhatsApp Business', connected: false },
        contacts: (res.contacts ?? []).map((c) => ({ ...c, messages: c.messages ?? [] })),
      })),
    );
  }

  /** Send a text message; resolves with the stored message */
  sendMessage(contactId: number, text: string, nextId: number): Observable<ChatMessage> {
    void contactId; // used by the real API
    return of({ id: nextId, dir: 'out', text, at: new Date().toISOString() });
  }

  /** Mark a conversation as read on the server */
  markRead(contactId: number): Observable<void> {
    void contactId;
    return of(undefined);
  }
}
