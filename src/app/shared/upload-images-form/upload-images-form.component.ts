import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';
import { FormCustomProvider } from 'src/app/core/utils/helper';

type UploadImagesType = {
  file: File;
  image: string;
  imageCategory: string;
  imageDes: string;
  imageDetails: string;
  imageSource: string;
  imageTitle: string;
  imageUpload: string;
  imageUrl: string;
  // other fields
  otherImage: string;
  otherImageCategory: string;
  otherImageDes: string;
  otherImageDetails: string;
  otherImageSource: string;
  otherImageTitle: string;
  otherImageUpload: string;
  otherImageUrl: string;
};

@Component({
  selector: 'app-upload-images-form',
  templateUrl: './upload-images-form.component.html',
  styleUrls: ['./upload-images-form.component.scss'],
  providers: [FormCustomProvider(UploadImagesFormComponent)],
})
export class UploadImagesFormComponent implements OnInit, ControlValueAccessor {
  private _disabled: boolean = false;
  private newImage(a = {} as UploadImagesType): FormGroup {
    return this.formBuilder.group({
      image: this.formBuilder.control(a.image),
      file: this.formBuilder.control(a.file),
      imageCategory: this.formBuilder.control(a.imageCategory  || 'People'),
      imageDes: this.formBuilder.control(a.imageDes),
      imageDetails: this.formBuilder.control(a.imageDetails),
      imageSource: this.formBuilder.control(a.imageSource),
      imageTitle: this.formBuilder.control(a.imageTitle),
      imageUpload: this.formBuilder.control(a.imageUpload),
      imageUrl: this.formBuilder.control(a.imageUrl),
      otherImage: this.formBuilder.control(a.otherImage),
      otherImageCategory: this.formBuilder.control(a.otherImageCategory),
      otherImageDes: this.formBuilder.control(a.otherImageDes),
      otherImageDetails: this.formBuilder.control(a.otherImageDetails),
      otherImageSource: this.formBuilder.control(a.otherImageSource),
      otherImageTitle: this.formBuilder.control(a.otherImageTitle),
      otherImageUpload: this.formBuilder.control(a.otherImageUpload),
      otherImageUrl: this.formBuilder.control(a.otherImageUrl),
    });
  }
  imageArray = this.formBuilder.array([]);
  sub: Subscription[] = [];
  subLang: Subscription[] = [];
  subImageChange: Subscription[] = [];
  isAdmin: boolean = false;
  imageCategories: string[] = [];
  otherImageCategories: string[] = [];

  profileControl = this.formBuilder.control('');

  language?: string;
  otherLanguage?: string;

  get controls(): FormGroup[] {
    return this.imageArray.controls as FormGroup[];
  }

  // imageValue!: UploadImagesType[];

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthServiceService,
    private transService: TranslateService
  ) {}

  ngOnInit(): void {
    this.sub.push(
      this.auth.isAdmin.subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      })
    );
    this.language = this.transService.currentLang;
    this.otherLanguage = this.language === 'en' ? 'cn' : 'en';
    this.subLang.push(
      this.transService.onLangChange.subscribe((lang) => {
        this.language = lang.lang;
        this.otherLanguage = lang.lang === 'en' ? 'cn' : 'en';
      })
    );
  }

  onChange = (imageArray) => {};

  onTouched = (event) => {};

  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  onselectFile(e, i) {
    if (e.target.files) {
      var reader = new FileReader();
      const file = e.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.imageArray.controls[i].patchValue({
          imageUrl: event.target.result,
          file,
        });
      };
    }

    console.log(this.imageArray.at(i).get('imageUrl'));
  }
  writeValue(obj: UploadImagesType[]): void {
    if (obj) {
      if (obj.length > 0) {
        this.imageArray.controls = obj.map((item, index) => {
          return this.newImage(item);
        });
      }
      if (this.imageArray.controls.length === 0) {
        this.addImage();
      }
      this.imagesChange();
    } else {
      this.imageArray.controls = [];
      if (this.imageArray.controls.length === 0) {
        this.addImage();
        this.imagesChange();
      }
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  addImage() {
    this.imageArray.push(this.newImage());
  }

  remove(i: number) {
    this.imageArray.removeAt(i);
  }
  onImageCategoryChange(data: any, i: number) {}

  imagesChange() {
    this.subImageChange.forEach((sub) => sub.unsubscribe());
    this.onChange(this.imageArray.value);
    this.subImageChange.push(
      this.imageArray.valueChanges.subscribe((data) => {
        console.log(data);
        this.onChange(data);
      })
    );
  }
}
