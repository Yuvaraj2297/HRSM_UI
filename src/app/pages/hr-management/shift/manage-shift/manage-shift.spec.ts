import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageShift } from './manage-shift';

describe('ManageShift', () => {
  let component: ManageShift;
  let fixture: ComponentFixture<ManageShift>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageShift]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageShift);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
