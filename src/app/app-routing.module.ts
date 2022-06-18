import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/services/auth-guard.service';
import { LayoutComponent } from './layout/layout.component';
import { AboutComponent } from './pages/about/AboutMovement/about.component';
import { AccountComponent } from './pages/account/account.component';
import { MainBrowseComponent } from './pages/browse/main-browse/main-browse.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginComponent } from './pages/login/login.component';

import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: HomepageComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'gallery',
        component: GalleryComponent,
      },
      {
        path: 'browse',
        component: MainBrowseComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'account',
        component: AccountComponent,
        canActivate: [AngularFireAuthGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
