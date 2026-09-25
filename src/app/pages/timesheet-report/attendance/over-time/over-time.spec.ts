import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverTime } from './over-time';

describe('OverTime', () => {
  let component: OverTime;
  let fixture: ComponentFixture<OverTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverTime]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverTime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
