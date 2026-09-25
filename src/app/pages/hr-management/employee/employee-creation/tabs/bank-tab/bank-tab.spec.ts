import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankTab } from './bank-tab';

describe('BankTab', () => {
  let component: BankTab;
  let fixture: ComponentFixture<BankTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
