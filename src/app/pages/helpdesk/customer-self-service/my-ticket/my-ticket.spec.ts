import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTicket } from './my-ticket';

describe('MyTicket', () => {
  let component: MyTicket;
  let fixture: ComponentFixture<MyTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTicket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTicket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
