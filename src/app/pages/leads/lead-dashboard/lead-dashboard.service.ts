import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { LeadDashboardData } from './lead-dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class LeadDashboardService {
  private http = inject(HttpClient);

  /* =========================================================
     DATA SOURCE
     Static JSON for now — point this at `${environment.apiUrl}...`
     once the API is ready. month / year / staff are already sent
     as query params; the static file ignores them.
  ========================================================== */

  private readonly url = `${environment.jsonPath}leads/lead-dashboard.json`;

  getDashboard(month: number, year: number, staff: string | null = null): Observable<LeadDashboardData> {
    let params = new HttpParams().set('month', month).set('year', year);
    if (staff) params = params.set('staff', staff);

    return this.http.get<Partial<LeadDashboardData>>(this.url, { params }).pipe(map(normalize));
  }
}

/** Fill any missing block so the page never breaks on a partial response */
function normalize(r: Partial<LeadDashboardData>): LeadDashboardData {
  return {
    staff: r.staff ?? [],
    kpis: r.kpis ?? [],
    leaders: r.leaders ?? [],
    targets: r.targets ?? [],
    staffSummary: r.staffSummary ?? [],
    sources: r.sources ?? [],
    averages: r.averages ?? { revenue: 0, qualityLeads: 0, totalLeads: 0, winLead: 0, winQuote: 0, lostRate: 0 },
    daily: (r.daily ?? {}) as LeadDashboardData['daily'],
    yearly: (r.yearly ?? {}) as LeadDashboardData['yearly'],
    calls: r.calls ?? { meeting: [], call: [] },
    pipeline: r.pipeline ?? [],
    averageByStaff: r.averageByStaff ?? { revenue: [], leads: [], won: [], lost: [] },
  };
}
