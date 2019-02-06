import { Input, OnChanges, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { AppFormFieldControl } from '../../shared/app.form.field.control';
import { Subject } from 'rxjs/index';
import { coerceBooleanProperty } from '../../shared/coerce.boolean';

export class RadioBasedDirective implements AppFormFieldControl<any>, OnInit, OnDestroy, OnChanges {
  id: string;
  _id: string;
  placeholder: string;
  focused: boolean;
  empty: boolean;
  shouldLabelFloat: boolean;
  _required: boolean;
  protected _disabled = false;
  public stateChanges = new Subject<any>();

  constructor(@Optional() public parent: any,
              @Optional() public ngControl: NgControl,
              @Optional() protected _parentForm: NgForm,
              @Optional() protected _parentFormGroup: FormGroupDirective) {
  }
  ngOnInit(): void {
    if (this.parent) {
      this.parent.valueChange$
        .subscribe(() => {
        console.log('status change');
          this.stateChanges.next();
        });
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  ngOnChanges(): void {
    this.stateChanges.next();
  }
  @Input() set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.parent.setDisabledState(coerceBooleanProperty(value));
  }

  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }

  @Input()
  public get required(): boolean {
    return this._required;
  }

  public set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }

  public get control() {
    return this.ngControl;
  }

  public get value() {
    return this.control && this.control.control ? this.control.control.value : null;
  }

  public set value(value: string) {
    if (value !== this.value) {
      this.control.control.setValue(value);
      this.stateChanges.next();
    }
  }

  get parentGroup() {
    return this._parentFormGroup || this._parentForm;
  }
}
