import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { FilterTypes } from 'src/app/core/types/filters.type';
import { LETTERS } from '../browse/main-browse/main-browse.constant';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  //search result panel variables
  currentLetter = 'All';
  curView = 'List';
  display: any[] = [];

  searchInput = '';
  letters = LETTERS;

  //variables for search functionalities
  @Input() db_result: any[] = [];

  letter_changed: boolean = false;
  archCacheAPI: any = {};
  archSubAPI: Subscription[] = [];
  isloading!: boolean;
  original: any;
  limit: number = 50;

  onScroll() {
    this.callAPI();
  }

  searchSelect: string = 'All Fields';

  currentLanguage = this.translate.currentLang;
  sub: Subscription[] = [];

  constructor(
    private archApi: ArchieveApiService,
    private route: ActivatedRoute,
    private changeDetection: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  /**
   * An initilizer to reset varaiables to initial states.
   * @param letter letters from A to Z and "All"
   */
  initLetter(letter) {
    this.currentLetter = letter;
    this.callAPI(letter);
    this.searchSelect =
      this.currentLanguage == 'en' ? 'All Fields' : '所有信息栏';
    this.db_result = [];
  }

  ngOnInit(): void {
    this.sub.push(
      this.route.queryParams.subscribe((params) => {
        this.searchInput = params['searchTerm'] || '';
        this.initLetter('All');
      })
    );
    this.translate.onLangChange.subscribe((res) => {
      this.currentLanguage = res.lang;

      this.translate
        .get(['archive.archive_searchbar_all'])
        .subscribe((translations) => {
          this.searchSelect = translations['archive.archive_searchbar_all'];
        });
      // clean up cache, so different languages can use the cache.
      this.ngOnDestroy();
      this.initLetter('All');
    });
  }
  ngOnDestroy(): void {
    this.archSubAPI.forEach((sub) => sub.unsubscribe());
    this.archCacheAPI = {};
  }

  /**
   * This methods reacts to the change of different "letter" buttons click
   * @param letter Letters from A to Z, and "All"
   */
  lettersBtnClickOrReset(letter: string) {
    this.currentLetter = letter;
    this.limit = 50;
    this.callAPI(letter);
  }

  /**
   * This method helps to remove the initial letter of each original source documents' desciption.
   * This is just a temp fix.
   * If possible, the Database needs to clean up the data.
   */
  removeInitialForDesciption() {
    this.db_result.forEach((document) => {
      if (document.source == 'original') {
        document.description = document.description.slice(1);
      }
    });
  }

  /**
   * This methods helps to fetch data using API calls from Firebase.
   * For efficiency, fetched data would get placed into "cache"
   * @param letter Letters from A to Z, and "All"
   */
  callAPI(letter: string = this.currentLetter) {
    //clear up display
    this.display = [];
    const archKey = `person_arch_${letter}`;
    let res;
    this.isloading = true;
    if (letter) {
      this.archSubAPI.forEach((sub) => sub.unsubscribe());
      // replace api when database change. An we need to add profileId to json data.
      res = this.archApi
        .getAllArchieveList(this.currentLanguage, letter, this.limit)
        .subscribe((datas: any) => {
          this.display = datas;
          this.removeInitialForDesciption();
          this.archCacheAPI[archKey] = this.db_result;
          this.isloading = false;
          setTimeout(() => {
            document.getElementById('local_id_' + (this.limit - 51 ))?.focus();
            this.limit += 50;
            this.changeDetection.detectChanges();
          }, 500);
        });
    }
    if (res) {
      this.archSubAPI.push(res);
    }
  }

  //sort filtered searching documents base on 'Name' only.
  sortByNameAlphabet() {
    this.db_result = this.db_result.sort(function (a, b) {
      return a.lastName.localeCompare(b.lastName);
    });
  }
}
