import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AnnouncementService } from 'src/app/core/services/announcement.service';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';
import { LoginComponent } from 'src/app/layout/login/login.component';
import { NavBar } from '../layout.constants';
import { NavBarLinks } from '../layout.types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  navbars: NavBarLinks = NavBar;
  isCollapsed = true;
  isLoggedIn = false;
  @ViewChild('login') login!: LoginComponent;
  count = 15;
  timeId: any;
  message: unknown;
  transPath = 'header.component.';
  constructor(
    private auth: AuthServiceService,
    private annoucement: AnnouncementService,
    private outsideScope: NgZone,
    private translate: TranslateService
  ) {}
  h = 'home_page';

  get lang() {
    return localStorage.getItem('lang') || 'en';
  }

  ngOnInit(): void {
    this.auth.isLoggedIn.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      console.log('isLoggedIn', this.isLoggedIn);
    });

    this.annoucement.getAnnounce().subscribe((x) => {
      this.message = x;
      this.createCounter();
      this.outsideScope.run(this.createCounter);
    });
  }
  loginLogin() {
    console.log('loginLogin', this.isLoggedIn);
    this.login.openModal();
  }
  createCounter() {
    let count = 15;
    let timeId = setInterval(() => {
      count--;
      if (this?.count !== undefined) {
        this.count = count;
      }
      if (count <= 0) {
        clearInterval(timeId);
      }
    }, 2000);
  }

  changeLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
    this.collapseNavbar();
  }

  collapseNavbar() {
    this.isCollapsed = true;
    const navbar = document.getElementById('navbarMobile');
    if (navbar) {
      navbar.classList.remove('show');
    }
  }
}
