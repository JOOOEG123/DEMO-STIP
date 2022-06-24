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

  filterByFilterValues(valueEmitted: any) {
    let seen = new Set<any>();

    console.log("triggering")

    this.getfilterData(seen)
    this.db_result = Array.from(seen)
    this.currentPage=1
    this.setDisplayInfo(this.itemsPerPage);
  }

  getfilterData(seen: Set<any>) {
    console.log("get gender")
    var genderValue = this.filterValues.gender;
    var statusValue = this.filterValues.status;
    var groupValue = this.filterValues.group;
    var occupationValue = this.filterValues.occupation;
    var dateValue = this.filterValues.date;

    seen.add(this.db_result.filter((record) => {
      
      if (genderValue) {
        record.gender.includes(genderValue)
      }
      if (statusValue) {
        //this.getStatus(record,statusValue)
      }
      if (groupValue) {
        record.nationality.includes(groupValue)
      }
      if(occupationValue) {
        record.workplace.includes(occupationValue)
      }
      if (dateValue) {
        //record.year_rightist.includes(dateValue)
      }
  }));
  }

  getStatus(record:any, value: string) {

    if (record.year_of_death==0 && record.year_of_birth==0 && value=="Unknown") {
      return true
    }
    else if ( record.year_of_death >0 && value=="Deceased"){
      return true
    }
    else if (record.year_of_death == 0 && record.year_of_birth > 0 && value == "Alive") {
      return true
    }
    else {
      return false
    }
    
  }



  searchBar() {
    let seen = new Set<any>();

    const tokens = this.searchInput.split(" ");

    for (var token of tokens) {
      seen.add(this.filterByKeyword(tokens));
    }

  }

  filterByKeyword(token: any) {
    const attributes = [this.filterValues.date,
      "gender",
      "nationality",
      "workplace",
      "year",
    ];

    let seen = new Set<any>();
    let keys = Object.keys(this.filterValues)
    console.log(keys,"printing keys")
    for (var key of keys) {
      seen.add(this.db_result.filter((record) =>
        record[key].includes(token)
      ));
    }

    console.log(seen)
    return Array.from(seen);
  }




  filterValueschanges(filterValues: FilterTypes) {
    console.log(filterValues);
  }

  
}
