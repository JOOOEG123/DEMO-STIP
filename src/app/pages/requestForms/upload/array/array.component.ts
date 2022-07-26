import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LIST_OF_IMAGE_CATEGORIES } from 'src/app/core/constants/group.constants';
import { ImagesService } from 'src/app/core/services/images.service';

@Component({
  selector: 'app-array',
  templateUrl: './array.component.html',
  styleUrls: ['./array.component.scss'],
})
export class ArrayComponent implements OnInit, OnDestroy {
  @Input() page?: string
  @Input() data!: any[];
  @Input() otherData!: any[]
  @Input() language?: string
  @Input() otherLanguage?: string

  @Input() cleared!: boolean;
  @Input() isAdmin!: boolean
  @Input() title!: string;
  @Input() type!: string;
  @Output() change: EventEmitter<any> = new EventEmitter();

  array = new FormArray([]);

  profileControl = new FormControl('')
  profileIndex?: number

  imageCategories: string[] = []
  otherImageCategories: string[] = []

  private newEvent() {
    return new FormGroup({
      startYear: new FormControl(''),
      endYear: new FormControl(''),
      event: new FormControl(''),
      otherEvent: new FormControl('')
    });
  }

  private newMemoir() {
    return new FormGroup({
      memoirTitle: new FormControl(''),
      otherMemoirTitle: new FormControl(''),
      memoirContent: new FormControl(''),
      otherMemoirContent: new FormControl(''),
      memoirAuthor: new FormControl(''),
      otherMemoirAuthor: new FormControl('')
    });
  }

  private newImage() {
    return new FormGroup({
      imageUrl: new FormControl(''),
      imageUpload: new FormControl(''),
      image: new FormControl(''),
      imageCategory: new FormControl(''),
      imageTitle: new FormControl(''),
      imageDes: new FormControl(''),
      imageSource: new FormControl(''),
      otherImageCategory: new FormControl(''),
      otherImageTitle: new FormControl(''),
      otherImageDes: new FormControl(''),
      otherImageSource: new FormControl('')
    });
  }

  isWarning: boolean = false;
  profileImageAdded: boolean = false

  arraySubcription?: Subscription;

  constructor() {}

  ngOnInit(): void {
    console.log(this.data)
    console.log(this.otherData)

    this.profileControl.valueChanges.subscribe((data: any) => {
      this.profileIndex = data
      console.log(this.profileIndex)
    })

    if (this.type == 'event') {
      if (this.data!.length == 0) {
        this.array.push(this.newEvent());
      } else {
        for (const [index, item] of this.data!.entries()) {
          this.array.push(
            new FormGroup({
              startYear: new FormControl(item.startYear),
              endYear: new FormControl(item.endYear),
              event: new FormControl(item.event),
              otherEvent: new FormControl(this.otherData[index].event)
            })
          );
        }
      }
    }

    if (this.type == 'memoir') {
      if (this.data!.length == 0) {
        this.array.push(this.newMemoir());
      } else {
        for (const [index, item] of this.data!.entries()) {
          this.array.push(
            new FormGroup({
              memoirTitle: new FormControl(item.memoirTitle),
              memoirAuthor: new FormControl(item.memoirAuthor),
              memoirContent: new FormControl(item.memoirContent),
              otherMemoirTitle: new FormControl(this.otherData[index].memoirTitle),
              otherMemoirAuthor: new FormControl(this.otherData[index].memoirAuthor),
              otherMemoirContent: new FormControl(this.otherData[index].memoirContent)
            })
          );
        }
      }
    }

    if (this.type == 'image') {
      this.imageCategories = LIST_OF_IMAGE_CATEGORIES[this.language!]
      this.otherImageCategories = LIST_OF_IMAGE_CATEGORIES[this.otherLanguage!]

      if (this.data!.length == 0) {
        this.array.push(this.newImage());
      } else {
        for (const [index, item] of this.data!.entries()) {
          this.array.push(   
            new FormGroup({
              imageUrl: new FormControl(item.imageUrl),
              imageUpload: new FormControl(item.imageUpload),
              image: new FormControl(item.image),
              imageCategory: new FormControl(item.imageCategory),
              imageTitle: new FormControl(item.imageTitle),
              imageDes: new FormControl(item.imageDes),
              imageSource: new FormControl(item.imageSource),
              otherImageCategory: new FormControl(this.otherData[index].imageCategory),
              otherImageTitle: new FormControl(this.otherData[index].imageTitle),
              otherImageDes: new FormControl(this.otherData[index].imageDes),
              otherImageSource: new FormControl(this.otherData[index].imageSource)
            })
          );
        }
      }
    }

    this.array.valueChanges.subscribe((data) => {
      console.log(data)
      this.profileImageAdded = false
      
      for (const [index, image] of data.entries()) {
        if (index === this.profileIndex) {
          image.isProfile = 'yes'
        }
        else {
          image.isProfile = 'no'
        }
      }

      if (this.removeWhenLastEmpty) {
        this.isWarning = false;
      } else if (this.cleared) {
        this.isWarning = false;
      } else if (this.elementAdded) {
        this.isWarning = false;
      } else {
        this.isWarning = true;
      }

      this.removeWhenLastEmpty = false;
      this.elementAdded = false

      console.log(data)

      this.change.emit({
        type: this.type,
        value: data,
        warning: this.isWarning,
      });
    });
  }

  removeWhenLastEmpty: boolean = false;
  elementAdded: boolean = false;

  onselectFile(e, i) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.array.controls[i].patchValue({
          imageUrl: event.target.result,
        });
      };
    }

    console.log(this.array.at(i).get('imageUrl'));
  }

  ngOnDestroy(): void {
    this.arraySubcription?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.type == 'event') {
      if (changes['cleared']) {
        if (changes['cleared'].currentValue == true) {
          this.array.clear();
          this.data = [];

          this.array.push(this.newEvent());
          this.change.emit({
            type: this.type,
            value: this.data,
          });
        }
      }
    }

    if (this.type == 'memoir') {
      if (changes['cleared']) {
        if (changes['cleared'].currentValue == true) {
          console.log('inside memoir');
          this.array.clear();

          this.data = [];

          this.array.push(this.newMemoir());
          this.change.emit({
            type: this.type,
            value: this.data,
          });
        }
      }
    }

    if (this.type == 'image') {
      if (changes['cleared']) {
        if (changes['cleared'].currentValue == true) {
          console.log('inside image');
          this.array.clear();

          this.data = [];

          this.array.push(this.newImage());
          this.change.emit({
            type: this.type,
            value: this.data,
          });
        }
      }
    }
  }

  get controls() {
    return this.array.controls as FormGroup[];
  }
  
  add() {
    this.elementAdded = true;

    if (this.type == 'event') {
      this.array.push(this.newEvent());
    }

    if (this.type == 'memoir') {
      this.array.push(this.newMemoir());
    }

    if (this.type == 'image') {
      this.array.push(this.newImage());
    }
  }

  remove(i: number) {
    this.removeWhenLastEmpty = true;
    this.array.removeAt(i);
  }

  onImageCategoryChange(data: any, i: number) {
    if (this.isAdmin) {
      if (this.type === 'image') {
        let index = Object.keys(this.imageCategories).find(key => this.imageCategories[key] === data.target.value)
        this.array.at(i).patchValue({
          otherImageCategory: this.otherImageCategories[index!]
        })
      }
    }
  }
}
