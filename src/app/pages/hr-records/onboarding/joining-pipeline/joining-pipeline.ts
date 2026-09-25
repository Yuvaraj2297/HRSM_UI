import { AppStatCard } from '../../../../shared/stat-card/stat-card';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CANDIDATES,
  Candidate,
  DEPARTMENT_OPTIONS,
  DEPT_COLORS,
  KpiCard,
  STATUS_COLORS,
  StageCode,
  StageTab,
} from '../joining-model';
import { PrimeDataTable, PrimeTableColumn } from '../../../../shared/primedatatable/primedatatable';

@Component({
  selector: 'app-onboarding-pipeline',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PrimeDataTable, AppStatCard],
  templateUrl: './joining-pipeline.html',
  styleUrl: './joining-pipeline.scss',
})
export class JoiningPipeline implements OnInit {
  header = {
    title: 'Candidate Onboarding & Joining Pipeline',
    icon: 'bi bi-person-check',
  };

  searchPlaceholder = 'Search first name, email, PAN, Aadhaar...';

  // ---------------------------------------------------------------
  // Data
  // ---------------------------------------------------------------
  allCandidates: Candidate[] = [];

  // ---------------------------------------------------------------
  // Filter tabs (drive which rows go into the table's [data])
  // ---------------------------------------------------------------
  tabs: StageTab[] = [
    { key: 'all', label: 'All Candidates' },
    { key: 'preboarding', label: 'Pre-Boarding' },
    { key: 'induction', label: 'Day 1 Induction' },
    { key: 'completed', label: 'Onboarded' },
  ];
  activeTab: StageTab['key'] = 'all';

  // ---------------------------------------------------------------
  // PrimeDataTable config
  // ---------------------------------------------------------------
  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', width: '60px' },
    { field: 'firstName', header: 'First Name', sortable: true, type: 'text' },
    { field: 'lastName', header: 'Last Name', sortable: true, type: 'text' },
    { field: 'email', header: 'Email ID', sortable: true, type: 'text' },
    { field: 'officialEmail', header: 'Official Email', sortable: true, type: 'text' },
    { field: 'status', header: 'Onboarding Status', sortable: true, type: 'status', colorMap: STATUS_COLORS },
    { field: 'deptShort', header: 'Department', sortable: true, type: 'badge', colorMap: DEPT_COLORS },
    { field: 'source', header: 'Source of Hire', sortable: true, type: 'text' },
    { field: 'pan', header: 'PAN Card Number', sortable: true, type: 'text', cellClass: 'mono-cell' },
    { field: 'aadhaar', header: 'Aadhaar Card Number', sortable: true, type: 'text', cellClass: 'mono-cell' },
    {
      field: 'actions',
      header: 'Action',
      type: 'pill-actions',
      width: '140px',
      buttons: [
        {
          key: 'view',
          icon: 'bi bi-eye',
          variant: 'outline',
          tooltip: 'View Complete Candidate Details',
        },
        {
          key: 'onboard',
          icon: 'bi bi-person-check-fill',
          label: 'Onboard',
          tooltip: 'Finalize Onboarding to Employee Master',
          hiddenWhen: (c: Candidate) => c.statusCode === 'completed',
        },
        {
          key: 'viewMaster',
          icon: 'bi bi-person-vcard',
          label: 'View',
          color: 'var(--text)',
          tooltip: 'View in Employee Master',
          hiddenWhen: (c: Candidate) => c.statusCode !== 'completed',
        },
      ],
    },
  ];

  // ---------------------------------------------------------------
  // Modals
  // ---------------------------------------------------------------
  showAddModal = false;
  showViewModal = false;
  selectedCandidate: Candidate | null = null;

  

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
   
  }

  ngOnInit(): void {
    this.allCandidates = [...CANDIDATES];
  }

  // ---------------------------------------------------------------
  // KPI cards — derived from data
  // ---------------------------------------------------------------
  get kpiCards(): KpiCard[] {
    const total = this.allCandidates.length;
    const preboarding = this.allCandidates.filter((c) => c.statusCode === 'preboarding').length;
    const induction = this.allCandidates.filter((c) => c.statusCode === 'induction').length;
    const completed = this.allCandidates.filter((c) => c.statusCode === 'completed').length;

    return [
      {
        label: 'Total Onboarding Candidates',
        value: `${total} Joiners`,
        sub: 'Active pre-boarding pipeline',
        icon: 'bi bi-people-fill',
        bg: 'var(--neutral-50)',
        color: 'var(--green-550)',
      },
      {
        label: 'In Pre-Boarding',
        value: `${preboarding} Candidates`,
        sub: 'Document verification in progress',
        icon: 'bi bi-hourglass-split',
        bg: 'var(--warning-soft)',
        color: 'var(--orange-500)',
      },
      {
        label: 'Day 1 Induction Scheduled',
        value: `${induction} Candidates`,
        sub: 'Scheduled for next Monday',
        icon: 'bi bi-calendar-event',
        bg: 'var(--blue-50)',
        color: 'var(--blue-600-2)',
      },
      {
        label: 'Completed & Onboarded',
        value: `${completed} Employees`,
        sub: 'Transferred to Employee Master',
        icon: 'bi bi-check2-circle',
        bg: 'var(--green-50-2)',
        color: 'var(--primary-dark)',
      },
    ];
  }

  tabCount(key: StageTab['key']): number {
    if (key === 'all') return this.allCandidates.length;
    return this.allCandidates.filter((c) => c.statusCode === key).length;
  }

  /** rows passed to [data] — the table's own search box filters within this set */
  get tableData(): Candidate[] {
    if (this.activeTab === 'all') return this.allCandidates;
    return this.allCandidates.filter((c) => c.statusCode === this.activeTab);
  }

  setTab(key: StageTab['key']): void {
    this.activeTab = key;
  }

  // ---------------------------------------------------------------
  // Table action handler (pill-actions buttons emit { action, row } via actionClick)
  // ---------------------------------------------------------------
  onTableAction(event: { action: string; row: Candidate }): void {
    const { action, row } = event;

    switch (action) {
      case 'view':
        this.viewCandidate(row);
        break;
      case 'onboard':
        this.onboardCandidate(row);
        break;
      case 'viewMaster':
        this.viewInEmployeeMaster();
        break;
    }
  }

  // ---------------------------------------------------------------
  // View candidate modal
  // ---------------------------------------------------------------
  viewCandidate(c: Candidate): void {
    this.selectedCandidate = c;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedCandidate = null;
  }

  initials(c: Candidate): string {
    return (c.firstName?.charAt(0) || 'C').toUpperCase();
  }

  // ---------------------------------------------------------------
  // Onboard / finalize to Employee Master
  // ---------------------------------------------------------------
  onboardCandidate(c: Candidate): void {
    this.router.navigate(['employee/employee-creation'], {
      queryParams: { prefill: `${c.firstName} ${c.lastName}` },
    });
  }

  viewInEmployeeMaster(): void {
    this.router.navigate(['employee/employee-creation']);
  }

  // ---------------------------------------------------------------
  // Add candidate modal (wired to the table's own [Accessactions]="{add:true}" button)
  // ---------------------------------------------------------------
  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  
 

  

}