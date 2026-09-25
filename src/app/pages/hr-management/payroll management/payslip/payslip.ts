import { Component, DestroyRef, EnvironmentInjector, HostListener, Injector, WritableSignal, afterNextRender, computed, createComponent, inject, signal } from '@angular/core';
import { BiIcon } from './bi-icon';
import {
  CURRENT_EMPLOYEE_ID,
  DED_FIELDS,
  DedKey,
  EARN_FIELDS,
  EMPLOYEES,
  EarnKey,
  Employee,
  PERIODS,
  PayslipRequest,
  ReqStatus,
  SlipData,
  buildSlip,
  dedOf,
  grossOf,
  inr,
  num,
  today,
  valuesFor,
} from './payslip-data';
import { PayslipSheet } from './payslip-sheet';
import { PrimeDataTable, PrimeTableColumn } from '../../../../shared/primedatatable/primedatatable';

/* ------------------------------------------------------------------ */
/*  Local state shapes                                                 */
/* ------------------------------------------------------------------ */

type Tab = 'employee' | 'admin';

/** A request joined with its employee. */
interface ReqView {
  r: PayslipRequest;
  e: Employee;
}

interface RejectState {
  reqId: number;
  name: string;
  period: string;
  reason: string;
}

interface ManualState {
  reqId: number;
  subtitle: string;
  period: string;
  workingDays: string;
  present: string;
  absent: string;
  earn: Record<EarnKey, string>;
  ded: Record<DedKey, string>;
  error: string | null;
}

interface MenuState {
  reqId: number;
  top: number;
  left: number;
}

const EMP_BY_ID = new Map(EMPLOYEES.map((e) => [e.id, e]));

/** Which stepper dot a request status maps to. */
const STEP_OF: Record<ReqStatus, 1 | 2 | 3 | 4> = { pending: 2, approved: 3, generated: 4, rejected: 1 };

const asText = <K extends string>(o: Record<K, number>) =>
  Object.fromEntries(Object.entries<number>(o).map(([k, v]) => [k, String(v)])) as Record<K, string>;
const asNumbers = <K extends string>(o: Record<K, string>) =>
  Object.fromEntries(Object.entries<string>(o).map(([k, v]) => [k, num(v)])) as Record<K, number>;
const sumText = (o: Record<string, string>) => Object.values(o).reduce((a, v) => a + num(v), 0);

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

@Component({
  selector: 'app-payslip',
  imports: [BiIcon, PayslipSheet, PrimeDataTable],
  templateUrl: './payslip.html',
  styleUrl: './payslip.scss',
})
export class Payslip {
  private readonly injector = inject(Injector);
  private readonly envInjector = inject(EnvironmentInjector);
  private opener: HTMLElement | null = null;
  private menuTrigger: HTMLElement | null = null;
  private nextReqId = 1;
  private toastTimer?: ReturnType<typeof setTimeout>;
  private submitTimer?: ReturnType<typeof setTimeout>;

  // constants for the template
  readonly periods = PERIODS;
  readonly employees = EMPLOYEES;
  readonly me = EMP_BY_ID.get(CURRENT_EMPLOYEE_ID)!;
  readonly earnFields = EARN_FIELDS;
  readonly dedFields = DED_FIELDS;
  readonly steps = [
    { n: 1, label: 'Submit Request', icon: 'file-earmark-plus' },
    { n: 2, label: 'Pending Review', icon: 'hourglass-split' },
    { n: 3, label: 'Approved', icon: 'check-circle' },
    { n: 4, label: 'Payslip Ready', icon: 'file-earmark-pdf' },
  ] as const;
  readonly inr = inr;
  readonly grossOf = grossOf;
  readonly dedOf = dedOf;
columns: PrimeTableColumn[] = [];

tableData: any[] = [];

ngOnInit(): void {
  this.columns = this.payslipColumns();
  this.loadPayslipRequests();
}
loadPayslipRequests(): void {
  this.tableData = this.myRequests().map((v, index) => ({
    
    
    sno: index + 1,

    employee: `${v.e.name} (${v.e.empId})`,

    period: v.r.period,

    requestedOn: v.r.requestedOn,

    note: v.r.note || '—',

    status: this.statusLabel(v.r.status),

    actions: v.r.reqId
  }));
  
}
payslipColumns(): PrimeTableColumn[] {
  return [
    {
      field: 'sno',
      header: 'S.NO',
      type: 'text',
      width: '80px',
      sortable: false
    },
    {
      field: 'employee',
      header: 'EMPLOYEE',
      type: 'text',
      width: '180px',
      sortable: true
    },
    {
      field: 'period',
      header: 'PAY PERIOD',
      type: 'text',
      width: '140px',
      sortable: true
    },
    {
      field: 'requestedOn',
      header: 'REQUESTED ON',
      type: 'text',
      width: '140px',
      sortable: true
    },
    {
      field: 'note',
      header: 'NOTE',
      type: 'text',
      width: '200px',
      sortable: false
    },
    {
      field: 'status',
      header: 'STATUS',
      type: 'status',
      width: '130px',
      sortable: true
    },
    {
      field: 'actions',
      header: 'ACTION',
      type: 'actions',
      width: '180px',
      sortable: false
    }
  ];
}
  // ---------------------------------------------------------------- state
  readonly tab = signal<Tab>('employee');
  readonly requests = signal<PayslipRequest[]>([]);

  /** Stepper: which panel is showing, and which dot is highlighted (they move together when clicked). */
  readonly panel = signal(1);
  readonly dotStep = signal(1);

  // request form
  readonly period = signal('Aug 2026');
  readonly note = signal('');
  readonly submitted = signal(false);

  // admin selections
  private readonly pendingSel = signal<ReadonlySet<number>>(new Set());
  private readonly approvedSel = signal<ReadonlySet<number>>(new Set());

  // overlays
  readonly actionMenu = signal<MenuState | null>(null);
  readonly reject = signal<RejectState | null>(null);
  readonly manual = signal<ManualState | null>(null);
  readonly previewId = signal<number | null>(null);
  readonly toast = signal<string | null>(null);
  readonly brokenAvatars = signal<ReadonlySet<number>>(new Set());
  readonly scrolled = signal(false);

  // ---------------------------------------------------------------- derived
  readonly views = computed<ReqView[]>(() =>
    this.requests().flatMap((r) => {
      const e = EMP_BY_ID.get(r.empId);
      return e ? [{ r, e }] : [];
    }),
  );

  private readonly mine = computed(() => this.views().filter((v) => v.e.id === CURRENT_EMPLOYEE_ID));
  readonly myRequests = computed(() => [...this.mine()].reverse());
  readonly myPending = computed(() => this.mine().filter((v) => v.r.status === 'pending'));
  readonly myApproved = computed(() => this.mine().filter((v) => v.r.status === 'approved'));
  readonly myGenerated = computed(() => this.mine().filter((v) => v.r.status === 'generated'));

  readonly pendingViews = computed(() => this.views().filter((v) => v.r.status === 'pending'));
  readonly approvedViews = computed(() => this.views().filter((v) => v.r.status === 'approved' || v.r.status === 'generated'));

  readonly counts = computed(() => {
    const c = { pending: 0, approved: 0, rejected: 0, generated: 0 };
    for (const r of this.requests()) c[r.status]++;
    return c;
  });

  readonly pendingSelected = computed(() => this.pendingViews().map((v) => v.r.reqId).filter((id) => this.pendingSel().has(id)));
  readonly approvedSelected = computed(() => this.approvedViews().map((v) => v.r.reqId).filter((id) => this.approvedSel().has(id)));

  readonly manualPreview = computed(() => {
    const m = this.manual();
    if (!m) return { gross: 0, deduct: 0, net: 0 };
    const gross = sumText(m.earn);
    const deduct = sumText(m.ded);
    return { gross, deduct, net: gross - deduct };
  });

  readonly previewSlip = computed<SlipData | null>(() => {
    const v = this.views().find((x) => x.r.reqId === this.previewId());
    return v ? buildSlip(v.e, v.r) : null;
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.toastTimer);
      clearTimeout(this.submitTimer);
    });
  }

  // ================================================================ small helpers
  value(e: Event): string {
    return (e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
  }

  statusLabel(s: ReqStatus): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /** The figures for a request: manual entries if HR made any, else the employee's defaults. */
  valuesFor(v: ReqView) {
    return valuesFor(v.e, v.r);
  }

  netOf(v: ReqView): number {
    const x = valuesFor(v.e, v.r);
    return grossOf(x.earn) - dedOf(x.ded);
  }

  grossFor(v: ReqView): number {
    return grossOf(valuesFor(v.e, v.r).earn);
  }

  netPct(v: ReqView): number {
    const g = this.grossFor(v);
    return g ? Math.round((this.netOf(v) / g) * 100) : 0;
  }

  avatarSrc(id: number): string {
    return `assets/img/profile-${((id - 1) % 4) + 1}.jpg`;
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('');
  }

  onAvatarError(id: number): void {
    this.brokenAvatars.update((s) => new Set(s).add(id));
  }

  private showToast(message: string): void {
    clearTimeout(this.toastTimer);
    this.toast.set(message);
    this.toastTimer = setTimeout(() => this.toast.set(null), 3500);
  }

  private focusFirstField(): void {
    afterNextRender(() => document.querySelector<HTMLElement>('.modal-dialog [data-autofocus]')?.focus(), { injector: this.injector });
  }

  /** Remembers what to refocus when a dialog closes. Menu items vanish on click, so use the menu's trigger instead. */
  private rememberOpener(e?: Event): void {
    const el = e?.currentTarget as HTMLElement | undefined;
    this.opener = el?.closest('.action-menu') ? this.menuTrigger : (el ?? null);
  }

  private patchRequests(ids: Iterable<number>, patch: Partial<PayslipRequest>): void {
    const set = new Set(ids);
    this.requests.update((all) => all.map((r) => (set.has(r.reqId) ? { ...r, ...patch } : r)));
    this.syncStepper();
  }

  // ================================================================ tabs + stepper
  setTab(t: Tab): void {
    this.tab.set(t);
    this.actionMenu.set(null);
  }

  showStep(n: number): void {
    this.panel.set(n);
    this.dotStep.set(n);
  }

  /** Highlights the dot that matches the newest request, without switching panels. */
  private syncStepper(): void {
    const mine = this.mine();
    const last = mine[mine.length - 1];
    this.dotStep.set(last ? STEP_OF[last.r.status] : 1);
  }

  // ================================================================ employee: request form
  submitRequest(): void {
    const now = today();
    this.requests.update((all) => [
      ...all,
      {
        reqId: this.nextReqId++,
        empId: this.me.id,
        period: this.period(),
        note: this.note().trim(),
        status: 'pending',
        requestedOn: now,
        rejectReason: '',
      },
    ]);
    console.log(this.requests());
    this.tableData = this.myRequests().map((v, index) => ({
      sno: index + 1,
      employee: `${v.e.name} (${v.e.empId})`,
      period: v.r.period,
      requestedOn: v.r.requestedOn,
      note: v.r.note || '—',
      status: this.statusLabel(v.r.status),
      actions: v.r.reqId
    }));
    // this.showStep(2);
    this.showToast('Request submitted');
  }

  // ================================================================ admin: pending
  private toggleIn(sig: WritableSignal<ReadonlySet<number>>, id: number): void {
    sig.update((s) => {
      const next = new Set(s);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  togglePending(id: number): void {
    this.toggleIn(this.pendingSel, id);
  }

  togglePendingAll(checked: boolean): void {
    this.pendingSel.set(checked ? new Set(this.pendingViews().map((v) => v.r.reqId)) : new Set());
  }

  isPendingSelected(id: number): boolean {
    return this.pendingSel().has(id);
  }

  approve(id: number): void {
    this.patchRequests([id], { status: 'approved' });
    this.showStep(3);
    this.showToast('Request approved');
  }

  bulkApprove(): void {
    const ids = this.pendingSelected();
    this.patchRequests(ids, { status: 'approved' });
    this.pendingSel.set(new Set());
    this.showStep(3);
    this.showToast(`${ids.length} ${ids.length === 1 ? 'request' : 'requests'} approved`);
  }

  bulkReject(): void {
    const ids = this.pendingSelected();
    this.patchRequests(ids, { status: 'rejected', rejectReason: 'Bulk rejected by HR' });
    this.pendingSel.set(new Set());
    this.showToast(`${ids.length} ${ids.length === 1 ? 'request' : 'requests'} rejected`);
  }

  // ---------------------------------------------------------------- reject modal
  openReject(v: ReqView, e: Event): void {
    this.rememberOpener(e);
    this.reject.set({ reqId: v.r.reqId, name: v.e.name, period: v.r.period, reason: '' });
    this.focusFirstField();
  }

  closeReject(): void {
    if (!this.reject()) return;
    this.reject.set(null);
    this.opener?.focus();
  }

  confirmReject(): void {
    const s = this.reject();
    if (!s) return;
    this.patchRequests([s.reqId], { status: 'rejected', rejectReason: s.reason.trim() || 'No reason provided' });
    this.reject.set(null);
    this.showToast(`Request rejected for ${s.name}`);
  }

  // ================================================================ admin: approved / generate
  toggleApproved(id: number): void {
    this.toggleIn(this.approvedSel, id);
  }

  toggleApprovedAll(checked: boolean): void {
    this.approvedSel.set(checked ? new Set(this.approvedViews().map((v) => v.r.reqId)) : new Set());
  }

  isApprovedSelected(id: number): boolean {
    return this.approvedSel().has(id);
  }

  clearApprovedSelection(): void {
    this.approvedSel.set(new Set());
  }

  generateAuto(id: number): void {
    this.patchRequests([id], { status: 'generated', genType: 'auto', generatedOn: today(), manual: undefined });
  }

  bulkAuto(): void {
    const ids = this.approvedSelected();
    for (const id of ids) this.generateAuto(id);
    this.approvedSel.set(new Set());
    this.showToast(`${ids.length} ${ids.length === 1 ? 'payslip' : 'payslips'} generated`);
  }

  bulkManual(e: Event): void {
    const [id] = this.approvedSelected();
    if (this.approvedSelected().length === 1) {
      this.openManual(id, e);
    }
  }

  // ---------------------------------------------------------------- row action menu
  openMenu(e: MouseEvent, id: number): void {
    const trigger = e.currentTarget as HTMLElement;
    if (this.actionMenu()?.reqId === id) {
      this.actionMenu.set(null);
      return;
    }
    this.menuTrigger = trigger;
    const r = trigger.getBoundingClientRect();
    const menuHeight = 230;
    const flip = r.bottom + 6 + menuHeight > window.innerHeight;
    this.actionMenu.set({
      reqId: id,
      left: Math.max(8, Math.min(r.right - 232, window.innerWidth - 240)),
      top: flip ? Math.max(8, r.top - 6 - menuHeight) : r.bottom + 6,
    });
  }

  menuAction(action: 'auto' | 'manual' | 'preview' | 'print' | 'pdf', e: Event): void {
    const id = this.actionMenu()?.reqId;
    if (id === undefined) return;
    this.rememberOpener(e);
    this.actionMenu.set(null);
    switch (action) {
      case 'auto':
        this.generateAuto(id);
        this.showToast('Payslip generated');
        this.menuTrigger?.focus();
        break;
      case 'manual':
        this.openManual(id, e);
        break;
      case 'preview':
        this.openPreview(id, e);
        break;
      case 'print':
        this.printSlip(id);
        break;
      case 'pdf':
        this.downloadPdf(id);
        break;
    }
  }

  // ---------------------------------------------------------------- manual payslip modal
  openManual(id: number, e?: Event): void {
    const v = this.views().find((x) => x.r.reqId === id);
    if (!v) return;
    if (e) this.rememberOpener(e);
    const x = valuesFor(v.e, v.r);
    this.manual.set({
      reqId: id,
      subtitle: `${v.e.name} (${v.e.empId}) \u2014 ${v.r.period}`,
      period: v.r.period,
      workingDays: String(v.r.manual?.workingDays ?? 28),
      present: String(x.present),
      absent: String(x.absent),
      earn: asText(x.earn),
      ded: asText(x.ded),
      error: null,
    });
    this.focusFirstField();
  }

  closeManual(): void {
    if (!this.manual()) return;
    this.manual.set(null);
    this.opener?.focus();
  }

  patchManual(changes: Partial<Pick<ManualState, 'workingDays' | 'present' | 'absent'>>): void {
    this.manual.update((m) => m && { ...m, ...changes, error: null });
  }

  setManualEarn(key: EarnKey, e: Event): void {
    this.manual.update((m) => m && { ...m, earn: { ...m.earn, [key]: this.value(e) } });
  }

  setManualDed(key: DedKey, e: Event): void {
    this.manual.update((m) => m && { ...m, ded: { ...m.ded, [key]: this.value(e) } });
  }

  onManualSubmit(e: Event): void {
    e.preventDefault();
    this.saveManual();
  }

  saveManual(): void {
    const m = this.manual();
    if (!m) return;

    const working = Number(m.workingDays);
    const present = Number(m.present);
    const absent = Number(m.absent);
    const ok = [working, present, absent].every((n) => Number.isInteger(n) && n >= 0) && working >= 1 && working <= 31 && present + absent <= working;
    if (!ok) {
      this.manual.update((x) => x && { ...x, error: 'Working, present and absent days must be whole numbers, and present + absent can\u2019t exceed the working days (31 at most).' });
      return;
    }

    this.patchRequests([m.reqId], {
      status: 'generated',
      genType: 'manual',
      generatedOn: today(),
      manual: { workingDays: working, present, absent, earn: asNumbers(m.earn), ded: asNumbers(m.ded) },
    });
    this.manual.set(null);
    this.previewId.set(m.reqId); // straight to the preview, like the PHP page
  }

  // ---------------------------------------------------------------- preview / print / pdf
  openPreview(id: number, e?: Event): void {
    if (e) this.rememberOpener(e);
    this.previewId.set(id);
    this.focusFirstField();
  }

  closePreview(): void {
    if (this.previewId() === null) return;
    this.previewId.set(null);
    this.opener?.focus();
  }

  /** Renders the sheet off-screen and prints it in its own window. */
  printSlip(id: number): void {
    const v = this.views().find((x) => x.r.reqId === id);
    if (!v) return;

    const ref = createComponent(PayslipSheet, { environmentInjector: this.envInjector });
    ref.setInput('slip', buildSlip(v.e, v.r));
    ref.changeDetectorRef.detectChanges();
    const html = (ref.location.nativeElement as HTMLElement).outerHTML;
    ref.destroy();

    const w = window.open('', '_blank');
    if (!w) {
      this.showToast('Allow pop-ups to print the payslip');
      return;
    }
    const css = Array.from(document.querySelectorAll('style')).map((s) => s.textContent ?? '').join('\n');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Payslip \u2014 ${v.e.name} \u2014 ${v.r.period}</title><style>${css}</style><style>body{margin:0;padding:16px}@media print{body{padding:0}}</style></head><body>${html}</body></html>`);
    w.document.close();
    setTimeout(() => {
      w.focus();
      w.print();
    }, 300);
  }

  /** TODO: generate a real PDF (server-side or with a PDF library). The PHP page only showed an alert. */
  downloadPdf(id: number): void {
    const v = this.views().find((x) => x.r.reqId === id);
    if (v) this.showToast(`Downloading payslip PDF for ${v.e.name} \u2014 ${v.r.period}`);
  }

  // ================================================================ dialog plumbing
  trapFocus(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;
    const items = Array.from((e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !items.includes(active as HTMLElement))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  onTableScroll(): void {
    this.actionMenu.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    if (!(e.target as HTMLElement | null)?.closest('.action-menu, .menu-trigger')) this.actionMenu.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.previewId() !== null) this.closePreview();
    else if (this.manual()) this.closeManual();
    else if (this.reject()) this.closeReject();
    else this.actionMenu.set(null);
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onViewportChange(): void {
    this.actionMenu.set(null);
  }
}
