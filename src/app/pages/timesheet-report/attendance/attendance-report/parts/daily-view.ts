import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripItem, SummaryStrip } from './summary-strip';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
} from '../../../../../shared/primedatatable/primedatatable';
import { SHIFT_HOURS, STATUS_META, Status, fmtTime, initials } from '../attendance.model';
import { AttendanceStore, DailyRow } from '../attendance.store';

/** Daily view: one day's status KPIs + every employee's log for that day */
@Component({
  selector: 'app-att-daily-view',
  standalone: true,
  imports: [CommonModule, SummaryStrip, PrimeDataTable],
  templateUrl: './daily-view.html',
  styleUrl: './parts.scss',
})
export class DailyView {
  readonly store = inject(AttendanceStore);

  readonly fmtTime = fmtTime;
  readonly initials = initials;
  readonly shiftHours = SHIFT_HOURS;

  readonly header: PrimeTableHeader = { title: 'Daily Attendance Log', icon: 'bi bi-calendar-day' };

  readonly columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.NO', width: '65px', sortable: false },
    { field: 'name', header: 'EMPLOYEE', width: '230px', sortable: true, type: 'custom' },
    { field: 'shift', header: 'SHIFT', width: '100px', sortable: true },
    { field: 'checkIn', header: 'CHECK-IN', width: '110px', sortable: true, type: 'custom' },
    { field: 'checkOut', header: 'CHECK-OUT', width: '110px', sortable: true, type: 'custom' },
    { field: 'hours', header: 'WORKED', width: '160px', sortable: true, type: 'custom' },
    { field: 'overtime', header: 'OT', width: '80px', sortable: true, type: 'custom' },
    { field: 'status', header: 'STATUS', width: '130px', sortable: true, type: 'custom' },
    {
      field: 'actions', header: 'ACTION', width: '110px', type: 'pill-actions',
      buttons: [
        { key: 'timeline', icon: 'bi bi-clock-history', variant: 'outline', tooltip: 'Punch timeline',
          hiddenWhen: (r: DailyRow) => r.checkIn === null },
        { key: 'month', icon: 'bi bi-calendar3', variant: 'outline', tooltip: 'Monthly calendar' },
      ],
    },
  ];

  /** the summary strip — every item except "Attendance" filters the log */
  readonly strip = computed<StripItem[]>(() => {
    const t = this.store.dayTally();
    return [
      { key: 'all', label: 'All', value: t.working, hint: `${t.rate}% attended` },
      { key: 'present', label: 'Present', value: t.present, tone: 'present' },
      { key: 'late', label: 'Late', value: t.late, tone: 'late' },
      { key: 'half', label: 'Half day', value: t.half, tone: 'half' },
      { key: 'leave', label: 'Leave', value: t.leave, tone: 'leave' },
      { key: 'absent', label: 'Absent', value: t.absent, tone: 'absent' },
      { key: 'overtime', label: 'Overtime', value: `${t.overtime}h`, tone: 'overtime' },
    ];
  });

  pick(key: string | null): void {
    this.store.statusFilter.set(!key || key === 'all' ? null : (key as Status | 'overtime'));
  }

  onAction(e: { action: string; row: DailyRow }): void {
    if (e.action === 'timeline') this.store.timeline.set(e.row);
    if (e.action === 'month') this.store.calendarEmpId.set(e.row.empId);
  }

  /** typed lookup — the table's cell template gives `row` the type any */
  statusMeta(s: Status) {
    return STATUS_META[s];
  }

  pct(hours: number): number {
    return Math.min(100, Math.round((hours / SHIFT_HOURS) * 100));
  }
}
