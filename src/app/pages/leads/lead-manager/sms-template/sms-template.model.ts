import { ChatContact, ChatTab } from '../shared/chat/chat.model';

/* =========================================================
   SMS — MODELS
   Chat types (contacts, messages, tabs) are shared with WhatsApp:
   ../shared/chat/chat.model
========================================================== */

export interface SmsAccount {
  name: string;
  senderId: string; // e.g. 'GHRA'
}

/** Response shape of sms-chats.json (and the future API) */
export interface SmsData {
  account: SmsAccount;
  contacts: ChatContact[];
}

export const SMS_TABS: ChatTab[] = [
  { key: 'lead', label: 'Leads', icon: 'bi bi-person-plus' },
  { key: 'customer', label: 'Customers', icon: 'bi bi-people' },
];
