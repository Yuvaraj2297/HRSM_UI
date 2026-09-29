import { Routes } from '@angular/router';


const commonMasterComponent = () =>
  import('./common-component/common-component').then(
    (m) => m.CommonComponent
  );

export const MASTER_ROUTES: Routes = [

  // =========================================================
  // DEPARTMENT
  // =========================================================
  {
    path: 'department',
    data: {
      title: 'Department',
      parentTitle: 'Master',
      masterType: 'department'
    },
    loadComponent:commonMasterComponent,
  },


   {
    path: 'job',
    data: {
      title: 'Job Type',
      parentTitle: 'Master',
      masterType: 'job_type',
    },
    loadComponent: commonMasterComponent,
  },

  {
    path: 'designation',
    data: {
      title: 'Designation',
      parentTitle: 'Master',
      masterType: 'designation',
    },
    loadComponent: commonMasterComponent,
  },

  {
    path: 'branch',
    data: {
      title: 'Branch',
      parentTitle: 'Master',
      masterType: 'branch',
    },
    loadComponent: commonMasterComponent,
  },


   {
    path: 'employee',
    data: {
      title: 'Employee Type',
      parentTitle: 'Master',
      masterType: 'employee',
    },
    loadComponent: commonMasterComponent,
    },


  
  
  // =========================================================
  // WORK LOCATION
  // =========================================================
  {
    path: 'work-location',
    data: {
      title: 'Work Location',
      parentTitle: 'Master',
      masterType: 'work'
    },
    loadComponent:commonMasterComponent
  },



  {
    path: 'country',
    data: {
      title: 'Country',
      parentTitle: 'Master',
      masterType: 'country',
    },
    loadComponent: commonMasterComponent,
  },


  {
    path: 'state',
    data: {
      title: 'State',
      parentTitle: 'Master',
      masterType: 'state'
    },
    loadComponent: commonMasterComponent,
  },

  // =========================================================
  // DISTRICT
  // =========================================================
  {
    path: 'district',
    data: {
      title: 'District',
      parentTitle: 'Master',
      masterType: 'district'
    },
    loadComponent: commonMasterComponent,
  },

  // =========================================================
  // LEAVE TYPE
  // =========================================================
  {
    path: 'leave-type',
    data: {
      title: 'Leave Type',
      parentTitle: 'Master',
      masterType: 'leave'
    },
    loadComponent: commonMasterComponent,
  },






  // =========================================================
  // SHIFT
  // =========================================================
  {
    path: 'shift',
    data: {
      title: 'Shift',
      parentTitle: 'Master',
      masterType: 'shift'
    },
    loadComponent: commonMasterComponent,
  },

   {
    path: 'relieving-type',
    data: {
      title: 'Relieving Type',
      parentTitle: 'Master',
      masterType: 'relieving_type'
    },
    loadComponent: commonMasterComponent,
  },

   {
    path: 'notice-period',
    data: {
      title: 'Notice Period',
      parentTitle: 'Master',
      masterType: 'notice_period'
    },
    loadComponent: commonMasterComponent,
  },

   {
    path: 'holiday',
    data: {
      title: 'Holiday Type',
      parentTitle: 'Master',
      masterType: 'holiday'
    },
    loadComponent: commonMasterComponent,
  },


  {
    path: 'permission',
    data: {
      title: 'Permission Modules',
      parentTitle: 'Master',
      masterType: 'permission'
    },
    loadComponent: commonMasterComponent,
  },



   {
    path: 'role',
    data: {
      title: 'Role',
      parentTitle: 'Master',
      masterType: 'role'
    },
    loadComponent: commonMasterComponent,
  },






];