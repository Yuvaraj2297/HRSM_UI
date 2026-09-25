import { Mail } from './mail-box.model';

/* =========================================================
   MAILBOX — HELPERS
   Generic time helpers live in ../shared/message-time.utils
========================================================== */

export { formatDate, formatTime, initials, shortStamp, timeOf } from '../shared/message-time.utils';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 'a@x.com, b@y.com; c@z.com' -> ['a@x.com', 'b@y.com', 'c@z.com'] */
export function splitAddresses(value: string): string[] {
  return (value ?? '')
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** First invalid address, or null when all are valid */
export function firstInvalidEmail(list: string[]): string | null {
  return list.find((e) => !EMAIL.test(e)) ?? null;
}

/** Plain-text version of a mail (list snippet, search) */
export function plainText(mail: Pick<Mail, 'body' | 'html'>): string {
  if (!mail.html) return mail.body ?? '';
  if (typeof document === 'undefined') return mail.html.replace(/<[^>]+>/g, ' ');

  // DOMParser does not run scripts or load images
  const doc = new DOMParser().parseFromString(mail.html, 'text/html');
  return doc.body.textContent ?? '';
}

export function snippet(mail: Pick<Mail, 'body' | 'html'>, max = 140): string {
  const text = plainText(mail).replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

/** Quill leaves '<p><br></p>' for an empty editor */
export function isBlankHtml(html: string | null | undefined): boolean {
  return !plainText({ body: '', html: html ?? '' }).trim();
}
