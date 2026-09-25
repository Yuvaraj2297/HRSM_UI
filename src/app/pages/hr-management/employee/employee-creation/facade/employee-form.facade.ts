import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Option {
  label: string;
  value: string;
}

const opts = (...v: string[]): Option[] => v.map((x) => ({ label: x, value: x }));

@Injectable({ providedIn: 'root' })

export class EmployeeFormFacade {

  // ---------- dropdown option lists (feed p-select [options]) ----------
  genders = opts('Male', 'Female', 'Other');
  bloodGroups = opts('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
  jobTypes = opts('Full-time', 'Part-time', 'Contract', 'Intern');
  designations = opts('UI/UX Designer', 'Product Designer', 'iOS Developer', 'Business Analyst', 'Marketing Manager');
  branches = opts('Chennai', 'Bengaluru', 'Hyderabad');
  managers = opts('Victoria Celestie', 'Madison Andrew', 'Ryan Christopher', 'Emily Lauren');
  statuses = opts('Active', 'Inactive', 'Invited');
  employeeTypes = opts('Permanent', 'Probation', 'Contract', 'Intern');
  workLocations = opts('On-site', 'Remote', 'Hybrid');
  salaryTypes = opts('Monthly', 'Hourly', 'Daily');
  yesNo = opts('Yes', 'No');
  salaryCalendars = opts('Monthly Calendar', 'Fixed 30 Days', 'Actual Days');
  maritalStatuses = opts('Single', 'Married', 'Divorced', 'Widowed');
  idCardStatuses = opts('Issued', 'Not Issued');
  accountStatuses = opts('Active', 'Inactive');
  relievingTypes = opts('Resignation', 'Termination', 'End of Contract', 'Retirement', 'Voluntary', 'Mutual Agreement');
  // roles = opts('Employee', 'Manager', 'HR Admin', 'Finance', 'Admin');

  roles = [
  {
    label: 'Employee',
    value: 'employee'
  },
  {
    label: 'Manager',
    value: 'manager'
  },
  {
    label: 'HR Admin',
    value: 'hr_admin'
  },
  {
    label: 'Finance',
    value: 'finance'
  },
  {
    label: 'Admin',
    value: 'admin'
  }
];

  departmentList = ['HR', 'Sales', 'Marketing', 'Designer', 'Production', 'Stores', 'Tech Support', 'Finance', 'Implementation'];


  noticePeriods = [
  { label: '15 Days', value: 15 },
  { label: '30 Days', value: 30 },
  { label: '45 Days', value: 45 },
  { label: '60 Days', value: 60 },
  { label: '90 Days', value: 90 }
];

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.build();
  }

  // ---------------------------------------------------------------
  private build(): void {
    this.form = this.fb.group({
      profile: this.fb.group({
        photo: [null as File | null],
        photoPreview: [''],
        employeeCode: ['', Validators.required],
        firstName: [''],
        lastName: ['', Validators.required],
        gender: [null],
        birthday: [null as Date | null],
        age: [{ value: '', disabled: true }],
        birthplace: [''],
        presentAddress: [''],
        homeTown: [''],
        nation: [''],
        religion: [''],
        idDocType: [''],
        permanentAddress: [''],
        bloodGroup: [null],
        latitude: [''],
        longitude: [''],
        otherInfo: [''],
      }),

      emergency: this.fb.group({
        name: [''],
        phone: [''],
        bloodGroup: [null],
        relation: [''],
      }),

      job: this.fb.group({
        doj: [null as Date | null],
        experience: [''],
        jobType: [null],
        designation: [null],
        phone: ['', Validators.required],
        officialEmail: ['', [Validators.required, Validators.email]],
        personalEmail: ['', [Validators.required, Validators.email]],
        branch: [null],
        reportingTo: [null],
        status: [null],
        employeeType: [null],
        workLocation: [null],
        offerLetterDate: [null as Date | null],
        noticePeriodDays: [null as number | null],
        mobileAppIssues: [false],
        onboardingCommitment: [''],
      }),

      salary: this.fb.group({
        salaryType: [null],
        ctc: [null as number | null],
        taxCode: [''],
        hourlyRate: [null as number | null],
        pfEligible: [null],
        esiEligible: [null],
        otEligible: [null],
        uan: [''],
        esiNo: [''],
        aadhaarNo: [''],
        panNo: [''],
        pensionEligible: [null],
        salaryCalendar: [null],
      }),

      interview: this.fb.group({ round1: [''], round2: [''], round3: [''], round4: [''] }),

      welcomeKit: this.fb.array([this.welcomeKitRow()]),
      welcomeKitOthers: [''],

      social: this.fb.group({ facebook: [''], linkedin: [''], skype: [''] }),

      departments: this.fb.control<string[]>([]),
      administrator: [false],
      sendWelcomeEmail: [true],

      account: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      }),

      permissions: this.fb.group({
        role: ['Employee'],
        perms: this.fb.control<string[]>([]),
      }),

      family: this.fb.group({
        fatherName: [''],
        motherName: [''],
        contactNumber: [''],
        fatherOccupation: [''],
        motherOccupation: [''],
        otherName: [''],
        relationship: [''],
        maritalStatus: [null],
        spouseName: [''],
        children: this.fb.array([this.fb.control('')]),
        address: [''],
      }),

      education: this.fb.array([this.educationRow()]),
      experience: this.fb.array([this.experienceRow()]),
      bankAccounts: this.fb.array([this.bankRow()]),
      kyc: this.fb.array([] as FormGroup[]),

      relieving: this.fb.group({
        type: [null],
        lastWorkingDay: [null as Date | null],
        noticePeriod: [null as number | null],
        relievingDate: [{ value: null as Date | null, disabled: true }],
        letter: [null as File | null],
        reason: [''],
        assetsReturned: [false],
        accessRevoked: [false],
        knowledgeTransfer: [false],
        clearanceApproved: [false],
        exitInterview: [false],
        finalSettlement: [false],
        notes: [''],
        resignationDate:[''],
        remarks:['']
      }),

      documents: this.fb.group({
        resume: [null as File | null],
        idProof: [null as File | null],
        addressProof: [null as File | null],
        offerLetter: [null as File | null],
        custom: this.fb.array([] as FormGroup[]),
      }),

      leaveApproval: this.fb.group({
        levels: this.fb.array([this.fb.control(null)]),
        follower: [null],
      }),

      otApproval: this.fb.group({
        levels: this.fb.array([this.fb.control(null)]),
      }),

      leaveRules: this.fb.array([this.leaveRuleRow('Casual Leave'), this.leaveRuleRow('Sick Leave')]),

      confirmAccuracy: [false],
    });
  }

  // ---------------------------------------------------------------
  // row factories — used by the tabs when adding repeatable blocks
  // ---------------------------------------------------------------
  welcomeKitRow(): FormGroup {
    return this.fb.group({ idCard: [null], issuedDate: [null as Date | null] });
  }

  educationRow(): FormGroup {
    return this.fb.group({
      institutionName: [''],
      qualification: [''],
      fieldOfStudy: [''],
      fromDate: [null as Date | null],
      toDate: [null as Date | null],
      percentage: [null as number | null],
      certificate: [null as File | null],
    });
  }

  experienceRow(): FormGroup {
    return this.fb.group({
      companyName: [''],
      jobTitle: [''],
      designation: [''],
      salarySlips: [null as File | null],
      relievingLetter: [null as File | null],
      fromDate: [null as Date | null],
      toDate: [null as Date | null],
    });
  }

  bankRow(): FormGroup {
    return this.fb.group({
      accountType: ['', Validators.required],
      bankName: [''],
      accountNumber: ['', Validators.required],
      ifscCode: [''],
      branchName: [''],
      beneficiaryName: [''],
      attachment: [null as File | null],
      accountStatus: [null],
    });
  }

  kycRow(name: string, desc: string, mandatory: boolean, custom = false): FormGroup {
    return this.fb.group({ name: [name], desc: [desc], mandatory: [mandatory], custom: [custom], file: [null as File | null], fileName: [''] });
  }

  customDocRow(): FormGroup {
    return this.fb.group({ name: [''], file: [null as File | null], fileName: [''] });
  }

  leaveRuleRow(type: string): FormGroup {
    return this.fb.group({ type: [type], trainee: [false], probation: [false], confirmation: [false], days: [null as number | null] });
  }

  // handy accessors
  group(path: string): FormGroup {
    return this.form.get(path) as FormGroup;
  }
  array(path: string): FormArray {
    return this.form.get(path) as FormArray;
  }
}