import { Component, OnInit, } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';



@Component({
  selector: 'app-browse-archive', 
  templateUrl: './browse-archive.component.html',
  styleUrls: ['./browse-archive.component.scss'],
})
export class BrowseArchiveComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
    //this.name = params['name'];
    });
  }
}
