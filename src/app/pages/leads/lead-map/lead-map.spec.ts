import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { LeadMap } from './lead-map';

describe('LeadMap', () => {
  let component: LeadMap;
  let fixture: ComponentFixture<LeadMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadMap],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
