import { AbstractControl, FormArray, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { RegExpService } from './helper-regexp';

export class HelperValidators extends Validators {
  constructor() {
    super();
  }

  public static passwordMatch(control: AbstractControl) {
    const password = control.get('password1').value;
    const confirm = control.get('password2').value;
    if (confirm && password) {
      if (password !== confirm) {
        control.get('password2').setErrors({passwordMatch: true});
      } else {
        return null;
      }
    }
  }

  public static passwordMatch2(password, password2) {
    return (control: AbstractControl) => {
      const pass = control.get(password).value;
      const confirm = control.get(password2).value;
      if (!(confirm && pass)) {
        return null;
      }

      if (pass !== confirm) {
       return control.get(password2).setErrors({passwordMatch: true});
      }
      return null;
    };
  }

  public static identicalPassword(control: AbstractControl) {
    const oldPassword = control.get('old_password').value;
    const password = control.get('password2').value;
    if (oldPassword && password) {
      if (password === oldPassword) {
        control.get('password2').setErrors({identicalPassword: true});
      } else {
        return null;
      }
    }
  }

  public static hobbiesLength(control: AbstractControl) {
    const hobby = control.get('hobbies').value;
    const customHobby = control.get('custom_hobbies').value;
    if (hobby && customHobby) {
      return (hobby.length + customHobby.length < 3) ? {hobbiesLength: true} : null;
    }
  }

  public static checkEmail(control: AbstractControl) {
    if (control.value !== null) {
      if (control.value.length > 0) {
        return !RegExpService.email.test(control.value) ? {patternEmail: true} : null;
      }
    }
  }

  public static checkUrl(control: AbstractControl) {
    if (control.value !== null) {
      if (control.value.length > 0) {
        return !RegExpService.url.test(control.value) ? {patternUrl: true} : null;
      }
    }
  }

  public static checkLengthArray(minLength: number = 1): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.value !== null) {
        return !(control.value.length >= minLength) ? {lengthArray: true} : null;
      }
    };
  }

  /**
   * is used for check is exist hobbies
   * @param hobbyCustomList - hobbies, which was added later
   * @param hobbyList - all list hobbies
   */
  public static checkRepeatCustomHobby(hobbyCustomList: any = [], hobbyList: any = []): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const length = control.value ? control.value.length : 0;
      const value = control.value ? control.value.toLowerCase() : '';

      const result1 = hobbyCustomList.some((hobby) => hobby.toLowerCase() === value);
      let result2: any = false;

      hobbyList.map((hobbyGroup) => {
        const tmp = hobbyGroup.items.some((item) => item.name.toLowerCase() === value);
        result2 = !result2 ? tmp : result2;
      });

      return ((result1 || result2) && length > 1) ? {hobbyExist: true} : null;
    };
  }

  // public static checkTime(control: AbstractControl) {
  //   if (control.value !== null) {
  //     const startTime = moment('9:00', 'H:mm');
  //     const endTime = moment(control.value, 'H:mm');
  //
  //     if (control.value.length > 0) {
  //       return Observable
  //         .of(control.value)
  //         .map(result => !(endTime.isSameOrAfter(startTime)) ? {earlyTime: true} : null);
  //     }
  //   }
  // }

  public static checkSpace(control: AbstractControl) {
    if (control.value !== null) {
      return (!control.value.trim().length && control.value.length) ? {strEmpty: true} : null;
    }
  }

  public static checkPhone(control: AbstractControl) {
    if (control.value !== null) {
      if (control.value.indexOf('(') !== -1) {
        const length = control.value.replace(/\D+/g, '').substr(2).length;
        return length !== 10 && length > 0 ? {phone: true} : null;
      }
    }
  }

  public static checkLength(control: AbstractControl) {
    if (control.value !== null) {
      if (control.value.trim().replace(/\s{2,}/ig, ' ').length < 4) {
        return {minlength: true};
      }
      return null;
    }
  }

  public static checkUuid(control: AbstractControl) {
    if (control.value !== null) {
      const value = control.value.trim();
      if (value.length) {
        return !RegExpService.uuid.test(value) ? {uuid: true} : null;
      }
    }
    return null;
  }

  public static uniqueFormArray(control: string): ValidatorFn {
    return (form: AbstractControl) => {
      let isError = false;
      const toEqual = {};
      const formArray = form.get(control) as FormArray;
      formArray.controls.forEach((item: FormGroup, i) => {
        if (toEqual.hasOwnProperty(item.controls.link.value)) {
          isError = true;
          toEqual[item.controls.link.value] += 1;
          (formArray.controls[i] as FormGroup).controls.link.setErrors({duplication: true});
        } else {
          toEqual[item.controls.link.value] = 0;
          (formArray.controls[i] as FormGroup).controls.link.setErrors(null);
        }
      });
      if (isError) {
        return {duplication: true};
      } else {
        return null;
      }
    };
  }

  public static existUser(usersObject: any = {}): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value) {
        if (usersObject[control.value]) {
          return null;
        } else {
          return { userNotExist: true };
        }
      } else {
        return null;
      }
    };
  }

  public static existPlace(minPlace: number, maxPlace: number): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value || control.value === 0) {
        if (control.value >= minPlace && control.value <= maxPlace) {
          return null;
        } else {
          return { placeNotExist: true };
        }
      } else {
        return null;
      }
    };
  }

  public static isNegative(number) {
    return (control: AbstractControl) => {
      return control.value  >= number ? null : {isNegative: true};
    };
  }

}
