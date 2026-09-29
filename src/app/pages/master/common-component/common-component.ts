import { Component, ViewChild, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { PrimeDataTable } from '../../../shared/primedatatable/primedatatable';

import { MasterModal } from '../master-modal/master-modal';

import {
  RolePermissionModal,
  RolePermissionSaveEvent,
} from '../role-permission-modal/role-permission-modal';

import { MasterFacade } from '../facade/master.facade';

import { MasterType } from '../facade/master-form.facade';

import { MasterTableFacade } from '../facade/master-table.facade';

@Component({
  selector: 'app-common-component',

  standalone: true,

  imports: [CommonModule, PrimeDataTable, MasterModal, RolePermissionModal],

  templateUrl: './common-component.html',

  styleUrl: './common-component.scss',
})
export class CommonComponent {
  // =========================================================
  // SERVICES
  // =========================================================

  private route = inject(ActivatedRoute);

  private masterFacade = inject(MasterFacade);

  private tableFacade = inject(MasterTableFacade);

  // =========================================================
  // MODAL
  // =========================================================

  @ViewChild('masterModal')
  masterModal!: MasterModal;

  @ViewChild('rolePermissionModal')
  rolePermissionModal!: RolePermissionModal;

  // =========================================================
  // MASTER TYPE
  // =========================================================

  masterType: MasterType = 'department';

  // =========================================================
  // TABLE HEADER
  // =========================================================

  header = {
    title: 'Department',
    icon: 'ti ti-sitemap',
  };

  // =========================================================
  // SEARCH
  // =========================================================

  searchPlaceholder = 'Search department';

  // =========================================================
  // ACTIONS
  // =========================================================

  actions: { add: boolean; edit: boolean; delete: boolean; permission?: boolean } = {
    add: true,

    edit: true,

    delete: true,

    permission: false,
  };

  // =========================================================
  // TABLE
  // =========================================================

  columns: any[] = [];

  tableData: any[] = [];

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor() {
    this.route.data.subscribe((data) => {
      const type = data['masterType'] as MasterType;

      if (!type) {
        return;
      }


      this.masterType = type;

      // shield (permission) button only on the Role page
      this.actions = { ...this.actions, permission: type === 'role' };

      // =====================================================
      // GET TABLE CONFIGURATION FROM FACADE
      // =====================================================

      const config = this.tableFacade.getTableConfig(this.masterType);

      this.header = config.header;

      this.searchPlaceholder = config.searchPlaceholder;

      this.columns = config.columns;

      this.tableData = config.data;      
    });
  }

  // =========================================================
  // OPEN CREATE MODAL
  // =========================================================

  openCreateModal(): void {
    this.masterModal.open(this.masterType, 'add');
  }

  // =========================================================
  // TABLE ACTION
  // =========================================================

  onTableAction(event: any): void {
    const action = event.action;

    const row = event.row;

    if (action === 'permission') {
      this.rolePermissionModal.open(row, this.getRolePermissions(row));
      return;
    }

    if (action === 'edit') {
      this.masterModal.open(this.masterType, 'edit', row);
    }

    if (action === 'delete') {
      this.deleteMaster(row);
    }
  }

  // =========================================================
  // ROLE PERMISSIONS SAVE
  // =========================================================

  // demo persistence (same as the PHP page: localStorage keyed by role name).
  // Replace with your API: load in getRolePermissions(), save in onPermissionSaved().
  private readonly ROLE_PERMS_KEY = 'gharuda_role_permissions';

  private readAllRolePermissions(): Record<string, string[]> {
    try {
      return JSON.parse(localStorage.getItem(this.ROLE_PERMS_KEY) ?? '{}');
    } catch {
      return {};
    }
  }

  private getRolePermissions(row: any): string[] {
    const name = row?.roleName ?? row?.name ?? '';
    return this.readAllRolePermissions()[name] ?? row?.permissions ?? [];
  }

  onPermissionSaved(event: RolePermissionSaveEvent): void {
    try {
      const all = this.readAllRolePermissions();
      all[event.roleName] = event.permissions;
      localStorage.setItem(this.ROLE_PERMS_KEY, JSON.stringify(all));
    } catch {
      /* storage unavailable */
    }

    console.log('Role permissions saved:', event);
  }

  // =========================================================
  // LOAD API DATA
  // =========================================================

  loadMaster(): void {
    this.masterFacade.getList(this.masterType).subscribe({
      next: (response: any) => {
        this.tableData = response?.data ?? response ?? [];
      },

      error: (error: any) => {
        console.error('Master List Error:', error);
      },
    });
  }

  // =========================================================
  // MODAL SAVE
  // =========================================================

  onModalSave(event: any): void {
    if (event.modalType === 'add') {
      this.masterFacade.create(event.masterType, event.values).subscribe({
        next: () => {
          this.loadMaster();
        },

        error: (error: any) => {
          console.error('Create Error:', error);
        },
      });
    }

    if (event.modalType === 'edit') {
      this.masterFacade.update(event.masterType, event.values).subscribe({
        next: () => {
          this.loadMaster();
        },

        error: (error: any) => {
          console.error('Update Error:', error);
        },
      });
    }
  }

  // =========================================================
  // DELETE
  // =========================================================

  deleteMaster(row: any): void {
    this.masterFacade.delete(this.masterType, row.id).subscribe({
      next: () => {
        this.loadMaster();
      },

      error: (error: any) => {
        console.error('Delete Error:', error);
      },
    });
  }
}