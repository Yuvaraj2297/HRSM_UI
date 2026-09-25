// bootstrap-fix.service.ts
import { Injectable } from '@angular/core';

declare const bootstrap: any;

@Injectable({
  providedIn: 'root'
})
export class BootstrapFixService {

  init() {
    if (typeof bootstrap === 'undefined' || !bootstrap.Offcanvas || !bootstrap.Modal) {
      return;
    }

    // Bootstrap 5.0 - 5.2
    if (bootstrap.Offcanvas) {
    if (bootstrap.Offcanvas.prototype._enforceFocus) {
      bootstrap.Offcanvas.prototype._enforceFocus = function () {};
    }

    // Bootstrap 5.3+
    if (bootstrap.Offcanvas.prototype._initializeFocusTrap) {
      bootstrap.Offcanvas.prototype._initializeFocusTrap = function () {
        return {
          activate: () => {},
          deactivate: () => {},
          toggleMode: () => {}
        };
      };
    }
  }
  if (bootstrap.Modal) {
    if (bootstrap.Modal.prototype._enforceFocus) {
      bootstrap.Modal.prototype._enforceFocus = function () {};
    }

    if (bootstrap.Modal.prototype._initializeFocusTrap) {
      bootstrap.Modal.prototype._initializeFocusTrap = function () {
        return {
          activate: () => {},
          deactivate: () => {},
          toggleMode: () => {}
        };
      };
    }
  }
  }
}