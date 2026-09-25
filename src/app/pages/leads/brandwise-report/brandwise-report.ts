import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, finalize } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

import { ChartCard } from '../../../shared/dashboard/chart-card/chart-card';
import { DashSection } from '../../../shared/dashboard/dash-section/dash-section';
import { BrandwiseReportService } from './brandwise-report.service';
import { alpha, areaLine, bars, doughnut, gauge, hBars, readTheme } from './brandwise-report.charts';
import {
  BrandwiseData,
  BrandwiseFilter,
  CONVERSION_VIEWS,
  ConversionView,
  DASH_SECTIONS,
  DashSection as Section,
  HOURS,
  Kpi,
  MONTHS,
  QUICK_RANGES,
  QuickRange,
  WEEKDAYS,
} from './brandwise-report.model';
import { CalendarDatepickerDirective } from '../../../common/directives/datepicker';

@Component({
  selector: 'app-brandwise-report',
  standalone: true,
  imports: [FormsModule, SelectModule, DatePickerModule, ChartCard, DashSection, CalendarDatepickerDirective],
  templateUrl: './brandwise-report.html',
  styleUrl: './brandwise-report.scss',
})
export class BrandwiseReport {
  private service = inject(BrandwiseReportService);
  private destroyRef = inject(DestroyRef);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private loadSub?: Subscription;

  readonly ranges = QUICK_RANGES;
  readonly sections = DASH_SECTIONS;
  readonly conversionViews = CONVERSION_VIEWS;

  readonly todayLabel = formatDate(new Date());
  readonly maxDate = new Date();

  /* =========================================================
     FILTER  (range chips apply at once, the rest on Search)
  ========================================================== */

  readonly range = signal<QuickRange>('today');
  readonly date = signal<Date | null>(null);
  readonly brand = signal<string | null>(null);
  readonly product = signal<string | null>(null);
  readonly source = signal<string | null>(null);

  /* =========================================================
     STATE
  ========================================================== */

  readonly data = signal<BrandwiseData | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly section = signal<Section>('overview');
  readonly conversionView = signal<ConversionView>('day');

  /* =========================================================
     DERIVED — filter options
  ========================================================== */

  readonly brandOptions = computed(() => toOptions(this.data()?.filters.brands));
  readonly productOptions = computed(() => toOptions(this.data()?.filters.products));
  readonly sourceOptions = computed(() => toOptions(this.data()?.filters.sources));

  /* =========================================================
     DERIVED — numbers shown in section headers / badges
  ========================================================== */

  readonly revenueYtd = computed(() => sum(this.data()?.revenueTrend));
  readonly leadsTotal = computed(() => sum(this.data()?.leadsByDate));
  readonly qualifiedTotal = computed(() => sum(this.data()?.qualification.map((q) => q.value)));

  readonly targetPct = computed(() => {
    const t = this.data()?.target;
    return t?.goal ? Math.round((t.achieved / t.goal) * 100) : 0;
  });

  readonly avgBrandConversion = computed(() => {
    const list = this.data()?.brandConversion ?? [];
    return list.length ? (sum(list.map((b) => b.value)) / list.length).toFixed(1) : '0.0';
  });

  readonly countries = computed(() => {
    const list = this.data()?.countrySales ?? [];
    const top = Math.max(1, ...list.map((c) => c.share));
    return list.map((c) => ({ ...c, bar: Math.round((c.share / top) * 100) }));
  });

  readonly countryShare = computed(() => sum(this.data()?.countrySales.map((c) => c.share)));

  /** Highest first (PHP sorted server-side) */
  readonly productsSorted = computed(() =>
    [...(this.data()?.products ?? [])].sort((a, b) => b.value - a.value),
  );

  readonly sourcesSorted = computed(() =>
    [...(this.data()?.leadsBySource ?? [])].sort((a, b) => b.value - a.value),
  );

  /* =========================================================
     DERIVED — chart configs
  ========================================================== */

  private readonly theme = readTheme();

  readonly revenueChart = computed(() => {
    const d = this.data();
    return d && areaLine(this.theme, MONTHS, d.revenueTrend, { label: 'Revenue', compactY: true });
  });

  readonly targetChart = computed(() => this.data() && gauge(this.theme, this.targetPct()));

  readonly customerChart = computed(() => {
    const d = this.data();
    return d && doughnut(this.theme, d.customerInsight, [this.theme.warning, this.theme.violet]);
  });

  readonly leadsDateChart = computed(() => {
    const d = this.data();
    return d && areaLine(this.theme, last30Labels(d.leadsByDate.length), d.leadsByDate, { label: 'Leads', maxTicks: 15 });
  });

  readonly leadsSourceChart = computed(
    () => this.data() && bars(this.theme, this.sourcesSorted(), { label: 'Leads', highlightTop: true, rotateLabels: true }),
  );

  readonly conversionChart = computed(() => {
    const d = this.data();
    if (!d) return null;

    const view = this.conversionView();
    const labels = view === 'day' ? HOURS : view === 'week' ? WEEKDAYS : MONTHS;
    return areaLine(this.theme, labels, d.conversion[view], { label: 'Conversion', color: this.theme.warning, maxTicks: 12 });
  });

  readonly qualificationChart = computed(() => {
    const d = this.data();
    const t = this.theme;
    return d && doughnut(t, d.qualification, [t.primaryDark, t.primary, alpha(t.primaryLight, 0.6)]);
  });

  readonly brandConversionChart = computed(() => {
    const d = this.data();
    return d && bars(this.theme, d.brandConversion, { label: 'Conversion', suffix: '%' });
  });

  readonly productChart = computed(() => this.data() && hBars(this.theme, this.productsSorted(), 'Units'));

  /** Product chart grows with the number of products so bars stay readable */
  readonly productChartHeight = computed(() => `${Math.max(260, this.productsSorted().length * 22)}px`);

  constructor() {
    // data is browser-only: routes are prerendered, where relative HTTP URLs don't resolve
    if (this.isBrowser) this.load();
  }

  /* =========================================================
     DATA
  ========================================================== */

  load(): void {
    // drop an in-flight request so a stale response can't overwrite a newer one
    this.loadSub?.unsubscribe();
    this.loading.set(true);
    this.error.set(null);

    this.loadSub = this.service
      .getDashboard(this.currentFilter())
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (d) => this.data.set(d),
        error: () => this.error.set('Unable to load the sales dashboard. Please try again.'),
      });
  }

  private currentFilter(): BrandwiseFilter {
    const d = this.date();
    return {
      range: this.range(),
      date: d ? toIso(d) : null,
      brand: this.brand(),
      product: this.product(),
      source: this.source(),
    };
  }

  /* =========================================================
     ACTIONS
  ========================================================== */

  selectRange(range: QuickRange): void {
    if (range === this.range()) return;
    this.range.set(range);
    this.load();
  }

  search(): void {
    this.load();
  }

  reset(): void {
    this.range.set('today');
    this.date.set(null);
    this.brand.set(null);
    this.product.set(null);
    this.source.set(null);
    this.load();
  }

  /* =========================================================
     VIEW HELPERS
  ========================================================== */

  formatKpi(k: Kpi): string {
    if (k.format === 'currency') return formatInr(k.value);
    if (k.format === 'percent') return `${k.value}%`;
    return k.value.toLocaleString('en-IN');
  }

  formatInr(value: number, decimals = 0): string {
    return formatInr(value, decimals);
  }
}

/* =========================================================
   PURE HELPERS
========================================================== */

function sum(values: number[] | undefined): number {
  return (values ?? []).reduce((a, b) => a + b, 0);
}

function toOptions(values: string[] | undefined) {
  return (values ?? []).map((v) => ({ label: v, value: v }));
}

function formatInr(value: number, decimals = 0): string {
  return `₹ ${value.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

function toIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

/** Labels for the last `n` days ending today: '26 Aug' … '24 Sep' */
function last30Labels(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(`${d.getDate()} ${MONTHS[d.getMonth()]}`);
  }
  return out;
}
