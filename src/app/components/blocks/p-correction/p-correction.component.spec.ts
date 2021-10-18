import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PCorrectionComponent } from './p-correction.component';

describe('PCorrectionComponent', () => {
  let component: PCorrectionComponent;
  let fixture: ComponentFixture<PCorrectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PCorrectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
