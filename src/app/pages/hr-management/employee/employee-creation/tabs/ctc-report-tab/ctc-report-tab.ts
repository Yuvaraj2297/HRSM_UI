import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EmployeeFormFacade } from '../../facade/employee-form.facade';

interface CtcLine {
  label: string;
  monthly: number;
}

@Component({
  selector: 'app-ctc-report-tab',
  imports: [CommonModule],
  templateUrl: './ctc-report-tab.html',
  styleUrl: './ctc-report-tab.scss',
})
export class CtcReportTab {

  constructor(public fs: EmployeeFormFacade) {}

  /** annual CTC entered on the Profile tab (fallback matches the old static mock) */
  get annualCtc(): number {
    return Number(this.fs.group('salary').get('ctc')?.value) || 600000;
  }

  /** monthly gross = 85% of CTC/12, the rest being employer cost — swap for your real slab logic */
  get grossMonthly(): number {
    return Math.round((this.annualCtc / 12) * 0.85);
  }

  get earnings(): CtcLine[] {
    const g = this.grossMonthly;
    const basic = Math.round(g * 0.47);
    const hra = Math.round(basic * 0.4);
    const conveyance = 1600;
    const medical = 1250;
    const bonus = Math.round(g * 0.06);
    const special = g - (basic + hra + conveyance + medical + bonus);
    return [
      { label: 'Basic Salary', monthly: basic },
      { label: 'House Rent Allowance (HRA)', monthly: hra },
      { label: 'Conveyance Allowance', monthly: conveyance },
      { label: 'Medical Allowance', monthly: medical },
      { label: 'Special Allowance', monthly: Math.max(special, 0) },
      { label: 'Performance Bonus', monthly: bonus },
    ];
  }

  get deductions(): CtcLine[] {
    const basic = this.earnings[0].monthly;
    return [
      { label: 'Employee PF Contribution', monthly: Math.round(Math.min(basic, 15000) * 0.12) },
      { label: 'ESI Contribution', monthly: this.grossMonthly <= 21000 ? Math.round(this.grossMonthly * 0.0075) : 0 },
      { label: 'Professional Tax', monthly: 200 },
      { label: 'TDS (Income Tax)', monthly: Math.round(this.grossMonthly * 0.035) },
    ];
  }

  get employer(): CtcLine[] {
    const basic = this.earnings[0].monthly;
    return [
      { label: 'Employer PF Contribution', monthly: Math.round(Math.min(basic, 15000) * 0.12) },
      { label: 'Employer ESI Contribution', monthly: this.grossMonthly <= 21000 ? Math.round(this.grossMonthly * 0.0325) : 0 },
      { label: 'Gratuity', monthly: Math.round((basic * 15) / 26 / 12) },
    ];
  }

  private sum(lines: CtcLine[]): number {
    return lines.reduce((t, l) => t + l.monthly, 0);
  }
  get deductionsMonthly(): number { return this.sum(this.deductions); }
  get employerMonthly(): number { return this.sum(this.employer); }
  get netMonthly(): number { return this.grossMonthly - this.deductionsMonthly; }
  
}


