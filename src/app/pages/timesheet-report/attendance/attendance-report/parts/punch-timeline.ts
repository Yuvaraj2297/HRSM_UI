import { Component, computed, inject } from '@angular/core';
import { STATUS_META, fmtDate, fmtTime, initials } from '../attendance.model';
import { AttendanceStore } from '../attendance.store';

interface Punch {
  label: string;
  meta: string;
  icon: string;
  kind: 'shift' | 'break' | 'lunch';
  at: number; // minutes
  gapAfter?: number; // minutes away (breaks)
}

/** Punch timeline for one employee-day, derived from their check-in / check-out */
@Component({
  selector: 'app-att-punch-timeline',
  standalone: true,
  template: `
    @if (row(); as r) {
    <div class="modal-backdrop-custom" (click)="close()"></div>
    <div class="modal-custom modal-lg" role="dialog" aria-modal="true" [attr.aria-label]="'Punch timeline — ' + r.name">
      <div class="modal-header">
        <div class="d-flex align-items-center gap-2">
          @if (r.avatar) {
            <img [src]="r.avatar" [alt]="r.name" class="ui-avatar" />
          } @else {
            <span class="ui-avatar">{{ initials(r.name) }}</span>
          }
          <div>
            <h5 class="modal-title">{{ r.name }}</h5>
            <small class="text-muted">{{ r.empId }} · {{ r.dept }} · {{ fmtDate(r.date) }}</small>
          </div>
        </div>
        <button type="button" class="btn-close-custom" aria-label="Close" (click)="close()">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="ui-meta-grid ui-meta-grid--4 mb-3">
          <div><div class="ui-meta-label">Worked</div><div class="ui-meta-value">{{ r.hours }}h</div></div>
          <div><div class="ui-meta-label">Breaks</div><div class="ui-meta-value">{{ totals().breaks }}m</div></div>
          <div><div class="ui-meta-label">Lunch</div><div class="ui-meta-value">{{ totals().lunch }}m</div></div>
          <div><div class="ui-meta-label">Status</div><div class="ui-meta-value"><span class="ui-status-pill" [attr.data-status]="r.status"><i [class]="meta[r.status].icon"></i> {{ meta[r.status].label }}</span></div></div>
        </div>

        <ol class="ui-timeline">
          @for (p of punches(); track p.at) {
          <li class="ui-timeline-item" [class.stat-tone-amber]="p.kind === 'break'" [class.stat-tone-teal]="p.kind === 'lunch'">
            <span class="ui-timeline-node"><i [class]="p.icon"></i></span>
            <div class="ui-timeline-card">
              <div>
                <div class="cell-strong">{{ p.label }}</div>
                <div class="ui-cell-sub">{{ p.meta }}</div>
              </div>
              <time class="cell-strong">{{ fmtTime(p.at) }}</time>
            </div>
            @if (p.gapAfter) {
            <span class="ui-tag" [class.tone-warning]="p.gapAfter >= 40"><i class="bi bi-hourglass-split"></i> {{ p.gapAfter }}m away</span>
            }
          </li>
          }
        </ol>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="close()">Close</button>
        <button type="button" class="btn btn-outline-primary" (click)="openMonth(r.empId)">
          <i class="bi bi-calendar3"></i>
          <span>Monthly Calendar</span>
        </button>
      </div>
    </div>
    }
  `,
})
export class PunchTimeline {
  private readonly store = inject(AttendanceStore);

  readonly row = this.store.timeline;
  readonly meta = STATUS_META;
  readonly fmtDate = fmtDate;
  readonly fmtTime = fmtTime;
  readonly initials = initials;

  readonly punches = computed<Punch[]>(() => {
    const r = this.row();
    if (!r || r.checkIn === null || r.checkOut === null) return [];
    const inAt = r.checkIn;
    const outAt = r.checkOut;
    const list: Punch[] = [
      { label: 'Check In', meta: r.status === 'late' ? 'Late arrival' : 'Shift started', icon: 'bi bi-box-arrow-in-right', kind: 'shift', at: inAt },
    ];

    const tea = inAt + 135;
    if (tea + 17 < outAt) {
      list.push({ label: 'Break Out', meta: 'Tea break', icon: 'bi bi-cup-hot', kind: 'break', at: tea, gapAfter: 17 });
      list.push({ label: 'Break In', meta: 'Back to desk', icon: 'bi bi-arrow-counterclockwise', kind: 'break', at: tea + 17 });
    }

    const lunch = Math.max(inAt + 240, 13 * 60);
    if (lunch + 45 < outAt - 30) {
      list.push({ label: 'Lunch Out', meta: 'Lunch break', icon: 'bi bi-egg-fried', kind: 'lunch', at: lunch, gapAfter: 45 });
      list.push({ label: 'Lunch In', meta: 'Back to desk', icon: 'bi bi-arrow-counterclockwise', kind: 'lunch', at: lunch + 45 });

      const tea2 = outAt - 110;
      if (tea2 > lunch + 90) {
        list.push({ label: 'Break Out', meta: 'Evening tea', icon: 'bi bi-cup-hot', kind: 'break', at: tea2, gapAfter: 15 });
        list.push({ label: 'Break In', meta: 'Back to desk', icon: 'bi bi-arrow-counterclockwise', kind: 'break', at: tea2 + 15 });
      }
    }

    list.push({ label: 'Check Out', meta: r.status === 'half' ? 'Half day' : 'Shift ended', icon: 'bi bi-box-arrow-right', kind: 'shift', at: outAt });
    return list;
  });

  readonly totals = computed(() => {
    const p = this.punches();
    const sum = (k: Punch['kind']) => p.filter((x) => x.kind === k && x.gapAfter).reduce((t, x) => t + x.gapAfter!, 0);
    return { breaks: sum('break'), lunch: sum('lunch') };
  });

  close(): void {
    this.store.timeline.set(null);
  }

  openMonth(empId: string): void {
    this.close();
    this.store.calendarEmpId.set(empId);
  }
}
