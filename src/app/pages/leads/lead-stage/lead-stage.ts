import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import {
  PrimeDataTable,
  PrimeTableActions,
  PrimeTableColumn,
  PrimeTableHeader,
} from '../../../shared/primedatatable/primedatatable';
import { ModalField, ModalSaveEvent, ReuseModal } from '../../../shared/reuse-model/reuse-model';
import { LeadStageService } from './lead-stage.service';
import { LeadStageItem, LeadStageInput } from './lead-stage.model';

type Feedback = { type: 'success' | 'danger'; text: string };

@Component({
  selector: 'app-lead-stage',
  standalone: true,
  imports: [PrimeDataTable, ReuseModal],
  templateUrl: './lead-stage.html',
  styleUrl: './lead-stage.scss',
})
export class LeadStage {
  private service = inject(LeadStageService);
  private destroyRef = inject(DestroyRef);

  private stageModal = viewChild.required<ReuseModal>('stageModal');
  private feedbackTimer?: ReturnType<typeof setTimeout>;

  /* =========================================================
     TABLE CONFIG
  ========================================================== */

  readonly actions: PrimeTableActions = {
    add: true,
    edit: true,
    delete: true,
    addLabel: 'New Stage',
    addIcon: 'bi bi-plus-lg',
  };

  readonly columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', width: '80px', sortable: false },
    { field: 'orderNo', header: 'Order No.', type: 'custom', width: '140px', sortable: true },
    { field: 'name', header: 'Stage Name', type: 'custom', sortable: true },
    { field: 'actions', header: 'Options', type: 'actions', width: '120px', sortable: false },
  ];

  /* =========================================================
     STATE
  ========================================================== */

  readonly stages = signal<LeadStageItem[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly feedback = signal<Feedback | null>(null);

  /** Pipeline order (table can be re-sorted by the user) */
  readonly ordered = computed(() =>
    [...this.stages()].sort((a, b) => a.orderNo - b.orderNo || a.name.localeCompare(b.name)),
  );

  readonly header = computed<PrimeTableHeader>(() => ({
    title: 'Lead Stage',
    icon: 'bi bi-layers',
    count: this.stages().length,
  }));

  /** Next free order no. — default for a new stage */
  private readonly nextOrder = computed(() => Math.max(0, ...this.stages().map((s) => s.orderNo)) + 1);

  /** Modal form (shared reuse modal) */
  readonly fields = computed<ModalField[]>(() => [
    {
      key: 'name',
      label: 'Stage Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. Proposal Sent',
      labelIcon: 'bi bi-tag',
      col: 12,
    },
    {
      key: 'orderNo',
      label: 'Order No.',
      type: 'number',
      required: true,
      min: 1,
      defaultValue: this.nextOrder(),
      labelNote: '(position in the pipeline)',
      labelIcon: 'bi bi-sort-numeric-down',
      col: 12,
    },
  ]);

  /** Rejects a name already used by another stage (case-insensitive) */
  readonly validateStage = (e: ModalSaveEvent): string | null => {
    const name = String(e.values['name'] ?? '').trim().toLowerCase();
    const id = e.mode === 'edit' ? Number(e.values['id']) : null;

    if (!name) return 'Stage Name is required';
    if (!Number.isInteger(Number(e.values['orderNo'])) || Number(e.values['orderNo']) < 1) {
      return 'Order No. must be a whole number of 1 or more';
    }

    const duplicate = this.stages().some((s) => s.id !== id && s.name.toLowerCase() === name);
    return duplicate ? 'Stage name already exists.' : null;
  };

  constructor() {
    // data is browser-only: routes are prerendered, where relative HTTP URLs don't resolve
    if (isPlatformBrowser(inject(PLATFORM_ID))) this.load();

    this.destroyRef.onDestroy(() => clearTimeout(this.feedbackTimer));
  }

  /* =========================================================
     DATA
  ========================================================== */

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.service
      .getStages()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (list) => this.stages.set(list),
        error: () => this.error.set('Unable to load lead stages. Please try again.'),
      });
  }

  /* =========================================================
     ACTIONS
  ========================================================== */

  openCreate(): void {
    this.stageModal().open('add');
  }

  onTableAction(event: { action: string; row: LeadStageItem }): void {
    if (event.action === 'edit') {
      this.stageModal().open('edit', { id: event.row.id, name: event.row.name, orderNo: event.row.orderNo });
    }
    if (event.action === 'delete') this.remove(event.row);
  }

  onSaved(e: ModalSaveEvent): void {
    const input: LeadStageInput = {
      name: String(e.values['name']).trim(),
      orderNo: Number(e.values['orderNo']),
    };

    const request$ =
      e.mode === 'add' ? this.service.create(input) : this.service.update(Number(e.values['id']), input);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (saved) => {
        this.stages.update((list) =>
          e.mode === 'add' ? [...list, saved] : list.map((s) => (s.id === saved.id ? saved : s)),
        );
        this.showFeedback('success', `Stage "${saved.name}" ${e.mode === 'add' ? 'created' : 'updated'}.`);
      },
      error: () => this.showFeedback('danger', 'Could not save the stage. Please try again.'),
    });
  }

  private remove(stage: LeadStageItem): void {
    if (!window.confirm(`Delete stage "${stage.name}"?`)) return;

    this.service
      .delete(stage.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.stages.update((list) => list.filter((s) => s.id !== stage.id));
          this.showFeedback('success', `Stage "${stage.name}" deleted.`);
        },
        error: () => this.showFeedback('danger', 'Could not delete the stage. Please try again.'),
      });
  }

  private showFeedback(type: Feedback['type'], text: string): void {
    clearTimeout(this.feedbackTimer);
    this.feedback.set({ type, text });
    this.feedbackTimer = setTimeout(() => this.feedback.set(null), 4000);
  }
}
