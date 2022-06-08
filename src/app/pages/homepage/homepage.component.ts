import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
})
export class HomepageComponent implements OnInit {
  constructor() {}

  fakeProfile = [
    {
      name: 'John Doe',
      email: 'johnDoe@aol.com',
      profile: 'theguy.png'
    },
    {
      name: 'Jane Doe',
      email: 'JaneDoe@aol.com',
      profile: 'default-profile.png'
    },
    {
      name: 'John Smith',
      email: 'johnSmith@aol.com',
      profile: 'default-profile.png'
    },
  ];

  ngOnInit(): void {}
}
