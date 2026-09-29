import { Component, ElementRef, computed, inject, viewChild } from '@angular/core';
import { AppraisalStore } from '../appraisal.store';
import { Scorecard } from '../parts/scorecard';

/** The final scorecard in a modal, with print (only the scorecard, in its own window) */
@Component({
  selector: 'app-appraisal-scorecard-modal',
  standalone: true,
  imports: [Scorecard],
  template: `
    @if (appraisal(); as a) {
      <div class="modal-backdrop-custom" (click)="close()"></div>
      <div class="modal-custom modal-lg" role="dialog" aria-modal="true" [attr.aria-label]="'Scorecard — ' + a.name">
        <div class="modal-header">
          <div class="d-flex align-items-center gap-2">
            <span class="modal-icon-circle"><i class="bi bi-patch-check"></i></span>
            <h5 class="modal-title">Performance Scorecard</h5>
          </div>
          <button type="button" class="btn-close-custom" aria-label="Close" (click)="close()">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body" #sheet>
          <app-appraisal-scorecard [appraisal]="a" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" (click)="close()">Close</button>
          <button type="button" class="btn btn-primary" (click)="print(a.name)">
            <i class="bi bi-printer"></i>
            <span>Print Scorecard</span>
          </button>
        </div>
      </div>
    }
  `,
})
export class ScorecardModal {
  private readonly store = inject(AppraisalStore);
  private readonly sheet = viewChild<ElementRef<HTMLElement>>('sheet');

  readonly appraisal = computed(() => this.store.byKey(this.store.scorecardKey()));

  close(): void {
    this.store.scorecardKey.set(null);
  }

  /** copies the page's stylesheets so the printout looks like the screen */
  print(name: string): void {
    const html = this.sheet()?.nativeElement.innerHTML;
    const win = html ? window.open('', '_blank', 'width=900,height=700') : null;
    if (!win) return;
    const styles = [...document.querySelectorAll('link[rel="stylesheet"], style')].map((n) => n.outerHTML).join('');
    win.document.write(
      `<!doctype html><html><head><title>Scorecard — ${name}</title>${styles}` +
        `<style>body{padding:24px;background:#fff}</style></head><body>${html}</body></html>`,
    );
    win.document.close();
    win.focus();
    // give the copied stylesheets a moment to apply
    setTimeout(() => win.print(), 300);
  }
}
