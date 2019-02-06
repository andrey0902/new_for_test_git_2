import { Component, Host, Input, OnDestroy, OnInit } from '@angular/core';
import { ErrorMessageModel } from '../shared/models/errorMessage.model';
import { FormFieldComponent } from '../form-field/form-field.component';
import { HandlerErrorService } from '../shared/services/handler-error.service';
import { Observable, Subject } from 'rxjs/index';
import { AbstractControl, FormControl, NgControl, ValidationErrors } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { first, skip, takeWhile, tap } from 'rxjs/internal/operators';

@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.scss']
})
export class InputErrorComponent implements OnInit, OnDestroy {
  id: string = '_' + Math.random().toString(36).substr(2, 9);
  public onDestroy$ = new Subject();

  errorMessage: string| string[];

  @Input() showAllMessage = false;
  /**
   * used for update new local message for current component
   * */
  @Input() configMessage: ErrorMessageModel;

  constructor(@Host() private parent: FormFieldComponent,
              public handlerErrors: HandlerErrorService) { }

  ngOnInit(): void {
    this.init();
    //console.log('parentFormGroup', this.parent.appInput.parentFormGroup);
    //console.log('parentFormGroup', this.parent);
  }

  createRefUniqueMessage() {
    this.handlerErrors.setRefMessage(this.id, this.configMessage);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
  }

  init() {
    this.changeControl();
    if (this.configMessage) {
      this.createRefUniqueMessage();
    }
  }

  isState(): Observable<any> {
    // (this.parent.appInput.ngControl || this.parent.appInput.controlSelect)
    if ( this.parent && this.parent.appInput) {
      return (this.parent.appInput).stateChanges;
    }
    return null;
  }
  /**
   * errorStateMatcher used for defined first state of control
   * show error or not
   * */
  errorStateMatcher(): boolean {
    const control = this.getControl();
    const parentFormGroup = this.parent.appInput.parentGroup;
    // && control.dirty
    // return control.touched;
    // console.log('show error', (control && control.invalid && ((control.dirty && control.touched) || (parentFormGroup && parentFormGroup.submitted))))
    return (control && control.invalid && ((control.dirty && control.touched) || (parentFormGroup && parentFormGroup.submitted)));
  }

  getControl(): NgControl | null {
    // (this.parent.appInput.ngControl || this.parent.controlSelect)
    return this.parent.appInput.ngControl;
  }

  changeControl(): void {
    const state: Observable<any> | null = this.isState();

    if (state) {
      this.handlerChang(state);
    }
  }

  handlerChang(state: Observable<any>) {

    state
      .pipe(
        tap(() => {
            if (!this.errorStateMatcher()) {
              this.errorMessage = null;
            }
        }),
        filter(() => {
          return this.errorStateMatcher();
        }),
        // skip(1),
        takeUntil(this.onDestroy$)
      )
      .subscribe(value => {
        console.log('run find error');
        this.errorMessage = this.handlerError();
      });
/**
 * handler for event submit form
 * */
    this.parent.appInput.parentGroup
      .ngSubmit
      .pipe(takeUntil( this.onDestroy$))
      .subscribe(
        data => {
          this.markControlAsDirty(this.parent.appInput.parentGroup.control.controls);
          this.errorMessage = this.handlerError();
        }
      );
  }

  hasErrors(control: NgControl): ValidationErrors | null {
    return control ? control.errors : null;
  }

  handlerError(): string | string[] {
    const control = this.getControl();

    const errors = this.hasErrors(control);

    if (errors) {
      const listErrorsName: string[] = this.handlerErrors.getError(control);

      return this.getErrorMessage(control, listErrorsName);
    }
    return null;
  }
  /**
   * return value errors
   * */
  getErrorMessage(control, listError: string[]): string | string[] {
    if (this.showAllMessage) {
      return this.getAllMessage(control, listError);
    }
    return this.getSingMessage(control, listError);
  }

  getSingMessage(control, listError): string {
    const errorName: string = this.selectMessage(listError);

    return this.handlerErrors.newGetMessage(
      errorName,
      control.errors[errorName],
      this.id
    );
  }

  getAllMessage(control, listError): string[] {
    return this.handlerErrors.getAllErrors(control, listError, this.id);
  }

  selectMessage(messages: any[]): string {
    return messages[0];
  }
/**
 * mark all controls as dirty
 * */
  markControlAsDirty(controls: { [key: string]: AbstractControl }): void {
    const controlNames = Object.keys(controls);
    controlNames.forEach((name) => {
      const control = controls[name];
      control.markAsDirty({onlySelf: true} );
      control.markAsTouched({onlySelf: true} );
    });
  }

}
