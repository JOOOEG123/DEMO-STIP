import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { LIST_OF_IMAGE_CATEGORIES } from 'src/app/core/constants/group.constants';
import { ImagesService } from 'src/app/core/services/images.service';
import { Image } from 'src/app/core/types/adminpage.types';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
})
export class OverlayComponent implements OnInit, OnDestroy {
  @Input() type?: string;
  @Input() status?: string;
  @Input() image?: Image;
  @Input() otherImage?: Image;
  @Input() isAdmin?: boolean;
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() remove: EventEmitter<any> = new EventEmitter();

  private _language?: string;
  private _otherLanguage?: string;

  @Input() set language(value: string) {
    this._language = value;
    this.imageCategories = LIST_OF_IMAGE_CATEGORIES[this.language!];
    this.otherImageCategories = LIST_OF_IMAGE_CATEGORIES[this.otherLanguage!];
  }

  @Input() set otherLanguage(value: string) {
    this._otherLanguage = value;
  }

  get language(): string {
    return this._language!;
  }

  get otherLanguage(): string {
    return this._otherLanguage!;
  }

  modalRef?: BsModalRef;

  imageCategories: string[] = [];
  otherImageCategories: string[] = [];

  constructor(private imageAPI: ImagesService) {}

  isEditMode: boolean = false;

  category: string = '';
  title: string = '';
  detail: string = '';
  source: string = '';

  otherCategory: string = '';
  otherTitle: string = '';
  otherDetail: string = '';
  otherSource: string = '';

  imageAdded: boolean = false;
  url: string = '/assets/account/template-profile.png';

  sub: Subscription[] = [];

  ngOnInit(): void {
    if (this.image) {

    }
  }

  ngOnDestroy(): void {
    this.sub.forEach((x) => x.unsubscribe());
  }

  onClose() {
    this.close.emit({
      status: 'close',
    });
  }

  onCategoryChange(value: any) {
    this.otherCategory =
      LIST_OF_IMAGE_CATEGORIES[this.otherLanguage][value.target.value];
  }

  onEdit() {
    this.isEditMode = true;

    this.category = Object.keys(LIST_OF_IMAGE_CATEGORIES[this.language!]).find(
      (k) =>
        LIST_OF_IMAGE_CATEGORIES[this.language!][k] ===
        this.image!.category
    )!;

    this.title = this.image!.title;
    this.detail = this.image!.detail;
    this.source = this.image!.source;

    // Fetch the image in other language
    this.sub.push(
      this.imageAPI
        .getImage(this.otherLanguage!, this.image!.imageId)
        .subscribe((data: any) => {
          this.otherImage = {
            ...this.image!,
            category: data.category,
            title: data.title,
            detail: data.detail,
            source: data.source,
          };

          this.otherCategory = this.otherImage?.category;
          this.otherTitle = this.otherImage?.title;
          this.otherDetail = this.otherImage?.detail;
          this.otherSource = this.otherImage?.source;
        })
    );
  }

  onSubmit() {
    this.submit.emit({
      image: {
        ...this.image,
        category:
          LIST_OF_IMAGE_CATEGORIES[this.language!][this.category] ||
          LIST_OF_IMAGE_CATEGORIES[this.language!][
            LIST_OF_IMAGE_CATEGORIES[this.language!].length - 1
          ],
        title: this.title,
        detail: this.detail,
        source: this.source,
      },
      otherImage: {
        ...this.otherImage,
        category: this.otherCategory,
        title: this.otherTitle,
        detail: this.otherDetail,
        source: this.otherSource,
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
      category:
        LIST_OF_IMAGE_CATEGORIES[this.language!][this.category] ||
        LIST_OF_IMAGE_CATEGORIES[this.language!][
          LIST_OF_IMAGE_CATEGORIES[this.language!].length - 1
        ],
      title: this.title,
      detail: this.detail,
      source: this.source,
    };
    let otherImage = {
      imageId: '',
      rightistId: '',
      isGallery: true,
      category: this.otherCategory,
      title: this.otherTitle,
      detail: this.otherDetail,
      source: this.otherSource,
    };

    this.add.emit({
      status: 'add',
      value: image,
      otherValue: otherImage,
      url: this.url,
    });
  }

  onselectFile(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.imageAdded = true;
      };
    }
  }
}
