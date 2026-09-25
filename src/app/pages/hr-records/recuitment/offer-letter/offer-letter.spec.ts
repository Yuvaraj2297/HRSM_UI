import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetter } from './offer-letter';

describe('OfferLetter', () => {
  let component: OfferLetter;
  let fixture: ComponentFixture<OfferLetter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferLetter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferLetter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
