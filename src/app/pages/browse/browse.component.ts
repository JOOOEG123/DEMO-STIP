import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';

interface Group {
  value: string;
  viewValue: string;
}
interface Occupation {
  value: string;
  viewValue: string;
}

interface Result {
  name: string
  occupation: string
  description: string
}

@Pipe({
  name: 'UpdateRowsPipe',
  
})
export class UpdateRowsPipe implements PipeTransform {

  transform<T>(value: T[], perRow: number): T[][] {
    let updated_db_result: T[][] = [];
    for (let i = 0; i < value.length; i += perRow) {
      updated_db_result.push(value.slice(i, i + perRow))
    }
    return updated_db_result;
  }

}
@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  

  results: Result[] = [
    {name: "Surname" , occupation: "Job" , description: "Brif Intro"},
    {name: "Surname" , occupation: "Job" , description: "Brif Intro"}
  ]


  groups: Group[] = [
    {value: '1', viewValue: 'Han Chinese'},
    {value: '2', viewValue: 'Zhuang'},
    {value: '3', viewValue: 'Hui'},
    {value: '4', viewValue: 'Manchu'},
    {value: '5', viewValue: 'Uyghur'},
    {value: '6', viewValue: 'Miao'},
    {value: '7', viewValue: 'Yi'},
    {value: '8', viewValue: 'Tujia'},
    {value: '9', viewValue: 'Tibetan'},
    {value: '10', viewValue: 'Mongol'},
    {value: '11', viewValue: 'Dong'},
    {value: '12', viewValue: 'Bouyei'},
    {value: '13', viewValue: 'Yao'},
    {value: '14', viewValue: 'Bai'},
    {value: '15', viewValue: 'Joseonjok'},
    {value: '16', viewValue: 'Hani'},
    {value: '17', viewValue: 'Li'},
    {value: '18', viewValue: 'Kazakh'},
    {value: '19', viewValue: 'Dai'},
    {value: '20', viewValue: 'She'},
    {value: '21', viewValue: 'Lisu'},
    {value: '22', viewValue: 'Dongxiang'},
    {value: '23', viewValue: 'Gelao'},
    {value: '24', viewValue: 'Lahu'},
    {value: '25', viewValue: 'Wa'},
    {value: '26', viewValue: 'Sui'},
    {value: '27', viewValue: 'Nakhi'},
    {value: '28', viewValue: 'Qiang'},
    {value: '29', viewValue: 'Tu'},
    {value: '30', viewValue: 'Mulao'},
    {value: '31', viewValue: 'Xibe'},
    {value: '32', viewValue: 'Kyrgyz'},
    {value: '33', viewValue: 'Jingpo'},
    {value: '34', viewValue: 'Daur'},
    {value: '35', viewValue: 'Salar'},
    {value: '36', viewValue: 'Blang'},
    {value: '37', viewValue: 'Maonan'},
    {value: '38', viewValue: 'Tajik'},
    {value: '39', viewValue: 'Pumi'},
    {value: '40', viewValue: 'Achang'},
    {value: '41', viewValue: 'Nu'},
    {value: '42', viewValue: 'Evenki'},
    {value: '43', viewValue: 'Vietnamese'},
    {value: '44', viewValue: 'Jino'},
    {value: '45', viewValue: 'De ang'},
    {value: '46', viewValue: 'Bonan'},
    {value: '47', viewValue: 'Russian'},
    {value: '48', viewValue: 'Yugur'},
    {value: '49', viewValue: 'Uzbek'},
    {value: '50', viewValue: 'Monba'},
    {value: '51', viewValue: 'Oroqen'},
    {value: '52', viewValue: 'Derung'},
    {value: '53', viewValue: 'Hezhen'},
    {value: '54', viewValue: 'Gaoshan'},
    {value: '55', viewValue: 'Lhoba'},
    {value: '56', viewValue: 'Tatars'},
    {value: '57', viewValue: 'Undistinguished'},
    {value: '58', viewValue: 'Naturalized Citizen'}
  ];

  occupations : Occupation[] = [
    {value: '1', viewValue: 'Testing1'},
    {value: '2', viewValue: 'Testing2'}
  ];
  
  group!: string;
  //date: string
  gender: string ="Male"
  status!: string
  occupation!: string
  currentLetter!: string 
  drop = false;
  curView: string = "List"

  date: Date = new Date();
  db_result: any[] = [];
  letters: any[] = ["All","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X", "Y", "Z"]

  
  keyword = ""


  constructor(private archApi: ArchieveApiService) { 
    // this.group = "" 
    // this.gender = "Male"
    // this.status = ""
    // this.occupation = ""
    // this.currentLetter = "s"
  
  }

  filterByKeyword() {
    if(this.keyword) {
      console.log(this.keyword)
      this.db_result = this.db_result.filter(x => x.full_name.includes(this.keyword));
    }
    else{

    }

  }

  ngOnInit(): void {
  }

  updateCollapse() {
    this.drop = !this.drop;

  }

  onGroupChange() {
    console.log("group clciked")
    var index =<HTMLInputElement>document.getElementById("groupSelect");
    this.group = this.groups[parseInt(index.value) - 1]["viewValue"];
    console.log(this.group)
  }

  onYearChange() {
    console.log("year clicked")

    // this.date = new Date(this.date);
    console.log(this.date);
    // console.log(this.date.toLocaleDateString("en-US"))
  }

  onGenderChange() {

    var gender = document.getElementsByName("status");
    
    for (var i = 0, length = gender.length; i < length; i++) {
      if ((<HTMLInputElement>gender[i]).checked) {
        this.gender = (<HTMLInputElement>gender[i]).value;
        break;
      }
    }
    console.log(this.gender);
    console.log("gender clicked");
    
  }

  onStatusChange() {
    var status = document.getElementsByName("status");
    
    for (var i = 0, length = status.length; i < length; i++) {
      if ((<HTMLInputElement>status[i]).checked) {
        this.status = (<HTMLInputElement>status[i]).value;
        break;
      }
    }

    console.log("status clicked");
  }
  onOccupationChange() {
    this.occupation= (<HTMLInputElement>document.getElementById("inputOccupation")).value;

    console.log("occupation clicked")
  }

  //do later: add database code 
  submitClick() {
    this.onGroupChange()
    this.onOccupationChange()
    this.onStatusChange()
    this.date
  }

  clearClick() {
    this.group = ""
    this.date = new Date()
    this.gender = ""
    this.status = ""
    this.occupation = ""
  }

  onPerPageChange() {
    console.log("onPerPageChange clicked")
    var select_option = (<HTMLInputElement>document.getElementById("pageSelect")).value;
    var search_layout = document.getElementsByName("searchLayout");

    for (let i = 0; i < this.results.length; i++) {
      if ((select_option =="50" && i == 49)||(select_option =="100" && i==99) ||(select_option =="1" && i==0)|| (select_option =="10" && i==9)){
        break;
      }
      //search_layout[i].setAttribute("class", "d-flex p-4 my-1 bg-primary rounded-start rounded-pill")
    }
  
  }

  onViewChange() {
    console.log("onViewChange clicked")
    var select_option = (<HTMLInputElement>document.getElementById("viewSelect")).value;
    var search_layout = document.getElementsByName("searchLayout");
    
    this.curView = select_option


  }
  lettersBtnClick(letter: string){
    this.currentLetter = letter
    console.log(letter)
    if (letter === "All") {
      this.archApi.getPublicArchieve().subscribe((data:any)  =>{
        //fix later: update the length of search result
        this.db_result = data;
      })
    }
    else {
      this.archApi.getPersonsByLetter(this.currentLetter).subscribe((data:any)  =>{
        this.db_result = data[1];
        console.log(this.db_result)
      })
    }

  }


  searchResultClick() {
    
  }

}
