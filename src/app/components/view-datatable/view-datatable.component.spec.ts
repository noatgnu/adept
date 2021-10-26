import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDatatableComponent } from './view-datatable.component';

describe('ViewDatatableComponent', () => {
  let component: ViewDatatableComponent;
  let fixture: ComponentFixture<ViewDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDatatableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
