import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterModal } from './master-modal';

describe('MasterModal', () => {
  let component: MasterModal;
  let fixture: ComponentFixture<MasterModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
