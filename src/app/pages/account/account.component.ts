import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';
import { ContributionsService } from 'src/app/core/services/contributions.service';
import { StorageApIService } from 'src/app/core/services/storage-api.service';
import { Contribution } from 'src/app/core/types/adminpage.types';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {

  //typeahead options:
  selected?: string;
  options: string[] =[
    'option1',
    'option2',
    'option3'
  ];

  selected2?: string;
  options2: string[] =[
    'Han Chinese',
    'Zhuang',
    'Hui',
    'Manchu',
    'Uyghur',
    'Miao',
    'Yi',
    'Tujia',
    'Tibetan',
    'Mongol',
    'Dong',
    'Bouyei',
    'Yao',
    'Bai',
    'Joseonjok',
    'Hani',
    'Li',
    'Kazakh',
    'Dai',
    'She',
    'Lisu',
    'Dangxiang',
    'Gelao',
    'Lahu',
    'Wa',
    'Sui',
    'Nakhi',
    'Qiang',
    'Tu',
    'Mulao',
    'Xibe',
    'Kyrgyz',
    'Jingpo',
    'Daur',
    'Salar',
    'Blang',
    'Maonan',
    'Tajik',
    'Pumi',
    'Achang',
    'Nu',
    'Evenki',
    'Vietnamese',
    'Jino',
    'De ang',
    'Bonan',
    'Russian',
    'Yugur',
    'Uzbek',
    'Monba',
    'Orogen',
    'Derung',
    'Hezhen',
    'Gaoshan',
    'Lhoba',
    'Tatars',
    'Undistinguished',
    'Naturalized Citizen'
    ];

  subscription: Subscription[] = [];
  contributionSubscription?: Subscription
  isAdmin = false;
  imageUrl!: Observable<string> | undefined;
  userId = this.auth.uid;
  profile: any;
  userContribution: any[] = [];;
  // @ViewChild('modalTemplates') modalTemplates!: LogoutComponent;
  constructor(
    private auth: AuthServiceService,
    private storage: StorageApIService, 
    private contributionService: ContributionsService,
    private archiveService: ArchieveApiService) {}
  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
    this.contributionSubscription?.unsubscribe()
  }

  ngOnInit(): void {
    this.contributionSubscription = this.contributionService.fetchUserContributions().subscribe((x: any) => {
      for (const contribution of x)
      {
        this.archiveService.getPersonById(contribution.rightistId).subscribe((rightist: any) => {
          contribution.rightist = rightist
        })

        this.userContribution.push(contribution)
      }
    });

    const h = this.storage.profileImgeUrl();
    if (h) {
      this.subscription.push(
        h.subscribe((url) => {
          this.imageUrl = url;
        })
      );
    }
    this.subscription.push(
      this.auth.isAdmin.subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      })
    );

    this.subscription.push(
      this.auth.userDetaills.subscribe((user: any) => {
        this.profile = user;
        console.log('profile',this.profile);
        if (user?.['uid']) {
          this.userId = user['uid'];
        }
      })
    );
  }
}
