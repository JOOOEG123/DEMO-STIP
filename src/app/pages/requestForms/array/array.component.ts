import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-array',
  templateUrl: './array.component.html',
  styleUrls: ['./array.component.scss']
})
export class ArrayComponent implements OnInit, OnDestroy {

  @Input() array!: FormArray
  @Input() title!: string
  @Input() type!: string
  @Output() change: EventEmitter<any> = new EventEmitter()

  localArray: FormArray = new FormArray([])

  eventYear?: number
  eventContent?: string
  memoirTitle?: string
  memoirAuthor?: string
  memoirContent?: string

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

  arraySubscription?: Subscription

  constructor() { }

  ngOnInit(): void {
    if (this.array.length == 0) {
      if (this.type == 'event') {
        this.localArray.push(this.newEvent());
      }
  
      if (this.type == 'memoir') {
        this.localArray.push(this.newMemoir());
      } 
    }
    else {
      this.localArray.patchValue(this.array.value)
    }

    console.log(this.array.value)
    console.log(this.localArray.value)

    this.arraySubscription = this.localArray.valueChanges.subscribe((data) => {
      this.change.emit({
        type: this.type,
        array: this.localArray.value
      })
    })
  }

  ngOnDestroy(): void {
    this.arraySubscription?.unsubscribe()
  }

  onContentChange(event: Event) {
    console.log(event)
  }

  get controls() {
    return this.localArray.controls as FormGroup[];
  }

  add() {
    if (this.type == 'event') {
      this.localArray.push(this.newEvent());
    }

    if (this.type == 'memoir') {
      this.localArray.push(this.newMemoir());
    } 
  }

  remove(i: number) {
    this.localArray.removeAt(i)
  }
}
