import type { ChartData, ChartOptions, TooltipItem } from 'chart.js';

import {
  cssColor,
  ChartTheme,
  alpha,
  fade,
  formatInr,
  legendStyle,
  shortInr,
  tickStyle,
  tooltipStyle,
} from '../../../shared/dashboard/chart-utils';
import { AverageView, LeadDashboardData } from './lead-dashboard.model';
import { Aggregated, labelText } from './lead-dashboard.utils';

/* =========================================================
   CHART BUILDERS — { data, options } for <p-chart>
========================================================== */

export interface BarLineConfig {
  data: ChartData<'bar' | 'line'>;
  options: ChartOptions<'bar'>;
}

export interface BarConfig {
  data: ChartData<'bar'>;
  options: ChartOptions<'bar'>;
}

export interface DoughnutConfig {
  data: ChartData<'doughnut'>;
  options: ChartOptions<'doughnut'>;
}

/** Colours per staff in the grouped bar charts */
export function staffColors(t: ChartTheme): string[] {
  return [t.blue, t.primary, cssColor('--green-250'), t.violet, t.warning, cssColor('--teal-550-2')];
}

/** Datasets whose label contains ₹ are shown as money in the tooltip */
function base(t: ChartTheme): ChartOptions<'bar'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: legendStyle(t, 'top', 'end'),
      tooltip: {
        ...tooltipStyle(t),
        callbacks: {
          title: (items: TooltipItem<'bar'>[]) =>
            items.length ? labelText(items[0].chart.data.labels?.[items[0].dataIndex] as string | string[]) : '',
          label: (c: TooltipItem<'bar'>) => {
            const v = Number(c.parsed.y ?? c.parsed);
            const money = c.dataset.label?.includes('₹');
            return ` ${c.dataset.label}: ${money ? formatInr(v) : v}`;
          },
        },
      },
    },
  };
}

/** ₹ on the left axis, counts on the right */
function moneyAndCount(t: ChartTheme): ChartOptions<'bar'>['scales'] {
  return {
    x: { grid: { display: false }, ticks: tickStyle(t, { maxRotation: 0, font: { family: t.font, size: 10 } }) },
    y: {
      position: 'left',
      grid: { color: t.grid },
      border: { display: false },
      ticks: tickStyle(t, { callback: shortInr, font: { family: t.font, size: 10 } }),
    },
    y1: {
      position: 'right',
      beginAtZero: true,
      grid: { drawOnChartArea: false },
      border: { display: false },
      ticks: tickStyle(t, { precision: 0, font: { family: t.font, size: 10 } }),
    },
  };
}

/* ---------------------------------------------------------
   Sales – proposals / quotations
---------------------------------------------------------- */
export function proposalsChart(t: ChartTheme, a: Aggregated): BarLineConfig {
  return {
    data: {
      labels: a.labels,
      datasets: [
        {
          type: 'bar',
          label: 'Proposals count',
          data: a.series['quotes'],
          backgroundColor: alpha(t.blue, 0.55),
          hoverBackgroundColor: alpha(t.blue, 0.85),
          borderRadius: 6,
          maxBarThickness: 34,
          yAxisID: 'y1',
          order: 2,
        },
        {
          type: 'line',
          label: 'Proposal value (₹)',
          data: a.series['pvalue'],
          borderColor: t.primary,
          backgroundColor: fade(t.primary, 0.28, 0),
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: cssColor('--white'),
          pointBorderColor: t.primary,
          pointBorderWidth: 2,
          tension: 0.35,
          fill: true,
          yAxisID: 'y',
          order: 1,
        },
      ],
    },
    options: { ...base(t), scales: moneyAndCount(t) },
  };
}

/* ---------------------------------------------------------
   Sales funnel
---------------------------------------------------------- */
export function funnelChart(t: ChartTheme, a: Aggregated): BarLineConfig {
  const bar = (label: string, key: string, color: string) => ({
    type: 'bar' as const,
    label,
    data: a.series[key],
    backgroundColor: color,
    borderRadius: 5,
    maxBarThickness: 22,
    yAxisID: 'y1',
    order: 3,
  });

  return {
    data: {
      labels: a.labels,
      datasets: [
        bar('Leads', 'leads', alpha(t.blue, 0.7)),
        bar('Quotes', 'quotes', alpha(t.warning, 0.75)),
        bar('Sales orders', 'orders', alpha(t.grey, 0.75)),
        bar('Proforma', 'proforma', alpha(t.pink, 0.65)),
        {
          type: 'line',
          label: 'Invoice value (₹)',
          data: a.series['invoice'],
          borderColor: t.primary,
          backgroundColor: t.primary,
          borderWidth: 2.5,
          pointRadius: 3,
          tension: 0.35,
          yAxisID: 'y',
          order: 1,
        },
        {
          type: 'line',
          label: 'Payments (₹)',
          data: a.series['payments'],
          borderColor: t.violet,
          backgroundColor: t.violet,
          borderWidth: 2.5,
          borderDash: [5, 4],
          pointRadius: 3,
          tension: 0.35,
          yAxisID: 'y',
          order: 2,
        },
      ],
    },
    options: { ...base(t), scales: moneyAndCount(t) },
  };
}

/* ---------------------------------------------------------
   Calls & meetings (per staff)
---------------------------------------------------------- */
export function callsChart(t: ChartTheme, d: LeadDashboardData): BarConfig {
  return {
    data: {
      labels: d.staff.map((s) => s.short),
      datasets: [
        { label: 'Meeting', data: d.calls.meeting, backgroundColor: alpha(t.blue, 0.75), borderRadius: 6, maxBarThickness: 30 },
        { label: 'Call summary', data: d.calls.call, backgroundColor: alpha(t.primary, 0.75), borderRadius: 6, maxBarThickness: 30 },
      ],
    },
    options: {
      ...base(t),
      scales: {
        x: { grid: { display: false }, ticks: tickStyle(t) },
        y: {
          beginAtZero: true,
          grid: { color: t.grid },
          border: { display: false },
          ticks: tickStyle(t, { precision: 0, font: { family: t.font, size: 10 } }),
        },
      },
    },
  };
}

/* ---------------------------------------------------------
   Pipeline doughnut — slice size is |value|, tooltip shows signed value
---------------------------------------------------------- */
export function pipelineColors(t: ChartTheme): string[] {
  return [t.blue, t.warning, t.primary, t.violet];
}

export function pipelineChart(t: ChartTheme, d: LeadDashboardData): DoughnutConfig {
  return {
    data: {
      labels: d.pipeline.map((p) => p.label),
      datasets: [
        {
          data: d.pipeline.map((p) => Math.abs(p.value)),
          backgroundColor: pipelineColors(t),
          borderColor: cssColor('--white'),
          borderWidth: 3,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipStyle(t),
          callbacks: { label: (c) => ` ${d.pipeline[c.dataIndex].label}: ${formatInr(d.pipeline[c.dataIndex].value)}` },
        },
      },
    },
  };
}

/* ---------------------------------------------------------
   Top lead sources (horizontal)
---------------------------------------------------------- */
export function sourcesChart(t: ChartTheme, top: { name: string; leads: number }[]): BarConfig {
  return {
    data: {
      labels: top.map((s) => s.name),
      datasets: [
        {
          label: 'Total lead',
          data: top.map((s) => s.leads),
          backgroundColor: alpha(t.primary, 0.8),
          hoverBackgroundColor: t.primary,
          borderRadius: 6,
          maxBarThickness: 22,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { ...tooltipStyle(t), callbacks: { label: (c) => ` Total lead: ${c.parsed.x}` } },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: t.grid },
          border: { display: false },
          ticks: tickStyle(t, { precision: 0, font: { family: t.font, size: 10 } }),
        },
        y: { grid: { display: false }, ticks: tickStyle(t, { font: { family: t.font, size: 11, weight: 'bold' } }) },
      },
    },
  };
}

/* ---------------------------------------------------------
   Average sales (quarter months) — revenue / leads per staff, or won vs lost
---------------------------------------------------------- */
export function averageChart(t: ChartTheme, d: LeadDashboardData, view: AverageView, months: string[]): BarConfig {
  const colors = staffColors(t);
  const perStaff = (rows: number[][]) =>
    d.staff.map((s, i) => ({
      label: s.short,
      data: rows[i] ?? [],
      backgroundColor: colors[i % colors.length],
      borderRadius: 6,
      maxBarThickness: 26,
    }));

  const datasets =
    view === 'wl'
      ? [
          { label: 'Won', data: d.averageByStaff.won, backgroundColor: t.primary, borderRadius: 6, maxBarThickness: 34 },
          { label: 'Lost', data: d.averageByStaff.lost, backgroundColor: t.danger, borderRadius: 6, maxBarThickness: 34 },
        ]
      : perStaff(view === 'leads' ? d.averageByStaff.leads : d.averageByStaff.revenue);

  const opts = base(t);
  if (view === 'revenue') {
    opts.plugins!.tooltip!.callbacks!.label = (c) => ` ${c.dataset.label}: ${formatInr(Number(c.parsed.y))}`;
  }

  return {
    data: { labels: months, datasets },
    options: {
      ...opts,
      scales: {
        x: { grid: { display: false }, ticks: tickStyle(t), title: { display: true, text: 'Month', color: t.text, font: { size: 10 } } },
        y: {
          grid: { color: t.grid },
          border: { display: false },
          title: { display: true, text: view === 'revenue' ? 'Amount' : view === 'leads' ? 'Leads' : 'Deals', color: t.text, font: { size: 10 } },
          ticks: tickStyle(t, view === 'revenue' ? { callback: shortInr } : { precision: 0 }),
        },
      },
    },
  };
}
