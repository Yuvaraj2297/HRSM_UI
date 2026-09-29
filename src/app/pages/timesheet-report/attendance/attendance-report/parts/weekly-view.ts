import { Component, computed, inject } from '@angular/core';
import { STATUS_META, Status, fmtDate, fmtTime, initials } from '../attendance.model';
import { AttendanceStore } from '../attendance.store';
import { StripItem, SummaryStrip } from './summary-strip';

/** Weekly view: employee × day register with weekly totals */
@Component({
  selector: 'app-att-weekly-view',
  standalone: true,
  imports: [SummaryStrip],
  templateUrl: './weekly-view.html',
  styleUrl: './parts.scss',
})
export class WeeklyView {
  readonly store = inject(AttendanceStore);

  readonly meta = STATUS_META;
  readonly fmtDate = fmtDate;
  readonly fmtTime = fmtTime;
  readonly initials = initials;
  readonly legend: Status[] = ['present', 'late', 'half', 'leave', 'absent', 'weekoff'];

  readonly strip = computed<StripItem[]>(() => {
    const t = this.store.weekTally();
    return [
      { key: 'rate', label: 'Attendance', value: `${t.rate}%`, hint: `${t.attended} of ${t.working} days` },
      { key: 'late', label: 'Late', value: t.late, tone: 'late' },
      { key: 'half', label: 'Half day', value: t.half, tone: 'half' },
      { key: 'leave', label: 'Leave', value: t.leave, tone: 'leave' },
      { key: 'absent', label: 'Absent', value: t.absent, tone: 'absent' },
      { key: 'hours', label: 'Hours', value: `${t.hours}h`, hint: `${t.overtime}h overtime` },
    ];
  });

  dayHead(iso: string): { dow: string; day: string } {
    return {
      dow: fmtDate(iso, { weekday: 'short' }),
      day: fmtDate(iso, { day: '2-digit', month: 'short' }),
    };
  }

  /** CSV of the register as shown */
  exportCsv(): void {
    const days = this.store.week();
    const head = ['Employee ID', 'Name', 'Department', ...days, 'Attended', 'Working Days', 'Late', 'Leave', 'Absent', 'Hours', 'OT Hours', 'Attendance %'];
    const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const body = this.store.weeklyRows().map((r) =>
      [r.empId, r.name, r.dept, ...r.days.map((d) => (d ? STATUS_META[d.status].short : '')),
        r.attended, r.working, r.late, r.leave, r.absent, r.hours, r.overtime, r.rate].map(q).join(','),
    );
    const blob = new Blob([[head.map(q).join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `attendance-week-${days[0]}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
