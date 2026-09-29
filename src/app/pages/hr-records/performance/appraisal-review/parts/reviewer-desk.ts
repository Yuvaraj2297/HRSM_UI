import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
} from '../../../../../shared/primedatatable/primedatatable';
import { Appraisal, ReviewTier, STAGES, TIERS, stageOf } from '../appraisal.model';
import { AppraisalStore } from '../appraisal.store';
import { ReviewCard } from './review-card';
import { ReviewForm } from './review-form';

/** Reviewer desk: a queue + review split view per tier, and the all-appraisals ledger */
@Component({
  selector: 'app-appraisal-reviewer-desk',
  standalone: true,
  imports: [CommonModule, PrimeDataTable, ReviewCard, ReviewForm],
  templateUrl: './reviewer-desk.html',
  styleUrl: './parts.scss',
})
export class ReviewerDesk {
  readonly store = inject(AppraisalStore);

  readonly tierKeys: ReviewTier[] = ['tl', 'hr', 'mgr'];
  readonly tiers = TIERS;

  /** the open reviewer tier, or null on the All Appraisals tab */
  readonly tier = computed<ReviewTier | null>(() => {
    const tab = this.store.deskTab();
    return tab === 'all' ? null : tab;
  });

  readonly queue = computed(() => {
    const t = this.tier();
    return t ? this.store.queues()[t] : [];
  });

  /** the appraisal open on the current tier's review pane */
  readonly selected = computed(() => {
    const t = this.tier();
    return t ? this.store.selectedIn(t) : null;
  });

  // ---------------------------------------------------------------- ledger
  readonly ledgerHeader: PrimeTableHeader = { title: 'All Appraisals', icon: 'bi bi-journal-text' };

  readonly ledgerColumns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.NO', width: '65px', sortable: false },
    { field: 'name', header: 'EMPLOYEE', width: '230px', sortable: true, type: 'custom' },
    { field: 'stage', header: 'STAGE', width: '200px', sortable: true, type: 'custom' },
    { field: 'ratings', header: 'RATINGS · SELF → TL → HR → MGR', width: '260px', sortable: false, type: 'custom' },
    { field: 'hike', header: 'HIKE', width: '90px', sortable: true, type: 'custom' },
    {
      field: 'actions', header: 'ACTION', width: '150px', type: 'pill-actions',
      buttons: [
        { key: 'review', label: 'Review', icon: 'bi bi-pencil-square', hiddenWhen: (r: { stage: number }) => r.stage === 1 || r.stage === 5 },
        { key: 'scorecard', label: 'Scorecard', icon: 'bi bi-patch-check', variant: 'outline', hiddenWhen: (r: { stage: number }) => r.stage !== 5 },
        { key: 'draft', label: 'View Draft', icon: 'bi bi-eye', variant: 'outline', hiddenWhen: (r: { stage: number }) => r.stage !== 1 },
      ],
    },
  ];

  readonly ledgerRows = computed(() =>
    this.store.appraisals().map((a, i) => ({
      ...a,
      sno: i + 1,
      stage: stageOf(a),
      hike: (a.mgr ?? a.hr ?? a.tl)?.hike ?? null,
    })),
  );

  /** Review / Scorecard / View Draft all go to "wherever this appraisal is now" */
  onLedgerAction(e: { action: string; row: Appraisal }): void {
    const a = this.store.byKey(e.row.key);
    if (a) this.store.openInDesk(a);
  }

  stageLabel(n: number): string {
    return STAGES[n - 1].label;
  }

  stageClass(n: number): string {
    return n === 5 ? 'status-success' : n === 1 ? 'status-muted' : 'status-pending';
  }
}
