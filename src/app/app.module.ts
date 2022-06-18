import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { allLayoutComponents } from './layout';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxBootstrapModule } from './module/ngx-bootrap.module';
import { NgxMasonryModule } from 'ngx-masonry';
import { pagesComponents } from './pages';

// Firebase Modules
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AuthServiceService } from './core/services/auth-service.service';

import { environment } from 'src/environments/environment';

// shared components
import { SearchFilterComponent } from './share/search-filter/search-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    ...allLayoutComponents,
    ...pagesComponents,
    SearchFilterComponent,

  ],
  imports: [
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxBootstrapModule,
    HttpClientModule,
    NgxMasonryModule,
  ],
  providers: [AuthServiceService],
  bootstrap: [AppComponent],
})
export class AppModule {}
