import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileMenuComponent } from './profile-menu.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ProfileMenuComponent
  ],
  exports: [
    ProfileMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class ProfileMenuModule { }
