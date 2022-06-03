import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  constructor() {}

  fakeProfile = [
    {
      name: 'John Doe',
      email: 'johnDoe@aol.com',
    },
    {
      name: 'Jane Doe',
      email: 'JaneDoe@aol.com',
    },
    {
      name: 'John Smith',
      email: 'johnSmith@aol.com',
    },
  ];

  ngOnInit(): void {}
}
