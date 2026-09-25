import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomizerSettingsService {
   private isBrowser: boolean;

  private isDarkTheme = false;
  private isSidebarDarkTheme = false;
  private isRightSidebarTheme = false;
  private isHideSidebarTheme = false;
  private isHeaderDarkTheme = false;
  private isCardBorderTheme = false;
  private isCardBorderRadiusTheme = false;
  private isRTLEnabledTheme = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.isDarkTheme = JSON.parse(localStorage.getItem('isDarkTheme') || 'false');
      this.isSidebarDarkTheme = JSON.parse(localStorage.getItem('isSidebarDarkTheme') || 'false');
      this.isRightSidebarTheme = JSON.parse(localStorage.getItem('isRightSidebarTheme') || 'false');
      this.isHideSidebarTheme = JSON.parse(localStorage.getItem('isHideSidebarTheme') || 'false');
      this.isHeaderDarkTheme = JSON.parse(localStorage.getItem('isHeaderDarkTheme') || 'false');
      this.isCardBorderTheme = JSON.parse(localStorage.getItem('isCardBorderTheme') || 'false');
      this.isCardBorderRadiusTheme = JSON.parse(localStorage.getItem('isCardBorderRadiusTheme') || 'false');
      this.isRTLEnabledTheme = JSON.parse(localStorage.getItem('isRTLEnabledTheme') || 'false');

      this.updateDarkBodyClass();
      this.updateRTLBodyClass();
    }
  }

  /* ------------------ THEME TOGGLES ------------------ */

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.setStorage('isDarkTheme', this.isDarkTheme);
    this.updateDarkBodyClass();
  }

  toggleSidebarTheme() {
    this.isSidebarDarkTheme = !this.isSidebarDarkTheme;
    this.setStorage('isSidebarDarkTheme', this.isSidebarDarkTheme);
  }

  toggleRightSidebarTheme() {
    this.isRightSidebarTheme = !this.isRightSidebarTheme;
    this.setStorage('isRightSidebarTheme', this.isRightSidebarTheme);
  }

  toggleHideSidebarTheme() {
    this.isHideSidebarTheme = !this.isHideSidebarTheme;
    this.setStorage('isHideSidebarTheme', this.isHideSidebarTheme);
  }

  toggleHeaderTheme() {
    this.isHeaderDarkTheme = !this.isHeaderDarkTheme;
    this.setStorage('isHeaderDarkTheme', this.isHeaderDarkTheme);
  }

  toggleCardBorderTheme() {
    this.isCardBorderTheme = !this.isCardBorderTheme;
    this.setStorage('isCardBorderTheme', this.isCardBorderTheme);
  }

  toggleCardBorderRadiusTheme() {
    this.isCardBorderRadiusTheme = !this.isCardBorderRadiusTheme;
    this.setStorage('isCardBorderRadiusTheme', this.isCardBorderRadiusTheme);
  }

  toggleRTLEnabledTheme() {
    this.isRTLEnabledTheme = !this.isRTLEnabledTheme;
    this.setStorage('isRTLEnabledTheme', this.isRTLEnabledTheme);
    this.updateRTLBodyClass();
  }

  /* ------------------ BODY CLASSES ------------------ */

  private updateDarkBodyClass() {
    if (!this.isBrowser) return;

    document.body.classList.toggle('dark-theme', this.isDarkTheme);
  }

  private updateRTLBodyClass() {
    if (!this.isBrowser) return;

    document.body.classList.toggle('rtl-enabled', this.isRTLEnabledTheme);
  }

  /* ------------------ GETTERS ------------------ */

  isDark() { return this.isDarkTheme; }
  isSidebarDark() { return this.isSidebarDarkTheme; }
  isRightSidebar() { return this.isRightSidebarTheme; }
  isHideSidebar() { return this.isHideSidebarTheme; }
  isHeaderDark() { return this.isHeaderDarkTheme; }
  isCardBorder() { return this.isCardBorderTheme; }
  isCardBorderRadius() { return this.isCardBorderRadiusTheme; }
  isRTLEnabled() { return this.isRTLEnabledTheme; }

  /* ------------------ TOGGLE OBSERVER ------------------ */

  private isToggled = new BehaviorSubject<boolean>(false);

  get isToggled$() {
    return this.isToggled.asObservable();
  }

  toggle() {
    this.isToggled.next(!this.isToggled.value);
  }

  /* ------------------ HELPERS ------------------ */

  private setStorage(key: string, value: boolean) {
    if (this.isBrowser) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}
