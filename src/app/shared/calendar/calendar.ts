import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

export interface TeamMember {
  id: string;
  name: string;
  team: string;
  seed: number;
  avatar?: string;
}

export interface CalendarDayCell {
  isEmpty: boolean;
  dayNumber?: number;
  status?: 'present' | 'absent' | 'late' | 'half' | 'leave' | 'holiday';
  tagLabel?: string;
  isToday?: boolean;
  bgColor?: string;
  textColor?: string;
}

export interface CalendarSummary {
  present: number;
  absent: number;
  late: number;
  half: number;
  leave: number;
  avgHours: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar implements OnInit, OnChanges {
  @Input() initialYear: number = 2026;
  @Input() initialMonth: number = 8; // September (0-indexed: 8)
  @Input() showSummaryCards: boolean = true;
  @Input() showLegend: boolean = true;
  @Input() showFilters: boolean = true;

  @Input() teamOptions: { label: string; value: string }[] = [
    { label: 'All Teams', value: '' },
    { label: 'Node JS', value: 'Node JS' },
    { label: 'Design', value: 'Design' },
    { label: 'iOS', value: 'iOS' },
    { label: 'Business', value: 'Business' },
    { label: 'Marketing', value: 'Marketing' },
  ];

  @Input() employees: TeamMember[] = [
    { id: 'EMP0001', name: 'Amelia Curr', team: 'Node JS', seed: 1 },
    { id: 'EMP0002', name: 'Daniel Martinez', team: 'Design', seed: 2 },
    { id: 'EMP0003', name: 'David Anderson', team: 'iOS', seed: 3 },
    { id: 'EMP0004', name: 'Emily Clark', team: 'Business', seed: 4 },
    { id: 'EMP0005', name: 'Sophia Johnson', team: 'Marketing', seed: 5 },
    { id: 'EMP0006', name: 'Liam Wilson', team: 'Design', seed: 6 },
    { id: 'EMP0007', name: 'Olivia Brown', team: 'iOS', seed: 7 },
    { id: 'EMP0008', name: 'Noah Davis', team: 'Business', seed: 8 },
    { id: 'EMP0009', name: 'Emma Garcia', team: 'Marketing', seed: 9 },
    { id: 'EMP0010', name: 'James Rodriguez', team: 'Node JS', seed: 10 },
    { id: 'EMP0011', name: 'Olivia Martinez', team: 'iOS', seed: 11 },
    { id: 'EMP0012', name: 'William Anderson', team: 'Business', seed: 12 },
    { id: 'EMP0013', name: 'Sophia Thomas', team: 'Marketing', seed: 13 },
    { id: 'EMP0014', name: 'Benjamin Jackson', team: 'Node JS', seed: 14 },
    { id: 'EMP0015', name: 'Isabella White', team: 'iOS', seed: 15 },
    { id: 'EMP0016', name: 'Mason Harris', team: 'Business', seed: 16 },
    { id: 'EMP0017', name: 'Mia Clark', team: 'Marketing', seed: 17 },
    { id: 'EMP0018', name: 'Ethan Lewis', team: 'Node JS', seed: 18 },
    { id: 'EMP0019', name: 'Charlotte Walker', team: 'iOS', seed: 19 },
    { id: 'EMP0020', name: 'Alexander Hall', team: 'Business', seed: 20 },
  ];

  @Input() selectedMemberId: string = 'EMP0001';
  selectedTeam: string = '';
  filteredMemberOptions: { label: string; value: string }[] = [];

  currentYear: number = 2026;
  currentMonth: number = 8; // September (0-indexed)

  dayHeaders: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  calendarCells: CalendarDayCell[] = [];

  summary: CalendarSummary = {
    present: 17,
    absent: 1,
    late: 3,
    half: 0,
    leave: 1,
    avgHours: '8.4h',
  };

  private readonly MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  ngOnInit(): void {
    this.currentYear = this.initialYear;
    this.currentMonth = this.initialMonth;
    this.updateMemberOptions();
    this.renderCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialYear'] || changes['initialMonth'] || changes['employees']) {
      this.currentYear = this.initialYear;
      this.currentMonth = this.initialMonth;
      this.updateMemberOptions();
      this.renderCalendar();
    }
    if (changes['selectedMemberId']) {
      const member = this.employees.find((m) => m.id === this.selectedMemberId);
      if (member && this.selectedTeam && member.team !== this.selectedTeam) {
        this.selectedTeam = '';
      }
      this.updateMemberOptions();
      this.renderCalendar();
    }
  }

  get monthLabel(): string {
    return `${this.MONTH_NAMES[this.currentMonth]} ${this.currentYear}`;
  }

  onTeamChange(): void {
    this.updateMemberOptions();
    if (this.filteredMemberOptions.length > 0) {
      this.selectedMemberId = this.filteredMemberOptions[0].value;
    } else {
      this.selectedMemberId = '';
    }
    this.renderCalendar();
  }

  onMemberChange(): void {
    this.renderCalendar();
  }

  prevMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.renderCalendar();
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.renderCalendar();
  }

  private updateMemberOptions(): void {
    const list = this.selectedTeam
      ? this.employees.filter((m) => m.team === this.selectedTeam)
      : this.employees;

    this.filteredMemberOptions = list.map((m) => ({
      label: `${m.name} (${m.id})`,
      value: m.id,
    }));

    if (!list.some((m) => m.id === this.selectedMemberId) && list.length > 0) {
      this.selectedMemberId = list[0].id;
    }
  }

  private getSelectedMember(): TeamMember | undefined {
    return this.employees.find((m) => m.id === this.selectedMemberId) || this.employees[0];
  }

  renderCalendar(): void {
    const member = this.getSelectedMember();
    const seed = member ? member.seed : 1;

    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    const cells: CalendarDayCell[] = [];

    // Leading empty days
    for (let i = 0; i < firstDay; i++) {
      cells.push({ isEmpty: true });
    }

    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let halfCount = 0;
    let leaveCount = 0;
    let totalHours = 0;
    let workedDays = 0;

    // Fixed realistic pattern matching screenshot for September 2026, or deterministic for other months
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(this.currentYear, this.currentMonth, d).getDay();
      let status: 'present' | 'absent' | 'late' | 'half' | 'leave' | 'holiday';

      if (dow === 0 || dow === 6) {
        status = 'holiday';
      } else if (this.currentYear === 2026 && this.currentMonth === 8 && seed === 1) {
        // Exact screenshot pattern for Amelia Curr in September 2026:
        // Day 24: Leave, Day 25: Absent, Days 28-30: Late, rest of weekdays: Present
        if (d === 24) status = 'leave';
        else if (d === 25) status = 'absent';
        else if (d >= 28 && d <= 30) status = 'late';
        else status = 'present';
      } else {
        // Deterministic pseudo-random pattern matching formula
        const n = (seed * 31 + this.currentYear * 7 + (this.currentMonth + 1) * 13 + d * 3) % 100;
        if (n < 5) status = 'leave';
        else if (n < 10) status = 'absent';
        else if (n < 22) status = 'late';
        else if (n < 26) status = 'half';
        else status = 'present';
      }

      let tagLabel = 'Present';
      if (status === 'holiday') tagLabel = 'Off';
      else if (status === 'absent') tagLabel = 'Absent';
      else if (status === 'late') tagLabel = 'Late';
      else if (status === 'half') tagLabel = 'Half';
      else if (status === 'leave') tagLabel = 'Leave';

      // Highlight day 23 as active / selected day (as seen in screenshot)
      const isToday = (this.currentYear === 2026 && this.currentMonth === 8 && d === 23);

      cells.push({
        isEmpty: false,
        dayNumber: d,
        status,
        tagLabel,
        isToday,
      });

      if (status === 'present') {
        presentCount++;
        totalHours += 8.5;
        workedDays++;
      } else if (status === 'absent') {
        absentCount++;
      } else if (status === 'late') {
        lateCount++;
        totalHours += 7.8;
        workedDays++;
      } else if (status === 'half') {
        halfCount++;
        totalHours += 4.2;
        workedDays++;
      } else if (status === 'leave') {
        leaveCount++;
      }
    }

    this.calendarCells = cells;
    this.summary = {
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      half: halfCount,
      leave: leaveCount,
      avgHours: workedDays > 0 ? (totalHours / workedDays).toFixed(1) + 'h' : '0h',
    };
  }
}
