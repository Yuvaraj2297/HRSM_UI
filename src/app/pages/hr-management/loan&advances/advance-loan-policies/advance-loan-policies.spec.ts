import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceLoanPolicies } from './advance-loan-policies';

describe('AdvanceLoanPolicies', () => {
  let component: AdvanceLoanPolicies;
  let fixture: ComponentFixture<AdvanceLoanPolicies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceLoanPolicies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceLoanPolicies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
