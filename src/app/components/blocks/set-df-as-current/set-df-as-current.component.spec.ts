import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDfAsCurrentComponent } from './set-df-as-current.component';

describe('SetDfAsCurrentComponent', () => {
  let component: SetDfAsCurrentComponent;
  let fixture: ComponentFixture<SetDfAsCurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetDfAsCurrentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetDfAsCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
