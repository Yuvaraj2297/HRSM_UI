import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionTab } from './permission-tab';

describe('PermissionTab', () => {
  let component: PermissionTab;
  let fixture: ComponentFixture<PermissionTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
