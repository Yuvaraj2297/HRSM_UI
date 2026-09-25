import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationTab } from './education-tab';

describe('EducationTab', () => {
  let component: EducationTab;
  let fixture: ComponentFixture<EducationTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
