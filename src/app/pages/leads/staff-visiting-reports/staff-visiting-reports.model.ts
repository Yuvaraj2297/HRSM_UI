/* =========================================================
   STAFF VISITING REPORTS — MODELS
   Two independent reports, each with its own filter.
========================================================== */

export type ReportTab = 'visits' | 'locations';

export interface VisitStaff {
  id: string;
  name: string;
  phone: string;
  branch: string; // work branch
}

/* ---------- Staff Visiting Reports: daily km of one staff ---------- */

export interface VisitFilter {
  staffId: string;
  from: string; // 'yyyy-mm-dd'
  to: string; // 'yyyy-mm-dd'
}

/** Response shape of staff-visiting-report.json */
export interface StaffVisitData {
  staff: VisitStaff[];
  /** km travelled per staff per day: records[staffId]['yyyy-mm-dd'] (missing day = 0 km) */
  records: Record<string, Record<string, number>>;
}

export type DayStatus = 'Travelled' | 'No Travel' | 'Week Off';

/** One row = one day */
export interface StaffVisitRow {
  staffId: string;
  staffName: string;
  date: string;
  km: number;
  status: DayStatus;
}

export interface StaffVisitSummary {
  totalKm: number;
  activeDays: number;
  avgKm: number;
  maxKm: number;
}

/* ---------- Staff Visiting Location Report: lead check-ins ---------- */

export interface LocationFilter {
  staffId: string | null; // null = all staff
  branch: string | null; // null = all branches
  from: string; // 'yyyy-mm-dd'
  to: string; // 'yyyy-mm-dd'
}

export type VisitType = 'Lead' | 'Follow Up' | 'Customer';

export interface VisitLead {
  id: string;
  name: string;
  phone: string;
  /** registered (original) location of the lead */
  address: string;
  lat: number;
  lng: number;
}

/** One check-in as stored: where the staff actually was */
export interface LeadVisit {
  id: string;
  staffId: string;
  date: string; // 'yyyy-mm-dd'
  type: VisitType;
  leadId: string;
  checkinAddress: string;
  checkinLat: number;
  checkinLng: number;
  inTime: string; // '09:00:00 am'
  outTime: string;
}

/** Response shape of staff-visiting-locations.json */
export interface LeadVisitData {
  leads: VisitLead[];
  visits: LeadVisit[];
}

/** Table row: visit joined with staff + lead, distance/duration derived */
export interface LeadVisitRow {
  id: string;
  date: string;
  type: VisitType;

  staffId: string;
  staffName: string;
  staffPhone: string;
  staffBranch: string;

  leadName: string;
  leadPhone: string;

  originalLocation: string;
  originalLat: number;
  originalLng: number;

  checkinLocation: string;
  checkinLat: number;
  checkinLng: number;

  /** straight-line distance between original and check-in location */
  distanceKm: number;

  inTime: string;
  outTime: string;
  duration: string; // '34 min'
}

/* =========================================================
   CONSTANTS
========================================================== */

export const DEFAULT_STAFF_ID = 'KOKA0011';

/** Staff Visiting Reports default range (days back from today) */
export const DEFAULT_RANGE_DAYS = 62;

/** Location report default range (days back from today) */
export const LOCATION_RANGE_DAYS = 30;

/** Check-in difference bands (km): within = matched, beyond warn = far */
export const CHECKIN_MATCH_KM = 0.5;
export const CHECKIN_WARN_KM = 2;

export const REPORT_TABS: { key: ReportTab; label: string; icon: string }[] = [
  { key: 'visits', label: 'Staff Visiting Reports', icon: 'bi bi-signpost-2' },
  { key: 'locations', label: 'Staff Visiting Location Report', icon: 'bi bi-geo-alt' },
];
