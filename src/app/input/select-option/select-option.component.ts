import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostBinding, HostListener, Inject, InjectionToken,
  Input, OnInit, Optional, ViewEncapsulation
} from '@angular/core';
import { OptionModel } from '../select/option.model';

export const OPTION_PARENT_COMPONENT =
  new InjectionToken<any>('OPTION_PARENT_COMPONENT');

@Component({
  selector: 'app-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SelectOptionComponent implements AfterViewInit {
  @Input() public value;
  @Input() public emmitable = true;
  public label: string;

  @HostBinding('hidden')
  public hidden = false;
  constructor(private element: ElementRef,
              @Optional() @Inject(OPTION_PARENT_COMPONENT) private _parent) { }

  @HostListener('click')
  public onClick() {
    this.emitData();
  }

  public ngAfterViewInit() {
    this.label = this.element.nativeElement.innerText;
  }
  private emitData() {
    if (this.emmitable) {
      const data: OptionModel = {
        value: this.value,
        label: this.label
      };
      console.log('this._parent', this._parent);
      this._parent.value = data;
    }
  }
}
