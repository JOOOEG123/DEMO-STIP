import { Component, OnInit, ElementRef, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { Observable, Subscription } from 'rxjs';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Image, ImageSchema } from 'src/app/core/types/adminpage.types';

import { ImagesService } from 'src/app/core/services/images.service';
import { StorageApIService } from 'src/app/core/services/storage-api.service';
import { ImageJson } from 'src/app/core/types/adminpage.types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UUID } from 'src/app/core/utils/uuid';
// import { Image } from 'src/app/core/types/adminpage.types';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit, OnDestroy {

  selectedCategory?: string;
  currentImageIndex?: number;

  title?: string
  galleries: string[] = []
  imageButton?: string

  public masonryOptions: NgxMasonryOptions = {
    gutter: 20,
    horizontalOrder: true
  };

  images: Image[] = []
  categoryImages: Image[] = []
  display: Image[] = []

  translationSubscription?: Subscription
  imageSubscription?: Subscription

  currentPage?: number;
  showBoundaryLinks: boolean = true;
  itemsPerPage: number = 4;

  modalRef?: BsModalRef
  selectedImage?: Image

  @ViewChild('image') imageRef?: ElementRef;

  constructor(
    private translate: TranslateService,
    private storageAPI: StorageApIService,
    private imagesAPI: ImagesService,
    private modalService: BsModalService) {}

  ngOnInit(): void {

    this.imageSubscription = this.imagesAPI.getAllImages().subscribe((data: any) => {
      let images : Image[] = Object.values(data)
      for (const image of images) {
        this.storageAPI.getGalleryImageURL(`${image.imageId}`).subscribe(data => {
          image.imagePath = data
        })
        this.images.push(image)
        if (this.display.length < this.itemsPerPage) {
          this.display.push(image)
        }
      }
      this.categoryImages = this.images.slice()
    })
    
   
    console.log(this.categoryImages)

    this.selectedCategory = 'All';
    this.currentImageIndex = -1;
    this.currentPage = 1;
  
    // Translation
    this.translationSubscription = this.translate.stream('gallery').subscribe(data => {
      this.galleries.length = 0

      this.galleries.push(data['gallery_top_cat_one_button'])
      this.galleries.push(data['gallery_top_cat_two_button'])
      this.galleries.push(data['gallery_top_cat_three_button'])
      this.galleries.push(data['gallery_top_cat_four_button'])
      this.galleries.push(data['gallery_top_cat_five_button'])
      this.title = data['gallery_top_title']
      this.imageButton = data['gallery_image_button']
    })
  }

  ngOnDestroy(): void {
    this.translationSubscription?.unsubscribe()
    this.imageSubscription?.unsubscribe()
  }

  setActive(gallery: string) {
    this.selectedCategory = gallery;
  
    this.currentPage = 1

    let result : Image[]  = []

    if (gallery == "All") {
      result = this.images.slice()
    }
    else {
      for (const image of this.images) {
        if (image.galleryCategory == gallery) {
          result.push(image)
        }
      }
    }

    this.categoryImages = result

    this.pageChanged({
      itemsPerPage: this.itemsPerPage,
      page: 1
    })
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
    this.display = this.categoryImages.slice(start, end);
    window.scroll(0, 0)
    this.imageRef?.nativeElement.focus()
  }

  onLearnMore(template: TemplateRef<any>, image: Image) {
    this.modalService.show(template, { class: 'modal-xl', backdrop: 'static'})
    this.selectedImage = image  
  }

  populateData() {
    // for (let i = 1; i <= 11; i++) {
    //   fetch(`http://localhost:4200/assets/gallery/historical_${i}.jpg`)
    //   .then(async response => {
    //     const contentType = response.headers.get('content-type')
    //     const blob = await response.blob()
    //     const file = new File([blob], UUID(), { type: contentType! })

    //     const uid = UUID()

    //     let image : ImageSchema = {
    //       imageId: uid,
    //       rightistId: '',
    //       isGallery: true,
    //       galleryCategory: '',
    //       galleryTitle: 'Title',
    //       galleryDetail: 'Detail',
    //       gallerySource: 'Source'
    //     }

    //     if (i % 2 == 0) {
    //       image.galleryCategory = 'Camps'
    //     }
    //     else {
    //       image.galleryCategory = 'People'
    //     }
       
    //     this.imagesAPI.addImage(image)
    //     this.storageAPI.uploadGalleryImage(uid, file)
    //   })
    // }
    this.currentPage = 1
  }

  onClose(value: string) {
    if (value === 'close') {
      this.modalService.hide()
    }
  }
}
