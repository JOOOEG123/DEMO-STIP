import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';
import { LoginComponent } from 'src/app/pages/login/login.component';
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
  constructor(private auth: AuthServiceService) {}

  ngOnInit(): void {
    const nav = document.querySelector('nav');
    addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        nav?.classList.add('shadow', 'bg-primary', 'bg-opacity-20');
      } else {
        nav?.classList.remove('shadow', 'bg-primary', 'bg-opacity-20');
      }
    });

    this.auth.isLoggedIn.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      console.log('isLoggedIn', this.isLoggedIn);
      if (isLoggedIn) {
        this.login.modalRef?.hide();
        this.navbars[this.navbars.length - 1] = {
          title: 'Acount',
          url: '/account',
          icon: 'acount',
        };
      } else {
        this.navbars = this.navbars.filter((nav) => nav.title !== 'Acount');
      }
    });
  }
  loginLogin() {
    this.login.openModal();
  }
}
