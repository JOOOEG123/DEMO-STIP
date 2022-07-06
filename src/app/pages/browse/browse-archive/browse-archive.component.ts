import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-browse-archive',
  templateUrl: './browse-archive.component.html',
  styleUrls: ['./browse-archive.component.scss'],
})
export class BrowseArchiveComponent implements OnInit {
  @ViewChild('content') content!: ElementRef;

  [x: string]: any;
  // solution 1
  id = this.route.snapshot.paramMap.get('id') as string;
  profile = {} as any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private arch: ArchieveApiService
  ) {}

  ngOnInit(): void {
    console.log(this.id);
    this.arch.getPersonById(this.id).subscribe((res) => {
      console.log(res);
      this.profile = res;
    });
    // solution 2
    // this.route.paramMap.subscribe((params: ParamMap) => {
    //   console.log(params.get('id'));
    // });
  }

  public SavePDF(): void {
    let content = this.content.nativeElement;
    console.log(content);
    let doc = new jsPDF('p', 'pt', 'a4');
    let _elementHandlers = {
      '#editor': function (element: any, renderer: any) {
        return true;
      },
    };
    doc.html(content, {
      callback: function (doc) {
        doc.save('profile.pdf');
      },
    });
    //doc.output('dataurlnewwindow'); // just open it
  }
}
