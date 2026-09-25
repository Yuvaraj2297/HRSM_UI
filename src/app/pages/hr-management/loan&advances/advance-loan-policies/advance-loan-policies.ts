import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
  PrimeTableActions
} from '../../../../shared/primedatatable/primedatatable';

export interface LoanPolicyScheme {
  id: number;
  sno?: number;
  name: string;
  category: 'Loan' | 'Advance';
  interestRate: number;
  interestRateFormatted: string;
  maxLimit: string;
  maxTenure: number;
  maxTenureFormatted: string;
  eligibility: string;
  status: 'Enable' | 'Disable';
}

@Component({
  selector: 'app-advance-loan-policies',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule, PrimeDataTable],
  templateUrl: './advance-loan-policies.html',
  styleUrl: './advance-loan-policies.scss',
})
export class AdvanceLoanPolicies implements OnInit {
  // Table header & config
  tableHeader: PrimeTableHeader = {
    title: 'Loan & Advance Policies Master',
    subtitle: 'Configure scheme eligibility, interest rates, tenure, and limits',
    icon: 'bi bi-sliders'
  };

  searchPlaceholder = 'Search loan policy...';

  tableActions: PrimeTableActions = {
    add: true,
    edit: true,
    delete: true,
    addLabel: 'Add Policy Scheme',
    addIcon: 'bi bi-plus-lg'
  };

  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.NO', width: '70px', sortable: false },
    { field: 'name', header: 'POLICY SCHEME NAME', width: '250px', sortable: true },
    { field: 'category', header: 'CATEGORY', width: '130px', sortable: true },
    { field: 'interestRateFormatted', header: 'INTEREST RATE (P.A.)', width: '170px', sortable: true },
    { field: 'maxLimit', header: 'MAX LIMIT', width: '160px', sortable: true },
    { field: 'maxTenureFormatted', header: 'MAX TENURE', width: '130px', sortable: true },
    { field: 'eligibility', header: 'ELIGIBILITY CRITERIA', width: '190px', sortable: true },
    { field: 'status', header: 'STATUS', width: '110px', sortable: true, type: 'status' },
    { field: 'action', header: 'ACTION', width: '110px', sortable: false, type: 'actions' },
  ];

  // Dummy Dataset from PHP loan-type.php
  policies: LoanPolicyScheme[] = [
    {
      id: 1,
      sno: 1,
      name: 'Personal Emergency Loan',
      category: 'Loan',
      interestRate: 0.0,
      interestRateFormatted: '0.00%',
      maxLimit: '₹1,50,000',
      maxTenure: 12,
      maxTenureFormatted: '12 Months',
      eligibility: 'Min 6 Mos Service',
      status: 'Enable'
    },
    {
      id: 2,
      sno: 2,
      name: 'Salary Advance',
      category: 'Advance',
      interestRate: 0.0,
      interestRateFormatted: '0.00%',
      maxLimit: '50% Net Salary',
      maxTenure: 3,
      maxTenureFormatted: '3 Months',
      eligibility: 'Min 3 Mos Service',
      status: 'Enable'
    },
    {
      id: 3,
      sno: 3,
      name: 'Medical Assistance Scheme',
      category: 'Loan',
      interestRate: 0.0,
      interestRateFormatted: '0.00%',
      maxLimit: '₹3,00,000',
      maxTenure: 24,
      maxTenureFormatted: '24 Months',
      eligibility: 'All Confirmed Staff',
      status: 'Enable'
    },
    {
      id: 4,
      sno: 4,
      name: 'Higher Education & Certification Support',
      category: 'Loan',
      interestRate: 4.5,
      interestRateFormatted: '4.50%',
      maxLimit: '₹2,00,000',
      maxTenure: 18,
      maxTenureFormatted: '18 Months',
      eligibility: 'Min 1 Year Service',
      status: 'Enable'
    },
    {
      id: 5,
      sno: 5,
      name: 'Vehicle Purchase Assistance',
      category: 'Loan',
      interestRate: 6.0,
      interestRateFormatted: '6.00%',
      maxLimit: '₹4,00,000',
      maxTenure: 36,
      maxTenureFormatted: '36 Months',
      eligibility: 'Min 2 Years Service',
      status: 'Disable'
    }
  ];

  // Modal State
  modalOpen = false;
  isEditMode = false;
  editingId: number | null = null;

  // Delete Confirmation Modal State
  deleteModalOpen = false;
  deletingPolicy: LoanPolicyScheme | null = null;

  // Options for p-select
  categoryOptions = [
    { label: 'Company Term Loan (Multi-Month EMI)', value: 'Loan' },
    { label: 'Salary Advance (Short Term Payroll Recovery)', value: 'Advance' },
  ];

  eligibilityOptions = [
    { label: 'Immediately on Joining', value: 'Immediately on Joining' },
    { label: 'After Probation (3-6 Months)', value: 'Min 6 Mos Service' },
    { label: 'Min 3 Mos Service', value: 'Min 3 Mos Service' },
    { label: 'All Confirmed Staff', value: 'All Confirmed Staff' },
    { label: 'Minimum 1 Year', value: 'Min 1 Year Service' },
    { label: 'Minimum 2 Years', value: 'Min 2 Years Service' },
  ];

  statusOptions = [
    { label: 'Enable', value: 'Enable' },
    { label: 'Disable', value: 'Disable' },
  ];

  // Reactive Form
  policyForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl<'Loan' | 'Advance'>('Loan', { nonNullable: true, validators: [Validators.required] }),
    interestRate: new FormControl<number>(0.0, { nonNullable: true }),
    maxLimit: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    maxTenure: new FormControl<number>(12, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    eligibility: new FormControl<string>('Min 6 Mos Service', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<'Enable' | 'Disable'>('Enable', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.refreshTableData();
  }

  refreshTableData(): void {
    this.policies = this.policies.map((p, index) => ({
      ...p,
      sno: index + 1
    }));
  }

  // Open Create Modal
  openCreateModal(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.policyForm.reset({
      name: '',
      category: 'Loan',
      interestRate: 0.0,
      maxLimit: '',
      maxTenure: 12,
      eligibility: 'Min 6 Mos Service',
      status: 'Enable'
    });
    this.modalOpen = true;
  }

  // Open Edit Modal
  editPolicy(row: LoanPolicyScheme): void {
    this.isEditMode = true;
    this.editingId = row.id;
    this.policyForm.setValue({
      name: row.name,
      category: row.category,
      interestRate: row.interestRate,
      maxLimit: row.maxLimit,
      maxTenure: row.maxTenure,
      eligibility: row.eligibility,
      status: row.status
    });
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.editingId = null;
  }

  savePolicy(): void {
    if (this.policyForm.invalid) {
      this.policyForm.markAllAsTouched();
      return;
    }

    const formVal = this.policyForm.getRawValue();
    const rateFormatted = `${Number(formVal.interestRate).toFixed(2)}%`;
    const tenureFormatted = `${formVal.maxTenure} Months`;

    if (this.isEditMode && this.editingId !== null) {
      // Update existing
      const index = this.policies.findIndex(p => p.id === this.editingId);
      if (index !== -1) {
        this.policies[index] = {
          ...this.policies[index],
          name: formVal.name,
          category: formVal.category,
          interestRate: formVal.interestRate,
          interestRateFormatted: rateFormatted,
          maxLimit: formVal.maxLimit,
          maxTenure: formVal.maxTenure,
          maxTenureFormatted: tenureFormatted,
          eligibility: formVal.eligibility,
          status: formVal.status
        };
      }
    } else {
      // Add new
      const nextId = this.policies.length > 0 ? Math.max(...this.policies.map(p => p.id)) + 1 : 1;
      const newScheme: LoanPolicyScheme = {
        id: nextId,
        sno: this.policies.length + 1,
        name: formVal.name,
        category: formVal.category,
        interestRate: formVal.interestRate,
        interestRateFormatted: rateFormatted,
        maxLimit: formVal.maxLimit,
        maxTenure: formVal.maxTenure,
        maxTenureFormatted: tenureFormatted,
        eligibility: formVal.eligibility,
        status: formVal.status
      };
      this.policies.push(newScheme);
    }

    this.refreshTableData();
    this.closeModal();
  }

  toggleStatus(row: LoanPolicyScheme): void {
    row.status = row.status === 'Enable' ? 'Disable' : 'Enable';
  }

  confirmDelete(row: LoanPolicyScheme): void {
    this.deletingPolicy = row;
    this.deleteModalOpen = true;
  }

  deleteConfirmed(): void {
    if (this.deletingPolicy) {
      this.policies = this.policies.filter(p => p.id !== this.deletingPolicy!.id);
      this.refreshTableData();
    }
    this.closeDeleteModal();
  }

  closeDeleteModal(): void {
    this.deleteModalOpen = false;
    this.deletingPolicy = null;
  }

  onTableAction(event: { action: string; row: LoanPolicyScheme }): void {
    if (event.action === 'edit') {
      this.editPolicy(event.row);
    } else if (event.action === 'delete') {
      this.confirmDelete(event.row);
    }
  }
}
