import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadidatePipeline } from './cadidate-pipeline';

describe('CadidatePipeline', () => {
  let component: CadidatePipeline;
  let fixture: ComponentFixture<CadidatePipeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadidatePipeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadidatePipeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
