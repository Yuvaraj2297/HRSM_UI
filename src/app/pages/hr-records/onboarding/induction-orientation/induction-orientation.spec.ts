import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InductionOrientation } from './induction-orientation';

describe('InductionOrientation', () => {
  let component: InductionOrientation;
  let fixture: ComponentFixture<InductionOrientation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InductionOrientation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InductionOrientation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
