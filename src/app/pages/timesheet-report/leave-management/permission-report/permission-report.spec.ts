import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionReport } from './permission-report';

describe('PermissionReport', () => {
  let component: PermissionReport;
  let fixture: ComponentFixture<PermissionReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
