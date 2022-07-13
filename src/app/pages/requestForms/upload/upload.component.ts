import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';
import { ContributionsService } from 'src/app/core/services/contributions.service';
import { Contribution, Rightist } from 'src/app/core/types/adminpage.types';
import { UUID } from 'src/app/core/utils/uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  private _contribution!: Contribution;
  contributionId!: string;
  @Input() get contribution() {
    return this._contribution;
  }
  set contribution(contribution: Contribution) {
    this.mapForm(contribution.rightist);
    this._contribution = contribution;
  }

  @Input() page?: string;
  @Output() approve: EventEmitter<Contribution> = new EventEmitter();
  @Output() reject: EventEmitter<Contribution> = new EventEmitter();
  @Output() reconsider: EventEmitter<Contribution> = new EventEmitter();
  //image url
  url = '';

  onApprove() {
    if (this.contribution) {
      this.approve.emit({ ...this.contribution });
    }
  }

  onReject() {
    if (this.contribution) {
      this.reject.emit({ ...this.contribution });
    }
  }

  onReconsider() {
    if (this.contribution) {
      this.reconsider.emit({ ...this.contribution });
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

  get memiorControls() {
    return this.memoirArray.controls as FormGroup[];
  }

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

  selected?: string;
  ethnicGroup: string[] = [
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
    'Dongxiang',
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
    'Oroqen',
    'Derung',
    'Hezhen',
    'Gaoshan',
    'Lhoba',
    'Tatars',
    'Undistinguished',
    'Naturalized Citizen',
  ];

  selected2?: string;
  occupation: string[] = [
    'Deputy',
    'Director',
    'Professor',
    'Worker',
    'Actress',
    'Agent',
    'Assistant',
    'Editor-in-Chief',
    'Assistant Lieutenant',
    'Assistant Professor',
    'Associate Professor',
    'Cadre',
    'Chairman',
    'Chief',
    'Chief Engineer',
    'Christian Priest',
    'Clerk',
    'Deputy Director',
    'Deputy Secretary',
    'Deputy Secretary General',
  ];

  sub: Subscription[] = [];

  addEvent() {
    this.eventArray.push(this.newEvent());
  }

  removeEvent(i: number) {
    this.eventArray.removeAt(i);
  }

  addMemoir() {
    this.memoirArray.push(this.newMemoir());
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

  ngOnInit(): void {
    console.log(this.contribution);
    this.sub.push(
      this.activatedRoute.queryParams.subscribe((params) => {
        console.log(params);
        this.contributionId = params['contributionId'];
        if (this.contributionId) {
          this.sub.push(
            this.contributionService
              .fetchContributorByContributionId(this.contributionId)
              .subscribe((contributor: any) => {
                this.contribution = contributor;
                console.log(this.contribution);
                this.mapForm(contributor.rightist);
              })
          );
        }
      })
    );
    if (this.contribution?.rightist) {
      this.mapForm(this.contribution.rightist);
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

  // onApprove() {
  //   if (this.contribution) {
  //     let contributorId = this.contribution.contributorId[this.contribution.contributorId.length - 1]
  //     this.contributionService.updateContributionByPublish(
  //       contributorId , this.contribution.contributionId, 'approved')
  //   }
  // }

  // onReject() {
  //   if (this.contribution) {
  //     let contributorId = this.contribution.contributorId[this.contribution.contributorId.length - 1]
  //     this.contributionService.updateContributionByPublish(
  //       contributorId , this.contribution.contributionId, 'rejected')
  //   }
  // }

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
    console.log(this.form.value, this.form2.value);
    const {
      name,
      gender,
      status,
      enthic,
      rightestYear,
      occupation,
      birthYear,
    } = this.form.value;
    const { content } = this.form2.value;
    const contributionId = this.contributionId || UUID();
    const rightistId =
      this.contribution?.rightist?.rightistId || `Rightist-${UUID()}`;
    this.contributionService
      .contributionsAddEdit({
        contributionId: contributionId,
        contributorId: [this.auth.uid],
        contributedAt: new Date(),
        rightistId: rightistId,
        approvedAt: new Date(), // update model with An.
        rightist: {
          rightistId: rightistId,
          imagePath: [this.url], // Price said he will work on this.
          initial: name.substring(0, 1),
          firstName: name,
          lastName: '',
          gender: gender || '',
          birthYear: birthYear,
          deathYear: 0,
          rightistYear: rightestYear,
          status: status || 'Unknown',
          ethnicity: enthic || '',
          publish: 'new',
          job: occupation,
          detailJob: '',
          workplace: '',
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
