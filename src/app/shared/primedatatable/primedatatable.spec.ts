import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeDataTable } from './primedatatable';

describe('PrimeDataTable', () => {
  let component: PrimeDataTable;
  let fixture: ComponentFixture<PrimeDataTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeDataTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimeDataTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
