import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, finalize } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
} from '../../../../../shared/primedatatable/primedatatable';
import { StaffVisitingReportsService } from '../../staff-visiting-reports.service';
import {
  DEFAULT_RANGE_DAYS,
  DEFAULT_STAFF_ID,
  DayStatus,
  StaffVisitRow,
  StaffVisitSummary,
  VisitFilter,
  VisitStaff,
} from '../../staff-visiting-reports.model';
import {
  dateToIso,
  daysAgo,
  isSunday,
  isoToDate,
  round1,
  toDisplayDate,
  weekday,
} from '../../staff-visiting-reports.utils';
import { CalendarDatepickerDirective } from '../../../../../common/directives/datepicker';

/**
 * Visiting Report — how far ONE staff travelled each day in a date range.
 * Filter: Staff (required) + From / To.
 */
@Component({
  selector: 'app-visit-km-report',
  standalone: true,
  imports: [FormsModule, SelectModule, DatePickerModule, PrimeDataTable,CalendarDatepickerDirective],
  templateUrl: './visit-km-report.html',
  styleUrl: './visit-km-report.scss',
})
export class VisitKmReport {
  private service = inject(StaffVisitingReportsService);
  private destroyRef = inject(DestroyRef);

  private loadSub?: Subscription;

  /* =========================================================
     TABLE CONFIG
  ========================================================== */

  readonly columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', width: '70px', sortable: false },
    { field: 'staffName', header: 'Staff Name', sortable: true },
    { field: 'date', header: 'Date', type: 'custom', sortable: true },
    { field: 'km', header: 'Total KM', type: 'custom', sortable: true },
    { field: 'status', header: 'Status', type: 'custom', sortable: true },
  ];

  /* =========================================================
     FILTER  (applied on Search)
  ========================================================== */

  readonly maxDate = new Date();

  readonly staff = signal<VisitStaff[]>([]);
  readonly staffId = signal(DEFAULT_STAFF_ID);
  readonly fromDate = signal<Date | null>(isoToDate(daysAgo(DEFAULT_RANGE_DAYS)));
  readonly toDate = signal<Date | null>(new Date());

  readonly applied = signal<VisitFilter | null>(null);

  readonly staffOptions = computed(() =>
    this.staff().map((s) => ({ label: s.name, value: s.id })),
  );

  /** From > To — marks the inputs and blocks Search */
  readonly rangeInvalid = computed(() => {
    const from = this.fromDate();
    const to = this.toDate();
    return !!from && !!to && dateToIso(from) > dateToIso(to);
  });

  /* =========================================================
     REPORT
  ========================================================== */

  readonly rows = signal<StaffVisitRow[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly header = computed<PrimeTableHeader>(() => ({
    title: 'Daily Travel',
    icon: 'bi bi-signpost-2-fill',
    count: this.rows().length,
  }));

  readonly summary = computed<StaffVisitSummary>(() => {
    const active = this.rows().map((r) => r.km).filter((k) => k > 0);
    const total = round1(active.reduce((sum, k) => sum + k, 0));

    return {
      totalKm: total,
      activeDays: active.length,
      avgKm: active.length ? round1(total / active.length) : 0,
      maxKm: active.length ? Math.max(...active) : 0,
    };
  });

  // template helpers
  readonly displayDate = toDisplayDate;
  readonly weekday = weekday;
  readonly isSunday = isSunday;

  constructor() {
    // data is browser-only: routes are prerendered, where relative HTTP URLs don't resolve
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      this.loadStaff();
      this.search();
    }
  }

  /* =========================================================
     DATA
  ========================================================== */

  loadStaff(): void {
    this.service
      .getStaff()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => {
          this.staff.set(list);

          // default staff missing from the data -> fall back to the first one
          if (list.length && !list.some((s) => s.id === this.staffId())) {
            this.staffId.set(list[0].id);
            this.search();
          }
        },
        error: () => this.error.set('Unable to load the staff list. Please try again.'),
      });
  }

  private load(filter: VisitFilter): void {
    // drop an in-flight request so a stale response can't overwrite a newer one
    this.loadSub?.unsubscribe();
    this.loading.set(true);
    this.error.set(null);

    this.loadSub = this.service
      .getVisitReport(filter)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (rows) => this.rows.set(rows),
        error: () => {
          this.rows.set([]);
          this.error.set('Unable to load the visiting report. Please try again.');
        },
      });
  }

  retry(): void {
    if (!this.staff().length) this.loadStaff();
    const f = this.applied();
    if (f) this.load(f);
  }

  /* =========================================================
     FILTER ACTIONS
  ========================================================== */

  search(): void {
    const from = dateToIso(this.fromDate());
    const to = dateToIso(this.toDate());
    if (!this.staffId() || !from || !to || this.rangeInvalid()) return;

    const filter: VisitFilter = { staffId: this.staffId(), from, to };
    this.applied.set(filter);
    this.load(filter);
  }

  reset(): void {
    const list = this.staff();
    const hasDefault = !list.length || list.some((s) => s.id === DEFAULT_STAFF_ID);

    this.staffId.set(hasDefault ? DEFAULT_STAFF_ID : list[0].id);
    this.fromDate.set(isoToDate(daysAgo(DEFAULT_RANGE_DAYS)));
    this.toDate.set(new Date());
    this.search();
  }

  /* =========================================================
     VIEW HELPERS
  ========================================================== */

  statusClass(status: DayStatus): string {
    return status === 'Travelled'
      ? 'status-success'
      : status === 'No Travel'
        ? 'status-warning'
        : 'status-muted';
  }
}
