import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from './form-field/form-field.component';
import { InputDirective } from './input.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputErrorComponent } from './input-error/input-error.component';
import { ERROR_CONFIG, HandlerErrorService } from './shared/services/handler-error.service';
import { ErrorMessageModel } from './shared/models/errorMessage.model';
import { LabelComponent } from './label/label.component';
import { CheckBoxModule } from './check-box/check-box.module';
import { RadioModule } from './radio/radio.module';
import { SelectComponent } from './select/select.component';
import { SelectGroupComponent } from './select-group/select-group.component';
import { SelectOptionComponent } from './select-option/select-option.component';
import { SearchautocompleteModule } from './searchautocomplete/searchautocomplete.module';
import { FocusDirective } from './focus.directive';
import { ServerErrorDirective } from './server-error.directive';

@NgModule({
  declarations: [
    FormFieldComponent,
    InputDirective,
    InputErrorComponent,
    LabelComponent,
    SelectComponent,
    SelectGroupComponent,
    SelectOptionComponent,
    FocusDirective,

    ServerErrorDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    SearchautocompleteModule,

    CheckBoxModule,
    RadioModule,
  ],
  exports: [
    FormFieldComponent,
    InputDirective,
    InputErrorComponent,
    LabelComponent,
    SelectComponent,
    SelectGroupComponent,
    SelectOptionComponent,
    SearchautocompleteModule,

    ServerErrorDirective,

    CheckBoxModule,
    RadioModule,
  ],
  providers: [
    HandlerErrorService
  ]
})
export class InputModule {
  constructor (@Optional() @SkipSelf() parentModule: InputModule) {
    // if (parentModule) {
    //   throw new Error(
    //     'InputModule is already loaded. Import it in the AppModule only');
    // }
  }

  static forRoot(config?: ErrorMessageModel): ModuleWithProviders {
    return {
      ngModule: InputModule,
      providers: [
        {provide: ERROR_CONFIG, useValue: config }
      ]
    };
  }
}
