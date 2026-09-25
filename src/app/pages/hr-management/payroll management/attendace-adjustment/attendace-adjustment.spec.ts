import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendaceAdjustment } from './attendace-adjustment';

describe('AttendaceAdjustment', () => {
  let component: AttendaceAdjustment;
  let fixture: ComponentFixture<AttendaceAdjustment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendaceAdjustment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendaceAdjustment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
