import { Component, input } from '@angular/core';
import { SlipData, inr } from './payslip-data';

/** The printable payslip. Used in the preview modal and rendered off-screen for printing. */
@Component({
  selector: 'app-payslip-sheet',
  template: `
    @let s = slip();
    <div class="payslip-sheet" id="payslipSheet">
      <div class="payslip-header">
        <div class="payslip-brand">
          <div class="payslip-brand-mark">{{ s.companyName.charAt(0) }}</div>
          <div>
            <div class="payslip-company-name">{{ s.companyName }}</div>
            <div class="payslip-company-address">{{ s.companyAddress }}</div>
          </div>
        </div>
        <div class="payslip-header-side">
          <div class="payslip-header-label">Payslip for the Month</div>
          <div class="payslip-header-month">{{ s.period }}</div>
        </div>
      </div>

      <div class="payslip-summary">
        <div class="payslip-summary-left">
          <div class="payslip-summary-title">EMPLOYEE SUMMARY</div>
          <div class="payslip-summary-row"><span>Employee Name</span><strong>{{ s.name }}</strong></div>
          <div class="payslip-summary-row"><span>Employee ID</span><strong>{{ s.empCode }}</strong></div>
          <div class="payslip-summary-row"><span>Pay Period</span><strong>{{ s.period }}</strong></div>
          <div class="payslip-summary-row"><span>Pay Date</span><strong>{{ s.payDate }}</strong></div>
        </div>
        <div class="payslip-summary-right">
          <div class="payslip-amount-box">
            <div class="payslip-amount">{{ inr(s.net) }}</div>
            <div class="payslip-amount-label">Employee Net Pay</div>
            <div class="payslip-sub-row"><span>Paid Days</span><strong>{{ s.present }}</strong></div>
            <div class="payslip-sub-row"><span>LOP Days</span><strong>{{ s.absent }}</strong></div>
          </div>
        </div>
      </div>

      <div class="payslip-table-grid">
        <div class="payslip-col">
          <div class="payslip-col-title">EARNINGS</div>
          @for (l of s.earnings; track l.label) {
            <div class="payslip-row"><span>{{ l.label }}</span><strong>{{ inr(l.amount) }}</strong></div>
          }
          <div class="payslip-row p-total"><span>Gross Earning</span><strong>{{ inr(s.gross) }}</strong></div>
        </div>
        <div class="payslip-col">
          <div class="payslip-col-title">DEDUCTIONS</div>
          @for (l of s.deductions; track l.label) {
            <div class="payslip-row"><span>{{ l.label }}</span><strong>{{ inr(l.amount) }}</strong></div>
          }
          <div class="payslip-row p-total"><span>Total Deductions</span><strong>{{ inr(s.totalDeductions) }}</strong></div>
        </div>
      </div>

      <div class="payslip-net-total">
        <span>TOTAL NET PAYABLE</span>
        <strong>{{ inr(s.net) }}</strong>
      </div>

      <div class="payslip-words">Amount in Words: <em>Indian Rupee {{ s.words }} Only</em></div>
      <div class="payslip-footer-text">This is a system-generated payslip, hence the signature is not required.</div>
    </div>
  `,
  styleUrl: './payslip-sheet.scss',
})
export class PayslipSheet {
  readonly slip = input.required<SlipData>();
  readonly inr = inr;
}
