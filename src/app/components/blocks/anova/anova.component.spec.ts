import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnovaComponent } from './anova.component';

describe('AnovaComponent', () => {
  let component: AnovaComponent;
  let fixture: ComponentFixture<AnovaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnovaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnovaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
