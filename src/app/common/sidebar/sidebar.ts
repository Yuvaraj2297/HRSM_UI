import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  NavigationEnd
} from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { Toggle } from '../toggle.service';
import { SidebarRoutes, SidebarRailMenuItem, SidebarMenuMap } from '../../services/siderbar-routes';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FormsModule,
    TooltipModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit, OnDestroy {

  @ViewChild('iconRail') iconRailRef!: ElementRef<HTMLDivElement>;
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  isToggled = false;
  private routerSub?: Subscription;

  get hostStyle(): string {
    return `width:${this.isToggled ? 70 : 300}px !important;`;
  }

  activeMenu = 'DAS'; // Default, will be overwritten by route detection
  searchText = '';
  showSearch = false;

  expandedItems: Record<string, boolean> = {};

  get sidebarMenus(): SidebarMenuMap {
    return this.sidebarRoutesService.sidebarMenus;
  }

  get menuList(): SidebarRailMenuItem[] {
    return this.sidebarRoutesService.menuList;
  }

  constructor(
    private toggleService: Toggle,
    private router: Router,
    public sidebarRoutesService: SidebarRoutes
  ) {
    this.toggleService.isToggled$.subscribe(v => this.isToggled = v);
  }

  ngOnInit(): void {
    // 1. Set the active menu based on the current URL on load
    this.syncActiveMenuWithUrl(this.router.url);

    // 2. Listen for future route changes and update the active menu
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.syncActiveMenuWithUrl(event.urlAfterRedirects);
        this.closeDrawer();
      });
  }

  /** Phone drawer: close it (no-op on desktop, where the sidebar stays as it is) */
  @HostListener('document:keydown.escape')
  closeDrawer(): void {
    if (this.toggleService.isMobile && !this.isToggled) {
      this.toggleService.setToggled(true);
    }
  }

  get isDrawerOpen(): boolean {
    return this.toggleService.isMobile && !this.isToggled;
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  /**
   * Determines which rail icon should be highlighted based on the current URL.
   * It checks all children routes across all menus.
   */
  private syncActiveMenuWithUrl(url: string): void {
    const cleanUrl = url.split('?')[0].split('#')[0];

    for (const [menuKey, menuData] of Object.entries(this.sidebarMenus)) {
      for (const item of menuData.items) {
        // Check parent route
        if (item.route && this.routeMatches(cleanUrl, item.route)) {
          this.activeMenu = menuKey;
          return;
        }
        // Check child routes
        if (item.children) {
          for (const child of item.children) {
            if (this.routeMatches(cleanUrl, child.route)) {
              this.activeMenu = menuKey;
              // Auto-expand the parent accordion for better UX
              this.expandedItems[item.title] = true;
              return;
            }
          }
        }
      }
    }
  }

  private routeMatches(currentUrl: string, targetRoute: string): boolean {
    const t = targetRoute.startsWith('/') ? targetRoute : `/${targetRoute}`;
    return currentUrl === t || currentUrl.startsWith(`${t}/`);
  }

  onMenuItemClick(): void {
    if (!this.isToggled) {
      this.toggleService.toggle();
    }
    this.searchText = '';
    this.showSearch = false;
  }

  toggle() {
    this.toggleService.toggle();
    this.searchText = '';
    this.showSearch = false;
  }

  support() { this.router.navigateByUrl('home/support-ticket'); }
  settings() { this.router.navigateByUrl('home/settings'); }

  toggleMenu(key: string) {
    if (this.isToggled) {
      this.toggleService.toggle();
      this.activeMenu = key;
    } else if (this.activeMenu === key) {
      this.toggleService.toggle();
    } else {
      this.activeMenu = key;
    }
    this.searchText = '';
    this.showSearch = false;
  }

  visibleSearch() {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      setTimeout(() => this.searchInput?.nativeElement.focus());
    } else {
      this.searchText = '';
    }
  }

  toggleAccordion(itemTitle: string): void {
    this.expandedItems[itemTitle] = !this.expandedItems[itemTitle];
  }

  isExpanded(itemTitle: string): boolean {
    return !!this.expandedItems[itemTitle];
  }

  isRouteActive(route: string): boolean {
    const url = this.router.url.split('?')[0].split('#')[0];
    const t = route.startsWith('/') ? route : `/${route}`;
    return url === t || url.startsWith(`${t}/`);
  }

  get currentPanel() { return this.sidebarMenus[this.activeMenu]; }

  get filteredItems() {
    const items = this.currentPanel?.items ?? [];
    const term = this.searchText.trim().toLowerCase();
    if (!term) return items;
    return items.filter(item => item.title.toLowerCase().includes(term));
  }
}