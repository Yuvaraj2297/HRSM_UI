import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RemoteService {
  /* =========================================================
     HTTP CLIENT
  ========================================================== */

  private http = inject(HttpClient);

  /* =========================================================
     BASE URL
     
     If you already use environment.apiUrl,
     replace this with:
     
     private baseUrl = environment.apiUrl;
  ========================================================== */

  private baseUrl = '';

  /* =========================================================
     COMMON REQUEST METHOD
  ========================================================== */

  sendRequest<T = any>(method: string, url: string, body?: any, params?: any): Observable<T> {
    /* -------------------------------------------------------
       FINAL URL
    -------------------------------------------------------- */

    const finalUrl = this.baseUrl + url;

    /* -------------------------------------------------------
       GET PARAMS
    -------------------------------------------------------- */

    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key];

        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }

    /* -------------------------------------------------------
       HEADERS
    -------------------------------------------------------- */

    let headers = new HttpHeaders();

    /*
      Do NOT manually set Content-Type for FormData.

      Browser will automatically set:
      multipart/form-data
      with boundary.
    */

    if (!(body instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }

    /* -------------------------------------------------------
       REQUEST
    -------------------------------------------------------- */

    switch (method.toUpperCase()) {
      /* =====================================================
         GET
      ====================================================== */

      case 'GET':
        return this.http.get<T>(finalUrl, {
          headers,
          params: httpParams,
        });

      /* =====================================================
         POST
      ====================================================== */

      case 'POST':
        return this.http.post<T>(finalUrl, body, {
          headers,
          params: httpParams,
        });

      /* =====================================================
         PUT
      ====================================================== */

      case 'PUT':
        return this.http.put<T>(finalUrl, body, {
          headers,
          params: httpParams,
        });

      /* =====================================================
         PATCH
      ====================================================== */

      case 'PATCH':
        return this.http.patch<T>(finalUrl, body, {
          headers,
          params: httpParams,
        });

      /* =====================================================
         DELETE
      ====================================================== */

      case 'DELETE':
        return this.http.delete<T>(finalUrl, {
          headers,
          params: httpParams,
          body,
        });

      /* =====================================================
         DEFAULT
      ====================================================== */

      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}
