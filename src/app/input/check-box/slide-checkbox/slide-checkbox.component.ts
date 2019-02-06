import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, OnDestroy, OnInit, ViewEncapsulation
} from '@angular/core';

import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxDefault } from '../cdk/checkbox.based.component';
import { Subject } from 'rxjs/index';


const CHECK_BOX_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SlideCheckboxComponent),
  multi: true
};

let nextUniqueId = 0;

@Component({
  selector: 'app-slide-box',
  templateUrl: './slide-checkbox.component.html',
  styleUrls: ['./slide-checkbox.component.scss'],
  providers: [CHECK_BOX_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideCheckboxComponent extends CheckboxDefault implements OnDestroy {
  public id = `_id_checbox_slider_${nextUniqueId++}`;
  public valueChange$ = new Subject<any>();
  constructor(public cd: ChangeDetectorRef) {
    super(cd);
  }
  onChange(e) {
    super.onChange(e);
    this.valueChange$.next();
  }

  ngOnDestroy() {
    this.valueChange$.complete();
  }
}
