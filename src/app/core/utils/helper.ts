import { forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";


export const FormCustomProvider = (FormCustomComponent: any, provide = NG_VALUE_ACCESSOR) => {
  console.log(FormCustomComponent);
  return {
    provide: provide,
    useExisting: FormCustomComponent,
    multi: true
  };
}
