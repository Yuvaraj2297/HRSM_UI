import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRevenueReport } from './employee-revenue-report';

describe('EmployeeRevenueReport', () => {
  let component: EmployeeRevenueReport;
  let fixture: ComponentFixture<EmployeeRevenueReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeRevenueReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeRevenueReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
