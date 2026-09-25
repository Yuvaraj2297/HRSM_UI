import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

declare var bootstrap: any;

export interface OfferCandidateOption {
  name: string;
  email: string;
  job: string;
  ctc: number;
  tlScore?: number;
}

export interface GenerateOfferEvent {
  candidate: string;
  email: string;
  jobTitle: string;
  department: string;
  annualCtc: number;
  monthlyGross: number;
  basic: number;
  hra: number;
  special: number;
  joiningDate: string;
  expiryDate: string;
  approver: string;
  notes: string;
}

@Component({
  selector: 'app-generate-offer-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './generate-offer-modal.html',
  styleUrl: './generate-offer-modal.scss',
})
export class GenerateOfferModal implements AfterViewInit {
  @Input() candidates: OfferCandidateOption[] = [];
  @Input() departments: string[] = [
    'UI/UX Design Department',
    'Backend Engineering Department',
    'Mobile Engineering Department',
    'HR & Talent Acquisition',
    'Finance & Accounts',
  ];
  @Input() approvers: { label: string; value: string }[] = [
    { label: 'HR Head & CFO Approval', value: 'Approved (HR Head & CFO)' },
    { label: 'MD & CEO Approval', value: 'Approved (MD & CEO)' },
    { label: 'HR Manager Draft Only', value: 'HR Manager Draft' },
  ];

  @Output() generated = new EventEmitter<GenerateOfferEvent>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild('modalRoot') modalRoot!: ElementRef;
  private modalInstance: any;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      candidate: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      jobTitle: ['', Validators.required],
      department: [null, Validators.required],
      annualCtc: [null, [Validators.required, Validators.min(1)]],
      joiningDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      approver: [this.approvers[0]?.value ?? ''],
      notes: [''],
    });

    // Candidate dropdown auto-fill — mirrors the PHP `change` handler
    this.form.get('candidate')!.valueChanges.subscribe((name: string) => {
      const match = this.candidates.find((c) => c.name === name);
      if (!match) return;

      this.form.patchValue(
        { email: match.email, jobTitle: match.job, annualCtc: match.ctc },
        { emitEvent: false },
      );
    });
  }

  ngAfterViewInit(): void {
    this.modalInstance = bootstrap.Modal.getOrCreateInstance(this.modalRoot.nativeElement, {
      backdrop: 'static',
      keyboard: false,
    });

    this.modalRoot.nativeElement.addEventListener('hidden.bs.modal', () => this.resetForm());
  }

  // =========================================================
  // LIVE CTC BREAKDOWN  (50 / 25 / 25 split, same as the PHP)
  // =========================================================

  get annualCtc(): number {
    return Number(this.form.get('annualCtc')?.value) || 0;
  }

  get monthlyGross(): number {
    return Math.round(this.annualCtc / 12);
  }

  get basic(): number {
    return Math.round(this.monthlyGross * 0.5);
  }

  get hra(): number {
    return Math.round(this.monthlyGross * 0.25);
  }

  get special(): number {
    return this.monthlyGross - this.basic - this.hra;
  }

  inr(n: number): string {
    return `₹${(n || 0).toLocaleString('en-IN')}`;
  }

  // =========================================================
  // PUBLIC API
  // =========================================================

  open(): void {
    this.resetForm();
    this.modalInstance?.show();
  }

  close(): void {
    this.modalInstance?.hide();
  }

  private resetForm(): void {
    this.form.reset({ approver: this.approvers[0]?.value ?? '' });
  }

  isInvalid(key: string): boolean {
    const c = this.form.get(key);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    this.generated.emit({
      candidate: v.candidate,
      email: v.email,
      jobTitle: v.jobTitle,
      department: v.department,
      annualCtc: this.annualCtc,
      monthlyGross: this.monthlyGross,
      basic: this.basic,
      hra: this.hra,
      special: this.special,
      joiningDate: v.joiningDate,
      expiryDate: v.expiryDate,
      approver: v.approver,
      notes: v.notes,
    });

    this.close();
  }

  onCancel(): void {
    this.cancelled.emit();
    this.close();
  }
}
