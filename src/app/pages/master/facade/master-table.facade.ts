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

      case 'job_type':

        return this.getJobTypeConfig();

      case 'designation':

      return this.getDesignationConfig();

      case 'branch':
        return this.getBranchConfig();

      case 'employee':
        return this.getEmployeeTypeConfig();

      case 'work':
        return this.getWorkConfig();

       case 'country':
          return this.getCountryConfig();

      case 'state':
        return this.getStateConfig();

      case 'district':
        return this.getDistrictConfig();

      case 'leave':
        return this.getLeaveConfig();

      case 'shift':
        return this.getShiftConfig();

        case 'relieving_type':

        return this.getRelievingTypeConfig();

        case 'notice_period':
          return this.getNoticePeriodConfig();


        case 'holiday':
          return this.getHolidayConfig();

          case 'permission':
        return this.getPermissionConfig();

      case 'role':
        return this.getRoleConfig();


      default:
        return this.getDepartmentConfig();
    }
  }


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

   private getJobTypeConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Job Type',
        icon: 'ti ti-sitemap',
      },

      searchPlaceholder: 'Search Job Type',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'jobType',
          header: 'Job Type',
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
          jobType: 'Remote',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          jobType: 'Work from Office',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          jobType: 'Work from Home',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          jobType: 'Hybrid',
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }

   private getDesignationConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Designation',
        icon: 'bi bi-person-badge',
      },

      searchPlaceholder: 'Search designation',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'designationName',
          header: 'Designation',
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
          designationName: 'UI/UX Designer',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          designationName: 'Product Designer',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          designationName: 'iOS Developer',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          designationName: 'Business Analyst',
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }

   private getBranchConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Branch',
        icon: 'bi bi-buildings',
      },

      searchPlaceholder: 'Search branch',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'branchName',
          header: 'Branch',
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
          branchName: 'Chennai',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          branchName: 'Bengaluru',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          branchName: 'Hyderabad',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          branchName: 'Mumbai',
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }

   private getEmployeeTypeConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Employee Type',
        icon: 'bi bi-person-workspace',
      },

      searchPlaceholder: 'Search Employee Type',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'employeeTypeName',
          header: 'Employee Type Name',
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
          employeeTypeName: 'Confirmation',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          employeeTypeName: 'Contract',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          employeeTypeName: 'Intern',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          employeeTypeName: 'Probation',
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }

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

   private getCountryConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Country',
        icon: '  bi bi-globe',
      },

      searchPlaceholder: 'Search country',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'country',
          header: 'Country Name',
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
          country: 'India',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          country: 'UK',
          status: 'Enable',
          date: '18-12-2025',
        },
      ],
    };
  }
 
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


    private getRelievingTypeConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Relieving Type',
        icon: 'bi bi-box-arrow-right',
      },

      searchPlaceholder: 'Search relieving type',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'relievingType',
          header: 'Relieving Type',
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
          relievingType: 'Absconded',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          relievingType: 'Contract End',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          relievingType: 'Resignation',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          relievingType: 'Retirement',
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }

    private getNoticePeriodConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Notice Period',
        icon: 'bi bi-clock',
      },

      searchPlaceholder: 'Search notice period',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'noticePeriod',
          header: 'Notice Period',
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
          noticePeriod: 'Immediate',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          noticePeriod: '90 Days',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          noticePeriod: '60 Days',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          noticePeriod: '30 Days',
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }
  
    private  getHolidayConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Holiday Type',
        icon: 'bi bi-calendar-event',
      },

      searchPlaceholder: 'Search holiday type',

      columns: [
        {
          field: 'sno',
          header: 'S.No',
        },

        {
          field: 'holidayType',
          header: 'Holiday Type',
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
          holidayType: 'Company Holiday',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 2,
          holidayType: 'Optional Holiday',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 3,
          holidayType: 'Public Holiday',
          status: 'Enable',
          date: '18-12-2025',
        },

        {
          id: 4,
          holidayType: 'Restricted Holiday',
          status: 'Disable',
          date: '18-12-2025',
        },
      ],
    };
  }

  private getPermissionConfig(): MasterTableConfig {
    const caps = (
      viewOwn = false,
      viewGlobal = false,
      create = false,
      edit = false,
      del = false,
    ) => ({ viewOwn, viewGlobal, create, edit, delete: del });

    // capabilitiesText is only used by the search box (see meta.filterFields)
    const withText = (row: any) => ({
      ...row,
      capabilitiesText: Object.entries({
        viewOwn: 'View(Own)',
        viewGlobal: 'View(Global)',
        create: 'Create',
        edit: 'Edit',
        delete: 'Delete',
      })
        .filter(([key]) => row.capabilities[key])
        .map(([, label]) => label)
        .join(' '),
    });

    return {
      header: {
        title: 'Permission Modules',
        icon: 'bi bi-shield-lock',
      },

      searchPlaceholder: 'Search permission modules',

      columns: [
        { field: 'sno', header: 'S.No' },

        { field: 'group', header: 'Group', type: 'text', sortable: true },

        { field: 'module', header: 'Module', type: 'text', sortable: true },

        {
          field: 'capabilities',
          header: 'Capabilities',
          type: 'chips',
          sortable: false,
          meta: {
            labels: {
              viewOwn: 'View(Own)',
              viewGlobal: 'View(Global)',
              create: 'Create',
              edit: 'Edit',
              delete: 'Delete',
            },
            filterFields: ['capabilitiesText'],
          },
        },

        { field: 'actions', header: 'Action', type: 'actions', width: '120px' },
      ],

      data: [
        { id: 1, group: 'HR Management', module: 'HR Dashboard', capabilities: caps(true) },
        { id: 2, group: 'HR Management', module: 'Organization', capabilities: caps(true, true, true, true, true) },
        { id: 3, group: 'HR Management', module: 'Employees (Records)', capabilities: caps(true, true, true, true, true) },
        { id: 4, group: 'HR Management', module: 'Shift Management', capabilities: caps(true, true, true, true, true) },
        { id: 5, group: 'HR Management', module: 'Loan & Advances', capabilities: caps(true, true, true, true, true) },
        { id: 6, group: 'HR Management', module: 'Payroll Management', capabilities: caps(true, true, true, true, true) },
        { id: 7, group: 'Timesheet & Leave', module: 'Timesheet Check In Out', capabilities: caps(true) },
      ].map(withText),
    };
  }

  private getRoleConfig(): MasterTableConfig {
    return {
      header: {
        title: 'Role',
        icon: 'bi bi-person-gear',
      },

      searchPlaceholder: 'Search role',

      columns: [
        { field: 'sno', header: 'S.No' },

        { field: 'roleName', header: 'Role Name', type: 'text', sortable: true },

        { field: 'status', header: 'Status', type: 'status', sortable: true },

        { field: 'date', header: 'Create Date', type: 'text', sortable: true },

        { field: 'actions', header: 'Action', type: 'actions', width: '150px' },
      ],

      data: [
        { id: 1, roleName: 'Manager', status: 'Enable', date: '20-12-2025' },
        { id: 2, roleName: 'HR Admin', status: 'Enable', date: '22-12-2025' },
        { id: 3, roleName: 'Finance', status: 'Enable', date: '05-01-2026' },
        { id: 4, roleName: 'Employee', status: 'Enable', date: '18-12-2025' },
        { id: 5, roleName: 'Admin', status: 'Enable', date: '10-01-2026' },
      ],
    };
  }
}