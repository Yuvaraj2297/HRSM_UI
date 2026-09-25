import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuitmentReport } from './recuitment-report';

describe('RecuitmentReport', () => {
  let component: RecuitmentReport;
  let fixture: ComponentFixture<RecuitmentReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuitmentReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuitmentReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
