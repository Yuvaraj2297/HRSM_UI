import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizerSettings } from './customizer-settings';

describe('CustomizerSettings', () => {
  let component: CustomizerSettings;
  let fixture: ComponentFixture<CustomizerSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizerSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomizerSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
