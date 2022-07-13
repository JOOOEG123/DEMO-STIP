import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  @Input() contribution?: Contribution;
  @Input() page?: string
  @Output() approve: EventEmitter<Contribution> = new EventEmitter()
  @Output() reject: EventEmitter<Contribution> = new EventEmitter()
  @Output() reconsider: EventEmitter<Contribution> = new EventEmitter()
  //image url
  url = '';

  minDate: Date = new Date('1850-01-01');
  maxDate: Date = new Date('1960-01-01');

  onApprove() {
    if (this.contribution) {
      this.approve.emit({...this.contribution})
    }
  }

  onReject() {
    if (this.contribution) {
      this.reject.emit({...this.contribution})
    }
  }
  
  onReconsider() {
    if (this.contribution) {
      this.reconsider.emit({...this.contribution})
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
    content: new FormControl('')
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
    private route: Router
  ) {}

  ngOnInit(): void {
    console.log(this.contribution)

    if (this.contribution?.contributionId) {
      const rightist: Rightist = this.contribution.rightist
      this.form = new FormGroup({
        name: new FormControl(rightist.lastName + ' ' + rightist.firstName, Validators.required),
        gender: new FormControl(rightist.gender),
        status: new FormControl(rightist.status),
        ethnic: new FormControl(rightist.ethnicity),
        occupation: new FormControl(rightist.job, Validators.required),
        rightestYear: new FormControl(rightist.rightistYear, Validators.required),
        birthYear: new FormControl(rightist.birthYear, Validators.required),
      });
    
      this.form2 = new FormGroup({
        imageUpload: new FormControl(''),
        image: new FormControl(''),
        content: new FormControl('')
      });

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
    const {name, gender, status, enthic, rightestYear, occupation, birthYear} = this.form.value;
    const { content } = this.form2.value;
    const contributionId = UUID()
    this.contributionService.addUserContributions({
      contributionId: contributionId,
      contributorId: [this.auth.uid],
      contributedAt: new Date(),
      rightistId: '',
      approvedAt: new Date(), // update model with An.
      rightist: {
        rightistId: `Rightist-${UUID()}`,
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
    }).then(() => {
      this.clear();
      this.clear2();
      this.route.navigateByUrl('/account');
    });
  }
}
