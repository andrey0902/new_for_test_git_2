import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DoCheck,
  EventEmitter,
  InjectionToken,
  OnInit,
  Output,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { TabComponent } from './tab/tab.component';

export const TABS_PARENT_COMPONENT =
  new InjectionToken<any>('TABS_PARENT_COMPONENT');

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TabsComponent implements OnInit, AfterContentInit, DoCheck {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  @Output() toggleTab = new EventEmitter<string>();
  _item: any;
  get item() {
    return this._item;
  }
  set item(value) {
    this._item = value;
    this.toggleTab.emit(this.item.label);
  }
  constructor() { }

  ngOnInit() {
    console.log('log tabs');
  }

  ngAfterContentInit(): void {
  }

  ngDoCheck(): void {
    this.handler();
  }

  handler() {
    if (this.tabs && this.item) {
      this.tabs.forEach((item: TabComponent) => {
        item.active = item === this.item;
      });
    }
  }

}
