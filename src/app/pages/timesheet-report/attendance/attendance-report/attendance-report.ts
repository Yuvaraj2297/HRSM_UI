import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Calendar, TeamMember } from '../../../../shared/calendar/calendar';
import { DEPTS, Shift, fmtDate } from './attendance.model';
import { AttendanceStore } from './attendance.store';
import { DailyView } from './parts/daily-view';
import { DeptView } from './parts/dept-view';
import { MonthlyView } from './parts/monthly-view';
import { PunchTimeline } from './parts/punch-timeline';
import { WeeklyView } from './parts/weekly-view';

import { AppSelect } from '../../../../shared/app-select/app-select';
/**
 * Attendance Reports — page shell.
 *   Daily / Weekly / Department views · period navigator · filters · modals
 * State lives in AttendanceStore (provided here, shared by every view).
 */
@Component({
  selector: 'app-attendance-report',
  standalone: true,
  imports: [AppSelect, FormsModule, Calendar,DailyView, WeeklyView, MonthlyView, DeptView, PunchTimeline],
  providers: [AttendanceStore],
  templateUrl: './attendance-report.html',
  styleUrl: './attendance-report.scss',
})
export class AttendanceReport {
  readonly store = inject(AttendanceStore);

  readonly deptOptions = DEPTS.map((d) => ({ label: d.name, value: d.name }));
  readonly shiftOptions: { label: string; value: Shift }[] = [
    { label: 'General (09:00 – 18:00)', value: 'General' },
    { label: 'Morning (06:00 – 15:00)', value: 'Morning' },
  ];

  /** "Mon, 28 Sep 2026" · "22 – 28 Sep 2026" · "September 2026" — follows the period */
  readonly periodLabel = computed(() => {
    switch (this.store.period()) {
      case 'day':
        return fmtDate(this.store.date(), { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
      case 'week': {
        const w = this.store.week();
        return `${fmtDate(w[0], { day: '2-digit', month: 'short' })} – ${fmtDate(w[6])}`;
      }
      case 'month':
        return fmtDate(this.store.date(), { month: 'long', year: 'numeric' });
    }
  });

  readonly periodName = computed(() => this.store.period());

  // ---------------------------------------------------------------- monthly calendar modal
  readonly calendarEmployees: TeamMember[] = this.store.employees.map((e) => ({
    id: e.empId, name: e.name, team: e.dept, seed: e.seed, avatar: e.avatar,
  }));
  readonly calendarTeams = [{ label: 'All Departments', value: '' }, ...this.deptOptions];
  readonly calendarYear = computed(() => Number(this.store.date().slice(0, 4)));
  readonly calendarMonth = computed(() => Number(this.store.date().slice(5, 7)) - 1);
  readonly calendarEmp = computed(() => this.store.employee(this.store.calendarEmpId() ?? ''));
}
