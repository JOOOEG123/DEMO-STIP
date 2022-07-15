import { Component, OnInit } from '@angular/core';
import { NgxMasonryOptions } from 'ngx-masonry';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss'],
})
export class RepositoryComponent implements OnInit {
  repository_titles: string[][] = [
    ['Forward', 'Forward Title', 'Document'],
    ['Publication Notes', ''],
    ['Appendix', 'Title', 'Document'],
    ['Preface', 'Preface Title', 'Document'],
  ];

  selectedCategory: string = this.repository_titles[0][0];
  constructor() {}

  ngOnInit(): void {}

  setActive(gallery: string) {
    this.selectedCategory = gallery;
  }
}
