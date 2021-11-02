import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuzzyPlotComponent } from './fuzzy-plot.component';

describe('FuzzyPlotComponent', () => {
  let component: FuzzyPlotComponent;
  let fixture: ComponentFixture<FuzzyPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuzzyPlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuzzyPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
