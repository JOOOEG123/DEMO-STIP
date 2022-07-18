import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})

export class UploadImageComponent{

  imageArray = new FormArray([this.newImage()]);
  imageForm2 = new FormGroup({
    imageUpload: new FormControl(''),
    image: new FormControl(''),
  });
  url = '';

  onselectFile(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };
    }
  }

  private newImage() {
    return new FormGroup({
      imageUpload: new FormControl(''),
      image: new FormControl(''),
      imageTitle: new FormControl(''),
      imageDes: new FormControl(''),
    });
  }

  imageForm = new FormGroup({
    imageTitle: new FormControl(''),
    imageDes: new FormControl(''),
  });

  get imageControls() {
    return this.imageArray.controls as FormGroup[];
  }

  removeImageSection(i: number){
    this.imageArray.removeAt(i);
  }

  constructor(
  ) {}

  clearImage() {
    this.imageForm.reset();
  }

  addImage() {
    this.imageArray.push(this.newImage());
  }
}


