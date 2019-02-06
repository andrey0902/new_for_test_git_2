import { Directive, Host, Input, OnChanges, OnDestroy, OnInit, Optional, SkipSelf } from '@angular/core';
import { AppFormFieldControl } from '../../shared/app.form.field.control';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { SearchFieldComponent } from '../search-field/search-field.component';
import { Subject } from 'rxjs/index';
import { coerceBooleanProperty } from '../../shared/coerce.boolean';
let nextUniqueTypehead = 0;
@Directive({
  selector: 'app-search-field[appInput]',
  providers: [{provide: AppFormFieldControl, useExisting: TypeheadDirective}]
})
export class TypeheadDirective implements OnInit, OnDestroy, OnChanges, AppFormFieldControl<any> {
  private _uid = `id_typehead_${nextUniqueTypehead++}`;
  _id: string;
  _focused: boolean;
  _placeholder: string
  empty: boolean;
  shouldLabelFloat: boolean;
  _required: boolean;
  protected _disabled = false;
  public stateChanges = new Subject<any>();
  constructor(@Optional() @Host() public parent: SearchFieldComponent,
              @Optional() public ngControl: NgControl,
              @Optional() protected _parentForm: NgForm,
              @Optional() protected _parentFormGroup: FormGroupDirective) {
    this.parent.valueChange$
      .subscribe(
        () => {
          this.stateChanges.next();
        }
      );
  }

  @Input() set id (value) {
    this._id = value || this._uid;
  }

  get id () {
    return this._id;
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

  @Input()
  public get placeholder(): string {
    return this._placeholder;
  }

  public set placeholder(value) {
    this._placeholder = value;
  }

  @Input()
  public get focused(): boolean {
    return this.parent.focus;
  }

  public set focused(value) {
    this._focused = coerceBooleanProperty(value);
  }

  public get control() {
    return this.ngControl;
  }

  public get value() {
    return this.parent.searchControl ? this.parent.searchControl.value : null;
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
