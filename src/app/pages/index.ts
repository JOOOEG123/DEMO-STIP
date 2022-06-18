import {
  AngularFireAuthGuard,
  customClaims,
} from '@angular/fire/compat/auth-guard';
import { map, pipe } from 'rxjs';
import { AboutComponent } from './about/AboutMovement/about.component';
import { AboutResearchComponent } from './about/AboutResearch/about-research/about-research.component';
import { AboutTeamComponent } from './about/AboutTeam/about-team/about-team.component';
import { ResourcesComponent } from './about/Resources/resources/resources.component';
import { AccountComponent } from './account/account.component';
import { ApprovalComponent } from './admin/approval/approval.component';
import { MainBrowseComponent } from './browse/main-browse/main-browse.component';
import { BrowseSearchFilterComponent } from './browse/browse-search-filter/browse-search-filter.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HomepageComponent } from './homepage/homepage.component';

// AuthGuard pipe for admin pages
const adminOnly = () =>
  pipe(
    customClaims,
    map(
      (claims) =>
        claims.admin === true || (claims.user_id != null ? ['account'] : [''])
    )
  );
// Page components
export const pagesComponents = [
  AboutComponent,
  AboutResearchComponent,
  AboutTeamComponent,
  AccountComponent,
  ApprovalComponent,
  MainBrowseComponent,
  BrowseSearchFilterComponent,
  GalleryComponent,
  HomepageComponent,
  ResourcesComponent,
];

// Page routes
export const pagesRoutes = [
  {
    path: 'about/movement',
    component: AboutComponent,
    data: {
      title: 'Movement',
    },
  },
  {
    path: 'about/resources',
    component: ResourcesComponent,
    data: {
      title: 'Resources',
    },
  },
  {
    path: 'about/team',
    component: AboutTeamComponent,
    data: {
      title: 'Team',
    },
  },
  {
    path: 'about/research',
    component: AboutResearchComponent,
    data: {
      title: 'Research',
    },
  },
  {
    path: 'browse/gallery',
    component: GalleryComponent,
    data: {
      title: 'Gallery',
    },
  },
  {
    path: 'browse/archive',
    component: MainBrowseComponent,
    data: {
      title: 'Archive',
    },
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      title: 'Account',
    },
  },
];

export const adminRoutes = [
  {
    path: 'admin/approval',
    component: ApprovalComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: adminOnly, title: 'Approval' },
  },
];
