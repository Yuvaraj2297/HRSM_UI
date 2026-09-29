import { Injectable, computed, signal } from '@angular/core';
import {
  CYCLES,
  CycleKey,
  DEPTS,
  EMPLOYEES,
  Employee,
  RESULTS,
  Result,
  avg,
  distribution,
  fyLabel,
} from './performance.model';

/** a result joined with its employee — what every table and chart reads */
export interface ResultRow extends Result {
  name: string;
  role: string;
  designation: string;
  dept: string;
  manager: string;
  avatar: string;
  cycleLabel: string;
  fy: string;
  status: 'Approved' | 'In workflow';
}

export interface Filters {
  year: number | null;
  cycle: CycleKey | null;
  dept: string | null;
  designation: string | null;
  manager: string | null;
}

const EMPTY: Filters = { year: 2026, cycle: null, dept: null, designation: null, manager: null };

/** Page state for Performance Reports. Provided by the page component. */
@Injectable()
export class PerformanceStore {
  readonly filters = signal<Filters>({ ...EMPTY });

  /** department drill-down; null = organisation overview */
  readonly drillDept = signal<string | null>(null);
  readonly historyKey = signal('arun');

  // ---------------------------------------------------------------- data
  readonly rows: ResultRow[] = RESULTS.map((r) => {
    const e = EMPLOYEES.find((x) => x.key === r.empKey)!;
    return {
      ...r,
      name: e.name,
      role: e.role,
      designation: e.designation,
      dept: e.dept,
      manager: e.manager,
      avatar: e.avatar,
      cycleLabel: CYCLES[r.cycle],
      fy: fyLabel(r.year),
      status: r.final === null ? 'In workflow' : 'Approved',
    };
  });

  readonly options = {
    years: [...new Set(RESULTS.map((r) => r.year))].sort((a, b) => b - a).map((y) => ({ label: `${y} (${fyLabel(y)})`, value: y })),
    cycles: (Object.keys(CYCLES) as CycleKey[]).map((k) => ({ label: CYCLES[k], value: k })),
    depts: DEPTS.map((d) => ({ label: d.name, value: d.name })),
    designations: [...new Set(EMPLOYEES.map((e) => e.designation))].sort().map((d) => ({ label: d, value: d })),
    managers: [...new Set(EMPLOYEES.map((e) => e.manager))].sort().map((m) => ({ label: m, value: m })),
  };

  // ---------------------------------------------------------------- derived
  readonly filtered = computed(() => this.apply(this.filters()));

  readonly hasFilters = computed(() => {
    const f = this.filters();
    return JSON.stringify(f) !== JSON.stringify(EMPTY);
  });

  readonly kpis = computed(() => summarise(this.filtered(), this.previousYear()));

  /** the same filters one year earlier — for the "vs last year" line */
  private readonly previousYear = computed(() => {
    const f = this.filters();
    return f.year ? this.apply({ ...f, year: f.year - 1 }) : [];
  });

  readonly distribution = computed(() =>
    distribution(this.filtered().map((r) => r.final).filter((x): x is number => x !== null)),
  );

  /** one row per department, from the filtered results (ignores the department filter itself) */
  readonly departments = computed(() => {
    const rows = this.apply({ ...this.filters(), dept: null });
    return DEPTS.map((d) => {
      const mine = rows.filter((r) => r.dept === d.name);
      return { ...d, ...summarise(mine, []) };
    }).filter((d) => d.employees > 0);
  });

  readonly drill = computed(() => {
    const dept = this.drillDept();
    if (!dept) return null;
    const rows = this.apply({ ...this.filters(), dept });
    return { dept, meta: DEPTS.find((d) => d.name === dept)!, rows, kpis: summarise(rows, []),
      distribution: distribution(rows.map((r) => r.final).filter((x): x is number => x !== null)) };
  });

  // ---------------------------------------------------------------- employee history (all years, unfiltered)
  readonly historyOptions = EMPLOYEES.filter((e) => RESULTS.filter((r) => r.empKey === e.key).length > 1)
    .map((e) => ({ label: e.name, value: e.key, sub: `${e.role} • ${e.dept}` }));

  readonly history = computed(() => {
    const key = this.historyKey();
    const emp = EMPLOYEES.find((e) => e.key === key) as Employee;
    const rows = this.rows.filter((r) => r.empKey === key).sort((a, b) => b.year - a.year);
    const approved = rows.filter((r) => r.final !== null);
    const latest = approved[0];
    const first = approved.at(-1);
    return {
      emp,
      rows: rows.map((r, i) => ({ ...r, kpiDelta: rows[i + 1] ? r.kpi - rows[i + 1].kpi : null })),
      ratingFrom: first?.final ?? null,
      ratingTo: latest?.final ?? null,
      kpiFrom: first?.kpi ?? null,
      kpiTo: latest?.kpi ?? null,
      years: approved.length,
    };
  });

  // ---------------------------------------------------------------- actions
  setFilter<K extends keyof Filters>(key: K, value: Filters[K]): void {
    this.filters.update((f) => ({ ...f, [key]: value ?? null }));
  }

  resetFilters(): void {
    this.filters.set({ ...EMPTY });
  }

  /** CSV of exactly what the current filters show */
  exportCsv(rows: ResultRow[], name: string): void {
    const head = ['Year', 'Cycle', 'Employee', 'Role', 'Department', 'Designation', 'Manager', 'KPI %', 'Self', 'Manager Rating', 'Final Rating', 'Status'];
    const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const body = rows.map((r) =>
      [r.fy, r.cycleLabel, r.name, r.role, r.dept, r.designation, r.manager, r.kpi, r.self, r.mgr ?? '', r.final ?? '', r.status].map(q).join(','),
    );
    const blob = new Blob([[head.map(q).join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${name}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  private apply(f: Filters): ResultRow[] {
    return this.rows.filter(
      (r) =>
        (!f.year || r.year === f.year) &&
        (!f.cycle || r.cycle === f.cycle) &&
        (!f.dept || r.dept === f.dept) &&
        (!f.designation || r.designation === f.designation) &&
        (!f.manager || r.manager === f.manager),
    );
  }
}

/** headline numbers for any set of results */
export function summarise(rows: ResultRow[], previous: ResultRow[]) {
  const approved = rows.filter((r) => r.final !== null);
  const rating = avg(approved.map((r) => r.final!));
  const prevRating = avg(previous.filter((r) => r.final !== null).map((r) => r.final!));
  const top = [...approved].sort((a, b) => b.final! - a.final!)[0];
  return {
    employees: new Set(rows.map((r) => r.empKey)).size,
    reviews: rows.length,
    completed: approved.length,
    pending: rows.length - approved.length,
    completionPct: rows.length ? Math.round((approved.length / rows.length) * 100) : 0,
    rating,
    ratingDelta: rating !== null && prevRating !== null ? Math.round((rating - prevRating) * 10) / 10 : null,
    kpi: avg(rows.map((r) => r.kpi)),
    top: top ? { name: top.name, rating: top.final! } : null,
  };
}
