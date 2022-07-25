import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { thresholdFreedmanDiaconis } from 'd3';
import { Subscription } from 'rxjs';
import { ETHNIC_GROUP_CONSTANTS, LIST_OF_GENDER, LIST_OF_JOB, LIST_OF_STATUS } from 'src/app/core/constants/group.constants';

type FormData = {
  name: string,
  gender: string,
  status: string,
  ethnic: string,
  occupation: string,
  rightistYear: number,
  birthYear: number
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {

  @Input() page?: string

  @Input() data?: FormData
  @Input() otherData?: FormData

  @Input() isAdmin!: boolean
  @Input() language!: string
  @Input() otherLanguage!: string


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
    rightistYear: new FormControl('', Validators.required),
    birthYear: new FormControl('', Validators.required),
  });
  
  @Output() change: EventEmitter<any> = new EventEmitter()

  formSubscription?: Subscription
  ethnicGroup: string[] = []
  otherEthnicGroup: string[] = []

  genders: string[] = []
  otherGenders: string[] = []

  statuses: string[] = []
  otherStatuses: string[] = []

  occupation: string[] = LIST_OF_JOB;

  constructor() { }

  onEthnicChange(data: any) {
    console.log(data.target.value)
    let index = Object.keys(this.ethnicGroup).find(key => this.ethnicGroup[key] === data.target.value)
    this.form.patchValue({
      otherEthnic: this.otherEthnicGroup[index!]
    })
  }

  onGenderChange(data: any, index: number) {
    this.form.patchValue({
      otherGender: this.otherGenders[index]
    })
  }

  onStatusChange(data: any, index: number) {
    this.form.patchValue({
      otherStatus: this.otherStatuses[index]
    })
  }

  initializeConstants() {
    this.ethnicGroup = ETHNIC_GROUP_CONSTANTS[this.language];
    this.otherEthnicGroup = ETHNIC_GROUP_CONSTANTS[this.otherLanguage];

    this.genders = LIST_OF_GENDER[this.language]
    this.otherGenders = LIST_OF_GENDER[this.otherLanguage]

    this.statuses = LIST_OF_STATUS[this.language]
    this.otherStatuses = LIST_OF_STATUS[this.otherLanguage]
  }

  ngOnInit(): void {
    console.log(this.otherData)
    console.log(this.data)

    this.initializeConstants()

    if (this.data) {
      this.form.patchValue({
        name: this.data.name,
        gender: this.data.gender,
        status: this.data.status,
        ethnic: this.data.ethnic,
        occupation: this.data.occupation,
        rightistYear: this.data.rightistYear,
        birthYear: this.data.birthYear
      })
    }

    if (this.otherData) {
      this.form.patchValue({
        otherName: this.otherData.name,
        otherOccupation: this.otherData.occupation,
        otherEthnicGroup: this.otherData.ethnic,
        otherGender: this.otherData.gender,
        otherStatus: this.otherData.status
      })
    }


    this.formSubscription = this.form.valueChanges.subscribe((data) => {
      console.log(data)
      this.change.emit({
        type: 'form',
        value: data
      })
    })
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe()
  }

  clear() {
    this.form.reset();
  }
}
