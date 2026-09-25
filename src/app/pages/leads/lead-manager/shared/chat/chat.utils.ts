import { dayLabel, timeOf } from '../message-time.utils';
import { ChatContact, ChatMessage, MessageDay } from './chat.model';

/* =========================================================
   CHAT — SHARED HELPERS (WhatsApp, SMS)
========================================================== */

export { formatTime, initials, relativeTime, timeOf } from '../message-time.utils';

export function lastMessage(c: ChatContact): ChatMessage | null {
  return c.messages.length ? c.messages[c.messages.length - 1] : null;
}

/** Time of the latest activity (for sorting / "last seen") */
export function lastActivity(c: ChatContact): string | undefined {
  return lastMessage(c)?.at ?? c.lastActive;
}

/** A contact can only be messaged with a real number ('NA' / blanks are not) */
export function hasPhone(c: ChatContact | null): boolean {
  return (c?.phone ?? '').replace(/\D/g, '').length >= 10;
}

/** Messages grouped by day, oldest first */
export function groupByDay(messages: ChatMessage[]): MessageDay[] {
  const groups: MessageDay[] = [];

  for (const m of [...messages].sort((a, b) => timeOf(a.at) - timeOf(b.at))) {
    const label = dayLabel(m.at);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.messages.push(m);
    else groups.push({ label, messages: [m] });
  }

  return groups;
}

/* =========================================================
   SMS LENGTH
   GSM-7: 160 chars in one SMS, 153 per part when split.
   Anything outside GSM-7 (e.g. Tamil, emoji) switches the whole
   message to Unicode: 70 chars, 67 per part.
========================================================== */

const GSM_BASIC =
  '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà';
const GSM_EXTENDED = '^{}\\[~]|€'; // count as 2 characters

export interface SmsLength {
  chars: number; // billable characters
  parts: number; // SMS segments
  perPart: number;
  unicode: boolean;
}

export function smsLength(text: string): SmsLength {
  const chars = [...text];
  const unicode = chars.some((ch) => !GSM_BASIC.includes(ch) && !GSM_EXTENDED.includes(ch));

  const count = unicode
    ? chars.reduce((n, ch) => n + (ch.length > 1 ? 2 : 1), 0) // surrogate pairs = 2 UCS-2 units
    : chars.reduce((n, ch) => n + (GSM_EXTENDED.includes(ch) ? 2 : 1), 0);

  const single = unicode ? 70 : 160;
  const multi = unicode ? 67 : 153;
  const parts = count === 0 ? 0 : count <= single ? 1 : Math.ceil(count / multi);

  return { chars: count, parts, perPart: parts > 1 ? multi : single, unicode };
}
