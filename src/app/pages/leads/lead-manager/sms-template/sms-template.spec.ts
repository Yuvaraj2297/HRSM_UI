import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { SmsTemplate } from './sms-template';

describe('SmsTemplate', () => {
  let component: SmsTemplate;
  let fixture: ComponentFixture<SmsTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsTemplate],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
