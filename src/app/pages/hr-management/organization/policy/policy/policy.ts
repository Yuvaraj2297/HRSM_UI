import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimeDataTable, PrimeTableColumn, PrimeTableRowAction } from '../../../../../shared/primedatatable/primedatatable';
import { ModalField, ModalSaveEvent, ReuseModal } from '../../../../../shared/reuse-model/reuse-model';


interface PolicyRow {
  id: number;
  policyName: string;
  fileName: string;
  category: string;
  uploadedBy: string;
  date: string;
  status: string;
  description?: string;
}

@Component({
  selector: 'app-policy',
  imports: [PrimeDataTable, ReuseModal],
  templateUrl: './policy.html',
  styleUrl: './policy.scss',
})
export class Policy implements OnInit {
  columns: PrimeTableColumn[] = [];
  tableData: any[] = [];
  searchPlaceholder = '';
  actions = { add: true, edit: true, delete: true };
  header = { title: 'Policy', icon: 'ti ti-file-text' };

  // ---------------------------------------------------------
  // ViewChild with setter so it reacts if the modal is
  // rendered conditionally (never leaves a stale undefined).
  // ---------------------------------------------------------
  private _policyModal?: ReuseModal;

  @ViewChild('policyModal')
  set policyModalRef(ref: ReuseModal | undefined) {
    this._policyModal = ref;
  }

  get policyModal(): ReuseModal | undefined {
    return this._policyModal;
  }

  // =========================================================
  // MODAL FIELDS
  // =========================================================

  modalFields: ModalField[] = [
    {
      key: 'policyName',
      label: 'Policy Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. Leave Policy 2026',
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      placeholder: 'Select category',
      filter: true,
      showClear: true,
      options: [
        { label: 'Leave Policy', value: 'Leave Policy' },
        { label: 'Work From Home', value: 'Work From Home' },
        { label: 'Code of Conduct', value: 'Code of Conduct' },
        { label: 'Data Security', value: 'Data Security' },
        { label: 'Anti-Harassment', value: 'Anti-Harassment' },
        { label: 'Compensation & Benefits', value: 'Compensation & Benefits' },
      ],
    },
    {
      key: 'effectiveDate',
      label: 'Effective Date',
      type: 'date',
      placeholder: 'Select date',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select status',
      defaultValue: 'Active',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
      ],
    },
    {
      key: 'description',
      label: 'Description',
      labelNote: '(optional)',
      type: 'textarea',
      rows: 3,
      placeholder: 'Brief description about this policy...',
    },
    {
      key: 'fileName',
      label: 'Upload File',
      type: 'file',
      required: true,
      placeholder: 'Drag & drop your file here',
      accept: '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png',
      maxSizeMB: 10,
      hint: 'Supports PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)',
    },
  ];

  // =========================================================
  // FILE ICONS
  // =========================================================

  private fileTypeStyle: Record<string, { icon: string; color: string; bg: string }> = {
    pdf: { icon: 'ti ti-file-type-pdf', color: 'var(--red-500)', bg: 'var(--red-50)' },
    docx: { icon: 'ti ti-file-type-docx', color: 'var(--blue-550)', bg: 'var(--blue-50-2)' },
    xlsx: { icon: 'ti ti-file-type-xls', color: 'var(--green-400)', bg: 'var(--green-50)' },
  };

  private defaultFileStyle = { icon: 'ti ti-file', color: 'var(--neutral-500)', bg: 'var(--bg-muted)' };

  menuItems: PrimeTableRowAction[] = [
    { key: 'edit', label: 'Edit', icon: 'ti ti-pencil', color: 'var(--neutral-500)' },
    { key: 'download', label: 'Download', icon: 'ti ti-download', color: 'var(--neutral-500)' },
    { key: 'delete', label: 'Delete', icon: 'ti ti-trash', color: 'var(--danger)' },
  ];

  // =========================================================
  // DATA
  // =========================================================

  policies: PolicyRow[] = [
    { id: 1, policyName: 'Leave Policy 2026', fileName: 'leave-policy-2026.pdf', category: 'Leave Policy', uploadedBy: 'Admin', date: '01-01-2026', status: 'Active' },
    { id: 2, policyName: 'Work From Home Policy', fileName: 'wfh-policy.pdf', category: 'Work From Home', uploadedBy: 'HR Manager', date: '15-02-2026', status: 'Active' },
    { id: 3, policyName: 'Code of Conduct', fileName: 'code-of-conduct.docx', category: 'Code of Conduct', uploadedBy: 'Admin', date: '01-01-2026', status: 'Active' },
    { id: 4, policyName: 'Data Security Policy', fileName: 'data-security.pdf', category: 'Data Security', uploadedBy: 'CTO', date: '10-03-2026', status: 'Active' },
    { id: 5, policyName: 'Anti-Harassment Policy', fileName: 'anti-harassment.pdf', category: 'Anti-Harassment', uploadedBy: 'HR Manager', date: '01-01-2026', status: 'Active' },
    { id: 6, policyName: 'Compensation Guidelines', fileName: 'compensation-2025.xlsx', category: 'Compensation & Benefits', uploadedBy: 'Finance Head', date: '20-03-2026', status: 'Inactive' },
  ];

  private buildRows(): any[] {
    return this.policies.map((p) => {
      const ext = p.fileName.split('.').pop()?.toLowerCase() ?? '';
      const style = this.fileTypeStyle[ext] ?? this.defaultFileStyle;

      return {
        ...p,
        icon: style.icon,
        iconColor: style.color,
        iconBg: style.bg,
      };
    });
  }

  loadMaster(): void {
    this.columns = this.policyColumns();
    this.searchPlaceholder = 'Search policies...';
    this.tableData = this.buildRows();
  }

  ngOnInit(): void {
    this.loadMaster();
  }

  // =========================================================
  // COLUMNS
  // =========================================================

  policyColumns(): PrimeTableColumn[] {
    return [
      { field: 'sno', header: 'S.NO', type: 'text', width: '80px', sortable: false },
      {
        field: 'policyName',
        header: 'POLICY NAME',
        type: 'file',
        iconField: 'icon',
        iconColorField: 'iconColor',
        iconBgField: 'iconBg',
        subTextField: 'fileName',
        width: '300px',
        sortable: true,
      },
      { field: 'category', header: 'CATEGORY', type: 'text', width: '200px', sortable: true },
      { field: 'uploadedBy', header: 'UPLOADED BY', type: 'text', width: '160px', sortable: true },
      { field: 'date', header: 'DATE', type: 'text', width: '140px', sortable: true },
      { field: 'status', header: 'STATUS', type: 'status', width: '140px', sortable: true },
      { field: 'actions', header: 'ACTION', type: 'actions', width: '100px', sortable: false },
    ];
  }

  // =========================================================
  // DATE HELPERS
  // =========================================================

  private toDisplayDate(value?: string | Date | null): string {
    const d = value ? new Date(value) : new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}-${mm}-${d.getFullYear()}`;
  }

  private parseDisplayDate(value?: string): Date | null {
    if (!value) return null;
    const [dd, mm, yyyy] = value.split('-').map(Number);
    return new Date(yyyy, mm - 1, dd);
  }

  // =========================================================
  // ADD / EDIT / TABLE ACTIONS
  // =========================================================

  openCreateModal(): void {
    // safe: no crash if the modal is not yet resolved
    this.policyModal?.open('add');
  }

  openEditModal(row: PolicyRow): void {
    this.policyModal?.open('edit', {
      id: row.id,
      policyName: row.policyName,
      category: row.category,
      effectiveDate: this.parseDisplayDate(row.date),
      status: row.status,
      description: row.description ?? '',
      fileName: row.fileName,
    });
  }

  onTableAction(event: { action: string; row: any }): void {
    if (event.action === 'edit') this.openEditModal(event.row);
    if (event.action === 'download') { /* this.downloadPolicy(event.row); */ }
    if (event.action === 'delete') { /* this.deleteMaster(event.row); */ }
  }

  onPolicySaved(e: ModalSaveEvent): void {
    const v = e.values;

    if (e.mode === 'add') {
      this.policies = [
        ...this.policies,
        {
          id: Date.now(),
          policyName: v['policyName'],
          fileName: v['fileName'],
          category: v['category'],
          uploadedBy: 'Admin',
          date: this.toDisplayDate(v['effectiveDate']),
          status: v['status'] ?? 'Active',
          description: v['description'],
        },
      ];
    } else {
      this.policies = this.policies.map((p) =>
        p.id === v['id']
          ? {
            ...p,
            policyName: v['policyName'],
            fileName: v['fileName'],
            category: v['category'],
            status: v['status'],
            description: v['description'],
            date: v['effectiveDate'] ? this.toDisplayDate(v['effectiveDate']) : p.date,
          }
          : p,
      );
    }

    this.tableData = this.buildRows();
  }
}