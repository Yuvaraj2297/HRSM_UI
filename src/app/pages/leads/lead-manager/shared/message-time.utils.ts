/* =========================================================
   MESSAGE / TIME HELPERS — shared by lead-manager pages
   (WhatsApp chat, Mailbox). Dates are ISO strings.
========================================================== */

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** 'ghra shalu' -> 'GS', 'Kumar' -> 'K' */
export function initials(name: string): string {
  return (name || '?')
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

/** '09:05 AM' */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

/** 'dd-mm-yyyy' */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** Whole days between the date and today (0 = today) */
export function daysAgo(iso: string, now = new Date()): number {
  return Math.round((startOfDay(now) - startOfDay(new Date(iso))) / 86_400_000);
}

/** Day separator: Today / Yesterday / weekday (this week) / dd-mm-yyyy */
export function dayLabel(iso: string): string {
  const n = daysAgo(iso);
  if (n <= 0) return 'Today';
  if (n === 1) return 'Yesterday';
  if (n < 7) return WEEKDAYS[new Date(iso).getDay()];
  return formatDate(iso);
}

/** Short list stamp: '10:24 AM' today, 'Yesterday', 'Mon', else dd-mm-yyyy */
export function shortStamp(iso: string): string {
  const n = daysAgo(iso);
  if (n <= 0) return formatTime(iso);
  if (n === 1) return 'Yesterday';
  if (n < 7) return WEEKDAYS[new Date(iso).getDay()].slice(0, 3);
  return formatDate(iso);
}

/** 'Just now', '5 min ago', '2 hrs ago', 'Yesterday', '3 days ago', '2 wks ago' */
export function relativeTime(iso: string | undefined): string {
  if (!iso) return '';
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;

  const days = daysAgo(iso);
  if (days === 0) {
    const hrs = Math.floor(mins / 60);
    return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  }
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);
  return weeks < 5 ? `${weeks} wk${weeks > 1 ? 's' : ''} ago` : dayLabel(iso);
}

/**
 * Milliseconds for sorting. Compare real times, not strings: stored
 * history may be local ('…T10:06:00') while new items are UTC ('…Z').
 */
export function timeOf(iso: string | undefined): number {
  const t = iso ? new Date(iso).getTime() : NaN;
  return Number.isNaN(t) ? 0 : t;
}
