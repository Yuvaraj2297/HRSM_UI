

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { EmployeeFormFacade } from '../../facade/employee-form.facade';



interface ReviewItem { k: string; v: any; }
interface ReviewSection { title: string; icon: string; items: ReviewItem[]; }

@Component({
  selector: 'app-review-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CheckboxModule],
  templateUrl: './review-tab.html',
})
export class ReviewTab {
  constructor(public fs: EmployeeFormFacade) {}

  display(v: any): string {
    if (v === null || v === undefined || v === '') return '—';
    if (v instanceof Date) return v.toLocaleDateString('en-GB');
    if (typeof v === 'boolean') return v ? 'Yes' : 'No';
    if (Array.isArray(v)) return v.length ? v.join(', ') : '—';
    return String(v);
  }

  private labelize(v: string): string {
    return v.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  get sections(): ReviewSection[] {
    const f = this.fs.form.getRawValue();

    return [
      {
        title: 'Personal Details', icon: 'bi bi-person-vcard',
        items: [
          { k: 'Employee Code', v: f.profile.employeeCode },
          { k: 'First Name', v: f.profile.firstName },
          { k: 'Last Name', v: f.profile.lastName },
          { k: 'Gender', v: f.profile.gender },
          { k: 'Birthday', v: f.profile.birthday },
          { k: 'Age', v: f.profile.age },
          { k: 'Birthplace', v: f.profile.birthplace },
          { k: 'Present address', v: f.profile.presentAddress },
          { k: 'Home town', v: f.profile.homeTown },
          { k: 'Nation', v: f.profile.nation },
          { k: 'Religion', v: f.profile.religion },
          { k: 'ID Document Type', v: f.profile.idDocType },
          { k: 'Permanent Address', v: f.profile.permanentAddress },
          { k: 'Blood Group', v: f.profile.bloodGroup },
          { k: 'Other information', v: f.profile.otherInfo },
        ],
      },
      {
        title: 'Account Password', icon: 'bi bi-key',
        items: [
          { k: 'Password', v: f.account.password ? '••••••••' : '' },
          { k: 'Confirm Password', v: f.account.confirmPassword ? '••••••••' : '' },
        ],
      },
      {
        title: 'Permissions', icon: 'bi bi-shield-lock',
        items: [
          { k: 'Role', v: f.permissions.role },
          { k: 'Selected Permissions', v: f.permissions.perms.length ? f.permissions.perms.map((p: string) => this.labelize(p)).join(', ') : 'None selected' },
        ],
      },
      {
        title: 'KYC Documents', icon: 'bi bi-patch-check',
        items: [
          { k: 'Documents', v: (f.kyc || []).map((d: any) => `${d.name}: ${d.fileName ? '✓ Uploaded' : 'No file'}`).join(', ') },
        ],
      },
      {
        title: 'Emergency Contact Details', icon: 'bi bi-telephone',
        items: [
          { k: 'Emergency Contact Name', v: f.emergency.name },
          { k: 'Emergency Contact Number', v: f.emergency.phone },
          { k: 'Emergency Contact Blood Group', v: f.emergency.bloodGroup },
          { k: 'Type of Relationship', v: f.emergency.relation },
        ],
      },
      {
        title: 'Job Details', icon: 'bi bi-briefcase',
        items: Object.entries({
          'Date of Joining': f.job.doj,
          Experience: f.job.experience,
          'Job Type': f.job.jobType,
          Designation: f.job.designation,
          Phone: f.job.phone,
          'Official Email': f.job.officialEmail,
          'Personal Email': f.job.personalEmail,
          Branch: f.job.branch,
          'Reporting To': f.job.reportingTo,
          Status: f.job.status,
          'Employee Type': f.job.employeeType,
          Worklocation: f.job.workLocation,
          'Offer Letter Date': f.job.offerLetterDate,
          'Notice Period (In Days)': f.job.noticePeriodDays,
          'Mobile App Issues': f.job.mobileAppIssues,
          'Onboarding Commitment': f.job.onboardingCommitment,
        }).map(([k, v]) => ({ k, v })),
      },
      {
        title: 'Salary Details', icon: 'bi bi-cash-stack',
        items: Object.entries({
          'Salary Type': f.salary.salaryType,
          'CTC (Annual)': f.salary.ctc,
          'Personal tax code': f.salary.taxCode,
          'Hourly Rate': f.salary.hourlyRate,
          'PF Eligible': f.salary.pfEligible,
          'ESI Eligible': f.salary.esiEligible,
          'OT Eligible': f.salary.otEligible,
          'UAN No': f.salary.uan,
          'ESI No': f.salary.esiNo,
          'Aadhaar No': f.salary.aadhaarNo,
          'PAN No': f.salary.panNo,
          'PENSION Eligible': f.salary.pensionEligible,
          'Salary Calendar': f.salary.salaryCalendar,
        }).map(([k, v]) => ({ k, v })),
      },
      {
        title: 'Relieving Request', icon: 'bi bi-box-arrow-right',
        items: [
          { k: 'Relieving Type', v: f.relieving.type },
          { k: 'Last Working Day', v: f.relieving.lastWorkingDay },
          { k: 'Notice Period (Days)', v: f.relieving.noticePeriod },
          { k: 'Relieving Date', v: f.relieving.relievingDate },
          { k: 'Reason for Relieving', v: f.relieving.reason },
          { k: 'Additional Notes', v: f.relieving.notes },
        ],
      },
      {
        title: 'Interview Feedback Consolidated', icon: 'bi bi-chat-square-text',
        items: [
          { k: 'Round 1 - CV Screening', v: f.interview.round1 },
          { k: 'Round 2 - Technical Round', v: f.interview.round2 },
          { k: 'Round 3 - HR', v: f.interview.round3 },
          { k: 'Round 4 - Salary Negotiation', v: f.interview.round4 },
        ],
      },
      {
        title: 'Welcome Kit', icon: 'bi bi-gift',
        items: [
          ...(f.welcomeKit || [])
            .filter((w: any) => w.idCard || w.issuedDate)
            .map((w: any, i: number) => ({
              k: `ID Card ${i + 1}`,
              v: `${w.idCard || ''}${w.issuedDate ? ' - ' + this.display(w.issuedDate) : ''}`,
            })),
          { k: 'Others', v: f.welcomeKitOthers },
        ],
      },
      {
        title: 'Social Media', icon: 'bi bi-share',
        items: [
          { k: 'Facebook', v: f.social.facebook },
          { k: 'Linkedin', v: f.social.linkedin },
          { k: 'Skype', v: f.social.skype },
        ],
      },
      {
        title: 'Departments & Settings', icon: 'bi bi-diagram-3',
        items: [
          { k: 'Member departments', v: f.departments },
          { k: 'Administrator', v: f.administrator },
          { k: 'Send welcome email', v: f.sendWelcomeEmail },
        ],
      },
    ];
  }
}
