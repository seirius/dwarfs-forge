import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleBuilderComponent } from './simple-builder.component';

describe('SimpleBuilderComponent', () => {
  let component: SimpleBuilderComponent;
  let fixture: ComponentFixture<SimpleBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
