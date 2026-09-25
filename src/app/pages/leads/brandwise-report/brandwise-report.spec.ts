import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { BrandwiseReport } from './brandwise-report';

describe('BrandwiseReport', () => {
  let component: BrandwiseReport;
  let fixture: ComponentFixture<BrandwiseReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandwiseReport],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandwiseReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
