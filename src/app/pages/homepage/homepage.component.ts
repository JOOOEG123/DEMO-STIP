import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { ContributionsService } from 'src/app/core/services/contributions.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  constructor(
    private arch: ArchieveApiService,
    private router: Router,
    private contribute: ContributionsService
  ) {}
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

  ngOnInit() {
    // this.contribute.addUserContributions({ name: 'new objetc' }).then((x) => {
    //   console.log(x);
    // });
    // this.contribute.removeContributionById('28c889a52c1a0c02be13dfdb7eb634');
    // this.contribute.fetchAllContribution();
  }

  onKey(event: any) {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  searchArchives() {
    console.log(this.searchTerm);
    // this.router.navigate(["search/" + this.searchTerm]);
  }
}
