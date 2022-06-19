import { Component, OnInit } from '@angular/core';
import { FilterTypes } from 'src/app/core/types/filters.type';

interface Group {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-browse-search-filter',
  templateUrl: './browse-search-filter.component.html',
  styleUrls: ['./browse-search-filter.component.scss']
})
export class BrowseSearchFilterComponent implements OnInit {

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

  FILTERS: FilterTypes = {} as FilterTypes;
  
  drop: boolean;

  constructor() { 
    this.drop= false;
    //filer variables
    this.FILTERS["group"] = ""
    this.FILTERS["gender"] = ""
    this.FILTERS["status"] = ""
    this.FILTERS["occupation"] = ""
    this.FILTERS["date"] = new Date();

  }

  ngOnInit(): void {
  }
  updateCollapse() {
    this.drop = !this.drop;
  }


  onGroupChange() {
    console.log("group clciked")
    var index =<HTMLInputElement>document.getElementById("groupSelect");
    this.FILTERS["group"] = this.groups[parseInt(index.value) - 1]["viewValue"];
    console.log(this.FILTERS["group"])
  }


  onGenderChange() {

    var gender = document.getElementsByName("status");
    
    for (var i = 0, length = gender.length; i < length; i++) {
      if ((<HTMLInputElement>gender[i]).checked) {
        this.FILTERS["gender"] = (<HTMLInputElement>gender[i]).value;
        break;
      }
    }
    console.log(this.FILTERS["gender"]);
    console.log("gender clicked");
    
  }

  onStatusChange() {
    var status = document.getElementsByName("status");
    
    for (var i = 0, length = status.length; i < length; i++) {
      if ((<HTMLInputElement>status[i]).checked) {
        this.FILTERS["status"] = (<HTMLInputElement>status[i]).value;
        break;
      }
    }

    console.log("status clicked");
  }

  onOccupationChange() {
    this.FILTERS["occupation"]= (<HTMLInputElement>document.getElementById("inputOccupation")).value;
    console.log("occupation clicked")
  }

  //do later: add database code 
  submitClick() {
    // this.onGroupChange()
    // this.onOccupationChange()
    // this.onStatusChange()
    // this.date
  }

  //implement later
  clearClick() {
    this.FILTERS["group"] = ""
    this.FILTERS["gender"] = ""
    this.FILTERS["status"] = ""
    this.FILTERS["occupation"] = ""
    this.FILTERS["date"] = new Date();
  }

}
