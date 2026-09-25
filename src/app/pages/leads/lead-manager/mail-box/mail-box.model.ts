/* =========================================================
   MAILBOX — MODELS
========================================================== */

export type Folder = 'inbox' | 'sent' | 'draft' | 'trash';
export type MailView = Folder | 'compose' | 'setting';
export type Encryption = '' | 'TLS' | 'SSL' | 'STARTTLS';

export interface MailAddress {
  name: string;
  email: string;
}

export interface Mail {
  id: number;
  folder: Folder;
  from: MailAddress;
  to?: string[];
  cc?: string[];
  color: string; // avatar background
  subject: string;
  /** plain text (received mail) … */
  body: string;
  /** … or rich HTML (composed in the editor) */
  html?: string;
  attachments?: string[]; // file names
  at: string; // ISO date-time
  unread: boolean;
  starred: boolean;
  /** folder to go back to when restored from Trash */
  restoreTo?: Folder;
}

export interface SmtpSettings {
  enabled: boolean;
  host: string;
  encryption: Encryption;
  username: string;
  password?: string; // write-only: never returned by the API / JSON
  port: number | null;
  fromName: string;
}

export interface ImapSettings {
  enabled: boolean;
  host: string;
  encryption: Encryption;
  username: string;
  password?: string; // write-only
  port: number | null;
}

export interface MailSettings {
  smtp: SmtpSettings;
  imap: ImapSettings;
}

/** Response shape of mailbox.json (and the future API) */
export interface MailboxData {
  account: MailAddress;
  mails: Mail[];
  settings: MailSettings;
}

/** What the compose form produces */
export interface ComposeValue {
  draftId: number | null; // editing an existing draft
  to: string[];
  cc: string[];
  subject: string;
  html: string;
  attachments: string[];
}

/** Pre-fill for the compose screen (reply / open draft) */
export type ComposePrefill = Partial<ComposeValue>;

/* =========================================================
   CONSTANTS
========================================================== */

export const FOLDERS: { key: Folder; label: string; icon: string }[] = [
  { key: 'inbox', label: 'Inbox', icon: 'bi bi-inbox' },
  { key: 'sent', label: 'Sent', icon: 'bi bi-send' },
  { key: 'draft', label: 'Draft', icon: 'bi bi-file-earmark' },
  { key: 'trash', label: 'Trash', icon: 'bi bi-trash' },
];

export const VIEW_TITLES: Record<MailView, string> = {
  inbox: 'Inbox',
  sent: 'Sent',
  draft: 'Draft',
  trash: 'Trash',
  compose: 'Compose Email',
  setting: 'Settings',
};

export const EMPTY_STATE: Record<Folder, { icon: string; title: string; hint: string }> = {
  inbox: { icon: 'bi-inbox', title: 'Inbox is empty', hint: 'Emails you receive will appear here.' },
  sent: { icon: 'bi-send', title: 'No sent emails', hint: 'Emails you send will appear here.' },
  draft: { icon: 'bi-file-earmark', title: 'No drafts', hint: 'Emails you save as draft will appear here.' },
  trash: { icon: 'bi-trash', title: 'Trash is empty', hint: 'Emails you delete will appear here.' },
};

export const ENCRYPTIONS: { label: string; value: Encryption }[] = [
  { label: 'None', value: '' },
  { label: 'TLS', value: 'TLS' },
  { label: 'SSL', value: 'SSL' },
  { label: 'STARTTLS', value: 'STARTTLS' },
];

/** Per-file upload limit */
export const MAX_ATTACHMENT_MB = 10;
