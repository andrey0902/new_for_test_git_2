import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, OnInit, ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs/index';
import { CheckboxDefault } from './cdk/checkbox.based.component';

let nextUniqueId = 0;

const CHECK_BOX_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckBoxComponent),
  multi: true
};
@Component({
  selector: 'app-checkbox',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss'],
  providers: [CHECK_BOX_VALUE_ACCESSOR ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckBoxComponent extends CheckboxDefault implements OnDestroy {
  public id = `_id_checkbox${nextUniqueId++}`;
  public valueChange$ = new Subject<any>();
  @Input() path;
  //@Input() path = './assets/check-mark-black-outline.svg';

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
