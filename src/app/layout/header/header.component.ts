import { Component, OnInit, ViewChild } from '@angular/core';
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
  constructor(private auth: AuthServiceService, private annoucement: AnnouncementService) {}

  ngOnInit(): void {
    this.auth.isLoggedIn.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      console.log('isLoggedIn', this.isLoggedIn);
    });

    this.annoucement.message.subscribe(x => {
      this.message = x;
      this.count = 15;
      this.createCounter();
    })
  }
  loginLogin() {
    console.log('loginLogin', this.isLoggedIn);
    this.login.openModal();
  }
  createCounter() {
    this.timeId = setInterval(() => {
      this.count--;
      if (this.count === 0) {
        clearInterval(this.timeId);
      }
    }, 1000);
  }
}
