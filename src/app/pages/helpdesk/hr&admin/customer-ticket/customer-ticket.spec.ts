import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTicket } from './customer-ticket';

describe('CustomerTicket', () => {
  let component: CustomerTicket;
  let fixture: ComponentFixture<CustomerTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTicket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTicket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
