import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftSchedule } from './shift-schedule';

describe('ShiftSchedule', () => {
  let component: ShiftSchedule;
  let fixture: ComponentFixture<ShiftSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftSchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
