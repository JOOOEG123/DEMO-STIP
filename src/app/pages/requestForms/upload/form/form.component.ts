import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { thresholdFreedmanDiaconis } from 'd3';
import { Subscription } from 'rxjs';
import { ETHNIC_GROUP_CONSTANTS, LIST_OF_JOB } from 'src/app/core/constants/group.constants';

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

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    gender: new FormControl(''),
    status: new FormControl(''),
    ethnic: new FormControl(''),
    occupation: new FormControl('', Validators.required),
    rightistYear: new FormControl('', Validators.required),
    birthYear: new FormControl('', Validators.required),
  });
  
  @Output() change: EventEmitter<any> = new EventEmitter()

  formSubscription?: Subscription
  ethnicGroup: string[] = ETHNIC_GROUP_CONSTANTS;
  occupation: string[] = LIST_OF_JOB;

  constructor() { }

  ngOnInit(): void {
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
