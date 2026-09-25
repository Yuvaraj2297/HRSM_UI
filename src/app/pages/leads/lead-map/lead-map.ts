import {
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, finalize } from 'rxjs';

import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
} from '../../../shared/primedatatable/primedatatable';
import { LeadRouteMap } from './components/lead-route-map/lead-route-map';
import { LeadTimeline } from './components/lead-timeline/lead-timeline';
import { LeadMapService } from './lead-map.service';
import {
  EMPTY_TEXT,
  LeadActivity,
  LeadMapSummary,
  LeadUser,
  LeadUserRow,
} from './lead-map.model';

@Component({
  selector: 'app-lead-map',
  standalone: true,
  imports: [CommonModule, PrimeDataTable, LeadRouteMap, LeadTimeline],
  templateUrl: './lead-map.html',
  styleUrl: './lead-map.scss',
})
export class LeadMap {
  private service = inject(LeadMapService);
  private destroyRef = inject(DestroyRef);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private mapSection = viewChild<ElementRef<HTMLElement>>('mapSection');
  private loadSub?: Subscription;

  /* =========================================================
     TABLE CONFIG
  ========================================================== */

  readonly columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', width: '70px', sortable: false },
    { field: 'id', header: 'Id', sortable: true },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'loginText', header: 'Login Time', sortable: true },
    { field: 'loginAreaText', header: 'Login Area', sortable: true },
    { field: 'logoutText', header: 'Logout Time', sortable: true },
    { field: 'logoutAreaText', header: 'Logout Area', sortable: true },
    { field: 'visits', header: 'Tot. Visit', type: 'custom', sortable: true },
    { field: 'kmsText', header: 'Tot. Kms', sortable: true },
    { field: 'battery', header: 'User Battery', type: 'custom', sortable: true },
    { field: 'online', header: 'Status', type: 'custom', sortable: true },
    {
      field: 'actions',
      header: 'Action',
      type: 'pill-actions',
      buttons: [{ key: 'view', icon: 'bi bi-eye-fill', tooltip: 'View on map' }],
    },
  ];

  /* =========================================================
     STATE
  ========================================================== */

  readonly today = todayISO();
  readonly filterDate = signal(this.today);
  readonly appliedDate = signal(this.today);

  readonly users = signal<LeadUser[]>([]);
  readonly timelines = signal<Record<string, LeadActivity[]>>({});
  readonly selectedId = signal<string | null>(null);
  readonly activeIndex = signal<number | null>(null);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  /* =========================================================
     DERIVED
  ========================================================== */

  readonly rows = computed<LeadUserRow[]>(() => this.users().map(toRow));

  readonly selectedUser = computed(
    () => this.users().find((u) => u.id === this.selectedId()) ?? null,
  );

  readonly activities = computed(() => {
    const id = this.selectedId();
    return id ? (this.timelines()[id] ?? []) : [];
  });

  readonly summary = computed<LeadMapSummary>(() => {
    const users = this.users();
    return {
      total: users.length,
      online: users.filter((u) => u.online).length,
      visits: users.reduce((sum, u) => sum + u.visits, 0),
      kms: Math.round(users.reduce((sum, u) => sum + u.kms, 0) * 10) / 10,
    };
  });

  readonly displayDate = computed(() => toDisplayDate(this.appliedDate()));

  readonly header = computed<PrimeTableHeader>(() => ({
    title: 'Field Users',
    icon: 'bi bi-people-fill',
    count: this.users().length,
  }));

  constructor() {
    // data is browser-only: routes are prerendered, where relative HTTP URLs don't resolve
    if (this.isBrowser) this.load();
  }

  /* =========================================================
     DATA
  ========================================================== */

  load(): void {
    // drop an in-flight request so a stale response can't overwrite a newer one
    this.loadSub?.unsubscribe();
    this.loading.set(true);
    this.error.set(null);

    this.loadSub = this.service
      .getLeadMap(this.appliedDate())
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (data) => {
          this.users.set(data.users);
          this.timelines.set(data.timelines);

          // keep the current user if still present, otherwise pick the first
          const keep = data.users.some((u) => u.id === this.selectedId());
          this.selectUser(keep ? this.selectedId() : (data.users[0]?.id ?? null));
        },
        error: () => {
          this.users.set([]);
          this.timelines.set({});
          this.selectUser(null);
          this.error.set('Unable to load lead map data. Please try again.');
        },
      });
  }

  /* =========================================================
     FILTER
  ========================================================== */

  onDateInput(event: Event): void {
    this.filterDate.set((event.target as HTMLInputElement).value);
  }

  search(): void {
    this.appliedDate.set(this.filterDate() || todayISO());
    this.load();
  }

  reset(): void {
    this.filterDate.set(todayISO());
    this.selectedId.set(null);
    this.search();
  }

  /* =========================================================
     SELECTION
  ========================================================== */

  onTableAction(event: { action: string; row: LeadUserRow }): void {
    if (event.action === 'view') this.viewOnMap(event.row.id);
  }

  viewOnMap(id: string): void {
    this.selectUser(id);
    this.mapSection()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  selectUser(id: string | null): void {
    this.selectedId.set(id);
    this.activeIndex.set(null);
  }

  onActivitySelect(index: number): void {
    this.activeIndex.set(index);
  }

  /* =========================================================
     VIEW HELPERS
  ========================================================== */

  batteryLevel(value: number): 'high' | 'mid' | 'low' {
    return value >= 60 ? 'high' : value >= 30 ? 'mid' : 'low';
  }

  batteryIcon(value: number): string {
    return value >= 60 ? 'bi-battery-full' : value >= 30 ? 'bi-battery-half' : 'bi-battery';
  }
}

/* =========================================================
   PURE HELPERS
========================================================== */

function toRow(u: LeadUser): LeadUserRow {
  return {
    ...u,
    loginText: u.login ?? EMPTY_TEXT,
    loginAreaText: u.loginArea ?? EMPTY_TEXT,
    logoutText: u.logout ?? EMPTY_TEXT,
    logoutAreaText: u.logoutArea ?? EMPTY_TEXT,
    kmsText: `${u.kms} km`,
  };
}

/** Local date as yyyy-mm-dd (matches <input type="date">) */
function todayISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** yyyy-mm-dd -> dd-mm-yyyy */
function toDisplayDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}-${m}-${y}` : EMPTY_TEXT;
}
