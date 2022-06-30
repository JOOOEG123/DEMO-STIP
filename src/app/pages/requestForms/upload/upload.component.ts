import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators} from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {

  public ethnic: any;
  public occupation2: any;
  //image url
  url = '';

  form = new FormGroup({
    name: new FormControl(''),
    gender: new FormControl(''),
    status: new FormControl(''),
    ethnic: new FormControl(''),
    occupation: new FormControl(''),
    rightestYear: new FormControl(''),
    birthYear: new FormControl(''),
  });

  form2 = new FormGroup({
    imageUpload: new FormControl(''),
    image: new FormControl(''),
    content: new FormControl(''),
    eventYear: new FormControl(''),
    eventContent: new FormControl(''),
    memoirTitle: new FormControl(''),
    memoirContent: new FormControl(''),
    memoirAuthor: new FormControl(''),
  });

  clear() {
    this.form.reset();
  }

  clear2() {
    this.url = '';
    this.form2.reset();
  }

  selected?: string;
  ethnicGroup: string[] = [
    'Zhuang',
    'Hui',
    'Manchu',
    'Uyghur',
    'Miao',
    'Yi',
    'Tujia',
    'Tibetan',
    'Mongol',
    'Dong',
    'Bouyei',
    'Yao',
    'Bai',
    'Joseonjok',
    'Hani',
    'Li',
    'Kazakh',
    'Dai',
    'She',
    'Lisu',
    'Dongxiang',
    'Gelao',
    'Lahu',
    'Wa',
    'Sui',
    'Nakhi',
    'Qiang',
    'Tu',
    'Mulao',
    'Xibe',
    'Kyrgyz',
    'Jingpo',
    'Daur',
    'Salar',
    'Blang',
    'Maonan',
    'Tajik',
    'Pumi',
    'Achang',
    'Nu',
    'Evenki',
    'Vietnamese',
    'Jino',
    'De ang',
    'Bonan',
    'Russian',
    'Yugur',
    'Uzbek',
    'Monba',
    'Oroqen',
    'Derung',
    'Hezhen',
    'Gaoshan',
    'Lhoba',
    'Tatars',
    'Undistinguished',
    'Naturalized Citizen',
  ];

  selected2?: string;
  occupation: string[] = [
    'Deputy',
    'Director',
    'Professor',
    'Worker',
    'Actress',
    'Agent',
    'Assistant',
    'Editor-in-Chief',
    'Assistant Lieutenant',
    'Assistant Professor',
    'Associate Professor',
    'Cadre',
    'Chairman',
    'Chief',
    'Chief Engineer',
    'Christian Priest',
    'Clerk',
    'Deputy Director',
    'Deputy Secretary',
    'Deputy Secretary General',
  ];


  public moreEvent: any[] = [{
  }];

  addEvent() {
    this.moreEvent.push({
    });
  }

  removeEvent(i: number) {
    this.moreEvent.splice(i, 1);
  }

  public moreMemoir: any[] = [{
  }];

  addMemoir(){
    this.moreMemoir.push({
    })
  }

  removeMemoir(i: number){
    this.moreMemoir.splice(i, 1);
  }



  constructor() {
  }

  ngOnInit(): void {}

  onselectFile(e) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };
    }
  }
}
