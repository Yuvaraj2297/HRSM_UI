import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { LeadStageItem, LeadStageData, LeadStageInput } from './lead-stage.model';

@Injectable({
  providedIn: 'root',
})
export class LeadStageService {
  private http = inject(HttpClient);

  /* =========================================================
     DATA SOURCE
     List comes from static JSON. Create / update / delete keep
     changes in memory for this session — swap each method for
     POST / PUT / DELETE on `${environment.apiUrl}lead-stages`
     when the API is ready; the signatures stay the same.
  ========================================================== */

  private readonly url = `${environment.jsonPath}leads/lead-stages.json`;

  /** In-memory copy once loaded (null = not loaded yet) */
  private stages: LeadStageItem[] | null = null;

  getStages(): Observable<LeadStageItem[]> {
    if (this.stages) return of([...this.stages]);

    return this.http.get<Partial<LeadStageData>>(this.url).pipe(
      map((res) => {
        this.stages = res.stages ?? [];
        return [...this.stages];
      }),
    );
  }

  create(input: LeadStageInput): Observable<LeadStageItem> {
    const list = this.stages ?? [];
    const stage: LeadStageItem = { ...input, id: Math.max(0, ...list.map((s) => s.id)) + 1 };

    this.stages = [...list, stage];
    return of(stage);
  }

  update(id: number, input: LeadStageInput): Observable<LeadStageItem> {
    const list = this.stages ?? [];
    if (!list.some((s) => s.id === id)) return throwError(() => new Error('Stage not found'));

    const stage: LeadStageItem = { ...input, id };
    this.stages = list.map((s) => (s.id === id ? stage : s));
    return of(stage);
  }

  delete(id: number): Observable<void> {
    this.stages = (this.stages ?? []).filter((s) => s.id !== id);
    return of(undefined);
  }
}
