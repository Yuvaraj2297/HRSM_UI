import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTab } from './document-tab';

describe('DocumentTab', () => {
  let component: DocumentTab;
  let fixture: ComponentFixture<DocumentTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
