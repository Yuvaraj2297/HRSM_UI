import { AppStatCard } from '../../../shared/stat-card/stat-card';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker'; // PrimeNG v18+. On v17 use CalendarModule / <p-calendar>.
import { CalendarDatepickerDirective } from '../../../common/directives/datepicker';

type Pair = [overall: number, now: number];
type MetricKey = 'assign' | 'sourcerLeads' | 'sourcer' | 'bv' | 'cv' | 'visits' | 'km';
type MetricType = 'pair' | 'money' | 'plain';
type Theme = 'green' | 'blue' | 'violet' | 'amber' | 'red';

interface EmployeeRow {
  id: string;
  name: string;
  mobile: string;
  avatar: string;
  assign: Pair;
  sourcerLeads: Pair;
  sourcer: Pair;
  bv: number;
  cv: number;
  visits: Pair;
  km: number;
}

interface MetricDef {
  key: MetricKey;
  label: string;
  icon: string;
  theme: Theme;
  type: MetricType;
}

/** What one metric row on a card needs to render. */
interface MetricView {
  key: MetricKey;
  label: string;
  icon: string;
  theme: Theme;
  display: string;
  pct: number;
  neg: boolean;
}

interface CardView {
  id: string;
  name: string;
  avatar: string;
  metrics: MetricView[];
}

interface AppliedFilters {
  search: string;
  from: Date;
  to: Date;
}

/** One place to add / remove / rename rows on every card (same as the PHP $metrics array). */
const METRICS: MetricDef[] = [
  { key: 'assign',       label: 'Success Leads By Assign',  icon: 'bi-person-check',   theme: 'green',  type: 'pair' },
  { key: 'sourcerLeads', label: 'Success Leads By Sourcer', icon: 'bi-people',         theme: 'blue',   type: 'pair' },
  { key: 'sourcer',      label: 'Sourcer',                  icon: 'bi-search',         theme: 'violet', type: 'pair' },
  { key: 'bv',           label: 'Total BV',                 icon: 'bi-currency-rupee', theme: 'amber',  type: 'money' },
  { key: 'cv',           label: 'Total CV',                 icon: 'bi-wallet2',        theme: 'green',  type: 'money' },
  { key: 'visits',       label: 'Total Visits',             icon: 'bi-geo-alt',        theme: 'blue',   type: 'pair' },
  { key: 'km',           label: 'Total Kilometers',         icon: 'bi-speedometer2',   theme: 'red',    type: 'plain' },
];

/** Sample data copied from the PHP page — replace with your API response. */
const SAMPLE_EMPLOYEES: EmployeeRow[] = [
  { id: 'EMP0001', name: 'ghrA TESTER',      mobile: '9876500001', avatar: '',                            assign: [1, 0],  sourcerLeads: [0, 0], sourcer: [0, 0],  bv: 0,          cv: 0,   visits: [1, 0],  km: 0 },
  { id: 'EMP0002', name: 'GHARUDA SOFTWARE', mobile: '9876500002', avatar: './assets/img/profile-2.jpg', assign: [17, 0], sourcerLeads: [0, 0], sourcer: [82, 2], bv: -105708.24, cv: 999, visits: [51, 0], km: 0 },
  { id: 'EMP0003', name: 'ASHISH',           mobile: '9876500003', avatar: './assets/img/profile-3.jpg', assign: [0, 0],  sourcerLeads: [0, 0], sourcer: [0, 0],  bv: 0,          cv: 0,   visits: [0, 0],  km: 0 },
  { id: 'EMP0004', name: 'Thilak Ma',        mobile: '9876500004', avatar: '',                            assign: [0, 0],  sourcerLeads: [0, 0], sourcer: [0, 0],  bv: 0,          cv: 0,   visits: [0, 0],  km: 0 },
  { id: 'EMP0005', name: 'Jude S',           mobile: '9876500005', avatar: '',                            assign: [4, 0],  sourcerLeads: [0, 0], sourcer: [0, 0],  bv: 0,          cv: 0,   visits: [0, 0],  km: 0 },
  { id: 'EMP0006', name: 'PREM KUMAR.R',     mobile: '9876500006', avatar: '',                            assign: [1, 0],  sourcerLeads: [0, 0], sourcer: [1, 0],  bv: 0,          cv: 0,   visits: [0, 0],  km: 0 },
  { id: 'EMP0007', name: 'Akash Kumar',      mobile: '9876500007', avatar: '',                            assign: [0, 0],  sourcerLeads: [0, 0], sourcer: [0, 0],  bv: 0,          cv: 0,   visits: [0, 0],  km: 0 },
  { id: 'EMP0008', name: 'ARUN KUMAR',       mobile: '9876500008', avatar: '',                            assign: [0, 0],  sourcerLeads: [0, 0], sourcer: [0, 0],  bv: 0,          cv: 0,   visits: [0, 0],  km: 0 },
];

const firstDayOfMonth = (): Date => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};
const lastDayOfMonth = (): Date => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
};
/** dd-mm-yyyy, like the rest of the app */
const formatDMY = (d: Date): string =>
  `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;

/** PHP: '₹ ' . number_format($v, 2) */
const formatMoney = (v: number): string =>
  '₹ ' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

@Component({
  selector: 'app-employee-revenue-report',
  imports: [FormsModule, DatePicker, CalendarDatepickerDirective, AppStatCard],
  templateUrl: './employee-revenue-report.html',
  styleUrl: './employee-revenue-report.scss',
})
export class EmployeeRevenueReport {
  // ---------- data ----------
  /** Swap for your API result: this.employees.set(response) */
  private readonly employees = signal<EmployeeRow[]>(SAMPLE_EMPLOYEES);

  // ---------- filter form (what the user is typing / picking) ----------
  search = '';
  fromDate: Date | null = firstDayOfMonth();
  toDate: Date | null = lastDayOfMonth();

  // ---------- filters that were actually applied (after Search) ----------
  private readonly applied = signal<AppliedFilters>({
    search: '',
    from: firstDayOfMonth(),
    to: lastDayOfMonth(),
  });

  readonly dateRangeLabel = computed(() => {
    const { from, to } = this.applied();
    return `${formatDMY(from)} to ${formatDMY(to)}`;
  });

  /** Employees matching name / mobile / employee id. */
  private readonly visible = computed(() => {
    const q = this.applied().search.toLowerCase();
    // TODO: when the real API is wired, pass applied().from / applied().to to it.
    if (!q) return this.employees();
    return this.employees().filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.mobile.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q),
    );
  });

  /** Top summary cards (Employees / Success Leads / Sourcer / Visits / Kilometers). */
  readonly summary = computed(() => {
    const list = this.visible();
    const sum = (fn: (e: EmployeeRow) => number) => list.reduce((t, e) => t + fn(e), 0);
    return {
      employees: list.length,
      assign: sum((e) => e.assign[0]),
      sourcer: sum((e) => e.sourcer[0]),
      visits: sum((e) => e.visits[0]),
      km: sum((e) => e.km),
    };
  });

  /** One view-model per employee card, with display text and progress-bar % already worked out. */
  readonly cards = computed<CardView[]>(() => {
    const list = this.visible();

    // Max per single-value metric — used to scale the progress bars
    const max: Partial<Record<MetricKey, number>> = {};
    for (const m of METRICS) {
      if (m.type === 'pair') continue;
      max[m.key] = Math.max(0, ...list.map((e) => Math.abs(e[m.key] as number)));
    }

    return list.map((e) => ({
      id: e.id,
      name: e.name,
      avatar: e.avatar,
      metrics: METRICS.map((m): MetricView => {
        const base = { key: m.key, label: m.label, icon: m.icon, theme: m.theme };
        const maxVal = max[m.key] ?? 0;

        if (m.type === 'pair') {
          const [overall, now] = e[m.key] as Pair;
          const pct = overall > 0 ? Math.min(100, Math.round((now / overall) * 100)) : 0;
          return { ...base, display: `${overall} / ${now}`, pct, neg: false };
        }
        if (m.type === 'money') {
          const v = e[m.key] as number;
          const pct = maxVal > 0 ? Math.round((Math.abs(v) / maxVal) * 100) : 0;
          return { ...base, display: formatMoney(v), pct, neg: v < 0 };
        }
        const v = e[m.key] as number;
        const pct = maxVal > 0 ? Math.round((v / maxVal) * 100) : 0;
        return { ...base, display: String(v), pct, neg: false };
      }),
    }));
  });

  // ---------- actions ----------
  onSearch(): void {
    let from = this.fromDate ?? firstDayOfMonth();
    let to = this.toDate ?? lastDayOfMonth();
    if (from > to) [from, to] = [to, from]; // same swap as the PHP page

    this.fromDate = from;
    this.toDate = to;
    this.applied.set({ search: this.search.trim(), from, to });
  }

  onClear(): void {
    this.search = '';
    this.fromDate = firstDayOfMonth();
    this.toDate = lastDayOfMonth();
    this.applied.set({ search: '', from: this.fromDate, to: this.toDate });
  }
}
