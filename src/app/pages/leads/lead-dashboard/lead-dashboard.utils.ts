import { LeadDashboardData, MONTH_NAMES, Period, SeriesKey } from './lead-dashboard.model';

/* =========================================================
   PERIOD HELPERS (month is 1-12)
========================================================== */

export function monthYear(year: number, month: number): string {
  // normalises overflow (month 13 -> January next year)
  const d = new Date(year, month - 1, 1);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** Calendar quarter containing the month: 'July 2026 to September 2026' */
export function quarterLabel(year: number, month: number): string {
  const start = Math.floor((month - 1) / 3) * 3 + 1;
  return `${monthYear(year, start)} to ${monthYear(year, start + 2)}`;
}

/** First month (1-12) of the quarter */
export function quarterStart(month: number): number {
  return Math.floor((month - 1) / 3) * 3 + 1;
}

/** Financial half-year (Apr–Sep / Oct–Mar) containing the month */
export function halfYearLabel(year: number, month: number): string {
  if (month >= 4 && month <= 9) return `${monthYear(year, 4)} to ${monthYear(year, 9)}`;
  const y = month >= 10 ? year : year - 1;
  return `${monthYear(y, 10)} to ${monthYear(y, 15)}`;
}

/* =========================================================
   SERIES AGGREGATION  (mirrors lead-dashboard.php `agg()`)
========================================================== */

export interface Aggregated {
  labels: (string | string[])[]; // string[] = two-line label ['W1', '1-7']
  series: Record<string, number[]>;
  unit: 'day' | 'week' | 'month';
}

const SHORT_MONTHS = MONTH_NAMES.map((m) => m.slice(0, 3));
const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

/** Sparse day map -> dense array for the month */
export function dailyArray(map: Record<string, number> | undefined, days: number): number[] {
  return Array.from({ length: days }, (_, i) => map?.[String(i + 1)] ?? 0);
}

export function aggregate(
  data: LeadDashboardData,
  keys: SeriesKey[],
  period: Period,
  year: number,
  month: number,
): Aggregated {
  const days = daysInMonth(year, month);
  const dayLabels = Array.from({ length: days }, (_, i) => [
    String(i + 1),
    WEEKDAY[new Date(year, month - 1, i + 1).getDay()],
  ]);
  const daily = (k: SeriesKey) => dailyArray(data.daily[k], days);
  const series: Record<string, number[]> = {};

  if (period === 'yearly') {
    keys.forEach((k) => (series[k] = [...(data.yearly[k] ?? new Array(12).fill(0))]));
    return { labels: SHORT_MONTHS, series, unit: 'month' };
  }

  if (period === 'weekly') {
    const weeks = Math.ceil(days / 7);
    const labels: string[][] = [];

    for (let w = 0; w < weeks; w++) {
      const from = w * 7;
      const to = Math.min(from + 7, days);
      labels.push([`W${w + 1}`, `${from + 1}-${to}`]);
    }
    keys.forEach((k) => {
      const arr = daily(k);
      series[k] = labels.map((_, w) => sum(arr.slice(w * 7, w * 7 + 7)));
    });
    return { labels, series, unit: 'week' };
  }

  if (period === 'today') {
    const idx = todayIndex(year, month);
    keys.forEach((k) => (series[k] = [daily(k)[idx]]));
    return { labels: [dayLabels[idx]], series, unit: 'day' };
  }

  keys.forEach((k) => (series[k] = daily(k)));
  return { labels: dayLabels, series, unit: 'day' };
}

/** Today's day index when the selected month is the current one, else the 1st */
export function todayIndex(year: number, month: number): number {
  const now = new Date();
  return now.getFullYear() === year && now.getMonth() + 1 === month ? now.getDate() - 1 : 0;
}

export function labelText(label: string | string[]): string {
  return Array.isArray(label) ? label.join(' ') : label;
}

/* =========================================================
   SVG HELPERS (sparkline + ring gauge)
========================================================== */

/** Sparkline points for a 100 × 34 viewBox */
export function sparkPoints(pts: number[], w = 100, h = 34): string {
  if (!pts.length) return '';
  const min = Math.min(...pts);
  const range = Math.max(...pts) - min;

  return pts
    .map((v, i) => {
      const x = pts.length > 1 ? (i * w) / (pts.length - 1) : 0;
      const y = range > 0 ? h - 3 - ((v - min) / range) * (h - 8) : h / 2;
      return `${+x.toFixed(2)},${+y.toFixed(2)}`;
    })
    .join(' ');
}

/** Clamp to 0-100 and round */
export function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round(Math.max(0, Math.min(100, (part / whole) * 100))) : 0;
}
