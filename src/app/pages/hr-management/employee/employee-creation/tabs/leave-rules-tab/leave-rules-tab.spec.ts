import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRulesTab } from './leave-rules-tab';

describe('LeaveRulesTab', () => {
  let component: LeaveRulesTab;
  let fixture: ComponentFixture<LeaveRulesTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRulesTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveRulesTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
