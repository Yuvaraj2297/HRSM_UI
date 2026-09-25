import { Component, computed, input } from '@angular/core';

import { formatInr } from '../../../../../shared/dashboard/chart-utils';
import { Leader } from '../../lead-dashboard.model';

/** "Revenue by sales rep" — top performer + leaderboard */
@Component({
  selector: 'app-ld-spotlight',
  standalone: true,
  templateUrl: './ld-spotlight.html',
  styleUrl: './ld-spotlight.scss',
})
export class LdSpotlight {
  leaders = input<Leader[]>([]);
  period = input('');

  readonly sorted = computed(() => [...this.leaders()].sort((a, b) => b.amount - a.amount));
  readonly top = computed(() => this.sorted()[0] ?? null);
  readonly teamTotal = computed(() => this.leaders().reduce((s, l) => s + l.amount, 0));

  readonly rows = computed(() => {
    const max = Math.max(0, ...this.sorted().map((l) => l.amount));
    return this.sorted().map((l) => ({ ...l, width: max > 0 ? Math.round((l.amount / max) * 100) : 0 }));
  });

  readonly inr = formatInr;
}
