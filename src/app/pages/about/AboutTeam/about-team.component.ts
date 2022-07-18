import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-team',
  templateUrl: './about-team.component.html',
  styleUrls: ['./about-team.component.scss']
})
export class AboutTeamComponent implements OnInit {

  constructor() { }
  Profiles = [
    {
      name: 'Joel Adeniji',
      email: 'johnDoe@aol.com',
      profile: 'default-profile.png'
    },
    {
      name: 'An Dang',
      email: 'JaneDoe@aol.com',
      profile: 'default-profile.png'
    },
    {
      name: 'Bailey George',
      email: 'johnSmith@aol.com',
      profile: 'default-profile.png'
    },
    {
      name: 'Kristie',
      email: 'johnSmith@aol.com',
      profile: 'default-profile.png'
    },
    {
      name: 'Weilon Price',
      email: 'johnSmith@aol.com',
      profile: 'default-profile.png'
    },
    {
      name: 'Yule Zhang',
      email: 'johnSmith@aol.com',
      profile: 'default-profile.png'
    },
    {
      name: 'Shanshan Cui',
      email: 'johnSmith@aol.com',
      profile: 'default-profile.png'
    },
    {
      name: 'Myeong Lee',
      email: 'johnSmith@aol.com',
      profile: 'default-profile.png'
    },
    {
      name: 'Zhehan Zhang',
      email: 'johnSmith@aol.com',
      profile: 'default-profile.png'
    },
  ];
  ngOnInit(): void {
  }

}
