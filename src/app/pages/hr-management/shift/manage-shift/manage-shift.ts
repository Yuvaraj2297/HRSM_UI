import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  PrimeDataTable,
  PrimeTableColumn,
  PrimeTableHeader,
  PrimeTableHeaderButton,
  PrimeTableActions
} from '../../../../shared/primedatatable/primedatatable';
import { Breadcrumb } from '../../../../shared/breadcrumb/breadcrumb';

export interface ShiftItem {
  id: number;
  shift_name: string;
  tag: string;
  tag_color: string;
  dot_color: string;
  timing: { start: string; end: string } | null;
  status: string;
  department: string;
  position: string;
  sun?: string;
  mon?: string;
  tue?: string;
  wed?: string;
  thu?: string;
  fri?: string;
  sat?: string;
}

@Component({
  selector: 'app-manage-shift',
  standalone: true,
  imports: [CommonModule,  PrimeDataTable, Breadcrumb],
  templateUrl: './manage-shift.html',
  styleUrl: './manage-shift.scss',
})
export class ManageShift implements OnInit {
  header: PrimeTableHeader = {
    title: 'Shifts',
    icon: 'bi bi-clock-history',
    count: 0
  };

  searchPlaceholder = 'Search shift, department, position...';

  actions: PrimeTableActions = {
    add: true,
    edit: true,
    delete: true,
    addLabel: 'Create Shift',
    addIcon: 'bi bi-plus-lg',
  };

  headerButtons: PrimeTableHeaderButton[] = [
    {
      id: 'assign-shift',
      label: 'Assign Shift',
      icon: 'bi bi-box-arrow-up-right',
      iconPosition: 'right',
      variant: 'outline',
      routerLink: '/shift/shift-shedule',
      action: 'assign-shift'
    }
  ];

  columns: PrimeTableColumn[] = [
    { field: 'sno', header: 'S.No', type: 'text', width: '70px', sortable: false },
    { field: 'shift_name', header: 'Shift Name', type: 'shift-name', width: '220px', sortable: true },
    { field: 'department', header: 'Department', type: 'text', width: '160px', sortable: true },
    { field: 'position', header: 'Position', type: 'text', width: '150px', sortable: true },
    { field: 'sun', header: 'Sun', type: 'day-timing', cellClass: 'day-col', width: '150px', sortable: false },
    { field: 'mon', header: 'Mon', type: 'day-timing', cellClass: 'day-col', width: '150px', sortable: false },
    { field: 'tue', header: 'Tue', type: 'day-timing', cellClass: 'day-col', width: '150px', sortable: false },
    { field: 'wed', header: 'Wed', type: 'day-timing', cellClass: 'day-col', width: '150px', sortable: false },
    { field: 'thu', header: 'Thu', type: 'day-timing', cellClass: 'day-col', width: '150px', sortable: false },
    { field: 'fri', header: 'Fri', type: 'day-timing', cellClass: 'day-col', width: '150px', sortable: false },
    { field: 'sat', header: 'Sat', type: 'day-timing', cellClass: 'day-col', width: '150px', sortable: false },
  ];

  rawShiftData: ShiftItem[] = [
    {
      id: 1,
      shift_name: 'Default Shift',
      tag: 'Default',
      tag_color: 'var(--blue-450)',
      dot_color: 'var(--blue-450)',
      timing: { start: '10:00', end: '19:00' },
      status: 'Enable',
      department: 'All Departments',
      position: 'All Positions'
    },
    {
      id: 2,
      shift_name: 'Open Shift',
      tag: 'System Defined',
      tag_color: 'var(--warning)',
      dot_color: 'var(--warning)',
      timing: null,
      status: 'Enable',
      department: 'All Departments',
      position: 'All Positions'
    },
    {
      id: 3,
      shift_name: 'Morning Shift',
      tag: '',
      tag_color: '',
      dot_color: 'var(--green-400)',
      timing: { start: '06:00', end: '14:00' },
      status: 'Enable',
      department: 'Developer',
      position: 'Frontend'
    },
    {
      id: 4,
      shift_name: 'Night Shift',
      tag: '',
      tag_color: '',
      dot_color: 'var(--purple-500)',
      timing: { start: '22:00', end: '06:00' },
      status: 'Enable',
      department: 'Developer',
      position: 'Backend'
    }
  ];

  tableData: any[] = [];

  ngOnInit(): void {
    this.loadShifts();
  }

  loadShifts(): void {
    const shiftDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    this.tableData = this.rawShiftData.map(s => {
      const row: any = { ...s };
      shiftDays.forEach(d => {
        if (s.timing) {
          const startTime = this.formatTime(s.timing.start);
          const endTime = this.formatTime(s.timing.end);
          row[d] = `${startTime} - ${endTime}`;
        } else {
          row[d] = 'Flexible timing';
        }
      });
      return row;
    });

    this.header.count = this.tableData.length;
  }

  formatTime(timeStr: string): string {
    const parts = timeStr.split(':');
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h < 10 ? '0' + h : h}:${m} ${ampm}`;
  }

  constructor(private router: Router) {}

  onTableAction(event: { action: string; row: any }): void {
    console.log('Action clicked:', event);
  }

  onHeaderButtonClick(btn: PrimeTableHeaderButton): void {
    console.log('Header button clicked:', btn);
  }

  onCreateShift(): void {
    this.router.navigate(['/shift/create-shift']);
  }
}
