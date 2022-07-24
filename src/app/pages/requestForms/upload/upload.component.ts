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
  imageId: string;
  imageUrl: string;
  imageUpload: string;
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
  private _contribution!: Contribution;
  contributionId!: string;
  sub: Subscription[] = [];

  language!: string
  otherLanguage!: string

  isFormCleared: boolean = false;
  isEventCleared: boolean = false;
  isMemoirCleared: boolean = false;
  isImageCleared: boolean = false;

  isImageLoaded: boolean = false;

  @Input() get contribution() {
    return this._contribution;
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
  otherFormData?: FormData

  events: Event[] = [];
  memoirs: Memoir[] = [];
  images: ImageData[] = [];
  description: string = '';

  isAdmin: boolean = false;

  constructor(
    private contributionService: ContributionsService,
    private auth: AuthServiceService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private imageAPI: ImagesService,
    private storageAPI: StorageApIService
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
  }

  ngOnInit(): void {
    this.language = localStorage.getItem('lang')!
    this.otherLanguage = this.language === 'en' ? 'cn' : 'en'

    if (this.auth.isAdmin.value) {
      this.isAdmin = true;
    }

    if (this.page === 'contribution') {
      this.updateData();
    } else {
      this.sub.push(
        this.activatedRoute.queryParams.subscribe((params) => {
          this.contributionId = params['contributionId'];
          this.page = params['page'];
          if (this.page === 'account') {
            if (this.contributionId) {
              this.sub.push(
                this.contributionService
                  .fetchContributorByContributionId(this.contributionId)
                  .subscribe((contribution: any) => {
                    this.contribution = contribution;
                    this.updateData();
                  })
              );
            }
          } else {
            this.isImageLoaded = true;
          }
        })
      );
    }
  }

  imageSubscription?: Subscription;

  updateData() {
    console.log(this.contribution);
    if (this.contribution) {
      this.contributionId = this.contribution.contributionId;
      if (this.contribution.rightist) {
        let rightist = this.contribution.rightist;
        this.description = rightist.description;
        console.log(rightist);

        // ensure events exist
        if (rightist.events) {
          for (const event of rightist.events) {
            this.events.push(event);
          }
        }

        // ensure memoirs exist
        if (rightist.memoirs) {
          for (const memoir of rightist.memoirs) {
            this.memoirs.push(memoir);
          }
        }

        if (this.contribution.rightist!.imageId.length > 0) {
          if (rightist.imageId) {
            let counter = 0;
            console.log('inside');
            for (const imageId of rightist.imageId) {
              this.imageSubscription = this.imageAPI
                .getImage(imageId)
                .subscribe((data: any) => {
                  this.storageAPI
                    .getGalleryImageURL(imageId)
                    .subscribe((imageUrl) => {
                      counter += 1;
                      this.images.push({
                        imageId: imageId,
                        imageUrl: imageUrl,
                        imageUpload: data.isGallery ? 'yes' : 'no',
                        image: '',
                        imageCategory: data.galleryCategory,
                        imageTitle: data.galleryTitle,
                        imageDes: data.galleryDetail,
                        imageSource: data.gallerySource,
                      });

                      // ensure all images are loaded before display
                      if (counter == rightist.imageId.length) {
                        this.isImageLoaded = true;
                      }
                    });
                });
            }
          }
        }
        // No Images Stored
        else {
          this.isImageLoaded = true;
        }

        this.formData = {
          name: rightist.fullName,
          gender: rightist.gender!,
          ethnic: rightist.ethnicity,
          status: rightist.status,
          occupation: rightist.workplaceCombined,
          rightistYear: rightist.rightistYear,
          birthYear: rightist.birthYear,
        };
        console.log(rightist)
        if (this.isAdmin) {
          this.otherFormData = {
            name: '未知',
            gender: '男性',
            ethnic: rightist.ethnicity,
            status: '活',
            occupation: rightist.workplaceCombined,
            rightistYear: rightist.rightistYear,
            birthYear: rightist.birthYear,
          };
        }
      }
    }
    console.log(this.images);
  }

  onFormChange(data: any) {
    if (data.type == 'form') {
      this.formData = { ...data.value };
      this.formChange.emit(data.value);
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
      this.events = [...data.value];
      this.isWarning = data.warning;
      this.arrayChange.emit({
        type: data.type,
        value: this.events,
      });
    }
  }

  onMemoirChange(data: any) {
    if (this.isMemoirCleared) {
      this.isMemoirCleared = false;
    }
    if (data.type === 'memoir') {
      console.log('inside memoir');
      this.memoirs = [...data.value];
      console.log(this.memoirs);
      this.isWarning = data.warning;
      this.arrayChange.emit({
        type: data.type,
        value: this.memoirs,
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
      this.images = [...data.value];
      console.log(this.images);
      this.isWarning = data.warning;
      this.arrayChange.emit({
        type: data.type,
        value: this.images,
      });
    }
  }

  onContentChange(data: any) {
    this.contentChange.emit({
      value: data,
    });
  }

  async onSubmit() {
    // remove the last element that contains no data
    this.events = this.events.slice(0, this.events.length - 1);
    this.memoirs = this.memoirs.slice(0, this.memoirs.length - 1);
    this.images = this.images.slice(0, this.images.length - 1);

    let imageResult: string[] = [];

    const rightistId =
      this.contribution?.rightist?.rightistId || `Rightist-${UUID()}`;

    for (const image of this.images) {
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
        await this.imageAPI
          .addImage(imageDb)
          .then(() => {
            this.storageAPI.uploadGalleryImage(imageId, file);
          })
          .then(() => {
            imageResult.push(imageId);
          });
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

    this.contributionService
      .contributionsAddEdit({
        contributionId: this.contributionId || UUID(),
        contributorId: this.auth.uid,
        rightistId: rightistId,
        contributedAt: new Date(),
        approvedAt: new Date(),
        rejectedAt: new Date(),
        publish: 'new',
        rightist: {
          rightistId: rightistId,
          contributorId: this.auth.uid,
          imageId: [...imageResult],
          initial: name.trim().charAt(0).toUpperCase(),
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
        },
      })
      .then(() => {
        this.route.navigateByUrl('/account');
      });
  }
}
