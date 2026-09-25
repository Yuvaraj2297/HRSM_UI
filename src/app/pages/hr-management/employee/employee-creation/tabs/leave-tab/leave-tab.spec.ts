import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveTab } from './leave-tab';

describe('LeaveTab', () => {
  let component: LeaveTab;
  let fixture: ComponentFixture<LeaveTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
