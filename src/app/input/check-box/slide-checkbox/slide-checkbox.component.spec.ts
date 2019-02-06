import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideCheckboxComponent } from './slide-checkbox.component';

describe('SlideCheckboxComponent', () => {
  let component: SlideCheckboxComponent;
  let fixture: ComponentFixture<SlideCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
