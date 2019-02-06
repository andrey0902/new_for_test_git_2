import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostListener, Input, OnDestroy,
  OnInit, Output, TemplateRef, ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeWhile, tap } from 'rxjs/internal/operators';
import { Subject } from 'rxjs/index';
import { SearchDataService } from '../shared/search.data.service';
import { TypeheadItemModel } from '../shared/typehead.item.model';

const TYPEHEAD_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchFieldComponent),
  multi: true
};

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss'],
  providers: [TYPEHEAD_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFieldComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() startFrom = 2;
  @Input() placeholder = 2;
  @Input() dataService: SearchDataService;
  @Input() itemTemplate: TemplateRef<any>;
  @Input() set value(value: string) {
    if (value) {
      this.createControl();
      this.controlSetValue(value);
    }
  }

  @Output() valueSearch = new EventEmitter<string | TypeheadItemModel> ();
  public valueChange$ = new Subject<any>();
  searchControl: FormControl;
  componentActive = true;
  handler = new Subject();
  searchResult: TypeheadItemModel[] = [];
  activeItem = 0;
  isChose = false;
  disabled = false;
  focus = false;
  onChange = (v: any) => {};
  onTouch = () => {};
  constructor(private fb: FormBuilder,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
   this.init();
  }

  init() {
    if (!this.searchControl) {
      this.createControl();
    }
    this.changeValue();
    this.handlerSearch();
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(val: boolean): void {
    if (val) {
      this.searchControl.disable({onlySelf: val});
      this.disabled = val;
      return;
    }
    this.searchControl.enable({onlySelf: val});
  }

  createControl() {
    this.searchControl = this.fb.control(null);
  }

  setDefaultParams() {
    this.searchResult = [];
    this.activeItem = 0;
  }

  controlSetValue(value: string) {
    this.isChose = true;
    this.searchControl.setValue(value);
    this.setDefaultParams();
  }

  changeValue() {
    this.searchControl
      .valueChanges
      .pipe(
        takeWhile(() => this.componentActive),
        debounceTime(500),
        distinctUntilChanged(),
        filter( (val) => {
          this.setDefaultParams();
          if (!this.isChose) {
            const res = val || '';
            this.valueSearch.emit(res);
            this.valueChange$.next();
            this.onChange(res);
          }
          this.onTouch();
          this.cd.markForCheck();
          return val && val.length >= this.startFrom;
        })
      )
      .subscribe((value) => {
      if (this.isChose) {
        return this.isChose = false;
      }
          this.handler.next(value);
      });
  }

  handlerSearch() {
    this.handler
      .pipe(
        takeWhile(() => this.componentActive),
        switchMap((value: string) => this.dataService.getData(value))
      )
      .subscribe((result: any[]) => {
        this.searchResult = result;
        this.cd.markForCheck();
      });
  }

  onChoseItem(e: TypeheadItemModel) {
    const res = e.item.name;
    this.valueSearch.emit(res);
    this.controlSetValue(res);
    this.onChange(res);
    this.valueChange$.next();
  }

  nextActive() {
    if (this.searchResult && this.activeItem < (this.searchResult.length - 1)) {
      this.setActive(this.activeItem + 1);
    }
  }

  prevActive() {
    if (this.searchResult && this.activeItem > 0) {
      this.setActive(this.activeItem - 1);
    }
  }

  setActive(value: number) {
    this.activeItem = value;
    this.cd.markForCheck();
  }

  public focusChange(e) {
    this.focus = e;
    this.cd.markForCheck();
  }
}
