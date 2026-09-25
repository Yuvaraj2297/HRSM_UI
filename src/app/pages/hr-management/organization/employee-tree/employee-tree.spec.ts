import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTree } from './employee-tree';

describe('EmployeeTree', () => {
  let component: EmployeeTree;
  let fixture: ComponentFixture<EmployeeTree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
