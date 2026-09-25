import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Breadcrumb } from '../../../../shared/breadcrumb/breadcrumb';
import { PrimeDataTable, PrimeTableColumn } from '../../../../shared/primedatatable/primedatatable';

interface ChecklistRow {
  id: number;
  sno: number;
  taskTitle: string;
  completed: boolean;

  milestonePhase:
    | 'Pre-Boarding'
    | 'Day 1 Induction'
    | 'Week 1 Milestones'
    | '30-Day Review'
    | '60-90 Day Goal';

  joiner: string;
  role: string;
  department: string;
  owner: string;
  dueDate: string;

  status: 'Completed' | 'Pending' | 'In Progress' | 'Upcoming';

  milestoneClass?: string;
  statusClass?: string;
}

@Component({
  selector: 'app-checklist',
  standalone: true,

  imports: [CommonModule, ReactiveFormsModule, SelectModule, PrimeDataTable, Breadcrumb],

  templateUrl: './checklist.html',
  styleUrl: './checklist.scss',
})
export class Checklist implements OnInit {
  // =========================================================
  // FORM
  // =========================================================

  private fb = inject(FormBuilder);

  taskForm!: FormGroup;

  // =========================================================
  // TABLE
  // =========================================================

  searchPlaceholder = 'Search employee...';

  tableData: ChecklistRow[] = [];

  private allData: ChecklistRow[] = [];

  // =========================================================
  // TABLE ACTIONS
  // =========================================================

  actions = {
    add: false,
    edit: true,
    delete: false,
  };

  // =========================================================
  // MODAL
  // =========================================================

  showTaskModal = false;

  modalType: 'add' | 'edit' = 'add';

  editingTaskId: number | null = null;

  // =========================================================
  // DROPDOWN OPTIONS
  // =========================================================

  milestoneOptions = [
    {
      label: 'Pre-Boarding',
      value: 'Pre-Boarding',
    },
    {
      label: 'Day 1 Induction',
      value: 'Day 1 Induction',
    },
    {
      label: 'Week 1 Milestones',
      value: 'Week 1 Milestones',
    },
    {
      label: '30-Day Review',
      value: '30-Day Review',
    },
    {
      label: '60-90 Day Goal',
      value: '60-90 Day Goal',
    },
  ];

  joinerOptions = [
    {
      label: 'All Joiners (Template Default)',
      value: 'All Joiners (Template Default)',
    },
    {
      label: 'Kavitha Raman (UI/UX Designer)',
      value: 'Kavitha Raman',
    },
    {
      label: 'Rahul Verma (Backend Engineer)',
      value: 'Rahul Verma',
    },
    {
      label: 'Siddharth Nair (iOS App Developer)',
      value: 'Siddharth Nair',
    },
    {
      label: 'Priya Sundaram (Financial Analyst)',
      value: 'Priya Sundaram',
    },
  ];

  statusOptions = [
    {
      label: 'Completed',
      value: 'Completed',
    },
    {
      label: 'Pending',
      value: 'Pending',
    },
    {
      label: 'In Progress',
      value: 'In Progress',
    },
    {
      label: 'Upcoming',
      value: 'Upcoming',
    },
  ];

  // =========================================================
  // TABLE COLUMNS
  // =========================================================

  columns: PrimeTableColumn[] = [
    {
      field: 'sno',
      header: 'S.No',
      type: 'text',
      sortable: true,
      width: '70px',
    },

    {
      field: 'taskTitle',
      header: 'Task Description',
      type: 'checkboxText',
      checkboxField: 'completed',
      sortable: true,
      width: '300px',
    },

    {
      field: 'milestonePhase',
      header: 'Milestone Phase',
      type: 'badge',
      sortable: true,
      width: '160px',
    },

    {
      field: 'joiner',
      header: 'Assigned Joiner',
      type: 'text',
      sortable: true,
      width: '200px',
      subField: 'role',
    },

    {
      field: 'department',
      header: 'Department',
      type: 'badge',
      sortable: true,
      width: '140px',
    },

    {
      field: 'owner',
      header: 'Assigned Joiner',
      type: 'text',
      sortable: true,
      width: '180px',
    },

    {
      field: 'dueDate',
      header: 'Due Date',
      type: 'text',
      sortable: true,
      width: '120px',
    },

    {
      field: 'status',
      header: 'Status',
      type: 'status',
      sortable: true,
      width: '130px',
    },

    // =======================================================
    // DYNAMIC EDIT ACTION
    // =======================================================

    {
      field: 'actions',
      header: 'Action',
      type: 'actions',
      width: '100px',
    },
  ];

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.initializeForm();

    this.loadChecklistData();
  }

  // =========================================================
  // FORM INITIALIZATION
  // =========================================================

  private initializeForm(): void {
    this.taskForm = this.fb.group({
      taskTitle: ['', Validators.required],

      milestonePhase: ['Pre-Boarding', Validators.required],

      taskJoiner: ['All Joiners (Template Default)'],

      taskOwner: [''],

      taskDueDate: [''],

      taskStatus: ['Pending'],
    });
  }  

  private loadChecklistData(): void {
    this.allData = [
      {
        id: 1,
        sno: 1,

        taskTitle: 'Complete Background Verification & Address Proof',

        completed: true,

        milestonePhase: 'Pre-Boarding',

        joiner: 'Kavitha Raman',

        role: 'UI/UX Designer',

        department: 'Design',

        owner: 'HR Operations',

        dueDate: '10-Mar-2026',

        status: 'Completed',
      },

      {
        id: 2,
        sno: 2,

        taskTitle: 'Issue Hardware & Work Email ID (Laptop + Access Card)',

        completed: true,

        milestonePhase: 'Day 1 Induction',

        joiner: 'Kavitha Raman',

        role: 'UI/UX Designer',

        department: 'Design',

        owner: 'IT Admin',

        dueDate: '15-Mar-2026',

        status: 'Completed',
      },

      {
        id: 3,
        sno: 3,

        taskTitle: 'Conduct HR Policy Briefing & Code of Conduct Sign-off',

        completed: false,

        milestonePhase: 'Day 1 Induction',

        joiner: 'Rahul Verma',

        role: 'Backend Engineer',

        department: 'Engineering',

        owner: 'Sarah Mitchell (HR)',

        dueDate: '01-Apr-2026',

        status: 'Pending',
      },

      {
        id: 4,
        sno: 4,

        taskTitle: 'Department Architecture Walkthrough & Buddy Pairing',

        completed: false,

        milestonePhase: 'Week 1 Milestones',

        joiner: 'Siddharth Nair',

        role: 'iOS App Developer',

        department: 'iOS Dev',

        owner: 'David Anderson (Lead)',

        dueDate: '25-Mar-2026',

        status: 'In Progress',
      },

      {
        id: 5,
        sno: 5,

        taskTitle: '30-Day Performance Review & Probation Assessment',

        completed: false,

        milestonePhase: '30-Day Review',

        joiner: 'Priya Sundaram',

        role: 'Financial Analyst',

        department: 'Finance',

        owner: 'Emily Clark (Manager)',

        dueDate: '31-Mar-2026',

        status: 'Upcoming',
      },
    ];

    this.prepareTableData();
  }  

  private prepareTableData(): void {
    this.tableData = this.allData.map((row, index) => ({
      ...row,

      sno: index + 1,

      milestoneClass: this.getMilestoneClass(row.milestonePhase),

      statusClass: this.getStatusClass(row.status),
    }));
  }

  // =========================================================
  // MILESTONE CLASS
  // =========================================================

  private getMilestoneClass(milestone: ChecklistRow['milestonePhase']): string {
    switch (milestone) {
      case 'Pre-Boarding':
        return 'milestone-preboarding';

      case 'Day 1 Induction':
        return 'milestone-day1';

      case 'Week 1 Milestones':
        return 'milestone-week1';

      case '30-Day Review':
        return 'milestone-review';

      case '60-90 Day Goal':
        return 'milestone-goal';

      default:
        return '';
    }
  }

  // =========================================================
  // STATUS CLASS
  // =========================================================

  private getStatusClass(status: ChecklistRow['status']): string {
    switch (status) {
      case 'Completed':
        return 'status-completed';

      case 'Pending':
        return 'status-pending';

      case 'In Progress':
        return 'status-progress';

      case 'Upcoming':
        return 'status-upcoming';

      default:
        return '';
    }
  }

  // =========================================================
  // ADD MODAL
  // =========================================================

  openAddModal(): void {
    this.modalType = 'add';

    this.editingTaskId = null;

    this.taskForm.reset({
      taskTitle: '',

      milestonePhase: 'Pre-Boarding',

      taskJoiner: 'All Joiners (Template Default)',

      taskOwner: '',

      taskDueDate: '',

      taskStatus: 'Pending',
    });

    this.showTaskModal = true;
  }

  // =========================================================
  // EDIT MODAL
  // =========================================================

  openEditModal(row: ChecklistRow): void {
    this.modalType = 'edit';

    this.editingTaskId = row.id;

    this.taskForm.patchValue({
      taskTitle: row.taskTitle,

      milestonePhase: row.milestonePhase,

      taskJoiner: row.joiner,

      taskOwner: row.owner,

      taskDueDate: this.toInputDate(row.dueDate),

      taskStatus: row.status,
    });

    this.showTaskModal = true;
  }

  // =========================================================
  // TABLE ACTION
  // =========================================================

  onTableAction(event: { action: string; row: ChecklistRow }): void {
    switch (event.action) {
      case 'edit':
        this.openEditModal(event.row);

        break;

      case 'delete':
        this.deleteTask(event.row);

        break;
    }
  }

  // =========================================================
  // SAVE TASK
  // =========================================================

  saveTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();

      return;
    }

    const formValue = this.taskForm.getRawValue();

    // =======================================================
    // EDIT
    // =======================================================

    if (this.modalType === 'edit' && this.editingTaskId !== null) {
      const index = this.allData.findIndex((task) => task.id === this.editingTaskId);

      if (index !== -1) {
        const existingTask = this.allData[index];

        this.allData[index] = {
          ...existingTask,

          taskTitle: formValue.taskTitle,

          milestonePhase: formValue.milestonePhase,

          joiner: formValue.taskJoiner,

          owner: formValue.taskOwner,

          dueDate: this.formatDisplayDate(formValue.taskDueDate),

          status: formValue.taskStatus,

          completed: formValue.taskStatus === 'Completed',
        };
      }
    }

    // =======================================================
    // ADD
    // =======================================================
    else {
      const newId = this.allData.length ? Math.max(...this.allData.map((task) => task.id)) + 1 : 1;

      const newTask: ChecklistRow = {
        id: newId,

        sno: this.allData.length + 1,

        taskTitle: formValue.taskTitle,

        completed: formValue.taskStatus === 'Completed',

        milestonePhase: formValue.milestonePhase,

        joiner: formValue.taskJoiner,

        role: this.getJoinerRole(formValue.taskJoiner),

        department: this.getJoinerDepartment(formValue.taskJoiner),

        owner: formValue.taskOwner,

        dueDate: this.formatDisplayDate(formValue.taskDueDate),

        status: formValue.taskStatus,
      };

      this.allData.push(newTask);
    }

    this.prepareTableData();

    this.closeModal();
  }

  // =========================================================
  // DELETE TASK
  // =========================================================

  deleteTask(row: ChecklistRow): void {
    const confirmed = window.confirm(`Are you sure you want to delete "${row.taskTitle}"?`);

    if (!confirmed) {
      return;
    }

    this.allData = this.allData.filter((task) => task.id !== row.id);

    this.allData.forEach((task, index) => {
      task.sno = index + 1;
    });

    this.prepareTableData();
  }

  // =========================================================
  // GET JOINER ROLE
  // =========================================================

  private getJoinerRole(joiner: string): string {
    switch (joiner) {
      case 'Kavitha Raman':
        return 'UI/UX Designer';

      case 'Rahul Verma':
        return 'Backend Engineer';

      case 'Siddharth Nair':
        return 'iOS App Developer';

      case 'Priya Sundaram':
        return 'Financial Analyst';

      default:
        return '';
    }
  }

  // =========================================================
  // GET JOINER DEPARTMENT
  // =========================================================

  private getJoinerDepartment(joiner: string): string {
    switch (joiner) {
      case 'Kavitha Raman':
        return 'Design';

      case 'Rahul Verma':
        return 'Engineering';

      case 'Siddharth Nair':
        return 'iOS Dev';

      case 'Priya Sundaram':
        return 'Finance';

      default:
        return '';
    }
  }

  // =========================================================
  // DATE FOR INPUT
  // =========================================================

  private toInputDate(date: string): string {
    if (!date) {
      return '';
    }

    const parts = date.split('-');

    if (parts.length !== 3) {
      return '';
    }

    const day = parts[0].padStart(2, '0');

    const month = this.getMonthNumber(parts[1]);

    const year = parts[2];

    if (!month) {
      return '';
    }

    return `${year}-${month}-${day}`;
  }

  // =========================================================
  // MONTH NUMBER
  // =========================================================

  private getMonthNumber(month: string): string {
    const months: Record<string, string> = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };

    return months[month] || '';
  }

  // =========================================================
  // FORMAT DISPLAY DATE
  // =========================================================

  private formatDisplayDate(date: string): string {
    if (!date) {
      return '';
    }

    const parts = date.split('-');

    if (parts.length !== 3) {
      return date;
    }

    const year = parts[0];

    const month = parts[1];

    const day = parts[2];

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const monthName = months[Number(month) - 1];

    return `${day}-${monthName}-${year}`;
  }

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  closeModal(): void {
    this.showTaskModal = false;

    this.editingTaskId = null;

    this.taskForm.reset({
      taskTitle: '',

      milestonePhase: 'Pre-Boarding',

      taskJoiner: 'All Joiners (Template Default)',

      taskOwner: '',

      taskDueDate: '',

      taskStatus: 'Pending',
    });
  }
}
