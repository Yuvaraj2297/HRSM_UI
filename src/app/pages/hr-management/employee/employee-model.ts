
export interface StatCard {
  label: string;
  value: string | number;
  delta: string;
  deltaClass: 'text-neutral' | 'text-up' | 'text-down';
  icon: string;
  theme: 'violet' | 'primary' | 'amber' | 'blue';
}


export interface EmployeeHistoryEntry {
  date: string;
  title: string;
  description: string;
}

export interface EmployeeDocument {
  type: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  status: 'Verified' | 'Pending' | 'Expired';
}

export interface Employee {
  empId: string;
  name: string;
  email: string;
  avatar: string;
  dept: string;
  position: string;
  office: string;
  manager: string;
  managerEmail: string;
  phone: string;
  team: string;
  status: 'Active' | 'Inactive' | 'Invited';
  joined: string;

  /* Optional extended fields used by the profile modal */
  empType?: string;
  confirmDate?: string;
  probation?: string;
  noticePeriod?: string;
  workLocation?: string;

  prevCompany?: string;
  prevDesignation?: string;
  industry?: string;
  totalExp?: string;
  relevantExp?: string;
  prevCtc?: string;
  expectedCtc?: string;
  reasonLeaving?: string;
  skills?: string;

  grade?: string;
  branch?: string;
  costCenter?: string;
  location?: string;

  dob?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  personalEmail?: string;
  address?: string;

  ctc?: string;
  basic?: number;
  hra?: number;
  specialAllowance?: number;
  otherAllowance?: number;
  pf?: number;
  professionalTax?: number;
  tds?: number;

  history?: EmployeeHistoryEntry[];
  documents?: EmployeeDocument[];
}
/** colour maps used by the badge columns */
export const DEPT_COLORS: Record<string, string> = {
  Design: 'var(--blue-450)',
  'iOS Dev': 'var(--green-400-2)',
  Business: 'var(--blue-450)',
  Marketing: 'var(--pink-450)',
};

export const TEAM_COLORS: Record<string, string> = {
  'Node JS': 'var(--green-400-2)',
  Design: 'var(--warning)',
  iOS: 'var(--blue-450)',
  Business: 'var(--purple-500)',
  Marketing: 'var(--pink-450)',
};

export const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  Active: { bg: 'var(--primary-light)', fg: 'var(--primary-dark)' },
  Invited: { bg: 'var(--accent-violet-soft)', fg: 'var(--accent-violet)' },
  Inactive: { bg: 'var(--accent-red-soft)', fg: 'var(--accent-red)' },
};

const img = (i: number) => `assets/img/profile-${((i - 1) % 4) + 1}.jpg`;

export const EMPLOYEES: Employee[] = [
  ['Amelia Curr', 'amelia.curr@zenith.com', '+91 98765 43210', 'EMP0001', 'Design', 'UI/UX Designer', 'Zenith Technologies', 'Victoria Celestie', 'victoria@zenith.com', 'Node JS', 'Active', '12 Jan 2024'],
  ['Daniel Martinez', 'daniel.m@coretech.com', '+91 98765 43221', 'EMP0002', 'Design', 'Product Designer', 'Core Technologies', 'Madison Andrew', 'madison@coretech.com', 'Design', 'Invited', '18 Feb 2024'],
  ['David Anderson', 'david.a@skylogic.com', '+91 98765 43231', 'EMP0003', 'iOS Dev', 'iOS Developer', 'Skylogic Solutions', 'Ryan Christopher', 'ryan@skylogic.com', 'iOS', 'Active', '05 Mar 2024'],
  ['Emily Clark', 'emily.c@micronest.com', '+91 98765 43241', 'EMP0004', 'Business', 'Business Analyst', 'Micronest Technologies', 'Emily Lauren', 'emily.l@micronest.com', 'Business', 'Active', '22 Mar 2024'],
  ['Sophia Johnson', 'sophia.j@zenith.com', '+91 98765 43251', 'EMP0005', 'Marketing', 'Marketing Manager', 'Zenith Technologies', 'Victoria Celestie', 'victoria@zenith.com', 'Marketing', 'Inactive', '01 Apr 2024'],
  ['James Wilson', 'james.w@zenith.com', '+91 98765 43261', 'EMP0006', 'Design', 'Senior Designer', 'Zenith Technologies', 'Victoria Celestie', 'victoria@zenith.com', 'Design', 'Active', '15 May 2024'],
  ['Olivia Brown', 'olivia.b@coretech.com', '+91 98765 43271', 'EMP0007', 'iOS Dev', 'iOS Developer', 'Core Technologies', 'Madison Andrew', 'madison@coretech.com', 'iOS', 'Active', '20 May 2024'],
  ['Liam Davis', 'liam.d@skylogic.com', '+91 98765 43281', 'EMP0008', 'Business', 'Business Analyst', 'Skylogic Solutions', 'Ryan Christopher', 'ryan@skylogic.com', 'Business', 'Active', '01 Jun 2024'],
  ['Emma Miller', 'emma.m@micronest.com', '+91 98765 43291', 'EMP0009', 'Marketing', 'Marketing Executive', 'Micronest Technologies', 'Emily Lauren', 'emily.l@micronest.com', 'Marketing', 'Active', '10 Jun 2024'],
  ['Noah Garcia', 'noah.g@zenith.com', '+91 98765 43301', 'EMP0010', 'Design', 'UI Designer', 'Zenith Technologies', 'Victoria Celestie', 'victoria@zenith.com', 'Node JS', 'Active', '15 Jul 2024'],
  ['Ava Rodriguez', 'ava.r@coretech.com', '+91 98765 43311', 'EMP0011', 'iOS Dev', 'Senior iOS Developer', 'Core Technologies', 'Madison Andrew', 'madison@coretech.com', 'iOS', 'Active', '20 Jul 2024'],
  ['William Martinez', 'william.m@skylogic.com', '+91 98765 43321', 'EMP0012', 'Business', 'Product Manager', 'Skylogic Solutions', 'Ryan Christopher', 'ryan@skylogic.com', 'Business', 'Invited', '01 Aug 2024'],
  ['Sophia Anderson', 'sophia.a@micronest.com', '+91 98765 43331', 'EMP0013', 'Marketing', 'Content Writer', 'Micronest Technologies', 'Emily Lauren', 'emily.l@micronest.com', 'Marketing', 'Active', '10 Aug 2024'],
  ['Benjamin Thomas', 'benjamin.t@zenith.com', '+91 98765 43341', 'EMP0014', 'Design', 'Graphic Designer', 'Zenith Technologies', 'Victoria Celestie', 'victoria@zenith.com', 'Design', 'Active', '15 Sep 2024'],
  ['Isabella Jackson', 'isabella.j@coretech.com', '+91 98765 43351', 'EMP0015', 'iOS Dev', 'Flutter Developer', 'Core Technologies', 'Madison Andrew', 'madison@coretech.com', 'iOS', 'Active', '20 Sep 2024'],
  ['Mason White', 'mason.w@skylogic.com', '+91 98765 43361', 'EMP0016', 'Business', 'Data Analyst', 'Skylogic Solutions', 'Ryan Christopher', 'ryan@skylogic.com', 'Business', 'Inactive', '01 Oct 2024'],
  ['Mia Harris', 'mia.h@micronest.com', '+91 98765 43371', 'EMP0017', 'Marketing', 'SEO Specialist', 'Micronest Technologies', 'Emily Lauren', 'emily.l@micronest.com', 'Marketing', 'Active', '10 Oct 2024'],
  ['Ethan Martin', 'ethan.m@zenith.com', '+91 98765 43381', 'EMP0018', 'Design', 'UX Researcher', 'Zenith Technologies', 'Victoria Celestie', 'victoria@zenith.com', 'Node JS', 'Active', '15 Nov 2024'],
  ['Charlotte Thompson', 'charlotte.t@coretech.com', '+91 98765 43391', 'EMP0019', 'iOS Dev', 'React Native Developer', 'Core Technologies', 'Madison Andrew', 'madison@coretech.com', 'iOS', 'Active', '20 Nov 2024'],
  ['Alexander Lee', 'alex.l@skylogic.com', '+91 98765 43401', 'EMP0020', 'Business', 'Marketing Analyst', 'Skylogic Solutions', 'Ryan Christopher', 'ryan@skylogic.com', 'Business', 'Active', '01 Dec 2024'],
].map((r, i) => ({
  name: r[0],
  email: r[1],
  phone: r[2],
  empId: r[3],
  dept: r[4],
  position: r[5],
  office: r[6],
  manager: r[7],
  managerEmail: r[8],
  team: r[9],
  status: r[10] as Employee['status'],
  joined: r[11],
  avatar: img(i + 1),
}));