import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, combineLatest, map, shareReplay, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  DayStatus,
  LeadVisitData,
  LeadVisitRow,
  LocationFilter,
  StaffVisitData,
  StaffVisitRow,
  VisitFilter,
  VisitStaff,
} from './staff-visiting-reports.model';
import {
  distanceKm,
  eachDay,
  formatDuration,
  isSunday,
  toSeconds,
} from './staff-visiting-reports.utils';

@Injectable({
  providedIn: 'root',
})
export class StaffVisitingReportsService {
  private http = inject(HttpClient);

  /* =========================================================
     DATA SOURCES
     Static JSON for now — point these at `${environment.apiUrl}...`
     once the API is ready (filter fields as query params).
  ========================================================== */

  private readonly visitsUrl = `${environment.jsonPath}leads/staff-visiting-report.json`;
  private readonly locationsUrl = `${environment.jsonPath}leads/staff-visiting-locations.json`;

  /** Each file is fetched once (on first use) and reused */
  private visits$?: Observable<StaffVisitData>;
  private locations$?: Observable<LeadVisitData>;

  private visitsSource(): Observable<StaffVisitData> {
    this.visits$ ??= this.cached(
      this.http
        .get<Partial<StaffVisitData>>(this.visitsUrl)
        .pipe(map((res) => ({ staff: res.staff ?? [], records: res.records ?? {} }))),
      () => (this.visits$ = undefined),
    );
    return this.visits$;
  }

  private locationsSource(): Observable<LeadVisitData> {
    this.locations$ ??= this.cached(
      this.http
        .get<Partial<LeadVisitData>>(this.locationsUrl)
        .pipe(map((res) => ({ leads: res.leads ?? [], visits: res.visits ?? [] }))),
      () => (this.locations$ = undefined),
    );
    return this.locations$;
  }

  /** shareReplay, but a failed request is not cached — the next call retries */
  private cached<T>(source: Observable<T>, clear: () => void): Observable<T> {
    return source.pipe(
      shareReplay(1),
      catchError((err) => {
        clear();
        return throwError(() => err);
      }),
    );
  }

  /* =========================================================
     STAFF / BRANCHES
  ========================================================== */

  getStaff(): Observable<VisitStaff[]> {
    return this.visitsSource().pipe(map((d) => d.staff));
  }

  getBranches(): Observable<string[]> {
    return this.getStaff().pipe(
      map((staff) => [...new Set(staff.map((s) => s.branch).filter(Boolean))].sort()),
    );
  }

  /* =========================================================
     STAFF VISITING REPORTS — one row per day for one staff
  ========================================================== */

  getVisitReport({ staffId, from, to }: VisitFilter): Observable<StaffVisitRow[]> {
    return this.visitsSource().pipe(
      map(({ staff, records }) => {
        const person = staff.find((s) => s.id === staffId);
        if (!person) return [];

        const days = records[staffId] ?? {};

        return eachDay(from, to).map((date) => {
          const km = days[date] ?? 0;
          const status: DayStatus = km > 0 ? 'Travelled' : isSunday(date) ? 'Week Off' : 'No Travel';

          return { staffId, staffName: person.name, date, km, status };
        });
      }),
    );
  }

  /* =========================================================
     STAFF VISITING LOCATION REPORT — lead check-ins
  ========================================================== */

  getLocationReport({ staffId, branch, from, to }: LocationFilter): Observable<LeadVisitRow[]> {
    return combineLatest([this.getStaff(), this.locationsSource()]).pipe(
      map(([staff, { leads, visits }]) => {
        const staffById = new Map(staff.map((s) => [s.id, s]));
        const leadById = new Map(leads.map((l) => [l.id, l]));

        const rows: LeadVisitRow[] = [];

        for (const v of visits) {
          if (v.date < from || v.date > to) continue;
          if (staffId && v.staffId !== staffId) continue;

          const person = staffById.get(v.staffId);
          const lead = leadById.get(v.leadId);
          if (!person || !lead) continue; // orphan record
          if (branch && person.branch !== branch) continue;

          rows.push({
            id: v.id,
            date: v.date,
            type: v.type,

            staffId: person.id,
            staffName: person.name,
            staffPhone: person.phone,
            staffBranch: person.branch,

            leadName: lead.name,
            leadPhone: lead.phone,

            originalLocation: lead.address,
            originalLat: lead.lat,
            originalLng: lead.lng,

            checkinLocation: v.checkinAddress,
            checkinLat: v.checkinLat,
            checkinLng: v.checkinLng,

            distanceKm: round2(distanceKm(lead.lat, lead.lng, v.checkinLat, v.checkinLng)),

            inTime: v.inTime,
            outTime: v.outTime,
            duration: formatDuration(toSeconds(v.outTime) - toSeconds(v.inTime)),
          });
        }

        // latest day first, then by check-in time
        return rows.sort(
          (a, b) => b.date.localeCompare(a.date) || toSeconds(a.inTime) - toSeconds(b.inTime),
        );
      }),
    );
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
