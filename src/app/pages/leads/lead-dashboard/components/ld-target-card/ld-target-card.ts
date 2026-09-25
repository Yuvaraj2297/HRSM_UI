import { Component, computed, input } from '@angular/core';

import { formatInr } from '../../../../../shared/dashboard/chart-utils';
import { TargetData } from '../../lead-dashboard.model';
import { pct } from '../../lead-dashboard.utils';

/** Goals / Revenue target: ring gauge + Total / Achieved / Pending */
@Component({
  selector: 'app-ld-target-card',
  standalone: true,
  templateUrl: './ld-target-card.html',
  styleUrl: './ld-target-card.scss',
})
export class LdTargetCard {
  target = input.required<TargetData>();
  period = input('');

  /** ring circumference for r = 42 */
  readonly circumference = +(2 * Math.PI * 42).toFixed(2);

  readonly percent = computed(() => pct(this.target().achieved, this.target().total));
  readonly offset = computed(() => +(this.circumference * (1 - this.percent() / 100)).toFixed(2));

  readonly inr = formatInr;
}
