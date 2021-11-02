import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PCAPlotComponent } from './pca-plot.component';

describe('PCAPlotComponent', () => {
  let component: PCAPlotComponent;
  let fixture: ComponentFixture<PCAPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PCAPlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PCAPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
