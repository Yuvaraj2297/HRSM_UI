import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COMPETENCIES, band, fmtDate, gapOf, initials, stars } from '../feedback.model';
import { FeedbackStore } from '../feedback.store';

import { AppSelect } from '../../../../../shared/app-select/app-select';
/** 360° Reports tab: one published report at a time */
@Component({
  selector: 'app-feedback-report-panel',
  standalone: true,
  imports: [AppSelect, CommonModule, FormsModule],
  templateUrl: './report-panel.html',
  styleUrl: './parts.scss',
})
export class ReportPanel {
  readonly store = inject(FeedbackStore);

  readonly band = band;
  readonly stars = stars;
  readonly fmtDate = fmtDate;
  readonly initials = initials;

  readonly options = computed(() =>
    this.store.published().map((r) => ({ label: r.name, value: r.id, sub: `${r.role} • ${r.cycle}` })),
  );

  readonly report = this.store.report;

  /** every source that fed the overall score (self shown for comparison only) */
  readonly sources = computed(() => {
    const r = this.report();
    if (!r) return [];
    const s = r.survey;
    const selfAvg = s ? avg(COMPETENCIES.map((c) => s.competencies[c]?.[0]).filter(isNum)) : null;
    return [
      { label: 'Self', who: 'Self-assessment', score: selfAvg, icon: 'bi bi-person', self: true },
      { label: 'Manager', who: r.mgr?.by ?? '', score: r.mgr?.rating ?? null, icon: 'bi bi-person-badge' },
      { label: 'Team Lead', who: r.tl?.by ?? '', score: r.tl?.rating ?? null, icon: 'bi bi-compass' },
      { label: 'HR', who: r.hr?.by ?? '', score: r.hr?.rating ?? null, icon: 'bi bi-award' },
      { label: 'Peers', who: `${s?.peerCount ?? 0} reviewers`, score: s?.peers ?? null, icon: 'bi bi-people' },
      { label: 'Direct Reports', who: `${s?.directCount ?? 0} reviewers`, score: s?.directs ?? null, icon: 'bi bi-diagram-3' },
    ].filter((x) => x.score !== null) as { label: string; who: string; score: number; icon: string; self?: boolean }[];
  });

  readonly matrix = computed(() => {
    const s = this.report()?.survey;
    if (!s) return [];
    return COMPETENCIES.filter((c) => s.competencies[c]).map((c) => {
      const [self, others] = s.competencies[c];
      return { comp: c, self, others, gap: gapOf(self, others) };
    });
  });

  pct(score: number): number {
    return Math.max(0, Math.min(100, (score / 5) * 100));
  }
}

function isNum(x: unknown): x is number {
  return typeof x === 'number';
}

function avg(xs: number[]): number | null {
  return xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null;
}
