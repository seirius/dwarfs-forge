import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheEyeComponent } from './the-eye.component';

describe('TheEyeComponent', () => {
  let component: TheEyeComponent;
  let fixture: ComponentFixture<TheEyeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheEyeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheEyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
