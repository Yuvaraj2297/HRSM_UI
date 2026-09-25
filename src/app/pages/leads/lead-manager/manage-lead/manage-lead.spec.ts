import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLead } from './manage-lead';

describe('ManageLead', () => {
  let component: ManageLead;
  let fixture: ComponentFixture<ManageLead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageLead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageLead);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
