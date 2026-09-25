import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';

import { Toggle } from '../common/toggle.service';
import { CustomizerSettingsService } from '../common/customizer-settings/customizer-settings-service.service';
import { Sidebar } from '../common/sidebar/sidebar';
import { Header } from '../common/header/header';

@Component({
    selector: 'app-layout',
    imports: [RouterOutlet, CommonModule, Sidebar, Header],
    templateUrl: './layout.html',
    styleUrl: './layout.scss',
})
export class Layout {
    title = 'Tagus - Angular 18 Material Design Admin Dashboard Template';

    isToggled = false;

    constructor(
        public router: Router,
        private toggleService: Toggle,
        private viewportScroller: ViewportScroller,
        public themeService: CustomizerSettingsService
    ) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                // Scroll to the top after each navigation end
                this.viewportScroller.scrollToPosition([0, 0]);
            }
        });
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }


}
