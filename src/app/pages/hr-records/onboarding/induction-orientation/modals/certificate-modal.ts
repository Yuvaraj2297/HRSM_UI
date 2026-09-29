import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { Clearance, MODULES, fmtDate } from '../induction.model';
import { InductionStore } from '../induction.store';

/** Step 11 "Yes": the joiner's induction completion certificate */
@Component({
  selector: 'app-induction-certificate-modal',
  standalone: true,
  templateUrl: './certificate-modal.html',
  styleUrl: './certificate-modal.scss',
})
export class CertificateModal {
  private readonly store = inject(InductionStore);
  private readonly sheet = viewChild<ElementRef<HTMLElement>>('sheet');

  readonly modules = MODULES;
  readonly fmtDate = fmtDate;

  readonly cert: Clearance = this.store
    .clearance()
    .find((c) => c.empId === (this.store.modal() as { empId: string }).empId)!;

  /** prints only the certificate, in its own window */
  print(): void {
    const html = this.sheet()?.nativeElement.outerHTML;
    const win = html ? window.open('', '_blank', 'width=900,height=700') : null;
    if (!win) return;
    win.document.write(`<!doctype html><html><head><title>Induction Certificate — ${this.cert.emp}</title>
      <style>
        body { font-family: Georgia, serif; margin: 40px; color: #222; }
        .cert { border: 6px double #1a9c53; padding: 40px; text-align: center; }
        .cert-seal { font-size: 48px; color: #1a9c53; }
        .cert-kicker { letter-spacing: .15em; font-size: 12px; font-weight: bold; color: #1a9c53; }
        .cert-name { font-size: 28px; color: #1a9c53; margin: 8px 0; }
        .cert-modules { list-style: none; padding: 0; display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; font-size: 13px; }
        .cert-foot { display: flex; justify-content: space-between; margin-top: 32px; font-size: 13px; text-align: left; }
        .cert-foot > :last-child { text-align: right; }
        i { display: none; }
      </style></head><body>${html}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  }

  close(): void {
    this.store.close();
  }
}
