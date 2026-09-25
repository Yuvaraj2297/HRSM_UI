import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReuseModel } from './reuse-model';

describe('ReuseModel', () => {
  let component: ReuseModel;
  let fixture: ComponentFixture<ReuseModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReuseModel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReuseModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
