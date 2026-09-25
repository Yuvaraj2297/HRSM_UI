import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelievingTab } from './relieving-tab';

describe('RelievingTab', () => {
  let component: RelievingTab;
  let fixture: ComponentFixture<RelievingTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelievingTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelievingTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
