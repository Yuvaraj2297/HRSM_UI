import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtApprovalTab } from './ot-approval-tab';

describe('OtApprovalTab', () => {
  let component: OtApprovalTab;
  let fixture: ComponentFixture<OtApprovalTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtApprovalTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtApprovalTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
