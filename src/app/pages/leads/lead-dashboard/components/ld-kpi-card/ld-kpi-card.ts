import { Component, computed, input } from '@angular/core';

import { formatInr } from '../../../../../shared/dashboard/chart-utils';
import { KpiData } from '../../lead-dashboard.model';
import { sparkPoints } from '../../lead-dashboard.utils';

/** KPI tile: icon, label, change badge, value, sub text and a sparkline */
@Component({
  selector: 'app-ld-kpi-card',
  standalone: true,
  templateUrl: './ld-kpi-card.html',
  styleUrl: './ld-kpi-card.scss',
})
export class LdKpiCard {
  kpi = input.required<KpiData>();
  period = input('');

  /** Change across the sparkline (last − first) */
  readonly delta = computed(() => {
    const t = this.kpi().trend;
    return t.length ? t[t.length - 1] - t[0] : 0;
  });

  readonly deltaState = computed(() => (this.delta() > 0 ? 'up' : this.delta() < 0 ? 'down' : 'flat'));

  readonly deltaText = computed(() => {
    const d = this.delta();
    return d > 0 ? `+${d}` : d < 0 ? `−${Math.abs(d)}` : '±0';
  });

  readonly sub = computed(() => {
    const k = this.kpi();
    if (k.amount !== undefined) return formatInr(k.amount);
    return k.note === 'period' ? this.period() : (k.note ?? '');
  });

  readonly line = computed(() => sparkPoints(this.kpi().trend));
  readonly area = computed(() => (this.line() ? `0,34 ${this.line()} 100,34` : ''));
}
