import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { allLayoutComponents } from './layout';
import { NgxBootstrapModule } from './module/ngx-bootrap.module';
import { pagesComponents } from './pages';
import { LoginComponent } from './pages/login/login.component';
import { AboutComponent } from './pages/about/about.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Firebase Modules
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';


import { environment } from 'src/environments/environment';
import { AuthServiceService } from './core/services/auth-service.service';

@NgModule({
  declarations: [
    AppComponent,
    ...allLayoutComponents,
    ...pagesComponents,
    LoginComponent,
    AboutComponent,
    GalleryComponent,
    BrowseComponent
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxBootstrapModule
  ],
  providers: [AuthServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
