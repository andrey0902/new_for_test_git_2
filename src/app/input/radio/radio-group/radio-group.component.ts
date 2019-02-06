import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, OnDestroy, OnInit, ViewEncapsulation
} from '@angular/core';
import { RadioBasedComponent } from '../cdk/radio.based.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs/index';

const RADIO_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioGroupComponent),
  multi: true
};

let uniqueName = 0;

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  providers: [RADIO_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupComponent extends RadioBasedComponent implements OnDestroy {
  public groupName = `radio_group_name_${uniqueName++}`;
  public valueChange$ = new Subject<any>();
  value = null;
  constructor(public cd: ChangeDetectorRef) {
    super(cd);
    console.log('groupName', this.groupName);
  }

  doChange(data) {
    super.doChange(data);
    this.valueChange$.next();
    console.log('doChange', data);
  }

  ngOnDestroy() {
    this.valueChange$.next();
    this.valueChange$.complete();
  }

}
