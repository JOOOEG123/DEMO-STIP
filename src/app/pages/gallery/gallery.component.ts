import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  PageChangedEvent,
  PaginationComponent,
} from 'ngx-bootstrap/pagination';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { Subscription } from 'rxjs';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Image } from 'src/app/core/types/adminpage.types';

import { ImagesService } from 'src/app/core/services/images.service';
import { StorageApIService } from 'src/app/core/services/storage-api.service';
import { UUID } from 'src/app/core/utils/uuid';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit, OnDestroy {
  selectedCategory?: string;
  currentImageIndex?: number;

  title?: string;
  galleries: string[] = [];
  imageButton?: string;

  public masonryOptions: NgxMasonryOptions = {
    gutter: 20,
  };

  images: Image[] = [];
  categoryImages: Image[] = [];
  searchImages: Image[] = [];
  display: Image[] = [];

  translationSubscription?: Subscription;
  imageSubscription?: Subscription;

  currentPage: number = 1;
  showBoundaryLinks: boolean = true;
  itemsPerPage: number = 6;

  modalRef?: BsModalRef;
  selectedImage?: Image;

  status: string = 'initial';

  @ViewChild('image') imageRef?: ElementRef;
  @ViewChild(NgxMasonryComponent) masonry?: NgxMasonryComponent;

  constructor(
    private translate: TranslateService,
    private storageAPI: StorageApIService,
    private imagesAPI: ImagesService,
    private modalService: BsModalService
  ) {}

  language?: string;
  otherLanguage?: string;

  sub: Subscription[] = [];
  loaded: boolean = false

  ngOnInit(): void {
    this.language = localStorage.getItem('lang')!
    this.otherLanguage = this.language === 'en' ? 'cn' : 'en'

    this.sub.push(this.translate.onLangChange.subscribe((data) => {
      this.language = data.lang
      this.otherLanguage = this.language === 'en' ? 'cn' : 'en'

      console.log(this.language)

      this.sub.push(
        this.imagesAPI.getGalleryImages(this.language!).subscribe((imageList: any) => {
          let count = 0
          let dataLength = imageList.length

          this.loaded = false
          this.categoryImages.length = 0;
          this.display.length = 0;
          this.images.length = 0;

          let images: Image[] = imageList
          console.log(images)
          console.log(data)
          for (const image of images) {
            this.storageAPI
              .getImageUrl(`${image.imageId}`)
              .subscribe((data) => {
                count += 1
                image.imagePath = data;
                if (count == dataLength) {
                  this.loaded = true
                }
              });
            this.images.push(image);
            if (this.display.length < this.itemsPerPage) {
              this.display.push(image);
            }
          }
          this.categoryImages = this.images.slice();
          this.searchImages = this.categoryImages;
        })
      );
  
      this.selectedCategory = 'All';
      this.currentImageIndex = -1;
    }))

    // Translation
    this.sub.push(
      this.translate.stream('gallery').subscribe((data) => {
        this.galleries.length = 0;

        this.galleries.push(data['gallery_top_cat_one_button']);
        this.galleries.push(data['gallery_top_cat_two_button']);
        this.galleries.push(data['gallery_top_cat_three_button']);
        this.galleries.push(data['gallery_top_cat_four_button']);
        this.galleries.push(data['gallery_top_cat_five_button']);
        this.title = data['gallery_top_title'];
        this.imageButton = data['gallery_image_button'];
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.forEach((x) => x.unsubscribe());
  }

  setActive(gallery: string) {
    this.selectedCategory = gallery;

    let result: Image[] = [];

    if (gallery == 'All') {
      result = this.images.slice();
    } else {
      for (const image of this.images) {
        if (image.galleryCategory == gallery) {
          result.push(image);
        }
      }
    }

    this.currentPage = 1;

    // issue with ngx pagination (can only update one field at a time)
    setTimeout(() => {
      this.categoryImages = result;
      this.searchGallery();
    }, 100);
  }

  onEnter(index: number) {
    this.currentImageIndex = index;
  }

  onLeave() {
    this.currentImageIndex = -1;
  }

  pageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    var start = (this.currentPage - 1) * this.itemsPerPage;
    var end = start + this.itemsPerPage;
    this.display = this.searchImages.slice(start, end);
    window.scroll(0, 0);
    this.imageRef?.nativeElement.focus();
  }

  onLearnMore(template: TemplateRef<any>, image: Image) {
    this.selectedImage = image;
    this.status = 'initial';
    this.modalService.show(template, { class: 'modal-xl', backdrop: 'static' });
  }

  // functionality in modal
  onSubmit(data: any, template: TemplateRef<any>) {
    this.modalService.hide();

    setTimeout(() => {
      this.status = data.status;
      this.selectedImage = data.image;
      this.modalService.show(template, {
        class: 'modal-xl',
        backdrop: 'static',
      });
    }, 500);
  }

  onRemove(data: any, template: TemplateRef<any>) {
    this.modalService.hide();

    setTimeout(() => {
      this.status = data.status;
      this.modalService.show(template, {
        class: 'modal-xl',
        backdrop: 'static',
      });
    }, 500);
  }

  onUpdate(data: any) {
    let image: Image = data.image;
    if (this.selectedImage) {
      if (data.status == 'update') {
        this.modalService.hide();
        let { opacity, imagePath, ...result } = image;
        this.imagesAPI.updateImage(this.language!, result);
      }
    }
    this.currentPage = 1;
  }

  onDelete(data: any) {
    let image = data.image;
    if (data.status == 'delete') {
      this.modalService.hide();
      this.imagesAPI.deleteImage(this.language!, image.imageId);
      this.storageAPI.removeGalleryImage(image.imageId);
    }
    this.currentPage = 1;
  }

  onCancel(data: any) {
    if (data.status == 'cancel') {
      this.modalService.hide();
    }
  }

  onClose(data: any) {
    if (data.status === 'close') {
      this.modalService.hide();
    }
  }
  searchTerm?: string;

  searchGallery() {
    let result: Image[] = [];

    if (this.searchTerm) {
      for (const image of this.categoryImages) {
        if (
          image.galleryDetail
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        ) {
          result.push(image);
        }
      }
      this.searchImages = result;
    } else {
      this.searchImages = this.categoryImages;
    }

    this.display = this.searchImages.slice(0, this.itemsPerPage);

    // issue with pagination. Unable to find fix.
    setTimeout(() => {
      this.currentPage = 1;
      this.masonry?.reloadItems();
      this.masonry?.layout();
    }, 200);
  }
}
