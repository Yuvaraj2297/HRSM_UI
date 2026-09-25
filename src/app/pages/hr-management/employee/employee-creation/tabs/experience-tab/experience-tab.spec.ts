import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceTab } from './experience-tab';

describe('ExperienceTab', () => {
  let component: ExperienceTab;
  let fixture: ComponentFixture<ExperienceTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienceTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
