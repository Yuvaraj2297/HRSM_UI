import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, RouterLink } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { BreadcrumbService, BreadcrumbData } from './breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb implements OnInit, OnDestroy {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private breadcrumbService = inject(BreadcrumbService);
  private sub?: Subscription;

  @Input() title?: string;
  @Input() parent?: string;
  @Input() icon?: string;
  @Input() data?: BreadcrumbData;

  private routeData: any = {};

  get resolvedTitle(): string {
    return (
      this.title ||
      this.data?.title ||
      this.breadcrumbService.data()?.title ||
      this.routeData?.title ||
      ''
    );
  }

  get resolvedParent(): string {
    return (
      this.parent ||
      this.data?.parent ||
      this.data?.parentTitle ||
      this.breadcrumbService.data()?.parent ||
      this.breadcrumbService.data()?.parentTitle ||
      this.routeData?.parentTitle ||
      this.routeData?.parent ||
      ''
    );
  }

  get resolvedIcon(): string {
    return (
      this.icon ||
      this.data?.icon ||
      this.breadcrumbService.data()?.icon ||
      this.routeData?.icon ||
      ''
    );
  }

  ngOnInit(): void {
    this.updateFromRoute();
    this.sub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateFromRoute();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private updateFromRoute(): void {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    this.routeData = route.snapshot.data || {};
  }
}
