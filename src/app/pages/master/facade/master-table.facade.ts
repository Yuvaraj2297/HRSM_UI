import { Injectable } from '@angular/core';

import { PrimeTableColumn } from '../../../shared/primedatatable/primedatatable';

import { MasterType } from './master-form.facade';

export interface MasterTableConfig {
  header: {
    title: string;
    icon: string;
  };

  searchPlaceholder: string;

  columns: PrimeTableColumn[];

  data: any[];
}

@Injectable({
  providedIn: 'root',
})
export class MasterTableFacade {
  // =========================================================
  // GET TABLE CONFIGURATION
  // =========================================================

  getTableConfig(masterType: MasterType): MasterTableConfig {
    switch (masterType) {
      case 'department':
        return this.getDepartmentConfig();

      case 'team':
        return this.getTeamConfig();

      case 'position':
        return this.getPositionConfig();

      case 'document':
        return this.getDocumentConfig();

      case 'work':
        return this.getWorkConfig();

      case 'state':
        return this.getStateConfig();

      case 'district':
        return this.getDistrictConfig();

      case 'leave':
        return this.getLeaveConfig();

      case 'shift':
        return this.getShiftConfig();

      default:
        return this.getDepartmentConfig();
    }
  }

  // =========================================================
  // DEPARTMENT
  // =========================================================

  private getDepartmentConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Department',
        icon: 'ti ti-sitemap',
      },

      searchPlaceholder: 'Search department',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'department',
          header: 'Department Name',
          type: 'text',
          sortable: true,
        },

        {
          field: 'status',
          header: 'Status',
          type: 'status',
          sortable: true,
        },

        {
          field: 'date',
          header: 'Create Date',
          type: 'text',
          sortable: true,
        },

        {
          field: 'actions',
          header: 'Action',
          type: 'actions',
          width: '120px',
        },
      ],

      data: [
        {
          id: 1,
          department: 'Design',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          department: 'Development',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          department: 'HR',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          department: 'Finance',
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }

  // =========================================================
  // TEAM
  // =========================================================

  private getTeamConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Teams',
        icon: 'ti ti-users',
      },

      searchPlaceholder: 'Search team',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'teamName',
          header: 'Team Name',
          type: 'text',
          sortable: true,
        },

        {
          field: 'department',
          header: 'Department',
          type: 'text',
          sortable: true,
        },

        {
          field: 'teamLead',
          header: 'Team Lead',
          type: 'text',
          sortable: true,
        },

        {
          field: 'members',
          header: 'Members',
          type: 'text',
          sortable: true,
        },

        {
          field: 'status',
          header: 'Status',
          type: 'status',
          sortable: true,
        },

        {
          field: 'date',
          header: 'Create Date',
          type: 'text',
          sortable: true,
        },

        {
          field: 'actions',
          header: 'Action',
          type: 'actions',
          width: '120px',
        },
      ],

      data: [
        {
          id: 1,
          teamName: 'UI Team',
          department: 'Design',
          teamLead: 'Arun',
          members: 5,
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          teamName: 'Frontend Team',
          department: 'Development',
          teamLead: 'Karthik',
          members: 8,
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          teamName: 'Backend Team',
          department: 'Development',
          teamLead: 'Suresh',
          members: 6,
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          teamName: 'HR Team',
          department: 'HR',
          teamLead: 'Priya',
          members: 4,
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }

  // =========================================================
  // POSITION
  // =========================================================

  private getPositionConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Position',
        icon: 'ti ti-briefcase',
      },

      searchPlaceholder: 'Search position',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'position',
          header: 'Position Name',
          type: 'text',
          sortable: true,
        },

        {
          field: 'status',
          header: 'Status',
          type: 'status',
          sortable: true,
        },

        {
          field: 'date',
          header: 'Create Date',
          type: 'text',
          sortable: true,
        },

        {
          field: 'actions',
          header: 'Action',
          type: 'actions',
          width: '120px',
        },
      ],

      data: [
        {
          id: 1,
          position: 'Software Developer',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          position: 'Senior Software Developer',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          position: 'Project Manager',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          position: 'HR Executive',
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }

  // =========================================================
  // DOCUMENT UPLOAD
  // =========================================================

  private getDocumentConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Document Upload',
        icon: 'ti ti-file-upload',
      },

      searchPlaceholder: 'Search document',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'document',
          header: 'Document Name',
          type: 'text',
          sortable: true,
        },

        {
          field: 'status',
          header: 'Status',
          type: 'status',
          sortable: true,
        },

        {
          field: 'date',
          header: 'Create Date',
          type: 'text',
          sortable: true,
        },

        {
          field: 'actions',
          header: 'Action',
          type: 'actions',
          width: '120px',
        },
      ],

      data: [
        {
          id: 1,
          document: 'Aadhar Card',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          document: 'PAN Card',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          document: 'Driving License',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          document: 'Passport',
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }

  // =========================================================
  // WORK LOCATION
  // =========================================================

  private getWorkConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Work Location',
        icon: 'ti ti-map-pin',
      },

      searchPlaceholder: 'Search work location',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'workLocation',
          header: 'Work Location Name',
          type: 'text',
          sortable: true,
        },

        {
          field: 'status',
          header: 'Status',
          type: 'status',
          sortable: true,
        },

        {
          field: 'date',
          header: 'Create Date',
          type: 'text',
          sortable: true,
        },

        {
          field: 'actions',
          header: 'Action',
          type: 'actions',
          width: '120px',
        },
      ],

      data: [
        {
          id: 1,
          workLocation: 'Chennai',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          workLocation: 'Bangalore',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          workLocation: 'Hyderabad',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          workLocation: 'Mumbai',
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }

  // =========================================================
  // STATE
  // =========================================================

  private getStateConfig(): MasterTableConfig {
    return {
      header: {
        title: 'State',
        icon: 'ti ti-map-2',
      },

      searchPlaceholder: 'Search state',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'state',
          header: 'State Name',
          type: 'text',
          sortable: true,
        },

        {
          field: 'stateCode',
          header: 'State Code',
          type: 'text',
          sortable: true,
        },

        {
          field: 'country',
          header: 'Country',
          type: 'text',
          sortable: true,
        },

        {
          field: 'status',
          header: 'Status',
          type: 'status',
          sortable: true,
        },

        {
          field: 'date',
          header: 'Create Date',
          type: 'text',
          sortable: true,
        },

        {
          field: 'actions',
          header: 'Action',
          type: 'actions',
          width: '120px',
        },
      ],

      data: [
        {
          id: 1,
          state: 'Tamil Nadu',
          stateCode: 'TN',
          country: 'India',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          state: 'Karnataka',
          stateCode: 'KA',
          country: 'India',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          state: 'Kerala',
          stateCode: 'KL',
          country: 'India',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          state: 'Maharashtra',
          stateCode: 'MH',
          country: 'India',
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }

  // =========================================================
  // DISTRICT
  // =========================================================

  private getDistrictConfig(): MasterTableConfig {
    return {
      header: {
        title: 'District',
        icon: 'ti ti-map-pin',
      },

      searchPlaceholder: 'Search district',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'district',
          header: 'District Name',
          type: 'text',
          sortable: true,
        },

        {
          field: 'state',
          header: 'State',
          type: 'text',
          sortable: true,
        },

        {
          field: 'status',
          header: 'Status',
          type: 'status',
          sortable: true,
        },

        {
          field: 'date',
          header: 'Create Date',
          type: 'text',
          sortable: true,
        },

        {
          field: 'actions',
          header: 'Action',
          type: 'actions',
          width: '120px',
        },
      ],

      data: [
        {
          id: 1,
          district: 'Chennai',
          state: 'Tamil Nadu',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          district: 'Coimbatore',
          state: 'Tamil Nadu',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          district: 'Madurai',
          state: 'Tamil Nadu',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          district: 'Salem',
          state: 'Tamil Nadu',
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }

  // =========================================================
  // LEAVE TYPE
  // =========================================================

  private getLeaveConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Leave Type',
        icon: 'ti ti-calendar',
      },

      searchPlaceholder: 'Search leave type',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'leaveType',
          header: 'Leave Type Name',
          type: 'text',
          sortable: true,
        },

        {
          field: 'totalDays',
          header: 'Total Days',
          type: 'text',
          sortable: true,
        },

        {
          field: 'status',
          header: 'Status',
          type: 'status',
          sortable: true,
        },

        {
          field: 'date',
          header: 'Create Date',
          type: 'text',
          sortable: true,
        },

        {
          field: 'actions',
          header: 'Action',
          type: 'actions',
          width: '120px',
        },
      ],

      data: [
        {
          id: 1,
          leaveType: 'Casual Leave',
          totalDays: 12,
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          leaveType: 'Sick Leave',
          totalDays: 10,
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          leaveType: 'Earned Leave',
          totalDays: 15,
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          leaveType: 'Loss Of Pay',
          totalDays: 5,
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }

  // =========================================================
  // SHIFT
  // =========================================================

  private getShiftConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Shift',
        icon: 'ti ti-clock',
      },

      searchPlaceholder: 'Search shift',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'shiftName',
          header: 'Shift Name',
          type: 'text',
          sortable: true,
        },

        {
          field: 'status',
          header: 'Status',
          type: 'status',
          sortable: true,
        },

        {
          field: 'date',
          header: 'Create Date',
          type: 'text',
          sortable: true,
        },

        {
          field: 'actions',
          header: 'Action',
          type: 'actions',
          width: '120px',
        },
      ],

      data: [
        {
          id: 1,
          shiftName: 'General Shift',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          shiftName: 'Morning Shift',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          shiftName: 'Evening Shift',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          shiftName: 'Night Shift',
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }
}
