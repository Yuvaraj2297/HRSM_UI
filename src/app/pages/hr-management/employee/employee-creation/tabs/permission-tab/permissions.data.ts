/* =========================================================
   PERMISSION INTERFACES
========================================================= */

export interface PermCapability {
  value: string;
  label: string;
}

export interface PermModule {
  feature: string;
  caps: PermCapability[];
}

export interface PermGroup {
  key: string;
  label: string;
  icon: string;
  modules: PermModule[];
}

/* =========================================================
   PERMISSION GROUPS
========================================================= */

export const PERMISSION_GROUPS: PermGroup[] = [
  /* =======================================================
     CRM
  ======================================================== */

  {
    key: 'crm',
    label: 'CRM',
    icon: 'bi bi-people-fill',

    modules: [
      {
        feature: 'Customers',
        caps: [
          { value: 'customers_view_own', label: 'View(Own)' },
          { value: 'customers_view_global', label: 'View(Global)' },
          { value: 'customers_create', label: 'Create' },
          { value: 'customers_edit', label: 'Edit' },
          { value: 'customers_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Leads',
        caps: [
          { value: 'leads_view_own', label: 'View(Own)' },
          { value: 'leads_view_global', label: 'View(Global)' },
          { value: 'leads_create', label: 'Create' },
          { value: 'leads_edit', label: 'Edit' },
          { value: 'leads_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Projects',
        caps: [
          { value: 'projects_view_own', label: 'View(Own)' },
          { value: 'projects_view_global', label: 'View(Global)' },
          { value: 'projects_create', label: 'Create' },
          { value: 'projects_edit', label: 'Edit' },
          { value: 'projects_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Proposals',
        caps: [
          { value: 'proposals_view_own', label: 'View(Own)' },
          { value: 'proposals_view_global', label: 'View(Global)' },
          { value: 'proposals_create', label: 'Create' },
          { value: 'proposals_edit', label: 'Edit' },
          { value: 'proposals_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Estimates',
        caps: [
          { value: 'estimates_view_own', label: 'View(Own)' },
          { value: 'estimates_view_global', label: 'View(Global)' },
          { value: 'estimates_create', label: 'Create' },
          { value: 'estimates_edit', label: 'Edit' },
          { value: 'estimates_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Contracts',
        caps: [
          { value: 'contracts_view_own', label: 'View(Own)' },
          { value: 'contracts_view_global', label: 'View(Global)' },
          { value: 'contracts_create', label: 'Create' },
          { value: 'contracts_edit', label: 'Edit' },
          { value: 'contracts_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Tasks',
        caps: [
          { value: 'tasks_view_own', label: 'View(Own)' },
          { value: 'tasks_view_global', label: 'View(Global)' },
          { value: 'tasks_create', label: 'Create' },
          { value: 'tasks_edit', label: 'Edit' },
          { value: 'tasks_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Support',
        caps: [
          { value: 'support_view_own', label: 'View(Own)' },
          { value: 'support_view_global', label: 'View(Global)' },
          { value: 'support_create', label: 'Create' },
          { value: 'support_edit', label: 'Edit' },
          { value: 'support_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Knowledge Base',
        caps: [
          { value: 'kb_view_global', label: 'View(Global)' },
          { value: 'kb_create', label: 'Create' },
          { value: 'kb_edit', label: 'Edit' },
          { value: 'kb_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Staff',
        caps: [
          { value: 'staff_view_global', label: 'View(Global)' },
          { value: 'staff_create', label: 'Create' },
          { value: 'staff_edit', label: 'Edit' },
          { value: 'staff_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Staff Roles',
        caps: [
          { value: 'staff_roles_view_global', label: 'View(Global)' },
          { value: 'staff_roles_create', label: 'Create' },
          { value: 'staff_roles_edit', label: 'Edit' },
          { value: 'staff_roles_delete', label: 'Delete' },
        ],
      },
    ],
  },

  /* =======================================================
     FINANCE
  ======================================================== */

  {
    key: 'finance',
    label: 'Finance',
    icon: 'bi bi-cash-stack',

    modules: [
      {
        feature: 'Invoices',
        caps: [
          { value: 'invoices_view_own', label: 'View(Own)' },
          { value: 'invoices_view_global', label: 'View(Global)' },
          { value: 'invoices_create', label: 'Create' },
          { value: 'invoices_edit', label: 'Edit' },
          { value: 'invoices_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Payments',
        caps: [
          { value: 'payments_view_own', label: 'View(Own)' },
          { value: 'payments_view_global', label: 'View(Global)' },
          { value: 'payments_create', label: 'Create' },
          { value: 'payments_edit', label: 'Edit' },
          { value: 'payments_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Credit Notes',
        caps: [
          { value: 'credit_notes_view_own', label: 'View(Own)' },
          { value: 'credit_notes_view_global', label: 'View(Global)' },
          { value: 'credit_notes_create', label: 'Create' },
          { value: 'credit_notes_edit', label: 'Edit' },
          { value: 'credit_notes_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Expenses',
        caps: [
          { value: 'expenses_view_own', label: 'View(Own)' },
          { value: 'expenses_view_global', label: 'View(Global)' },
          { value: 'expenses_create', label: 'Create' },
          { value: 'expenses_edit', label: 'Edit' },
          { value: 'expenses_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Target',
        caps: [
          { value: 'target_view_own', label: 'View(Own)' },
          { value: 'target_view_global', label: 'View(Global)' },
          { value: 'target_create', label: 'Create' },
          { value: 'target_edit', label: 'Edit' },
          { value: 'target_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Subscriptions',
        caps: [
          { value: 'subs_view_own', label: 'View(Own)' },
          { value: 'subs_view_global', label: 'View(Global)' },
          { value: 'subs_create', label: 'Create' },
          { value: 'subs_edit', label: 'Edit' },
          { value: 'subs_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Items',
        caps: [
          { value: 'items_view_global', label: 'View(Global)' },
          { value: 'items_create', label: 'Create' },
          { value: 'items_edit', label: 'Edit' },
          { value: 'items_delete', label: 'Delete' },
        ],
      },
    ],
  },

  /* =======================================================
     ACCOUNTING
  ======================================================== */

  {
    key: 'accounting',
    label: 'Accounting',
    icon: 'bi bi-calculator',

    modules: [
      {
        feature: 'Accounting - Dashboard',
        caps: [
          {
            value: 'acct_dashboard_view',
            label: 'View',
          },
        ],
      },

      {
        feature: 'Accounting - Banking',
        caps: [
          { value: 'acct_banking_view', label: 'View' },
          { value: 'acct_banking_create', label: 'Create' },
          { value: 'acct_banking_edit', label: 'Edit' },
          { value: 'acct_banking_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Accounting - Transaction',
        caps: [
          { value: 'acct_trans_view', label: 'View' },
          { value: 'acct_trans_create', label: 'Create' },
          { value: 'acct_trans_edit', label: 'Edit' },
          { value: 'acct_trans_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Accounting - Bills',
        caps: [
          { value: 'acct_bills_view', label: 'View' },
          { value: 'acct_bills_create', label: 'Create' },
        ],
      },

      {
        feature: 'Accounting - Vendors',
        caps: [
          { value: 'acct_vendors_view', label: 'View' },
          { value: 'acct_vendors_create', label: 'Create' },
          { value: 'acct_vendors_edit', label: 'Edit' },
          { value: 'acct_vendors_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Accounting - Reports',
        caps: [
          {
            value: 'acct_reports_view',
            label: 'View',
          },
        ],
      },
    ],
  },

  /* =======================================================
     INVENTORY
  ======================================================== */

  {
    key: 'inventory',
    label: 'Inventory',
    icon: 'bi bi-box-seam',

    modules: [
      {
        feature: 'Inventory - Items',
        caps: [
          { value: 'inv_items_view_global', label: 'View(Global)' },
          { value: 'inv_items_create', label: 'Create' },
          { value: 'inv_items_edit', label: 'Edit' },
          { value: 'inv_items_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Inventory - Warehouse',
        caps: [
          { value: 'inv_warehouse_view_global', label: 'View(Global)' },
          { value: 'inv_warehouse_create', label: 'Create' },
          { value: 'inv_warehouse_edit', label: 'Edit' },
          { value: 'inv_warehouse_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Inventory - Reports',
        caps: [
          {
            value: 'inv_reports_view_global',
            label: 'View(Global)',
          },
        ],
      },
    ],
  },

  /* =======================================================
     PURCHASE
  ======================================================== */

  {
    key: 'purchase',
    label: 'Purchase',
    icon: 'bi bi-cart3',

    modules: [
      {
        feature: 'Purchase Orders',
        caps: [
          { value: 'po_view_own', label: 'View(Own)' },
          { value: 'po_view_global', label: 'View(Global)' },
          { value: 'po_create', label: 'Create' },
          { value: 'po_edit', label: 'Edit' },
          { value: 'po_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Purchase Invoices',
        caps: [
          { value: 'pi_view_own', label: 'View(Own)' },
          { value: 'pi_view_global', label: 'View(Global)' },
          { value: 'pi_create', label: 'Create' },
          { value: 'pi_edit', label: 'Edit' },
          { value: 'pi_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Purchase Quotations',
        caps: [
          { value: 'pq_view_own', label: 'View(Own)' },
          { value: 'pq_view_global', label: 'View(Global)' },
          { value: 'pq_create', label: 'Create' },
          { value: 'pq_edit', label: 'Edit' },
          { value: 'pq_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Purchase Requests',
        caps: [
          { value: 'preq_view_own', label: 'View(Own)' },
          { value: 'preq_view_global', label: 'View(Global)' },
          { value: 'preq_create', label: 'Create' },
          { value: 'preq_edit', label: 'Edit' },
          { value: 'preq_delete', label: 'Delete' },
        ],
      },
    ],
  },

  /* =======================================================
     HR
  ======================================================== */

  {
    key: 'hr',
    label: 'HR',
    icon: 'bi bi-people-fill',

    modules: [
      {
        feature: 'HR Dashboard',
        caps: [
          {
            value: 'hr_dashboard_view',
            label: 'View',
          },
        ],
      },

      {
        feature: 'HR Organization',
        caps: [
          { value: 'hr_org_view_own', label: 'View(Own)' },
          { value: 'hr_org_view_global', label: 'View(Global)' },
          { value: 'hr_org_create', label: 'Create' },
          { value: 'hr_org_edit', label: 'Edit' },
          { value: 'hr_org_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'HR Records',
        caps: [
          { value: 'hr_records_view_own', label: 'View(Own)' },
          { value: 'hr_records_view_global', label: 'View(Global)' },
          { value: 'hr_records_create', label: 'Create' },
          { value: 'hr_records_edit', label: 'Edit' },
          { value: 'hr_records_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'HR Training',
        caps: [
          { value: 'hr_training_view_own', label: 'View(Own)' },
          { value: 'hr_training_view_global', label: 'View(Global)' },
          { value: 'hr_training_create', label: 'Create' },
          { value: 'hr_training_edit', label: 'Edit' },
          { value: 'hr_training_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'HR Contract',
        caps: [
          { value: 'hr_contract_view_own', label: 'View(Own)' },
          { value: 'hr_contract_view_global', label: 'View(Global)' },
          { value: 'hr_contract_create', label: 'Create' },
          { value: 'hr_contract_edit', label: 'Edit' },
          { value: 'hr_contract_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'HR Settings',
        caps: [
          { value: 'hr_settings_view_global', label: 'View(Global)' },
          { value: 'hr_settings_create', label: 'Create' },
          { value: 'hr_settings_edit', label: 'Edit' },
          { value: 'hr_settings_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'HR Management',
        caps: [
          { value: 'hr_mgmt_view_global', label: 'View(Global)' },
          { value: 'hr_mgmt_create', label: 'Create' },
          { value: 'hr_mgmt_edit', label: 'Edit' },
          { value: 'hr_mgmt_delete', label: 'Delete' },
        ],
      },

      {
        feature: 'Recruitment',
        caps: [
          { value: 'recruit_view_global', label: 'View(Global)' },
          { value: 'recruit_create', label: 'Create' },
          { value: 'recruit_edit', label: 'Edit' },
          { value: 'recruit_delete', label: 'Delete' },
        ],
      },
    ],
  },

  /* =======================================================
     TIMESHEET
  ======================================================== */

  {
    key: 'timesheet',
    label: 'Timesheet',
    icon: 'bi bi-clock-history',

    modules: [
      {
        feature: 'Timesheet Check In Out',
        caps: [
          {
            value: 'ts_checkin_edit',
            label: 'Edit',
          },
        ],
      },

      {
        feature: 'Timesheet - Attendance',
        caps: [
          { value: 'ts_att_view', label: 'View' },
          { value: 'ts_att_view_global', label: 'View(Global)' },
        ],
      },

      {
        feature: 'Timesheet - Leave',
        caps: [
          { value: 'ts_leave_view', label: 'View' },
          { value: 'ts_leave_view_global', label: 'View(Global)' },
        ],
      },

      {
        feature: 'Timesheet - Report',
        caps: [
          { value: 'ts_report_view', label: 'View' },
          { value: 'ts_report_view_global', label: 'View(Global)' },
        ],
      },

      {
        feature: 'Timesheet Setting',
        caps: [
          {
            value: 'ts_setting_view_global',
            label: 'View(Global)',
          },
        ],
      },
    ],
  },

  /* =======================================================
     REPORTS
  ======================================================== */

  {
    key: 'reports',
    label: 'Reports',
    icon: 'bi bi-graph-up',

    modules: [
      {
        feature: 'Reports',
        caps: [
          { value: 'reports_view_global', label: 'View(Global)' },
          { value: 'reports_view_own', label: 'View(Own)' },
        ],
      },

      {
        feature: 'Project Overall Report',
        caps: [
          { value: 'proj_report_view_own', label: 'View(Own)' },
          { value: 'proj_report_view_global', label: 'View(Global)' },
        ],
      },

      {
        feature: 'Score Card',
        caps: [
          { value: 'scorecard_view_own', label: 'View(Own)' },
          { value: 'scorecard_view_global', label: 'View(Global)' },
        ],
      },
    ],
  },

  /* =======================================================
     SETTINGS
  ======================================================== */

  {
    key: 'settings',
    label: 'Settings',
    icon: 'bi bi-gear',

    modules: [
      {
        feature: 'Settings',
        caps: [
          {
            value: 'settings_view_global',
            label: 'View(Global)',
          },
          {
            value: 'settings_edit',
            label: 'Edit',
          },
        ],
      },

      {
        feature: 'Email Template Manage',
        caps: [
          {
            value: 'email_tmpl_manage',
            label: 'Email Template Manage',
          },
          {
            value: 'email_tmpl_reminders',
            label: 'Reminders',
          },
          {
            value: 'email_tmpl_triggers',
            label: 'Triggers',
          },
          {
            value: 'email_tmpl_log',
            label: 'Email Log',
          },
        ],
      },

      {
        feature: 'Bulk PDF Export',
        caps: [
          {
            value: 'pdf_export_view_global',
            label: 'View(Global)',
          },
        ],
      },

      {
        feature: 'Webhooks',
        caps: [
          {
            value: 'webhooks_view_global',
            label: 'View(Global)',
          },
          {
            value: 'webhooks_create',
            label: 'Create',
          },
          {
            value: 'webhooks_edit',
            label: 'Edit',
          },
          {
            value: 'webhooks_delete',
            label: 'Delete',
          },
        ],
      },
    ],
  },
];

/* =========================================================
   ALL PERMISSIONS
   Automatically generated from the groups above
========================================================= */

export const ALL_PERMISSIONS: string[] = PERMISSION_GROUPS.flatMap((group) =>
  group.modules.flatMap((module) => module.caps.map((cap) => cap.value)),
);

/* =========================================================
   ROLE DESCRIPTIONS
========================================================= */

export const ROLE_DESCRIPTIONS: Record<string, string> = {
  employee: 'Basic access: View own tasks, projects & attendance',

  manager: '',

  hr_admin: '',

  finance: '',

  admin: '',
};

/* =========================================================
   ROLE BADGE CLASS
========================================================= */

export const ROLE_BADGE_CLASS: Record<string, string> = {
  employee: 'ne-role-employee',

  manager: 'ne-role-manager',

  hr_admin: 'ne-role-hr',

  finance: 'ne-role-finance',

  admin: 'ne-role-admin',
};
