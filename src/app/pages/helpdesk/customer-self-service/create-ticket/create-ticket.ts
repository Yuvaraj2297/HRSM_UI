import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  CustomerTicketService,
  TicketProject,
  TicketIssueType,
  CustomerTicket
} from '../../../../services/customer-ticket.service';
import { CalendarDatepickerDirective } from '../../../../common/directives/datepicker';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CalendarDatepickerDirective],
  templateUrl: './create-ticket.html',
  styleUrl: './create-ticket.scss',
})
export class CreateTicket implements OnInit {
  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  projects: TicketProject[] = [];
  issueTypes: TicketIssueType[] = [];

  selectedProject: TicketProject | null = null;
  selectedIssue: TicketIssueType | null = null;
  selectedPriority: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';

  slaHintText: string | null = null;
  fileName: string | null = null;

  showProjectError = false;
  showIssueError = false;
  isSubmitted = false;

  showSuccess = false;
  createdTicket: CustomerTicket | null = null;

  ticketForm = new FormGroup({
    subject: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)]
    }),
    contactPerson: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)]
    }),
    phone: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[0-9]{10}$/)]
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    expectedDate: new FormControl<string>('', { nonNullable: true })
  });

  readonly priorities: Array<'Low' | 'Medium' | 'High' | 'Critical'> = [
    'Low',
    'Medium',
    'High',
    'Critical'
  ];

  constructor(
    private ticketService: CustomerTicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projects = this.ticketService.getProjects();
    this.issueTypes = this.ticketService.issueTypes;

    // Prefill contact person with logged in customer
    const user = this.ticketService.currentCustomer();
    this.ticketForm.controls.contactPerson.setValue(user.name);
  }

  get sideSlaList(): TicketIssueType[] {
    return this.issueTypes.slice(0, 6);
  }

  selectProject(proj: TicketProject): void {
    this.selectedProject = proj;
    this.showProjectError = false;
    this.updateSlaHint();
  }

  selectIssue(issue: TicketIssueType): void {
    this.selectedIssue = issue;
    this.showIssueError = false;
    this.updateSlaHint();
  }

  selectPriority(prio: 'Low' | 'Medium' | 'High' | 'Critical'): void {
    this.selectedPriority = prio;
    this.updateSlaHint();
  }

  updateSlaHint(): void {
    if (!this.selectedIssue) {
      this.slaHintText = null;
      return;
    }
    this.slaHintText = this.ticketService.calculateSla(
      this.selectedIssue.id,
      this.selectedPriority
    );
  }

  triggerFileInput(): void {
    this.fileInputRef?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.fileName = target.files[0].name;
    }
  }

  clearFile(): void {
    this.fileName = null;
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '').slice(0, 10);
    this.ticketForm.controls.phone.setValue(digitsOnly, { emitEvent: false });
    input.value = digitsOnly;
  }

  onSubmit(): void {
    this.isSubmitted = true;

    this.showProjectError = !this.selectedProject;
    this.showIssueError = !this.selectedIssue;

    if (this.showProjectError || this.showIssueError || this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    const formValues = this.ticketForm.getRawValue();

    let formattedExpectedDate: string | null = null;
    if (formValues.expectedDate) {
      const parts = formValues.expectedDate.split('-');
      if (parts.length === 3) {
        formattedExpectedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    this.createdTicket = this.ticketService.createTicket({
      projectId: this.selectedProject!.id,
      projectName: this.selectedProject!.name,
      issueType: this.selectedIssue!.name,
      priority: this.selectedPriority,
      subject: formValues.subject.trim(),
      description: formValues.description.trim(),
      contactPerson: formValues.contactPerson.trim(),
      contactPhone: formValues.phone.trim(),
      expectedDate: formattedExpectedDate,
      attachment: this.fileName
    });

    this.showSuccess = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  createAnother(): void {
    this.ticketForm.reset();
    const user = this.ticketService.currentCustomer();
    this.ticketForm.controls.contactPerson.setValue(user.name);

    this.selectedProject = null;
    this.selectedIssue = null;
    this.selectedPriority = 'Medium';
    this.fileName = null;
    this.slaHintText = null;
    this.showProjectError = false;
    this.showIssueError = false;
    this.isSubmitted = false;
    this.showSuccess = false;
    this.createdTicket = null;

    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  viewMyTickets(): void {
    this.router.navigate(['/helpdesk/my-tickets']);
  }
}
