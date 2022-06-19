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
  archCacheAPI: any = {};
  archSubAPI: Subscription[] = [];
  isloading!: boolean;

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
    this.currentPage = 1;
    this.currentLetter = letter;
    // const alpha = letter === 'All' ? '' : letter;
    this.callAPI(letter);
  }

  callAPI(l: string) {
    const alpha = l === 'All' ? '' : l;
    const archKey = `person_arch_${l}`;
    if (this.archCacheAPI[archKey]) {
      this.db_result = this.archCacheAPI[archKey];
      this.setDisplayInfo(this.itemsPerPage);
      console.log('from cache');
    } else {
      this.spinnerService.show();
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
            this.spinnerService.hide();
          })
      );
    }
  }

  ngOnDestroy(): void {
    this.archSubAPI.forEach((sub) => sub.unsubscribe());
    this.archCacheAPI = {};
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
