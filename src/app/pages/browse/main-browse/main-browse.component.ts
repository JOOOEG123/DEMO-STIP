import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { FilterTypes } from 'src/app/core/types/filters.type';
import { LETTERS } from './main-browse.constant';

@Component({
  selector: 'app-main-browse',
  templateUrl: './main-browse.component.html',
  styleUrls: ['./main-browse.component.scss'],
})
export class MainBrowseComponent implements OnInit {
  //search result panel variables
  currentLetter = 'All';
  currentPage = 1;
  curView = 'List';
  display: any[] = [];
  filterValues: FilterTypes = {} as FilterTypes;
  itemsPerPage = 50;
  keyword = '';
  letters = LETTERS;
  maxPage = 1;
  olditemsPerPage = 50;

  //variables for search functionalities
  db_result: any[] = [];

  constructor(
    private archApi: ArchieveApiService,
    private changeDetection: ChangeDetectorRef,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.lettersBtnClick('All');
  }

  itemPerPageChanged() {
    //casting
    this.itemsPerPage = +this.itemsPerPage;
    this.setDisplayInfo(this.olditemsPerPage);
    this.olditemsPerPage = this.itemsPerPage;
  }

  setDisplayInfo(startItemsPerPage: number) {
    var start = (this.currentPage - 1) * startItemsPerPage;
    var end = start + this.itemsPerPage;
    this.display = this.db_result.slice(start, end);
    this.maxPage = Math.max(
      Math.ceil(this.db_result.length / this.itemsPerPage),
      1
    );
  }

  pageChanged(event: any) {
    console.log('in page changed');
    this.currentPage = event.page;
    this.setDisplayInfo(this.itemsPerPage);
  }

  lettersBtnClick(letter: string) {
    this.spinnerService.show();
    this.currentPage = 1;
    this.currentLetter = letter;
    const alpha = letter === 'All' ? '' : letter;
    this.archApi.getArchievePersonByAlphabet(alpha).subscribe((datas: any) => {
      this.db_result =
        letter === 'All'
          ? datas.map((alphabet: any) => [].concat(alphabet.persons)).flat()
          : datas;
      //reset current page
      this.setDisplayInfo(this.itemsPerPage);
      this.spinnerService.hide();
    });
  }

  searchResultClick() {}

  filterByFilterValues() {
    console.log(this.filterValues);
  }

  //implement later
  filterByKeyword() {
    if (this.keyword) {
      console.log(this.keyword);
      this.db_result = this.db_result.filter((x) =>
        x.full_name.includes(this.keyword)
      );
    } else {
    }
  }

  filterValueschanges(filterValues: FilterTypes) {
    console.log(filterValues);
  }
}
