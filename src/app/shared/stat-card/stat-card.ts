import { Component, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

export type StatTone =
  | 'primary' | 'blue' | 'violet' | 'amber' | 'red' | 'teal' | 'pink' | 'neutral';

/**
 * The one KPI / stat tile for the whole app:
 * icon in a tinted ring · uppercase label (+ optional sub line) · value on the right.
 *
 *   <app-stat-card label="Total Employees" [value]="20" icon="bi bi-people" tone="violet" sub="All time" />
 *
 * Clickable filter tiles: add [clickable]="true", [active]="…" and a (click) handler.
 * Rich sub lines (badges, links): project them with <span sub>…</span>.
 * Styles live in classes.scss (.stat-card) so plain markup can use the same look.
 */
const TONE_ALIASES: Record<string, StatTone> = {
  primary: 'primary', green: 'primary', success: 'primary', emerald: 'primary',
  blue: 'blue', indigo: 'blue', info: 'blue',
  violet: 'violet', purple: 'violet',
  amber: 'amber', orange: 'amber', warning: 'amber', yellow: 'amber',
  red: 'red', danger: 'red', rose: 'red',
  teal: 'teal', cyan: 'teal', sky: 'teal',
  pink: 'pink', magenta: 'pink',
  neutral: 'neutral', gray: 'neutral', grey: 'neutral', slate: 'neutral', muted: 'neutral',
};

function normalizeTone(v: string | null | undefined): StatTone {
  const raw = (v ?? '').toLowerCase();
  const key = raw.replace(/^(stat-theme-|theme-|stat-tone-|bg-|text-)/, '');
  if (TONE_ALIASES[key]) return TONE_ALIASES[key];
  // a colour string such as 'var(--green-500)' or 'var(--accent-blue)'
  const hit = Object.keys(TONE_ALIASES).find(k => raw.includes(k));
  return hit ? TONE_ALIASES[hit] : 'primary';
}

function normalizeSubTone(v: string | null | undefined): string {
  const key = (v ?? '').toLowerCase().replace(/^text-/, '');
  if (['up', 'success', 'positive', 'green', 'primary'].includes(key)) return 'success';
  if (['down', 'danger', 'negative', 'red'].includes(key)) return 'danger';
  if (['amber', 'warning', 'orange'].includes(key)) return 'amber';
  if (['blue', 'info'].includes(key)) return 'blue';
  return '';
}

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div class="stat-card-body">
      <span class="stat-card-icon" aria-hidden="true"><i [class]="icon"></i></span>
      <div class="stat-card-text">
        <div class="stat-card-label">{{ label }}</div>
        @if (sub) {
          <div class="stat-card-sub" [class]="subTone ? 'tone-' + subTone : ''">{{ sub }}</div>
        }
        <ng-content select="[sub]" />
      </div>
      <div class="stat-card-value">{{ value }}</div>
    </div>
  `,
})
export class AppStatCard {
  @Input() label = '';
  @Input() value: string | number | null | undefined = '';
  @Input() icon = 'bi bi-bar-chart';
  /** tone name; common aliases from older pages are accepted (green, success, purple, orange, warning, danger, info, cyan, …) */
  @Input() set tone(v: string | null | undefined) { this._tone = normalizeTone(v); }
  get tone(): StatTone { return this._tone; }
  private _tone: StatTone = 'primary';

  @Input() sub?: string | number | null;
  /** colours the sub line: success / danger / a tone name, or a legacy class like 'text-up' / 'text-down'; empty = muted */
  @Input() set subTone(v: string | null | undefined) { this._subTone = normalizeSubTone(v); }
  get subTone(): string { return this._subTone; }
  private _subTone = '';
  @Input() active = false;
  @Input() clickable = false;
  /** force the value under the label. By default the card decides by its own width
      (value on the right when there is room, under the label when the card is narrow). */
  @Input() stacked = false;

  constructor(private host: ElementRef<HTMLElement>) {}

  @HostBinding('class') get hostClass(): string {
    return `stat-card stat-tone-${this.tone}`;
  }
  @HostBinding('class.active') get isActive() { return this.active; }
  @HostBinding('class.stat-card-stacked') get isStacked() { return this.stacked; }
  @HostBinding('class.is-clickable') get isClickable() { return this.clickable; }
  @HostBinding('attr.role') get role() { return this.clickable ? 'button' : null; }
  @HostBinding('attr.tabindex') get tabindex() { return this.clickable ? 0 : null; }
  @HostBinding('attr.aria-pressed') get pressed() { return this.clickable ? this.active : null; }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKey(e: Event): void {
    if (!this.clickable) return;
    e.preventDefault();
    this.host.nativeElement.click();
  }
}
