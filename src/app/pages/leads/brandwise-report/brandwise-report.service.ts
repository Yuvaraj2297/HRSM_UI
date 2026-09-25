import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { BrandwiseData, BrandwiseFilter } from './brandwise-report.model';

@Injectable({
  providedIn: 'root',
})
export class BrandwiseReportService {
  private http = inject(HttpClient);

  /* =========================================================
     DATA SOURCE
     Static JSON for now — point this at `${environment.apiUrl}...`
     once the API is ready. The filter is already sent as query
     params, so the API only has to read them; the static file
     ignores them and always returns the same sample dashboard.
  ========================================================== */

  private readonly url = `${environment.jsonPath}leads/brandwise-report.json`;

  getDashboard(filter: BrandwiseFilter): Observable<BrandwiseData> {
    let params = new HttpParams().set('range', filter.range);
    if (filter.date) params = params.set('date', filter.date);
    if (filter.brand) params = params.set('brand', filter.brand);
    if (filter.product) params = params.set('product', filter.product);
    if (filter.source) params = params.set('source', filter.source);

    return this.http.get<Partial<BrandwiseData>>(this.url, { params }).pipe(map(normalize));
  }
}

/** Fill any missing block so the page never breaks on a partial response */
function normalize(res: Partial<BrandwiseData>): BrandwiseData {
  return {
    filters: {
      brands: res.filters?.brands ?? [],
      products: res.filters?.products ?? [],
      sources: res.filters?.sources ?? [],
    },
    kpis: res.kpis ?? [],
    revenueTrend: res.revenueTrend ?? [],
    target: res.target ?? { achieved: 0, goal: 0 },
    customerInsight: res.customerInsight ?? [],
    leadsByDate: res.leadsByDate ?? [],
    leadsBySource: res.leadsBySource ?? [],
    conversion: {
      day: res.conversion?.day ?? [],
      week: res.conversion?.week ?? [],
      month: res.conversion?.month ?? [],
    },
    qualification: res.qualification ?? [],
    brandConversion: res.brandConversion ?? [],
    countrySales: res.countrySales ?? [],
    products: res.products ?? [],
  };
}
