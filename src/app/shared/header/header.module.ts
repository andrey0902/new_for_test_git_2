import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { TypeaheadModule } from './typeahead/typeahead.module';
import { NavigationModule } from '../navigation/navigation.module';


@NgModule({
  declarations: [
    HeaderComponent,
  ],
  exports: [
    HeaderComponent
  ],
  imports: [
    CommonModule,

    TypeaheadModule,
    NavigationModule,
  ]
})
export class HeaderModule { }
