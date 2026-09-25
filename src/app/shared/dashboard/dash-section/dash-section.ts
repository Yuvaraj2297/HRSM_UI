import { Component, input } from '@angular/core';

/**
 * Reusable dashboard section: icon + title + subtitle + meta pill, then content.
 *
 *   <app-dash-section icon="bi-trophy-fill" title="Performance Summary"
 *                     subtitle="…" meta="₹ 8,14,000 revenue YTD" metaIcon="bi-cash-stack">
 *     <div section-actions>…toggles / selects (optional, header right)…</div>
 *     …charts…
 *   </app-dash-section>
 */
@Component({
  selector: 'app-dash-section',
  standalone: true,
  templateUrl: './dash-section.html',
  styleUrl: './dash-section.scss',
})
export class DashSection {
  icon = input.required<string>(); // bootstrap icon, e.g. 'bi-trophy-fill'
  title = input.required<string>();
  subtitle = input<string | null>(null);
  meta = input<string | null>(null);
  metaIcon = input<string | null>(null);
}
