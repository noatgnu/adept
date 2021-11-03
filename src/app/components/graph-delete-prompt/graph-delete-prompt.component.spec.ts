import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphDeletePromptComponent } from './graph-delete-prompt.component';

describe('GraphDeletePromptComponent', () => {
  let component: GraphDeletePromptComponent;
  let fixture: ComponentFixture<GraphDeletePromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphDeletePromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphDeletePromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
