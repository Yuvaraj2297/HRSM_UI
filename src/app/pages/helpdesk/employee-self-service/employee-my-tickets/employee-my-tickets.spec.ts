import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMyTickets } from './employee-my-tickets';

describe('EmployeeMyTickets', () => {
  let component: EmployeeMyTickets;
  let fixture: ComponentFixture<EmployeeMyTickets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeMyTickets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeMyTickets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
