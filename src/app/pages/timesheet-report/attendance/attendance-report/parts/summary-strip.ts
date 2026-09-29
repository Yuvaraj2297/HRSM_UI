import { NgTemplateOutlet } from '@angular/common';
import { Component, input, output } from '@angular/core';

export interface StripItem {
  key: string;
  label: string;
  value: string | number;
  /** colour of the dot — a status key ('present', 'late', …) or 'none' */
  tone?: string;
  hint?: string;
}

/**
 * One slim card of headline numbers. Items can act as filters:
 * pass `active` and listen to (pick) — clicking the active item again clears it.
 */
@Component({
  selector: 'app-att-summary-strip',
  standalone: true,
  template: `
    <div class="card-custom strip" role="group" [attr.aria-label]="label()">
      @for (it of items(); track it.key) {
        @if (clickable()) {
          <button type="button" class="strip-item" [class.active]="active() === it.key"
            [attr.aria-pressed]="active() === it.key" (click)="pick.emit(active() === it.key ? null : it.key)">
            <ng-container *ngTemplateOutlet="body; context: { $implicit: it }" />
          </button>
        } @else {
          <div class="strip-item">
            <ng-container *ngTemplateOutlet="body; context: { $implicit: it }" />
          </div>
        }
      }
    </div>

    <ng-template #body let-it>
      <span class="strip-label">
        @if (it.tone) { <span class="strip-dot" [attr.data-status]="it.tone"></span> }
        {{ it.label }}
      </span>
      <span class="strip-value">{{ it.value }}</span>
      @if (it.hint) { <span class="strip-hint">{{ it.hint }}</span> }
    </ng-template>
  `,
  imports: [NgTemplateOutlet],
  styleUrl: './parts.scss',
})
export class SummaryStrip {
  readonly items = input.required<StripItem[]>();
  readonly label = input('Summary');
  readonly clickable = input(false);
  readonly active = input<string | null>(null);
  readonly pick = output<string | null>();
}
