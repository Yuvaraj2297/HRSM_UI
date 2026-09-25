import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { LeadDashboard } from './lead-dashboard';

describe('LeadDashboard', () => {
  let component: LeadDashboard;
  let fixture: ComponentFixture<LeadDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadDashboard],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
