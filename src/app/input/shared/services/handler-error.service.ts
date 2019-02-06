import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { ErrorMessageModel } from '../models/errorMessage.model';

export const ERROR_CONFIG = new InjectionToken<string>('ErrorConfig');

@Injectable()
export class HandlerErrorService {
  public readonly errorMessages: ErrorMessageModel = {
    'isNegative': () => 'this field is not have negative value',
    'patternUrl': () => 'Url pattern is invalid',
    'strEmpty': () => 'This field is not have only spaces',
    'required': () => 'This field is required',
    'minlength': (params) => 'The min number of characters is ' + params.requiredLength,
    'maxlength': (params) => 'The max allowed number of characters is ' + params.requiredLength,
    'pattern': (params) => 'The required pattern is: ' + params.requiredPattern,
    'years': (params) => params.message,
    'countryCity': (params) => params.message,
    'uniqueName': (params) => params.message,
    'telephoneNumbers': (params) => params.message,
    'telephoneNumber': (params) => params.message,
    'patternEmail' : () => 'Is not correct email',
    'passwordMatch': () => 'Passwords do not match',
    'lessValue': () => 'Choose bigger number',
    'maxValue': (params) => 'Max value is ' + params,
    'minValue': (params) => 'Min value is ' + params,
    'timeDecimalError': (params) => 'Incorrect time format',
    'email': (params) => `Email ${params}`,
    'serverError': (params) => `${params}`
  };
  private newErrorsMessagesDef: {[key: string]: ErrorMessageModel};

  constructor(@Optional() @Inject(ERROR_CONFIG) private config: ErrorMessageModel ) {
    if (config) {
      this.newErrorsMessagesDef = {
        def: this.updateErrors(config)
      };
    }
  }

  public getError(control: NgControl) {
   return Object.keys(control.errors);
  }
 /**
  * config used for get custom error messages
  * we get error from config or default settings
  * */

  public newGetMessage(name: string, params: any, id: string) {
    return  this.newGetErrorsList(id)[name](params);
  }

  public getAllErrors(control: AbstractControl, listError: string[], id: string) {
    const res: string[] = [];

    listError.forEach((errName) => {
      res.push(this.newGetMessage(errName, control.errors[errName], id));
    });
    return res;
  }

  updateErrors(newErrors: ErrorMessageModel) {
    return Object.assign({}, this.errorMessages, newErrors);
  }

  newGetErrorsList(id): ErrorMessageModel {
    if (!this.newErrorsMessagesDef) {
      return this.errorMessages;
    }
    return this.newErrorsMessagesDef[id]
      || this.newErrorsMessagesDef['def']
      || this.errorMessages;
  }

  setRefMessage(id: string, messages: ErrorMessageModel) {
    this.newErrorsMessagesDef[id] = Object.setPrototypeOf(messages, this.newErrorsMessagesDef['def']);
  }
}
