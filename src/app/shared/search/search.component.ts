import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent  implements OnInit, OnDestroy {
  @Input() placeholder = 'Search';

  @Output() changeSearch = new EventEmitter<string>();

  control: FormControl;
  componentActive = true;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createControl();
    this.handlerChanges();
  }

  createControl() {
    this.control = this.fb.control('');
  }

  handlerChanges() {
    this.control.valueChanges
      .pipe(
        takeWhile(() => this.componentActive),
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((value) => {

        const val = value ? value : '';
        this.changeSearch.emit(val);
      }, error => {
        console.warn(error);
      });
  }

  ngOnDestroy() {
    this.componentActive = false;
  }
}

