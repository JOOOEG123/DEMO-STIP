import { NgModule } from '@angular/core';
import { BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    CarouselModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot()
  ],
  exports: [
    BsDropdownModule,
    AlertModule,
    ModalModule,
    CarouselModule,
    BsDatepickerModule
  ],
  providers: [BsDatepickerConfig],
  bootstrap: []
})
export class NgxBootstrapModule { }
