import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';

import { Payslip } from './payslip';
import { numToWords } from './payslip-data';

describe('Payslip', () => {
  let component: Payslip;
  let fixture: ComponentFixture<Payslip>;
  let el: HTMLElement;

  const q = <T extends HTMLElement>(sel: string) => el.querySelector<T>(sel)!;
  const qa = (sel: string) => Array.from(el.querySelectorAll<HTMLElement>(sel));
  const click = (sel: string) => {
    q(sel).click();
    fixture.detectChanges();
  };
  const buttonByText = (text: string) => qa('button').find((b) => b.textContent?.trim().includes(text))!;
  const type = (sel: string, value: string) => {
    const i = q<HTMLInputElement | HTMLTextAreaElement>(sel);
    i.value = value;
    i.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };
  const submitRequest = (note = '') => {
    if (note) type('#reqNote', note);
    click('.btn-primary.block');
  };
  const rows = () => qa('.ps-table tbody tr:not(:has(.empty))');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Payslip] }).compileComponents();
    fixture = TestBed.createComponent(Payslip);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts on the employee view with an empty request list', () => {
    expect(q('.page-title').textContent).toContain('Payslip Management');
    expect(q('#tabEmployee').getAttribute('aria-selected')).toBe('true');
    expect(qa('.step').length).toBe(4);
    expect(q('.empty').textContent).toContain('No requests yet');
  });

  it('submits a request, shows it in the table and moves the stepper to "Pending Review"', fakeAsync(() => {
    submitRequest('Visa processing');
    expect(rows().length).toBe(1);
    expect(rows()[0].textContent).toContain('Visa processing');
    expect(rows()[0].textContent).toContain('Pending');
    expect(qa('.step')[1].classList.contains('active')).toBeTrue();
    expect(q<HTMLTextAreaElement>('#reqNote').value).toBe('');
    expect(q('.tab-badge').textContent?.trim()).toBe('1');
    flush();
  }));

  it('approves a request and jumps the employee stepper to "Approved"', fakeAsync(() => {
    submitRequest();
    click('#tabAdmin');
    expect(q('.kpi-value').textContent?.trim()).toBe('1');
    buttonByText('Approve').click();
    fixture.detectChanges();

    expect(qa('.ps-table')[1].querySelectorAll('tbody tr').length).toBe(1);
    click('#tabEmployee');
    expect(component.panel()).toBe(3);
    expect(rows()[0].textContent).toContain('Approved');
    flush();
  }));

  it('rejects with a reason that the employee can see', fakeAsync(() => {
    submitRequest();
    click('#tabAdmin');
    buttonByText('Reject').click();
    fixture.detectChanges();
    type('#rejectReason', 'Wrong period');
    buttonByText('Confirm Reject').click();
    fixture.detectChanges();

    expect(el.querySelector('.modal-dialog')).toBeNull();
    click('#tabEmployee');
    component.showStep(1);
    fixture.detectChanges();
    expect(rows()[0].textContent).toContain('Wrong period');
    flush();
  }));

  it('bulk-approves the selected pending requests', fakeAsync(() => {
    submitRequest();
    submitRequest();
    click('#tabAdmin');
    click('input[aria-label="Select all pending requests"]');
    expect(component.pendingSelected().length).toBe(2);
    buttonByText('Approve Selected').click();
    fixture.detectChanges();
    expect(component.counts().approved).toBe(2);
    flush();
  }));

  it('generates an auto payslip from the row menu', fakeAsync(() => {
    submitRequest();
    click('#tabAdmin');
    buttonByText('Approve').click();
    fixture.detectChanges();

    click('.menu-trigger');
    buttonByText('Generate Auto Pay Slip').click();
    fixture.detectChanges();

    expect(component.counts().generated).toBe(1);
    expect(el.querySelector('.badge.generated')).not.toBeNull();
    flush();
  }));

  it('generates a manual payslip and previews it with the edited figures', fakeAsync(() => {
    submitRequest();
    click('#tabAdmin');
    buttonByText('Approve').click();
    fixture.detectChanges();

    click('.menu-trigger');
    buttonByText('Manual Pay Slip').click();
    fixture.detectChanges();
    type('#m-basic', '40000');
    buttonByText('Generate Payslip').click();
    fixture.detectChanges();

    expect(component.counts().generated).toBe(1);
    const sheet = q('app-payslip-sheet');
    expect(sheet.textContent).toContain('₹40,000');
    expect(sheet.textContent).toContain('Amelia Curr');
    flush();
  }));

  it('validates attendance in the manual payslip form', fakeAsync(() => {
    submitRequest();
    click('#tabAdmin');
    buttonByText('Approve').click();
    fixture.detectChanges();
    click('.menu-trigger');
    buttonByText('Manual Pay Slip').click();
    fixture.detectChanges();

    type('#mPresent', '30');
    buttonByText('Generate Payslip').click();
    fixture.detectChanges();
    expect(el.querySelector('.field-error')).not.toBeNull();
    expect(component.counts().generated).toBe(0);
    flush();
  }));

  it('writes amounts in Indian words without repeating "Thousand"', () => {
    expect(numToWords(45600)).toBe('Forty Five Thousand Six Hundred');
    expect(numToWords(123456)).toBe('One Lakh Twenty Three Thousand Four Hundred Fifty Six');
  });

  it('closes a modal on Escape', fakeAsync(() => {
    submitRequest();
    click('#tabAdmin');
    buttonByText('Reject').click();
    fixture.detectChanges();
    component.onEscape();
    fixture.detectChanges();
    expect(el.querySelector('.modal-dialog')).toBeNull();
    flush();
  }));
});
