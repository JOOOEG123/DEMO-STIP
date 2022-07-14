import { Component, OnInit, ElementRef, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { NgxMasonryOptions } from 'ngx-masonry';
import { Subscription } from 'rxjs';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Image } from 'src/app/core/types/adminpage.types';

import { ImagesService } from 'src/app/core/services/images.service';
import { StorageApIService } from 'src/app/core/services/storage-api.service';
import { ImageJson } from 'src/app/core/types/adminpage.types';
// import { Image } from 'src/app/core/types/adminpage.types';
interface Image {
  src: string;
  title: string;
  description: string;
  opacity: number;
}

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
  };

  imagesOther: Image[] = []

  images: Array<Image> = [
    {
      src: 'assets/gallery/historical_1.jpg',
      title: 'Some title',
      description: 'Some description',
      opacity: 100,
    },
    {
      src: 'assets/gallery/historical_2.jpg',
      title: 'Some title',
      description: 'Some description',
      opacity: 100,
    },
    {
      src: 'assets/gallery/historical_3.jpg',
      title: 'Some title',
      description: 'Some description',
      opacity: 100,
    },
    {
      src: 'assets/gallery/historical_4.jpg',
      title: 'Some title',
      description: 'Some description',
      opacity: 100,
    },
    {
      src: 'assets/gallery/historical_5.jpg',
      title: 'Some title',
      description: 'Some description',
      opacity: 100,
    },
    {
      src: 'assets/gallery/historical_6.jpg',
      title: 'Some title',
      description: 'Some description',
      opacity: 100,
    },
    {
      src: 'assets/gallery/historical_7.jpg',
      title: 'Some title',
      description: 'Some description',
      opacity: 100,
    },
    {
      src: 'assets/gallery/historical_8.jpg',
      title: 'Some title',
      description: 'Some description',
      opacity: 100,
    },
    {
      src: 'assets/gallery/historical_9.jpg',
      title: 'Some title',
      description: 'Some description',
      opacity: 100,
    },
    {
      src: 'assets/gallery/historical_10.jpg',
      title: 'Some title',
      description: 'Some description',
      opacity: 100,
    },
    {
      src: 'assets/gallery/historical_11.jpg',
      title: 'Some title',
      description: 'Some description',
      opacity: 100,
    },
  ];

  translationSubscription?: Subscription

  currentPage?: number;
  showBoundaryLinks: boolean = true;
  itemsPerPage: number = 5;
  display: Image[] = []

  @ViewChild('image') imageRef?: ElementRef;

  constructor(
    private translate: TranslateService,
    private storageAPI: StorageApIService,
    private imagesAPI: ImagesService) {}

  ngOnInit(): void {

    this.imagesAPI.getAllImages().subscribe((data: any) => {
      let images : Image[]
      for (const image in Object.values(data)) {
        this.imagesOther.push(image)
      }
    })

    this.selectedCategory = 'All';
    this.currentImageIndex = -1;
    this.currentPage = 1;
    this.display = this.images.slice(0, this.itemsPerPage);

    

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
  }

  setActive(gallery: string) {
    this.selectedCategory = gallery;
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
    this.display = this.images.slice(start, end);
    window.scroll(0, 0)
    this.imageRef?.nativeElement.focus()
  }

  onLearnMore() {
    console.log("ad")
    this.storageAPI.getGalleryImage('historical_11.jpg').subscribe((data) => {
      console.log(data)
    })
  }
}
