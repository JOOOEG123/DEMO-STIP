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
import { Image, ImageSchema } from 'src/app/core/types/adminpage.types';

import { ImagesService } from 'src/app/core/services/images.service';
import { StorageApIService } from 'src/app/core/services/storage-api.service';
import { UUID } from 'src/app/core/utils/uuid';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';

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
  otherImage?: Image;

  status: string = 'initial';
  type?: string;

  @ViewChild('image') imageRef?: ElementRef;
  @ViewChild(NgxMasonryComponent) masonry?: NgxMasonryComponent;

  sub: Subscription[] = [];
  searchTerm?: string;

  language: string = '';
  otherLanguage: string = '';

  isAdmin?: boolean;
  loaded: boolean = false
  
  constructor(
    private translate: TranslateService,
    private storageAPI: StorageApIService,
    private imagesAPI: ImagesService,
    private modalService: BsModalService,
    private auth: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.auth.isAdmin.subscribe((isAdmin: any) => {
      this.isAdmin = isAdmin;
    });

    this.language = localStorage.getItem('lang')!;
    this.otherLanguage = this.language === 'en' ? 'cn' : 'en';

    this.sub.push(
      this.translate.onLangChange.subscribe((lang: any) => {
        this.language = lang.lang;
        this.otherLanguage = this.language === 'en' ? 'cn' : 'en';

        this.sub.push(
          this.imagesAPI
            .getGalleryImages(this.language!)
            .subscribe((imagesList: any) => {
              this.loaded = true
              this.categoryImages.length = 0;
              this.display.length = 0;
              this.images.length = 0;
              let images: Image[] = imagesList;
              for (const image of images) {
                this.images.push(image);
                if (this.display.length < this.itemsPerPage) {
                  this.display.push(image);
                }
              }
              this.loaded = true
              console.log(this.images);
              this.categoryImages = this.images.slice();
              this.searchImages = this.categoryImages;
            })
        );

        this.selectedCategory = 'All';
        this.currentImageIndex = -1;
      })
    );

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
    this.translationSubscription?.unsubscribe();
    this.imageSubscription?.unsubscribe();
    this.sub.forEach((x) => x.unsubscribe());
  }

  setActive(gallery: string) {
    this.selectedCategory = gallery;

    let result: Image[] = [];

    if (gallery == 'All' || gallery == '全部') {
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
      // this.display = this.searchImages.slice(0, this.itemsPerPage)
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
    this.type = 'edit';
    this.status = 'initial';
    this.modalService.show(template, { class: 'modal-xl', backdrop: 'static' });
  }

  async onAdd(data: any) {
    let imageId = `Image-${UUID()}`;
    let image: ImageSchema = data.value;
    let otherImage: ImageSchema = data.otherValue;

    image.imageId = imageId;
    otherImage.imageId = imageId;

    console.log(image);
    console.log(otherImage);
    await fetch(data.url).then(async (response) => {
      console.log(image.imageId);
      const contentType = response.headers.get('content-type');
      const blob = await response.blob();
      const file = new File([blob], image.imageId, { type: contentType! });
      await this.storageAPI.uploadGalleryImage(image.imageId, file).then(() => {
        this.sub.push(
          this.storageAPI
            .getGalleryImageURL(image.imageId)
            .subscribe((imageUrl: any) => {
              console.log(imageUrl);
              image.imagePath = imageUrl;
              otherImage.imagePath = imageUrl;

              Promise.all([
                this.imagesAPI.addImage(this.language!, image),
                this.imagesAPI.addImage(this.otherLanguage!, otherImage),
              ]).then(() => {
                this.modalService.hide();
              });
            })
        );
      });
    });
  }

  // functionality in modal
  onSubmit(data: any, template: TemplateRef<any>) {
    this.modalService.hide();

    setTimeout(() => {
      this.status = data.status;
      this.selectedImage = data.image;
      this.otherImage = data.otherImage;
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
    let otherImage: Image = data.otherImage;
    if (this.selectedImage) {
      if (data.status == 'update') {
        this.modalService.hide();
        let { opacity, imagePath, ...result } = image;
        console.log(result);
        this.imagesAPI.addImage(this.language!, result);
      }
    }

    if (this.otherImage) {
      if (data.status == 'update') {
        this.modalService.hide();
        let { opacity, imagePath, ...result } = otherImage;
        console.log(result);
        // this.imagesAPI.updateImage(result)
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
      console.log(image);
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
      console.log(this.searchImages);
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

  addImage(template: TemplateRef<any>) {
    this.type = 'add';
    this.status = 'initial';
    this.selectedImage = undefined;
    this.modalService.show(template, { class: 'modal-xl', backdrop: 'static' });
  }
}
