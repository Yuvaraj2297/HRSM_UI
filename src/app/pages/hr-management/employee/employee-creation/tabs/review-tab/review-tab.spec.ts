import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewTab } from './review-tab';

describe('ReviewTab', () => {
  let component: ReviewTab;
  let fixture: ComponentFixture<ReviewTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
