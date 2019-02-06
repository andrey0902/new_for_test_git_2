import { Subject } from 'rxjs/index';
import { Input, OnChanges, OnDestroy, OnInit, Optional } from '@angular/core';
import { coerceBooleanProperty } from '../../shared/coerce.boolean';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';

export class CheckboxBasedDirective implements OnInit, OnDestroy, OnChanges {
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
              @Optional() protected _parentFormGroup: FormGroupDirective
  ) {
    this.parent.valueChange$
      .subscribe(
      () => {
        this.stateChanges.next();
      }
    );
  }
  ngOnInit(): void {
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

  // @HostListener('focus', ['$event'])
  // @HostListener('blur', ['$event'])
  // public focusChange(e) {
  //   this.stateChanges.next();
  // }
}

