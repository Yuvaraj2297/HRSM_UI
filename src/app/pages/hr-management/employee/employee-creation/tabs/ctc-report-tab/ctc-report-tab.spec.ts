import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtcReportTab } from './ctc-report-tab';

describe('CtcReportTab', () => {
  let component: CtcReportTab;
  let fixture: ComponentFixture<CtcReportTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtcReportTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtcReportTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
