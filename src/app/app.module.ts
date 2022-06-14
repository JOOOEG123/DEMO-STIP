import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { allLayoutComponents } from './layout';
import { NgxBootstrapModule } from './module/ngx-bootrap.module';
import { pagesComponents } from './pages';
import { LoginComponent } from './pages/login/login.component';
import { AboutComponent } from './pages/about/AboutMovement/about.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Firebase Modules
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';


import { environment } from 'src/environments/environment';
import { AuthServiceService } from './core/services/auth-service.service';
import { AccountComponent } from './pages/account/account.component';
import { HttpClientModule } from '@angular/common/http';
import { ProjectOverviewComponent } from './pages/about/ProjectOverview/project-overview/project-overview.component';
import { SearchFilterComponent } from './share/search-filter/search-filter.component';
import { AboutResearchComponent } from './pages/about/AboutResearch/about-research/about-research.component';
import { ResourcesComponent } from './pages/about/Resources/resources/resources.component';
import { AboutTeamComponent } from './pages/about/AboutTeam/about-team/about-team.component';

@NgModule({
  declarations: [
    AppComponent,
    ...allLayoutComponents,
    ...pagesComponents,
    LoginComponent,
    AboutComponent,
    GalleryComponent,
    BrowseComponent,
    AccountComponent,
    ProjectOverviewComponent,
    SearchFilterComponent,
    AboutResearchComponent,
    ResourcesComponent,
    AboutTeamComponent
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
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxBootstrapModule,
    HttpClientModule,
  ],
  providers: [AuthServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
