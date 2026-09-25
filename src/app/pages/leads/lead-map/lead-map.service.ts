import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { LeadMapData } from './lead-map.model';

@Injectable({
  providedIn: 'root',
})
export class LeadMapService {
  private http = inject(HttpClient);

  /* =========================================================
     DATA SOURCE
     Static JSON for now — point this at `${environment.apiUrl}...`
     once the API is ready; the response shape stays LeadMapData.
  ========================================================== */

  private readonly url = `${environment.jsonPath}leads/lead-map.json`;

  /** Field users and their route timelines for a date (yyyy-mm-dd) */
  getLeadMap(date: string): Observable<LeadMapData> {
    const params = new HttpParams().set('date', date);

    return this.http.get<Partial<LeadMapData>>(this.url, { params }).pipe(
      map((res) => ({
        users: res.users ?? [],
        timelines: res.timelines ?? {},
      })),
    );
  }
}
