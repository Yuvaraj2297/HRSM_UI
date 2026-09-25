import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeadReport } from './employee-lead-report';

describe('EmployeeLeadReport', () => {
  let component: EmployeeLeadReport;
  let fixture: ComponentFixture<EmployeeLeadReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeLeadReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeLeadReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
