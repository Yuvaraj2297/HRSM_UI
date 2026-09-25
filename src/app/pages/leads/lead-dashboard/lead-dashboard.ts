import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, finalize } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { ChartModule } from 'primeng/chart';

import { DashSection } from '../../../shared/dashboard/dash-section/dash-section';
import { formatInr, readTheme } from '../../../shared/dashboard/chart-utils';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
} from '../../../shared/primedatatable/primedatatable';
import { LdKpiCard } from './components/ld-kpi-card/ld-kpi-card';
import { LdSpotlight } from './components/ld-spotlight/ld-spotlight';
import { LdStaffSummary, SummaryPeriod } from './components/ld-staff-summary/ld-staff-summary';
import { LdTargetCard } from './components/ld-target-card/ld-target-card';
import { LeadDashboardService } from './lead-dashboard.service';
import {
  averageChart,
  callsChart,
  funnelChart,
  pipelineChart,
  pipelineColors,
  proposalsChart,
  sourcesChart,
} from './lead-dashboard.charts';
import {
  AVERAGE_VIEWS,
  AverageView,
  FUNNEL_PERIODS,
  LD_SECTIONS,
  LdSection,
  LeadDashboardData,
  MONTH_NAMES,
  PROPOSAL_PERIODS,
  Period,
} from './lead-dashboard.model';
import {
  aggregate,
  halfYearLabel,
  labelText,
  monthYear,
  quarterLabel,
  quarterStart,
  sum,
} from './lead-dashboard.utils';

@Component({
  selector: 'app-lead-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    SelectModule,
    ChartModule,
    DashSection,
    PrimeDataTable,
    LdKpiCard,
    LdSpotlight,
    LdStaffSummary,
    LdTargetCard,
  ],
  templateUrl: './lead-dashboard.html',
  styleUrl: './lead-dashboard.scss',
})
export class LeadDashboard {
  private service = inject(LeadDashboardService);
  private destroyRef = inject(DestroyRef);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private theme = readTheme();

  private loadSub?: Subscription;
  private funnelSub?: Subscription;

  readonly sections = LD_SECTIONS;
  readonly proposalPeriods = PROPOSAL_PERIODS;
  readonly funnelPeriods = FUNNEL_PERIODS;
  readonly averageViews = AVERAGE_VIEWS;
  readonly inr = formatInr;

  /* =========================================================
     PERIOD (month / year picker, applied on Apply)
  ========================================================== */

  private readonly now = new Date();

  readonly monthOptions = MONTH_NAMES.map((m, i) => ({ label: m, value: i + 1 }));
  readonly yearOptions = Array.from({ length: 5 }, (_, i) => {
    const y = this.now.getFullYear() - 3 + i;
    return { label: String(y), value: y };
  });

  readonly monthInput = signal(this.now.getMonth() + 1);
  readonly yearInput = signal(this.now.getFullYear());

  readonly month = signal(this.now.getMonth() + 1);
  readonly year = signal(this.now.getFullYear());

  readonly periodLabel = computed(() => monthYear(this.year(), this.month()));

  readonly summaryPeriods = computed<SummaryPeriod[]>(() => [
    { key: 'cur', label: 'Current month', range: this.periodLabel() },
    { key: 'qtr', label: 'Quarterly', range: quarterLabel(this.year(), this.month()) },
    { key: 'half', label: 'Halfly', range: halfYearLabel(this.year(), this.month()) },
  ]);

  /* =========================================================
     STATE
  ========================================================== */

  readonly data = signal<LeadDashboardData | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly section = signal<LdSection>('targets');
  readonly proposalPeriod = signal<Period>('monthly');
  readonly funnelPeriod = signal<Period>('monthly');
  readonly averageView = signal<AverageView>('revenue');

  /** Funnel staff filter; its own data so the rest of the page stays on "all staff" */
  readonly funnelStaff = signal<string>('');
  private readonly funnelData = signal<LeadDashboardData | null>(null);

  readonly funnelStaffOptions = computed(() => [
    { label: 'All staff', value: '' },
    ...(this.data()?.staff ?? []).map((s) => ({ label: s.short, value: s.name })),
  ]);

  /* =========================================================
     TABLE — source-wise summary (shared table)
  ========================================================== */

  readonly sourceHeader: PrimeTableHeader = { title: 'Source-wise summary', icon: 'bi bi-diagram-3' };

  readonly sourceColumns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', width: '70px', sortable: false },
    { field: 'name', header: 'Source', type: 'custom', sortable: true },
    { field: 'leads', header: 'Total lead', type: 'custom', sortable: true },
    { field: 'quotes', header: 'Total quote', sortable: true },
    { field: 'customers', header: 'Customer', sortable: true },
  ];

  /** Highest lead count first */
  readonly sources = computed(() =>
    [...(this.data()?.sources ?? [])].sort((a, b) => b.leads - a.leads),
  );

  readonly maxLeads = computed(() => Math.max(1, ...this.sources().map((s) => s.leads)));

  /* =========================================================
     DERIVED — numbers
  ========================================================== */

  readonly averages = computed(() => {
    const a = this.data()?.averages;
    if (!a) return null;
    return {
      ...a,
      winRate: a.winQuote > 0 ? +((a.winLead / a.winQuote) * 100).toFixed(2) : 0,
      qualityPct: a.totalLeads > 0 ? +((a.qualityLeads / a.totalLeads) * 100).toFixed(1) : 0,
    };
  });

  readonly pipelineNet = computed(() => sum((this.data()?.pipeline ?? []).map((p) => p.value)));

  readonly pipelineLegend = computed(() => {
    const list = this.data()?.pipeline ?? [];
    const total = sum(list.map((p) => Math.abs(p.value)));
    const colors = pipelineColors(this.theme);
    return list.map((p, i) => ({
      ...p,
      color: colors[i % colors.length],
      share: total ? Math.round((Math.abs(p.value) / total) * 100) : 0,
    }));
  });

  private readonly proposalAgg = computed(() => {
    const d = this.data();
    return d ? aggregate(d, ['quotes', 'pvalue'], this.proposalPeriod(), this.year(), this.month()) : null;
  });

  readonly proposalMetrics = computed(() => {
    const a = this.proposalAgg();
    if (!a) return [];

    const counts = a.series['quotes'];
    const values = a.series['pvalue'];
    const total = sum(counts);
    const totalValue = sum(values);
    const active = values.filter((v) => v > 0).length;
    const peak = counts.indexOf(Math.max(...counts));

    return [
      { tone: 'blue', label: 'Total proposals', value: String(total) },
      { tone: 'green', label: 'Total value', value: formatInr(totalValue) },
      { tone: 'amber', label: `Average per ${a.unit}`, value: formatInr(active ? totalValue / active : 0) },
      { tone: 'violet', label: `Peak ${a.unit}`, value: total ? labelText(a.labels[peak]) : '-' },
    ];
  });

  private readonly funnelAgg = computed(() => {
    const d = this.funnelData() ?? this.data();
    return d
      ? aggregate(
          d,
          ['leads', 'quotes', 'pvalue', 'orders', 'ovalue', 'proforma', 'pfvalue', 'invoice', 'icount', 'payments', 'paycount'],
          this.funnelPeriod(),
          this.year(),
          this.month(),
        )
      : null;
  });

  readonly funnelSteps = computed(() => {
    const a = this.funnelAgg();
    if (!a) return [];
    const s = (k: string) => sum(a.series[k]);

    return [
      { tone: 'blue', icon: 'bi-bullseye', label: 'Leads', value: String(s('leads')), sub: '' },
      { tone: 'amber', icon: 'bi-file-earmark-text', label: 'Quotes', value: String(s('quotes')), sub: formatInr(s('pvalue')) },
      { tone: 'grey', icon: 'bi-cart-check', label: 'Sales orders', value: String(s('orders')), sub: formatInr(s('ovalue')) },
      { tone: 'pink', icon: 'bi-receipt', label: 'Proforma', value: String(s('proforma')), sub: formatInr(s('pfvalue')) },
      { tone: 'green', icon: 'bi-cash-stack', label: 'Invoice value', value: formatInr(s('invoice')), sub: `${s('icount')} invoices` },
      { tone: 'violet', icon: 'bi-wallet2', label: 'Payments', value: formatInr(s('payments')), sub: `${s('paycount')} payments` },
    ];
  });

  /** The three months of the selected quarter */
  readonly quarterMonths = computed(() => {
    const start = quarterStart(this.month());
    return [0, 1, 2].map((i) => MONTH_NAMES[start - 1 + i]);
  });

  readonly averageTitle = computed(
    () => AVERAGE_VIEWS.find((v) => v.key === this.averageView())?.title ?? '',
  );

  /* =========================================================
     DERIVED — charts
  ========================================================== */

  readonly callsChart = computed(() => {
    const d = this.data();
    return d && callsChart(this.theme, d);
  });

  readonly pipelineChart = computed(() => {
    const d = this.data();
    return d && pipelineChart(this.theme, d);
  });

  readonly proposalsChart = computed(() => {
    const a = this.proposalAgg();
    return a && proposalsChart(this.theme, a);
  });

  readonly funnelChart = computed(() => {
    const a = this.funnelAgg();
    return a && funnelChart(this.theme, a);
  });

  readonly sourcesChart = computed(() =>
    this.data() ? sourcesChart(this.theme, this.sources().slice(0, 6)) : null,
  );

  readonly averageChart = computed(() => {
    const d = this.data();
    return d && averageChart(this.theme, d, this.averageView(), this.quarterMonths());
  });

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
      .getDashboard(this.month(), this.year())
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (d) => {
          this.data.set(d);
          // re-apply a chosen funnel staff for the new period
          if (this.funnelStaff()) this.loadFunnel(this.funnelStaff());
        },
        error: () => this.error.set('Unable to load the sales analytics. Please try again.'),
      });
  }

  private loadFunnel(staff: string): void {
    this.funnelSub?.unsubscribe();

    if (!staff) {
      this.funnelData.set(null);
      return;
    }

    this.funnelSub = this.service
      .getDashboard(this.month(), this.year(), staff)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (d) => this.funnelData.set(d),
        error: () => this.funnelData.set(null),
      });
  }

  /* =========================================================
     ACTIONS
  ========================================================== */

  applyPeriod(): void {
    this.month.set(this.monthInput());
    this.year.set(this.yearInput());
    this.load();
  }

  onFunnelStaff(staff: string): void {
    this.funnelStaff.set(staff ?? '');
    this.loadFunnel(staff ?? '');
  }

  leadBar(leads: number): number {
    return Math.round((leads / this.maxLeads()) * 100);
  }
}
