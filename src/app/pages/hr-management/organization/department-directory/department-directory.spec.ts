import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentDirectory } from './department-directory';

describe('DepartmentDirectory', () => {
  let component: DepartmentDirectory;
  let fixture: ComponentFixture<DepartmentDirectory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentDirectory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentDirectory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
