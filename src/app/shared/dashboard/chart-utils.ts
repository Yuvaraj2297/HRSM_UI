import type { ChartData, ChartOptions, ChartType, ScriptableContext } from 'chart.js';

/* =========================================================
   CHART HELPERS — shared by every dashboard page.
   Colours come from the app theme (global-style/variable.scss);
   fallbacks cover SSR / missing variables.
========================================================== */

export interface ChartConfig<T extends 'line' | 'bar' | 'doughnut' = 'line' | 'bar' | 'doughnut'> {
  data: ChartData<T>;
  options: ChartOptions<T>;
}

export interface ChartTheme {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  warning: string;
  danger: string;
  blue: string;
  violet: string;
  pink: string;
  grey: string;
  text: string;
  grid: string;
  track: string;
  font: string;
}

export function readTheme(): ChartTheme {
  const fallback: ChartTheme = {
    primary: '#1a9c53',
    primaryDark: '#0f7a3d',
    primaryLight: '#34c774',
    warning: '#f5a524',
    danger: '#e5484d',
    blue: '#2f6fed',
    violet: '#8b5cf6',
    pink: '#ec4899',
    grey: '#9ca3af',
    text: '#5c6f82',
    grid: 'rgba(20, 20, 43, 0.05)',
    track: '#e8ecf1',
    font: 'Inter, system-ui, sans-serif',
  };

  if (typeof document === 'undefined') return fallback;

  const css = getComputedStyle(document.documentElement);
  const v = (name: string, fb: string) => css.getPropertyValue(name).trim() || fb;

  return {
    ...fallback,
    primary: v('--primary', fallback.primary),
    primaryDark: v('--primary-dark', fallback.primaryDark),
    primaryLight: v('--primary-light', fallback.primaryLight),
    warning: v('--warning', fallback.warning),
    danger: v('--danger', fallback.danger),
    blue: v('--accent-blue', fallback.blue),
    text: v('--text-light', fallback.text),
    track: v('--border', fallback.track),
    font: getComputedStyle(document.body).fontFamily || fallback.font,
  };
}

/** Canvas can't read CSS variables: '--white' -> its computed color */
export function cssColor(token: string): string {
  if (typeof document === 'undefined') return 'transparent';
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim() || 'transparent';
}

/** '#1a9c53' + 0.3 -> 'rgba(26, 156, 83, 0.3)' (hex only; anything else returned as-is) */
export function alpha(hex: string, a: number): string {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());
  if (!m) return hex;
  return `rgba(${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}, ${a})`;
}

/** Vertical fade (top -> bottom) once the chart area is known */
export function fade<T extends ChartType = 'line'>(color: string, top: number, bottom: number) {
  return (ctx: ScriptableContext<T>) => {
    const { chart } = ctx;
    const area = chart.chartArea;
    if (!area) return alpha(color, top);

    const g = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
    g.addColorStop(0, alpha(color, top));
    g.addColorStop(1, alpha(color, bottom));
    return g;
  };
}

export function tooltipStyle(t: ChartTheme) {
  return {
    backgroundColor: '#16202b',
    padding: 10,
    cornerRadius: 9,
    boxPadding: 4,
    titleFont: { family: t.font, weight: 'bold' as const, size: 12 },
    bodyFont: { family: t.font, size: 12 },
  };
}

export function tickStyle(t: ChartTheme, extra: Record<string, unknown> = {}) {
  return { color: t.text, font: { family: t.font, size: 11 }, ...extra };
}

export function legendStyle(t: ChartTheme, position: 'top' | 'bottom' = 'bottom', align: 'center' | 'end' = 'center') {
  return {
    position,
    align,
    labels: {
      color: t.text,
      usePointStyle: true,
      pointStyle: 'rectRounded' as const,
      boxWidth: 9,
      boxHeight: 9,
      padding: 14,
      font: { family: t.font, size: 11, weight: 'bold' as const },
    },
  };
}

/* ---------------------------------------------------------
   Number formatting (Indian grouping)
---------------------------------------------------------- */

/** 105708.24 -> '₹ -1,05,708.24' (sign after the symbol) */
export function formatInr(value: number, decimals = 2): string {
  const n = Number(value) || 0;
  const body = Math.abs(n).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `₹ ${n < 0 ? '-' : ''}${body}`;
}

/** 1500000 -> '15L', 25000 -> '25K', 30000000 -> '3Cr' (chart axes) */
export function shortInr(value: number | string): string {
  const v = Number(value);
  const a = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (a >= 1e7) return `${sign}${+(a / 1e7).toFixed(2)}Cr`;
  if (a >= 1e5) return `${sign}${+(a / 1e5).toFixed(2)}L`;
  if (a >= 1e3) return `${sign}${+(a / 1e3).toFixed(1)}K`;
  return String(v);
}
