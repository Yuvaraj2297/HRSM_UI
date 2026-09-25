import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOpening } from './job-opening';

describe('JobOpening', () => {
  let component: JobOpening;
  let fixture: ComponentFixture<JobOpening>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobOpening]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobOpening);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
