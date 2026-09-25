import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceReport } from './performance-report';

describe('PerformanceReport', () => {
  let component: PerformanceReport;
  let fixture: ComponentFixture<PerformanceReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
