import { Component, OnInit } from '@angular/core';

interface Group {
  value: string;
  viewValue: string;
}
interface Occupation {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  drop = false;

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
  
  group: string
  year: string
  gender: string
  status: string
  occupation: string

  constructor() { 
    this.group = ""
    this.year = ""
    this.gender = "Male"
    this.status = ""
    this.occupation = ""
    console.log(typeof this.occupations[0].viewValue)
  }

  ngOnInit(): void {
  }

  updateCollapse() {
    this.drop = !this.drop;

  }

  onGroupChange() {
    console.log("group clciked")
    var x = document.getElementById("mySelect");
  }

  onYearChange() {
    console.log("year clicked")
  }

  onGenderChange() {
    console.log("gender clicked");
    //this.gender  = document.getElementById('inlineRadio1').value
    
  }

  onStatusChange() {
    //this.status= document.getElementsByName("status")[0];
    console.log(this.status)
    console.log("status clicked");
  }
  onOccupationChange() {
    this.occupation= (<HTMLInputElement>document.getElementById("inputOccupation")).value;
    console.log(this.occupation)
    console.log("occupation clicked")
  }

  submitClick() {
    this.onGroupChange()
    this.onOccupationChange()
    this.onStatusChange()
    this.onYearChange()
  }

  clearClick() {
    this.group = ""
    this.year = ""
    this.gender = "Male"
    this.status = ""
    this.occupation = ""
  }
  searchResultClick() {
    
  }

}
