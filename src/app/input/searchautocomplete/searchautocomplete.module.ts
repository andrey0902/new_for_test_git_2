import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFieldComponent } from './search-field/search-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownItemComponent } from './dropdown-item/dropdown-item.component';
import { ClickOutSideDirective } from './shared/click-out-side.directive';
import { TypeheadDirective } from './shared/typehead.directive';

@NgModule({
  declarations: [
    SearchFieldComponent,
    DropdownItemComponent,
    ClickOutSideDirective,
    TypeheadDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    SearchFieldComponent,
    ClickOutSideDirective,
    TypeheadDirective,
  ]
})
export class SearchautocompleteModule { }
