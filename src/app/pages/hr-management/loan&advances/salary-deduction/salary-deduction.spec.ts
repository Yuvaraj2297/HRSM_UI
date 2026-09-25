import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryDeduction } from './salary-deduction';

describe('SalaryDeduction', () => {
  let component: SalaryDeduction;
  let fixture: ComponentFixture<SalaryDeduction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryDeduction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryDeduction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
