import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveHoildayReport } from './leave-hoilday-report';

describe('LeaveHoildayReport', () => {
  let component: LeaveHoildayReport;
  let fixture: ComponentFixture<LeaveHoildayReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveHoildayReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveHoildayReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
