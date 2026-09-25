// toggle.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/** Below this width the sidebar is an off-canvas drawer (keep in sync with sidebar.scss / layout.scss). */
const MOBILE_QUERY = '(max-width: 767.98px)';

@Injectable({
  providedIn: 'root'   //  MUST be root so all components share the same instance
})
export class Toggle {

  private readonly mobileQuery =
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(MOBILE_QUERY) : null;

  /**
   * true  = desktop: sidebar collapsed to the icon rail / phone: drawer closed
   * false = desktop: sidebar expanded / phone: drawer open
   * Phones start with the drawer closed so the page gets the full width.
   */
  private _isToggled = new BehaviorSubject<boolean>(this.isMobile);

  /** Public observable — components subscribe to this */
  isToggled$: Observable<boolean> = this._isToggled.asObservable();

  constructor() {
    // crossing the breakpoint: close the drawer on phones, expand again on desktop
    this.mobileQuery?.addEventListener('change', (e) => this._isToggled.next(e.matches));
  }

  /** true while the sidebar is shown as a phone drawer */
  get isMobile(): boolean {
    return !!this.mobileQuery?.matches;
  }

  /** Toggle the current state */
  toggle(): void {
    this._isToggled.next(!this._isToggled.value);
  }

  /** Explicitly set the state (optional, but useful) */
  setToggled(value: boolean): void {
    this._isToggled.next(value);
  }

  /** Get the current value synchronously */
  get isToggled(): boolean {
    return this._isToggled.value;
  }
}
