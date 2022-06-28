import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
  
})

export class UploadComponent implements OnInit {

  selected?: string;
  ethnicGroup: string[] = [
    'option1',
    'option2'
  ]

  selected2?: string;
  occupation: string[] = [
    'teacher',
    'student'
  ]

  constructor() { }

  ngOnInit(): void {
  }

  url=""

  onselectFile(e){
    if(e.target.files){
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{
        this.url=event.target.result;
      }
    }
  }

}

