import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableRowAction,
} from '../../../../shared/primedatatable/primedatatable';
import {
  ModalField,
  ModalSaveEvent,
  ReuseModal,
} from '../../../../shared/reuse-model/reuse-model';
import { GenerateOfferEvent, GenerateOfferModal, OfferCandidateOption } from './generat offer/generate-offer-modal';

// =============================================================
// MODELS
// =============================================================
export interface OfferRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  job: string;
  dept: string;
  ctc: string;
  gross: string;
  basic: string;
  hra: string;
  allowance: string;
  joining: string;
  expiry: string;
  ref: string;
  approvalState: string;
  status: 'Accepted' | 'Sent to Candidate' | 'Awaiting Candidate' | 'Draft' | 'Declined';
  notes?: string;
}

interface CandidateOption {
  name: string;
  email: string;
  job: string;
  ctc: number;
}

const STORAGE_KEY = 'offer_letters_v2';

// =============================================================
// COMPONENT
// =============================================================
@Component({
  selector: 'app-offer-management',
  standalone: true,
  imports: [CommonModule, PrimeDataTable, ReuseModal, GenerateOfferModal],
  templateUrl: './offer-letter.html',
  styleUrl: './offer-letter.scss',
})
export class OfferManagement{
  @ViewChild('generateOfferModal') generateOfferModal!: GenerateOfferModal;
  @ViewChild('sendOfferModal') sendOfferModal!: ReuseModal;

  // =========================================================
  // TABLE CONFIG
  // =========================================================

  modalHeader = {
    title: 'Job Offer Letters & Approvals',
    icon: 'ti ti-file-check',
    subtitle: 'Recruitment / Offer Letters',
  };

  Accessactions = {
    add: true,
    addLabel: 'Generate Offer Letter',
    addIcon: 'ti ti-file-plus',
  };

  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', width: '64px' },
    { field: 'name', header: 'Candidate Name', type: 'employee', sortable: true },
    { field: 'job', header: 'Offered Designation', sortable: true },
    { field: 'dept', header: 'Department', sortable: true },
    { field: 'ctc', header: 'Offered CTC', sortable: true },
    { field: 'gross', header: 'Monthly Gross' },
    { field: 'joining', header: 'Target Joining', sortable: true },
    { field: 'approvalState', header: 'Approval State' },
    { field: 'status', header: 'Offer Status', type: 'custom' },
    { field: 'actions', header: 'Action', type: 'actions', width: '170px' },
  ];

  rowActions: PrimeTableRowAction[] = [
    { key: 'view-pdf', label: 'View Offer PDF', icon: 'ti ti-file-text' },
    { key: 'send', label: 'Send via WhatsApp / Email', icon: 'ti ti-send' },
    {
      key: 'onboard',
      label: 'Onboard to Employee Master',
      icon: 'ti ti-user-plus',
      hiddenWhen: (row: OfferRow) => row.status !== 'Accepted',
    },
  ];

  // =========================================================
  // DATA
  // =========================================================

  data: OfferRow[] = [
    {
      id: 1,
      name: 'Kavitha Raman',
      email: 'kavitha.r@example.com',
      phone: '+91 98401 23456',
      job: 'Senior UI/UX Designer',
      dept: 'UI/UX Design Team',
      ctc: '₹16,50,000 / yr',
      gross: '₹1,37,500 / mo',
      basic: '₹68,750',
      hra: '₹34,375',
      allowance: '₹34,375',
      joining: '15-Mar-2026',
      expiry: '10-Mar-2026',
      ref: 'GHR/2026/OFF-101',
      approvalState: 'Approved (HR & CFO)',
      status: 'Accepted',
    },
    {
      id: 2,
      name: 'Rahul Verma',
      email: 'rahul.v@example.com',
      phone: '+91 98765 43210',
      job: 'Lead Backend Engineer',
      dept: 'Backend Engineering Team',
      ctc: '₹26,00,000 / yr',
      gross: '₹2,16,666 / mo',
      basic: '₹1,08,333',
      hra: '₹54,166',
      allowance: '₹54,167',
      joining: '01-Apr-2026',
      expiry: '25-Mar-2026',
      ref: 'GHR/2026/OFF-102',
      approvalState: 'Approved (HR & CEO)',
      status: 'Accepted',
    },
    {
      id: 3,
      name: 'Arun Kumar',
      email: 'arun.k@example.com',
      phone: '+91 97890 12345',
      job: 'Senior Backend Developer',
      dept: 'Backend Engineering Team',
      ctc: '₹22,00,000 / yr',
      gross: '₹1,83,333 / mo',
      basic: '₹91,666',
      hra: '₹45,833',
      allowance: '₹45,834',
      joining: '10-Apr-2026',
      expiry: '30-Mar-2026',
      ref: 'GHR/2026/OFF-103',
      approvalState: 'Approved (HR Head)',
      status: 'Awaiting Candidate',
    },
    {
      id: 4,
      name: 'Ananya Sundaram',
      email: 'ananya.s@example.com',
      phone: '+91 98402 11223',
      job: 'Senior UI/UX Designer',
      dept: 'UI/UX Design Team',
      ctc: '₹18,00,000 / yr',
      gross: '₹1,50,000 / mo',
      basic: '₹75,000',
      hra: '₹37,500',
      allowance: '₹37,500',
      joining: '20-Mar-2026',
      expiry: '15-Mar-2026',
      ref: 'GHR/2026/OFF-104',
      approvalState: 'Approved (HR & CFO)',
      status: 'Awaiting Candidate',
    },
  ];

  // =========================================================
  // GENERATE OFFER MODAL  (bespoke component — see generate-offer-modal.*)
  // =========================================================

  candidateOptions: OfferCandidateOption[] = [
    { name: 'Ananya Sundaram', email: 'ananya.s@example.com', job: 'Senior UI/UX Designer', ctc: 1800000, tlScore: 8.8 },
    { name: 'Siddharth Nair', email: 'sid.nair@example.com', job: 'iOS App Developer', ctc: 1400000, tlScore: 7.5 },
    { name: 'Arun Kumar', email: 'arun.k@example.com', job: 'Senior Backend Developer', ctc: 2200000, tlScore: 9.0 },
    { name: 'Vikramaditya Rao', email: 'vikram.rao@example.com', job: 'Lead Backend Engineer', ctc: 2600000, tlScore: 9.5 },
  ];

  onAddClicked(): void {
    this.generateOfferModal.open();
  }

  onOfferGenerated(event: GenerateOfferEvent): void {
    const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

    const newRow: OfferRow = {
      id: this.data.length + 1,
      name: event.candidate,
      email: event.email,
      phone: '',
      job: event.jobTitle,
      dept: event.department,
      ctc: `${inr(event.annualCtc)} / yr`,
      gross: `${inr(event.monthlyGross)} / mo`,
      basic: inr(event.basic),
      hra: inr(event.hra),
      allowance: inr(event.special),
      joining: event.joiningDate,
      expiry: event.expiryDate,
      ref: `GHR/2026/OFF-${105 + this.data.length}`,
      approvalState: event.approver || 'HR Manager Draft',
      status: 'Sent to Candidate',
    };

    this.data = [newRow, ...this.data];
  }

  // =========================================================
  // SEND OFFER MODAL  (still the generic reuse-modal — simple fields only)
  // =========================================================

  sendFields: ModalField[] = [
    { key: 'phone', label: 'WhatsApp Phone Number', type: 'tel', col: 6 },
    { key: 'emailAddr', label: 'Candidate Email Address', type: 'email', col: 6 },
    { key: 'subject', label: 'Email Subject', type: 'text', col: 12 },
    { key: 'message', label: 'Message', type: 'textarea', rows: 5, col: 12 },
  ];

  private sendTarget: OfferRow | null = null;

  onSendOfferSaved(event: ModalSaveEvent): void {
    // Wire up actual WhatsApp / mailto dispatch here using event.values + this.sendTarget
    console.log('Dispatch offer to', this.sendTarget?.name, event.values);
  }

  // =========================================================
  // TABLE EVENT HANDLERS
  // =========================================================

  onAction(event: { action: string; row: OfferRow }): void {
    const { action, row } = event;

    switch (action) {
      case 'view-pdf':
        console.log('View offer PDF for', row.ref);
        break;
      case 'send':
        this.sendTarget = row;
        this.sendOfferModal.open('add', { phone: row.phone, emailAddr: row.email });
        break;
      case 'onboard':
        console.log('Onboard candidate', row.name);
        break;
    }
  }

  statusClass(status: OfferRow['status']): string {
    switch (status) {
      case 'Accepted':
        return 'offer-accepted';
      case 'Awaiting Candidate':
      case 'Sent to Candidate':
        return 'offer-pending';
      case 'Declined':
        return 'offer-declined';
      default:
        return 'offer-draft';
    }
  }
}