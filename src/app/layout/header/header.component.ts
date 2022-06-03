import { Component, OnInit } from '@angular/core';
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
  constructor() {}

  ngOnInit(): void {
    const nav = document.querySelector('nav');
    addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        nav?.classList.add('shadow', 'bg-primary', 'bg-opacity-20');
      } else {
        nav?.classList.remove('shadow', 'bg-primary', 'bg-opacity-20');
      }
    });
  }
}
