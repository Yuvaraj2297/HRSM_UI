import { Component, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { BootstrapFixService } from '../../../../services/bootstrap-fix.service';
declare const bootstrap: any;

export interface Employee {
  id: string;
  code: string;
  name: string;
  dept: string;
  pos: string;
  img: string;
}

export interface Department {
  id: string;
  name: string;
  color: string;
  employeeCount: number;
  employees: Employee[];
}

export interface EmployeeNode {
  id: string;
  code: string;
  name: string;
  dept: string;
  pos: string;
  img: string;
  children: EmployeeNode[];
}

@Component({
  selector: 'app-employee-tree',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgTemplateOutlet],
  templateUrl: './employee-tree.html',
  styleUrl: './employee-tree.scss',
})
export class EmployeeTree implements AfterViewInit {

  activeView: 'dept' | 'emp' = 'emp'; // Start on emp so we see it immediately
  selectedDeptId: string | null = null;
  expandedEmpIds: string[] = ['e001']; // Pre-expand root
  private bootstrapFixService = inject(BootstrapFixService);
  constructor(private cdr: ChangeDetectorRef) {}
  @ViewChild('countryOffcanvas') countryOffcanvas!: ElementRef;

  ngAfterViewInit() {
    // Don't try to build the bootstrap.Offcanvas instance here — if the
    // bootstrap JS bundle hasn't finished loading/executing yet, `bootstrap`
    // is undefined, this throws, and countryOffcanvasInstance is silently
    // left undefined forever (that's what was crashing OpenCountryOffcanvas).
    // Instead it's built lazily, on first actual use, in getCountryOffcanvas().
  }

  ngOnInit() {
    this.bootstrapFixService.init();
    this.activeView = 'dept';
  }

  AddCountry() {
    this.OpenCountryOffcanvas();
  }

  countryOffcanvasInstance: any;

  /** Creates the bootstrap.Offcanvas instance on first use instead of
   *  depending on it already existing by the time it's needed. */
  private getCountryOffcanvas(): any {
    if (this.countryOffcanvasInstance) {
      return this.countryOffcanvasInstance;
    }

    if (typeof bootstrap === 'undefined' || !bootstrap.Offcanvas) {
      console.error(
        'EmployeeTree: bootstrap.Offcanvas is unavailable — is the Bootstrap JS bundle ' +
        'loaded (e.g. in angular.json "scripts" or imported in main.ts)?'
      );
      return null;
    }

    if (!this.countryOffcanvas?.nativeElement) {
      console.error('EmployeeTree: #countryOffcanvas element not found in the template.');
      return null;
    }

    this.countryOffcanvasInstance = new bootstrap.Offcanvas(this.countryOffcanvas.nativeElement, {
      backdrop: 'static',
      keyboard: false,
    });
    return this.countryOffcanvasInstance;
  }

  // open offcanvas
  OpenCountryOffcanvas() {
    this.getCountryOffcanvas()?.show();
  }

  // close offcanvas & reset form
  CloseCountryOffcanvas() {
    this.getCountryOffcanvas()?.hide();
  }

  departments: Department[] = [
    { id: 'it', name: 'IT', color: 'var(--blue-450)', employeeCount: 2,
      employees: [
        { id: 's20', code: 'S20', name: 'Christopher B...', dept: 'HR', pos: 'IT Support Specialist', img: '/assets/profile-1.jpg' },
        { id: 's106', code: 'S106', name: 'Olivia Chen', dept: 'HR', pos: 'Software Engineer', img: '/assets/profile-2.jpg' },
      ] },
    { id: 'mgmt', name: 'Management', color: 'var(--green-350)', employeeCount: 1,
      employees: [
        { id: 's20', code: 'S20', name: 'Christopher B...', dept: 'HR', pos: 'Operations Manager', img: '/assets/profile-1.jpg' },
      ] },
    { id: 'marketing', name: 'Marketing', color: 'var(--warning)', employeeCount: 3,
      employees: [
        { id: 's106', code: 'S106', name: 'Olivia Chen', dept: 'HR', pos: 'Marketing Executive', img: '/assets/profile-2.jpg' },
        { id: 's107', code: 'S107', name: 'Lucas Lewis', dept: 'HR', pos: 'Content Strategist', img: '/assets/profile-3.jpg' },
        { id: 's108', code: 'S108', name: 'Isabella Walker', dept: 'HR', pos: 'Brand Designer', img: '/assets/profile-4.jpg' }
      ] },
    { id: 'hr', name: 'HR', color: 'var(--danger)', employeeCount: 4,
      employees: [
        { id: 's20', code: 'S20', name: 'Christopher B...', dept: 'HR', pos: 'HR Generalist', img: '/assets/profile-1.jpg' },
        { id: 's106', code: 'S106', name: 'Olivia Chen', dept: 'HR', pos: 'Recruiter', img: '/assets/profile-2.jpg' },
        { id: 's107', code: 'S107', name: 'Lucas Lewis', dept: 'HR', pos: 'HR Business Partner', img: '/assets/profile-3.jpg' },
        { id: 's108', code: 'S108', name: 'Isabella Walker', dept: 'HR', pos: 'People Ops Lead', img: '/assets/profile-4.jpg' },
      ],
    },
  ];

  employeeTree: EmployeeNode[] = [
    {
      id: 'e001', code: '5056', name: 'Vickey G', dept: 'CEO', pos: 'Chief Executive Officer', img: '/assets/profile-1.jpg',
      children: [
        {
          id: 'e002', code: 'S19', name: 'Michael Johnson', dept: 'Administration', pos: 'VP of Administration', img: '/assets/profile-2.jpg',
          children: [
            {
              id: 'e010', code: 'S101', name: 'Andrew Turner', dept: 'Administration', pos: 'Engineering Manager', img: '/assets/profile-3.jpg',
              children: [
                { id: 'e030', code: 'S201', name: 'Rachel Green', dept: 'Team Member', pos: 'Software Engineer', img: '/assets/profile-4.jpg', children: [] },
                { id: 'e031', code: 'S202', name: 'Tom Hardy', dept: 'Team Member', pos: 'Software Engineer', img: '/assets/profile-1.jpg', children: [] },
                { id: 'e032', code: 'S203', name: 'Nina Dobrev', dept: 'Team Member', pos: 'QA Engineer', img: '/assets/profile-2.jpg', children: [] },
              ]
            },
            { id: 'e011', code: 'S102', name: 'Ember Johnson', dept: 'Administration', pos: 'Office Manager', img: '/assets/profile-3.jpg', children: [] },
            { id: 'e012', code: 'S103', name: 'Ethen Anderson', dept: 'Administration', pos: 'Administrative Assistant', img: '/assets/profile-2.jpg', children: [] },
          ]
        },
        { id: 'e003', code: 'S2', name: 'Lilly Williams', dept: 'Administration', pos: 'Executive Assistant', img: '/assets/profile-2.jpg', children: [] },
        { id: 'e004', code: 'S20', name: 'Christopher Brown', dept: 'Administration', pos: 'Finance Director', img: '/assets/profile-4.jpg', children: [] },
        { id: 'e005', code: 'S3', name: 'Clarkson Walter', dept: 'Administration', pos: 'Legal Counsel', img: '/assets/profile-3.jpg', children: [] },
      ]
    }
  ];

  setView(view: 'dept' | 'emp'): void {
    this.activeView = view;
    if (view === 'emp' && this.expandedEmpIds.length === 0) {
      this.expandedEmpIds = ['e001'];
    }
    this.cdr.detectChanges();
  }

  toggleDept(id: string): void {
    this.selectedDeptId = this.selectedDeptId === id ? null : id;
  }

  toggleEmp(id: string): void {
    if (this.expandedEmpIds.includes(id)) {
      this.expandedEmpIds = this.expandedEmpIds.filter(x => x !== id);
    } else {
      this.expandedEmpIds = [...this.expandedEmpIds, id];
    }
    this.cdr.detectChanges();
  }

  isExpanded(id: string): boolean {
    return this.expandedEmpIds.includes(id);
  }

  countChildren(node: EmployeeNode): number {
    let count = node.children.length;
    node.children.forEach(c => count += this.countChildren(c));
    return count;
  }

  resetView(): void {
    this.activeView = 'dept';
    this.selectedDeptId = null;
    this.expandedEmpIds = ['e001'];
    this.selectedDetail = null;
    this.cdr.detectChanges();
  }

  printTree(): void {
    window.print();
  }

  openFilter(): void {}

  /* =============================================================
     DETAIL PANEL — mirrors showDetail()/showEmpDetail() in the
     PHP reference: any card click (employee card, or a tree node
     in the Employee Tree view) opens this panel with that
     person's info. Direct/Total Reports only apply to
     EmployeeNode (it has `children`); a flat department-list
     Employee has none, so those rows read 0.
  ============================================================= */
  selectedDetail: Employee | EmployeeNode | null = null;

  showDetail(node: Employee | EmployeeNode): void {
    this.selectedDetail = node;
  }

  hideDetail(): void {
    this.selectedDetail = null;
  }

  private hasChildren(node: Employee | EmployeeNode): node is EmployeeNode {
    return 'children' in node;
  }

  directReportsCount(node: Employee | EmployeeNode): number {
    return this.hasChildren(node) ? node.children.length : 0;
  }

  totalReportsCount(node: Employee | EmployeeNode): number {
    return this.hasChildren(node) ? this.countChildren(node) : 0;
  }
}
