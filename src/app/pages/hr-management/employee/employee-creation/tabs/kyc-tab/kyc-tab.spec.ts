import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycTab } from './kyc-tab';

describe('KycTab', () => {
  let component: KycTab;
  let fixture: ComponentFixture<KycTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KycTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
