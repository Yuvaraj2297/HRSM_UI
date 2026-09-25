import { ChartConfig, ChartTheme, alpha, cssColor, fade } from '../../../shared/dashboard/chart-utils';
import { LabelValue } from './brandwise-report.model';

export { alpha, readTheme } from '../../../shared/dashboard/chart-utils';

/* =========================================================
   CHART BUILDERS — return { data, options } for <p-chart>
   Colours are read from the app theme (variable.scss) so the
   charts follow the theme; fallbacks cover SSR / missing vars.
========================================================== */

function tooltip(t: ChartTheme) {
  return {
    backgroundColor: cssColor('--neutral-900-5'),
    padding: 10,
    cornerRadius: 9,
    boxPadding: 4,
    titleFont: { family: t.font, weight: 'bold' as const, size: 12 },
    bodyFont: { family: t.font, size: 12 },
  };
}

function ticks(t: ChartTheme, extra: Record<string, unknown> = {}) {
  return { color: t.text, font: { family: t.font, size: 11 }, ...extra };
}

function legendBottom(t: ChartTheme) {
  return {
    position: 'bottom' as const,
    labels: { color: t.text, usePointStyle: true, boxWidth: 10, font: { family: t.font, size: 12 } },
  };
}

/** 125000 -> '125k' */
function compact(v: number | string): string {
  const n = Number(v);
  return n >= 1000 ? `${n / 1000}k` : String(n);
}

/* ---------------------------------------------------------
   Builders
---------------------------------------------------------- */

/** Smooth filled line (revenue trend, leads by date, conversion) */
export function areaLine(
  t: ChartTheme,
  labels: string[],
  values: number[],
  opts: { label: string; color?: string; compactY?: boolean; maxTicks?: number } = { label: '' },
): ChartConfig<'line'> {
  const color = opts.color ?? t.primary;

  return {
    data: {
      labels,
      datasets: [
        {
          label: opts.label,
          data: values,
          borderColor: color,
          backgroundColor: fade(color, 0.26, 0.02),
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: cssColor('--white'),
          pointHoverBorderWidth: 2,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false }, tooltip: tooltip(t) },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: t.grid },
          ticks: ticks(t, opts.compactY ? { callback: compact } : {}),
        },
        x: {
          grid: { display: false },
          ticks: ticks(t, opts.maxTicks ? { maxTicksLimit: opts.maxTicks } : {}),
        },
      },
    },
  };
}

/** Vertical bars; the highest bar is highlighted (leads by source, brand conversion) */
export function bars(
  t: ChartTheme,
  items: LabelValue[],
  opts: { label: string; highlightTop?: boolean; rotateLabels?: boolean; suffix?: string },
): ChartConfig<'bar'> {
  const max = Math.max(0, ...items.map((i) => i.value));

  return {
    data: {
      labels: items.map((i) => i.label),
      datasets: [
        {
          label: opts.label,
          data: items.map((i) => i.value),
          backgroundColor: items.map((i) =>
            opts.highlightTop && i.value === max ? t.primaryDark : alpha(t.primary, 0.6),
          ),
          hoverBackgroundColor: t.primary,
          borderRadius: 6,
          maxBarThickness: 42,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltip(t),
          callbacks: opts.suffix ? { label: (c) => ` ${c.formattedValue}${opts.suffix}` } : {},
        },
      },
      scales: {
        y: { beginAtZero: true, grid: { color: t.grid }, ticks: ticks(t) },
        x: {
          grid: { display: false },
          ticks: ticks(t, opts.rotateLabels ? { maxRotation: 55, minRotation: 40, font: { family: t.font, size: 10 } } : {}),
        },
      },
    },
  };
}

/** Horizontal bars (product performance) */
export function hBars(t: ChartTheme, items: LabelValue[], label: string): ChartConfig<'bar'> {
  return {
    data: {
      labels: items.map((i) => i.label),
      datasets: [
        {
          label,
          data: items.map((i) => i.value),
          backgroundColor: alpha(t.primary, 0.6),
          hoverBackgroundColor: t.primary,
          borderRadius: 5,
          maxBarThickness: 14,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: tooltip(t) },
      scales: {
        x: { beginAtZero: true, grid: { color: t.grid }, ticks: ticks(t, { precision: 0 }) },
        y: { grid: { display: false }, ticks: ticks(t) },
      },
    },
  };
}

/** Doughnut with legend below (customer insight, qualification) */
export function doughnut(t: ChartTheme, items: LabelValue[], colors: string[]): ChartConfig<'doughnut'> {
  return {
    data: {
      labels: items.map((i) => i.label),
      datasets: [
        {
          data: items.map((i) => i.value),
          backgroundColor: colors,
          borderColor: cssColor('--white'),
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      cutout: '64%',
      plugins: { legend: legendBottom(t), tooltip: tooltip(t) },
    },
  };
}

/** Half-doughnut gauge (target vs achieved); centre text is drawn in HTML */
export function gauge(t: ChartTheme, pct: number): ChartConfig<'doughnut'> {
  const done = Math.max(0, Math.min(100, pct));

  return {
    data: {
      labels: ['Achieved', 'Remaining'],
      datasets: [
        {
          data: [done, 100 - done],
          backgroundColor: [t.primary, t.track],
          borderWidth: 0,
          borderRadius: 10,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      cutout: '76%',
      rotation: -90,
      circumference: 180,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    },
  };
}
