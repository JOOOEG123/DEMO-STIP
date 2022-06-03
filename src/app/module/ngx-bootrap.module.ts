import { NgModule } from '@angular/core';
import { BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [],
  imports: [
    BsDropdownModule.forRoot(),
    AlertModule.forRoot()

  ],
  providers: [],
  bootstrap: []
})
export class NgxBootstrapModule { }
