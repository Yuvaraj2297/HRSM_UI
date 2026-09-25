/* =========================================================
   BRANDWISE REPORT (Sales Performance Dashboard) — MODELS
========================================================== */

export type KpiFormat = 'number' | 'percent' | 'currency';
export type KpiTone = 'blue' | 'amber' | 'green' | 'red';

export type QuickRange = 'today' | 'week' | 'month' | 'year';
export type DashSection = 'overview' | 'leads' | 'qualification' | 'geo';
export type ConversionView = 'day' | 'week' | 'month';

export interface LabelValue {
  label: string;
  value: number;
}

export interface Kpi {
  key: string;
  label: string;
  sub: string;
  value: number;
  format: KpiFormat;
  delta: number; // % vs last month (negative = down)
  tone: KpiTone;
  icon: string; // bootstrap icon class, e.g. 'bi-people-fill'
}

export interface CountrySale {
  flag: string;
  country: string;
  revenue: number;
  share: number; // % of total revenue
}

/** Response shape of brandwise-report.json (and the future API) */
export interface BrandwiseData {
  filters: {
    brands: string[];
    products: string[];
    sources: string[];
  };
  kpis: Kpi[];
  revenueTrend: number[]; // Jan..Dec
  target: { achieved: number; goal: number };
  customerInsight: LabelValue[];
  leadsByDate: number[]; // last 30 days, oldest first
  leadsBySource: LabelValue[];
  conversion: Record<ConversionView, number[]>;
  qualification: LabelValue[];
  brandConversion: LabelValue[];
  countrySales: CountrySale[];
  products: LabelValue[];
}

export interface BrandwiseFilter {
  range: QuickRange;
  date: string | null; // 'yyyy-mm-dd'
  brand: string | null;
  product: string | null;
  source: string | null;
}

/* =========================================================
   CONSTANTS
========================================================== */

export const QUICK_RANGES: { key: QuickRange; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
];

export const DASH_SECTIONS: { key: DashSection; label: string; icon: string }[] = [
  { key: 'overview', label: 'Overview', icon: 'bi bi-speedometer2' },
  { key: 'leads', label: 'Lead Generation', icon: 'bi bi-person-plus-fill' },
  { key: 'qualification', label: 'Qualification & Brands', icon: 'bi bi-funnel-fill' },
  { key: 'geo', label: 'Geography & Products', icon: 'bi bi-globe-americas' },
];

export const CONVERSION_VIEWS: { key: ConversionView; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const HOURS = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`);
