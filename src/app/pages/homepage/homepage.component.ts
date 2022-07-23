import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  data$: any;
  constructor(private router: Router) {}
  searchTerm: string = '';
  transPath = 'homepage.component.';

  fakeProfile = [
    {
      name: 'John Doe',
      email: 'johnDoe@aol.com',
      profile: 'theguy.png',
    },
    {
      name: 'Jane Doe',
      email: 'JaneDoe@aol.com',
      profile: 'default-profile.png',
    },
    {
      name: 'John Smith',
      email: 'johnSmith@aol.com',
      profile: 'default-profile.png',
    },
  ];

  ngOnInit(): void {}
  searchArchives() {
    this.router.navigate(['/browse/main'], {
      queryParams: { searchTerm: this.searchTerm },
    });
  }
}
