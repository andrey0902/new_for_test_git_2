import {
  AfterViewInit, ChangeDetectorRef, Directive, HostBinding, Injector, Input, OnDestroy, Optional, ViewContainerRef
} from '@angular/core';
import { FormControl, FormGroupDirective } from '@angular/forms';
import { get, has } from 'lodash';
import { Subject } from 'rxjs/index';
// import { InputComponent } from './input/input.component';
import { takeUntil } from 'rxjs/internal/operators';
import { FormFieldComponent } from './form-field/form-field.component';
import { AppFormFieldControl } from './shared/app.form.field.control';
// import { MatInput, MatSelect } from '@angular/material';
//tslint:disable

@Directive({
  selector: 'app-server-error'
})
export class ServerErrorDirective implements AfterViewInit, OnDestroy {
  @Input() public key: string[];
  @HostBinding('hidden') public hidden: boolean = true;

  @Input() set error(errors) {

    if(errors && has(errors, this.key.join('.'))) {
      this.errorMessage = get(errors, this.key.join('.'));

      this.setContent(this.errorMessage);

       // console.log('instanceof',this.control.ngControl.control instanceof FormControl);
        if (this.control && this.control.ngControl.control instanceof FormControl) {
          this.control.ngControl.control.setErrors({serverError: this.errorMessage});

          // do next for trigger handler error frontend validation
          this.control.stateChanges.next(true);
        }

      this.hidden = false;
      return;
    }

    this.hideError();

  }
 // private control: MatInput | MatSelect;
  private control: AppFormFieldControl<any> | null;
  private errorMessage: string;
  private until = new Subject();
  constructor(@Optional() private container: FormFieldComponent,
              @Optional() public form: FormGroupDirective,
              private injector: Injector,
              private viewContainer: ViewContainerRef,
              private cd: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    this.control =  this.container
      ? this.container.appInput
      : null;
    if (this.control) {
      this.control.stateChanges
        .pipe(
          takeUntil(this.until),
        )
        .subscribe(() => {
          this.hideError();
          this.cd.markForCheck();
        });
    }
  }

  ngOnDestroy(): void {
    this.until.next();
    this.until.unsubscribe();
  }

  setContent(value) {
    this.viewContainer.element.nativeElement.innerHTML = value;
  }

  hideError() {
    this.hidden = true;
    this.setContent('');
  }
}
