import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  OnDestroy,
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
  test: string = "50"
  itemsPerPage = 50;
  searchInput = '';
  letters = LETTERS;
  maxPage = 1;
  olditemsPerPage = 50;

  //variables for search functionalities
  db_result: any[] = [];
  archCacheAPI: any = {};
  archSubAPI: Subscription[] = [];
  isloading!: boolean;

  constructor(
    private archApi: ArchieveApiService,
    private changeDetection: ChangeDetectorRef
  ) {
    
  }

  ngOnInit(): void {
    this.lettersBtnClick('A');
  }


  itemPerPageChanged() {
    //casting
    this.itemsPerPage = +this.itemsPerPage;
    this.setDisplayInfo(this.olditemsPerPage);
    this.olditemsPerPage = this.itemsPerPage;
    
    console.log("testing", this.itemsPerPage)
    console.log(this.curView)
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
    this.currentPage = 1;
    this.currentLetter = letter;
    // const alpha = letter === 'All' ? '' : letter;
    this.callAPI(letter);
  }

  callAPI(l: string) {
    //clear up display
    this.display = []

    const alpha = l === 'All' ? '' : l;
    const archKey = `person_arch_${l}`;
    if (this.archCacheAPI[archKey]) {
      this.db_result = this.archCacheAPI[archKey];
      this.setDisplayInfo(this.itemsPerPage);
      console.log('from cache');
    } else {
      this.isloading = true;
      this.archSubAPI.push(
        this.archApi
          .getArchievePersonByAlphabet(alpha)
          .subscribe((datas: any) => {
            console.log(datas);
            this.db_result =
              l === 'All'
                ? datas
                    .map((alphabet: any) => [].concat(alphabet.persons))
                    .flat()
                : datas;
            this.archCacheAPI[archKey] = this.db_result;
            //reset current page
            this.setDisplayInfo(this.itemsPerPage);
            this.isloading = false;
          })
      );
    }
  }

  ngOnDestroy(): void {
    this.archSubAPI.forEach((sub) => sub.unsubscribe());
    this.archCacheAPI = {};
  }

  searchBar() {
    const tokens = this.searchInput.split(" ");
    this.db_result = this.filterByKeyword(tokens);
    this.db_result = this.db_result.concat(this.filterByFilterValues)
  }

  filterByFilterValues(valueEmitted: any) {
    console.log("in main parent ")
    const tokens = [this.filterValues.date,
      this.filterValues.gender,
      this.filterValues.group,
      this.filterValues.occupation,
      this.filterValues.status,
      "full_name"
    ];
    console.log(Object.keys(valueEmitted))
    console.log(this.filter(Object.keys(valueEmitted)[0]),"---------------")
    return this.filterByKeyword(tokens)


  }


  filter(keyword: any) {
    // keyword = "full_name"
    let seen = new Set<any>();
    seen.add(this.db_result.filter((record) =>
    record[keyword].includes("an")));

    return seen
  
  }
  filterByKeyword(tokens: any []) {
    let seen = new Set<any>();
    console.log(this.db_result)
    for (var token of tokens) {
      seen.add(this.db_result.filter((record) =>
        record.full_name.includes(token)
      ));
      
    }
    return Array.from(seen);
  }


  filterValueschanges(filterValues: FilterTypes) {
    console.log(filterValues);
  }

  
}
