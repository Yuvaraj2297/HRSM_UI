import { Component, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';

/**
 * Reusable chart box: title + optional badge / actions + a PrimeNG chart.
 *
 *   <app-chart-card title="Leads by Date" badge="Last 30 days" type="line" [config]="cfg" height="240px">
 *     <div card-actions>…segmented control…</div>   (optional, right of the title)
 *     …anything else is placed over / under the chart (e.g. gauge centre text)
 *   </app-chart-card>
 *
 * `config` is `{ data, options }` (Chart.js). The chart renders in the browser only.
 */
@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './chart-card.html',
  styleUrl: './chart-card.scss',
})
export class ChartCard {
  title = input.required<string>();
  badge = input<string | null>(null);
  type = input.required<'line' | 'bar' | 'doughnut' | 'pie'>();
  config = input<{ data: unknown; options: unknown } | null>(null);
  height = input('260px');
}
