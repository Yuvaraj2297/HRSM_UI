import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeFormFacade } from './facade/employee-form.facade';
import { ProfileTab,} from './tabs/profile-tab/profile-tab';
import { FamilyTab } from './tabs/family-tab/family-tab';
import { EducationTab } from './tabs/education-tab/education-tab';
import { ExperienceTab } from './tabs/experience-tab/experience-tab';
import { BankTab } from './tabs/bank-tab/bank-tab';
import { KycTab } from './tabs/kyc-tab/kyc-tab';
import { RelievingTab } from './tabs/relieving-tab/relieving-tab';
import { CtcReportTab } from './tabs/ctc-report-tab/ctc-report-tab';
import { DocumentTab } from './tabs/document-tab/document-tab';
import { LeaveTab } from './tabs/leave-tab/leave-tab';
import { OtApprovalTab } from './tabs/ot-approval-tab/ot-approval-tab';
import { LeaveRulesTab } from './tabs/leave-rules-tab/leave-rules-tab';
import { ReviewTab } from './tabs/review-tab/review-tab';
import { PermissionsTab } from './tabs/permission-tab/permission-tab';
import { Breadcrumb } from '../../../../shared/breadcrumb/breadcrumb';

declare var bootstrap: any;



interface WizardTab {
  step: number;
  label: string;
  icon: string;
}

/** parent tab: a group of wizard steps */
interface WizardGroup {
  key: string;
  label: string;
  icon: string;
  steps: number[];
}

@Component({
  selector: 'app-employee-creation',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule,ProfileTab,FormsModule,FamilyTab,EducationTab,ExperienceTab,BankTab,KycTab,RelievingTab,
    CtcReportTab,DocumentTab,LeaveTab,OtApprovalTab,LeaveRulesTab,ReviewTab,PermissionsTab,Breadcrumb
  ],
  templateUrl: './employee-creation.html',
  styleUrl: './employee-creation.scss',
})



export class EmployeeCreation implements AfterViewInit {

  @ViewChild('Offcanvas') Offcanvas!: ElementRef;
  OffcanvasInstance: any;


  tabs: WizardTab[] = [
    { step: 1, label: 'Profile', icon: 'bi bi-person' },
    { step: 2, label: 'Permissions', icon: 'bi bi-person-gear' },
    { step: 3, label: 'Family Details', icon: 'bi bi-people' },
    { step: 4, label: 'Educational Details', icon: 'bi bi-mortarboard' },
    { step: 5, label: 'Experience', icon: 'bi bi-briefcase' },
    { step: 6, label: 'Bank Account', icon: 'bi bi-bank' },
    { step: 7, label: 'KYC Document', icon: 'bi bi-patch-check' },
    { step: 8, label: 'Relieving', icon: 'bi bi-box-arrow-right' },
    { step: 9, label: 'CTC Report', icon: 'bi bi-file-earmark-bar-graph' },
    { step: 10, label: 'Documents', icon: 'bi bi-folder2' },
    { step: 11, label: 'Leave Approval', icon: 'bi bi-calendar2-check' },
    { step: 12, label: 'OT Approval', icon: 'bi bi-clock-history' },
    { step: 13, label: 'Leave Rules', icon: 'bi bi-journal-text' },
    { step: 14, label: 'Review', icon: 'bi bi-clipboard-check' },
  ];

  /** Parent tabs. Steps run in this order (Next / Back follow it). */
  groups: WizardGroup[] = [
    { key: 'personal', label: 'Personal', icon: 'bi bi-person-vcard', steps: [1, 2, 3, 4, 5] },
    { key: 'finance', label: 'Finance & Documents', icon: 'bi bi-wallet2', steps: [6, 7, 9, 10] },
    { key: 'approvals', label: 'Approvals & Rules', icon: 'bi bi-shield-check', steps: [11, 12, 13] },
    { key: 'exit', label: 'Exit & Review', icon: 'bi bi-flag', steps: [8, 14] },
  ];

  /** every step in wizard order */
  get sequence(): number[] {
    return this.groups.flatMap(g => g.steps);
  }

  current = 1;
  

  get total(): number {
    return this.sequence.length;
  }
  get isLast(): boolean {
    return this.position === this.total;
  }


  ngAfterViewInit() {
    this.OffcanvasInstance = new bootstrap.Offcanvas(this.Offcanvas.nativeElement, {
      backdrop: 'static',
      keyboard: false,
    });
  }
  /** verification widget state — set from the API once known */
  vaStatus: 'pending' | 'verified' | 'approved' | 'rejected' = 'pending';
  private vaOrder = ['pending', 'verified', 'approved'];

  constructor(public fs:EmployeeFormFacade , private router: Router) {}

  get form() {
    return this.fs.form;
  }

  goToStep(step: number): void {
    if (!this.sequence.includes(step)) return;
    this.current = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  next(): void {
    const seq = this.sequence;
    this.goToStep(seq[seq.indexOf(this.current) + 1]);
  }
  prev(): void {
    const seq = this.sequence;
    this.goToStep(seq[seq.indexOf(this.current) - 1]);
  }

  cancel(): void {
    this.router.navigateByUrl('/employee/employee-report');
  }

  // ---- parent / child tab helpers ----
  /** 1-based position of the current step in the wizard order */
  get position(): number {
    return this.sequence.indexOf(this.current) + 1;
  }

  get progress(): number {
    return Math.round((this.position / this.total) * 100);
  }

  get activeGroup(): WizardGroup {
    return this.groups.find(g => g.steps.includes(this.current)) ?? this.groups[0];
  }

  get activeGroupTabs(): WizardTab[] {
    return this.activeGroup.steps.map(step => this.tabOf(step));
  }

  get currentTab(): WizardTab {
    return this.tabOf(this.current);
  }

  tabOf(step: number): WizardTab {
    return this.tabs.find(t => t.step === step)!;
  }

  /** a step is done when it comes before the current one in wizard order */
  isStepDone(step: number): boolean {
    return this.sequence.indexOf(step) < this.sequence.indexOf(this.current);
  }

  isGroupDone(group: WizardGroup): boolean {
    return group.steps.every(step => this.isStepDone(step));
  }

  // ---- verification stepper helpers ----
  vaStepClass(step: string): string {
    if (this.vaStatus === 'rejected') {
      if (step === 'pending') return 'is-done';
      if (step === 'rejected') return 'is-rejected';
      return '';
    }
    const idx = Math.max(0, this.vaOrder.indexOf(this.vaStatus));
    const keyIdx = this.vaOrder.indexOf(step);
    if (keyIdx === -1) return '';
    if (keyIdx < idx) return 'is-done';
    if (keyIdx === idx) return 'is-current';
    return '';
  }

  get vaProgress(): string {
    if (this.vaStatus === 'rejected') return '100%';
    const idx = Math.max(0, this.vaOrder.indexOf(this.vaStatus));
    return (idx / (this.vaOrder.length - 1)) * 100 + '%';
  }

  // ---- submit ----
  submit(): void {
    const account = this.fs.group('account');
    const { password, confirmPassword } = account.value;

    if (!password || password.length < 8) {
      account.get('password')?.markAsTouched();
      return;
    }
    if (password !== confirmPassword) {
      account.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }
    if (!this.form.get('confirmAccuracy')?.value) {
      this.form.get('confirmAccuracy')?.markAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    console.log('CREATE EMPLOYEE payload', payload);
    // TODO: this.employeeService.create(payload).subscribe(() => this.router.navigate(['/employees']));
  }

add(){

  this.OpenOffcanvas();

}


OpenOffcanvas() {
    this.OffcanvasInstance.show();
  }

  CloseOffcanvas() {
    this.OffcanvasInstance.hide();
  }
  
}
