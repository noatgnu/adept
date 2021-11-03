import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockDeletePromptComponent } from './block-delete-prompt.component';

describe('BlockDeletePromptComponent', () => {
  let component: BlockDeletePromptComponent;
  let fixture: ComponentFixture<BlockDeletePromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockDeletePromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockDeletePromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
