import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy, ɵɵsetComponentScope } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  ETHNIC_GROUP_CONSTANTS,
  LIST_OF_JOB,
} from 'src/app/core/constants/group.constants';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';
import { ContributionsService } from 'src/app/core/services/contributions.service';
import { Contribution, Rightist } from 'src/app/core/types/adminpage.types';
import { UUID } from 'src/app/core/utils/uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit, OnDestroy {
  private _contribution!: Contribution;
  contributionId!: string;
  selected?: string;
  selected2?: string;
  sub: Subscription[] = [];

  eventTitle: string = 'Event year and event content'
  memoirTitle: string = 'Add Memoir, book, or other information'

  @Input() get contribution() {
    return this._contribution;
  }
  set contribution(contribution: Contribution) {
    if (contribution.rightist) {
      this._contribution = contribution;
    }
  }

  @Input() page?: string;
  @Output() formChange: EventEmitter<any> = new EventEmitter()
  @Output() eventChange: EventEmitter<any> = new EventEmitter()
  @Output() memoirChange: EventEmitter<any> = new EventEmitter()

  //image url
  url = '';

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    gender: new FormControl(''),
    status: new FormControl(''),
    ethnic: new FormControl(''),
    occupation: new FormControl('', Validators.required),
    rightestYear: new FormControl('', Validators.required),
    birthYear: new FormControl('', Validators.required),
  });

  form2 = new FormGroup({
    imageUpload: new FormControl(''),
    image: new FormControl(''),
    content: new FormControl(''),
  });
  
  eventArray = new FormArray([]);
  memoirArray = new FormArray([]);

  imageForm = new FormGroup({
    imageUpload: new FormControl(''),
    image: new FormControl(''),
  });

  constructor(
    private contributionService: ContributionsService,
    private auth: AuthServiceService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  clear() {
    this.form.reset();
  }

  clear2() {
    this.url = '';
    this.form2.reset();
    this.imageForm.reset();
    this.eventArray.reset();
    this.memoirArray.reset();
  }

  clearImage() {
    this.imageForm.reset();
  }

  ngOnDestroy(): void {
    this.sub.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    if (this.page === 'contribution') {
      if (this.contribution) {
        if (this.contribution.contributionId && this.contribution.rightist) {
          const rightist: Rightist = this.contribution.rightist
          this.form.setValue({
            name: rightist.fullName,
            gender: rightist.gender,
            status: rightist.status,
            ethnic: rightist.ethnicity,
            occupation: rightist.job,
            rightestYear: rightist.rightistYear,
            birthYear: rightist.birthYear,
          })
        
          this.form2.setValue({
            imageUpload: '',
            image: '',
            content: '',
          })

          this.eventArray.patchValue(this.contribution.rightist!.events)
          this.memoirArray.patchValue(this.contribution.rightist!.memoirs)
        }
      }
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
                    this.mapForm(contribution.rightist);
                  })
              );
            }
          }
        })
      );
    }
  }

  onArrayChange(data: any) {
    console.log(data)
    if (data.type === 'event') {
      this.eventArray.patchValue(data.array)
      // this.eventChange.emit(this.eventArray)
    }

    if (data.type === 'memoir') {
      this.memoirArray.patchValue(data.array)
      // this.memoirChange.emit(this.memoirArray)
    }
  }

  onFormChange(data: any) {
    this.formChange.emit(data)
  }

  mapForm(rightist: Rightist) {
    if (this.form && this.form2 && this.eventArray && this.memoirArray) {
      this.form.patchValue({
        name: rightist.lastName + ' ' + rightist.firstName,
        occupation: rightist.job,
        ethnic: rightist.ethnicity,
        rightestYear: rightist.rightistYear,
        ...rightist,
      });
      this.form2.patchValue({
        content: rightist.description,
      });
      this.eventArray.patchValue(rightist.events);
      this.memoirArray.patchValue(rightist.memoirs);
    }
  }

  onselectFile(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };
    }
  }

  onSubmit() {
    const {
      name,
      gender,
      status,
      ethnic,
      rightestYear,
      occupation,
      birthYear,
    } = this.form.value;
    const { content } = this.form2.value;
    const rightistId =
      this.contribution?.rightist?.rightistId || `Rightist-${UUID()}`;
    
    console.log(this.eventArray.value)
    console.log(this.memoirArray.value)
    
    this.contributionService
      .contributionsAddEdit({
        contributionId: this.contributionId,
        contributorId: [this.auth.uid],
        contributedAt: new Date(),
        rightistId: rightistId,
        approvedAt: new Date(),
        lastUpdatedAt: new Date(),
        publish: 'new',
        rightist: {
          rightistId: rightistId,
          imageId: [this.url], // Price said he will work on this.
          initial: name.substring(0, 1),
          firstName: '',
          lastName: '',
          fullName: name,
          gender: gender || '',
          birthYear: birthYear,
          deathYear: 0,
          rightistYear: rightestYear,
          status: status || 'Unknown',
          ethnicity: ethnic || '',
          job: occupation,
          detailJob: '',
          workplace: '',
          workplaceCombined: '',
          events: this.eventArray.value,
          memoirs: this.memoirArray.value,
          reference: '',
          description: content,
        },
      })
      .then(() => {
        this.clear();
        this.clear2();
        this.route.navigateByUrl('/account');
      });
  }
}
