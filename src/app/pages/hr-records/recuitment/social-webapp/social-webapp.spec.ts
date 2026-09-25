import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialWebapp } from './social-webapp';

describe('SocialWebapp', () => {
  let component: SocialWebapp;
  let fixture: ComponentFixture<SocialWebapp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialWebapp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialWebapp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
