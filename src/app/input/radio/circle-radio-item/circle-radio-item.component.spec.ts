import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleRadioItemComponent } from './circle-radio-item.component';

describe('CircleRadioItemComponent', () => {
  let component: CircleRadioItemComponent;
  let fixture: ComponentFixture<CircleRadioItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircleRadioItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleRadioItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
