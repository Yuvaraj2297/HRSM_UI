import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalReview } from './appraisal-review';

describe('AppraisalReview', () => {
  let component: AppraisalReview;
  let fixture: ComponentFixture<AppraisalReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppraisalReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppraisalReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
