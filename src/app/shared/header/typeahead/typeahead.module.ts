import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeaheadComponent } from './typeahead.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TypeaheadComponent,
  ],
  exports: [
    TypeaheadComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class TypeaheadModule { }
