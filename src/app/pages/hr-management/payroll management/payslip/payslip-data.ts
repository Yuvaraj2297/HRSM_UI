/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type EarnKey = 'basic' | 'hra' | 'da' | 'convey' | 'medical' | 'special';
export type DedKey = 'pf' | 'esi' | 'profTax' | 'tds';
export type ReqStatus = 'pending' | 'approved' | 'rejected' | 'generated';

export interface Employee {
  id: number;
  name: string;
  empId: string;
  dept: string;
  designation: string;
  type: string;
  joining: string;
  location: string;
  present: number;
  absent: number;
  earn: Record<EarnKey, number>;
  ded: Record<DedKey, number>;
}

/** Values an admin can override when generating a payslip manually. */
export interface ManualOverride {
  workingDays: number;
  present: number;
  absent: number;
  earn: Record<EarnKey, number>;
  ded: Record<DedKey, number>;
}

export interface PayslipRequest {
  reqId: number;
  empId: number;
  period: string;
  note: string;
  status: ReqStatus;
  requestedOn: string;
  rejectReason: string;
  genType?: 'auto' | 'manual';
  generatedOn?: string;
  manual?: ManualOverride;
}

export interface SlipLine {
  label: string;
  amount: number;
}

/** Everything the printed payslip needs. */
export interface SlipData {
  companyName: string;
  companyAddress: string;
  period: string;
  payDate: string;
  name: string;
  empCode: string;
  present: number;
  absent: number;
  earnings: SlipLine[];
  deductions: SlipLine[];
  gross: number;
  totalDeductions: number;
  net: number;
  words: string;
}

/* ------------------------------------------------------------------ */
/*  Static data (from the PHP page). Replace with API calls later.     */
/* ------------------------------------------------------------------ */

export const COMPANY = { name: 'GHARUDA INFOTECH PVT LTD', address: '3rd Floor Kathalbari, Darbhanga 846004 India' };

export const EARN_FIELDS: { key: EarnKey; label: string; short: string; slip: string }[] = [
  { key: 'basic', label: 'Basic Salary', short: 'Basic', slip: 'Basic' },
  { key: 'hra', label: 'HRA', short: 'HRA', slip: 'House Rent Allowance' },
  { key: 'da', label: 'Dearness Allowance (DA)', short: 'DA', slip: 'Dearness Allowance' },
  { key: 'convey', label: 'Conveyance', short: 'Convey.', slip: 'Conveyance' },
  { key: 'medical', label: 'Medical', short: 'Medical', slip: 'Medical Allowance' },
  { key: 'special', label: 'Special Allowance', short: 'Special', slip: 'Special Allowance' },
];

export const DED_FIELDS: { key: DedKey; label: string; short: string }[] = [
  { key: 'pf', label: 'PF', short: 'PF' },
  { key: 'esi', label: 'ESI', short: 'ESI' },
  { key: 'profTax', label: 'Professional Tax', short: 'Prof Tax' },
  { key: 'tds', label: 'TDS', short: 'TDS' },
];

/** Deduction rows in the order the printed payslip lists them. */
const SLIP_DEDUCTIONS: { key: DedKey; label: string }[] = [
  { key: 'tds', label: 'Income Tax' },
  { key: 'pf', label: 'Provident Fund' },
  { key: 'esi', label: 'ESI' },
  { key: 'profTax', label: 'Professional Tax' },
];

export const PERIODS = [
  { value: 'Aug 2026', label: 'August 2026' },
  { value: 'Jul 2026', label: 'July 2026' },
  { value: 'Jun 2026', label: 'June 2026' },
  { value: 'May 2026', label: 'May 2026' },
  { value: 'Apr 2026', label: 'April 2026' },
  { value: 'Mar 2026', label: 'March 2026' },
];

function emp(
  id: number,
  name: string,
  dept: string,
  designation: string,
  type: string,
  joining: string,
  location: string,
  present: number,
  absent: number,
  earn: [number, number, number, number, number, number],
  ded: [number, number, number, number],
): Employee {
  return {
    id,
    name,
    empId: 'EMP' + String(id).padStart(4, '0'),
    dept,
    designation,
    type,
    joining,
    location,
    present,
    absent,
    earn: { basic: earn[0], hra: earn[1], da: earn[2], convey: earn[3], medical: earn[4], special: earn[5] },
    ded: { pf: ded[0], esi: ded[1], profTax: ded[2], tds: ded[3] },
  };
}

export const EMPLOYEES: Employee[] = [
  emp(1, 'Amelia Curr', 'Design', 'UI/UX Designer', 'Full-Time', '15 Jan 2024', 'Chennai', 26, 2, [25000, 10000, 5000, 3200, 2000, 4800], [3000, 375, 200, 2500]),
  emp(2, 'Daniel Martinez', 'Engineering', 'Senior Developer', 'Full-Time', '01 Mar 2023', 'Bangalore', 28, 0, [35000, 14000, 7000, 3200, 2000, 4800], [4200, 375, 200, 3500]),
  emp(3, 'David Anderson', 'Engineering', 'Backend Developer', 'Full-Time', '10 Jun 2024', 'Chennai', 24, 4, [30000, 12000, 6000, 3200, 2000, 4800], [3600, 375, 200, 3000]),
  emp(4, 'Emily Clark', 'Finance', 'Accountant', 'Full-Time', '20 Sep 2023', 'Hyderabad', 27, 1, [28000, 11200, 5600, 3200, 2000, 4800], [3360, 375, 200, 2800]),
  emp(5, 'Sophia Johnson', 'Marketing', 'Marketing Lead', 'Full-Time', '05 Apr 2024', 'Bangalore', 22, 6, [26000, 10400, 5200, 3200, 2000, 4800], [3120, 375, 200, 2600]),
  emp(6, 'Michael Brown', 'Design', 'Graphic Designer', 'Contract', '01 Jul 2025', 'Chennai', 25, 3, [22000, 8800, 4400, 3200, 2000, 4800], [2640, 375, 200, 2200]),
  emp(7, 'Olivia Wilson', 'Marketing', 'Content Writer', 'Full-Time', '12 Nov 2023', 'Hyderabad', 28, 0, [24000, 9600, 4800, 3200, 2000, 4800], [2880, 375, 200, 2400]),
  emp(8, 'James Taylor', 'Engineering', 'Frontend Developer', 'Full-Time', '01 Feb 2024', 'Bangalore', 27, 1, [32000, 12800, 6400, 3200, 2000, 4800], [3840, 375, 200, 3200]),
  emp(9, 'Isabella Moore', 'Finance', 'Financial Analyst', 'Full-Time', '08 Aug 2023', 'Chennai', 23, 5, [29000, 11600, 5800, 3200, 2000, 4800], [3480, 375, 200, 2900]),
  emp(10, 'William Thomas', 'Design', 'Product Designer', 'Full-Time', '15 May 2024', 'Hyderabad', 28, 0, [27000, 10800, 5400, 3200, 2000, 4800], [3240, 375, 200, 2700]),
  emp(11, 'Mia Harris', 'HR', 'HR Manager', 'Full-Time', '01 Jan 2023', 'Chennai', 21, 7, [30000, 12000, 6000, 3200, 2000, 4800], [3600, 375, 200, 3000]),
  emp(12, 'Benjamin Martin', 'Engineering', 'DevOps Engineer', 'Full-Time', '10 Sep 2024', 'Bangalore', 28, 0, [33000, 13200, 6600, 3200, 2000, 4800], [3960, 375, 200, 3300]),
  emp(13, 'Charlotte Lee', 'Finance', 'Payroll Specialist', 'Full-Time', '20 Mar 2024', 'Hyderabad', 25, 3, [26000, 10400, 5200, 3200, 2000, 4800], [3120, 375, 200, 2600]),
  emp(14, 'Henry Walker', 'Operations', 'Operations Manager', 'Full-Time', '05 Jul 2023', 'Chennai', 27, 1, [31000, 12400, 6200, 3200, 2000, 4800], [3720, 375, 200, 3100]),
  emp(15, 'Evelyn Hall', 'Marketing', 'SEO Specialist', 'Contract', '01 Nov 2025', 'Bangalore', 26, 2, [23000, 9200, 4600, 3200, 2000, 4800], [2760, 375, 200, 2300]),
];

/** The signed-in employee. The request form is locked to this person. */
export const CURRENT_EMPLOYEE_ID = 1;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "₹1,23,456" */
export const inr = (n: number) => '\u20B9' + Math.round(n).toLocaleString('en-IN');

/** Non-negative number from an input's raw text. */
export const num = (raw: string) => Math.max(0, parseFloat(raw) || 0);

export const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);

/** "21 Sep 2026" */
export function today(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Placeholder pay date: the 3rd of the month after the pay period, as dd/mm/yyyy. */
export function payDateFor(period: string): string {
  const month = MONTHS.indexOf(period.slice(0, 3));
  const year = parseInt(period.slice(4), 10);
  const next = new Date(year, month + 1, 3);
  return `03/${String(next.getMonth() + 1).padStart(2, '0')}/${next.getFullYear()}`;
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function below1000(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES[n] + ' ';
  if (n < 100) return TENS[Math.floor(n / 10)] + ' ' + (n % 10 ? ONES[n % 10] + ' ' : '');
  return ONES[Math.floor(n / 100)] + ' Hundred ' + (n % 100 ? below1000(n % 100) : '');
}

/** Whole rupees in words, Indian grouping: "Forty Five Thousand Six Hundred". */
export function numToWords(value: number): string {
  let n = Math.floor(value);
  if (n <= 0) return 'Zero';
  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  let out = '';
  if (crore) out += below1000(crore) + 'Crore ';
  if (lakh) out += below1000(lakh) + 'Lakh ';
  if (thousand) out += below1000(thousand) + 'Thousand ';
  if (n) out += below1000(n);
  return out.trim();
}

export const grossOf = (earn: Record<EarnKey, number>) => sum(earn);
export const dedOf = (ded: Record<DedKey, number>) => sum(ded);

/** Values the payslip uses: the admin's manual entries if there are any, else the employee's defaults. */
export function valuesFor(e: Employee, req: PayslipRequest) {
  const m = req.manual;
  return {
    present: m?.present ?? e.present,
    absent: m?.absent ?? e.absent,
    earn: m?.earn ?? e.earn,
    ded: m?.ded ?? e.ded,
  };
}

export function buildSlip(e: Employee, req: PayslipRequest): SlipData {
  const v = valuesFor(e, req);
  const gross = grossOf(v.earn);
  const totalDeductions = dedOf(v.ded);
  const net = gross - totalDeductions;
  return {
    companyName: COMPANY.name,
    companyAddress: COMPANY.address,
    period: req.period,
    payDate: payDateFor(req.period),
    name: e.name,
    empCode: e.empId,
    present: v.present,
    absent: v.absent,
    earnings: EARN_FIELDS.map((f) => ({ label: f.slip, amount: v.earn[f.key] })),
    deductions: SLIP_DEDUCTIONS.map((f) => ({ label: f.label, amount: v.ded[f.key] })),
    gross,
    totalDeductions,
    net,
    words: numToWords(net),
  };
}
