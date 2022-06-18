import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { AboutComponent } from './about/AboutMovement/about.component';
import { AboutResearchComponent } from './about/AboutResearch/about-research/about-research.component';
import { AboutTeamComponent } from './about/AboutTeam/about-team/about-team.component';
import { ResourcesComponent } from './about/Resources/resources/resources.component';
import { AccountComponent } from './account/account.component';
import { ApprovalComponent } from './admin/approval/approval.component';
import { BrowseComponent } from './browse/browse.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HomepageComponent } from './homepage/homepage.component';

export const pagesComponents = [
  AboutComponent,
  AboutResearchComponent,
  AboutTeamComponent,
  AccountComponent,
  ApprovalComponent,
  BrowseComponent,
  GalleryComponent,
  HomepageComponent,
  ResourcesComponent,
];

export const pagesRoutes = [
  {
    path: 'about/movement',
    component: AboutComponent,
  },
  {
    path: 'about/resources',
    component: ResourcesComponent,
  },
  {
    path: 'about/team',
    component: AboutTeamComponent,
  },
  {
    path: 'about/research',
    component: AboutResearchComponent,
  },
  {
    path: 'browse/gallery',
    component: GalleryComponent,
  },
  {
    path: 'browse/archive',
    component: BrowseComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AngularFireAuthGuard],
  },
];

export const adminRoutes = [
  {
    path: 'admin/approval',
    component: ApprovalComponent,
  },
];
