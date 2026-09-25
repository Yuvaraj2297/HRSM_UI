import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { VisitKmReport } from './components/visit-km-report/visit-km-report';
import { VisitLocationReport } from './components/visit-location-report/visit-location-report';
import { REPORT_TABS, ReportTab } from './staff-visiting-reports.model';

/**
 * Page shell: heading + tabs. Each tab is a self-contained report with its
 * own filter, created on first open and kept alive afterwards.
 */
@Component({
  selector: 'app-staff-visiting-reports',
  standalone: true,
  imports: [VisitKmReport, VisitLocationReport],
  templateUrl: './staff-visiting-reports.html',
  styleUrl: './staff-visiting-reports.scss',
})
export class StaffVisitingReports {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly tabs = REPORT_TABS;

  /** Kept in the URL (?tab=locations) so refresh / shared links reopen the same tab */
  readonly activeTab = signal<ReportTab>(this.tabFromUrl());

  /** Page title = active tab's label */
  readonly activeLabel = computed(
    () => this.tabs.find((t) => t.key === this.activeTab())?.label ?? '',
  );

  /** Tabs opened at least once — rendered (hidden when inactive) so their state survives */
  readonly opened = signal(new Set<ReportTab>([this.activeTab()]));

  selectTab(tab: ReportTab): void {
    if (tab === this.activeTab()) return;

    this.activeTab.set(tab);
    this.opened.update((set) => new Set(set).add(tab));

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab === 'visits' ? null : tab },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private tabFromUrl(): ReportTab {
    const tab = this.route.snapshot.queryParamMap.get('tab');
    return this.tabs.some((t) => t.key === tab) ? (tab as ReportTab) : 'visits';
  }
}
