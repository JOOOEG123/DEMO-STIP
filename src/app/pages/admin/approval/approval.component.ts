import {
  animate,
  AnimationEvent,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConnectableObservable, ObjectUnsubscribedError, Subscription } from 'rxjs';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { ContributionsService } from 'src/app/core/services/contributions.service';
import { ImagesService } from 'src/app/core/services/images.service';
import { StorageApIService } from 'src/app/core/services/storage-api.service';
import {
  Categories,
  CategoryList,
  Contribution,
  ContributionJson,
  ContributionSchema,
  ImageSchema,
  Publish,
  Rightist,
} from 'src/app/core/types/adminpage.types';
import { UUID } from 'src/app/core/utils/uuid';
import { ContributionComponent } from '../contribution/contribution.component';

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

  newContributions: Contribution[] = [];
  approvedContributions: Contribution[] = [];
  rejectedContributions: Contribution[] = [];

  selectedContributions: Contribution[] = [];

  activeCategory!: Categories;
  selectedContribution!: Contribution;
  updatedContribution!: Contribution;

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

  contributionSubcription?: Subscription;
  rightistSubscription?: Subscription;

  contributions: any[] = [];
  publish: Publish = 'new';
  isLoaded: boolean = false;
  limit: number = 3;

  emptyContributionMessage = 'Nothing Here!';

  language?: string
  otherLanguage?: string

  constructor(
    private modalService: BsModalService,
    private contributionAPI: ContributionsService,
    private archiveAPI: ArchieveApiService,
    private imageAPI: ImagesService,
    private storageAPI: StorageApIService
  ) {}

  ngOnInit(): void {
    this.language = localStorage.getItem('lang')!
    this.otherLanguage = this.language === 'en' ? 'cn' : 'en'

    this.contributionSubcription = this.contributionAPI
      .fetchAllContributions(this.language)
      .subscribe((data: any) => {
        this.contributions.length = 0;
        this.newContributions.length = 0;
        this.approvedContributions.length = 0;
        this.rejectedContributions.length = 0;

        const test: ContributionJson[] = Object.values(data);
        for (let lol of test) {
          for (const contribution of Object.values(lol)) {
            if (contribution.rightist) {
              // initialize event if empty
              if (!contribution.rightist.events) {
                contribution.rightist.events = [];
              }

              if (!contribution.rightist.memoirs) {
                contribution.rightist.memoirs = [];
              }

              if (!contribution.rightist.imageId) {
                contribution.rightist.imageId = [];
              }
            }
            this.contributions.push(contribution);
          }
        }

        // make sure the latest contribution is at the top
        this.contributions.sort(function (a, b) {
          return (
            new Date(b.lastUpdatedAt).getTime() -
            new Date(a.lastUpdatedAt).getTime()
          );
        });

        for (let contribution of this.contributions) {
          let data: Contribution = {
            ...contribution,
            contributedAt: new Date(contribution.contributedAt),
            approvedAt: new Date(contribution.approvedAt),
            lastUpdatedAt: new Date(contribution.lastUpdatedAt),
            state: 'void',
          };

          if (contribution.publish == 'new') {
            this.newContributions.push(data);
          }

          if (contribution.publish == 'approved') {
            this.archiveAPI
              .getPersonById(data.rightistId)
              .subscribe((rightist: any) => {
                data.rightist = rightist;
                if (!data.rightist!.events) {
                  data.rightist!.events = []
                }
                if (!data.rightist!.memoirs) {
                  data.rightist!.memoirs = []
                }
                if (!data.rightist!.imageId) {
                  data.rightist!.imageId = []
                }
              })
            this.approvedContributions.push(data);
          }

          if (contribution.publish == 'rejected') {
            this.rejectedContributions.push(data);
          }
        }

        this.newContributions.sort(function (a, b) {
          return (
            new Date(b.contributedAt).getTime() -
            new Date(a.contributedAt).getTime()
          );
        });

        this.approvedContributions.sort(function (a, b) {
          return (
            new Date(b.approvedAt).getTime() - new Date(a.approvedAt).getTime()
          );
        });

        this.rejectedContributions.sort(function (a, b) {
          return (
            new Date(b.rejectedAt).getTime() - new Date(a.rejectedAt).getTime()
          );
        });
      });

    this.selectedContributions = this.newContributions;
    this.activeCategory = 'New Contributions';
  }

  ngOnDestroy(): void {
    this.contributionSubcription?.unsubscribe();
    this.rightistSubscription?.unsubscribe();
  }

  onApprove(contribution: Contribution) {
    this.modalRef?.hide();
    this.publish = 'approved';
    const index = this.selectedContributions.findIndex(
      (c) => c.contributionId == contribution.contributionId
    );
    this.selectedContribution = this.selectedContributions[index];
    this.selectedContribution.state = 'removed';
  }

  onReject(contribution: Contribution) {
    this.modalRef?.hide();
    this.publish = 'rejected';
    const index = this.selectedContributions.findIndex(
      (c) => c.contributionId == contribution.contributionId
    );

    this.selectedContribution = this.selectedContributions[index];
    this.selectedContribution.state = 'removed';
  }

  onReconsider(contribution: Contribution) {
    this.modalRef?.hide();
    this.publish = 'approved';
    const index = this.selectedContributions.findIndex(
      (c) => (c.contributionId = contribution.contributionId)
    );
    this.selectedContribution = this.selectedContributions[index];
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
      // update the current timestamp
      this.selectedContribution.rightist!.lastUpdatedAt = new Date();
      console.log(this.updatedContribution)
      
      if (this.selectedContribution.rightist) {
    
        this.selectedContribution.publish = this.publish;

        if (this.isReadMore) {
          this.updateSelectedContribution();

          console.log(this.selectedContribution)
  
          if (this.isImagedAdded) {
            await this.removePreviousImages(this.selectedContribution);
            await this.addNewImages(this.selectedContribution);
            this.selectedContribution.rightist.imageId = this.imageResult
            this.isImagedAdded = false
          }
        }
       
        const { state, ...contribution } = this.selectedContribution;

        // When approved
        if (this.publish === 'approved') {

          let { rightist, ...result } = contribution;
          result.rightistId = rightist!.rightistId;
          result.approvedAt = new Date();

          this.archiveAPI.addNewArchieve(rightist!).then(() => {});
          this.contributionAPI.addOrUpdateUserContribution(
            this.language!,
            this.selectedContribution.contributorId,
            this.selectedContribution.contributionId,
            result
          );
          //  When not approved
        } else {
          this.contributionAPI.addOrUpdateUserContribution(
            this.language!,
            this.selectedContribution.contributorId,
            this.selectedContribution.contributionId,
            contribution
          );
        }

        this.selectedContribution.state = 'void';
        this.isReadMore = false
      }
    }
  }

  onReadMore(template: TemplateRef<any>, contribution: Contribution) {
    this.isReadMore = true
    this.selectedContribution = contribution;
    this.updatedContribution = { ...contribution };
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
  }

  onEdit(contribution: Contribution) {
    this.modalRef?.hide();
    this.publish = 'approved';
    const index = this.selectedContributions.findIndex(
      (c) => c.contributionId == contribution.contributionId
    );

    this.selectedContribution = this.selectedContributions[index];
    this.selectedContribution.state = 'removed';
  }

  isReadMore: boolean = false

  onFormChange(data: any) {
    let { name, gender, status, ethnic, occupation, rightistYear, birthYear } =
      data;
    if (
      name &&
      gender &&
      status &&
      ethnic &&
      occupation &&
      rightistYear &&
      birthYear
    ) {
      this.updatedContribution = {
        ...this.updatedContribution!,
        rightist: {
          ...this.updatedContribution!.rightist!,
          fullName: name,
          gender: gender,
          status: status,
          ethnicity: ethnic,
          workplaceCombined: occupation,
          rightistYear: rightistYear,
          birthYear: birthYear,
        },
      };
    }
  }

  newImages: any[] = [];
  isImagedAdded : boolean = false

  onArrayChange(data: any) {
    let result = data.value.slice(0, -1)
    if (data.type == 'event') {
      this.updatedContribution = {
        ...this.updatedContribution!,
        rightist: {
          ...this.updatedContribution!.rightist!,
          events: result,
        },
      };
    }

    if (data.type == 'memoir') {
      this.updatedContribution = {
        ...this.updatedContribution!,
        rightist: {
          ...this.updatedContribution!.rightist!,
          memoirs: result,
        },
      };
    }

    if (data.type == 'image') {
      console.log(data.value)
      this.isImagedAdded = true
      this.newImages = data.value;
    }

    console.log(result);

    console.log(this.updatedContribution);
  }

  onContentChange(data: any) {
    this.updatedContribution = {
      ...this.updatedContribution,
      rightist: {
        ...this.updatedContribution.rightist!,
        description: data,
      }
    }
  }

  updateSelectedContribution() {
    this.selectedContribution.rightist!.fullName =
      this.updatedContribution.rightist!.fullName;
    this.selectedContribution.rightist!.gender =
      this.updatedContribution.rightist!.gender;
    this.selectedContribution.rightist!.status =
      this.updatedContribution.rightist!.status;
    this.selectedContribution.rightist!.ethnicity =
      this.updatedContribution.rightist!.ethnicity;
    this.selectedContribution.rightist!.job =
      this.updatedContribution.rightist!.job;
    this.selectedContribution.rightist!.rightistYear =
      this.updatedContribution.rightist!.rightistYear;
    this.selectedContribution.rightist!.birthYear =
      this.updatedContribution.rightist!.birthYear;
    this.selectedContribution.rightist!.events =
      this.updatedContribution.rightist!.events;
    this.selectedContribution.rightist!.memoirs =
      this.updatedContribution.rightist!.memoirs;
  }

  imageResult: string[] = [];

  async removePreviousImages(contribution: Contribution) {
    if (contribution.rightist) {
      let imagesId = contribution.rightist.imageId;
      for (const imageId of imagesId) {
        this.storageAPI.removeGalleryImage(imageId);
        await this.imageAPI.deleteImage(this.language!, imageId);
      }
    }
  }

  async addNewImages(contribution: Contribution) {
    console.log("Inside add New Images")
    console.log(this.newImages)
    for (const image of this.newImages) {
      let imageId = UUID();
      this.imageResult.push(imageId)
      await fetch(image.imageUrl).then(async (response) => {
        const contentType = response.headers.get('content-type');
        const blob = await response.blob();
        const file = new File([blob], UUID(), { type: contentType! });
        console.log(image);
        console.log(file);
        let imageDb: ImageSchema = {
          imageId: imageId,
          rightistId: contribution.rightistId,
          isGallery: image.imageUpload === 'yes',
          galleryCategory: image.imageCategory,
          galleryTitle: image.imageTitle,
          galleryDetail: image.imageDes,
          gallerySource: image.imageSource,
        };
        this.imageAPI.addOrUpdateImage(this.language!, imageDb)
        this.storageAPI.uploadGalleryImage(imageId, file)
      })
    }
    console.log(this.imageResult)
  }
}
