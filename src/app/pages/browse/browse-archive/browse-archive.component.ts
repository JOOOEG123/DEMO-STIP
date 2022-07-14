import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';

import { ArchieveApiService } from 'src/app/core/services/archives-api-service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { jsPDF } from 'jspdf';
import { ClipboardService } from 'ngx-clipboard';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';

@Component({
  selector: 'app-browse-archive',
  templateUrl: './browse-archive.component.html',
  styleUrls: ['./browse-archive.component.scss'],
})
export class BrowseArchiveComponent implements OnInit {
  @ViewChild('memContent') memContent!: ElementRef;
  @ViewChild('infoContent') infoContent!: ElementRef;

  [x: string]: any;
  // solution 1
  id = this.route.snapshot.paramMap.get('id') as string;
  profile = {} as any;
  url = location.href;
  isAdmin: boolean = false;
  drop: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private arch: ArchieveApiService,
    private clipboardApi: ClipboardService,
    private auth: AuthServiceService
  ) {}

  ngOnInit(): void {
    console.log(this.id);

    this.arch.getPersonById(this.id).subscribe((res) => {
      console.log(res);
      this.profile = res;
      this.replaceNewline();
    });

    this.auth.isAdmin.subscribe((x) => {
      this.isAdmin = x;
    });
    // solution 2
    // this.route.paramMap.subscribe((params: ParamMap) => {
    //   console.log(params.get('id'));
    // });
  }

  display: string[] = [];

  replaceNewline() {
    console.log(this.profile.memoirs);
    this.profile.memoirs.forEach((element: any, index: number) => {
      this.profile.memoirs[index].memoir = element.memoir.split('\\n');
    });
  }
  SavePDF(pdfName: string): void {
    let content;
    if (pdfName === 'memoirContent') {
      content = this.memContent.nativeElement;
    } else {
      content = this.infoContent.nativeElement;
    }

    console.log(content);
    let doc = new jsPDF('p', 'pt', 'a4');

    doc.html(content, {
      callback: function (doc) {
        doc.save(pdfName + '.pdf');
      },
    });

    //doc.output('dataurlnewwindow'); // just open it
  }
  copyURL() {
    this.clipboardApi.copyFromContent(this.url);
  }

  updateCollapse() {
    this.drop = !this.drop;
  }
}
