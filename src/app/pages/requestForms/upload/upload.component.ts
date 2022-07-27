import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Subscription, zip } from 'rxjs';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';
import { ContributionsService } from 'src/app/core/services/contributions.service';
import {
  Contribution,
  Rightist,
  RightistSchema,
} from 'src/app/core/types/adminpage.types';
import { UUID } from 'src/app/core/utils/uuid';
import {
  mapOtherEvents,
  mapOtherMemiors,
  mapOtherRightists,
} from './upload.helper';

type langType = {
  en: Contribution;
  cn: Contribution;
};

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit, OnDestroy {
  private _contribution: langType = {} as any;

  isAdmin: boolean = false;
  allForms = this.formBuilder.group({
    event: [],
    imagesDetails: [],
    memoir: [],
    rightist: [],
    content: [''],
  });
  contributionId!: string;
  maxDate: Date = new Date('1965-01-01');
  maxDate2: Date = new Date('1950-01-01');
  minDate: Date = new Date('1940-01-01');
  minDate2: Date = new Date('1840-01-01');
  sub: Subscription[] = [];
  subLang: Subscription[] = [];
  language = this.translate.currentLang;
  otherLanguage = this.language === 'en' ? 'cn' : 'en';
  isLoading: boolean = false;

  @Input() get contribution() {
    return this._contribution[this.language];
  }
  set contribution(contribution: Contribution) {
    if (contribution?.rightist) {
      this._contribution[this.language] = contribution;
    }
  }
  @Input() page?: string;
  constructor(
    private contributionService: ContributionsService,
    private auth: AuthServiceService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private archiveAPI: ArchieveApiService
  ) {}

  clear2() {
    this.allForms.reset();
  }

  ngOnDestroy(): void {
    this.sub.forEach((sub) => sub.unsubscribe());
    this.subLang.forEach((sub) => sub.unsubscribe());
  }

  onInit() {
    if (this.page === 'contribution') {
      if (this.contribution) {
        if (this.contribution.contributionId && this.contribution.rightist) {
          const rightist: Rightist = this.contribution.rightist;
          // this.mapForm(rightist);
          this.updateData();
        }
      }
    } else {
      this.sub.push(
        this.activatedRoute.queryParams.subscribe((params) => {
          this.contributionId = params['contributionId'];
          this.page = params['page'];
          if (this.page === 'account') {
            if (this.contributionId) {
              this.updateData();
            }
          }
        })
      );
    }
  }

  ngOnInit(): void {
    this.sub.push(
      this.auth.isAdmin.subscribe((data) => {
        this.isAdmin = data;
      })
    );
    this.onInit();
    this.subLang.push(
      this.translate.onLangChange.subscribe((data) => {
        this.language = data.lang;
        this.otherLanguage = data.lang === 'en' ? 'cn' : 'en';
        this.onInit();
      })
    );
  }

  updateData() {
    zip(
      this.contributionService.getUserContributionByAuth(
        this.language,
        this.contributionId
      ),
      this.contributionService.getUserContributionByAuth(
        this.otherLanguage,
        this.contributionId
      )
    ).subscribe((data: any) => {
      this._contribution[this.language] = data[0] || data[1];
      this._contribution[this.otherLanguage] = data[1] || data[0];
      const { rightist: r1 } = this._contribution[this.language];
      const { rightist: r2 } = this._contribution[this.otherLanguage];
      if (r1 && r2) {
        this.mapForm(r1, r2);
      }
      this.allForms.patchValue({
        rightist: {
          ...this._contribution[this.language]?.rightist,

          ...mapOtherRightists(
            this._contribution[this.otherLanguage]?.rightist
          ),
          name: this._contribution[this.language]?.rightist.fullName,
          occupation:
            this._contribution[this.language]?.rightist.workplaceCombined,
          ethnic: this._contribution[this.language]?.rightist.ethnicity,
        },
        content: this._contribution[this.language].rightist?.description || '',
        otherContent:
          this._contribution[this.otherLanguage].rightist?.description || '',
      });
    });
  }
  mapForm(r1: Rightist, r2: Rightist) {
    const length =
      r1.memoirs?.length > r2.memoirs?.length
        ? r1.memoirs.length
        : r2.memoirs.length;
    const memoirs: any[] = [];
    for (let i = 0; i < length; i++) {
      const m1 = r1.memoirs[i];
      const m2 = r2.memoirs[i];
      if (m1 && m2) {
        memoirs.push({
          memoirTitle: m1.memoirTitle,
          otherMemoirTitle: m2.memoirTitle || '',
          memoirContent: m1.memoirContent || '',
          otherMemoirContent: m2.memoirContent || '',
          memoirAuthor: m1.memoirAuthor || '',
          otherMemoirAuthor: m2.memoirAuthor || '',
        });
      }
    }
    const enlen =
      r1.events?.length > r2.events?.length
        ? r1.events.length
        : r2.events.length;
    const events: any[] = [];
    for (let i = 0; i < enlen; i++) {
      const m1 = r1.events[i];
      const m2 = r2.events[i];
      if (m1 && m2) {
        events.push({
          startYear: m1.startYear || m2.startYear,
          event: m1.event || '',
          otherEvent: m2.event || '',
        });
      }
    }

    this.allForms.patchValue({
      event: events,
      memoir: memoirs,
    });
  }

  onSubmit() {
    this.isLoading = true;
    const rightistId =
      this.contribution?.rightist?.rightistId || `Rightist-${UUID()}`;
    const {
      name,
      gender,
      status,
      ethnic,
      rightistYear,
      occupation,
      birthYear,
    } = this.allForms.value.rightist!;

    // if (!this.contribution) {
    let rightist: RightistSchema = {
      rightistId: rightistId,
      contributorId: this.auth.uid,
      imageId: [],
      profileImageId: '',
      initial: '',
      firstName: '',
      lastName: '',
      fullName: name,
      gender: gender,
      birthYear: birthYear,
      deathYear: 0,
      rightistYear: rightistYear,
      status: status || 'Unknown',
      ethnicity: ethnic || '',
      job: '',
      detailJob: '',
      workplace: '',
      workplaceCombined: occupation,
      events: this.allForms.value.event,
      memoirs: this.allForms.value.memoir,
      reference: '',
      description: this.allForms.value.content,
      lastUpdatedAt: new Date(),
      source: 'contributed',
    };

    let otherRightist: RightistSchema = {
      rightistId: rightistId || '',
      contributorId: this.auth.uid || '',
      imageId: [],
      profileImageId: '',
      initial: '',
      firstName: '',
      lastName: '',
      fullName: this.allForms.value.rightist.otherName || '',
      gender: this.allForms.value.rightist.otherGender || '',
      birthYear: birthYear || '',
      deathYear: 0,
      rightistYear: rightistYear || '',
      status: this.allForms.value.rightist.otherStatus || 'Unknown',
      ethnicity: this.allForms.value.rightist.otherEthnic || '',
      job: '',
      detailJob: '',
      workplace: '',
      workplaceCombined: this.allForms.value.rightist?.otherOccupation || '',
      events: mapOtherEvents(this.allForms.value.event || []),
      memoirs: (this.allForms.value.memoir || []).map((m) => {
        return {
          memoirTitle: m.otherMemoirTitle || '',
          memoirContent: m.otherMemoirContent || '',
          memoirAuthor: m.otherMemoirAuthor || '',
        };
      }),
      reference: '',
      description: this.allForms.value?.otherContent || '',
      lastUpdatedAt: new Date(),
      source: 'contributed',
    };

    if (this.language === 'en') {
      rightist.initial = rightist.fullName.trim().charAt(0).toUpperCase();
      otherRightist.initial = rightist.fullName.trim().charAt(0).toUpperCase();
    }
    let contributionId = this.contributionId || UUID();

    if (this.isAdmin) {
      Promise.all([
        this.contributionService.addOrUpdateUserContribution(
          this.language,
          this.auth.uid,
          contributionId,
          {
            contributionId: contributionId,
            contributorId: this.auth.uid,
            rightistId: rightistId,
            contributedAt: new Date(),
            approvedAt: new Date(),
            rejectedAt: new Date(),
            publish: 'approved',
          }
        ),
        this.archiveAPI.addOrUpdateRightist(this.language, rightist),
        this.contributionService.addOrUpdateUserContribution(
          this.otherLanguage,
          this.auth.uid,
          contributionId,
          {
            contributionId: contributionId,
            contributorId: this.auth.uid,
            rightistId: rightistId,
            contributedAt: new Date(),
            approvedAt: new Date(),
            rejectedAt: new Date(),
            publish: 'approved',
          }
        ),
        this.archiveAPI
          .addOrUpdateRightist(this.otherLanguage, otherRightist)
          .then(() => {
            this.route.navigateByUrl('/account');
          }),
      ])
        .then(() => {
          this.route.navigateByUrl('/account');
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          // use the alert service to show a message
        });
    } else {
      Promise.all([
        this.contributionService.addOrUpdateUserContribution(
          this.language,
          this.auth.uid,
          contributionId,
          {
            contributionId: contributionId,
            contributorId: this.auth.uid,
            rightistId: rightistId,
            contributedAt: new Date(),
            approvedAt: new Date(),
            rejectedAt: new Date(),
            publish: 'new',
            rightist: rightist,
          }
        ),
        this.contributionService.addOrUpdateUserContribution(
          this.otherLanguage,
          this.auth.uid,
          contributionId,
          {
            contributionId: contributionId,
            contributorId: this.auth.uid,
            rightistId: rightistId,
            contributedAt: new Date(),
            approvedAt: new Date(),
            rejectedAt: new Date(),
            publish: 'new',
            rightist: otherRightist,
          }
        ),
      ])
        .then(() => {
          this.route.navigateByUrl('/account');
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          // use the alert service to show a message
        });
    }
  }
  // }
}
