import { Component, OnInit,ChangeDetectorRef, Input} from '@angular/core';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { FilterTypes } from 'src/app/core/types/filters.type';
import { NgxMasonryOptions } from 'ngx-masonry';

import { UpdateRowsPipe } from 'src/app/pipe/update-rows-pipe.pipe'


@Component({
  selector: 'app-main-browse',
  templateUrl: './main-browse.component.html',
  styleUrls: ['./main-browse.component.scss']
})
export class MainBrowseComponent implements OnInit {

  
    letters: any[] = ["All","A","B","C","D","E","F","G","H",
                      "I","J","K","L","M","N","O","P","Q","R",
                      "S","T","U","V","W","X", "Y", "Z"]
  
  
  
    //search result panel variables
    currentLetter: string
    curView: string
    @Input() currentPage: number
    display: any[]
    itemsPerPage: number = 50
    olditemsPerPage:number
    maxPage: number
  
  
    //variables for search functionalities 
    db_result: any[] = [];
  
    //fix later
    // filterValues: FilterTypes = {} as FilterTypes;
    keyword = ""
  
  
    
    constructor(private archApi: ArchieveApiService,private changeDetection: ChangeDetectorRef) { 
      //search result panel variables
      this.currentLetter = "All"
      this.curView = "List"
      this.itemsPerPage = 50
      this.currentPage = 1
      this.display= [];
      this.olditemsPerPage = this.itemsPerPage
      this.maxPage = 1
  
      //variables for search functionalities 
      this.db_result = [];
    
    }
  


    ngOnInit(): void {
      console.log("in ngoninit")
      this.lettersBtnClick("All")

      
    }
  


    onViewChange() {
      console.log("onViewChange clicked")
      var select_option = (<HTMLInputElement>document.getElementById("viewSelect")).value;
      var search_layout = document.getElementsByName("searchLayout");
      
      this.curView = select_option
      console.log(this.itemsPerPage)
  
  
    }
  
    itemPerPageChanged() {

      console.log("in itemPerPageChanged")

      //casting 
      this.itemsPerPage = +this.itemsPerPage
      this.setDisplayInfo(this.olditemsPerPage)
      this.olditemsPerPage = this.itemsPerPage
    }

    setDisplayInfo(startItemsPerPage:number){
      var start = (this.currentPage - 1) * startItemsPerPage;
      var end = start + this.itemsPerPage;
      this.display = this.db_result.slice(start, end)
      this.maxPage = Math.max(Math.ceil(this.db_result.length/this.itemsPerPage), 1)
    }

    pageChanged(event: any) {
      console.log("in page changed")
      this.currentPage = event.page
      this.setDisplayInfo(this.itemsPerPage)
    }
  

    lettersBtnClick(letter: string){
      this.currentPage=1
      this.currentLetter = letter
      const alpha = letter === 'All' ? '' : letter;
      this.archApi.getArchievePersonByAlphabet(alpha).subscribe((datas:any) => { 
      this.db_result = letter === 'All' ? datas.map((alphabet: any) => [].concat(alphabet.persons)).flat() : datas;
      //reset current page 
      
      this.setDisplayInfo(this.itemsPerPage)
      });
  
    }
  
  


    searchResultClick() {
      
    }

    //implement later
    filterByKeyword() {
      if(this.keyword) {
        console.log(this.keyword)
        this.db_result = this.db_result.filter(x => x.full_name.includes(this.keyword));
      }
      else{
  
      }
  
    }
  
    filterValueschanges(filterValues: FilterTypes) {
      console.log(filterValues)
    }
  }
  
