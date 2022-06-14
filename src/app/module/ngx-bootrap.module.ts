import { AlertModule } from 'ngx-bootstrap/alert';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgModule } from '@angular/core';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
  ],
  exports: [
    BsDropdownModule,
    CollapseModule,
    AlertModule,
    ModalModule,
    BsDatepickerModule,
    TypeaheadModule,
  ],
  providers: [BsDatepickerConfig],
  bootstrap: []
})
export class NgxBootstrapModule { }
