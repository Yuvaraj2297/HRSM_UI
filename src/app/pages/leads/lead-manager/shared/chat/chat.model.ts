/* =========================================================
   CHAT — SHARED MODELS (WhatsApp, SMS)
========================================================== */

export type ChatVariant = 'whatsapp' | 'sms';

export type ContactType = 'lead' | 'customer' | 'internal';

/** Sidebar filter: Unanswered = last message came from the contact (awaiting our reply) */
export type ReplyFilter = 'all' | 'answered' | 'unanswered';

export interface ChatMessage {
  id: number;
  dir: 'in' | 'out'; // in = from contact, out = sent by us
  text: string;
  at: string; // ISO date-time
}

export interface ChatContact {
  id: number;
  name: string;
  phone: string; // 'NA' when unknown
  type: ContactType;
  color: string; // avatar background
  online: boolean;
  unread: number;
  /** used for "last seen" when there are no messages yet */
  lastActive?: string;
  messages: ChatMessage[];
}

/** Sidebar header */
export interface ChatBrand {
  name: string;
  subtitle?: string;
  logoIcon?: string; // bootstrap icon, e.g. 'bi bi-whatsapp'
  logoText?: string; // short text, e.g. 'GHRA'
}

export interface ChatTab {
  key: ContactType;
  label: string;
  icon: string;
}

/** Contacts grouped under a day separator in the chat window */
export interface MessageDay {
  label: string; // 'Today', 'Yesterday', 'Monday', '18-09-2026'
  messages: ChatMessage[];
}

/* =========================================================
   CONSTANTS
========================================================== */

export const TYPE_CHIP: Record<ContactType, { label: string; cls: string }> = {
  lead: { label: 'Lead', cls: 'lead' },
  customer: { label: 'Cust', cls: 'cust' },
  internal: { label: 'Staff', cls: 'int' },
};

export const REPLY_FILTERS: { label: string; value: ReplyFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Answered', value: 'answered' },
  { label: 'Unanswered', value: 'unanswered' },
];

/** Max height (px) the message box grows to before scrolling */
export const COMPOSER_MAX_HEIGHT = 110;
