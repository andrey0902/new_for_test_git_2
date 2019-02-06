import {
  Directive, DoCheck, ElementRef, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit, Optional, Self
} from '@angular/core';
import { AppFormFieldControl } from './shared/app.form.field.control';
import { Observable, Subject } from 'rxjs/index';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { coerceBooleanProperty } from './shared/coerce.boolean';
import { Platform } from './shared/platform/platform';
import { getAppInputUnsupportedTypeError } from './shared/input-errors';
import { getSupportedInputTypes } from './shared/platform/features';
import { ErrorStateMatcher } from './shared/error/error-options';

// Invalid input type. Using one of these will throw an MatInputUnsupportedTypeError.
const MAT_INPUT_INVALID_TYPES = [
  'button',
  'checkbox',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit'
];

let nextUniqueId = 0;

@Directive({
  selector: `input [appInput], textarea [appInput]`,
  //exportAs: 'appInput',
  host: {
    '[attr.id]': 'id',
    '[attr.placeholder]': 'placeholder',
    '[disabled]': 'disabled',
    '[required]': 'required',
    '[readonly]': 'readonly',
    '[attr.aria-describedby]': '_ariaDescribedby || null',
    '[attr.aria-invalid]': 'errorState',
    '[attr.aria-required]': 'required.toString()',
    '(blur)': '_focusChanged(false)',
    '(focus)': '_focusChanged(true)',
    '(input)': '_onInput()',
  },
  providers: [{provide: AppFormFieldControl, useExisting: InputDirective}]
})
export class InputDirective implements OnInit, OnChanges, OnDestroy, DoCheck, AppFormFieldControl<any> {
  shouldLabelFloat: boolean;
  public parentForm;
  public parentFormGroup;
  protected _uid = `app-input-${nextUniqueId++}`;
  protected _previousNativeValue: any;
  private _inputValueAccessor: {value: any};
  /** The aria-describedby attribute on the input for improved a11y. */
  _ariaDescribedby: string;

  /** Whether the component is being rendered on the server. */
  _isServer = false

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  focused = false;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  autofilled = false;


  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  readonly stateChanges: Subject<void> = new Subject<void>();


  constructor( protected _elementRef: ElementRef,
               protected _platform: Platform,
               /** @docs-private */
               @Optional() @Self() public ngControl: NgControl,
               @Optional() private _parentForm: NgForm,

               @Optional() private _parentFormGroup: FormGroupDirective,
               _defaultErrorStateMatcher: ErrorStateMatcher,

              // @Optional() @Self() @Inject(MAT_INPUT_VALUE_ACCESSOR) inputValueAccessor: any,
               ) {
    this.parentForm = _parentForm;
    this.parentFormGroup = _parentFormGroup;

    // If no input value accessor was explicitly specified, use the element as the input value
    // accessor.
    // this._inputValueAccessor = inputValueAccessor || this._elementRef.nativeElement;
    this._inputValueAccessor = this._elementRef.nativeElement;

    this._previousNativeValue = this.value;


    // Force setter to be called in case id was not specified.
    this.id = this.id;
  }

  /**
   * this used for validation
   * */

  get parentGroup() {
    return this._parentFormGroup || this._parentForm;
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input()
  get id(): string { return this._id; }
  set id(value: string) {
    this._id = value || this._uid;
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input()
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }
  set disabled(value: boolean) {
     this._disabled = coerceBooleanProperty(value);

    // Browsers may not fire the blur event if the input is disabled too quickly.
    // Reset from here to ensure that the element doesn't become stuck.
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }
  protected _disabled = false;

 // value: any | InputDirective;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input() placeholder: string;
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) { this._required = coerceBooleanProperty(value); }
  protected _required = false;


  /** Input type of the element. */
  @Input()
  get type(): string { return this._type; }
  set type(value: string) {
    this._type = value || 'text';

    this._validateType();

    // When using Angular inputs, developers are no longer able to set the properties on the native
    // input element. To ensure that bindings for `type` work, we need to sync the setter
    // with the native property. Textarea elements don't support the type property or attribute.
    if (!this._isTextarea() && getSupportedInputTypes().has(this._type)) {
      this._elementRef.nativeElement.type = this._type;
    }
  }
  protected _type = 'text';


  /** An object used to control when error messages are shown. */
  @Input() errorStateMatcher: ErrorStateMatcher;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input()
  get value(): string { return this._inputValueAccessor.value; }
  set value(value: string) {
    if (value !== this.value) {
      this._inputValueAccessor.value = value;
      this.stateChanges.next();
    }
  }

  /** Whether the element is readonly. */
  @Input()
  get readonly(): boolean { return this._readonly; }
  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
  }
  private _readonly = false;

  protected _neverEmptyInputTypes = [
    'date',
    'datetime',
    'datetime-local',
    'month',
    'time',
    'week'
  ].filter(t => getSupportedInputTypes().has(t));

  protected _id: string;



  // @HostBinding('class.focus') public fucus;
  // @HostBinding('style.borderColor')  color = 'green';
  // @HostListener('focus') public setFocus() {
  //   this.focus = !this.focus;
  //   console.log('focus');
  //   this.color = 'coral';
  // }
  //
  // @HostListener('blur') public removeFocus() {
  //   this.focus = !this.focus;
  //   this.color = 'blue';
  // }


  ngOnInit(): void {
  }

  ngOnChanges() {
    this.stateChanges.next();
  }

  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
    }

    // We need to dirty-check the native element's value, because there are some cases where
    // we won't be notified when it changes (e.g. the consumer isn't using forms or they're
    // updating the value using `emitEvent: false`).
    this._dirtyCheckNativeValue();
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  ////////////////////

  /** Focuses the input. */
  focus(): void { this._elementRef.nativeElement.focus(); }

  /** Callback for the cases where the focused state of the input changes. */
  _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused && !this.readonly) {
      this.focused = isFocused;
      this.stateChanges.next();
    }
  }

  _onInput() {
    // This is a noop function and is used to let Angular know whenever the value changes.
    // Angular will run a new change detection each time the `input` event has been dispatched.
    // It's necessary that Angular recognizes the value change, because when floatingLabel
    // is set to false and Angular forms aren't used, the placeholder won't recognize the
    // value changes and will not disappear.
    // Listening to the input event wouldn't be necessary when the input is using the
    // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
  }

  /** Does some manual dirty checking on the native input `value` property. */
  protected _dirtyCheckNativeValue() {
    const newValue = this.value;

    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }

  /** Make sure the input is a supported type. */
  protected _validateType() {
    if (MAT_INPUT_INVALID_TYPES.indexOf(this._type) > -1) {
      throw getAppInputUnsupportedTypeError(this._type);
    }
  }

  /** Checks whether the input type is one of the types that are never empty. */
  protected _isNeverEmpty() {
    return this._neverEmptyInputTypes.indexOf(this._type) > -1;
  }

  /** Checks whether the input is invalid based on the native validation. */
  protected _isBadInput() {
    // The `validity` property won't be present on platform-server.
    const validity = (this._elementRef.nativeElement as HTMLInputElement).validity;
    return validity && validity.badInput;
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get empty(): boolean {
    return !this._isNeverEmpty() && !this._elementRef.nativeElement.value && !this._isBadInput() &&
      !this.autofilled;
  }


  /** Determines if the component host is a textarea. */
  protected _isTextarea() {
    return this._elementRef.nativeElement.nodeName.toLowerCase() === 'textarea';
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids: string[]) { this._ariaDescribedby = ids.join(' '); }


}
