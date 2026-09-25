/* =========================================================
   DATE / NUMBER HELPERS — shared by both report tabs
   All dates are local 'yyyy-mm-dd' strings.
========================================================== */

export function toIso(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** yyyy-mm-dd -> dd-mm-yyyy */
export function toDisplayDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}-${m}-${y}` : '—';
}

export function weekday(iso: string): string {
  return isoToDate(iso).toLocaleDateString('en-IN', { weekday: 'short' });
}

export function isSunday(iso: string): boolean {
  return isoToDate(iso).getDay() === 0;
}

export function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return toIso(d);
}

/** Every date from `from` to `to`, inclusive */
export function eachDay(from: string, to: string): string[] {
  const out: string[] = [];
  const cursor = isoToDate(from);

  for (let iso = from; iso <= to; iso = toIso(cursor)) {
    out.push(iso);
    cursor.setDate(cursor.getDate() + 1);
  }

  return out;
}

/** Date -> 'yyyy-mm-dd', null-safe (PrimeNG datepicker values) */
export function dateToIso(d: Date | null): string {
  return d ? toIso(d) : '';
}

/** '09:40 AM' / '09:40:15 am' -> seconds since midnight */
export function toSeconds(time: string): number {
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)$/i.exec(time.trim());
  if (!m) return 0;

  const h12 = Number(m[1]) % 12;
  const h24 = m[4].toLowerCase() === 'pm' ? h12 + 12 : h12;
  return h24 * 3600 + Number(m[2]) * 60 + Number(m[3] ?? 0);
}

/** seconds -> '1 hr 05 min' / '34 min' */
export function formatDuration(seconds: number): string {
  const mins = Math.max(0, Math.round(seconds / 60));
  const h = Math.floor(mins / 60);
  return h ? `${h} hr ${String(mins % 60).padStart(2, '0')} min` : `${mins} min`;
}

/** Great-circle distance in km between two lat/lng points */
export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const rad = (v: number) => (v * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
