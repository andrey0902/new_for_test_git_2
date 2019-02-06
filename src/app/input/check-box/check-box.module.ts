import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckBoxDirective } from './directives/check-box.directive';
import { CheckBoxComponent } from './check-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SlideCheckboxComponent } from './slide-checkbox/slide-checkbox.component';
import { SlideCheckboxDirective } from './directives/slide-checkbox.directive';

@NgModule({
  declarations: [
    CheckBoxComponent,
    CheckBoxDirective,
    SlideCheckboxComponent,
    SlideCheckboxDirective,
  ],
  exports: [
    CheckBoxComponent,
    CheckBoxDirective,
    SlideCheckboxComponent,
    SlideCheckboxDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CheckBoxModule { }
