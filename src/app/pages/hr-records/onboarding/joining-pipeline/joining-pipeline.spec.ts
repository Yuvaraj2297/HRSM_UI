import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningPipeline } from './joining-pipeline';

describe('JoiningPipeline', () => {
  let component: JoiningPipeline;
  let fixture: ComponentFixture<JoiningPipeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoiningPipeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoiningPipeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
