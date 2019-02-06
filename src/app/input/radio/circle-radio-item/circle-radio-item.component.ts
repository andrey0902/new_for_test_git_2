import { Component, Host, Input, OnInit, Optional } from '@angular/core';
import { RadioGroupComponent } from '../radio-group/radio-group.component';

let circleRadioId = 0;

@Component({
  selector: 'app-circle-radio-item',
  templateUrl: './circle-radio-item.component.html',
  styleUrls: ['./circle-radio-item.component.scss']
})
export class CircleRadioItemComponent {
  @Input() public value: any;
  public id = `_id_circle_radio_${circleRadioId++}`;
  public name = `circle_radio_name_${circleRadioId++}`;
  constructor(@Optional() @Host() private host: RadioGroupComponent) {
  }

  select() {
    this.host && this.host.doChange(this.value);
  }

  checkedValue(): boolean {
     return this.host && (this.host.value === this.value);
  }

}
