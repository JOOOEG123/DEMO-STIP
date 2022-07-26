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
import { Subscription } from 'rxjs';
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
  otherUpdatedContribution!: Contribution;

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

  sub: Subscription[] = [];

  contributions: any[] = [];
  publish: Publish = 'new';
  isLoaded: boolean = false;
  limit: number = 3;

  emptyContributionMessage = 'Nothing Here!';

  language?: string;
  otherLanguage?: string;

  constructor(
    private modalService: BsModalService,
    private contributionAPI: ContributionsService,
    private archiveAPI: ArchieveApiService,
    private imageAPI: ImagesService,
    private storageAPI: StorageApIService
  ) {}

  ngOnInit(): void {
    this.language = localStorage.getItem('lang')!;
    this.otherLanguage = this.language === 'en' ? 'cn' : 'en';

    this.sub.push(
      this.contributionAPI
        .fetchAllContributions(this.language)
        .subscribe((data: any) => {
          console.log(data);
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
              this.sub.push(
                this.archiveAPI
                  .getRightist(this.language!, data.rightistId)
                  .subscribe((rightist: any) => {
                    data.rightist = rightist;
                    if (!data.rightist!.events) {
                      data.rightist!.events = [];
                    }
                    if (!data.rightist!.memoirs) {
                      data.rightist!.memoirs = [];
                    }
                    if (!data.rightist!.imageId) {
                      data.rightist!.imageId = [];
                    }
                  })
              );
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
              new Date(b.approvedAt).getTime() -
              new Date(a.approvedAt).getTime()
            );
          });

          this.rejectedContributions.sort(function (a, b) {
            return (
              new Date(b.rejectedAt).getTime() -
              new Date(a.rejectedAt).getTime()
            );
          });
        })
    );

    this.selectedContributions = this.newContributions;
    this.activeCategory = 'New Contributions';
  }

  ngOnDestroy(): void {
    this.sub.forEach((x) => x.unsubscribe());
  }

  onApprove() {
    this.modalRef?.hide();
    this.publish = 'approved';
    console.log(this.selectedContribution);
    console.log(this.updatedContribution);
    console.log(this.otherUpdatedContribution);
    this.selectedContribution.state = 'removed';
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
      console.log(this.updatedContribution);

      if (this.updatedContribution.rightist) {
        this.updatedContribution.publish = this.publish;

        // Update Image
        for (const [
          index,
          imageId,
        ] of this.updatedContribution.rightist!.imageId.entries()) {
          this.sub.push(
            this.imageAPI
              .getImageUpdated(this.language!, imageId)
              .subscribe(async (data: any) => {
                let imageDb: ImageSchema = {
                  imageId: data.imageId,
                  rightistId: this.updatedContribution.rightistId,
                  isGallery: this.images[index].imageUpload === 'yes',
                  galleryCategory: this.images[index].imageCategory,
                  galleryTitle: this.images[index].imageTitle,
                  galleryDetail: this.images[index].imageDes,
                  gallerySource: this.images[index].imageSource,
                };

                let otherImageDb: ImageSchema = {
                  imageId: data.imageId,
                  rightistId: this.updatedContribution.rightistId,
                  isGallery: this.otherImages[index].imageUpload === 'yes',
                  galleryCategory: this.otherImages[index].imageCategory,
                  galleryTitle: this.otherImages[index].imageTitle,
                  galleryDetail: this.otherImages[index].imageDes,
                  gallerySource: this.otherImages[index].imageSource,
                };

                await this.imageAPI.addOrUpdateImage(this.language!, imageDb);
                await this.imageAPI.addOrUpdateImage(
                  this.otherLanguage!,
                  otherImageDb
                );
              })
          );
        }

        let contribution: ContributionSchema = {
          contributionId: this.updatedContribution.contributionId,
          contributorId: this.updatedContribution.contributorId,
          rightistId: this.updatedContribution.rightistId,
          rightist: this.updatedContribution.rightist!,
          publish: this.updatedContribution.publish,
          contributedAt: this.updatedContribution.contributedAt,
          approvedAt: this.updatedContribution.approvedAt,
          rejectedAt: this.updatedContribution.rejectedAt,
        };

        let otherContribution: ContributionSchema = {
          contributionId: this.otherUpdatedContribution.contributionId,
          contributorId: this.otherUpdatedContribution.contributorId,
          rightistId: this.otherUpdatedContribution.rightistId,
          rightist: this.otherUpdatedContribution.rightist!,
          publish: this.otherUpdatedContribution.publish,
          contributedAt: this.otherUpdatedContribution.contributedAt,
          approvedAt: this.otherUpdatedContribution.approvedAt,
          rejectedAt: this.otherUpdatedContribution.rejectedAt,
        };

        const { rightist, ...result } = contribution;
        const { rightist: otherRightist, ...otherResult } = otherContribution;

        // when approved
        if (this.publish === 'approved') {
          if (this.updatedContribution.publish === 'new') {
            result.approvedAt = new Date();
            otherResult.approvedAt = new Date();
          }

          rightist!.lastUpdatedAt = new Date();
          otherRightist!.lastUpdatedAt = new Date();

          await this.contributionAPI.addOrUpdateUserContribution(
            this.language!,
            this.selectedContribution.contributorId,
            this.selectedContribution.contributionId,
            result
          );

          await this.contributionAPI.addOrUpdateUserContribution(
            this.otherLanguage!,
            this.selectedContribution.contributorId,
            this.selectedContribution.contributionId,
            otherResult
          );

          await this.archiveAPI.addOrUpdateRightist(this.language!, rightist!);
          await this.archiveAPI.addOrUpdateRightist(
            this.otherLanguage!,
            otherRightist!
          );
        }

        // When approved
        if (this.publish === 'rejected') {
          if (this.updatedContribution.publish === 'new') {
            result.rejectedAt = new Date();
            otherResult.rejectedAt = new Date();
          }

          rightist!.lastUpdatedAt = new Date();
          otherRightist!.lastUpdatedAt = new Date();

          await this.contributionAPI.addOrUpdateUserContribution(
            this.language!,
            this.updatedContribution.contributorId,
            this.updatedContribution.contributionId,
            contribution
          );

          await this.contributionAPI.addOrUpdateUserContribution(
            this.otherLanguage!,
            this.updatedContribution.contributorId,
            this.updatedContribution.contributionId,
            otherContribution
          );
        }

        this.selectedContribution.state = 'void';
        this.isReadMore = false;
      }
    }
  }

  onReadMore(template: TemplateRef<any>, contribution: Contribution) {
    this.isReadMore = true;
    this.selectedContribution = contribution;
    this.updatedContribution = { ...contribution };
    this.otherUpdatedContribution = { ...contribution };
    this.modalRef = this.modalService.show(template, { class: 'modal-xl' });
  }

  onEdit() {
    this.modalRef?.hide();
    this.publish = 'approved';
    this.selectedContribution.state = 'removed';
  }

  isReadMore: boolean = false;

  onFormChange(data: any) {
    console.log(data);
    if (data.type === 'form') {
      this.updatedContribution = {
        ...this.updatedContribution!,
        rightist: {
          ...this.updatedContribution!.rightist!,
          fullName: data.form.name,
          gender: data.form.gender,
          status: data.form.status,
          ethnicity: data.form.ethnic,
          workplaceCombined: data.form.occupation,
          rightistYear: data.form.rightistYear,
          birthYear: data.form.birthYear,
        },
      };

      this.otherUpdatedContribution = {
        ...this.otherUpdatedContribution!,
        rightist: {
          ...this.updatedContribution!.rightist!,
          fullName: data.otherForm.name,
          gender: data.otherForm.gender,
          status: data.otherForm.status,
          ethnicity: data.otherForm.ethnic,
          workplaceCombined: data.otherForm.occupation,
          rightistYear: data.otherForm.rightistYear,
          birthYear: data.otherForm.birthYear,
        },
      };
    }
  }

  images: any[] = [];
  otherImages: any[] = [];

  isImagedAdded: boolean = false;

  onArrayChange(data: any) {
    console.log(data);
    
    let result = data.value
    let otherResult = data.otherValue

    if (data.type == 'event') {
      this.updatedContribution = {
        ...this.updatedContribution!,
        rightist: {
          ...this.updatedContribution!.rightist!,
          events: result,
        },
      };

      this.otherUpdatedContribution = {
        ...this.otherUpdatedContribution!,
        rightist: {
          ...this.updatedContribution!.rightist!,
          events: otherResult,
        },
      };
    }

    if (data.type == 'memoir') {
      this.updatedContribution = {
        ...this.otherUpdatedContribution!,
        rightist: {
          ...this.otherUpdatedContribution!.rightist!,
          memoirs: result,
        },
      };

      this.otherUpdatedContribution = {
        ...this.otherUpdatedContribution!,
        rightist: {
          ...this.otherUpdatedContribution!.rightist!,
          memoirs: otherResult,
        },
      };
    }

    if (data.type == 'image') {
      console.log(data.value);
      this.images = data.value;
      this.otherImages = data.otherValue;
    }

    console.log(this.updatedContribution);
  }

  onContentChange(data: any) {
    if (data.type === 'current') {
      this.updatedContribution = {
        ...this.updatedContribution,
        rightist: {
          ...this.updatedContribution.rightist!,
          description: data.value,
        },
      };
    }

    if (data.type === 'other') {
      this.otherUpdatedContribution = {
        ...this.otherUpdatedContribution,
        rightist: {
          ...this.otherUpdatedContribution.rightist!,
          description: data.value,
        },
      };
    }
  }

  imageResult: string[] = [];

  async removePreviousImages(contribution: Contribution) {
    if (contribution.rightist) {
      let imagesId = contribution.rightist.imageId;
      for (const imageId of imagesId) {
        this.storageAPI.removeGalleryImage(imageId);
        await this.imageAPI.deleteImage(this.language!, imageId);
        await this.imageAPI.deleteImage(this.otherLanguage!, imageId);
      }
    }
  }

  // async addNewImages(contribution: Contribution) {
  //   console.log('Inside add New Images');
  //   console.log(this.newImages);

  //   for (const [index, image] of this.newImages.entries()) {
  //     if (!image.imageUrl.startsWith('https')) {
  //       let imageId = UUID();
  //       this.imageResult.push(imageId);
  //       await fetch(image.imageUrl).then(async (response) => {
  //         const contentType = response.headers.get('content-type');
  //         const blob = await response.blob();
  //         const file = new File([blob], UUID(), { type: contentType! });
  //         console.log(image);
  //         console.log(file);
  //         let imageDb: ImageSchema = {
  //           imageId: imageId,
  //           rightistId: contribution.rightistId,
  //           isGallery: image.imageUpload === 'yes',
  //           galleryCategory: image.imageCategory,
  //           galleryTitle: image.imageTitle,
  //           galleryDetail: image.imageDes,
  //           gallerySource: image.imageSource,
  //         };

  //         let otherImageDb: ImageSchema = {
  //           imageId: imageId,
  //           rightistId: contribution.rightistId,
  //           isGallery: image.imageUpload === 'yes',
  //           galleryCategory: this.otherNewImages[index].imageCategory,
  //           galleryTitle: this.otherNewImages[index].imageTitle,
  //           galleryDetail: this.otherNewImages[index].imageDes,
  //           gallerySource: this.otherNewImages[index].imageSource,
  //         };

  //         await this.imageAPI.addOrUpdateImage(this.language!, imageDb);
  //         await this.imageAPI.addOrUpdateImage(this.otherLanguage!, otherImageDb);
  //         await this.storageAPI.uploadGalleryImage(imageId, file);
  //       });
  //     }
  //     else {
  //       let imageDb: ImageSchema = {
  //         imageId: image.imageId,
  //         rightistId: contribution.rightistId,
  //         isGallery: image.imageUpload === 'yes',
  //         galleryCategory: image.imageCategory,
  //         galleryTitle: image.imageTitle,
  //         galleryDetail: image.imageDes,
  //         gallerySource: image.imageSource,
  //       };

  //       let otherImageDb: ImageSchema = {
  //         imageId: ,
  //         rightistId: contribution.rightistId,
  //         isGallery: image.imageUpload === 'yes',
  //         galleryCategory: this.otherNewImages[index].imageCategory,
  //         galleryTitle: this.otherNewImages[index].imageTitle,
  //         galleryDetail: this.otherNewImages[index].imageDes,
  //         gallerySource: this.otherNewImages[index].imageSource,
  //       };

  //       await this.imageAPI.addOrUpdateImage(this.language!, imageDb);
  //       await this.imageAPI.addOrUpdateImage(this.otherLanguage!, otherImageDb);
  //     }
  //   }
  //   console.log(this.imageResult);
  // }
}
