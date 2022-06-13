import { Component, OnInit } from '@angular/core';
import { FilterTypes } from 'src/app/core/types/filters.type';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  filterValues: FilterTypes = {} as FilterTypes;
  constructor() { }

  ngOnInit(): void {
  }

}
