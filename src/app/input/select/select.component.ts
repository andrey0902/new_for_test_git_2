import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, forwardRef, Inject, Injector,
  Input, OnDestroy, OnInit, Optional, QueryList, Self, ViewChild, ViewEncapsulation
} from '@angular/core';
import { FormFieldComponent } from '../form-field/form-field.component';
import {
  ControlValueAccessor, FormControl, FormGroupDirective, NG_VALUE_ACCESSOR, NgControl,
  NgForm
} from '@angular/forms';
import { SelectGroupComponent } from '../select-group/select-group.component';
import { OPTION_PARENT_COMPONENT, SelectOptionComponent } from '../select-option/select-option.component';
import { Observable, Subject } from 'rxjs/index';
import { debounceTime, takeUntil, tap } from 'rxjs/internal/operators';
import { OptionModel } from './option.model';
import { AppFormFieldControl } from '../shared/app.form.field.control';

export const DROPDOWN_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectComponent), // tslint:disable-line
  multi: true,
};

let selectId = 0;

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DROPDOWN_VALUE_ACCESSOR,
    {provide: OPTION_PARENT_COMPONENT, useExisting: SelectComponent},
    {provide: AppFormFieldControl, useExisting: SelectComponent}
    ]
})
export class SelectComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor, AppFormFieldControl<any> {
  @Input() public placeholder = 'Select Option';
  @Input() public searchPlaceholder = 'Search...';
  @Input() public noneField: OptionModel = {label: 'None', value: null};
  @Input() public searchable = false;
  @ContentChildren(SelectOptionComponent, {descendants: true}) dropdownOptions: QueryList<SelectOptionComponent>;
  @ContentChildren(SelectGroupComponent, {descendants: true}) dropdownGroups: QueryList<SelectGroupComponent>;
  @ViewChild(SelectOptionComponent) public emptyOptions: SelectOptionComponent;
  public customPlaceholder = false;
  public isOpen = false;
  public dropDownSearch = new FormControl();
  public notFound = false;
  public searchValue: string;
  public disabled = false;
  protected _uid = `app-select-${selectId++}`;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  readonly stateChanges: Subject<void> = new Subject<void>();
  _id: string;
  ngControl: NgControl | any;
  focused: boolean;
  empty: boolean;
  shouldLabelFloat: boolean;
  required: boolean;
  parentForm;
  parentFormGroup;
  _inputValueAccessor;
  private _value;
  private until: Subject<void> = new Subject<void>();
  private onChange = (value) => {};
  private onTouched = () => {};

  get value() {
    return this._value;
  }

  set value(data: Optional | any) {
    if (typeof data === 'object') {
      this._value = data.value;
      this.placeholder = data.label;
    } else {
      this._value = data;
    }
    if (this.emptyOptions && data.value === this.emptyOptions.value) {
      this.placeholder = this.emptyOptions.label;
    } else if (this.dropdownOptions) {
      this.placeholder = (this.dropdownOptions.find((option: SelectOptionComponent) => option.value === this._value)).label;
      if (this.searchable) {
        this.dropDownSearch.setValue(null, {emitEvent: false});
        this.resetSearch();
      }
    }
    this.isOpen = false;
    this.onChange(this.value);
    this.onTouched();
    this.stateChanges.next();
  }

  get showSearchable() {
    return this.isOpen && this.searchable;
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input()
  get id(): string {
    return this._uid;
  }
  set id(value: string) {
    this._id = value || this._uid;
    this.cd.detectChanges();
  }


  /**
   * this used for validation
   * */

  get parentGroup() {
    return this._parentFormGroup || this._parentForm;
  }
  constructor(
    @Optional() private container: FormFieldComponent,
    private cd: ChangeDetectorRef,
    @Optional() private _parentForm: NgForm,
    private inj: Injector,
    @Optional() private _parentFormGroup: FormGroupDirective,
    @Optional() @Self() @Inject(DROPDOWN_VALUE_ACCESSOR) private inputValueAccessor: any) {
    this.parentForm = _parentForm;
    this.parentFormGroup = _parentFormGroup;

    // If no input value accessor was explicitly specified, use the element as the input value
    // accessor.
  }

  ngOnInit() {
    this.ngControl = this.inj.get(NgControl);

    console.log('control', this.ngControl);
  }

  ngAfterViewInit() {
    if (this.container) {
      this.customPlaceholder = !this.container.label;
      this.cd.detectChanges();
    } else {
      this.customPlaceholder = !!this.placeholder;
      this.cd.detectChanges();
    }

    this.dropDownSearch.valueChanges
      .pipe(
        takeUntil(this.until),
        debounceTime(300),
        tap((v) => this.searchValue = v)
      )
      .subscribe((value: string) => {
        this.dropdownOptions.forEach((option: SelectOptionComponent) => {
          option.hidden = !(option.label + '').toLowerCase().match(value.toLowerCase());
        });
        if (this.dropdownGroups.length > 0) {
          this.filterGroups(this.dropdownGroups, value);
        }
        this.notFound = !this.dropdownOptions.find((option) => !option.hidden);
        this.cd.markForCheck();
      });

    const label = this.dropdownOptions.find((option: SelectOptionComponent) => option.value === this.value);
    if (label) {
      this.placeholder = label.label;
    }

  }

  writeValue(obj: any): void {
    this._value = obj;
    if (this._value && this.dropdownOptions && this.dropdownOptions.length) {
      this.placeholder =
        (this.dropdownOptions.find((option: SelectOptionComponent) => option.value === this._value)).label;
    }
    this.cd.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(value: boolean): void {
    this.disabled = value;
  }

  public ngOnDestroy() {
    this.until.next();
    this.until.complete();
  }

  open() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      this.focused = true;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  close() {
    this.isOpen = false;
    this.focused = false;
    this.onTouched();
    this.stateChanges.next();
  }

  private resetSearch() {
    this.dropdownOptions.forEach((option: SelectOptionComponent) => option.hidden = false);
    this.cd.markForCheck();
  }

  private filterGroups(groups: QueryList<SelectGroupComponent>, value: string) {
    const foundedGroups = [];
    groups.forEach((group: SelectGroupComponent) => {
      group.hidden = false;
      if (! group.label.toLocaleLowerCase().match(value.toLocaleLowerCase())) {
        group.options.forEach((option: SelectOptionComponent) => {
          option.hidden = !option.label.toLocaleLowerCase().match(value.toLocaleLowerCase());
        });
      } else {
        foundedGroups.push(group);
      }
    });
    foundedGroups.forEach((group: SelectGroupComponent) => {
      group.options.forEach((option) => option.hidden = false);
    });
  }

}
