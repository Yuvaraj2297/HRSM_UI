import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermissionModal } from './role-permission-modal';

describe('RolePermissionModal', () => {
  let component: RolePermissionModal;
  let fixture: ComponentFixture<RolePermissionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolePermissionModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolePermissionModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
