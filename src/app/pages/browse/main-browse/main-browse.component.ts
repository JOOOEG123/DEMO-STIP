import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  OnDestroy,
  Attribute,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { FilterTypes } from 'src/app/core/types/filters.type';

import { LETTERS } from './main-browse.constant';

@Component({
  selector: 'app-main-browse',
  templateUrl: './main-browse.component.html',
  styleUrls: ['./main-browse.component.scss'],
})
export class MainBrowseComponent implements OnInit, OnDestroy {
  //search result panel variables
  currentLetter = 'A';
  currentPage = 1;
  curView = 'List';
  display: any[] = [];
  filterValues: FilterTypes = {} as FilterTypes;

  itemsPerPage = 25;
  searchInput = '';
  letters = LETTERS;
  maxPage = 1;
  olditemsPerPage = 25;

  //variables for search functionalities
  db_result: any[] = [];
  nonFilterData: any[] = [];
  archCacheAPI: any = {};
  archSubAPI: Subscription[] = [];
  isloading!: boolean;

  constructor(
    private archApi: ArchieveApiService,
    private changeDetection: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.lettersBtnClickOrReset('A');
  }
  ngOnDestroy(): void {
    this.archSubAPI.forEach((sub) => sub.unsubscribe());
    this.archCacheAPI = {};
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

  lettersBtnClickOrReset(letter: string) {
    this.currentPage = 1;
    this.currentLetter = letter;
    // const alpha = letter === 'All' ? '' : letter;
    this.callAPI(letter);
  
  }

  //for testing data
  callAPI(letter: string) {
    //clear up display
    this.display = [];

    const alpha = letter === 'All' ? '' : letter;
    const archKey = `person_arch_${letter}`;

    //'from cache data'
    if (this.archCacheAPI[archKey]) {
      this.db_result = this.archCacheAPI[archKey];
      this.setDisplayInfo(this.itemsPerPage);
    } else {
      this.isloading = true;
      this.archSubAPI.push(
        this.archApi.getTestDataByPersons().subscribe((datas: any) => {
          console.log(datas);
          this.db_result =
            letter === 'All'
              ? datas
              : this.categorizeDataByLetter(alpha, datas);

          this.archCacheAPI[archKey] = this.db_result;
          this.setNonFilterDataForFilterPanel()
          this.setDisplayInfo(this.itemsPerPage);
          this.isloading = false;
        })
      );
    }
  }

  categorizeDataByLetter(letter: string, datas: any[]) {
    console.log('in categroy', letter, this.db_result);
    return datas.filter((record) => {
      return record.initial === letter;
    });
  }


  searchBar() {

    const userValues = this.searchInput.split(' ');

    this.db_result = this.db_result.filter((record): boolean => {
      let values = Object.values(record).map((value): string =>
        String(value).toLowerCase()
      );

      return userValues.every((element) =>
        values.includes(element.toLowerCase())
      );
    });

    //save search bar filtered values
    this.setNonFilterDataForFilterPanel()
    this.currentPage = 1;
    this.setDisplayInfo(this.itemsPerPage);
  }


  filterValueschanges(valueEmitted: any) {
    const empty = Object.values(this.filterValues).every((element) => {
      return element === '';
    });

    console.log(this.db_result)
    //reset db
    this.getNonFilterDataForFilterPanel()

    console.log(this.db_result)
    //clear button trigger
    if (empty) {
      console.log('clear button trigger');
      this.currentPage = 1;
      this.setDisplayInfo(this.itemsPerPage);
    } else {
      console.log('user input feed trigger');
      this.filterByFilterValues();
      console.log(this.db_result)
    }
  }

  filterByFilterValues() {

    this.db_result = this.db_result.filter((record): boolean => {
      let values: any[] = [
        record.gender,
        // record.nationality,
        record.workplace,
        record.status,
      ];
      let userValues: any[] = [
        this.filterValues.gender,
        this.filterValues.group,
        this.filterValues.occupation,
      ].filter((element) => {
        return element !== '';
      });

      var containsAll =
        userValues.every((element) => {
          return values.includes(element);
        }) &&
        this.getYearBecameRightist(record);
      return containsAll;
    });

    this.currentPage = 1;
    this.setDisplayInfo(this.itemsPerPage);
  }

  getNonFilterDataForFilterPanel () {
    //filter panel use this function

    this.db_result = this.nonFilterData

  }

  setNonFilterDataForFilterPanel() {

      this.nonFilterData = this.db_result

  }

  getYearBecameRightist(record: any) {
    let res = true;

    if (this.filterValues.date) {
      var from = this.filterValues.date[0].getFullYear();
      var to = this.filterValues.date[1].getFullYear();

      res = from <= record.year_rightist && record.year_rightist <= to;
    }

    return res;
  }

}
