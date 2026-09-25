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
  CHECKIN_MATCH_KM,
  CHECKIN_WARN_KM,
  LOCATION_RANGE_DAYS,
  LeadVisitRow,
  LocationFilter,
  VisitStaff,
  VisitType,
} from '../../staff-visiting-reports.model';
import { dateToIso, isoToDate, toDisplayDate } from '../../staff-visiting-reports.utils';
import { CalendarDatepickerDirective } from '../../../../../common/directives/datepicker';

/**
 * Staff Visiting Location Report — every lead check-in in a date range,
 * comparing the lead's original location with where the staff checked in.
 * Filter: Staff (all / one) + Branch (all / one) + From / To.
 */
@Component({
  selector: 'app-visit-location-report',
  standalone: true,
  imports: [FormsModule, SelectModule, DatePickerModule, PrimeDataTable,CalendarDatepickerDirective],
  templateUrl: './visit-location-report.html',
  styleUrl: './visit-location-report.scss',
})
export class VisitLocationReport {
  private service = inject(StaffVisitingReportsService);
  private destroyRef = inject(DestroyRef);

  private loadSub?: Subscription;

  /* =========================================================
     TABLE CONFIG
  ========================================================== */

  readonly header: PrimeTableHeader = {
    title: 'Lead Visits',
    icon: 'bi bi-geo-alt-fill',
  };

  readonly columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', width: '64px', sortable: false },
    { field: 'staffName', header: 'Staff Name', type: 'custom', sortable: true },
    { field: 'type', header: 'Type', type: 'custom', sortable: true },
    { field: 'leadName', header: 'Lead Name', type: 'custom', sortable: true },
    { field: 'date', header: 'Date', type: 'custom', sortable: true },
    { field: 'originalLocation', header: 'Original Location', type: 'custom', sortable: false },
    { field: 'checkinLocation', header: 'Current Checkin Location', type: 'custom', sortable: false },
    { field: 'distanceKm', header: 'Checkin Difference', type: 'custom', sortable: true },
    { field: 'inTime', header: 'In-Time', sortable: false },
    { field: 'outTime', header: 'Out-Time', sortable: false },
    { field: 'duration', header: 'Duration', sortable: false },
  ];

  /* =========================================================
     FILTER  (applied on Search)
  ========================================================== */

  readonly maxDate = new Date();

  readonly staff = signal<VisitStaff[]>([]);
  readonly branches = signal<string[]>([]);

  // '' = All (PrimeNG select treats null as "no selection")
  readonly staffId = signal('');
  readonly branch = signal('');
  readonly fromDate = signal<Date | null>(isoToDate(defaultFrom()));
  readonly toDate = signal<Date | null>(new Date());

  readonly applied = signal<LocationFilter | null>(null);

  /** Staff list narrowed to the chosen branch */
  readonly staffOptions = computed(() => [
    { label: 'All Staff', value: '' },
    ...this.staff()
      .filter((s) => !this.branch() || s.branch === this.branch())
      .map((s) => ({ label: s.name, value: s.id })),
  ]);

  readonly branchOptions = computed(() => [
    { label: 'All Branches', value: '' },
    ...this.branches().map((b) => ({ label: b, value: b })),
  ]);

  readonly rangeInvalid = computed(() => {
    const from = this.fromDate();
    const to = this.toDate();
    return !!from && !!to && dateToIso(from) > dateToIso(to);
  });

  /* =========================================================
     REPORT
  ========================================================== */

  readonly rows = signal<LeadVisitRow[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // template helpers
  readonly displayDate = toDisplayDate;

  constructor() {
    // data is browser-only: routes are prerendered, where relative HTTP URLs don't resolve
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      this.loadLookups();
      this.search();
    }
  }

  /* =========================================================
     DATA
  ========================================================== */

  loadLookups(): void {
    this.service
      .getStaff()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => {
          this.staff.set(list);
          this.branches.set([...new Set(list.map((s) => s.branch).filter(Boolean))].sort());
        },
        error: () => this.error.set('Unable to load the staff list. Please try again.'),
      });
  }

  private load(filter: LocationFilter): void {
    // drop an in-flight request so a stale response can't overwrite a newer one
    this.loadSub?.unsubscribe();
    this.loading.set(true);
    this.error.set(null);

    this.loadSub = this.service
      .getLocationReport(filter)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (rows) => this.rows.set(rows),
        error: () => {
          this.rows.set([]);
          this.error.set('Unable to load the location report. Please try again.');
        },
      });
  }

  retry(): void {
    if (!this.staff().length) this.loadLookups();
    const f = this.applied();
    if (f) this.load(f);
  }

  /* =========================================================
     FILTER ACTIONS
  ========================================================== */

  onBranchChange(branch: string): void {
    this.branch.set(branch);

    // chosen staff is not in the new branch -> back to All Staff
    const person = this.staff().find((s) => s.id === this.staffId());
    if (person && branch && person.branch !== branch) this.staffId.set('');
  }

  search(): void {
    const from = dateToIso(this.fromDate());
    const to = dateToIso(this.toDate());
    if (!from || !to || this.rangeInvalid()) return;

    const filter: LocationFilter = {
      staffId: this.staffId() || null,
      branch: this.branch() || null,
      from,
      to,
    };
    this.applied.set(filter);
    this.load(filter);
  }

  reset(): void {
    this.staffId.set('');
    this.branch.set('');
    this.fromDate.set(isoToDate(defaultFrom()));
    this.toDate.set(new Date());
    this.search();
  }

  /* =========================================================
     VIEW HELPERS
  ========================================================== */

  typeClass(type: VisitType): string {
    return type === 'Lead' ? 'is-lead' : type === 'Follow Up' ? 'is-follow' : 'is-customer';
  }

  /** green = at the lead's location, amber = nearby, red = far away */
  distanceClass(km: number): string {
    return km <= CHECKIN_MATCH_KM ? 'is-match' : km <= CHECKIN_WARN_KM ? 'is-near' : 'is-far';
  }

  mapUrl(lat: number, lng: number): string {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
  }
}

function defaultFrom(): string {
  const d = new Date();
  d.setDate(d.getDate() - LOCATION_RANGE_DAYS);
  return dateToIso(d);
}
