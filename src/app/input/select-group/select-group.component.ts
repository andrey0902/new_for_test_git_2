import {
  ChangeDetectionStrategy, Component, ContentChildren, DoCheck, HostBinding, Inject, Input, OnInit, Optional, QueryList,
  ViewEncapsulation
} from '@angular/core';
import { OPTION_PARENT_COMPONENT, SelectOptionComponent } from '../select-option/select-option.component';

@Component({
  selector: 'app-select-group',
  templateUrl: './select-group.component.html',
  styleUrls: ['./select-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SelectGroupComponent implements DoCheck {
  @Input() label = 'group label';
  @ContentChildren(SelectOptionComponent, {descendants: true}) public options: QueryList<SelectOptionComponent>;
  @ContentChildren(SelectGroupComponent) public groups: QueryList<SelectGroupComponent>;

  constructor(@Optional() @Inject(OPTION_PARENT_COMPONENT) private _parent) { }
  @HostBinding('hidden')
  public hidden = false;

  public ngDoCheck() {
    this.hidden = this.hideGroup(this.groups) || this.hideGroup(this.options);
  }
  private hideGroup(type) {
    return type && type.length > 0 ? !type.find((item) => !item.hidden) : false;
  }
}
