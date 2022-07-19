import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  OnDestroy,
  Attribute,
  ViewChild,
  SimpleChanges,
  NgZone,
  OnChanges,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { concatAll, Subscription } from 'rxjs';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { FilterTypes } from 'src/app/core/types/filters.type';
import { LETTERS } from './main-browse.constant';
import { BrowseSearchFilterComponent } from 'src/app/pages/browse/browse-search-filter/browse-search-filter.component';
import { BsDropdownModule, BsDropdownConfig } from 'ngx-bootstrap/dropdown';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-main-browse',
  templateUrl: './main-browse.component.html',
  styleUrls: ['./main-browse.component.scss'],
})
export class MainBrowseComponent implements OnInit, OnDestroy {
  //search result panel variables
  currentLetter = 'All';
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
  @Input() db_result: any[] = [];

  db_result_thousands_seperator: string = '0';
  nonFilterData: any[] = [];
  archCacheAPI: any = {};
  archSubAPI: Subscription[] = [];
  isloading!: boolean;
  original: any;
  searchSelect: string = 'All Fields';
  db_attr: string[] = [
    'birthYear',
    'birthplace',
    'deathYear',
    'description',
    'detailJob',
    'education',
    'ethnicity',
    'events',
    'firstName',
    'gender',
    'job',
    'lastName',
    'publish',
    'memoir',
    'reference',
    'rightistYear',
    'status',
    'workplace',
  ];

  @ViewChild(BrowseSearchFilterComponent)
  private browseSearchFilterComponent!: BrowseSearchFilterComponent;

  constructor(
    private archApi: ArchieveApiService,
    private route: ActivatedRoute,
    private changeDetection: ChangeDetectorRef
  ) {
    console.log(this.db_result.length);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchInput = params['searchTerm'] || '';
      this.lettersBtnClickOrReset('All');
    });
    console.log(this.db_result.length);
  }
  ngOnDestroy(): void {
    this.archSubAPI.forEach((sub) => sub.unsubscribe());
    this.archCacheAPI = {};
  }

  ngDoCheck() {
    this.thousandsSeperator();
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
    this.currentPage = event.page;
    this.setDisplayInfo(this.itemsPerPage);
  }

  lettersBtnClickOrReset(letter: string) {
    this.currentPage = 1;
    this.currentLetter = letter;

    this.callAPI(letter);
  }

  //for testing data
  callAPI(letter: string) {
    //clear up display
    this.display = [];

    const alpha = letter === 'All' ? '' : letter;
    const archKey = `person_arch_${letter}`;

    let res;
    //'from cache data'
    if (this.archCacheAPI[archKey]) {
      this.db_result = this.archCacheAPI[archKey];
      this.setDisplayInfo(this.itemsPerPage);
    } else {
      this.isloading = true;
      if (letter === 'All') {
        // replace api when database change. An we need to add profileId to json data.
        res = this.archApi.getAllArchieve().subscribe((datas: any) => {
          this.db_result = Object.entries(datas).map(([key, value]: any) => {
            return { profileId: key, ...value };
          });

          this.archCacheAPI[archKey] = this.db_result;

          this.setDisplayInfo(this.itemsPerPage);
          this.setNonFilterData('filterPanel');
          this.setNonFilterData('searchBar');
          if (this.searchInput) {
            this.searchBar();
          }

          this.isloading = false;
        });
      } else {
        // replace api when database change. An we need to add profileId to json data.
        // res = this.archApi
        //   .getAllArchieve()
        //   .subscribe((datas: any) => {
        this.db_result = this.archCacheAPI['person_arch_All'].filter(
          (r: any) => r.initial == letter
        );
        this.archCacheAPI[archKey] = this.db_result;
        this.setDisplayInfo(this.itemsPerPage);
        this.setNonFilterData('filterPanel');
        this.setNonFilterData('searchBar');
        this.isloading = false;
        if (this.searchInput) {
          this.searchBar();
        }
        // });
      }
    }
    if (res) {
      this.archSubAPI.push(res);
    }
  }

  searchBar() {
    console.log('search bar-------------');
    this.browseSearchFilterComponent?.clear();
    const userValues = this.searchInput.split(' ');

    console.log(this.db_attr, userValues);

    this.getNonFilterData('searchBar');

    this.db_result = this.db_result.filter((record: any): boolean => {
      return userValues.every((keyword) => {
        var res: boolean = false;

        if (this.searchSelect == 'All Fields') {
          Object.values(record).forEach((element) => {
            res =
              res ||
              this.containKeyword(
                JSON.stringify(element, this.db_attr),
                keyword
              );
          });
        } else {
          for (var attribute of this.db_attr) {
            console.log('2. ', record[attribute], '3.');
            res = res || this.containKeyword(record[attribute], keyword);
          }
        }

        return res;
      });
    });

    if (!userValues.length) {
      this.getNonFilterData('searchBar');
    }

    //save search bar filtered values
    this.setNonFilterData('filterPanel');
    this.currentPage = 1;
    this.setDisplayInfo(this.itemsPerPage);
  }

  containKeyword(word: any, keyword: any) {
    let res;
    if (typeof word === 'string' && typeof keyword === 'string') {
      res = word.toLowerCase().includes(keyword.toLowerCase());
    } else {
      res = word.includes(keyword);
    }

    return res;
  }
  filterValueschanges(valueEmitted: any) {
    const empty = Object.values(this.filterValues).every((element) => {
      return element === '';
    });

    //reset db
    this.getNonFilterData('filterPanel');
    if (!empty) {
      let attr: any[] = ['gender', 'ethnicity', 'job', 'status'];
      let userValues: any[] = [
        this.filterValues.gender,
        this.filterValues.ethnicity,
        this.filterValues.job,
        this.filterValues.status,
      ];
      this.filterByFilterValues(attr, userValues);
    }

    this.currentPage = 1;

    this.setDisplayInfo(this.itemsPerPage);
  }

  filterByFilterValues(valuesAttr: any[], userValues: any[]) {
    this.db_result = this.db_result.filter((record): boolean => {
      var values: any = [];
      valuesAttr.forEach((value, index) => {
        values[index] = record[value];
      });

      userValues = userValues.filter((element) => {
        return element !== '';
      });

      var containsAll =
        userValues.every((keyword) => {
          return this.containKeyword(values, keyword);
        }) && this.getYearBecameRightist(record);

      return containsAll;
    });
  }

  getNonFilterData(dataType: string) {
    if (dataType === 'searchBar') {
      this.db_result = this.original;
    } else {
      this.db_result = this.nonFilterData;
    }
  }

  setNonFilterData(dataType: string) {
    if (dataType === 'searchBar') {
      this.original = JSON.parse(JSON.stringify(this.db_result));
    } else {
      this.nonFilterData = this.db_result;
    }
  }

  getYearBecameRightist(record: any) {
    let res = true;

    if (this.filterValues.date) {
      var from = this.filterValues.date[0].getFullYear();
      var to = this.filterValues.date[1].getFullYear();

      res = from <= record.rightestYear && record.rightestYear <= to;
    }
    return res;
  }

  onOpenChange(searchSelect: string) {
    this.searchSelect = searchSelect;

    switch (searchSelect) {
      case 'Description':
        this.db_attr = ['description'];
        break;
      case 'Name':
        //An: need to add fullName attribute on db, otherwise this is a bug.
        this.db_attr = ['firstName', 'lastName', 'fullName'];
        break;
      default:
        this.db_attr = [
          'birthYear',
          'birthplace',
          'deathYear',
          'description',
          'detailJob',
          'education',
          'ethnicity',
          'events',
          'firstName',
          'gender',
          'job',
          'lastName',
          'publish',
          'memoir',
          'reference',
          'rightistYear',
          'status',
          'workplace',
        ];
    }
    this.searchBar();
  }

  //to-do: might need to test when more data is avalible
  thousandsSeperator() {
    this.db_result_thousands_seperator = this.db_result.length
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
