import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import { Component, ElementRef, HostListener, Injector, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { BiIcon, BiName } from '../bi-icon';

type Kind = 'earning' | 'deduction';
type Category = 'Fixed' | 'Variable' | 'Statutory' | 'Voluntary';

/** One salary component as stored (was a `.structure-item` with data-* attributes in the PHP). */
interface SalaryComponent {
  id: number;
  kind: Kind;
  name: string;
  icon: BiName;
  category: Category;
  /** Percentage of Base CTC. Ignored when `fixed` is set. */
  pct: number;
  /** Flat monthly amount (data-fixed in the PHP). */
  fixed?: number;
  /** Replaces the "50%" text, e.g. "Slab", "Variable", "—". */
  label?: string;
  /** Replaces the amount text under the label, e.g. "Fixed". */
  sub?: string;
  /** Short name for the Statutory KPI (PF, ESI ...). */
  short?: string;
}

interface ComponentRow {
  id: number;
  name: string;
  icon: BiName;
  category: Category;
  pctLabel: string;
  subLabel: string;
  amount: number;
}

interface Group {
  kind: Kind;
  title: string;
  icon: BiName;
  rows: ComponentRow[];
}

interface Draft {
  kind: Kind;
  name: string;
  category: Category;
  pct: string;
}

const inr = (n: number) => '\u20B9' + Math.round(n).toLocaleString('en-IN');

/** Seed data from the PHP page. Replace with an API call when it's ready. */
const SEED: SalaryComponent[] = [
  { id: 1, kind: 'earning', name: 'Basic Salary', icon: 'cash', category: 'Fixed', pct: 50 },
  { id: 2, kind: 'earning', name: 'House Rent Allowance', icon: 'house', category: 'Fixed', pct: 20 },
  { id: 3, kind: 'earning', name: 'Dearness Allowance', icon: 'graph-up', category: 'Fixed', pct: 10 },
  { id: 4, kind: 'earning', name: 'Conveyance Allowance', icon: 'car-front', category: 'Fixed', pct: 6.4 },
  { id: 5, kind: 'earning', name: 'Medical Allowance', icon: 'heart-pulse', category: 'Fixed', pct: 4 },
  { id: 6, kind: 'earning', name: 'Special Allowance', icon: 'star', category: 'Variable', pct: 9.6 },

  { id: 7, kind: 'deduction', name: 'Provident Fund (PF)', icon: 'shield-lock', category: 'Statutory', pct: 6, short: 'PF' },
  { id: 8, kind: 'deduction', name: 'Employee State Insurance', icon: 'hospital', category: 'Statutory', pct: 1, short: 'ESI' },
  { id: 9, kind: 'deduction', name: 'Professional Tax', icon: 'receipt', category: 'Statutory', pct: 0, fixed: 200, sub: 'Fixed', short: 'PT' },
  { id: 10, kind: 'deduction', name: 'Income Tax (TDS)', icon: 'bank', category: 'Statutory', pct: 0, fixed: 0, label: 'Slab', short: 'TDS' },
  { id: 11, kind: 'deduction', name: 'Loan Deduction', icon: 'credit-card', category: 'Voluntary', pct: 0, fixed: 0, label: 'Variable' },
];

@Component({
  selector: 'app-salary-structure',
  imports: [BiIcon, AppStatCard],
  templateUrl: './salary-structure.html',
  styleUrl: './salary-structure.scss',
})
export class SalaryStructure {
  private readonly injector = inject(Injector);
  private nextId = 12;
  private opener: HTMLElement | null = null;

  readonly categories: Category[] = ['Fixed', 'Variable', 'Statutory', 'Voluntary'];
  readonly inr = inr;

  // --- state
  readonly components = signal<SalaryComponent[]>(SEED);
  /** Kept as the raw string so clearing the field while typing doesn't snap back to 0. */
  readonly ctcRaw = signal('50000');

  // --- add-component modal
  readonly modalOpen = signal(false);
  readonly draft = signal<Draft>({ kind: 'earning', name: '', category: 'Fixed', pct: '' });
  readonly nameError = signal(false);
  readonly pctError = signal(false);
  private readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');

  // --- derived
  readonly ctc = computed(() => Math.max(0, parseFloat(this.ctcRaw()) || 0));

  private readonly rows = computed(() => {
    const ctc = this.ctc();
    return this.components().map((c) => {
      const amount = c.fixed ?? Math.round((ctc * c.pct) / 100);
      const row: ComponentRow & { kind: Kind } = {
        id: c.id,
        kind: c.kind,
        name: c.name,
        icon: c.icon,
        category: c.category,
        amount,
        pctLabel: c.label ?? (c.fixed !== undefined ? inr(c.fixed) : `${c.pct}%`),
        subLabel: c.sub ?? inr(amount),
      };
      return row;
    });
  });

  readonly earningRows = computed(() => this.rows().filter((r) => r.kind === 'earning'));
  readonly deductionRows = computed(() => this.rows().filter((r) => r.kind === 'deduction'));

  readonly groups = computed<Group[]>(() => [
    { kind: 'earning', title: 'Earning Components', icon: 'plus-circle', rows: this.earningRows() },
    { kind: 'deduction', title: 'Deduction Components', icon: 'dash-circle', rows: this.deductionRows() },
  ]);

  readonly totalEarnings = computed(() => this.earningRows().reduce((s, r) => s + r.amount, 0));
  readonly totalDeductions = computed(() => this.deductionRows().reduce((s, r) => s + r.amount, 0));
  readonly netSalary = computed(() => this.totalEarnings() - this.totalDeductions());
  readonly deductionPct = computed(() => {
    const gross = this.totalEarnings();
    return gross > 0 ? `${+((this.totalDeductions() / gross) * 100).toFixed(1)}%` : '0%';
  });

  private readonly statutory = computed(() => this.components().filter((c) => c.category === 'Statutory'));
  readonly statutoryCount = computed(() => this.statutory().length);
  readonly statutoryNames = computed(() => this.statutory().map((c) => c.short ?? c.name).join(', '));

  readonly modalTitle = computed(() => `Add ${this.draft().kind === 'earning' ? 'Earning' : 'Deduction'} Component`);

  // ---------------------------------------------------------------- base CTC
  onCtc(e: Event): void {
    this.ctcRaw.set((e.target as HTMLInputElement).value);
  }

  // ---------------------------------------------------------------- modal
  openModal(kind: Kind, e: Event): void {
    this.opener = e.currentTarget as HTMLElement;
    this.draft.set({ kind, name: '', category: 'Fixed', pct: '' });
    this.nameError.set(false);
    this.pctError.set(false);
    this.modalOpen.set(true);
    afterNextRender(() => this.nameInput()?.nativeElement.focus(), { injector: this.injector });
  }

  closeModal(): void {
    if (!this.modalOpen()) return;
    this.modalOpen.set(false);
    this.opener?.focus();
  }

  onBackdrop(e: MouseEvent): void {
    if (e.target === e.currentTarget) this.closeModal();
  }

  patch(changes: Partial<Draft>): void {
    this.draft.update((d) => ({ ...d, ...changes }));
    if ('name' in changes) this.nameError.set(false);
    if ('pct' in changes) this.pctError.set(false);
  }

  value(e: Event): string {
    return (e.target as HTMLInputElement | HTMLSelectElement).value;
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    this.saveComponent();
  }

  saveComponent(): void {
    const d = this.draft();
    const name = d.name.trim();
    const hasPct = d.pct.trim() !== '';
    const pct = parseFloat(d.pct);

    if (!name) {
      this.nameError.set(true);
      this.nameInput()?.nativeElement.focus();
      return;
    }
    if (hasPct && (isNaN(pct) || pct < 0 || pct > 100)) {
      this.pctError.set(true);
      return;
    }

    this.components.update((list) => [
      ...list,
      {
        id: this.nextId++,
        kind: d.kind,
        name,
        icon: 'plus-circle',
        category: d.category,
        pct: hasPct ? pct : 0,
        label: hasPct ? undefined : '\u2014',
      },
    ]);
    this.closeModal();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal();
  }
}
