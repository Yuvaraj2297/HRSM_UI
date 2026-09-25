import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceDept } from './performance-dept';

describe('PerformanceDept', () => {
  let component: PerformanceDept;
  let fixture: ComponentFixture<PerformanceDept>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceDept]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceDept);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
