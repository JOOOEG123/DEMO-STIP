import { Component, OnInit, } from '@angular/core';

import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';



@Component({
  selector: 'app-browse-archive',
  templateUrl: './browse-archive.component.html',
  styleUrls: ['./browse-archive.component.scss'],
})
export class BrowseArchiveComponent implements OnInit {

  // solution 1
  id = this.route.snapshot.paramMap.get('id') as string;
  profile =  {} as any;

  
  constructor(  private route: ActivatedRoute,private router: Router,private arch: ArchieveApiService) {}

  ngOnInit(): void {
    console.log(this.id);
    this.arch.getPersonById(this.id).subscribe(res => {
      console.log(res);
      this.profile = res;
    });
    // solution 2
    // this.route.paramMap.subscribe((params: ParamMap) => {
    //   console.log(params.get('id'));
    // });
  }
}
