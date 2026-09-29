import { Component, computed, inject } from '@angular/core';
import { STATUS_META, Status, fmtDate, fmtTime, initials } from '../attendance.model';
import { AttendanceStore } from '../attendance.store';
import { StripItem, SummaryStrip } from './summary-strip';

/** Monthly view: employee × day register for the whole month, with monthly totals */
@Component({
  selector: 'app-att-monthly-view',
  standalone: true,
  imports: [SummaryStrip],
  templateUrl: './monthly-view.html',
  styleUrl: './parts.scss',
})
export class MonthlyView {
  readonly store = inject(AttendanceStore);

  readonly meta = STATUS_META;
  readonly fmtTime = fmtTime;
  readonly initials = initials;
  readonly legend: Status[] = ['present', 'late', 'half', 'leave', 'absent', 'weekoff'];

  /** column headers: day number + weekday initial, weekends flagged */
  readonly days = computed(() =>
    this.store.month().map((iso) => {
      const dow = new Date(iso + 'T00:00:00').getDay();
      return {
        iso,
        day: Number(iso.slice(8)),
        dow: fmtDate(iso, { weekday: 'narrow' }),
        weekend: dow === 0 || dow === 6,
        today: iso === this.store.today,
      };
    }),
  );

  readonly strip = computed<StripItem[]>(() => {
    const t = this.store.monthTally();
    return [
      { key: 'rate', label: 'Attendance', value: `${t.rate}%`, hint: `${t.attended} of ${t.working} days` },
      { key: 'present', label: 'Present', value: t.present, tone: 'present' },
      { key: 'late', label: 'Late', value: t.late, tone: 'late' },
      { key: 'half', label: 'Half day', value: t.half, tone: 'half' },
      { key: 'leave', label: 'Leave', value: t.leave, tone: 'leave' },
      { key: 'absent', label: 'Absent', value: t.absent, tone: 'absent' },
      { key: 'hours', label: 'Hours', value: `${t.hours}h`, hint: `${t.overtime}h overtime` },
    ];
  });

  cellTitle(iso: string, d: { status: Status; checkIn: number | null; checkOut: number | null; hours: number }): string {
    const head = `${fmtDate(iso, { weekday: 'short', day: '2-digit', month: 'short' })} · ${STATUS_META[d.status].label}`;
    return d.checkIn !== null ? `${head} · ${fmtTime(d.checkIn)} – ${fmtTime(d.checkOut)} · ${d.hours}h` : head;
  }

  /** CSV of the month register as shown */
  exportCsv(): void {
    const days = this.store.month();
    const head = ['Employee ID', 'Name', 'Department', ...days.map((d) => d.slice(8)),
      'Present', 'Late', 'Half Day', 'Leave', 'Absent', 'Working Days', 'Hours', 'OT Hours', 'Attendance %'];
    const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const body = this.store.monthlyRows().map((r) =>
      [r.empId, r.name, r.dept, ...r.days.map((d) => (d ? STATUS_META[d.status].short : '')),
        r.present, r.late, r.half, r.leave, r.absent, r.working, r.hours, r.overtime, r.rate].map(q).join(','),
    );
    const blob = new Blob([[head.map(q).join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `attendance-${days[0].slice(0, 7)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
