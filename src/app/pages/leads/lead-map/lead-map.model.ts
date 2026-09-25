/* =========================================================
   LEAD MAP — MODELS
========================================================== */

export type LeadActivityType = 'login' | 'visit' | 'idle' | 'logout';

/** One field user row (table) */
export interface LeadUser {
  id: string;
  name: string;
  login: string | null;
  loginArea: string | null;
  logout: string | null;
  logoutArea: string | null;
  visits: number;
  kms: number;
  battery: number;
  online: boolean;
}

/** One point on a user's route / timeline */
export interface LeadActivity {
  type: LeadActivityType;
  time: string;
  title: string;
  area: string;
  note: string;
  lat: number;
  lng: number;
}

/** Response shape of the lead-map data source */
export interface LeadMapData {
  users: LeadUser[];
  /** Activities keyed by user id */
  timelines: Record<string, LeadActivity[]>;
}

/** Table row: LeadUser plus display-ready text (also used by export) */
export interface LeadUserRow extends LeadUser {
  loginText: string;
  loginAreaText: string;
  logoutText: string;
  logoutAreaText: string;
  kmsText: string;
}

export interface LeadMapSummary {
  total: number;
  online: number;
  visits: number;
  kms: number;
}

/* =========================================================
   CONSTANTS
   Colours live in global-style/classes.scss (.activity-*)
========================================================== */

export const LEAD_ACTIVITY_META: Record<LeadActivityType, { label: string; icon: string }> = {
  login: { label: 'Login', icon: 'bi-box-arrow-in-right' },
  visit: { label: 'Visit', icon: 'bi-geo-alt-fill' },
  idle: { label: 'Idle', icon: 'bi-cup-hot-fill' },
  logout: { label: 'Logout', icon: 'bi-box-arrow-right' },
};

export const LEAD_MAP_DEFAULTS = {
  center: [13.0605, 80.2425] as [number, number],
  zoom: 13,
  focusZoom: 15,
  maxZoom: 19,
};

export const EMPTY_TEXT = '—';
