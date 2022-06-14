import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
      src: "https://i.imgur.com/C2FSuws.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "https://imgur.com/ugRuIHq.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "https://imgur.com/ugRuIHq.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "https://i.imgur.com/7tWYNvv.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "https://i.imgur.com/SeLoG8d.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "https://i.imgur.com/Xaha6Vo.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "https://i.imgur.com/bN4U2J0.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "https://i.imgur.com/3S1OoAi.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "https://i.imgur.com/3GHYEo3.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "https://i.imgur.com/ywAiaWh.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "https://i.imgur.com/wOPcRBD.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "https://i.imgur.com/Z9dsNRc.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    },
    {
      src: "https://i.imgur.com/3HXgWpU.jpg",
      title: "Some title",
      description: 'Some description',
      opacity: 100,
    }
  ]

  constructor() {
    this.selectedCategory = 'All';
    this.currentImageIndex = -1;
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
}
