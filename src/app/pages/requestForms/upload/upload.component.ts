import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, zip } from 'rxjs';
import {
  ETHNIC_GROUP_CONSTANTS,
  LIST_OF_GENDER,
  LIST_OF_STATUS,
} from 'src/app/core/constants/group.constants';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';
import { ContributionsService } from 'src/app/core/services/contributions.service';
import { ImagesService } from 'src/app/core/services/images.service';
import { StorageApIService } from 'src/app/core/services/storage-api.service';
import {
  Contribution,
  ContributionDetails,
  ContributionSchema,
  Event,
  ImageSchema,
  langType,
  Memoir,
  Rightist,
  RightistSchema,
} from 'src/app/core/types/adminpage.types';
import { UUID } from 'src/app/core/utils/uuid';
import { mapOtherEvents, mapOtherRightists } from './upload.helper';



@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit, OnDestroy {
  // private _contribution!: Contribution;
  private _contribution: langType = {} as any;
  contributionId!: string;
  rightist?: Rightist;
  isLoading: boolean = false;


  ethnicGroup: string[] = [];
  genders: string[] = [];
  statuses: string[] = [];

  otherGenders: string[] = [];
  otherStatuses: string[] = [];

  occupation: string[] = [];

  selected?: string;
  selected2?: string;
  sub: Subscription[] = [];
  url = '';
  minDate: Date = new Date('1940-01-01');
  maxDate: Date = new Date('1965-01-01');
  minDate2: Date = new Date('1850-01-01');
  maxDate2: Date = new Date('2050-01-01');

  isAdmin: boolean = false;
  imageDisabled: boolean = false;

  allForms = this.formBuilder.group({
    event: [],
    imagesDetails: [],
    memoir: [],
    rightist: [],
    content: [''],
    otherContent: [''],
  });

  language = this.translate.currentLang;
  otherLanguage = this.language === 'en' ? 'cn' : 'en';


  @Input() get contribution() {
    return this._contribution[this.language];
  }

  set contribution(contribution: ContributionDetails) {
    if (contribution?.rightist) {
      this._contribution[this.language] = contribution;
    }
  }

  @Input() page: string = '';

  @Output() formChange: EventEmitter<any> = new EventEmitter();
  @Output() eventChange: EventEmitter<any> = new EventEmitter();
  @Output() memoirChange: EventEmitter<any> = new EventEmitter();
  @Output() imageChange: EventEmitter<any> = new EventEmitter();
  @Output() descriptionChange: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();

  // language: string = '';
  // otherLanguage: string = '';
  // sub: Subscription[] = [];
  subLang: Subscription[] = [];

  languageSubscription?: Subscription;
  authSubscription?: Subscription;

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    otherName: new FormControl('', Validators.required),
    gender: new FormControl(''),
    otherGender: new FormControl(''),
    status: new FormControl(''),
    otherStatus: new FormControl(''),
    ethnic: new FormControl(''),
    otherEthnic: new FormControl(''),
    occupation: new FormControl('', Validators.required),
    otherOccupation: new FormControl('', Validators.required),
    workplace: new FormControl(''),
    otherWorkplace: new FormControl(''),
    birthYear: new FormControl('', Validators.required),
    deathYear: new FormControl('', Validators.required),
    rightistYear: new FormControl('', Validators.required),
  });

  description: string = '';
  otherDescription: string = '';

  cleared: boolean = false;
  imageLoaded: boolean = false;

  imageData: ImageSchema = {
    imageId: '',
    rightistId: '',
    isGallery: false,
    galleryCategory: '',
    galleryTitle: '',
    galleryDetail: '',
    gallerySource: '',
  };

  otherImageData: ImageSchema = {
    imageId: '',
    rightistId: '',
    isGallery: false,
    galleryCategory: '',
    galleryTitle: '',
    galleryDetail: '',
    gallerySource: '',
  };

  eventArray = new FormArray([]);
  memoirArray = new FormArray([]);

  private newEvent() {
    return new FormGroup({
      startYear: new FormControl(''),
      endYear: new FormControl(''),
      event: new FormControl(''),
      otherEvent: new FormControl(''),
    });
  }

  private newMemoir() {
    return new FormGroup({
      memoirTitle: new FormControl(''),
      memoirContent: new FormControl(''),
      memoirAuthor: new FormControl(''),
      otherMemoirTitle: new FormControl(''),
      otherMemoirAuthor: new FormControl(''),
      otherMemoirContent: new FormControl(''),
    });
  }

  get eventControls() {
    return this.eventArray.controls as FormGroup[];
  }

  get memoirControls() {
    return this.memoirArray.controls as FormGroup[];
  }

  removeMemoir(i: number) {
    this.memoirArray.removeAt(i);
  }

  constructor(
    private contributionService: ContributionsService,
    private auth: AuthServiceService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private imageAPI: ImagesService,
    private archiveAPI: ArchieveApiService,
    private storageAPI: StorageApIService,
    private translate: TranslateService,
    private contributionAPI: ContributionsService,
    private formBuilder: FormBuilder
  ) {}

  clear2() {
    this.allForms.reset();
  }


  ngOnDestroy(): void {
    this.sub.forEach((sub) => sub.unsubscribe());
    // this.languageSubscription?.unsubscribe();
    // this.authSubscription?.unsubscribe();
    // this.sub.forEach((sub) => sub.unsubscribe());
    this.subLang.forEach((sub) => sub.unsubscribe());
  }

  descriptionChanged(data: any) {
    // this will will update / remove later
    // console.log(data);
    // this.allForms.get('content')?.setValue(data);
    this.descriptionChange.emit({
      type: 'original',
      value: data
    });
  }

  otherDescriptionChanged(data: any) {
    // this.allForms.get('otherContent')?.setValue(data);
    this.descriptionChange.emit({
      type: 'other',
      value: data,
    });
  }

  // onImageChange(data: any) {
  //   console.log(data);
  //   if (data.type == 'image') {
  //     this.imageData = {
  //       ...this.imageData,
  //       isGallery: data.value.imageUpload === 'yes',
  //       galleryCategory: data.value.imageCategory || '',
  //       galleryTitle: data.value.imageTitle || '',
  //       galleryDetail: data.value.imageDes || '',
  //       gallerySource: data.value.imageSource || '',
  //     };

  //     this.otherImageData = {
  //       ...this.otherImageData,
  //       isGallery: data.value.imageUpload === 'yes',
  //       galleryCategory: data.value.otherImageCategory || '',
  //       galleryTitle: data.value.otherImageTitle || '',
  //       galleryDetail: data.value.otherImageDes || '',
  //       gallerySource: data.value.otherImageSource || '',
  //     };
  //   }

  //   if (data.type == 'url') {
  //     this.url = data.value;
  //   }

  //   if (data.type == 'clear') {
  //     this.url = '';
  //     this.imageData.imagePath = '';
  //   }

  //   this.imageChange.emit({
  //     image: this.imageData,
  //     otherImage: this.otherImageData,
  //     url: this.url,
  //   });

  //   console.log(this.imageData);
  //   console.log(this.otherImageData);
  // }

  ngOnInit(): void {
    this.language = localStorage.getItem('lang')!
    this.otherLanguage = this.language === 'en' ? 'cn' : 'en';

    this.sub.push(
      this.auth.isAdmin.subscribe((data) => {
        this.isAdmin = data;
        console.log(this.isAdmin);
        this.onInit();

      })
    );
    this.subLang.push(
      this.translate.onLangChange.subscribe((data) => {
        this.language = data.lang;
        this.otherLanguage = data.lang === 'en' ? 'cn' : 'en';
        this.onInit();
      })
    );





  }

  updateData() {
    let zipObj$;
    console.log('admin', this.page, this.isAdmin);
    if (this.page === 'profile' && this.isAdmin) {
      // getRightistById
      zipObj$ = zip(
        this.archiveAPI.getRightistById(this.language, this.contributionId),
        this.archiveAPI.getRightistById(this.otherLanguage, this.contributionId)
      );
    } else if (this.page !== 'profile') {
      zipObj$ =  zip(
        this.contributionAPI.getUserContribution(
          this.language,
          this.contribution?.contributorId || this.auth.uid,
          this.contribution?.contributionId || this.contributionId
        ),
        this.contributionAPI.getUserContribution(
          this.otherLanguage,
          this.contribution?.contributorId || this.auth.uid,
          this.contribution?.contributionId || this.contributionId
        )
      )
    }
    zipObj$?.subscribe((data: any) => {
      console.log(data);
      this._contribution[this.language] = data[0] || data[1];
      this._contribution[this.otherLanguage] = data[1] || data[0];
      const curr = this._contribution[this.language]
      const other = this._contribution[this.otherLanguage];
      const { rightist: r1 } = this._contribution[this.language];
      const { rightist: r2 } = this._contribution[this.otherLanguage];
      console.log(r1, r2);
      if (r1 && r2) {
        this.mapForm(r1, r2);
      } else if (curr && other) {
        this.mapForm(curr, other);
      }
      this.allForms.patchValue({
        rightist: {
          ...(curr?.rightist || curr),

          ...mapOtherRightists(
           (other?.rightist || other)
          ),
          name: (curr?.rightist?.fullName || curr?.fullName) || '',
          occupation:( curr?.rightist?.workplaceCombined || curr?.workplaceCombined) || '',
          ethnic: (curr?.rightist?.ethnicity || curr?.ethnicity),
        },
        content: (curr?.rightist?.description || curr?.description) || '',
        otherContent: (other?.rightist?.description || other?.description) || '',
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
          this.contributionId = params['value'];
          console.log(this.contributionId);
          // if (!this.contributionId) {
          //   this.contributionId = params['value'];
          // }
          this.page = params['page'];
          if ( ['account', 'profile'].includes(this.page)) {
            if (this.contributionId) {
              this.updateData();
            }
          }
        })
      );
    }
  }

  onSave() {
    this.save.emit({
      type: 'save',
    });
  }

  onSubmit() {
    this.isLoading = true;
    const rightistId =
      this.contribution?.rightist?.rightistId || this.contribution?.rightistId || `Rightist-${UUID()}`;
    const {
      name,
      otherName,
      gender,
      otherGender,
      status,
      otherStatus,
      ethnic,
      otherEthnic,
      occupation,
      otherOccupation,
      rightistYear,
      birthYear,
      deathYear,
    } = this.allForms.value.rightist!;

    // if (!this.contribution) {
    let rightist: RightistSchema = {
      rightistId: rightistId,
      contributorId: this.auth.uid,
      // imageId: [],
      // profileImageId: '',
      initial: '',
      firstName: '',
      lastName: '',
      fullName: name,
      gender: gender || 'unknown',
      birthYear: birthYear || 0,
      deathYear: deathYear || 0,
      rightistYear: rightistYear,
      status: status || 'Unknown',
      ethnicity: ethnic || '',
      job: occupation,
      education: '',
      birthplace: '',
      detailJob: '',
      workplace: '',
      workplaceCombined: occupation,
      events: this.allForms.value.event,
      memoirs: this.allForms.value.memoir,
      reference: '',
      description: this.allForms.value.content,
      lastUpdatedAt: new Date(),
      source: 'contributed',
      imageId: ''
    };

    let otherRightist: RightistSchema = {
      rightistId: rightistId || '',
      contributorId: this.auth.uid || '',
      imageId: '',
      // profileImageId: '',
      initial: '',
      firstName: '',
      lastName: '',
      fullName: otherName || '',
      gender: otherGender || '',
      birthYear: birthYear || '',
      deathYear: 0,
      rightistYear: rightistYear || '',
      status: otherStatus || 'Unknown',
      ethnicity: otherEthnic || '',
      job: otherOccupation,
      detailJob: '',
      workplace: '',
      workplaceCombined: otherOccupation || '',
      events: (this.allForms.value.event || []).map((e) => {
        return {
          startYear: e.startYear || '',
          event: e.otherEvent || '',
        };
      }),
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
      birthplace: '',
      education: ''
    };

    if (this.language === 'en') {
      rightist.initial = rightist.fullName.trim().charAt(0).toUpperCase();
      otherRightist.initial = rightist.fullName.trim().charAt(0).toUpperCase();
    }
    let contributionId = this.contributionId || UUID();

    if (this.isAdmin && ['contribution', 'profile'].includes(this.page)){
      Promise.all([
        this.contributionService.updateUserContribution(
          this.language,
          {
            contributionId: contributionId,
            contributorId: this.auth.uid,
            rightistId: rightistId,
            contributedAt: new Date(),
            approvedAt: new Date(),
            rejectedAt: new Date(),
            publish: 'approved',
            lastUpdatedAt: new Date(),
          }
        ),
        this.archiveAPI.addRightist(this.language, rightist),
        this.contributionService.updateUserContribution(
          this.otherLanguage,
          {
            contributionId: contributionId,
            contributorId: this.auth.uid,
            rightistId: rightistId,
            contributedAt: new Date(),
            approvedAt: new Date(),
            rejectedAt: new Date(),
            publish: 'approved',
            lastUpdatedAt: new Date(),
          }
        ),
        this.archiveAPI
          .addRightist(this.otherLanguage, otherRightist)
          .then(() => {
            this.route.navigateByUrl('/account');
          }),
      ])
        .then(() => {
          this.clear2();
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
        this.contributionService.updateUserContribution(
          this.language,
          {
            contributionId: contributionId,
            contributorId: this.auth.uid,
            rightistId: rightistId,
            contributedAt: new Date(),
            approvedAt: new Date(),
            rejectedAt: new Date(),
            publish: 'new',
            rightist: rightist,
            lastUpdatedAt: new Date(),
          }
        ),
        this.contributionService.updateUserContribution(
          this.otherLanguage,
          {
            contributionId: contributionId,
            contributorId: this.auth.uid,
            rightistId: rightistId,
            contributedAt: new Date(),
            approvedAt: new Date(),
            rejectedAt: new Date(),
            publish: 'new',
            rightist: otherRightist,
            lastUpdatedAt: new Date(),
          }
        ),
      ])
        .then(() => {
          this.clear2();
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
  // async onSubmit() {
  //   const {
  //     name,
  //     gender,
  //     status,
  //     ethnic,
  //     occupation,
  //     workplace,
  //     otherName,
  //     otherGender,
  //     otherStatus,
  //     otherEthnic,
  //     otherOccupation,
  //     otherWorkplace,
  //     rightistYear,
  //     deathYear,
  //     birthYear,
  //   } = this.form.value;

  //   console.log(this.contribution?.rightist?.rightistId);

  //   // remove last event if untouched
  //   if (!this.eventArray.at(this.eventArray.length - 1).touched) {
  //     this.eventArray.removeAt(this.eventArray.length - 1);
  //   }

  //   // remove last memoir if untouched
  //   if (!this.memoirArray.at(this.memoirArray.length - 1).touched) {
  //     this.memoirArray.removeAt(this.memoirArray.length - 1);
  //   }

  //   const rightistId =
  //     this.contribution?.rightist?.rightistId ||
  //     this.rightist?.rightistId ||
  //     `Rightist-${UUID()}`;

  //   let events: Event[] = [];
  //   let otherEvents: Event[] = [];

  //   let memoirs: Memoir[] = [];
  //   let otherMemoirs: Memoir[] = [];

  //   for (let data of this.eventArray.value) {
  //     let event: Event = {
  //       startYear: data.startYear,
  //       endYear: data.endYear,
  //       event: data.event,
  //     };

  //     let otherEvent: Event = {
  //       startYear: data.startYear,
  //       endYear: data.endYear,
  //       event: data.otherEvent,
  //     };

  //     events.push(event);
  //     otherEvents.push(otherEvent);
  //   }

  //   for (let data of this.memoirArray.value) {
  //     let memoir: Memoir = {
  //       memoirTitle: data.memoirTitle,
  //       memoirAuthor: data.memoirAuthor,
  //       memoirContent: data.memoirContent,
  //     };

  //     let otherMemoir: Memoir = {
  //       memoirTitle: data.otherMemoirTitle,
  //       memoirAuthor: data.otherMemoirAuthor,
  //       memoirContent: data.otherMemoirContent,
  //     };

  //     memoirs.push(memoir);
  //     otherMemoirs.push(otherMemoir);
  //   }

  //   // console.log(this.form.value);
  //   // console.log(this.imageData);
  //   // console.log(this.description);
  //   // console.log(this.eventArray.value);
  //   // console.log(this.memoirArray.value);

  //   let image: ImageSchema = {
  //     ...this.imageData,
  //     imageId: '',
  //     rightistId: rightistId,
  //   };

  //   let otherImage: ImageSchema = {
  //     ...this.otherImageData,
  //     imageId: '',
  //     rightistId: rightistId,
  //   };

  //   let rightist: RightistSchema = {
  //     rightistId: rightistId,
  //     imageId: '',
  //     contributorId: this.auth.uid,
  //     initial: '',
  //     firstName: '',
  //     lastName: '',
  //     fullName: name,
  //     gender: gender || 'unknown',
  //     birthYear: birthYear,
  //     deathYear: deathYear,
  //     rightistYear: rightistYear,
  //     status: status || 'unknown',
  //     ethnicity: ethnic || '',
  //     education: '',
  //     birthplace: '',
  //     job: occupation,
  //     detailJob: '',
  //     workplace: workplace,
  //     workplaceCombined: '',
  //     events: events,
  //     memoirs: memoirs,
  //     reference: '',
  //     description: this.description,
  //     source: 'contributed',
  //     lastUpdatedAt: new Date(),
  //   };

  //   let otherRightist: RightistSchema = {
  //     rightistId: rightistId,
  //     imageId: '',
  //     contributorId: this.auth.uid,
  //     initial: '',
  //     firstName: '',
  //     lastName: '',
  //     fullName: otherName,
  //     gender: otherGender || '',
  //     birthYear: birthYear,
  //     deathYear: 0,
  //     rightistYear: rightistYear,
  //     status: otherStatus || 'Unknown',
  //     ethnicity: otherEthnic || '',
  //     education: '',
  //     birthplace: '',
  //     job: otherOccupation,
  //     detailJob: '',
  //     workplace: otherWorkplace,
  //     workplaceCombined: '',
  //     events: otherEvents,
  //     memoirs: otherMemoirs,
  //     reference: '',
  //     description: this.otherDescription,
  //     source: 'contributed',
  //     lastUpdatedAt: new Date(),
  //   };

  //   if (this.language === 'en') {
  //     rightist.initial = name.trim().charAt(0).toUpperCase();
  //     otherRightist.initial = name.trim().charAt(0).toUpperCase();
  //   }

  //   console.log(rightist);
  //   console.log(otherRightist);
  //   console.log(image);
  //   console.log(otherImage);

  //   if (this.page === 'account') {

  //     if (this.url) {
  //       image.imagePath = this.url;
  //     }

  //     this.contributionService
  //       .updateUserContribution(this.language, {
  //         contributionId: this.contributionId,
  //         contributorId: this.auth.uid,
  //         contributedAt: new Date(),
  //         rightistId: rightistId,
  //         lastUpdatedAt: new Date(),
  //         approvedAt: new Date(),
  //         publish: 'new',
  //         rightist: rightist,
  //         image: {
  //           ...image,
  //         },
  //       })
  //       .then(() => {
  //         this.clear();
  //         this.clear2();
  //         this.route.navigateByUrl('/account');
  //       });
  //   } else if (this.page == 'profile') {
  //     if (this.url) {
  //       const imageId = `Image-${UUID()}`;
  //       await fetch(this.url).then(async (response) => {
  //         console.log(imageId);
  //         const contentType = response.headers.get('content-type');
  //         const blob = await response.blob();
  //         const file = new File([blob], imageId, { type: contentType! });
  //         await this.storageAPI.uploadGalleryImage(imageId, file);
  //         this.sub.push(
  //           this.storageAPI
  //             .getGalleryImageURL(imageId)
  //             .subscribe((imageUrl: any) => {
  //               console.log(imageUrl);
  //               rightist.imageId = imageId;

  //               image.imageId = imageId;
  //               otherImage.imageId = imageId;

  //               image.imagePath = imageUrl;
  //               otherImage.imagePath = imageUrl;
  //               Promise.all([
  //                 this.archiveAPI.addRightist(this.language, rightist),
  //                 this.archiveAPI.updateRightistImageId(
  //                   this.otherLanguage,
  //                   rightist.rightistId,
  //                   imageId
  //                 ),
  //                 this.imageAPI.addImage(this.language, image),
  //                 this.imageAPI.addImage(this.otherLanguage, otherImage),
  //               ]).then(() => {
  //                 const url = `browse/main/memoir/${rightist.rightistId}`;
  //                 this.clear();
  //                 this.clear2();
  //                 this.route.navigateByUrl(url);
  //               });
  //             })
  //         );
  //       });
  //     } else {
  //       Promise.all([
  //         this.archiveAPI.addRightist(this.language!, rightist),
  //       ]).then(() => {
  //         const url = `browse/main/memoir/${rightist.rightistId}`;
  //         this.clear();
  //         this.clear2();
  //         this.route.navigateByUrl(url);
  //       });
  //     }
  //   } else {
  //     // in upload component
  //     let contributionId = `Contribution-${UUID()}`;
  //     // has image
  //     if (this.url) {
  //       Promise.all([
  //         this.contributionService.updateUserContribution(this.language, {
  //           contributionId: contributionId,
  //           contributorId: this.auth.uid,
  //           contributedAt: new Date(),
  //           rightistId: rightistId,
  //           lastUpdatedAt: new Date(),
  //           approvedAt: new Date(),
  //           publish: 'new',
  //           rightist: rightist,
  //           image: {
  //             ...image,
  //             imagePath: this.url,
  //           },
  //         }),
  //         this.contributionService.updateUserContribution(this.otherLanguage, {
  //           contributionId: contributionId,
  //           contributorId: this.auth.uid,
  //           contributedAt: new Date(),
  //           rightistId: rightistId,
  //           lastUpdatedAt: new Date(),
  //           approvedAt: new Date(),
  //           publish: 'new',
  //           rightist: otherRightist,
  //           image: {
  //             ...otherImage,
  //             imagePath: this.url,
  //           },
  //         }),
  //       ]).then(() => {
  //         this.clear();
  //         this.clear2();
  //         this.route.navigateByUrl('/account');
  //       });

  //       // no image
  //     } else {
  //       console.log('No Image');
  //       let contributionId = `Contribution-${UUID()}`;
  //       Promise.all([
  //         this.contributionService.updateUserContribution(this.language, {
  //           contributionId: contributionId,
  //           contributorId: this.auth.uid,
  //           contributedAt: new Date(),
  //           rightistId: rightistId,
  //           approvedAt: new Date(),
  //           lastUpdatedAt: new Date(),
  //           publish: 'new',
  //           rightist: rightist,
  //         }),
  //         this.contributionService.updateUserContribution(this.otherLanguage, {
  //           contributionId: contributionId,
  //           contributorId: this.auth.uid,
  //           contributedAt: new Date(),
  //           rightistId: rightistId,
  //           approvedAt: new Date(),
  //           lastUpdatedAt: new Date(),
  //           publish: 'new',
  //           rightist: otherRightist,
  //         }),
  //       ]).then(() => {
  //         this.clear();
  //         this.clear2();
  //         this.route.navigateByUrl('/account');
  //       });
  //     }
  //   }
  // }
}
