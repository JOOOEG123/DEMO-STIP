import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { ActivatedRoute, Router } from '@angular/router';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  data$: any;
  constructor(
    private arch: ArchieveApiService,
    private func: AngularFireFunctions,
    private router: Router,
    private route: ActivatedRoute,
    private customApi: AngularFireFunctions,
    private http: HttpClient
  ) {}
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

  ngOnInit(): void {
    // this is left here for future reference.
    // this.customApi
    //   .httpsCallable('getArchives')
    //   .subscribe((result) => console.log(result));

    // const callable = this.customApi.httpsCallable('app');
    // this.data$ = callable({ name: 'John' });
    // this.data$.subscribe((result: any) => console.log(result));

    //   this.http.get('https://us-central1-stip-demo.cloudfunctions.net/app/allArchies', {}).subscribe((result: any) => {
    //     console.log(result);
    //     result.data.forEach((item: any) => {
    //       console.log(item);
    //     }
    //     );
    // })
    this.func
      .httpsCallable('add')({ respo: '' })
      .subscribe((result: any) => {
        console.log(result);
      });
  }
  searchArchives() {
    this.router.navigate(['/browse/main'], {
      queryParams: { searchTerm: this.searchTerm },
    });
  }
}
