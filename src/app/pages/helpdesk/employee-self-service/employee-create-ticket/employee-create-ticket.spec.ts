import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCreateTicket } from './employee-create-ticket';

describe('EmployeeCreateTicket', () => {
  let component: EmployeeCreateTicket;
  let fixture: ComponentFixture<EmployeeCreateTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCreateTicket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCreateTicket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
