import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Image } from 'src/app/core/types/adminpage.types';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
})
export class OverlayComponent implements OnInit {
  @Input() type?: string
  @Input() status?: string;
  @Input() image?: Image;
  @Input() otherImage?: Image;
  @Input() isAdmin?: boolean
  @Output() add: EventEmitter<any> = new EventEmitter()
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() remove: EventEmitter<any> = new EventEmitter();

  private _language?: string
  private _otherLanguage?: string

  @Input() set language(value: string) {
    this._language = value
    this.imageCategories = this.LIST_OF_IMAGE_CATEGORIES[this.language!]
    this.otherImageCategories = this.LIST_OF_IMAGE_CATEGORIES[this.otherLanguage!]
  } 

  @Input() set otherLanguage(value: string) {
    this._otherLanguage = value
  }

  get language(): string {
    return this._language!
  }

  get otherLanguage(): string {
    return this._otherLanguage!
  }

  modalRef?: BsModalRef;

  imageCategories: string[] = []
  otherImageCategories: string[] = []

  LIST_OF_IMAGE_CATEGORIES = {
    en: ['People', 'Media', 'Camps', 'Other'],
    cn: ['人们', '媒体', '营地', '其他'],
  };

  constructor() {}

  isEditMode: boolean = false;

  category: string = '';
  title: string = '';
  detail: string = '';
  source: string = '';

  otherCategory: string = '';
  otherTitle: string = '';
  otherDetail: string = '';
  otherSource: string = '';

  imageAdded: boolean = false
  url: string = '/assets/account/template-profile.png'

  ngOnInit(): void {
    console.log(this.type!)
  }

  onClose() {
    this.close.emit({
      status: 'close',
    });
  }

  onCategoryChange(value: any) {
    console.log(value)
    this.otherCategory = this.LIST_OF_IMAGE_CATEGORIES[this.otherLanguage][value.target.value]
  }

  onEdit() {
    this.isEditMode = true;

    this.category = this.image!.galleryCategory;
    this.title = this.image!.galleryTitle;
    this.detail = this.image!.galleryDetail;
    this.source = this.image!.gallerySource;

    // Fetch the image in other language
    this.otherImage = {
      ...this.image!,
      galleryCategory: '类别',
      galleryTitle: '标题',
      galleryDetail: '细节',
      gallerySource: '资源',
    };

    this.otherCategory = this.otherImage?.galleryCategory;
    this.otherTitle = this.otherImage?.galleryTitle;
    this.otherDetail = this.otherImage?.galleryDetail;
    this.otherSource = this.otherImage?.gallerySource;
  }

  onSubmit() {
    this.submit.emit({
      image: {
        ...this.image,
        galleryCategory: this.category,
        galleryTitle: this.title,
        galleryDetail: this.detail,
        gallerySource: this.source,
      },
      otherImage: {
        ...this.otherImage,
        galleryCategory: this.otherCategory,
        galleryTitle: this.otherTitle,
        galleryDetail: this.otherDetail,
        gallerySource: this.otherSource,
      },
      status: 'submit',
    });
  }

  onRemove() {
    this.remove.emit({
      status: 'remove',
    });
  }

  onUpdate() {
    this.update.emit({
      image: this.image,
      otherImage: this.otherImage,
      status: 'update',
    });
  }

  onDelete() {
    this.delete.emit({
      image: this.image,
      status: 'delete',
    });
  }

  onCancel() {
    this.cancel.emit({
      status: 'cancel',
    });
  }

  onAdd() {
    
    let image = {
      imageId: '',
      rightistId: '',
      isGallery: true,
      galleryCategory: this.category,
      galleryTitle: this.title,
      galleryDetail: this.detail,
      gallerySource: this.source,
    }

    let otherImage = {
      imageId: '',
      rightistId: '',
      isGallery: true,
      galleryCategory: this.otherCategory,
      galleryTitle: this.otherTitle,
      galleryDetail: this.otherDetail,
      gallerySource: this.otherSource,
    }

    this.add.emit({
      status: 'add',
      value: image,
      otherValue: otherImage,
      url: this.url
    })
  }


  
  onselectFile(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.imageAdded = true
      };
    }
  }
}