import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsMenuComponent implements OnInit {
  @Input() positionHorizontal = true;
  constructor() { }

  ngOnInit() {
  }

}
