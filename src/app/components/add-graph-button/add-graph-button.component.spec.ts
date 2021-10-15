import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGraphButtonComponent } from './add-graph-button.component';

describe('AddGraphButtonComponent', () => {
  let component: AddGraphButtonComponent;
  let fixture: ComponentFixture<AddGraphButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGraphButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGraphButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
