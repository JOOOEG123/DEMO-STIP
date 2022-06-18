import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  constructor(private arch: ArchieveApiService, private router: Router) {}
  searchTerm: string = '';

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

  onKey(event: any) {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  searchArchives() {
    console.log(this.searchTerm);
    // this.router.navigate(["search/" + this.searchTerm]);
  }
}
