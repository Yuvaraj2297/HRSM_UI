import { Injectable, signal } from '@angular/core';

export interface BreadcrumbData {
  title: string;
  parent?: string;
  parentTitle?: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private _data = signal<BreadcrumbData | null>(null);
  readonly data = this._data.asReadonly();

  set(data: BreadcrumbData): void {
    this._data.set(data);
  }

  clear(): void {
    this._data.set(null);
  }
}
