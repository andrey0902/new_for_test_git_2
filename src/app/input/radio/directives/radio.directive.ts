import { Directive, Host, Optional } from '@angular/core';
import { RadioBasedDirective } from '../cdk/radio.based.directive';
import { RadioGroupComponent } from '../radio-group/radio-group.component';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { AppFormFieldControl } from '../../shared/app.form.field.control';

@Directive({
  selector: `app-radio-group [appInput], app-circle-radio-item[appInput]`,
  providers: [{provide: AppFormFieldControl, useExisting: RadioDirective}]
})
export class RadioDirective extends RadioBasedDirective {

  constructor(@Optional() @Host() public parent: RadioGroupComponent,
              @Optional() public ngControl: NgControl,
              @Optional() protected _parentForm: NgForm,
              @Optional() protected _parentFormGroup: FormGroupDirective) {
    super(parent, ngControl, _parentForm, _parentFormGroup);
  }

}
