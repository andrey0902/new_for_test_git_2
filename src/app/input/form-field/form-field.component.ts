import { AfterContentInit, Component, ContentChild, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { InputDirective } from '../input.directive';
import { AppFormFieldControl } from '../shared/app.form.field.control';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormFieldComponent implements OnInit, AfterContentInit {
  @ContentChild(AppFormFieldControl) public appInput: AppFormFieldControl<any>;
  @ContentChild(LabelComponent) public label: LabelComponent;
  @Input() mode = false;
  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    console.log('appInput', this.appInput);
  }

}
