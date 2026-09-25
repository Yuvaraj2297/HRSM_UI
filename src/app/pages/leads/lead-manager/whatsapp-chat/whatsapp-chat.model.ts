import { ChatContact, ChatTab } from '../shared/chat/chat.model';

/* =========================================================
   WHATSAPP CHAT — MODELS
   Chat types (contacts, messages, tabs) are shared with SMS:
   ../shared/chat/chat.model
========================================================== */

export type { ChatContact, ChatMessage, ContactType } from '../shared/chat/chat.model';

export interface WhatsAppAccount {
  name: string;
  label: string;
  connected: boolean;
}

/** Response shape of whatsapp-chats.json (and the future API) */
export interface WhatsAppData {
  account: WhatsAppAccount;
  contacts: ChatContact[];
}

export const WHATSAPP_TABS: ChatTab[] = [
  { key: 'lead', label: 'Leads', icon: 'bi bi-person-plus' },
  { key: 'customer', label: 'Customers', icon: 'bi bi-people' },
  { key: 'internal', label: 'Internals', icon: 'bi bi-person-badge' },
];
