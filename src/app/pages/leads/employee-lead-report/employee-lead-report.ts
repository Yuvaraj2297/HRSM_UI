import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker'; // PrimeNG v18+. On v17 use CalendarModule / <p-calendar>.
import { PrimeDataTable, PrimeTableColumn } from '../../../shared/primedatatable/primedatatable';
import { CalendarDatepickerDirective } from '../../../common/directives/datepicker';

// TODO: adjust this path to wherever your shared table lives.

interface LeadReportRow {
  id: string;
  name: string;
  mobile: string;
  customer: number;
  lead: number;
  quotation: number;
  waiting: number;
  followup: number;
  qualified: number;
  direct: number;
  newEnquiry: number;
  new: number;
}

interface AppliedFilters {
  search: string;
  from: Date;
  to: Date;
}

/** Same columns / labels as the PHP `$columns` array. */
const COUNT_COLUMNS: { field: keyof LeadReportRow; header: string }[] = [
  { field: 'customer', header: 'Customer' },
  { field: 'lead', header: 'Lead' },
  { field: 'quotation', header: 'Quotation' },
  { field: 'waiting', header: 'Waiting for Response' },
  { field: 'followup', header: 'Followup' },
  { field: 'qualified', header: 'Qualified' },
  { field: 'direct', header: 'Direct' },
  { field: 'newEnquiry', header: 'New Enquiry' },
  { field: 'new', header: 'New' },
];

/** Sample data copied from the PHP page — replace with your API response. */
const SAMPLE_EMPLOYEES: LeadReportRow[] = [
  { id: 'EMP0001', name: 'GHARUDA SOFTWARE', mobile: '9876500001', customer: 17, lead: 87, quotation: 5, waiting: 0, followup: 4, qualified: 0, direct: 0, newEnquiry: 1, new: 2 },
  { id: 'EMP0002', name: 'ASHISH',           mobile: '9876500002', customer: 0,  lead: 0,  quotation: 0, waiting: 0, followup: 0, qualified: 0, direct: 0, newEnquiry: 0, new: 0 },
  { id: 'EMP0003', name: 'Thilak Ma',        mobile: '9876500003', customer: 0,  lead: 0,  quotation: 0, waiting: 0, followup: 0, qualified: 0, direct: 0, newEnquiry: 0, new: 0 },
  { id: 'EMP0004', name: 'KISHORE R',        mobile: '9876500004', customer: 0,  lead: 0,  quotation: 0, waiting: 0, followup: 0, qualified: 0, direct: 0, newEnquiry: 0, new: 0 },
  { id: 'EMP0005', name: 'Rokith R',         mobile: '9876500005', customer: 0,  lead: 2,  quotation: 0, waiting: 0, followup: 0, qualified: 0, direct: 0, newEnquiry: 0, new: 0 },
  { id: 'EMP0006', name: 'Prabhu S',         mobile: '9876500006', customer: 0,  lead: 0,  quotation: 0, waiting: 0, followup: 0, qualified: 0, direct: 0, newEnquiry: 0, new: 0 },
];

const firstDayOfMonth = (): Date => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};
const lastDayOfMonth = (): Date => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
};
/** dd-mm-yyyy, like the rest of the app */
const formatDMY = (d: Date): string =>
  `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;

@Component({
  selector: 'app-employee-lead-report',
  imports: [FormsModule, DatePicker, PrimeDataTable,CalendarDatepickerDirective],
  templateUrl: './employee-lead-report.html',
  styleUrl: './employee-lead-report.scss',
})
export class EmployeeLeadReport {
  // ---------- table config ----------
  readonly columns: PrimeTableColumn[] = [
    { field: 'sno', header: '#', width: '60px' },
    { field: 'name', header: 'Name', type: 'custom' },
    ...COUNT_COLUMNS.map((c) => ({ field: c.field, header: c.header, type: 'custom' })),
  ];

  // ---------- data ----------
  /** Swap for your API result: this.employees.set(response) */
  private readonly employees = signal<LeadReportRow[]>(SAMPLE_EMPLOYEES);

  // ---------- filter form (what the user is typing / picking) ----------
  search = '';
  fromDate: Date | null = firstDayOfMonth();
  toDate: Date | null = lastDayOfMonth();

  // ---------- filters that were actually applied (after Search) ----------
  private readonly applied = signal<AppliedFilters>({
    search: '',
    from: firstDayOfMonth(),
    to: lastDayOfMonth(),
  });

  readonly dateRangeLabel = computed(() => {
    const { from, to } = this.applied();
    return `${formatDMY(from)} to ${formatDMY(to)}`;
  });

  /** Rows shown in the table. Filters on name / mobile / employee id, as in the PHP page. */
  readonly rows = computed(() => {
    const q = this.applied().search.toLowerCase();
    // TODO: when the real API is wired, pass applied().from / applied().to to it.
    // The PHP sample data was only filtered by name too.
    if (!q) return this.employees();
    return this.employees().filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.mobile.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q),
    );
  });

  // ---------- actions ----------
  onSearch(): void {
    let from = this.fromDate ?? firstDayOfMonth();
    let to = this.toDate ?? lastDayOfMonth();
    if (from > to) [from, to] = [to, from]; // same swap as the PHP page

    this.fromDate = from;
    this.toDate = to;
    this.applied.set({ search: this.search.trim(), from, to });
  }

  onClear(): void {
    this.search = '';
    this.fromDate = firstDayOfMonth();
    this.toDate = lastDayOfMonth();
    this.applied.set({ search: '', from: this.fromDate, to: this.toDate });
  }
}
