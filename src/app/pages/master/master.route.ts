import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import('./common-component/common-component')
        .then(m => m.CommonComponent)
  },

  // =========================================================
  // TEAM
  // =========================================================
  {
    path: 'teams',
    data: {
      title: 'Teams',
      parentTitle: 'Master',
      masterType: 'team'
    },
    loadComponent: () =>
      import('./common-component/common-component')
        .then(m => m.CommonComponent)
  },

  // =========================================================
  // POSITION
  // =========================================================
  {
    path: 'position',
    data: {
      title: 'Position',
      parentTitle: 'Master',
      masterType: 'position'
    },
    loadComponent: () =>
      import('./common-component/common-component')
        .then(m => m.CommonComponent)
  },

  // =========================================================
  // DOCUMENT UPLOAD
  // =========================================================
  {
    path: 'document-upload',
    data: {
      title: 'Document Upload',
      parentTitle: 'Master',
      masterType: 'document'
    },
    loadComponent: () =>
      import('./common-component/common-component')
        .then(m => m.CommonComponent)
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
    loadComponent: () =>
      import('./common-component/common-component')
        .then(m => m.CommonComponent)
  },

  // =========================================================
  // STATE
  // =========================================================
  {
    path: 'state',
    data: {
      title: 'State',
      parentTitle: 'Master',
      masterType: 'state'
    },
    loadComponent: () =>
      import('./common-component/common-component')
        .then(m => m.CommonComponent)
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
    loadComponent: () =>
      import('./common-component/common-component')
        .then(m => m.CommonComponent)
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
    loadComponent: () =>
      import('./common-component/common-component')
        .then(m => m.CommonComponent)
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
    loadComponent: () =>
      import('./common-component/common-component')
        .then(m => m.CommonComponent)
  }

];