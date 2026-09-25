import { Component, ElementRef, effect, inject, input, output } from '@angular/core';

import { LEAD_ACTIVITY_META, LeadActivity } from '../../lead-map.model';

@Component({
  selector: 'app-lead-timeline',
  standalone: true,
  templateUrl: './lead-timeline.html',
  styleUrl: './lead-timeline.scss',
})
export class LeadTimeline {
  activities = input<LeadActivity[]>([]);
  activeIndex = input<number | null>(null);
  loading = input(false);
  activitySelect = output<number>();

  readonly meta = LEAD_ACTIVITY_META;

  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    // keep the active card visible when it is picked from a map marker
    effect(() => {
      const index = this.activeIndex();
      if (index === null) return;

      this.host.nativeElement
        .querySelector(`[data-index="${index}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
}
