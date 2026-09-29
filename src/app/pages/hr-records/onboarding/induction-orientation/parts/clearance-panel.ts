import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
} from '../../../../../shared/primedatatable/primedatatable';
import { Clearance, MODULES, fmtDate, moduleMeta } from '../induction.model';
import { InductionStore } from '../induction.store';

/** Clearance tab: step 11 — has each joiner completed every mandatory module? */
@Component({
  selector: 'app-induction-clearance-panel',
  standalone: true,
  imports: [CommonModule, PrimeDataTable],
  templateUrl: './clearance-panel.html',
  styleUrl: './panels.scss',
})
export class ClearancePanel {
  readonly store = inject(InductionStore);
  readonly totalModules = MODULES.length;

  readonly tableHeader: PrimeTableHeader = {
    title: 'Induction Clearance',
    subtitle: `All ${MODULES.length} mandatory modules must be completed with the joiner present.`,
    icon: 'bi bi-shield-check',
  };

  readonly columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.NO', width: '65px', sortable: false },
    { field: 'emp', header: 'JOINER', width: '220px', sortable: true, type: 'custom' },
    { field: 'done', header: 'PROGRESS', width: '190px', sortable: false, type: 'custom' },
    { field: 'missing', header: 'MISSING MODULES', width: '280px', sortable: false, type: 'custom' },
    { field: 'certified', header: 'CLEARANCE', width: '190px', sortable: true, type: 'custom' },
    {
      field: 'actions', header: 'ACTION', width: '190px', type: 'pill-actions',
      buttons: [
        { key: 'certificate', label: 'Certificate', icon: 'bi bi-award', variant: 'outline',
          hiddenWhen: (c: Clearance) => !c.certified },
        { key: 'schedule', label: 'Schedule Next', icon: 'bi bi-calendar-plus',
          hiddenWhen: (c: Clearance) => c.certified },
      ],
    },
  ];

  readonly moduleMeta = moduleMeta;
  readonly fmtDate = fmtDate;

  onAction(e: { action: string; row: Clearance }): void {
    if (e.action === 'certificate') this.store.open({ kind: 'certificate', empId: e.row.empId });
    // pre-fill the schedule form with this joiner and their first missing module
    if (e.action === 'schedule') this.store.open({ kind: 'schedule', empId: e.row.empId, module: e.row.missing[0] });
  }
}
