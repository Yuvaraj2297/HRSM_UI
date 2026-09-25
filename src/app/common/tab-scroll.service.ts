import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';

/** Same list as $tab-bar in global-style/classes.scss */
const TAB_BAR =
  '.page-tabs, .ot-nav-tabs, .nav-tabs-custom, .admin-subnav-container, .status-tabs-pill, .role-tabs, ' +
  '.segmented-nav-wrap, .portal-switcher-wrapper, .lp-tabs, .ne-tabs, .employee-modal-tabs, .mlv-tabs, ' +
  '.ld-tabs, .view-toggle, .ap-toggle, .view-pill-switcher';

/**
 * Keeps the selected tab in view: when a tab becomes `.active` (for example the
 * wizard's Next button moves to a step that is scrolled off-screen) the tab bar
 * scrolls sideways just enough to show it. The previous / next arrows themselves
 * are pure CSS (::scroll-button in global-style/classes.scss).
 */
@Injectable({ providedIn: 'root' })
export class TabScrollService {
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private started = false;

  init(): void {
    if (!this.browser || this.started) return;
    this.started = true;

    this.zone.runOutsideAngular(() => {
      const pending = new Set<HTMLElement>();
      let frame = 0;

      const flush = () => {
        frame = 0;
        pending.forEach((tab) => this.reveal(tab));
        pending.clear();
      };

      new MutationObserver((records) => {
        for (const r of records) {
          const el = r.target as HTMLElement;
          if (el.classList?.contains('active') && el.closest(TAB_BAR)) pending.add(el);
        }
        if (pending.size && !frame) frame = requestAnimationFrame(flush);
      }).observe(this.doc.body, { attributes: true, attributeFilter: ['class'], subtree: true });
    });
  }

  private reveal(tab: HTMLElement): void {
    const bar = tab.closest<HTMLElement>(TAB_BAR);
    if (!bar || bar.scrollWidth <= bar.clientWidth) return;

    const b = bar.getBoundingClientRect();
    const t = tab.getBoundingClientRect();
    const margin = 56;
    if (t.left >= b.left + margin && t.right <= b.right - margin) return;

    bar.scrollBy({ left: t.left - b.left - (b.width - t.width) / 2, behavior: 'smooth' });
  }
}
