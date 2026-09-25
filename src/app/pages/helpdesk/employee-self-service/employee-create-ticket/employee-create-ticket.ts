import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { Breadcrumb } from '../../../../shared/breadcrumb/breadcrumb';
import {
  EmployeeTicketService,
  TicketCategory,
  EmployeeTicket
} from '../../../../services/employee-ticket.service';

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-employee-create-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SelectModule, Breadcrumb],
  templateUrl: './employee-create-ticket.html',
  styleUrl: './employee-create-ticket.scss',
})
export class EmployeeCreateTicket implements OnInit {
  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;
  @ViewChild('subInput') subInputRef?: ElementRef<HTMLInputElement>;

  categories: TicketCategory[] = [];
  selectedCategory: TicketCategory | null = null;

  subCategoryOptions: SelectOption[] = [];
  selectedSubCategory: string = '';

  readonly priorities: Array<'Low' | 'Medium' | 'High' | 'Urgent'> = [
    'Low',
    'Medium',
    'High',
    'Urgent'
  ];
  selectedPriority: 'Low' | 'Medium' | 'High' | 'Urgent' = 'Medium';

  readonly contactOptions: SelectOption[] = [
    { label: 'Email', value: 'Email' },
    { label: 'Phone', value: 'Phone' },
    { label: 'In Person', value: 'In Person' },
    { label: 'Teams / Chat', value: 'Teams / Chat' }
  ];
  preferredContact: string = 'Email';

  subject: string = '';
  description: string = '';

  selectedFile: { name: string; sizeText: string } | null = null;

  // Validation
  categoryError = false;
  subCategoryError = false;
  subjectError = false;
  descriptionError = false;
  isSubmitted = false;

  // Status
  isSubmitting = false;
  isSuccess = false;
  createdTicket: EmployeeTicket | null = null;

  // Custom Category modal
  isCustomCategoryModalOpen = false;
  ccatEditingId: string | null = null;
  ccatSelectedIcon: string | null = null;
  ccatName: string = '';
  ccatSubs: string[] = [];
  ccatSubInputText: string = '';
  isIconDropdownOpen = false;
  ccatIconError = false;
  ccatNameError = '';
  ccatSubError = false;

  readonly ccatIcons: string[] = [
    '📌', '🛠️', '⚖️', '🎓', '🚗', '📦', '🧾', '🔐',
    '🩺', '✈️', '🎯', '🧪', '📊', '🗂️', '🤝', '📞'
  ];

  constructor(
    public ticketService: EmployeeTicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categories = this.ticketService.getCategories();
  }

  get currentSla() {
    return this.ticketService.slaMatrix[this.selectedPriority];
  }

  selectCategory(cat: TicketCategory): void {
    this.selectedCategory = cat;
    this.categoryError = false;

    this.subCategoryOptions = cat.subCategories.map(s => ({
      label: s,
      value: s
    }));
    this.selectedSubCategory = '';
    this.subCategoryError = false;

    if (cat.suggestedPriority) {
      this.selectedPriority = cat.suggestedPriority;
    }
  }

  setPriority(prio: 'Low' | 'Medium' | 'High' | 'Urgent'): void {
    this.selectedPriority = prio;
  }

  triggerFileInput(): void {
    this.fileInputRef?.nativeElement.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File is larger than 5 MB. Please choose a smaller file.');
        input.value = '';
        return;
      }
      this.selectedFile = {
        name: file.name,
        sizeText: (file.size / 1024).toFixed(1) + ' KB'
      };
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.categoryError = !this.selectedCategory;
    this.subCategoryError = !this.selectedSubCategory;
    this.subjectError = !this.subject.trim();
    this.descriptionError = this.description.trim().length < 10;

    if (
      this.categoryError ||
      this.subCategoryError ||
      this.subjectError ||
      this.descriptionError
    ) {
      return;
    }

    this.isSubmitting = true;

    setTimeout(() => {
      this.createdTicket = this.ticketService.createTicket({
        category: this.selectedCategory!.name,
        categoryIcon: this.selectedCategory!.icon,
        subCategory: this.selectedSubCategory,
        subject: this.subject.trim(),
        description: this.description.trim(),
        priority: this.selectedPriority,
        attachment: this.selectedFile ? this.selectedFile.name : null,
        preferredContact: this.preferredContact
      });

      this.isSubmitting = false;
      this.isSuccess = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  }

  createAnother(): void {
    this.isSuccess = false;
    this.createdTicket = null;
    this.selectedCategory = null;
    this.subCategoryOptions = [];
    this.selectedSubCategory = '';
    this.selectedPriority = 'Medium';
    this.preferredContact = 'Email';
    this.subject = '';
    this.description = '';
    this.selectedFile = null;
    this.categoryError = false;
    this.subCategoryError = false;
    this.subjectError = false;
    this.descriptionError = false;
    this.isSubmitted = false;

    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  /* ================= Custom Category Modal ================= */
  openCustomCategoryModal(cat?: TicketCategory | null): void {
    this.ccatEditingId = cat ? cat.id : null;
    this.ccatSelectedIcon = cat ? cat.icon : null;
    this.ccatName = cat ? cat.name : '';
    this.ccatSubs = cat ? [...cat.subCategories] : [];
    this.ccatSubInputText = '';
    this.isIconDropdownOpen = false;
    this.ccatIconError = false;
    this.ccatNameError = '';
    this.ccatSubError = false;
    this.isCustomCategoryModalOpen = true;
  }

  closeCustomCategoryModal(): void {
    this.isCustomCategoryModalOpen = false;
    this.isIconDropdownOpen = false;
  }

  toggleIconDropdown(): void {
    this.isIconDropdownOpen = !this.isIconDropdownOpen;
  }

  selectIcon(icon: string): void {
    this.ccatSelectedIcon = icon;
    this.isIconDropdownOpen = false;
    this.ccatIconError = false;
  }

  addCcatSub(): void {
    const raw = this.ccatSubInputText.trim();
    if (!raw) return;

    raw.split(',').forEach(part => {
      const v = part.trim();
      if (v && !this.ccatSubs.some(s => s.toLowerCase() === v.toLowerCase())) {
        this.ccatSubs.push(v);
      }
    });

    this.ccatSubInputText = '';
    this.ccatSubError = false;
  }

  onCcatSubKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addCcatSub();
    } else if (event.key === 'Backspace' && !this.ccatSubInputText && this.ccatSubs.length) {
      this.ccatSubs.pop();
    }
  }

  removeCcatSub(index: number): void {
    this.ccatSubs.splice(index, 1);
  }

  saveCustomCategory(): void {
    const name = this.ccatName.trim();
    this.ccatIconError = !this.ccatSelectedIcon;
    this.ccatNameError = !name ? 'Category name is required' : '';
    this.ccatSubError = !this.ccatSubs.length;

    if (this.ccatIconError || this.ccatNameError || this.ccatSubError) {
      return;
    }

    let savedCat: TicketCategory | null = null;
    if (this.ccatEditingId) {
      savedCat = this.ticketService.updateCategory(this.ccatEditingId, {
        icon: this.ccatSelectedIcon!,
        name,
        subCategories: this.ccatSubs
      });
    } else {
      savedCat = this.ticketService.addCategory({
        icon: this.ccatSelectedIcon!,
        name,
        subCategories: this.ccatSubs
      });
    }

    if (!savedCat) {
      this.ccatNameError = 'A category with this name already exists';
      return;
    }

    this.loadCategories();
    this.selectCategory(savedCat);
    this.closeCustomCategoryModal();
  }

  deleteCategory(cat: TicketCategory, event: Event): void {
    event.stopPropagation();
    const confirmed = confirm(
      `Delete category "${cat.name}"?\n\nExisting tickets keep their category name, but it cannot be picked for new tickets.`
    );
    if (!confirmed) return;

    this.ticketService.removeCategory(cat.id);
    this.loadCategories();

    if (this.selectedCategory?.id === cat.id) {
      this.selectedCategory = null;
      this.subCategoryOptions = [];
      this.selectedSubCategory = '';
    }
  }

  editCategory(cat: TicketCategory, event: Event): void {
    event.stopPropagation();
    this.openCustomCategoryModal(cat);
  }
}
