import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';

import { EmployeeFormFacade } from '../../facade/employee-form.facade';

@Component({
  selector: 'app-kyc-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './kyc-tab.html',
  styleUrl: './kyc-tab.scss',
})
export class KycTab implements OnInit {
  constructor(public fs: EmployeeFormFacade) {}

  get form(): FormGroup {
    return this.fs.form;
  }

  get kyc(): FormArray {
    return this.fs.array('kyc');
  }

  ngOnInit(): void {
    /*
     * PHP KYC default documents
     *
     * Mandatory = 7
     * Optional   = 4
     */

    if (this.kyc.length > 0) {
      return;
    }

    const kycDocuments = [
      // ---------------------------------------------------
      // Mandatory Documents
      // ---------------------------------------------------

      {
        name: 'Aadhaar Card',
        desc: 'PDF, JPG, PNG',
        mandatory: true,
      },

      {
        name: 'PAN Card',
        desc: 'PDF, JPG, PNG',
        mandatory: true,
      },

      {
        name: 'New Joiner Form',
        desc: 'Signed copy',
        mandatory: true,
      },

      {
        name: 'Employee Handbook Acknowledgement',
        desc: 'Signed acknowledgement',
        mandatory: true,
      },

      {
        name: 'Application Form',
        desc: 'Filled & signed application',
        mandatory: true,
      },

      {
        name: 'CTC Acknowledgement',
        desc: 'Signed by employee',
        mandatory: true,
      },

      {
        name: 'Passport Size Photograph',
        desc: 'JPG, PNG',
        mandatory: true,
      },

      // ---------------------------------------------------
      // Optional Documents
      // ---------------------------------------------------

      {
        name: 'Driving License',
        desc: 'If applicable',
        mandatory: false,
      },

      {
        name: 'Passport',
        desc: 'If applicable',
        mandatory: false,
      },

      {
        name: 'Roles & Responsibilities Acknowledgement',
        desc: 'Signed by employee',
        mandatory: false,
      },

      {
        name: 'Id card',
        desc: 'PDF, JPG, PNG',
        mandatory: false,
      },
    ];

    kycDocuments.forEach((document) => {
      this.kyc.push(this.fs.kycRow(document.name, document.desc, document.mandatory, false));
    });
  }

  // ---------------------------------------------------
  // Mandatory document count
  // ---------------------------------------------------

  get totalMandatory(): number {
    return this.kyc.controls.filter((control) => control.value.mandatory === true).length;
  }

  // ---------------------------------------------------
  // Uploaded mandatory document count
  // ---------------------------------------------------

  get uploadedMandatory(): number {
    return this.kyc.controls.filter(
      (control) => control.value.mandatory === true && !!control.value.fileName,
    ).length;
  }

  // ---------------------------------------------------
  // Progress percentage
  // ---------------------------------------------------

  get progress(): number {
    if (this.totalMandatory === 0) {
      return 0;
    }

    return (this.uploadedMandatory / this.totalMandatory) * 100;
  }

  // ---------------------------------------------------
  // File upload
  // ---------------------------------------------------

  onFile(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0] ?? null;

    if (!file) {
      return;
    }

    this.kyc.at(index).patchValue({
      file: file,
      fileName: file.name,
    });

    this.kyc.at(index).markAsDirty();
    this.kyc.at(index).markAsTouched();
  }

  // ---------------------------------------------------
  // Remove uploaded file / custom document
  // ---------------------------------------------------

  removeOrClear(index: number): void {
    const row = this.kyc.at(index);

    // Custom document → remove complete row
    if (row.value.custom === true) {
      this.kyc.removeAt(index);
      return;
    }

    // Default document → only clear uploaded file
    row.patchValue({
      file: null,
      fileName: '',
    });
  }

  // ---------------------------------------------------
  // Add custom document
  // ---------------------------------------------------

  addCustom(): void {
    this.kyc.push(this.fs.kycRow('', '', false, true));
  }
}
