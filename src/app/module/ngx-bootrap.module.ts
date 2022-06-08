import { NgModule } from '@angular/core';
import { BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [],
  imports: [
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot()

  ],
  providers: [],
  bootstrap: []
})
export class NgxBootstrapModule { }
