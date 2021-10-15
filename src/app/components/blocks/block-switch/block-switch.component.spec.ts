import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockSwitchComponent } from './block-switch.component';

describe('BlockSwitchComponent', () => {
  let component: BlockSwitchComponent;
  let fixture: ComponentFixture<BlockSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockSwitchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
