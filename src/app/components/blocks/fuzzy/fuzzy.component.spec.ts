import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuzzyComponent } from './fuzzy.component';

describe('FuzzyComponent', () => {
  let component: FuzzyComponent;
  let fixture: ComponentFixture<FuzzyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuzzyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuzzyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
