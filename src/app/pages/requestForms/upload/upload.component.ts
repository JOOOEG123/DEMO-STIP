import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';
import { ContributionsService } from 'src/app/core/services/contributions.service';
import { ImagesService } from 'src/app/core/services/images.service';
import { StorageApIService } from 'src/app/core/services/storage-api.service';
import {
  Contribution,
  Memoir,
  Event,
  Status,
  Gender,
  Ethnicity,
  ImageSchema,
  Rightist,
  RightistSchema,
  Publish,
} from 'src/app/core/types/adminpage.types';
import { UUID } from 'src/app/core/utils/uuid';

type FormData = {
  name: string;
  gender: Gender;
  status: Status;
  ethnic: Ethnicity;
  occupation: string;
  rightistYear: number;
  birthYear: number;
};

type ImageData = {
  imageUrl: string;
  imageUpload: string;
  isProfile: string;
  image: string;
  imageCategory: string;
  imageTitle: string;
  imageDes: string;
  imageSource: string;
};

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit, OnDestroy {
  private _contribution?: Contribution;
  contributionId!: string;
  sub: Subscription[] = [];

  language!: string;
  otherLanguage!: string;

  isFormCleared: boolean = false;
  isEventCleared: boolean = false;
  isMemoirCleared: boolean = false;
  isImageCleared: boolean = false;

  isImageLoaded: boolean = false;

  @Input() get contribution() {
    return this._contribution!;
  }
  set contribution(contribution: Contribution) {
    if (contribution.rightist) {
      this._contribution = contribution;
    }
  }

  @Input() page?: string;
  @Output() formChange: EventEmitter<any> = new EventEmitter();
  @Output() arrayChange: EventEmitter<any> = new EventEmitter();
  @Output() contentChange: EventEmitter<any> = new EventEmitter();

  formData?: FormData;
  otherFormData?: FormData;

  events: Event[] = [];
  otherEvents: Event[] = [];

  memoirs: Memoir[] = [];
  otherMemoirs: Memoir[] = [];

  images: ImageData[] = [];
  otherImages: ImageData[] = [];

  description: string = '';

  isAdmin: boolean = false;

  constructor(
    private contributionService: ContributionsService,
    private auth: AuthServiceService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private imageAPI: ImagesService,
    private storageAPI: StorageApIService,
    private archiveAPI: ArchieveApiService
  ) {}

  clear() {
    if (this.formData) {
      this.formData.name = '';
      this.formData.gender = '';
      this.formData.status = '';
      this.formData.ethnic = '';
      this.formData.occupation = '';
      this.formData.birthYear = 0;
      this.formData.rightistYear = 0;
    }
  }

  clear2() {
    this.isEventCleared = true;
    this.isMemoirCleared = true;
    this.isImageCleared = true;
    this.description = '';
  }

  ngOnDestroy(): void {
    this.sub.forEach((sub) => sub.unsubscribe());
    this.imageSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
  }

  authSubscription?: Subscription;

  ngOnInit(): void {
    this.language = localStorage.getItem('lang')!;
    this.otherLanguage = this.language === 'en' ? 'cn' : 'en';

    this.sub.push(
      this.auth.isAdmin.subscribe((data) => {
        this.isAdmin = data;
      })
    );

    if (this.page === 'contribution') {
      this.updateData();
    } else {
      this.sub.push(
        this.activatedRoute.queryParams.subscribe((params) => {
          this.contributionId = params['contributionId'];
          this.page = params['page'];
          if (this.page === 'account') {
            console.log(this.contributionId);
            if (this.contributionId) {
              this.sub.push(
                this.contributionService
                  .getUserContributionByAuth(this.language, this.contributionId)
                  .subscribe((contribution: any) => {
                    console.log(contribution);
                    this.contribution = contribution;
                    this.updateData();
                  })
              );
            }
          } else {
            // when in upload page
            this.isImageLoaded = true;
            this.loaded = true;
          }
        })
      );
    }
  }

  imageSubscription?: Subscription;

  updateData() {
    console.log(this.contribution);
    if (this.contribution) {
      if (this.contribution.publish) {
        this.contributionId = this.contribution.contributionId;
        // rightist exists in new and rejected contributions
        if (this.contribution.rightist) {
          let rightist = this.contribution.rightist;
          this.description = rightist.description;

          this.formData = {
            name: rightist.fullName,
            gender: rightist.gender,
            status: rightist.status,
            ethnic: rightist.ethnicity,
            occupation: rightist.workplaceCombined,
            birthYear: rightist.birthYear,
            rightistYear: rightist.rightistYear,
          };

          this.sub.push(
            this.contributionService
              .getUserContribution(
                this.otherLanguage,
                this.contribution.contributorId,
                this.contributionId
              )
              .subscribe((data: any) => {
                if (data.rightist) {
                  let otherRightist = data.rightist;
                  this.otherFormData = {
                    name: otherRightist.fullName,
                    gender: otherRightist.gender,
                    status: otherRightist.status,
                    ethnic: otherRightist.ethnicity,
                    occupation: otherRightist.workplaceCombined,
                    birthYear: otherRightist.birthYear,
                    rightistYear: otherRightist.rightistYear,
                  };
                  this.otherEvents = otherRightist.events;
                  this.otherMemoirs = otherRightist.memoirs;
                  this.otherDescription = otherRightist.description;
                  this.loaded = true;
                } else {
                  this.archiveAPI
                    .getRightist(
                      this.otherLanguage,
                      this.contribution.rightistId
                    )
                    .subscribe((otherRightist: any) => {
                      this.otherFormData = {
                        name: otherRightist.fullName,
                        gender: otherRightist.gender,
                        status: otherRightist.status,
                        ethnic: otherRightist.ethnicity,
                        occupation: otherRightist.workplaceCombined,
                        birthYear: otherRightist.birthYear,
                        rightistYear: otherRightist.rightistYear,
                      };
                      this.otherEvents = otherRightist.events;
                      this.otherMemoirs = otherRightist.memoirs;
                      this.otherDescription = otherRightist.description;
                      this.loaded = true;
                    });
                  }
              })
          );

          // ensure events exist
          if (rightist.events) {
            // for (const event of rightist.events) {
            //   this.events.push(event);
            // }
            this.events = rightist.events;
          }

          // ensure memoirs exist
          if (rightist.memoirs) {
            // for (const memoir of rightist.memoirs) {
            //   this.memoirs.push(memoir);
            // }
            this.memoirs = rightist.memoirs;
          }

          // images
          if (this.contribution.rightist!.imageId.length > 0) {
            if (rightist.imageId) {
              let counter = 0;
              console.log('inside');
              for (const imageId of rightist.imageId) {
                this.sub.push(
                  this.imageAPI
                    .getImageUpdated(this.language, imageId)
                    .subscribe((data: any) => {
                      this.imageAPI
                        .getImageUpdated(this.otherLanguage, imageId)
                        .subscribe((other: any) => {
                          this.storageAPI
                            .getImageURL(imageId)
                            .subscribe((imageUrl) => {
                              counter += 1;
                              this.images.push({
                                imageUrl: imageUrl,
                                imageUpload: data.isGallery ? 'yes' : 'no',
                                image: '',
                                imageCategory: data.galleryCategory,
                                imageTitle: data.galleryTitle,
                                imageDes: data.galleryDetail,
                                imageSource: data.gallerySource,
                                isProfile: data.isProfile,
                              });

                              this.otherImages.push({
                                imageUrl: imageUrl,
                                imageUpload: other.isGallery ? 'yes' : 'no',
                                image: '',
                                imageCategory: other.galleryCategory,
                                imageTitle: other.galleryTitle,
                                imageDes: other.galleryDetail,
                                imageSource: other.gallerySource,
                                isProfile: data.isProfile,
                              });

                              // ensure all images are loaded before display
                              if (counter == rightist.imageId.length) {
                                this.isImageLoaded = true;
                              }
                            });
                        });
                    })
                );
              }
            }
          }
          // No Images Stored
          else {
            this.isImageLoaded = true;
          }
        }
      }
    }
  }

  loaded: boolean = false;

  onFormChange(data: any) {
    if (data.type == 'form') {
      this.formData = {
        name: data.value.name,
        gender: data.value.gender,
        status: data.value.status,
        ethnic: data.value.ethnic,
        occupation: data.value.occupation,
        birthYear: data.value.birthYear,
        rightistYear: data.value.rightistYear,
      };

      this.otherFormData = {
        name: data.value.otherName,
        gender: data.value.otherGender,
        status: data.value.otherStatus,
        ethnic: data.value.otherEthnic,
        occupation: data.value.otherOccupation,
        birthYear: data.value.birthYear,
        rightistYear: data.value.rightistYear,
      };
      this.formChange.emit({
        type: 'form',
        form: this.formData,
        otherForm: this.otherFormData,
      });
    }
  }

  isWarning: boolean = false;

  onEventChange(data: any) {
    if (this.isEventCleared) {
      this.isEventCleared = false;
    }
    if (data.type === 'event') {
      console.log('inside event');
      console.log(data.value);

      let result: Event[] = [];
      let otherResult: Event[] = [];

      for (const event of data.value) {
        result.push({
          startYear: event.startYear,
          endYear: event.endYear,
          event: event.event,
        });

        otherResult.push({
          startYear: event.startYear,
          endYear: event.endYear,
          event: event.otherEvent,
        });
      }

      this.events = result;
      this.otherEvents = otherResult;

      this.isWarning = data.warning;
      this.arrayChange.emit({
        type: data.type,
        value: this.events,
        otherValue: this.otherEvents,
      });
    }
  }

  onMemoirChange(data: any) {
    if (this.isMemoirCleared) {
      this.isMemoirCleared = false;
    }
    if (data.type === 'memoir') {
      console.log('inside memoir');

      let result: Memoir[] = [];
      let otherResult: Memoir[] = [];
      console.log(data.value);
      for (const memoir of data.value) {
        result.push({
          memoirTitle: memoir.memoirTitle,
          memoirAuthor: memoir.memoirAuthor,
          memoirContent: memoir.memoirContent,
        });

        otherResult.push({
          memoirTitle: memoir.otherMemoirTitle,
          memoirAuthor: memoir.otherMemoirAuthor,
          memoirContent: memoir.otherMemoirContent,
        });
      }

      this.memoirs = result;
      this.otherMemoirs = otherResult;

      console.log(this.memoirs);
      console.log(this.otherMemoirs);

      this.isWarning = data.warning;
      this.arrayChange.emit({
        type: data.type,
        value: this.memoirs,
        otherValue: this.otherMemoirs,
      });
    }
  }

  onImageChange(data: any) {
    console.log(data);
    if (this.isImageCleared) {
      this.isImageCleared = false;
    }

    if (data.type === 'image') {
      console.log('inside Image');

      let result: ImageData[] = [];
      let otherResult: ImageData[] = [];

      for (const image of data.value) {
        result.push({
          imageUrl: image.imageUrl,
          imageUpload: image.imageUpload,
          image: image.image,
          imageCategory: image.imageCategory,
          imageTitle: image.imageTitle,
          imageDes: image.imageDes,
          imageSource: image.imageSource,
          isProfile: image.isProfile,
        });

        otherResult.push({
          imageUrl: image.imageUrl,
          imageUpload: image.imageUpload,
          image: image.image,
          imageCategory: image.otherImageCategory,
          imageTitle: image.otherImageTitle,
          imageDes: image.otherImageDes,
          imageSource: image.otherImageSource,
          isProfile: image.isProfile,
        });
      }

      this.images = result;
      this.otherImages = otherResult;

      this.isWarning = data.warning;
      this.arrayChange.emit({
        type: data.type,
        value: this.images,
        otherValue: this.otherImages,
      });
    }
  }

  otherDescription: string = '';

  onContentChange(data: any) {
    this.contentChange.emit({
      type: 'current',
      value: data,
    });
  }

  onOtherContentChange(data: any) {
    this.contentChange.emit({
      type: 'other',
      value: data,
    });
  }

  async onSubmit() {
    // remove the last element that contains no data
    this.events = this.events.slice(0, this.events.length - 1);
    this.otherEvents = this.otherEvents.slice(0, this.otherEvents.length - 1);

    this.memoirs = this.memoirs.slice(0, this.memoirs.length - 1);
    this.otherMemoirs = this.otherMemoirs.slice(
      0,
      this.otherMemoirs.length - 1
    );

    this.images = this.images.slice(0, this.images.length - 1);
    this.otherImages = this.otherImages.slice(0, this.otherImages.length - 1);

    console.log(this.formData);
    console.log(this.otherFormData);

    console.log(this.events);
    console.log(this.otherEvents);

    console.log(this.memoirs);
    console.log(this.otherMemoirs);

    console.log(this.images);
    console.log(this.otherImages);

    const rightistId =
      this.contribution?.rightist?.rightistId || `Rightist-${UUID()}`;

    let imageResult: string[] = [];
    let profileImageId: string = '';

    // push images
    for (const [index, image] of this.images.entries()) {
      let imageId = `Image-${UUID()}`;
      await fetch(image.imageUrl).then(async (response) => {
        const contentType = response.headers.get('content-type');
        const blob = await response.blob();
        const file = new File([blob], UUID(), { type: contentType! });
        let imageDb: ImageSchema = {
          imageId: imageId,
          rightistId: rightistId,
          isGallery: image.imageUpload === 'yes',
          galleryCategory: image.imageCategory,
          galleryTitle: image.imageTitle,
          galleryDetail: image.imageDes,
          gallerySource: image.imageSource,
        };

        let otherImageDb: ImageSchema = {
          imageId: imageId,
          rightistId: rightistId,
          isGallery: image.imageUpload === 'yes',
          galleryCategory: this.otherImages[index].imageCategory,
          galleryTitle: this.otherImages[index].imageTitle,
          galleryDetail: this.otherImages[index].imageDes,
          gallerySource: this.otherImages[index].imageSource,
        };

        if (image.isProfile === 'yes') {
          profileImageId = imageId;
        }

        await this.imageAPI.addOrUpdateImage(this.language!, imageDb);
        await this.imageAPI.addOrUpdateImage(this.otherLanguage!, otherImageDb);
        await this.storageAPI.addImage(imageId, file);

        imageResult.push(imageId);
      });
    }

    const {
      name,
      gender,
      status,
      ethnic,
      rightistYear,
      occupation,
      birthYear,
    } = this.formData!;

    if (!this.contribution) {
      let rightist: RightistSchema = {
        rightistId: rightistId,
        contributorId: this.auth.uid,
        imageId: [...imageResult],
        profileImageId: profileImageId,
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
        events: this.events,
        memoirs: this.memoirs,
        reference: '',
        description: this.description,
        lastUpdatedAt: new Date(),
        source: 'contributed',
      };

      let otherRightist: RightistSchema = {
        rightistId: rightistId,
        contributorId: this.auth.uid,
        imageId: [...imageResult],
        profileImageId: profileImageId,
        initial: '',
        firstName: '',
        lastName: '',
        fullName: this.otherFormData!.name,
        gender: this.otherFormData!.gender,
        birthYear: this.otherFormData!.birthYear,
        deathYear: 0,
        rightistYear: rightistYear,
        status: this.otherFormData!.status || 'Unknown',
        ethnicity: this.otherFormData!.ethnic || '',
        job: '',
        detailJob: '',
        workplace: '',
        workplaceCombined: this.otherFormData!.occupation,
        events: this.otherEvents,
        memoirs: this.otherMemoirs,
        reference: '',
        description: this.otherDescription!,
        lastUpdatedAt: new Date(),
        source: 'contributed',
      };

      let contributionId = this.contributionId || UUID();
      console.log(rightist);
      console.log(otherRightist);
      if (this.isAdmin) {
        await this.contributionService.addOrUpdateUserContribution(
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
        );
        await this.archiveAPI.addOrUpdateRightist(this.language, rightist);
        await this.contributionService.addOrUpdateUserContribution(
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
        );
        await this.archiveAPI
          .addOrUpdateRightist(this.otherLanguage, otherRightist)
          .then(() => {
            this.route.navigateByUrl('/account');
          });
      } else {
        await this.contributionService.addOrUpdateUserContribution(
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
        );
        await this.contributionService
          .addOrUpdateUserContribution(
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
          )
          .then(() => {
            this.route.navigateByUrl('/account');
          });
      }
    }
  }
}
