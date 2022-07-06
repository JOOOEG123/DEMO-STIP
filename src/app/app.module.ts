import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { NgxBootstrapModule } from './module/ngx-bootrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMasonryModule } from 'ngx-masonry';
import { NgxSpinnerModule } from 'ngx-spinner';


// Index Components
import { allLayoutComponents } from './layout';
import { pagesComponents } from './pages';
import { sharedComponents } from './share';

// Firebase Modules
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
// import { AngularFireFunctionsModule, NEW_ORIGIN_BEHAVIOR  } from '@angular/fire/compat/functions';
import { AngularFireFunctionsModule, ORIGIN, USE_EMULATOR } from '@angular/fire/compat/functions';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { environment } from 'src/environments/environment';
import { AuthServiceService } from './core/services/auth-service.service';
import { HttpClientModule } from '@angular/common/http';

//Pipe: used to transfrom db data
import { UpdateRowsPipe } from './core/pipes/update-rows-pipe.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShareComponent } from './pages/browse/share/share.component';
import { MemoirComponent } from './pages/browse/memoir/memoir.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { UploadComponent } from './pages/requestForms/upload/upload.component';
import { DeleteComponent } from './pages/requestForms/delete/delete.component';
import { AddComponent } from './pages/requestForms/add/add.component';

import { AppComponent } from './app.component';
import { EditAccountComponent } from './pages/account/edit-account/edit-account.component';

@NgModule({
  declarations: [
    AppComponent,
    ...allLayoutComponents,
    ...pagesComponents,
    ...sharedComponents,
    UpdateRowsPipe,
    ShareComponent,
    MemoirComponent,
    EditAccountComponent,
    UploadComponent,
    DeleteComponent,
    AddComponent,
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    HttpClientModule,
    AngularFirestoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxBootstrapModule,
    HttpClientModule,
    NgxMasonryModule,
    NgxSpinnerModule,
    TabsModule.forRoot()
  ],
  providers: [AuthServiceService,  { provide: ORIGIN,  useValue: 'https://us-central1-stip-demo.cloudfunctions.net/' }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],

})
export class AppModule {}
