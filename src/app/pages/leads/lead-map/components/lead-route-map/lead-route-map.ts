import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import type * as Leaflet from 'leaflet';

import { environment } from '../../../../../../environments/environment';
import { LEAD_MAP_DEFAULTS, LeadActivity } from '../../lead-map.model';

@Component({
  selector: 'app-lead-route-map',
  standalone: true,
  templateUrl: './lead-route-map.html',
  styleUrl: './lead-route-map.scss',
})
export class LeadRouteMap {
  /* =========================================================
     INPUTS / OUTPUTS
  ========================================================== */

  activities = input<LeadActivity[]>([]);
  activeIndex = input<number | null>(null);
  activitySelect = output<number>();

  /* =========================================================
     LEAFLET STATE
     Leaflet touches `window`, so it is loaded only in the
     browser (afterNextRender never runs during SSR/prerender).
  ========================================================== */

  private mapHost = viewChild.required<ElementRef<HTMLElement>>('mapHost');

  private L?: typeof Leaflet;
  private map?: Leaflet.Map;
  private layer?: Leaflet.LayerGroup;
  private markers: Leaflet.Marker[] = [];
  private resizeObserver?: ResizeObserver;

  private ready = signal(false);

  constructor() {
    afterNextRender(() => this.initMap());

    // redraw route whenever the activities change
    effect(() => {
      const items = this.activities();
      if (!this.ready()) return;
      untracked(() => this.drawRoute(items));
    });

    // fly to the activity picked from the timeline
    effect(() => {
      const index = this.activeIndex();
      if (!this.ready() || index === null) return;
      untracked(() => this.focusMarker(index));
    });

    inject(DestroyRef).onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.map?.remove();
    });
  }

  /* =========================================================
     INIT
  ========================================================== */

  private async initMap(): Promise<void> {
    const mod = await import('leaflet');
    const L = ((mod as any).default ?? mod) as typeof Leaflet;
    const host = this.mapHost().nativeElement;

    this.L = L;
    this.map = L.map(host).setView(LEAD_MAP_DEFAULTS.center, LEAD_MAP_DEFAULTS.zoom);

    L.tileLayer(environment.mapTileUrl, {
      maxZoom: LEAD_MAP_DEFAULTS.maxZoom,
      attribution: environment.mapAttribution,
    }).addTo(this.map);

    this.layer = L.layerGroup().addTo(this.map);

    // keep tiles aligned when the column / sidebar resizes
    this.resizeObserver = new ResizeObserver(() => this.map?.invalidateSize());
    this.resizeObserver.observe(host);

    this.ready.set(true);
  }

  /* =========================================================
     ROUTE
  ========================================================== */

  private drawRoute(items: LeadActivity[]): void {
    const { L, map, layer } = this;
    if (!L || !map || !layer) return;

    layer.clearLayers();
    this.markers = [];

    if (!items.length) {
      map.setView(LEAD_MAP_DEFAULTS.center, LEAD_MAP_DEFAULTS.zoom);
      return;
    }

    const points = items.map((it) => L.latLng(it.lat, it.lng));

    L.polyline(points, {
      // fallback here must stay a literal color — it's the value used when
      // getComputedStyle can't read the CSS variable at all
      color: this.cssVar('--accent-blue', '#2f6fed'),
      weight: 4,
      opacity: 0.8,
      dashArray: '8 6',
    }).addTo(layer);

    items.forEach((it, i) => {
      const marker = L.marker(points[i], { icon: this.markerIcon(it, i + 1) })
        .bindPopup(this.popupContent(it))
        .on('click', () => this.activitySelect.emit(i))
        .addTo(layer);

      this.markers.push(marker);
    });

    map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    this.markers[0]?.openPopup();
  }

  private focusMarker(index: number): void {
    const marker = this.markers[index];
    if (!marker || !this.map) return;

    this.map.flyTo(marker.getLatLng(), LEAD_MAP_DEFAULTS.focusZoom, { duration: 0.8 });
    marker.openPopup();
  }

  /* =========================================================
     HELPERS
  ========================================================== */

  private markerIcon(it: LeadActivity, label: number): Leaflet.DivIcon {
    return this.L!.divIcon({
      className: '',
      html: `<div class="lm-marker activity-${it.type}">${label}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });
  }

  /** Built with textContent so API text is never parsed as HTML */
  private popupContent(it: LeadActivity): HTMLElement {
    const box = document.createElement('div');
    box.className = 'lm-popup';

    [
      ['lm-popup-title', it.title],
      ['lm-popup-area', it.area],
      ['lm-popup-time', it.time],
    ].forEach(([cls, text]) => {
      const line = document.createElement('div');
      line.className = cls;
      line.textContent = text;
      box.appendChild(line);
    });

    return box;
  }

  private cssVar(name: string, fallback: string): string {
    const value = getComputedStyle(this.mapHost().nativeElement).getPropertyValue(name).trim();
    return value || fallback;
  }
}
