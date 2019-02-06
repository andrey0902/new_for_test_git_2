import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angularTabs';
  activeTab = 'first';
  constructor() {}

  setActiveTab(tabLabel: string) {
    this.activeTab = tabLabel;
  }
}
