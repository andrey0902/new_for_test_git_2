import { Directive, Host, HostListener, Input, OnChanges, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { AppFormFieldControl } from '../../shared/app.form.field.control';
import { Observable, Subject } from 'rxjs/index';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { CheckBoxComponent } from '../check-box.component';
import { coerceBooleanProperty } from '../../shared/coerce.boolean';
import { CheckboxBasedDirective } from '../cdk/checkbox.based.directive';

let nextUniqueId = 0;

@Directive({
  selector: `app-checkbox [appInput]`,
  providers: [{provide: AppFormFieldControl, useExisting: CheckBoxDirective}]
})
export class CheckBoxDirective extends CheckboxBasedDirective implements AppFormFieldControl<any>, OnInit, OnDestroy, OnChanges {
private _uid = `id_check_box${nextUniqueId++}`;
  // public stateChanges = new Subject<any>();
  //
  // _id: string;
  // placeholder: string;
  // focused: boolean;
  // empty: boolean;
  // shouldLabelFloat: boolean;
  // _required: boolean;
  //
  // protected _disabled = false;

  constructor(@Optional() @Host() public parent: CheckBoxComponent,
              @Optional() @Self() public ngControl: NgControl,
              @Optional() protected _parentForm: NgForm,
              @Optional() protected _parentFormGroup: FormGroupDirective
              ) {
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
