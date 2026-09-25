import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeDataTable, PrimeTableColumn } from '../../../../shared/primedatatable/primedatatable';

/* =========================================================
   DOCUMENT ROW
========================================================= */

interface DocRow {
  sno: number;

  employeeId: number;

  name: string;

  designation: string;

  avatar: string;

  category:
    | 'Identity'
    | 'Address'
    | 'Education'
    | 'Employment'
    | 'Bank / Payroll'
    | 'Statutory / UAN';

  docType: string;

  docNumber: string;

  fileName: string;

  fileIcon: string;

  fileIconColor: string;

  uploadDate: string;

  status:
    | 'Verified'
    | 'Pending HR Review'
    | 'Rejected';

  verifiedBy: string;

  /* Classes used by PrimeDataTable */
  categoryClass?: string;

  statusClass?: string;
}


/* =========================================================
   COMPONENT
========================================================= */

@Component({
  selector: 'app-document-verification',
  imports: [PrimeDataTable, CommonModule, AppStatCard],
  templateUrl: './document-verification.html',

  styleUrls: ['./document-verification.scss'],
})
export class DocumentVerification implements OnInit {
  /* =======================================================
     PAGE HEADER
  ======================================================== */

  // header = 'Document Verification & KYC Portal';

  searchPlaceholder = 'Search joiner or document...';

  /* =======================================================
     STATS
  ======================================================== */

  stats = {
    totalUploaded: 48,

    verified: 38,

    pendingReview: 7,

    resubmissionNeeded: 3,
  };

  /* =======================================================
     CATEGORY FILTERS
  ======================================================== */

  categories = [
    {
      label: 'All Categories',
      icon: 'bi-grid-fill',
      value: 'all',
      count: 7,
    },

    {
      label: 'Identity',
      icon: 'bi-card-heading',
      value: 'Identity',
    },

    {
      label: 'Address',
      icon: 'bi-geo-alt',
      value: 'Address',
    },

    {
      label: 'Education',
      icon: 'bi-journal-bookmark',
      value: 'Education',
    },

    {
      label: 'Employment',
      icon: 'bi-briefcase',
      value: 'Employment',
    },

    {
      label: 'Bank / Payroll',
      icon: 'bi-bank',
      value: 'Bank / Payroll',
    },

    {
      label: 'Statutory / UAN',
      icon: 'bi-file-earmark-text',
      value: 'Statutory / UAN',
    },
  ];

  activeCategory = 'all';

  /* =======================================================
     TABLE COLUMNS
  ======================================================== */

  columns: PrimeTableColumn[] = [
    {
      field: 'sno',

      header: 'S.No',

      sortable: false,

      width: '70px',
    },

    /* -----------------------------------------------------
       JOINER NAME
    ----------------------------------------------------- */

    {
      field: 'name',

      header: 'Joiner Name',

      sortable: true,

      type: 'avatarText',

      subField: 'designation',
    },

    /* -----------------------------------------------------
       CATEGORY
    ----------------------------------------------------- */

    {
      field: 'category',

      header: 'Category',

      sortable: true,

      type: 'badge',
    },

    /* -----------------------------------------------------
       DOCUMENT TYPE
    ----------------------------------------------------- */

    {
      field: 'docType',

      header: 'Document Type',

      sortable: false,

      type: 'pill',
    },

    /* -----------------------------------------------------
       DOCUMENT NUMBER
    ----------------------------------------------------- */

    {
      field: 'docNumber',

      header: 'Document / ID Number',

      sortable: false,

      cellClass: ' text-dark',
    },

    /* -----------------------------------------------------
       UPLOADED FILE
    ----------------------------------------------------- */

    {
      field: 'fileName',

      header: 'Uploaded File',

      sortable: false,

      type: 'fileLink',

      iconField: 'fileIcon',

      iconColorField: 'fileIconColor',
    },

    /* -----------------------------------------------------
       UPLOAD DATE
    ----------------------------------------------------- */

    {
      field: 'uploadDate',

      header: 'Upload Date',

      sortable: true,
    },

    /* -----------------------------------------------------
       VERIFICATION STATUS
    ----------------------------------------------------- */

    {
      field: 'status',

      header: 'Verification Status',

      sortable: true,

      type: 'statusBadge',
    },

    /* -----------------------------------------------------
       VERIFIED BY
    ----------------------------------------------------- */

    {
      field: 'verifiedBy',

      header: 'Verified By',

      sortable: false,
    },

    /* -----------------------------------------------------
       ACTION
       
       Uses existing PrimeDataTable pill-actions.
    ----------------------------------------------------- */

    {
      field: 'actions',
      header: 'Action',
      type: 'pill-actions',
      width: '220px',

      buttons: [
        {
          key: 'viewDetails',
          label: 'View Details',
          icon: 'bi bi-eye',
          variant: 'outline',
          color: 'var(--primary)',

          hiddenWhen: (row: any): boolean => row.status !== 'Verified',
        },

        {
          key: 'viewApprove',
          label: 'View / Approve',
          icon: 'bi bi-check-lg',
          variant: 'solid',
          color: 'var(--primary)',

          hiddenWhen: (row: any): boolean => row.status !== 'Pending HR Review',
        },

        {
          key: 'reject',
          label: '',
          icon: 'bi bi-x-lg',
          variant: 'solid',
          color: 'var(--danger)',
          tooltip: 'Reject / Resubmit',

          hiddenWhen: (row: any): boolean => row.status !== 'Pending HR Review',
        },
      ],
    },
  ];

  tableActions = {
    add: false,
  };

  tableData: DocRow[] = [];

  private allData: DocRow[] = [];

  /* =======================================================
     CONSTRUCTOR
  ======================================================== */

  constructor(private router: Router) {}

  /* =======================================================
     INIT
  ======================================================== */

  ngOnInit(): void {
    this.allData = [
      /* =====================================================
         ROW 1
      ===================================================== */

      {
        sno: 1,

        employeeId: 101,

        name: 'Kavitha Raman',

        designation: 'UX Designer',

        avatar: './assets/img/profile-1.jpg',

        category: 'Identity',

        docType: 'Aadhaar Card',

        docNumber: 'XXXX-XXXX-8921',

        fileName: 'Aadhaar_Kavitha.pdf',

        fileIcon: 'bi-file-earmark-pdf',

        fileIconColor: 'text-danger',

        uploadDate: '08-Mar-2026',

        status: 'Verified',

        verifiedBy: 'Sarah Mitchell (HR)',
      },

      /* =====================================================
         ROW 2
      ===================================================== */

      {
        sno: 2,

        employeeId: 102,

        name: 'Rahul Verma',

        designation: 'Full Stack Dev',

        avatar: './assets/img/profile-2.jpg',

        category: 'Identity',

        docType: 'PAN Card',

        docNumber: 'ABCDE1234F',

        fileName: 'PAN_Card_Rahul.jpg',

        fileIcon: 'bi-file-earmark-image',

        fileIconColor: 'text-primary',

        uploadDate: '01-Mar-2026',

        status: 'Pending HR Review',

        verifiedBy: 'Unassigned',
      },

      /* =====================================================
         ROW 3
      ===================================================== */

      {
        sno: 3,

        employeeId: 103,

        name: 'Siddharth Nair',

        designation: 'iOS Dev',

        avatar: './assets/img/profile-3.jpg',

        category: 'Address',

        docType: 'Passport (Address Page)',

        docNumber: 'Z9876543',

        fileName: 'Passport_Addr_Sid.pdf',

        fileIcon: 'bi-file-earmark-pdf',

        fileIconColor: 'text-danger',

        uploadDate: '04-Mar-2026',

        status: 'Verified',

        verifiedBy: 'Sarah Mitchell (HR)',
      },

      /* =====================================================
         ROW 4
      ===================================================== */

      {
        sno: 4,

        employeeId: 104,

        name: 'Priya Sundaram',

        designation: 'Financial Analyst',

        avatar: './assets/img/profile-4.jpg',

        category: 'Education',

        docType: 'Degree Certificate',

        docNumber: 'MBA/FIN/2021/41',

        fileName: 'MBA_Degree_Priya.pdf',

        fileIcon: 'bi-file-earmark-pdf',

        fileIconColor: 'text-danger',

        uploadDate: '20-Feb-2026',

        status: 'Verified',

        verifiedBy: 'Sarah Mitchell (HR)',
      },

      /* =====================================================
         ROW 5
      ===================================================== */

      {
        sno: 5,

        employeeId: 103,

        name: 'Siddharth Nair',

        designation: 'iOS Dev',

        avatar: './assets/img/profile-3.jpg',

        category: 'Employment',

        docType: 'Relieving & Experience Letter',

        docNumber: 'ZOHO/EXP/2026/99',

        fileName: 'Zoho_Relieving_Letter.pdf',

        fileIcon: 'bi-file-earmark-pdf',

        fileIconColor: 'text-danger',

        uploadDate: '25-Feb-2026',

        status: 'Verified',

        verifiedBy: 'Sarah Mitchell (HR)',
      },

      /* =====================================================
         ROW 6
      ===================================================== */

      {
        sno: 6,

        employeeId: 105,

        name: 'Ananya Gupta',

        designation: 'HR Generalist',

        avatar: './assets/img/profile-5.jpg',

        category: 'Bank / Payroll',

        docType: 'Cancelled Cheque',

        docNumber: 'HDFC 000123984712',

        fileName: 'HDFC_Cheque_Ananya.jpg',

        fileIcon: 'bi-file-earmark-image',

        fileIconColor: 'text-primary',

        uploadDate: '10-Mar-2026',

        status: 'Pending HR Review',

        verifiedBy: 'Unassigned',
      },

      /* =====================================================
         ROW 7
      ===================================================== */

      {
        sno: 7,

        employeeId: 101,

        name: 'Kavitha Raman',

        designation: 'UX Designer',

        avatar: './assets/img/profile-1.jpg',

        category: 'Statutory / UAN',

        docType: 'UAN & PF Details Form 11',

        docNumber: 'UAN: 101293847561',

        fileName: 'UAN_Form11_Kavitha.pdf',

        fileIcon: 'bi-file-earmark-pdf',

        fileIconColor: 'text-danger',

        uploadDate: '09-Mar-2026',

        status: 'Verified',

        verifiedBy: 'Sarah Mitchell (HR)',
      },
    ];

    this.applyFilter();
  }

  /* =======================================================
     CATEGORY CLASS MAP
  ======================================================== */

  get categoryClassMap(): Record<string, string> {
    return {
      Identity: 'cat-identity',

      Address: 'cat-address',

      Education: 'cat-education',

      Employment: 'cat-employment',

      'Bank / Payroll': 'cat-bank',

      'Statutory / UAN': 'cat-statutory',
    };
  }

  /* =======================================================
     STATUS CLASS MAP
  ======================================================== */

  get statusClassMap(): Record<string, string> {
    return {
      Verified: 'doc-status-verified',

      'Pending HR Review': 'doc-status-pending',

      Rejected: 'doc-status-rejected',
    };
  }

  /* =======================================================
     CATEGORY SELECT
  ======================================================== */

  selectCategory(value: string): void {
    this.activeCategory = value;

    this.applyFilter();
  }

  /* =======================================================
     APPLY CATEGORY FILTER
  ======================================================== */

  private applyFilter(): void {
    const filtered =
      this.activeCategory === 'all'
        ? this.allData
        : this.allData.filter((row) => row.category === this.activeCategory);

    this.tableData = filtered.map((row) => ({
      ...row,

      categoryClass: this.categoryClassMap[row.category],

      statusClass: this.statusClassMap[row.status],
    }));
  }

  /* =======================================================
     SEND REMINDERS
  ======================================================== */

  sendReminders(): void {
    alert('Document upload reminder email sent to all pending joiners!');
  }

  /* =======================================================
     UPLOAD & SUBMIT DOCUMENTS
  ======================================================== */

  openCreateModal(): void {
    this.router.navigate(['employee/employee-creation']);
  }

  /* =======================================================
     TABLE ACTION
  ======================================================== */

  onTableAction(event: { action: string; row: DocRow }): void {
    const { action, row } = event;

    switch (action) {
      /* ===================================================
         VIEW VERIFIED DOCUMENT
      =================================================== */

      case 'viewDetails':
        this.router.navigate(['employee/employee-creation'], {
          queryParams: {
            employeeId: row.employeeId,
          },
        });

        break;

      /* ===================================================
         VIEW / APPROVE PENDING DOCUMENT
      =================================================== */

      case 'viewApprove':
        this.router.navigate(['/onboarding-document-view'], {
          queryParams: {
            employeeId: row.employeeId,
          },
        });

        break;

      /* ===================================================
         REJECT / RESUBMIT
      =================================================== */

      case 'reject':
        alert(`Requested resubmission from ${row.name}.`);

        break;
    }
  }
}