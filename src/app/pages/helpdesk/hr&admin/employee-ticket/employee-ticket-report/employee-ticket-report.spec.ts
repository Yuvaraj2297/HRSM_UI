import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTicketReport } from './employee-ticket-report';

describe('EmployeeTicketReport', () => {
  let component: EmployeeTicketReport;
  let fixture: ComponentFixture<EmployeeTicketReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTicketReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTicketReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
