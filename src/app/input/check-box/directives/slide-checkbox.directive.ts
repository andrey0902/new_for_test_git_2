import { Directive, Host, Input, Optional } from '@angular/core';
import { CheckboxBasedDirective } from '../cdk/checkbox.based.directive';
import { SlideCheckboxComponent } from '../slide-checkbox/slide-checkbox.component';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { AppFormFieldControl } from '../../shared/app.form.field.control';
let nextUniqueId = 0;
@Directive({
  selector: 'app-slide-box[appInput]',
  providers: [{provide: AppFormFieldControl, useExisting: SlideCheckboxDirective}]
})
export class SlideCheckboxDirective extends CheckboxBasedDirective {
  private _uid = `id_check_slide_box${nextUniqueId++}`;
  constructor(@Optional() @Host() public parent: SlideCheckboxComponent,
              @Optional() public ngControl: NgControl,
              @Optional() protected _parentForm: NgForm,
              @Optional() protected _parentFormGroup: FormGroupDirective) {
    super(parent, ngControl, _parentForm, _parentFormGroup);
  }

  @Input() set id (value) {
    this._id = value || this._uid;
    this.parent.id = this._id;
  }

  get id () {
    return this._id;
  }
}
