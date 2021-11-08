import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurtainUploaderComponent } from './curtain-uploader.component';

describe('CurtainUploaderComponent', () => {
  let component: CurtainUploaderComponent;
  let fixture: ComponentFixture<CurtainUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurtainUploaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurtainUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
