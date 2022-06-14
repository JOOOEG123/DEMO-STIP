import { Component, OnInit } from '@angular/core';
import { NgxMasonryOptions } from 'ngx-masonry';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  selected: string | undefined
  galleries: Array<string> = [
    'All', 'Artifacts', 'Camps', 'People', 'Album Name'
  ]

  public masonryOptions: NgxMasonryOptions = {
    gutter: 20
  };

  images: Array<string> = [
    "https://i.imgur.com/C2FSuws.jpg",
    "https://imgur.com/ugRuIHq.jpg",
    "https://i.imgur.com/7tWYNvv.jpg",
    "https://i.imgur.com/SeLoG8d.jpg",
    "https://i.imgur.com/Xaha6Vo.jpg",
    "https://i.imgur.com/bN4U2J0.jpg",
    "https://i.imgur.com/3S1OoAi.jpg",
    "https://i.imgur.com/3GHYEo3.jpg",
    "https://i.imgur.com/ywAiaWh.jpg",
    "https://i.imgur.com/wOPcRBD.jpg",
    "https://i.imgur.com/Z9dsNRc.jpg",
    "https://i.imgur.com/3HXgWpU.jpg"
  ]

  constructor() { }

  ngOnInit(): void {
    this.selected = 'All'
  }

  setActive(gallery: string) {
    this.selected = gallery
  }
}
