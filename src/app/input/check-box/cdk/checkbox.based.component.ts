
import { ControlValueAccessor } from '@angular/forms';

export class CheckboxDefault implements ControlValueAccessor {
  public defaultValue: boolean;
  disabled = false;
  simpleChange = (a: any) => {};
  onTouched = () => {};

  constructor(public cd) { }

  writeValue(obj: any): void {
    this.defaultValue = obj;
  }

  registerOnChange(fn: any): void {
    this.simpleChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(val) {
    this.disabled = val;
    this.cd.markForCheck();
  }

  onChange(e) {
    this.simpleChange(e);
    this.onTouched();
  }

}
