import { Component, forwardRef, Inject, Input, OnInit, Optional } from '@angular/core';
import { TABS_PARENT_COMPONENT, TabsComponent } from '../tabs.component';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {
  @Input() label: string;
  @Input() set activeTab(value) {
    console.log('set active tab', value);
    if (value) {
      this.active = value;
      this._parent.item = this;
    }
  }
  active: boolean;
  constructor(@Optional() @Inject(forwardRef(() => TabsComponent)) private _parent) { }

  ngOnInit() {
  }

  onClick() {
    this._parent.item = this;
    // this.active = !this.active;
  }

}
