import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
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
  ethnicGroup: string[] = ETHNIC_GROUP_CONSTANTS;
  occupation: string[] = LIST_OF_JOB;
  selected?: string;
  selected2?: string;
  sub: Subscription[] = [];


  @Input() get contribution() {
    return this._contribution;
  }
  set contribution(contribution: Contribution) {
    if (contribution.rightist) {
      this._contribution = contribution;
    }
  }
  @Input() page?: string;
  @Output() approve: EventEmitter<Contribution> = new EventEmitter();
  @Output() edit: EventEmitter<Contribution> = new EventEmitter()
  @Output() reject: EventEmitter<Contribution> = new EventEmitter();
  @Output() reconsider: EventEmitter<Contribution> = new EventEmitter();
  //image url
  url = '';

  onApprove() {
    this.editContribution()
    if (this.contribution) {
      this.approve.emit(this.contribution);
    }
  }

  onEdit() {
    this.editContribution()
    if (this.contribution) {
      this.edit.emit(this.contribution)
    }
  }

  onReject() {
    this.editContribution()
    if (this.contribution) {
      this.reject.emit(this.contribution);
    }
  }

  onReconsider() {

    this.editContribution()
    if (this.contribution) {
      this.reconsider.emit(this.contribution);
    }
  }

  editContribution() {
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

    let rightist : Rightist = {
      ...this.contribution.rightist!,
      fullName: name,
      gender,
      status,
      ethnicity: ethnic,
      rightistYear: rightestYear,
      job: occupation,
      birthYear,
      events: this.eventArray.value,
      memoirs: this.memoirArray.value
    }

    this.contribution = {
      ...this.contribution,
      rightist: rightist
    }
  }

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
  eventArray = new FormArray([this.newEvent()]);
  memoirArray = new FormArray([this.newMemoir()]);
  imageForm = new FormGroup({
    imageUpload: new FormControl(''),
    image: new FormControl(''),
  });

  private newEvent() {
    return new FormGroup({
      startYear: new FormControl(''),
      endYear: new FormControl(''),
      event: new FormControl(''),
    });
  }

  private newMemoir() {
    return new FormGroup({
      memoirTitle: new FormControl(''),
      memoirContent: new FormControl(''),
      memoirAuthor: new FormControl(''),
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

  addEvent() {
    this.eventArray.push(this.newEvent());
  }

  removeEvent(i: number) {
    this.eventArray.removeAt(i);
  }

  addMemoir() {
    this.memoirArray.push(this.newMemoir());
  }

  ngOnDestroy(): void {
    this.sub.forEach((sub) => sub.unsubscribe());
    this.formSubscription?.unsubscribe()
    this.form2Subscription?.unsubscribe()
    this.eventSubscription?.unsubscribe()
    this.memoirSubScription?.unsubscribe()
  }

  formSubscription?: Subscription
  form2Subscription?: Subscription
  eventSubscription?: Subscription
  memoirSubScription?: Subscription

  changed: boolean = false

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
    
          for (const event of this.contribution.rightist.events) {
            this.eventArray.push(new FormGroup({
              startYear: new FormControl(event.startYear),
              endYear: new FormControl(event.endYear),
              event: new FormControl(event.event),
            }))
          }
    
          for (const memoir of this.contribution.rightist.memoirs) {
            this.memoirArray.push(new FormGroup({
              memoirTitle: new FormControl(memoir.memoirTitle),
              memoirContent: new FormControl(memoir.memoirContent),
              memoirAuthor: new FormControl(memoir.memoirAuthor),
            }))
          }

          this.formSubscription = this.form.valueChanges.subscribe(() => {
            this.changed = true
          })

          this.form2Subscription = this.form2.valueChanges.subscribe(() => {
            this.changed = true
          })

          this.eventSubscription = this.eventArray.valueChanges.subscribe(() => {
            this.changed = true
          })

          this.memoirSubScription = this.memoirArray.valueChanges.subscribe(() => {
            this.changed = true
          })
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
