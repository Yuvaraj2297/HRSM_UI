/* =========================================================
   LEAD DASHBOARD (Sales Analytics) — MODELS
========================================================== */

export type Tone = 'green' | 'blue' | 'amber' | 'red' | 'violet';
export type LdSection = 'targets' | 'activity' | 'sales' | 'sources';

/** Aggregation periods used by the proposal / funnel charts */
export type Period = 'today' | 'weekly' | 'monthly' | 'yearly';
export type AverageView = 'revenue' | 'leads' | 'wl';

export interface Staff {
  name: string;
  short: string; // chart label
}

export interface KpiData {
  label: string;
  value: number;
  /** sub text: fixed text, 'period' (= selected month), or a ₹ amount */
  note?: string;
  amount?: number;
  icon: string;
  tone: Tone;
  trend: number[]; // sparkline points, oldest first
}

export interface Leader {
  name: string;
  amount: number;
}

export interface TargetData {
  title: string;
  icon: string;
  total: number;
  achieved: number;
  pending: number;
}

export interface TargetAchieved {
  t: number; // target
  a: number; // achieved
}

export interface StaffSummaryRow {
  name: string;
  cur: TargetAchieved;
  qtr: TargetAchieved;
  half: TargetAchieved;
}

export interface SourceRow {
  name: string;
  leads: number;
  quotes: number;
  customers: number;
}

export interface Averages {
  revenue: number;
  qualityLeads: number;
  totalLeads: number;
  winLead: number;
  winQuote: number;
  lostRate: number; // %
}

/** Daily / yearly series keys */
export type SeriesKey =
  | 'leads' | 'quotes' | 'pvalue' | 'orders' | 'ovalue' | 'proforma'
  | 'pfvalue' | 'invoice' | 'icount' | 'payments' | 'paycount';

/** Response shape of lead-dashboard.json (and the future API) */
export interface LeadDashboardData {
  staff: Staff[];
  kpis: KpiData[];
  leaders: Leader[];
  targets: TargetData[];
  staffSummary: StaffSummaryRow[];
  sources: SourceRow[];
  averages: Averages;
  /** sparse: daily[key]['16'] = value on the 16th; missing day = 0 */
  daily: Record<SeriesKey, Record<string, number>>;
  /** 12 monthly totals, Jan..Dec */
  yearly: Record<SeriesKey, number[]>;
  /** per staff, same order as `staff` */
  calls: { meeting: number[]; call: number[] };
  /** signed value (negative = credit / refund); the doughnut uses the absolute size */
  pipeline: { label: string; value: number }[];
  /** quarter months × staff */
  averageByStaff: { revenue: number[][]; leads: number[][]; won: number[]; lost: number[] };
}

/* =========================================================
   CONSTANTS
========================================================== */

export const LD_SECTIONS: { key: LdSection; label: string; icon: string }[] = [
  { key: 'targets', label: 'Targets & Team', icon: 'bi bi-bullseye' },
  { key: 'activity', label: 'Calls & Pipeline', icon: 'bi bi-telephone' },
  { key: 'sales', label: 'Sales & Funnel', icon: 'bi bi-graph-up-arrow' },
  { key: 'sources', label: 'Sources & Averages', icon: 'bi bi-bar-chart' },
];

export const PROPOSAL_PERIODS: { key: Period; label: string }[] = [
  { key: 'monthly', label: 'Monthly' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'yearly', label: 'Yearly' },
];

export const FUNNEL_PERIODS: { key: Period; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
];

export const AVERAGE_VIEWS: { key: AverageView; label: string; title: string }[] = [
  { key: 'revenue', label: 'Revenue', title: 'Revenue by staff' },
  { key: 'leads', label: 'Leads', title: 'Leads by staff' },
  { key: 'wl', label: 'W/L', title: 'Won vs lost' },
];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
