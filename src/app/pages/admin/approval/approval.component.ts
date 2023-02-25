import {
  animate,
  AnimationEvent,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnDestroy, OnInit, Output, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, mergeMap, Subscription, zip } from 'rxjs';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { ContributionsService } from 'src/app/core/services/contributions.service';
import { ImagesService } from 'src/app/core/services/images.service';
import { StorageApIService } from 'src/app/core/services/storage-api.service';
import {
  Categories,
  CategoryList,
  Contribution,
  ContributionDetails,
  ContributionJson,
  ContributionSchema,
  Event,
  ImagesSchema,
  Memoir,
  Publish,
  Rightist,
  RightistSchema,
} from 'src/app/core/types/adminpage.types';
import { UUID } from 'src/app/core/utils/uuid';
import { UploadComponent } from '../../requestForms/upload/upload.component';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss'],
  animations: [
    trigger('contributionAnimation', [
      state('void', style({ opacity: 1 })),
      state('removed', style({ opacity: 0, display: 'none' })),
      transition('void -> removed', animate('800ms ease-in-out')),
    ]),
  ],
})
export class ApprovalComponent implements OnInit, OnDestroy {
  currentState: string = 'void';
  loaded: boolean = false;

  newContributions: Contribution[] = [];
  approvedContributions: Contribution[] = [];
  rejectedContributions: Contribution[] = [];

  selectedContributions: Contribution[] = [];

  activeCategory!: Categories;
  selectedContribution!: ContributionDetails;
  updatedContribution!: Contribution;
  otherUpdatedContribution!: Contribution;

  @ViewChild('readMoreTemplate') appUpload: TemplateRef<any> | undefined;

  categoriesList: Categories[] = [
    'New Contributions',
    'Approved Contributions',
    'Rejected Contributions',
  ];
  categories: CategoryList = {
    'New Contributions': this.newContributions,
    'Approved Contributions': this.approvedContributions,
    'Rejected Contributions': this.rejectedContributions,
  };

  disabled: boolean = false;
  modalRef?: BsModalRef;

  contributions: any[] = [];
  publish: Publish = 'new';
  isLoaded: boolean = false;
  limit: number = 3;

  emptyContributionMessage = 'Nothing Here!';

  url: string = '';
  image: ImagesSchema = {
    imageId: '',
    rightistId: '',
    isGallery: false,
    category: '',
    title: '',
    detail: '',
    source: '',
    imageUrl: '',
    isProfile: undefined
  };

  otherImage: ImagesSchema = {
    imageId: '',
    rightistId: '',
    isGallery: false,
    category: '',
    title: '',
    detail: '',
    source: '',
    imageUrl: '',
    isProfile: undefined
  };

  languageSubscription?: Subscription;
  sub: Subscription[] = [];

  language: string = '';
  otherLanguage: string = '';

  constructor(
    private modalService: BsModalService,
    private contributionAPI: ContributionsService,
    private archiveAPI: ArchieveApiService,
    private storageAPI: StorageApIService,
    private imageAPI: ImagesService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.language = localStorage.getItem('lang')!;
    this.otherLanguage = this.language === 'en' ? 'cn' : 'en';

    this.languageSubscription = this.translate.onLangChange.subscribe(
      (langChange: any) => {
        this.sub.forEach((x) => x.unsubscribe());
        this.sub.length = 0;
        this.language = langChange.lang;
        this.otherLanguage = this.language === 'en' ? 'cn' : 'en';
        this.initialize();
      }
    );

    this.initialize();
  }

  initialize() {
    this.sub.push(
      this.contributionAPI
        .fetchAllContributions(this.language)
        .subscribe((data: any) => {
          this.contributions.length = 0;
          this.newContributions.length = 0;
          this.approvedContributions.length = 0;
          this.rejectedContributions.length = 0;
          const test: ContributionJson[] = Object.values(data);
          for (let lol of test) {
            for (const contribution of Object.values(lol)) {
              this.contributions.push(contribution);
            }
          }

          this.contributions.sort(function (a, b) {
            return (
              new Date(b.lastUpdatedAt).getTime() -
              new Date(a.lastUpdatedAt).getTime()
            );
          });

          for (let contribution of this.contributions) {
            let data: Contribution = {
              ...contribution,
              lastUpdatedAt: new Date(contribution.lastUpdatedAt),
              contributedAt: new Date(contribution.contributedAt),
              approvedAt: new Date(contribution.approvedAt),
              state: 'void',
            };

            if (data.rightist) {
              data.rightist!.lastUpdatedAt = new Date(
                data.rightist!.lastUpdatedAt
              );
            }

            if (contribution.publish == 'new') {
              this.newContributions.push(data);
            }

            if (contribution.publish == 'approved') {
              this.sub.push(
                this.archiveAPI
                  .getRightistById(this.language, data.rightistId)
                  .subscribe((rightist: any) => {
                    if (rightist ?.imageId) {
                      this.sub.push(
                        this.imageAPI
                          .getImage(this.language, rightist.imageId)
                          .subscribe((image: any) => {
                            data.rightist = rightist;
                            data.image = image;
                            this.loaded = true;
                          })
                      );
                    }
                  })
              );
              this.approvedContributions.push(data);
            }

            if (contribution.publish == 'rejected') {
              this.rejectedContributions.push(data);
            }
          }

          this.approvedContributions.sort(function (a, b) {
            return (
              new Date(b.lastUpdatedAt).getTime() -
              new Date(a.lastUpdatedAt).getTime()
            );
          });
        })
    );

    this.selectedContributions = this.newContributions;
    this.activeCategory = 'New Contributions';
  }

  ngOnDestroy(): void {
    this.sub.forEach((x) => x.unsubscribe());
    this.languageSubscription?.unsubscribe();
  }

  onApprove(el: UploadComponent) {
    this.publish = 'approved';
    this.selectedContribution.state = 'removed';
    el.onSubmit().then(()=> {
      this.modalRef?.hide();
    })
  }

  onSave(data: any) {

    this.updatedContribution.image = this.image;
    this.otherUpdatedContribution.image = this.otherImage;

    if (data.type == 'save') {
      Promise.all([
        this.contributionAPI.updateUserContribution(
          this.language,
          this.updatedContribution
        ),
        this.contributionAPI.updateUserContribution(
          this.otherLanguage,
          this.otherUpdatedContribution
        ),
      ]).then(() => {
        this.modalRef?.hide();
      });
    }
  }

  onReject() {
    this.modalRef?.hide();
    this.publish = 'rejected';
    this.selectedContribution.state = 'removed';
  }

  onReconsider() {
    this.modalRef?.hide();
    this.publish = 'approved';
    this.selectedContribution.state = 'removed';
  }

  onEdit() {
    this.modalRef?.hide();
    this.publish = 'approved';
    this.selectedContribution.state = 'removed';
  }

  setActiveCategory(category: Categories) {
    this.activeCategory = category;
    this.selectedContributions = this.categories[this.activeCategory];
  }

  animationStart(event: AnimationEvent) {
    this.disabled = true;
  }

  async animationDone(event: AnimationEvent) {
    this.disabled = false;

    if (
      this.selectedContribution &&
      this.selectedContribution.state === 'removed'
    ) {
      if (this.publish === 'approved') {

      } else {
        this.updatedContribution.publish = this.publish;
        this.otherUpdatedContribution.publish = this.publish;

        const { state, ...contribution } = this.updatedContribution;
        const { state: otherState, ...otherContribution } =
          this.otherUpdatedContribution;
        if (this.url) {
          this.updatedContribution!.image!.imagePath = this.url;
          this.otherUpdatedContribution!.image!.imagePath = this.url;
        }

        Promise.all([
          this.contributionAPI.updateUserContribution(
            this.language,
            contribution
          ),
          this.contributionAPI.updateUserContribution(
            this.otherLanguage,
            otherContribution
          ),
        ]);
      }
      this.selectedContribution.state = 'void';
    }
  }

  onReadMore(template: TemplateRef<any>, contribution: ContributionDetails) {
    this.selectedContribution = contribution;
    this.updatedContribution = { ...contribution };
    this.otherUpdatedContribution = { ...contribution };
    this.image = { ...contribution.image! };
    this.modalRef = this.modalService.show(template, { class: 'modal-custom-style' });
  }

  onEventChange(source: any) {
    let events: Event[] = [];
    let otherEvents: Event[] = [];

    for (let data of source) {
      let event: Event = {
        startYear: data.startYear,
        endYear: data.endYear,
        event: data.event,
      };

      let otherEvent: Event = {
        startYear: data.startYear,
        endYear: data.endYear,
        event: data.otherEvent,
      };

      events.push(event);
      otherEvents.push(otherEvent);
    }

    this.updatedContribution.rightist!.events = events;
    this.otherUpdatedContribution.rightist!.events = otherEvents;
  }

  onMemoirChange(source: any) {
    let memoirs: Memoir[] = [];
    let otherMemoirs: Memoir[] = [];

    for (let data of source) {
      let memoir: Memoir = {
        memoirTitle: data.memoirTitle,
        memoirAuthor: data.memoirAuthor,
        memoirContent: data.memoirContent,
      };

      let otherMemoir: Memoir = {
        memoirTitle: data.otherMemoirTitle,
        memoirAuthor: data.otherMemoirAuthor,
        memoirContent: data.otherMemoirContent,
      };

      memoirs.push(memoir);
      otherMemoirs.push(otherMemoir);
    }

    this.updatedContribution.rightist!.memoirs = memoirs;
    this.otherUpdatedContribution.rightist!.memoirs = otherMemoirs;
  }

  onFormChange(data: any) {
    this.updatedContribution = {
      ...this.updatedContribution,
      rightist: {
        ...this.updatedContribution.rightist!,
        fullName: data.name,
        gender: data.gender,
        status: data.status,
        ethnicity: data.ethnic,
        job: data.occupation,
        workplace: data.workplace,
        rightistYear: data.rightistYear,
        birthYear: data.birthYear,
      },
    };

    this.otherUpdatedContribution = {
      ...this.otherUpdatedContribution,
      rightist: {
        ...this.otherUpdatedContribution.rightist!,
        fullName: data.otherName,
        gender: data.otherGender,
        status: data.otherStatus,
        ethnicity: data.otherEthnic,
        job: data.otherOccupation,
        workplace: data.otherWorkplace,
        rightistYear: data.rightistYear,
        birthYear: data.birthYear,
      },
    };
  }

  onImageChange(data: any) {
    this.url = data.url;
    this.image = { ...data.image };
    this.otherImage = { ...data.otherImage };
  }

  onDescriptionChange(data: any) {
    if (data.type == 'original') {
      this.updatedContribution = {
        ...this.updatedContribution,
        rightist: {
          ...this.updatedContribution.rightist!,
          description: data.value,
        },
      };
    }

    if (data.type == 'other') {
      this.otherUpdatedContribution = {
        ...this.otherUpdatedContribution,
        rightist: {
          ...this.otherUpdatedContribution.rightist!,
          description: data.value,
        },
      };
    }
  }
}
