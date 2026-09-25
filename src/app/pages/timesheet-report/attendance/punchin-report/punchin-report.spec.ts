import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunchinReport } from './punchin-report';

describe('PunchinReport', () => {
  let component: PunchinReport;
  let fixture: ComponentFixture<PunchinReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PunchinReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PunchinReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
