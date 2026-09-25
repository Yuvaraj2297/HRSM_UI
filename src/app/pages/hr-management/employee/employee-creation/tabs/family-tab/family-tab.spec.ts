import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyTab } from './family-tab';

describe('FamilyTab', () => {
  let component: FamilyTab;
  let fixture: ComponentFixture<FamilyTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
