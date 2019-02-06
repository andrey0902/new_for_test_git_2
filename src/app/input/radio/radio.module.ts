import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioItemComponent } from './radio-item/radio-item.component';
import { RadioGroupComponent } from './radio-group/radio-group.component';
import { RadioDirective } from './directives/radio.directive';
import { CircleRadioItemComponent } from './circle-radio-item/circle-radio-item.component';

@NgModule({
  declarations: [
    RadioItemComponent,
    RadioGroupComponent,
    CircleRadioItemComponent,

    RadioDirective,
  ],
  exports: [
    RadioItemComponent,
    RadioGroupComponent,
    CircleRadioItemComponent,

    RadioDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class RadioModule { }
