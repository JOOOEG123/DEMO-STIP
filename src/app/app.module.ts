import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { allLayoutComponents } from './layout';
import { NgxBootstrapModule } from './module/ngx-bootrap.module';
import { pagesComponents } from './pages';

@NgModule({
  declarations: [
    AppComponent,
    ...allLayoutComponents,
    ...pagesComponents
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxBootstrapModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
