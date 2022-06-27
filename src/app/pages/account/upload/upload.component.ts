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

}

