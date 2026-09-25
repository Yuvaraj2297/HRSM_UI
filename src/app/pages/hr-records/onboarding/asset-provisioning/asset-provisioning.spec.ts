import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetProvisioning } from './asset-provisioning';

describe('AssetProvisioning', () => {
  let component: AssetProvisioning;
  let fixture: ComponentFixture<AssetProvisioning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetProvisioning]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetProvisioning);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
