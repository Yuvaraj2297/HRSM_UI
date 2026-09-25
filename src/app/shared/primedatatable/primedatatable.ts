import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ContentChild,
  TemplateRef,
  HostListener,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

export interface PrimeTableColumn {
  field: string;
  header: string;
  type?:
    | 'text'
    | 'employee'
    | 'avatar'
    | 'link'
    | 'badge'
    | 'status'
    | 'progress'
    | 'actions'
    | 'pill-actions'
    | 'checkboxText'
    | 'checkbox'
    | 'shift-name'
    | 'day-timing'
    | 'custom'
    | 'checkbox'
    | string;
  sortable?: boolean;
  iconField?: any;
  iconColorField?: any;
  iconBgField?: any;
  fileUrlField?: any;
  subTextField?: any;
  cell?: any;
  fileNameField?: any;
  width?: string;
  cellClass?: string;
  headerClass?: string;
  imageField?: any;
  colorMap?: any;
  subField?: any;
  meta?: any;
  checkboxField?: string;

  /** only used when type === 'pill-actions' — see PrimeTablePillButton */
  buttons?: PrimeTablePillButton[];
}



export interface PrimeTableRowAction {
  key: string;
  label?: string;
  icon?: string;
  color?: any;
  hiddenWhen?: (row: any) => boolean;
  disabledWhen?: (row: any) => boolean;
  divider?: boolean;
}

/**
 * One button in a "pill-actions" column — a row of buttons fused into a single
 * rounded capsule (e.g. an icon-only "view" segment + a colored "Onboard" segment).
 * Declare these on the column (`buttons: [...]`) instead of writing a custom
 * cell template — the table renders and colors them for you.
 */
export interface PrimeTablePillButton {
  key: string;
  label?: string;
  icon?: string;
  /** 'solid' = filled color background, white text/icon (default).
   *  'outline' = white background, colored text/icon/border. */
  variant?: 'solid' | 'outline';
  /** hex color; defaults to the table's primaryColor input */
  color?: string;
  tooltip?: string;
  hiddenWhen?: (row: any) => boolean;
  disabledWhen?: (row: any) => boolean;
}

export interface PrimeTableHeader {
  title: string;
  icon: string;
  count?: number;
  subtitle?: string;
}

export interface PrimeTableHeaderButton {
  id?: string;
  label: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  variant?: 'outline' | 'primary' | 'secondary' | 'success' | 'danger' | string;
  class?: string;
  routerLink?: string;
  action?: string;
  disabled?: boolean;
}

export interface PrimeTableActions {
  add?: boolean;
  edit?: boolean;
  delete?: boolean;
  addLabel?: string;
  addIcon?: string;
}

@Component({
  selector: 'app-primedatatable',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './primedatatable.html',
  styleUrl: './primedatatable.scss',
})
export class PrimeDataTable {
  @ContentChild('cellTemplate') customCellTemplate?: TemplateRef<any>;
  @ContentChild('headerTemplate') customHeaderTemplate?: TemplateRef<any>;

  // =========================================================
  // PAGINATION
  // =========================================================

  rowsPerPageOptions = [10, 25, 50, 100];

  // =========================================================
  // INPUTS
  // =========================================================

  @Input() columns: PrimeTableColumn[] = [];
  @Input() data: any[] = [];
  @Input() rows = 10;
  @Input() loading = false;
  @Input() paginator = true;
  @Input() showGlobalFilter = true;
  @Input() selectable = false;
  @Input() dataKey = 'id';
  @Input() showCurrentPageReport = true;
  @Input() currentPageReportTemplate = 'Showing {first} to {last} of {totalRecords}';
  @Input() selection: any[] = [];

  // =========================================================
  // TITLE + ICON
  // =========================================================

  @Input()
  modalHeader: PrimeTableHeader = {
    title: '',
    icon: 'ti ti-sitemap',
  };

  // =========================================================
  // ADD + EDIT + DELETE
  // =========================================================

  @Input()
  Accessactions: PrimeTableActions = {
    add: false,
    edit: false,
    delete: false,
  };

  @Input() rowActions: PrimeTableRowAction[] = [];
  @Input() menuItems: PrimeTableRowAction[] = [];
  @Input() addBtnLabel?: string;
  @Input() addBtnIcon?: string;
  @Input() headerButtons: PrimeTableHeaderButton[] = [];
  @Input() showColumnsButton = true;
  @Input() showExportButton = true;
  @Input() searchPlaceholder = 'Search...';
  @Input() exportFileName = 'export';

  /** true = title, Columns/Export and Search share one row (wraps on small screens) */
  @Input() inlineToolbar = false;

  /** 'menu' = kebab dropdown, 'inline' = icon buttons in the cell (only affects type:'actions' columns) */
  @Input() actionsMode: 'inline' | 'menu' = 'menu';

  /** default color used by pill-actions buttons that don't set their own `color` */
  @Input() primaryColor = 'var(--primary)';

  // =========================================================
  // OUTPUTS
  // =========================================================

  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() rowClick = new EventEmitter<any>();

  @Output()
  actionClick = new EventEmitter<{
    action: string;
    row: any;
  }>();

  @Output() addClicked = new EventEmitter<void>();
  @Output() headerButtonClick = new EventEmitter<PrimeTableHeaderButton>();
  @Output() exportClicked = new EventEmitter<void>();
  @Output() columnsClicked = new EventEmitter<void>();

  get resolvedAddLabel(): string {
    return this.addBtnLabel ?? this.Accessactions?.addLabel ?? '';
  }

  get resolvedAddIcon(): string {
    return this.addBtnIcon ?? this.Accessactions?.addIcon ?? 'ti ti-plus';
  }

  onHeaderButtonClick(btn: PrimeTableHeaderButton): void {
    this.headerButtonClick.emit(btn);
  }

  // =========================================================
  // TABLE
  // =========================================================

  @ViewChild('dt') table!: Table;

  // =========================================================
  // COLUMN VISIBILITY OFFCANVAS
  // =========================================================

  columnsPanelOpen = false;

  private hiddenFields = new Set<string>();

  get visibleColumns(): PrimeTableColumn[] {
    return this.columns.filter((col) => !this.hiddenFields.has(col.field));
  }

  isColumnVisible(field: string): boolean {
    return !this.hiddenFields.has(field);
  }

  toggleColumnVisibility(field: string): void {
    const next = new Set(this.hiddenFields);
    if (next.has(field)) {
      next.delete(field);
    } else {
      next.add(field);
    }
    this.hiddenFields = next;
  }

  restoreAllColumns(): void {
    this.hiddenFields = new Set<string>();
  }

  openColumnsPanel(): void {
    this.columnsPanelOpen = true;
  }

  closeColumnsPanel(): void {
    this.columnsPanelOpen = false;
  }

  // =========================================================
  // CELL KIND + COLORS
  // =========================================================

  kind(col: PrimeTableColumn): string {
    if (col.field === 'sno') return 'sno';
    if (!col.type && (col.field === 'empId' || col.field === 'emp_id')) return 'link';
    if (col.type === 'employee' || (col.field === 'name' && !col.type)) return 'avatar';
    if (col.type === 'custom' && this.customCellTemplate) {
      return 'custom';
    }
    return col.type || 'text';
  }

  colorFor(col: PrimeTableColumn, row: any): string | null {
    return col.colorMap?.[row[col.field]] ?? null;
  }

  avatarSrc(col: PrimeTableColumn, row: any): string {
    return row[col.imageField || 'avatar'] || this.fallbackAvatar(row.name);
  }

  fallbackAvatar(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || '?')}&background=e2e8f0&color=334155`;
  }

  // =========================================================
  // PILL ACTIONS — declarative segmented action buttons
  // (column.type === 'pill-actions', column.buttons: PrimeTablePillButton[])
  // =========================================================

  visibleButtons(col: PrimeTableColumn, row: any): PrimeTablePillButton[] {
    return (col.buttons ?? []).filter((b) => !b.hiddenWhen || !b.hiddenWhen(row));
  }

  pillButtonStyle(btn: PrimeTablePillButton): { [k: string]: string } {
    const color = btn.color || this.primaryColor;
    if (btn.variant === 'outline') {
      return { background: 'var(--white)', color };
    }
    return { background: color, color: 'var(--white)' };
  }

  onPillButton(btn: PrimeTablePillButton, row: any, ev: MouseEvent): void {
    ev.stopPropagation();
    if (btn.disabledWhen?.(row)) return;
    this.onAction(btn.key, row);
  }

  // =========================================================
  // KEBAB ROW MENU (fixed-position, so it never gets clipped)
  // =========================================================

  menuRow: any = null;
  menuPos = { top: 0, left: 0 };

  get activeRowActions(): PrimeTableRowAction[] {
    return this.rowActions?.length ? this.rowActions : this.menuItems;
  }

  toggleMenu(ev: MouseEvent, row: any): void {
    ev.stopPropagation();
    if (this.menuRow === row) {
      this.closeMenu();
      return;
    }
    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const menuW = 180;
    const menuH = this.activeRowActions.length * 40 + 16;
    const top = rect.bottom + menuH > window.innerHeight ? rect.top - menuH - 4 : rect.bottom + 4;
    this.menuPos = { top, left: Math.max(8, rect.right - menuW) };
    this.menuRow = row;
  }

  closeMenu(): void {
    this.menuRow = null;
  }

  onMenuItem(act: PrimeTableRowAction, row: any): void {
    if (act.disabledWhen?.(row)) return;
    this.onAction(act.key, row);
    this.closeMenu();
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onViewportChange(): void {
    this.closeMenu();
  }

  // =========================================================
  // EXPORT DROPDOWN
  // =========================================================

  exportMenuOpen = false;

  toggleExportMenu(): void {
    this.exportMenuOpen = !this.exportMenuOpen;
  }

  closeExportMenu(): void {
    this.exportMenuOpen = false;
  }

  private get exportableColumns(): PrimeTableColumn[] {
    return this.visibleColumns.filter(
      (col) => col.type !== 'actions' && col.type !== 'pill-actions' && col.type !== 'checkbox',
    );
  }

  private getExportRows(): Record<string, any>[] {
    const cols = this.exportableColumns;

    return this.data.map((row, index) => {
      const record: Record<string, any> = {};

      cols.forEach((col) => {
        if (col.field === 'sno') {
          record[col.header] = index + 1;
        } else {
          record[col.header] = row[col.field] ?? '';
        }
      });

      return record;
    });
  }

  onExportCopy(): void {
    const cols = this.exportableColumns;
    const header = cols.map((c) => c.header).join('\t');
    const rows = this.getExportRows().map((record) => cols.map((c) => record[c.header]).join('\t'));
    const text = [header, ...rows].join('\n');

    navigator.clipboard
      .writeText(text)
      .then(() => alert('Table data copied to clipboard!'))
      .catch(() => alert('Unable to copy data. Please try again.'));

    this.closeExportMenu();
  }

  onExportCSV(): void {
    const cols = this.exportableColumns;
    const header = cols.map((c) => this.csvEscape(c.header)).join(',');
    const rows = this.getExportRows().map((record) =>
      cols.map((c) => this.csvEscape(record[c.header])).join(','),
    );
    const csvContent = [header, ...rows].join('\n');

    this.downloadFile(csvContent, `${this.exportFileName}.csv`, 'text/csv;charset=utf-8;');
    alert('CSV file exported successfully!');
    this.closeExportMenu();
  }

  private csvEscape(value: any): string {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  onExportExcel(): void {
    const cols = this.exportableColumns;
    const headerRow = cols.map((c) => `<th>${this.escapeHtml(c.header)}</th>`).join('');
    const bodyRows = this.getExportRows()
      .map((record) => {
        const cells = cols.map((c) => `<td>${this.escapeHtml(record[c.header])}</td>`).join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');

    const table = `
      <table>
        <thead><tr>${headerRow}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    `;

    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="UTF-8"></head>
        <body>${table}</body>
      </html>
    `;

    this.downloadFile(excelContent, `${this.exportFileName}.xls`, 'application/vnd.ms-excel');
    alert('Excel file exported successfully!');
    this.closeExportMenu();
  }

  private escapeHtml(value: any): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  onExportPDF(): void {
    alert(
      'PDF export is not fully configured yet. Please connect a PDF library (e.g. jsPDF) to enable this.',
    );
    this.closeExportMenu();
  }

  onExportPrint(): void {
    const cols = this.exportableColumns;
    const headerRow = cols.map((c) => `<th>${this.escapeHtml(c.header)}</th>`).join('');
    const bodyRows = this.getExportRows()
      .map((record) => {
        const cells = cols.map((c) => `<td>${this.escapeHtml(record[c.header])}</td>`).join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');

    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      alert('Please allow pop-ups to print the table.');
      this.closeExportMenu();
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${this.exportFileName}</title>
          <style>
            table { border-collapse: collapse; width: 100%; font-family: 'Inter', Arial, sans-serif; }
            th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; font-size: 13px; }
            th { background: #f4f7f7; }
          </style>
        </head>
        <body>
          <table>
            <thead><tr>${headerRow}</tr></thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    this.closeExportMenu();
  }

  private downloadFile(content: string, fileName: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // =========================================================
  // GLOBAL FILTER FIELDS
  // =========================================================

  @Input() globalFilterFields?: string[];

  get filterFields(): string[] {
    if (this.globalFilterFields && this.globalFilterFields.length > 0) {
      return this.globalFilterFields;
    }

    const fields = new Set<string>();
    this.columns
      .filter(
        (col) =>
          col.field !== 'sno' &&
          col.field !== 'actions' &&
          col.type !== 'actions' &&
          col.type !== 'pill-actions' &&
          col.type !== 'checkbox',
      )
      .forEach((col) => {
        fields.add(col.field);
        if (col.meta?.filterFields && Array.isArray(col.meta.filterFields)) {
          col.meta.filterFields.forEach((f: string) => fields.add(f));
        }
      });

    if (fields.has('employee') || fields.has('name')) {
      fields.add('empName');
      fields.add('empId');
      fields.add('name');
      fields.add('email');
    }
    if (fields.has('refNo') || fields.has('ref')) {
      fields.add('refNo');
    }

    return Array.from(fields);
  }

  // =========================================================
  // ROW CLICK / ACTION / SELECTION / SEARCH
  // =========================================================

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  onAction(action: string, row: any): void {
    this.actionClick.emit({ action, row });
  }

  onSelectionChange(event: any[]): void {
    this.selection = event || [];
    this.selectionChange.emit(this.selection);
  }

  onGlobalFilter(value: string): void {
    if (!this.table) return;
    this.table.filterGlobal(value, 'contains');
  }

  onExport(): void {
    this.toggleExportMenu();
    this.exportClicked.emit();
  }

  onColumns(): void {
    this.openColumnsPanel();
    this.columnsClicked.emit();
  }

  onAddClick(): void {
    this.addClicked.emit();
  }

  // =========================================================
  // STATUS
  // =========================================================

  isEnableOrDisable(status: string): boolean {
    const s = (status || '').toLowerCase().trim();
    return s === 'enable' || s === 'active' || s === 'disable' || s === 'inactive';
  }

  getStatusClass(status: string): string {
    switch ((status || '').toLowerCase().trim()) {
      case 'enable':
      case 'active':
        return 'status-enable';
      case 'disable':
      case 'inactive':
        return 'status-disable';
      case 'present':
        return 'status-present';
      case 'absent':
        return 'status-absent';
      case 'late':
        return 'status-late';
      case 'half day':
      case 'half':
        return 'status-half';
      case 'on leave':
      case 'leave':
        return 'status-leave';
      default:
        return 'status-default';
    }
  }

  // =========================================================
  // PROGRESS
  // =========================================================

  getProgress(row: any): number {
    const expected = Number(row?.hoursExpected) || 9;
    const worked = parseFloat(row?.hoursWorked) || 0;
    if (expected <= 0 || isNaN(worked)) return 0;
    return Math.min(100, Math.round((worked / expected) * 100));
  }

  // =========================================================
  // PAGING INFO (respects search filter)
  // =========================================================

  getTotal(): number {
    return this.table?.filteredValue?.length ?? this.data?.length ?? 0;
  }

  getEndIndex(): number {
    const first = this.table ? this.table.first || 0 : 0;
    return Math.min(first + this.rows, this.getTotal());
  }

  onRowsChange(newRows: number): void {
    this.rows = Number(newRows);
    if (this.table) {
      this.table.first = 0;
      this.table.rows = this.rows;
    }
  }

  onCheckboxTextChange(
  row: any,
  field: string,
  checked: boolean
): void {

  row[field] = checked;

  this.actionClick.emit({
    action: 'checkboxChange',
    row
  });

}
}
