import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArchieveApiService } from 'src/app/core/services/archives-api-service';

@Component({
  selector: 'app-browse-archive',
  templateUrl: './browse-archive.component.html',
  styleUrls: ['./browse-archive.component.scss'],
})
export class BrowseArchiveComponent implements OnInit {

  constructor( private route: ActivatedRoute, private arch: ArchieveApiService ) { }
  // solution 1
  id = this.route.snapshot.paramMap.get('id') as string;
  profile =  {} as any;

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
