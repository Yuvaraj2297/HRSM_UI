import { Component, computed, input, signal } from '@angular/core';

import { formatInr } from '../../../../../shared/dashboard/chart-utils';
import { StaffSummaryRow, TargetAchieved } from '../../lead-dashboard.model';

export interface SummaryPeriod {
  key: 'cur' | 'qtr' | 'half';
  label: string;
  range: string;
}

/**
 * Staff-wise business summary: Target / Achieved / % for three periods.
 * Custom table (not the shared data table) because it needs a two-row
 * grouped header.
 */
@Component({
  selector: 'app-ld-staff-summary',
  standalone: true,
  templateUrl: './ld-staff-summary.html',
  styleUrl: './ld-staff-summary.scss',
})
export class LdStaffSummary {
  rows = input<StaffSummaryRow[]>([]);
  periods = input.required<SummaryPeriod[]>();

  readonly search = signal('');

  readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return q ? this.rows().filter((r) => r.name.toLowerCase().includes(q)) : this.rows();
  });

  /** Team totals over the filtered rows */
  readonly totals = computed(() => {
    const out: Record<string, TargetAchieved> = {};
    for (const p of this.periods()) {
      out[p.key] = this.filtered().reduce(
        (acc, r) => ({ t: acc.t + r[p.key].t, a: acc.a + r[p.key].a }),
        { t: 0, a: 0 },
      );
    }
    return out;
  });

  readonly avatarTones = ['green', 'blue', 'violet', 'amber', 'red'];

  readonly inr = formatInr;

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  percent(v: TargetAchieved): number {
    return v.t > 0 ? Math.round((v.a / v.t) * 100) : 0;
  }

  /** badge colour: ≥75 good, ≥40 mid, else low; 0 = none */
  band(p: number): string {
    return !p ? 'none' : p >= 75 ? 'good' : p >= 40 ? 'mid' : 'low';
  }

  clamp(p: number): number {
    return Math.max(0, Math.min(100, p));
  }
}
