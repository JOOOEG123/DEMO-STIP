import { NgModule } from '@angular/core';
import { BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule, PaginationConfig } from 'ngx-bootstrap/pagination'

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
  ],
  exports: [
    BsDropdownModule,
    CollapseModule,
    AlertModule,
    ModalModule,
    BsDatepickerModule,
    PaginationModule
  ],
  providers: [BsDatepickerConfig, PaginationConfig],
  bootstrap: []
})
export class NgxBootstrapModule { }
