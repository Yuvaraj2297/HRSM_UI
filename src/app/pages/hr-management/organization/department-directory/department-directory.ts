import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

interface Department {
  id: string;
  name: string;
}

interface Employee {
  empCode: string;
  name: string;
  email: string;
  role: string;
  department: string;
  photo: string;
  status: 'in' | 'out' | 'pending';
  favorite: boolean;
}

@Component({
  selector: 'app-department-directory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Import ReactiveFormsModule
  templateUrl: './department-directory.html',
  styleUrl: './department-directory.scss',
})
export class DepartmentDirectory implements OnInit, OnDestroy {

  // 1. Define the Reactive Form
  searchForm = new FormGroup({
    searchText: new FormControl('')
  });

  // 2. Keep the search term in a plain variable for filtering
  searchText: string = '';
  
  private searchSub?: Subscription;

  activeDeptId: string = 'hr';

  departments: Department[] = [
    { id: 'hr', name: 'HR' },
    { id: 'it', name: 'IT' },
    { id: 'management', name: 'Management' },
    { id: 'marketing', name: 'Marketing' },
  ];

  employees: Employee[] = [
    // Management
    { empCode: 'S1', name: 'Vickey G', email: 'vickeyg@zylker.com', role: 'CEO', department: 'management', photo: '/assets/profile-1.jpg', status: 'in', favorite: false },
    { empCode: 'S2', name: 'Lilly Williams', email: 'lillywilliams@zylker.com', role: 'Administration', department: 'management', photo: '/assets/profile-2.jpg', status: 'out', favorite: true },
    { empCode: 'S3', name: 'Clarkson Walter', email: 'clarksonwalter@zylker.com', role: 'Administration', department: 'management', photo: '/assets/profile-3.jpg', status: 'pending', favorite: false },
     { empCode: 'S4', name: 'Vijay', email: 'vijay12@gmail.com', role: 'Administration', department: 'management', photo: '/assets/profile-2.jpg', status: 'pending', favorite: false },
    
    // HR
    { empCode: 'S5', name: 'Priya Sharma', email: 'priyasharma@zylker.com', role: 'HR Manager', department: 'hr', photo: '/assets/profile-1.jpg', status: 'in', favorite: false },
    { empCode: 'S6', name: 'Arjun Nair', email: 'arjunnair@zylker.com', role: 'HR Executive', department: 'hr', photo: '/assets/profile-3.jpg', status: 'out', favorite: false },
    
    // IT
    { empCode: 'S9', name: 'Rahul Verma', email: 'rahulverma@zylker.com', role: 'Software Engineer', department: 'it', photo: '/assets/profile-4.jpg', status: 'in', favorite: false },
    { empCode: 'S10', name: 'Sneha Iyer', email: 'snehaiyer@zylker.com', role: 'QA Engineer', department: 'it', photo: '/assets/profile-2.jpg', status: 'in', favorite: true },
    
    // Marketing
    { empCode: 'S14', name: 'Emily Davis', email: 'emilydavis@zylker.com', role: 'Marketing Manager', department: 'marketing', photo: '/assets/profile-2.jpg', status: 'in', favorite: false },
  ];

  ngOnInit(): void {
    // 3. Listen to form value changes reactively
    this.searchSub = this.searchForm.get('searchText')?.valueChanges
      .pipe(
        debounceTime(300),        // Wait 300ms after typing stops
        distinctUntilChanged()    // Only trigger if the value actually changed
      )
      .subscribe(value => {
        this.searchText = value || '';
      });
  }

  ngOnDestroy(): void {
    // 4. Clean up subscription
    this.searchSub?.unsubscribe();
  }

  // --- Helper Methods ---

  get filteredDepartments(): Department[] {
    if (!this.searchText.trim()) {
      return this.departments;
    }
    return this.departments.filter(d => 
      d.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get activeDeptName(): string {
    const dept = this.departments.find(d => d.id === this.activeDeptId);
    return dept ? dept.name : 'Department';
  }

  get members(): Employee[] {
    return this.employees.filter(e => e.department === this.activeDeptId);
  }

  countFor(deptId: string): number {
    return this.employees.filter(e => e.department === deptId).length;
  }

  // --- Action Methods ---

  selectDept(deptId: string): void {
    this.activeDeptId = deptId;
  }

  clearSearch(): void {
    // 5. Reset the form control (this also triggers valueChanges)
    this.searchForm.get('searchText')?.setValue('');
  }

  toggleFavorite(empCode: string, event: Event): void {
    event.stopPropagation();
    const emp = this.employees.find(e => e.empCode === empCode);
    if (emp) {
      emp.favorite = !emp.favorite;
    }
  }

  getStatusLabel(status: string): string {
    if (status === 'in') return 'In';
    if (status === 'out') return 'Out';
    return 'Yet to check-in';
  }
}