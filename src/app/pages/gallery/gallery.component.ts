import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { NgxMasonryOptions } from 'ngx-masonry';

interface Image {
  src: string,
  title: string,
  description: string,
  opacity: number
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  selectedCategory?: string 
  currentImageIndex?: number

  galleries: Array<string> = [
    'All', 'Artifacts', 'Camps', 'People', 'Album Name'
  ]

  public masonryOptions: NgxMasonryOptions = {
    gutter: 20
  };

  modelRef: BsModalRef | undefined

  images: Array<Image> = [
    {
      src: "assets/gallery/historical_1.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "assets/gallery/historical_2.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "assets/gallery/historical_3.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "assets/gallery/historical_4.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "assets/gallery/historical_5.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "assets/gallery/historical_6.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "assets/gallery/historical_7.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "assets/gallery/historical_8.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "assets/gallery/historical_9.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "assets/gallery/historical_10.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "assets/gallery/historical_11.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
  ]
  
  currentPage?: number
  showBoundaryLinks: boolean = true
  itemsPerPage: number = 5
  display?: Array<Image>

  constructor() {
    this.selectedCategory = 'All';
    this.currentImageIndex = -1;
    this.currentPage = 1;
    this.display = this.images.slice(0, this.itemsPerPage)
  }

  ngOnInit(): void {}

  setActive(gallery: string) {
    this.selectedCategory = gallery
  }

  onEnter(index: number) {
    this.currentImageIndex = index
  }

  onLeave() {
    this.currentImageIndex = -1
  }

  pageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page
    var start = (this.currentPage - 1) * this.itemsPerPage;
    var end = start + this.itemsPerPage
    this.display = this.images.slice(start, end)
  }
}
