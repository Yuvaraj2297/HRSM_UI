import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TlEvaluationScores } from './tl-evaluation-scores';

describe('TlEvaluationScores', () => {
  let component: TlEvaluationScores;
  let fixture: ComponentFixture<TlEvaluationScores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TlEvaluationScores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TlEvaluationScores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
