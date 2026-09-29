import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';

/** Grey picture icon, used when the <img> has no alt text to make initials from */
const PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" fill="#e2e8f0"/>' +
      '<path d="M18 44l9-11 7 8 5-6 7 9z" fill="#94a3b8"/>' +
      '<circle cx="40" cy="24" r="4" fill="#94a3b8"/>' +
    '</svg>',
  );

/**
 * Swaps any <img> that fails to load for a fallback, app-wide — no per-template
 * (error) handler needed. With alt text it becomes an initials avatar
 * (ui-avatars.com, same as primedatatable's fallbackAvatar), otherwise a local
 * placeholder icon. Each image is swapped once, so a failing fallback can't loop.
 * Opt out on a single image with `data-no-fallback`.
 */
@Injectable({ providedIn: 'root' })
export class ImageFallbackService {
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private started = false;

  init(): void {
    if (!this.browser || this.started) return;
    this.started = true;

    // image errors don't bubble — listen in the capture phase to see them all
    this.zone.runOutsideAngular(() => {
      this.doc.addEventListener('error', (e) => this.onError(e), true);
    });
  }

  private onError(e: Event): void {
    const img = e.target;
    if (!(img instanceof HTMLImageElement)) return;
    if (img.hasAttribute('data-no-fallback')) return;

    // already swapped once: the fallback failed too (e.g. offline) — use the local icon
    if (img.dataset['fallback']) {
      if (img.dataset['fallback'] !== 'placeholder') {
        img.dataset['fallback'] = 'placeholder';
        img.src = PLACEHOLDER;
      }
      return;
    }

    const name = img.alt.trim();
    if (name) {
      img.dataset['fallback'] = 'avatar';
      img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e2e8f0&color=334155`;
    } else {
      img.dataset['fallback'] = 'placeholder';
      img.src = PLACEHOLDER;
    }
  }
}
