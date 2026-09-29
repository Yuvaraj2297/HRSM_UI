import { Component, computed, inject } from '@angular/core';
import { AttendanceStore, Period } from '../attendance.store';
import { StripItem, SummaryStrip } from './summary-strip';

/** Department view: one compact row per department for the selected day or week */
@Component({
  selector: 'app-att-dept-view',
  standalone: true,
  imports: [SummaryStrip],
  template: `
    <app-att-summary-strip class="mb-3" label="Department summary" [items]="strip()" />

    <section class="card-custom att-register">
      <div class="data-table-wrap">
        <table class="data-table att-dept-table">
          <thead>
            <tr>
              <th>Department</th>
              <th class="text-end">People</th>
              <th class="att-col-rate">Attendance</th>
              <th class="att-col-stack">Breakdown</th>
              <th class="text-end">Late</th>
              <th class="text-end">Leave</th>
              <th class="text-end">Absent</th>
              <th class="text-end">Avg hrs</th>
              <th class="text-end">OT</th>
              <th><span class="visually-hidden">Open</span></th>
            </tr>
          </thead>
          <tbody>
            @for (d of store.deptRows(); track d.name) {
            <tr class="att-row-link" (click)="store.openDept(d.name)">
              <td>
                <span class="att-dept-name">
                  <span class="att-dept-icon"><i [class]="d.icon"></i></span>
                  <strong>{{ d.name }}</strong>
                </span>
              </td>
              <td class="text-end">{{ d.headcount }}</td>
              <td class="att-col-rate">
                <div class="att-rate">
                  <span class="att-rate-bar"><span [style.width.%]="d.rate" [class.is-low]="d.rate < 80"></span></span>
                  <span [class.text-warning]="d.rate < 80">{{ d.rate }}%</span>
                </div>
              </td>
              <td class="att-col-stack">
                <div class="att-stack" role="img"
                  [attr.aria-label]="d.present + ' present, ' + d.late + ' late, ' + d.half + ' half day, ' + d.leave + ' leave, ' + d.absent + ' absent'">
                  @for (s of parts(d); track s.key) {
                    @if (s.n) { <span [attr.data-status]="s.key" [style.flex-grow]="s.n" [title]="s.label + ': ' + s.n"></span> }
                  }
                </div>
              </td>
              <td class="text-end">{{ d.late || '—' }}</td>
              <td class="text-end">{{ d.leave || '—' }}</td>
              <td class="text-end" [class.text-danger]="d.absent > 0">{{ d.absent || '—' }}</td>
              <td class="text-end">{{ d.avgHours }}</td>
              <td class="text-end">@if (d.overtime) { <span class="att-ot">+{{ d.overtime }}h</span> } @else { — }</td>
              <td class="text-end">
                <button type="button" class="att-step" [attr.aria-label]="'Open ' + d.name"
                  (click)="$event.stopPropagation(); store.openDept(d.name)">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>
      <p class="att-table-note">
        Click a department to open its {{ openLabel[store.deptScope()] }}.
      </p>
    </section>
  `,
  styleUrl: './parts.scss',
})
export class DeptView {
  readonly store = inject(AttendanceStore);

  readonly openLabel: Record<Period, string> = { day: 'daily log', week: 'weekly register', month: 'monthly register' };

  readonly strip = computed<StripItem[]>(() => {
    const rows = this.store.deptRows();
    const { best, worst } = this.store.deptTotals();
    const people = rows.reduce((t, r) => t + r.headcount, 0);
    const working = rows.reduce((t, r) => t + r.working, 0);
    const attended = rows.reduce((t, r) => t + r.attended, 0);
    return [
      { key: 'depts', label: 'Departments', value: rows.length, hint: `${people} people` },
      { key: 'rate', label: 'Overall', value: working ? `${Math.round((attended / working) * 100)}%` : '—', hint: 'attendance' },
      { key: 'best', label: 'Best', value: best ? `${best.rate}%` : '—', hint: best?.name, tone: 'present' },
      { key: 'worst', label: 'Lowest', value: worst ? `${worst.rate}%` : '—', hint: worst?.name, tone: 'late' },
      { key: 'ot', label: 'Overtime', value: `${rows.reduce((t, r) => t + r.overtime, 0)}h`, tone: 'overtime' },
    ];
  });

  parts(d: { present: number; late: number; half: number; leave: number; absent: number }) {
    return [
      { key: 'present', label: 'Present', n: d.present },
      { key: 'late', label: 'Late', n: d.late },
      { key: 'half', label: 'Half day', n: d.half },
      { key: 'leave', label: 'Leave', n: d.leave },
      { key: 'absent', label: 'Absent', n: d.absent },
    ];
  }
}
