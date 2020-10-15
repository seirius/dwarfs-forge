import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgeComponent } from './forge.component';

describe('ForgeComponent', () => {
  let component: ForgeComponent;
  let fixture: ComponentFixture<ForgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
