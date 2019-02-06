import { ControlValueAccessor } from '@angular/forms';

export class RadioBasedComponent implements ControlValueAccessor {
  public value: boolean;
  public disabled = false;
  onChange = (data: any) => {};
  onTouched = () => {};

  constructor(public cd: any) {}

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(value: boolean): void {
    this.disabled = value;
    this.cd.markForCheck();
  }

  doChange(data: any) {
    this.value = data;
    this.onChange(data);
    this.onTouched();
    this.cd.markForCheck();
  }

}
