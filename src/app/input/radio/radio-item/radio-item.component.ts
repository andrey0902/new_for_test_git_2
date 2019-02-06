import { Component, Host, Input, Optional } from '@angular/core';
import { RadioGroupComponent } from '../radio-group/radio-group.component';

let uniqueUidRadio = 0;

@Component({
  selector: 'app-radio-item',
  templateUrl: './radio-item.component.html',
  styleUrls: ['./radio-item.component.scss']
})
export class RadioItemComponent {
  @Input() public value: any;
  public id = `_id_radio_${uniqueUidRadio++}`;
  public name = `local_radio_name_${uniqueUidRadio++}`;
  constructor(@Optional() @Host() private host: RadioGroupComponent) {
  }

  select() {
    this.host && this.host.doChange(this.value);
  }

  checkedValue(): boolean {
    return this.host && (this.host.value === this.value);
  }

}
