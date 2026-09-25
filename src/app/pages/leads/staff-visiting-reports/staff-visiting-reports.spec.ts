import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { StaffVisitingReports } from './staff-visiting-reports';

describe('StaffVisitingReports', () => {
  let component: StaffVisitingReports;
  let fixture: ComponentFixture<StaffVisitingReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffVisitingReports],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffVisitingReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
