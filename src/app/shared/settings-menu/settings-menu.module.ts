import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsMenuComponent } from './settings-menu.component';
import { SettingsMenuItemComponent } from './settings-menu-item/settings-menu-item.component';

@NgModule({
  declarations: [
    SettingsMenuComponent,
    SettingsMenuItemComponent
  ],
  exports: [
    SettingsMenuComponent,
    SettingsMenuItemComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SettingsMenuModule { }
