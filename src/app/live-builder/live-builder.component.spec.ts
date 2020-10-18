import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveBuilderComponent } from './live-builder.component';

describe('LiveBuilderComponent', () => {
  let component: LiveBuilderComponent;
  let fixture: ComponentFixture<LiveBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
