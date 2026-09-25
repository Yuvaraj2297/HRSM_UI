import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { LeadStage } from './lead-stage';

describe('LeadStage', () => {
  let component: LeadStage;
  let fixture: ComponentFixture<LeadStage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadStage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadStage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
